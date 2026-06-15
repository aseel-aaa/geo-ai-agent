import json
from gemini_client import generate_with_retry

GEO_CRITERIA = """
You are a GEO (Generative Engine Optimization) expert analyst.
Analyze content based on these 6 scientifically-backed criteria from Princeton/Georgia Tech research (ACM SIGKDD 2024):

1. STATISTICS & NUMBERS — Does it contain specific figures, percentages, dates? (+41% AI visibility)
2. SOURCE CITATIONS — Does it reference trusted sources, official data? (+115% AI visibility)
3. AUTHORITATIVE QUOTES — Does it include testimonials or expert statements? (+28% AI visibility)
4. COMPREHENSIVE COVERAGE — Does it answer likely user questions about this business?
5. CLEAR STRUCTURE — Does it use headings, sections, and logical flow?
6. IDENTITY CLARITY — Is it clear who they are, what they do, and who they serve?
"""

ANALYSIS_PROMPT = """
{criteria}

Analyze the following website content and return ONLY a JSON object — no explanation, no markdown, no backticks.

Language for values: {language}

Content to analyze:
---
{content}
---

Return exactly this JSON structure:
{{
  "status": "weak" or "moderate" or "strong",
  "criteria_scores": [
    {{"key": "statistics", "label": "Statistics & numbers", "met": true, "evidence": "specific evidence from the content"}},
    {{"key": "citations", "label": "Source citations", "met": false, "evidence": "what is missing or present"}},
    {{"key": "quotes", "label": "Authoritative quotes", "met": false, "evidence": "what is missing or present"}},
    {{"key": "coverage", "label": "Comprehensive coverage", "met": true, "evidence": "specific evidence from the content"}},
    {{"key": "structure", "label": "Clear structure", "met": true, "evidence": "specific evidence from the content"}},
    {{"key": "identity", "label": "Identity clarity", "met": true, "evidence": "specific evidence from the content"}}
  ],
  "strengths": ["strength 1", "strength 2"],
  "weaknesses": ["weakness 1", "weakness 2"],
  "recommendations": ["specific actionable recommendation 1", "recommendation 2", "recommendation 3"]
}}

Rules:
- status is "weak" if 0-2 criteria met, "moderate" if 3-4, "strong" if 5-6
- criteria_scores MUST contain exactly the 6 keys shown above
- each evidence value should be one short, concrete sentence
- strengths: list what the content already does well (GEO-wise)
- weaknesses: list what is missing or hurting AI visibility
- recommendations: be specific and actionable, not generic
- The value for "status" MUST be exactly one of: "weak", "moderate", "strong" in English.
- All user-facing values (label, evidence, strengths, weaknesses, recommendations) MUST be translated to {language}.
- Return ONLY the JSON, nothing else
"""

CRITERIA_KEYS = [
    ("statistics", "Statistics & numbers"),
    ("citations", "Source citations"),
    ("quotes", "Authoritative quotes"),
    ("coverage", "Comprehensive coverage"),
    ("structure", "Clear structure"),
    ("identity", "Identity clarity"),
]

def analyze_geo(content: str, language: str = "English") -> dict:
    """
    Agent 1: Analyzes scraped content against GEO criteria.

    Args:
        content: Markdown text from scraper
        language: "English" or "Arabic"

    Returns:
        {
            "status": "weak|moderate|strong",
            "strengths": [...],
            "weaknesses": [...],
            "recommendations": [...]
        }
    """
    prompt = ANALYSIS_PROMPT.format(
        criteria=GEO_CRITERIA,
        content=content[:4000],  # Limit to avoid token overflow
        language=language
    )

    response_text = generate_with_retry(prompt, is_json=True)

    # Clean response text
    text = response_text.strip()
    if text.startswith("```json"):
        text = text[7:]
    if text.startswith("```"):
        text = text[3:]
    if text.endswith("```"):
        text = text[:-3]
    text = text.strip()

    try:
        result = json.loads(text)
    except json.JSONDecodeError:
        start = text.find("{")
        end = text.rfind("}")
        if start == -1 or end == -1 or end <= start:
            raise
        result = json.loads(text[start : end + 1])

    # Validate required keys
    required_keys = ["status", "criteria_scores", "strengths", "weaknesses", "recommendations"]
    for key in required_keys:
        if key not in result:
            result[key] = [] if key != "status" else "weak"

    raw_scores = result.get("criteria_scores", [])
    scores_by_key = {
        item.get("key"): item for item in raw_scores if isinstance(item, dict)
    }
    normalized_scores = []
    for key, label in CRITERIA_KEYS:
        item = scores_by_key.get(key, {})
        normalized_scores.append(
            {
                "key": key,
                "label": item.get("label") or label,
                "met": bool(item.get("met", False)),
                "evidence": item.get("evidence") or "No clear evidence found.",
            }
        )
    result["criteria_scores"] = normalized_scores

    met_count = sum(1 for item in normalized_scores if item["met"])
    if met_count <= 2:
        result["status"] = "weak"
    elif met_count <= 4:
        result["status"] = "moderate"
    else:
        result["status"] = "strong"

    return result
