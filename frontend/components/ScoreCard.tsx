import type { CriteriaScore } from "@/lib/api";
import type { LocaleData } from "@/lib/locales";
import { AlertTriangle, CheckCircle2, XCircle } from "lucide-react";

interface Props {
  status: "weak" | "moderate" | "strong";
  criteriaScores: CriteriaScore[];
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  t: LocaleData;
}

const statusConfig = {
  weak: {
    badgeClass: "geo-status-weak",
  },
  moderate: {
    badgeClass: "geo-status-moderate",
  },
  strong: {
    badgeClass: "geo-status-strong",
  },
};

function ResultList({
  items,
  emptyText,
  tone,
}: {
  items: string[];
  emptyText: string;
  tone: "success" | "danger" | "warning";
}) {
  const toneClass = {
    success: "text-[var(--success)]",
    danger: "text-[var(--danger)]",
    warning: "text-[var(--warning)]",
  }[tone];

  return (
    <ul className="space-y-3 font-normal text-sm text-[var(--text-secondary)]">
      {items.map((item, index) => (
        <li key={index} className="leading-relaxed flex gap-2">
          <span className={`${toneClass} select-none font-bold`}>-</span>
          <span>{item}</span>
        </li>
      ))}
      {items.length === 0 && (
        <li className="italic text-[var(--text-muted)] text-center py-4">
          {emptyText}
        </li>
      )}
    </ul>
  );
}

export default function ScoreCard({
  status,
  criteriaScores,
  strengths,
  weaknesses,
  recommendations,
  t,
}: Props) {
  const cfg = statusConfig[status];
  const sc = t.scoreCard;
  const metCount = criteriaScores.filter((item) => item.met).length;

  return (
    <div className="space-y-8">
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

        <div
          className={`px-5 py-2.5 rounded font-semibold tracking-wider font-serif ${cfg.badgeClass}`}
        >
          {sc.statusLabel[status]}
        </div>
      </div>

      {criteriaScores.length > 0 && (
        <section className="geo-card-static p-6 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
            <div>
              <span className="text-xs font-mono text-[var(--text-muted)] uppercase tracking-wider">
                {sc.rubricTitle}
              </span>
              <h2 className="font-serif text-xl font-bold text-[var(--text-primary)]">
                {sc.rubricScore.replace("{count}", String(metCount))}
              </h2>
            </div>
            <span className="text-sm text-[var(--text-secondary)]">
              {sc.rubricHint}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {criteriaScores.map((item) => (
              <div
                key={item.key}
                className={`rounded-lg border p-4 space-y-2 ${
                  item.met
                    ? "border-[var(--success)] bg-[var(--success-dim)]"
                    : "border-[var(--border-default)] bg-white"
                }`}
              >
                <div className="flex items-center gap-2">
                  {item.met ? (
                    <CheckCircle2 className="w-4 h-4 text-[var(--success)] shrink-0" />
                  ) : (
                    <XCircle className="w-4 h-4 text-[var(--danger)] shrink-0" />
                  )}
                  <h3 className="text-sm font-bold text-[var(--text-primary)]">
                    {item.label}
                  </h3>
                </div>
                <p className="text-xs leading-relaxed text-[var(--text-secondary)]">
                  {item.evidence}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="geo-card-static p-6 border-t-4 border-t-[var(--success)] rounded-lg bg-[var(--bg-surface)] border border-[var(--border-default)] space-y-4">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-[var(--success)]" />
            <h3 className="font-serif text-lg font-bold text-[var(--success)]">
              {sc.strengths}
            </h3>
          </div>
          <ResultList items={strengths} emptyText={sc.noData} tone="success" />
        </div>

        <div className="geo-card-static p-6 border-t-4 border-t-[var(--danger)] rounded-lg bg-[var(--bg-surface)] border border-[var(--border-default)] space-y-4">
          <div className="flex items-center gap-2">
            <XCircle className="w-5 h-5 text-[var(--danger)]" />
            <h3 className="font-serif text-lg font-bold text-[var(--danger)]">
              {sc.weaknesses}
            </h3>
          </div>
          <ResultList items={weaknesses} emptyText={sc.noData} tone="danger" />
        </div>

        <div className="geo-card-static p-6 border-t-4 border-t-[var(--warning)] rounded-lg bg-[var(--bg-surface)] border border-[var(--border-default)] space-y-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-[var(--accent-warm)]" />
            <h3 className="font-serif text-lg font-bold text-[var(--accent-warm)]">
              {sc.recommendations}
            </h3>
          </div>
          <ResultList
            items={recommendations}
            emptyText={sc.noData}
            tone="warning"
          />
        </div>
      </div>
    </div>
  );
}
