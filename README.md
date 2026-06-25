# GEOLens - Generative Engine Optimization Analyzer

GEOLens is a hackathon MVP that helps website owners analyze and improve their content for visibility in generative AI search engines such as ChatGPT, Gemini, and Perplexity.

The project is inspired by the 2024 GEO (Generative Engine Optimization) research from Princeton, Georgia Tech, and the Allen Institute for AI. That research studies how content signals such as citations, statistics, authoritative quotes, and clear structure can improve visibility in AI-generated answers. GEOLens turns those research ideas into a practical website audit and rewriting tool.

## What It Does

- Scrapes a public webpage using the Jina AI Reader API.
- Evaluates the page against six GEO criteria:
  - Statistics and numbers
  - Source citations
  - Authoritative quotes
  - Comprehensive coverage
  - Clear structure
  - Identity clarity
- Shows a transparent audit report with strengths, weaknesses, and recommendations.
- Generates a GEO-optimized rewrite using Gemini.
- Avoids inventing fake numbers, sources, quotes, or company facts by using placeholders where real evidence is needed.
- Supports English and Arabic analysis.

## Why It Matters

Traditional SEO focuses on ranking in search results. GEO focuses on whether AI engines can understand, trust, and cite your content inside generated answers.

GEOLens is not claiming guaranteed traffic results. Instead, it operationalizes research-backed GEO techniques into an actionable tool that helps users improve the signals AI systems tend to reward.

## Tech Stack

- Frontend: Next.js, React, TypeScript, Tailwind CSS, Lucide Icons
- Backend: FastAPI, Pydantic
- AI: Google Gemini API
- Scraping: Jina AI Reader API

## Getting Started

### Prerequisites

- Python 3.10+
- Node.js 18+
- Gemini API key
- Jina AI Reader API key

### 1. Clone the Repository

```bash
git clone https://github.com/aseel-aaa/geo-ai-agent.git
cd geo-ai-agent
```

### 2. Configure Backend Environment Variables

Create a `.env` file inside the `backend` directory:

```bash
cp backend/.env.example backend/.env
```

Then fill in your API keys:

```env
GEMINI_API_KEY="your_gemini_api_key_here"
JINA_API_KEY="your_jina_api_key_here"
```

### 3. Run the Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

The API docs will be available at:

```text
http://127.0.0.1:8000/docs
```

### 4. Run the Frontend

Open a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Open:

```text
http://localhost:3000
```

By default, the frontend connects to:

```text
http://localhost:8000
```

If you need to change the backend URL, create `frontend/.env.local`:

```bash
cp frontend/.env.local.example frontend/.env.local
```

Then update:

```env
NEXT_PUBLIC_API_BASE_URL="http://localhost:8000"
```

## Project Status

This is an MVP built for a hackathon. The current version focuses on proving the core workflow:

1. Scrape website content.
2. Analyze it against GEO criteria.
3. Explain what is missing.
4. Generate a safer optimized rewrite.

Future improvements could include user accounts, saved audit history, source previews, before/after scoring, and direct CMS export.

## Notes

- Only public webpage content is analyzed.
- API keys are required for backend functionality.
- The app blocks localhost and private-network URLs for safer scraping behavior.
- CORS is currently open for local/hackathon development and should be restricted before production deployment.
