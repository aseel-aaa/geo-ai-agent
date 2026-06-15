import en from "../locales/en.json";
import ar from "../locales/ar.json";

export type LocaleData = typeof en;
export type Language = "English" | "Arabic";

export function getLocale(lang: string): LocaleData {
  return lang === "Arabic" ? (ar as LocaleData) : en;
}
