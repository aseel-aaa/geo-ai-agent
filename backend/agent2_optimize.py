from gemini_client import generate_with_retry

REWRITE_PROMPT = """
You are a GEO (Generative Engine Optimization) expert content writer.
Your job is to rewrite a website's landing page content to significantly improve its visibility to AI search engines (like Perplexity, Gemini, ChatGPT).

To do this, you must rewrite the content in {language} to address the weaknesses and recommendations identified:

Weaknesses to fix:
{weaknesses}

Recommendations to implement:
{recommendations}

Original Content to optimize:
---
{content}
---

Your optimization guidelines:
1. STATISTICS & NUMBERS: Do NOT invent fake numbers or statistics. Instead, use clear placeholders to show the user where to add them (e.g. "Trusted by over [Enter Number] business owners", "Reduces overhead by [Enter Percentage]%").
2. SOURCE CITATIONS: Do NOT hallucinate sources. Provide placeholders for references to reputable studies or official statistics (e.g., "[Insert Link to Industry Study Here]").
3. AUTHORITATIVE QUOTES: Do NOT invent fake names or quotes. Use placeholders for testimonials or expert quotes (e.g., "[Insert Customer Testimonial Here]", "- [Customer Name]").
4. IDENTITY CLARITY: Base the identity, company name, and services ONLY on the provided original content. Do not invent a new company name.
5. COMPREHENSIVE COVERAGE: Address common customer questions and structure the content with helpful headings, relying only on facts from the original content.
6. Keep the tone natural, persuasive, and professional.

Return ONLY the rewritten markdown text in {language}. Do not add any introduction, greeting, markdown code block backticks (like ```markdown), or explanations. Start directly with the content.
"""

def optimize_content(content: str, analysis: dict, language: str = "English") -> str:
    """
    Agent 2: Generates optimized content based on Agent 1's feedback.

    Args:
        content: Original markdown text
        analysis: Dictionary from analyze_geo containing strengths, weaknesses, recommendations
        language: "English" or "Arabic"

    Returns:
        String of rewritten markdown content
    """
    weaknesses_str = "\n".join([f"- {w}" for w in analysis.get("weaknesses", [])])
    recs_str = "\n".join([f"- {r}" for r in analysis.get("recommendations", [])])

    prompt = REWRITE_PROMPT.format(
        language=language,
        weaknesses=weaknesses_str,
        recommendations=recs_str,
        content=content[:4000]  # Limit to avoid token overflow
    )

    response_text = generate_with_retry(prompt, is_json=False)

    text = response_text.strip()
    # Remove markdown code block fences if Gemini wrapped it
    if text.startswith("```markdown"):
        text = text[11:]
    elif text.startswith("```"):
        text = text[3:]
    if text.endswith("```"):
        text = text[:-3]
    
    return text.strip()
