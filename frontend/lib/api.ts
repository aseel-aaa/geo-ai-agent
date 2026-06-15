export interface AnalysisResult {
  status: "weak" | "moderate" | "strong";
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  rewritten_content: string;
  word_count: number;
}

export async function analyzeWebsite(
  url: string,
  language: string
): Promise<AnalysisResult> {
  const response = await fetch("http://localhost:8000/api/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url, language }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Analysis failed");
  }

  return response.json();
}
