"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ScoreCard from "@/components/ScoreCard";
import RewritePanel from "@/components/RewritePanel";
import { AnalysisResult } from "@/lib/api";
import { getLocale } from "@/lib/locales";
import { ArrowLeft, ArrowRight } from "lucide-react";

export default function Dashboard() {
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [url, setUrl] = useState("");
  const [language, setLanguage] = useState("English");
  const router = useRouter();

  useEffect(() => {
    const stored = sessionStorage.getItem("geo_result");
    const storedUrl = sessionStorage.getItem("geo_url");
    const storedLang = sessionStorage.getItem("geo_lang");
    if (!stored) {
      router.push("/");
      return;
    }
    setResult(JSON.parse(stored));
    setUrl(storedUrl || "");
    setLanguage(storedLang || "English");
  }, [router]);

  if (!result) return null;

  const t = getLocale(language);
  const dir = language === "Arabic" ? "rtl" : "ltr";
  const isRTL = dir === "rtl";

  return (
    <main dir={dir} className="min-h-screen py-12 px-6">
      <div className="max-w-4xl mx-auto space-y-10">
        {/* ── REPORT HEADER ── */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b-2 border-[var(--text-primary)] pb-6 animate-fade-in-up">
          <div className="space-y-1.5">
            <h1
              className="text-3xl font-bold tracking-tight text-[var(--text-primary)]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {t.dashboard.title}
            </h1>
            <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)] font-mono">
              <span>{t.dashboard.analyzedUrl}</span>
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="underline text-[var(--accent)] hover:text-[var(--accent-dim)] truncate max-w-[280px] md:max-w-md transition-colors"
              >
                {url}
              </a>
            </div>
          </div>

          <button
            onClick={() => router.push("/")}
            className="geo-btn-ghost px-5 py-2.5 text-sm font-semibold flex items-center gap-2"
          >
            {isRTL ? (
              <ArrowRight className="w-4 h-4" />
            ) : (
              <ArrowLeft className="w-4 h-4" />
            )}
            <span>{t.dashboard.newAnalysis.replace(/[←→]\s*/g, "").trim()}</span>
          </button>
        </div>

        {/* ── REPORT BODY ── */}
        <div className="grid grid-cols-1 gap-10">
          <div className="animate-fade-in-up stagger-1">
            <ScoreCard
              status={result.status}
              strengths={result.strengths}
              weaknesses={result.weaknesses}
              recommendations={result.recommendations}
              t={t}
            />
          </div>

          <div className="animate-fade-in-up stagger-3">
            <RewritePanel content={result.rewritten_content} t={t} />
          </div>
        </div>
      </div>
    </main>
  );
}
