"use client";

import { useState } from "react";
import Link from "next/link";
import { FaSun, FaMoon, FaChevronDown } from "react-icons/fa";
import { GB, FR } from "country-flag-icons/react/3x2";
import { useLanguage } from "@/app/context/LanguageContext";
import { useTheme } from "@/app/context/ThemeContext";
import Logo from "@/app/components/Logo";

export default function PrivacyPage() {
  const { t, lang, setLang } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const [langOpen, setLangOpen] = useState(false);

  return (
    <div 
      style={{ fontFamily: "'Times New Roman', Times, serif" }} 
      className="min-h-screen bg-white dark:bg-[#1A1310] text-[#1A1310] dark:text-white transition-colors duration-300 flex flex-col justify-between"
    >
      <header className="w-full px-6 py-4 flex items-center justify-between max-w-5xl mx-auto">
        <Link href="/">
          <Logo size={36} />
        </Link>

        <div className="flex items-center gap-2.5">
          {/* Theme Toggle */}
          <button 
            onClick={toggleTheme} 
            className="p-2 rounded-lg border border-orange-100 dark:border-orange-900/30 bg-orange-50/60 dark:bg-white/5 hover:bg-orange-100 dark:hover:bg-white/15 transition-all" 
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <FaSun size={14} className="text-amber-400" /> : <FaMoon size={14} className="text-orange-600" />}
          </button>

          {/* Language Selector */}
          <div className="relative">
            <button 
              onClick={() => setLangOpen(!langOpen)} 
              className="flex items-center gap-2 px-3 py-2 rounded-lg border border-orange-100 dark:border-orange-900/30 bg-orange-50/60 dark:bg-white/5 hover:bg-orange-100 dark:hover:bg-white/15 transition-all text-[13px]"
            >
              {lang === "en" ? <GB style={{ width: 18, height: 13 }} /> : <FR style={{ width: 18, height: 13 }} />}
              <span className="font-semibold text-gray-700 dark:text-white">{lang.toUpperCase()}</span>
              <FaChevronDown className={`text-gray-400 transition-transform text-[10px] ${langOpen ? "rotate-180" : ""}`} />
            </button>
            {langOpen && (
              <div className="absolute right-0 top-full mt-2 w-40 bg-white dark:bg-[#241C17] border border-orange-100 dark:border-orange-900/30 rounded-xl shadow-lg overflow-hidden z-50">
                <button 
                  onClick={() => { setLang("en"); setLangOpen(false); }} 
                  className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-orange-50 dark:hover:bg-white/5 transition-colors text-left text-sm ${lang === "en" ? "text-orange-600 font-semibold bg-orange-50/70 dark:bg-white/5" : "text-gray-700 dark:text-white/80"}`}
                >
                  <GB style={{ width: 18, height: 13 }} /> English
                </button>
                <button 
                  onClick={() => { setLang("fr"); setLangOpen(false); }} 
                  className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-orange-50 dark:hover:bg-white/5 transition-colors text-left text-sm ${lang === "fr" ? "text-orange-600 font-semibold bg-orange-50/70 dark:bg-white/5" : "text-gray-700 dark:text-white/80"}`}
                >
                  <FR style={{ width: 18, height: 13 }} /> Français
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto px-6 py-12 space-y-8">
        <div className="border-b border-orange-100 dark:border-orange-900/30 pb-6">
          <h1 className="text-3xl sm:text-4xl font-black mb-2">
            {t.privacy?.title || "Privacy Policy"}
          </h1>
          <p className="text-sm text-gray-500 dark:text-white/60">
            {t.privacy?.lastUpdated || "Last updated: August 2026"}
          </p>
        </div>

        <div className="space-y-6 text-sm sm:text-base leading-relaxed text-gray-700 dark:text-white/80">
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-[#1A1310] dark:text-white">
              {t.privacy?.sec1Title || "1. Introduction"}
            </h2>
            <p>{t.privacy?.sec1Text || "At FeastIQ, we take the protection..."}</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-[#1A1310] dark:text-white">
              {t.privacy?.sec2Title || "2. Information We Collect"}
            </h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>{t.privacy?.accInfoTitle || "Account Information:"}</strong> {t.privacy?.accInfoText || "Your name, email address..."}
              </li>
              <li>
                <strong>{t.privacy?.orderInfoTitle || "Order and Preference Data:"}</strong> {t.privacy?.orderInfoText || "Your order history..."}
              </li>
              <li>
                <strong>{t.privacy?.mediaInfoTitle || "Uploaded Media:"}</strong> {t.privacy?.mediaInfoText || "Food photos submitted..."}
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-[#1A1310] dark:text-white">
              {t.privacy?.sec3Title || "3. How We Use Your Data"}
            </h2>
            <p>{t.privacy?.sec3Text || "Your data is processed to operate..."}</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-[#1A1310] dark:text-white">
              {t.privacy?.sec4Title || "4. Third-Party Data Sharing"}
            </h2>
            <p>{t.privacy?.sec4Text || "We do not sell your personal data..."}</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-[#1A1310] dark:text-white">
              {t.privacy?.sec5Title || "5. Data Security"}
            </h2>
            <p>{t.privacy?.sec5Text || "We implement appropriate technical..."}</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-[#1A1310] dark:text-white">
              {t.privacy?.sec6Title || "6. Your Rights"}
            </h2>
            <p>{t.privacy?.sec6Text || "You have the right to access..."}</p>
          </section>
        </div>
      </main>

      <footer className="w-full py-6 text-center text-xs text-gray-400 dark:text-white/40 border-t border-orange-100 dark:border-orange-900/20">
        © {new Date().getFullYear()} FeastIQ. {t.footer?.rights || "All rights reserved."}
      </footer>

      {langOpen && <div className="fixed inset-0 z-40" onClick={() => setLangOpen(false)} />}
    </div>
  );
}