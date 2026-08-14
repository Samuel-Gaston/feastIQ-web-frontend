"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import en from "../i18n/en/common.json";
import fr from "../i18n/fr/common.json";

const translations = { en, fr };
type Lang = "en" | "fr";

interface LanguageContextType {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: typeof en;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const savedLang = localStorage.getItem("app_lang") as Lang;
    if (savedLang === "en" || savedLang === "fr") {
      setLangState(savedLang);
    }
    setMounted(true);
  }, []);

  const setLang = (newLang: Lang) => {
    setLangState(newLang);
    localStorage.setItem("app_lang", newLang);
  };

  const t = translations[lang] || en;

  return (
    <LanguageContext.Provider value={{ lang, setLang, t}}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}