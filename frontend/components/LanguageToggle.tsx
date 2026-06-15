import type { LocaleData } from "@/lib/locales";

interface Props {
  language: string;
  onChange: (lang: string) => void;
  t: LocaleData;
}

export default function LanguageToggle({ language, onChange, t }: Props) {
  return (
    <div className="inline-flex gap-1.5 p-1 bg-[var(--bg-elevated)] border border-[var(--border-default)] rounded-md">
      {(["English", "Arabic"] as const).map((lang) => {
        const isActive = language === lang;
        return (
          <button
            key={lang}
            onClick={() => onChange(lang)}
            className={`px-4 py-1.5 rounded-sm text-xs font-semibold tracking-wide uppercase transition-all duration-200 cursor-pointer ${
              isActive
                ? "bg-[var(--accent)] text-[var(--text-inverse)] shadow-sm"
                : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-glass-hover)]"
            }`}
          >
            {lang === "Arabic" ? t.lang.ar : t.lang.en}
          </button>
        );
      })}
    </div>
  );
}
