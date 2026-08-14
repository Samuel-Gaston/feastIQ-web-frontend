"use client";

import { useState } from "react";
import Link from "next/link";
import { FaSun, FaMoon, FaChevronDown, FaUser, FaEnvelope, FaLock, FaArrowRight } from "react-icons/fa";
import { GB, FR } from "country-flag-icons/react/3x2";
import { useLanguage } from "@/app/context/LanguageContext";
import { useTheme } from "@/app/context/ThemeContext";
import Logo from "@/app/components/Logo";

export default function RegisterPage() {
  const { t, lang, setLang } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const [langOpen, setLangOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreeTerms) return;
    setLoading(true);
    // Handle registration logic here
    setTimeout(() => setLoading(false), 1500);
  };

  return (
    <div 
      style={{ fontFamily: "'Times New Roman', Times, serif" }} 
      className="min-h-screen bg-white dark:bg-[#1A1310] text-[#1A1310] dark:text-white transition-colors duration-300 flex flex-col justify-between"
    >
     
      <header className="w-full px-6 py-4 flex items-center justify-between max-w-7xl mx-auto">
     <Link href="/">
 <Logo size={36} />

        </Link>

        <div className="flex items-center gap-2.5">
      
          <button 
            onClick={toggleTheme} 
            className="p-2 rounded-lg border border-orange-100 dark:border-orange-900/30 bg-orange-50/60 dark:bg-white/5 hover:bg-orange-100 dark:hover:bg-white/15 transition-all" 
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <FaSun size={14} className="text-amber-400" /> : <FaMoon size={14} className="text-orange-600" />}
          </button>

         
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

     
      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md bg-orange-50/30 dark:bg-[#241C17]/60 border border-orange-100 dark:border-orange-900/30 rounded-2xl shadow-xl p-8 backdrop-blur-sm">
          <div className="text-center mb-8">
            <h1 className="text-2xl sm:text-3xl font-black text-[#1A1310] dark:text-white mb-2">
              {t.register?.registerWelcome || "Create an Account"}
            </h1>
            <p className="text-gray-500 dark:text-white/60 text-sm">
              {t.register?.registerSubtitle || "Please enter your details to sign up."}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-white/80 mb-2">
                {t.register?.nameLabel || "Full Name"}
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <FaUser size={14} />
                </span>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t.register?.namePlaceholder || "Samuel Gaston"}
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-orange-200 dark:border-orange-900/40 bg-white dark:bg-[#1A1310] text-[#1A1310] dark:text-white placeholder-gray-400 dark:placeholder-white/30 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-white/80 mb-2">
                {t.register?.emailLabel || "Email Address"}
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <FaEnvelope size={14} />
                </span>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t.register?.emailPlaceholder || "name@example.com"}
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-orange-200 dark:border-orange-900/40 bg-white dark:bg-[#1A1310] text-[#1A1310] dark:text-white placeholder-gray-400 dark:placeholder-white/30 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-white/80 mb-2">
                {t.register?.passwordLabel || "Password"}
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <FaLock size={14} />
                </span>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t.register?.passwordPlaceholder || "••••••••"}
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-orange-200 dark:border-orange-900/40 bg-white dark:bg-[#1A1310] text-[#1A1310] dark:text-white placeholder-gray-400 dark:placeholder-white/30 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                />
              </div>
            </div>

          
            <div className="flex items-start gap-2.5 pt-1">
              <input 
                type="checkbox" 
                id="terms"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-orange-300 text-orange-600 focus:ring-orange-500 dark:bg-[#1A1310] dark:border-orange-900/40 cursor-pointer"
              />
              <label htmlFor="terms" className="text-xs text-gray-600 dark:text-white/70 cursor-pointer select-none">
                {lang === "fr" ? (
                  <>J'accepte les <Link href="/terms" className="text-orange-600 dark:text-orange-400 hover:underline font-semibold">Conditions d'Utilisation</Link> et la <Link href="/privacy" className="text-orange-600 dark:text-orange-400 hover:underline font-semibold">Politique de Confidentialité</Link></>
                ) : (
                  <>I agree to the <Link href="/terms" className="text-orange-600 dark:text-orange-400 hover:underline font-semibold">Terms of Service</Link> and <Link href="/privacy" className="text-orange-600 dark:text-orange-400 hover:underline font-semibold">Privacy Policy</Link></>
                )}
              </label>
            </div>

            <button 
              type="submit" 
              disabled={loading || !agreeTerms}
              className="w-full mt-2 inline-flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-red-600 hover:shadow-lg hover:shadow-orange-500/30 text-white font-bold py-3.5 rounded-xl transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (t.register?.signingUp || "Creating account...") : (t.register?.signUp || "Get Started")}
              {!loading && <FaArrowRight size={12} />}
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-gray-500 dark:text-white/60">
            {t.register?.hasAccount || "Already have an account?"}{" "}
            <Link href="/auth/login" className="text-orange-600 dark:text-orange-400 font-bold hover:underline">
              {t.register?.signIn || "Sign In"}
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-6 text-center text-xs text-gray-400 dark:text-white/40 border-t border-orange-100 dark:border-orange-900/20">
        © {new Date().getFullYear()} <span className="font-semibold text-gray-600 dark:text-white/70">FeastIQ</span>. {t.footer?.rights || "All rights reserved."}
      </footer>

      {langOpen && <div className="fixed inset-0 z-40" onClick={() => setLangOpen(false)} />}
    </div>
  );
}