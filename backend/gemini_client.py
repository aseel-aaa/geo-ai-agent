from google import genai
from google.genai import types
import os
import time
from dotenv import load_dotenv

load_dotenv()
api_key = os.environ.get("GEMINI_API_KEY")
client = genai.Client(api_key=api_key)

def generate_with_retry(prompt: str, is_json: bool = False, retries: int = 3) -> str:
    """Helper function to run generate_content with retries on network transient errors and model fallback."""
    models_to_try = ['gemini-2.5-flash', 'gemini-1.5-flash', 'gemini-2.0-flash']
    last_exception = None
    for attempt in range(retries):
        model_name = models_to_try[attempt % len(models_to_try)]
        try:
            config = types.GenerateContentConfig(
                response_mime_type="application/json" if is_json else None
            )
            response = client.models.generate_content(
                model=model_name,
                contents=prompt,
                config=config
            )
            return response.text
        except Exception as e:
            last_exception = e
            print(f"Gemini API attempt {attempt + 1} using model {model_name} failed: {e}. Retrying in 2 seconds...")
            if attempt < retries - 1:
                time.sleep(2)
    
    if last_exception:
        raise last_exception

