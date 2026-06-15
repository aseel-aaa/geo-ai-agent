from agent1_analysis import analyze_geo
from agent2_optimize import optimize_content

def run_geo_pipeline(content: str, language: str = "English") -> dict:
    """
    Unified pipeline running both Agent 1 (Analysis) and Agent 2 (Optimization).

    Args:
        content: Scraped content
        language: "English" or "Arabic"

    Returns:
        Unified JSON contract
    """
    # 1. Run Analysis (Agent 1)
    analysis = analyze_geo(content, language)
    
    # 2. Run Optimization (Agent 2)
    rewritten = optimize_content(content, analysis, language)
    
    # 3. Compile output
    return {
        "status": analysis.get("status", "weak"),
        "criteria_scores": analysis.get("criteria_scores", []),
        "strengths": analysis.get("strengths", []),
        "weaknesses": analysis.get("weaknesses", []),
        "recommendations": analysis.get("recommendations", []),
        "rewritten_content": rewritten
    }
