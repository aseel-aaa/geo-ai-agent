# GEOLens — Generative Engine Optimization (GEO) Analyzer

GEOLens is a professional web application designed to analyze, score, and optimize website content for visibility in generative AI search engines (such as Google Gemini, Perplexity, and ChatGPT Search). 

The analysis is based on the **GEO (Generative Engine Optimization)** framework published by researchers from Princeton, Georgia Tech, and Allen Institute for AI in 2024.

---

## Key Features

* **Instant Scraper**: Scrapes and cleans web pages using the Jina AI Reader API.
* **GEO Evaluation**: Analyzes content against GEO criteria (authority, formatting, optimization, citations, and density).
* **Detailed Audit Report**: Identifies content strengths, weaknesses, and concrete recommendations for enhancement.
* **AI Content Rewriter**: Generates a rewritten, GEO-optimized version of the text ready to deploy.
* **Bilingual Support**: Full support for English and Arabic analysis.
* **Premium Typography**: Custom elegant fonts (Thmanyah for Arabic, Geist for English).

---

## Technology Stack

* **Frontend**: Next.js 16 (React 19), Tailwind CSS, Lucide Icons.
* **Backend**: FastAPI (Python 3), SQLite (Database for saving audits).
* **APIs**:
  * **Google Gemini API**: Drives the dual-agent analysis and optimization pipeline.
  * **Jina AI Reader API**: Handles robust web scraping and markdown conversion.

---

## Getting Started

### 1. Prerequisites
Ensure you have the following installed on your system:
* [Python 3.10+](https://www.python.org/downloads/)
* [Node.js 18+](https://nodejs.org/)

### 2. Clone the Repository
```bash
git clone <your-repo-url>
cd GEOLens
```

### 3. Setup Environment Variables
You **must** configure the API keys for the backend to function.
Create a `.env` file inside the `backend/` directory:

```env
# backend/.env
GEMINI_API_KEY="your_gemini_api_key_here"
JINA_API_KEY="your_jina_api_key_here"
```

>  **How to get keys:**
> * Get your **Gemini API Key** from [Google AI Studio](https://aistudio.google.com/).
> * Get your **Jina API Key** from [Jina AI Reader](https://jina.ai/).

---

##  Run the Application

### Backend (FastAPI)
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Activate the virtual environment (Windows):
   ```bash
   .\venv\Scripts\activate
   ```
3. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Start the backend server:
   ```bash
   uvicorn main:app --reload --host 127.0.0.1 --port 8000
   ```
   * The API docs will be available at [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs).

---

### Frontend (Next.js)
1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install npm dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
   * Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.
