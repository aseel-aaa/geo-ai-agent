"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import LanguageToggle from "@/components/LanguageToggle";
import { analyzeWebsite } from "@/lib/api";
import { getLocale } from "@/lib/locales";
import {
  Search,
  Bot,
  Sparkles,
  Download,
  ArrowRight,
  ChevronDown,
  Loader2,
  AlertCircle,
  RefreshCw,
} from "lucide-react";

function FAQItem({
  question,
  answer,
  index,
}: {
  question: string;
  answer: string;
  index: number;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div
      onClick={() => setOpen(!open)}
      className={`cursor-pointer p-6 transition-all duration-300 border rounded-lg bg-[var(--bg-surface)] animate-fade-in-up ${
        open
          ? "border-[var(--accent)] shadow-[4px_4px_0px_var(--accent)]"
          : "border-[var(--border-default)] hover:border-[var(--text-primary)] shadow-[3px_3px_0px_var(--text-primary)]"
      }`}
      style={{ animationDelay: `${index * 100 + 200}ms` }}
    >
      <div className="flex justify-between items-center gap-4">
        <h3 className="font-semibold text-base text-[var(--text-primary)]">
          {question}
        </h3>
        <ChevronDown
          className={`w-5 h-5 shrink-0 transition-all duration-300 ${
            open
              ? "rotate-180 text-[var(--accent)]"
              : "text-[var(--text-muted)]"
          }`}
        />
      </div>
      {open && (
        <p className="geo-faq-answer mt-4 text-sm leading-relaxed text-[var(--text-secondary)] border-t border-[var(--border-subtle)] pt-4">
          {answer}
        </p>
      )}
    </div>
  );
}

export default function Home() {
  const [url, setUrl] = useState("");
  const [language, setLanguage] = useState("English");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const t = getLocale(language);
  const dir = language === "Arabic" ? "rtl" : "ltr";

  const handleAnalyze = async () => {
    if (!url) return;
    setLoading(true);
    setError("");
    try {
      const result = await analyzeWebsite(url, language);
      sessionStorage.setItem("geo_result", JSON.stringify(result));
      sessionStorage.setItem("geo_url", url);
      sessionStorage.setItem("geo_lang", language);
      router.push("/dashboard");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : t.error);
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    { value: "527%", label: t.stats.traffic },
    { value: "60%+", label: t.stats.searches },
    { value: "115%", label: t.stats.citations },
    { value: "6", label: t.stats.criteria },
  ];

  const features = [
    {
      icon: <Search className="w-6 h-6 text-[var(--accent)]" />,
      title: t.features.scrape.title,
      desc: t.features.scrape.desc,
    },
    {
      icon: <Bot className="w-6 h-6 text-[var(--accent)]" />,
      title: t.features.agent1.title,
      desc: t.features.agent1.desc,
    },
    {
      icon: <Sparkles className="w-6 h-6 text-[var(--accent)]" />,
      title: t.features.agent2.title,
      desc: t.features.agent2.desc,
    },
    {
      icon: <Download className="w-6 h-6 text-[var(--accent)]" />,
      title: t.features.export.title,
      desc: t.features.export.desc,
    },
  ];

  const faqs = [
    { q: t.faq.q1, a: t.faq.a1 },
    { q: t.faq.q2, a: t.faq.a2 },
    { q: t.faq.q3, a: t.faq.a3 },
    { q: t.faq.q4, a: t.faq.a4 },
  ];

  return (
    <main dir={dir} className="min-h-screen flex flex-col justify-between">
      {/* ── NAVIGATION ── */}
      <nav className="geo-nav sticky top-0 z-50 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2.5">
          <span
            className="text-2xl font-bold tracking-tight text-[var(--accent)]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            GEOLens
          </span>
          <span className="text-[10px] font-mono uppercase bg-[var(--accent-glow)] px-2 py-0.5 rounded border border-[var(--border-accent)] text-[var(--accent)] tracking-widest">
            v1.0
          </span>
        </div>
        <LanguageToggle language={language} onChange={setLanguage} t={t} />
      </nav>

      {/* ── CORE WRAPPER ── */}
      <div className="max-w-5xl mx-auto px-6 py-16 md:py-24 space-y-24 flex-1 w-full relative z-10">
        {/* ── HERO ── */}
        <section className="flex flex-col items-center text-center space-y-8">
          <div className="animate-badge-pop">
            <div className="geo-badge flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t.hero.badge}</span>
            </div>
          </div>

          <h1
            className="geo-section-title text-4xl md:text-[3.5rem] font-bold tracking-tight text-[var(--text-primary)] max-w-3xl leading-[1.12] animate-fade-in-up stagger-1"
          >
            {t.hero.title}
          </h1>

          <div className="geo-accent-line stagger-2" />

          <p className="text-lg md:text-xl text-[var(--text-secondary)] max-w-2xl font-normal leading-relaxed animate-fade-in-up stagger-3">
            {t.hero.subtitle}
          </p>

          {/* URL Entry */}
          <div className="w-full max-w-2xl space-y-4 pt-4 animate-fade-in-up stagger-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                id="url-input"
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder={t.placeholder}
                onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
                className="geo-input flex-1 px-5 py-4 text-base"
              />
              <button
                id="analyze-btn"
                onClick={handleAnalyze}
                disabled={loading || !url}
                className="geo-btn-primary px-8 py-4 font-semibold text-base flex items-center justify-center gap-2 min-w-[200px]"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>{t.analyzingBtn}</span>
                  </>
                ) : (
                  <>
                    <span>{t.analyzeBtn}</span>
                    <ArrowRight
                      className={`geo-arrow w-4 h-4 transition-transform ${
                        dir === "rtl" ? "rotate-180" : ""
                      }`}
                    />
                  </>
                )}
              </button>
            </div>

            {error && (
              <div className="w-full bg-[var(--bg-surface)] border-l-4 border-[var(--danger)] border border-[var(--border-default)] rounded-lg p-5 flex items-start gap-4 shadow-[3px_3px_0px_var(--danger)] animate-scale-in">
                <AlertCircle className="w-6 h-6 text-[var(--danger)] shrink-0 mt-0.5" />
                <div className="flex-1 space-y-2">
                  <p className="text-sm font-semibold text-[var(--danger)]">
                    {t.errorTitle}
                  </p>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                    {error}
                  </p>
                </div>
                <button
                  onClick={handleAnalyze}
                  disabled={loading || !url}
                  className="geo-btn-ghost px-4 py-2 text-xs font-semibold flex items-center gap-1.5 shrink-0"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>{t.retry}</span>
                </button>
              </div>
            )}

            <p className="text-xs text-[var(--text-muted)]">
              {t.hero.hint}
            </p>
          </div>
        </section>

        {/* ── STATS ── */}
        <section>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {stats.map((s, i) => (
              <div
                key={i}
                className="geo-card p-6 text-center flex flex-col justify-center items-center animate-count-up"
                style={{ animationDelay: `${i * 120 + 100}ms` }}
              >
                <div className="geo-stat-value mb-1">{s.value}</div>
                <div className="text-[11px] tracking-widest uppercase text-[var(--text-secondary)] font-medium">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── HOW IT WORKS ── */}
        <section className="space-y-12">
          <div className="text-center space-y-3">
            <h2 className="geo-section-title text-3xl font-bold animate-fade-in-up">
              {t.featuresSection.title}
            </h2>
            <div className="geo-accent-line mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
            {features.map((f, i) => (
              <div
                key={i}
                className="geo-card p-8 flex gap-5 items-start animate-fade-in-up"
                style={{ animationDelay: `${i * 150 + 100}ms` }}
              >
                <div className="geo-icon-box p-3.5 bg-[var(--bg-elevated)] rounded-md border border-[var(--border-default)] select-none">
                  {f.icon}
                </div>
                <div className="space-y-2 flex-1">
                  <h3
                    className="text-lg font-bold text-[var(--text-primary)]"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {f.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
                    {f.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className="space-y-12 max-w-3xl mx-auto">
          <div className="text-center space-y-3">
            <h2 className="geo-section-title text-3xl font-bold animate-fade-in-up">
              {t.faqSection.title}
            </h2>
            <div className="geo-accent-line mx-auto" />
          </div>

          <div className="space-y-4">
            {faqs.map((f, i) => (
              <FAQItem key={i} question={f.q} answer={f.a} index={i} />
            ))}
          </div>
        </section>
      </div>

      {/* ── FOOTER ── */}
      <footer className="w-full py-8 text-center text-xs font-mono border-t border-[var(--border-subtle)] text-[var(--text-muted)] bg-[var(--bg-surface)] relative z-10">
        <div className="max-w-5xl mx-auto px-6">{t.footer}</div>
      </footer>
    </main>
  );
}
