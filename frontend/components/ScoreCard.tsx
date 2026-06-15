import type { LocaleData } from "@/lib/locales";
import { CheckCircle2, XCircle, AlertTriangle } from "lucide-react";

interface Props {
  status: "weak" | "moderate" | "strong";
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  t: LocaleData;
}

const statusConfig = {
  weak: {
    badgeClass: "geo-status-weak",
    textClass: "text-[var(--danger)]",
  },
  moderate: {
    badgeClass: "geo-status-moderate",
    textClass: "text-[var(--accent-warm)]",
  },
  strong: {
    badgeClass: "geo-status-strong",
    textClass: "text-[var(--success)]",
  },
};

export default function ScoreCard({
  status,
  strengths,
  weaknesses,
  recommendations,
  t,
}: Props) {
  const cfg = statusConfig[status];
  const sc = t.scoreCard;

  // Clean emojis from localization headers
  const cleanedStrengthsText = sc.strengths.replace(/^✅\s*/, "");
  const cleanedWeaknessesText = sc.weaknesses.replace(/^❌\s*/, "");
  const cleanedRecommendationsText = sc.recommendations.replace(/^💡\s*/, "");

  return (
    <div className="space-y-8">
      {/* ── STATUS DISPLAY ── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 bg-[var(--bg-surface)] border-2 border-[var(--text-primary)] rounded-lg shadow-[4px_4px_0px_var(--text-primary)]">
        <div className="space-y-1">
          <span className="text-xs font-mono text-[var(--text-muted)] uppercase tracking-wider">
            {sc.title}
          </span>
          <div className="text-2xl font-serif font-bold text-[var(--text-primary)]">
            {status === "weak" && sc.weakMsg}
            {status === "moderate" && sc.moderateMsg}
            {status === "strong" && sc.strongMsg}
          </div>
        </div>
        
        <div className={`px-5 py-2.5 rounded font-semibold tracking-wider font-serif ${cfg.badgeClass}`}>
          {sc.statusLabel[status]}
        </div>
      </div>

      {/* ── RESULTS GRID / TRIPLE CARD VIEW ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Strengths Card */}
        <div className="geo-card-static p-6 border-t-4 border-t-[var(--success)] rounded-lg bg-[var(--bg-surface)] border border-[var(--border-default)] space-y-4">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-[var(--success)]" />
            <h3 className="font-serif text-lg font-bold text-[var(--success)]">
              {cleanedStrengthsText}
            </h3>
          </div>
          
          <ul className="space-y-3 font-normal text-sm text-[var(--text-secondary)]">
            {strengths.map((s, i) => (
              <li key={i} className="leading-relaxed flex gap-2">
                <span className="text-[var(--success)] select-none font-bold">•</span>
                <span>{s}</span>
              </li>
            ))}
            {strengths.length === 0 && (
              <li className="italic text-[var(--text-muted)] text-center py-4">
                {sc.noData}
              </li>
            )}
          </ul>
        </div>

        {/* Weaknesses Card */}
        <div className="geo-card-static p-6 border-t-4 border-t-[var(--danger)] rounded-lg bg-[var(--bg-surface)] border border-[var(--border-default)] space-y-4">
          <div className="flex items-center gap-2">
            <XCircle className="w-5 h-5 text-[var(--danger)]" />
            <h3 className="font-serif text-lg font-bold text-[var(--danger)]">
              {cleanedWeaknessesText}
            </h3>
          </div>

          <ul className="space-y-3 font-normal text-sm text-[var(--text-secondary)]">
            {weaknesses.map((w, i) => (
              <li key={i} className="leading-relaxed flex gap-2">
                <span className="text-[var(--danger)] select-none font-bold">•</span>
                <span>{w}</span>
              </li>
            ))}
            {weaknesses.length === 0 && (
              <li className="italic text-[var(--text-muted)] text-center py-4">
                {sc.noData}
              </li>
            )}
          </ul>
        </div>

        {/* Recommendations Card */}
        <div className="geo-card-static p-6 border-t-4 border-t-[var(--warning)] rounded-lg bg-[var(--bg-surface)] border border-[var(--border-default)] space-y-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-[var(--accent-warm)]" />
            <h3 className="font-serif text-lg font-bold text-[var(--accent-warm)]">
              {cleanedRecommendationsText}
            </h3>
          </div>

          <ul className="space-y-3 font-normal text-sm text-[var(--text-secondary)]">
            {recommendations.map((r, i) => (
              <li key={i} className="leading-relaxed flex gap-2">
                <span className="text-[var(--warning)] select-none font-bold">•</span>
                <span>{r}</span>
              </li>
            ))}
            {recommendations.length === 0 && (
              <li className="italic text-[var(--text-muted)] text-center py-4">
                {sc.noData}
              </li>
            )}
          </ul>
        </div>

      </div>
    </div>
  );
}
