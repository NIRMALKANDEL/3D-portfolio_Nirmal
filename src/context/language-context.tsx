"use client";

import { createContext, useContext, type ReactNode } from "react";
import { translations, type Translations } from "@/data/translations";

type LanguageContextValue = {
  t: Translations;
};

const value: LanguageContextValue = { t: translations };

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}
