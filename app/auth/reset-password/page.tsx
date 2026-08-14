"use client";

import { useState } from "react";
import Link from "next/link";
import { FaSun, FaMoon, FaChevronDown, FaLock, FaArrowRight, FaCheckCircle } from "react-icons/fa";
import { GB, FR } from "country-flag-icons/react/3x2";
import { useLanguage } from "@/app/context/LanguageContext";
import { useTheme } from "@/app/context/ThemeContext";
import Logo from "@/app/components/Logo";

export default function ResetPasswordPage() {
  const { t, lang, setLang } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const [langOpen, setLangOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError(lang === "fr" ? "Les mots de passe ne correspondent pas." : "Passwords do not match.");
      return;
    }

    setLoading(true);
    // Handle password update logic here
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 1500);
  };

  return (
    <div 
      style={{ fontFamily: "'Times New Roman', Times, serif" }} 
      className="min-h-screen bg-white dark:bg-[#1A1310] text-[#1A1310] dark:text-white transition-colors duration-300 flex flex-col justify-between"
    >
      {/* Top Header Bar with Controls */}
      <header className="w-full px-6 py-4 flex items-center justify-between max-w-7xl mx-auto">
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

      {/* Main Content Area */}
      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md bg-orange-50/30 dark:bg-[#241C17]/60 border border-orange-100 dark:border-orange-900/30 rounded-2xl shadow-xl p-8 backdrop-blur-sm">
          <div className="text-center mb-8">
            <h1 className="text-2xl sm:text-3xl font-black text-[#1A1310] dark:text-white mb-2">
              {t.resetPassword?.title || "Reset Password"}
            </h1>
            <p className="text-gray-500 dark:text-white/60 text-sm">
              {t.resetPassword?.subtitle || "Please enter your new password below."}
            </p>
          </div>

          {success ? (
            <div className="space-y-6 text-center">
              <div className="flex justify-center text-orange-600 dark:text-orange-400">
                <FaCheckCircle size={48} />
              </div>
              <div className="p-4 rounded-xl bg-orange-100/50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-900/40 text-sm text-gray-700 dark:text-white/80">
                {t.resetPassword?.successMessage || "Your password has been successfully reset."}
              </div>
              <Link 
                href="/auth/login" 
                className="inline-flex items-center justify-center gap-2 w-full bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold py-3.5 rounded-xl transition-all text-sm hover:shadow-lg hover:shadow-orange-500/30"
              >
                {t.resetPassword?.signInBtn || "Sign In Now"} <FaArrowRight size={12} />
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/40 text-xs text-red-600 dark:text-red-400 text-center font-semibold">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-white/80 mb-2">
                  {t.resetPassword?.newPasswordLabel || "New Password"}
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <FaLock size={14} />
                  </span>
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-orange-200 dark:border-orange-900/40 bg-white dark:bg-[#1A1310] text-[#1A1310] dark:text-white placeholder-gray-400 dark:placeholder-white/30 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-white/80 mb-2">
                  {t.resetPassword?.confirmPasswordLabel || "Confirm New Password"}
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <FaLock size={14} />
                  </span>
                  <input 
                    type="password" 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-orange-200 dark:border-orange-900/40 bg-white dark:bg-[#1A1310] text-[#1A1310] dark:text-white placeholder-gray-400 dark:placeholder-white/30 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full mt-2 inline-flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-red-600 hover:shadow-lg hover:shadow-orange-500/30 text-white font-bold py-3.5 rounded-xl transition-all text-sm disabled:opacity-50"
              >
                {loading ? (t.resetPassword?.updating || "Updating password...") : (t.resetPassword?.submitBtn || "Reset Password")}
                {!loading && <FaArrowRight size={12} />}
              </button>
            </form>
          )}
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