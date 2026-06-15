import os
import requests
from dotenv import load_dotenv

load_dotenv()

JINA_BASE = "https://r.jina.ai/"

def scrape_url(url: str) -> dict:
    """
    Scrapes a URL via Jina Reader and returns clean Markdown.

    Returns:
        {
            "success": bool,
            "content": str,
            "word_count": int,
            "message": str
        }
    """
    try:
        # Ensure URL has a scheme
        if not url.startswith("http://") and not url.startswith("https://"):
            url = "https://" + url

        jina_url = f"{JINA_BASE}{url}"

        headers = {
            "Authorization": f"Bearer {os.getenv('JINA_API_KEY')}",
            "Accept": "text/plain",
            "X-Wait-For-Selector": "main, article, .content",  # للـ JS-heavy
            "X-Remove-Selector": "nav, footer, header, .sidebar",  # يشيل الـ nav
            "X-No-Cache": "true",  # أحدث نتائج دايماً
            "X-Timeout": "15",
            "User-Agent": "GEOLens/1.0"
        }

        response = requests.get(jina_url, headers=headers, timeout=30)
        response.raise_for_status()

        content = response.text.strip()
        word_count = len(content.split())

        if word_count < 100:
            return {
                "success": False,
                "content": content,
                "word_count": word_count,
                "message": "Couldn't read this page fully, try a different URL"
            }

        return {
            "success": True,
            "content": content,
            "word_count": word_count,
            "message": "Scraped successfully"
        }

    except requests.exceptions.Timeout:
        return {"success": False, "content": "", "word_count": 0,
                "message": "Connection timed out, try again"}
    except requests.exceptions.RequestException as e:
        return {"success": False, "content": "", "word_count": 0,
                "message": f"Could not reach the website: {str(e)}"}



