export interface AnalysisResult {
  status: "weak" | "moderate" | "strong";
  criteria_scores: CriteriaScore[];
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  rewritten_content: string;
  total_analyses: number;
  word_count: number;
}

export interface CriteriaScore {
  key: string;
  label: string;
  met: boolean;
  evidence: string;
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ||
  "http://localhost:8000";

export async function analyzeWebsite(
  url: string,
  language: string
): Promise<AnalysisResult> {
  const response = await fetch(`${API_BASE_URL}/api/analyze`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url, language }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);
    const detail = error?.detail;
    const message = Array.isArray(detail)
      ? detail.map((item) => item.msg).join(". ")
      : detail || "Analysis failed";
    throw new Error(message);
  }

  return response.json();
}
