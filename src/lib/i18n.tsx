import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { ko } from "./translations/ko";

export type Language = "en" | "ko";

type I18nContextValue = {
  language: Language;
  toggleLanguage: () => void;
  /** Returns the translation for `key` when Korean is active and one exists, otherwise `en`. */
  t: (key: string, en: string) => string;
};

const I18nContext = createContext<I18nContextValue | null>(null);

const STORAGE_KEY = "drude-lang";

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    if (typeof window === "undefined") return "en";
    return window.localStorage.getItem(STORAGE_KEY) === "ko" ? "ko" : "en";
  });

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, language);
    document.documentElement.lang = language;
  }, [language]);

  const value = useMemo<I18nContextValue>(
    () => ({
      language,
      toggleLanguage: () => setLanguage((current) => (current === "en" ? "ko" : "en")),
      t: (key, en) => (language === "ko" ? ko[key] ?? en : en),
    }),
    [language],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}
