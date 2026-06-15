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
  "strengths": ["strength 1", "strength 2"],
  "weaknesses": ["weakness 1", "weakness 2"],
  "recommendations": ["specific actionable recommendation 1", "recommendation 2", "recommendation 3"]
}}

Rules:
- status is "weak" if 0-2 criteria met, "moderate" if 3-4, "strong" if 5-6
- strengths: list what the content already does well (GEO-wise)
- weaknesses: list what is missing or hurting AI visibility
- recommendations: be specific and actionable, not generic
- The value for "status" MUST be exactly one of: "weak", "moderate", "strong" in English.
- All other values (strengths, weaknesses, recommendations) MUST be translated to {language}.
- Return ONLY the JSON, nothing else
"""

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

    result = json.loads(text)

    # Validate required keys
    required_keys = ["status", "strengths", "weaknesses", "recommendations"]
    for key in required_keys:
        if key not in result:
            result[key] = [] if key != "status" else "weak"

    return result
