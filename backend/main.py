from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, field_validator
import os
from ipaddress import ip_address
from urllib.parse import urlparse
from dotenv import load_dotenv

from scraper import scrape_url
from agents import run_geo_pipeline
from database import init_db, save_analysis, get_total_analyses_count

load_dotenv()

# Initialize FastAPI
app = FastAPI(
    title="GEOLens API",
    description="Analyze and optimize website content for AI engine visibility using GEO criteria (Princeton 2024).",
    version="1.0.0",
)

# Allow all origins for hackathon demo (tighten in production)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize the database on startup
@app.on_event("startup")
def startup_event():
    init_db()


# -- Request / Response models -------------------------------------------

class AnalyzeRequest(BaseModel):
    url: str
    language: str = "en"  # "en" or "ar"

    @field_validator("url")
    @classmethod
    def validate_url(cls, value: str) -> str:
        value = value.strip()
        if not value:
            raise ValueError("URL is required")
        if len(value) > 2048:
            raise ValueError("URL is too long")
        if "://" not in value:
            value = f"https://{value}"

        parsed = urlparse(value)
        if parsed.scheme not in {"http", "https"}:
            raise ValueError("Only http and https URLs are supported")
        if not parsed.netloc:
            raise ValueError("Enter a valid website URL")
        if parsed.username or parsed.password:
            raise ValueError("URLs with usernames or passwords are not supported")

        host = (parsed.hostname or "").strip().lower()
        if host in {"localhost", "127.0.0.1", "::1"} or host.endswith(".local"):
            raise ValueError("Local or private network URLs are not supported")

        try:
            parsed_ip = ip_address(host)
            if (
                parsed_ip.is_private
                or parsed_ip.is_loopback
                or parsed_ip.is_link_local
                or parsed_ip.is_multicast
                or parsed_ip.is_reserved
            ):
                raise ValueError("Local or private network URLs are not supported")
        except ValueError as exc:
            if "Local or private" in str(exc):
                raise

        return value

    @field_validator("language")
    @classmethod
    def validate_language(cls, value: str) -> str:
        normalized = value.strip().lower()
        if normalized not in {"en", "english", "ar", "arabic"}:
            raise ValueError("Language must be English or Arabic")
        return value


class CriteriaScore(BaseModel):
    key: str
    label: str
    met: bool
    evidence: str


class AnalyzeResponse(BaseModel):
    status: str
    criteria_scores: list[CriteriaScore]
    strengths: list[str]
    weaknesses: list[str]
    recommendations: list[str]
    rewritten_content: str
    total_analyses: int
    word_count: int


# -- Endpoints -----------------------------------------------------------

@app.get("/")
def root():
    return {
        "message": "GEOLens API is running",
        "total_analyses": get_total_analyses_count(),
        "docs": "/docs"
    }


@app.post("/api/analyze", response_model=AnalyzeResponse)
def analyze(request: AnalyzeRequest):
    """
    Main endpoint: Scrapes a URL, analyzes it against GEO criteria,
    and returns optimized content.
    """
    # Map language code to full language name for prompts
    language_map = {"ar": "Arabic", "en": "English", "arabic": "Arabic", "english": "English"}
    language = language_map.get(request.language.lower(), "English")

    # 1. Scrape
    scraped = scrape_url(request.url)
    if not scraped["success"]:
        raise HTTPException(status_code=422, detail=scraped["message"])

    # 2. Run GEO pipeline (Agent 1 + Agent 2)
    try:
        result = run_geo_pipeline(scraped["content"], language=language)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI analysis failed: {str(e)}")

    # 3. Save to database
    save_analysis(request.url, request.language, result["status"])

    # 4. Return response
    return AnalyzeResponse(
        status=result["status"],
        criteria_scores=result["criteria_scores"],
        strengths=result["strengths"],
        weaknesses=result["weaknesses"],
        recommendations=result["recommendations"],
        rewritten_content=result["rewritten_content"],
        total_analyses=get_total_analyses_count(),
        word_count=scraped["word_count"],
    )


@app.get("/api/stats")
def stats():
    """Returns total number of analyses — great for showing judges."""
    return {"total_analyses": get_total_analyses_count()}
