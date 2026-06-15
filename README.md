# GEOLens - Generative Engine Optimization Analyzer

GEOLens is a web app for analyzing, scoring, and improving website content for visibility in generative AI search engines such as Gemini, Perplexity, and ChatGPT Search.

The app follows a GEO-style evaluation workflow: scrape a public page, check it against six content criteria, explain the score, and generate a safer rewritten draft with placeholders for facts the user should supply.

## Key Features

- Public webpage scraping through the Jina AI Reader API.
- GEO analysis across six explicit criteria: statistics, citations, quotes, coverage, structure, and identity clarity.
- Transparent rubric display showing which criteria passed and the evidence behind each one.
- AI content rewrite that avoids inventing fake numbers, sources, quotes, or company facts.
- English and Arabic UI support.
- SQLite-backed analysis counter for demos and lightweight usage tracking.

## Technology Stack

- Frontend: Next.js, React, TypeScript, Tailwind CSS, Lucide Icons.
- Backend: FastAPI, Pydantic, SQLite.
- APIs: Google Gemini API and Jina AI Reader API.

## Getting Started

### Prerequisites

- Python 3.10+
- Node.js 18+

### Backend Setup

Clone the repository:

```bash
git clone https://github.com/aseel-aaa/geo-ai-agent
cd geo-ai-agent
```

Create a backend environment file:

```bash
cp backend/.env.example backend/.env
```

Fill in:

```env
GEMINI_API_KEY="your_gemini_api_key_here"
JINA_API_KEY="your_jina_api_key_here"
```

Install and run:

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

API docs will be available at `http://127.0.0.1:8000/docs`.

### Frontend Setup

Create a frontend environment file:

```bash
cp frontend/.env.local.example frontend/.env.local
```

For local development, keep:

```env
NEXT_PUBLIC_API_BASE_URL="http://localhost:8000"
```

Install and run:

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:3000`.

## Production Notes

- Set `NEXT_PUBLIC_API_BASE_URL` to your deployed backend URL.
- Restrict CORS origins in `backend/main.py` before public deployment.
- Keep API keys server-side only. Do not expose Gemini or Jina keys to the frontend.
- GEOLens rejects local/private network URLs to reduce SSRF-style scraping risk.
