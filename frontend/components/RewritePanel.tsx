"use client";
import { useState } from "react";
import type { LocaleData } from "@/lib/locales";
import { Sparkles, Copy, FileText, Check } from "lucide-react";

interface Props {
  content: string;
  t: LocaleData;
}

export default function RewritePanel({ content, t }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExport = () => {
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "geolens-optimized-content.txt";
    a.click();
  };

  // Clean emojis from localized title
  const cleanedTitle = t.rewritePanel.title.replace(/^✨\s*/, "");

  return (
    <div className="bg-[var(--bg-surface)] border-2 border-[var(--text-primary)] rounded-lg shadow-[4px_4px_0px_var(--text-primary)] overflow-hidden">
      
      {/* ── HEADER PANEL ACTIONS ── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-5 border-b-2 border-[var(--text-primary)] bg-[var(--bg-elevated)]">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-[var(--accent)]" />
          <h3 className="font-serif text-lg font-bold text-[var(--text-primary)]">
            {cleanedTitle}
          </h3>
        </div>
        
        <div className="flex gap-2 w-full sm:w-auto">
          <button
            onClick={handleCopy}
            className="geo-btn-primary flex-1 sm:flex-none px-5 py-2.5 text-xs transition-all tracking-wider uppercase flex items-center justify-center gap-2"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>{t.rewritePanel.copied}</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>{t.rewritePanel.copy}</span>
              </>
            )}
          </button>
          
          <button
            onClick={handleExport}
            className="geo-btn-ghost flex-1 sm:flex-none px-5 py-2.5 text-xs transition-all tracking-wider uppercase flex items-center justify-center gap-2"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>{t.rewritePanel.export}</span>
          </button>
        </div>
      </div>

      {/* ── MANUSCRIPT VIEWPORT ── */}
      <div className="p-8 bg-white relative">
        {/* Subtle page lines style decoration to look like paper page */}
        <div className="absolute left-6 top-0 bottom-0 w-[1px] bg-red-100 select-none pointer-events-none" />
        
        <div className="geo-content-scroll font-serif text-base text-[var(--text-primary)] leading-[1.8] whitespace-pre-wrap pl-6">
          {content}
        </div>
      </div>
    </div>
  );
}
