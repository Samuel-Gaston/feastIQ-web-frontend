"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FaSun, FaMoon, FaChevronDown, FaEnvelope, FaLock, FaArrowRight, FaEye, FaEyeSlash, FaExclamationCircle } from "react-icons/fa";
import { GB, FR } from "country-flag-icons/react/3x2";
import { useLanguage } from "@/app/context/LanguageContext";
import { useTheme } from "@/app/context/ThemeContext";
import Logo from "@/app/components/Logo";
import api from "@/app/api/api";


const classifyRole = (value: unknown): "admin" | "restaurant" | "other" => {
  const name = String(value ?? "").toLowerCase();
  if (name.includes("admin")) return "admin";
  if (name.includes("restaurant")) return "restaurant";
  return "other";
};

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t, lang, setLang } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const [langOpen, setLangOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);


  
useEffect(() => {
  if (searchParams.get("session_expired") === "true") {
    setErrorMessage(t.login.sessionExpired);
  }
}, [searchParams, t]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    try {
      const response = await api.post("/auth/login", { email: email.trim(), password });
      const body = response.data;
      const payload = body?.data?.accessToken ? body.data : body;
      const { accessToken, refreshToken, user } = payload ?? {};

      if (!accessToken || !refreshToken) {
        setErrorMessage(t.login.invalidCredentials);
        return;
      }

      const receivedRole = user?.role;
      const kind = classifyRole(receivedRole);

      if (kind === "other") {
        const detail = receivedRole ? ` (${receivedRole})` : "";
        setErrorMessage(`${receivedRole ? t.login.customerNotAllowed : t.login.roleNotResolved}${detail}`);
        return;
      }

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("role", String(receivedRole).toLowerCase());
console.log("login ok", { receivedRole, kind, accessToken: !!accessToken });
      router.push(kind === "admin" ? "/admin/dashboard" : "/restaurant/dashboard");
    } catch (err: any) {
      if (!err.response) {
        setErrorMessage(t.login.networkError);
      } else {
        const backendMessage = err.response?.data?.message || t.login.invalidCredentials;
        setErrorMessage(Array.isArray(backendMessage) ? backendMessage[0] : backendMessage);
      }
    } finally {
      setLoading(false);
    }
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
            className="p-2 rounded-lg border border-orange-100 dark:border-orange-900/30 bg-orange-50/60 dark:bg-white/5 hover:bg-orange-100 dark:hover:bg-white/15 transition-all cursor-pointer"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <FaSun size={14} className="text-amber-400" /> : <FaMoon size={14} className="text-orange-600" />}
          </button>

          <div className="relative">
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg border border-orange-100 dark:border-orange-900/30 bg-orange-50/60 dark:bg-white/5 hover:bg-orange-100 dark:hover:bg-white/15 transition-all text-[13px] cursor-pointer"
            >
              {lang === "en" ? <GB style={{ width: 18, height: 13 }} /> : <FR style={{ width: 18, height: 13 }} />}
              <span className="font-semibold text-gray-700 dark:text-white">{lang.toUpperCase()}</span>
              <FaChevronDown className={`text-gray-400 transition-transform text-[10px] ${langOpen ? "rotate-180" : ""}`} />
            </button>
            {langOpen && (
              <div className="absolute right-0 top-full mt-2 w-40 bg-white dark:bg-[#241C17] border border-orange-100 dark:border-orange-900/30 rounded-xl shadow-lg overflow-hidden z-50">
                <button
                  onClick={() => { setLang("en"); setLangOpen(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-orange-50 dark:hover:bg-white/5 transition-colors text-left text-sm cursor-pointer ${lang === "en" ? "text-orange-600 font-semibold bg-orange-50/70 dark:bg-white/5" : "text-gray-700 dark:text-white/80"}`}
                >
                  <GB style={{ width: 18, height: 13 }} /> English
                </button>
                <button
                  onClick={() => { setLang("fr"); setLangOpen(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-orange-50 dark:hover:bg-white/5 transition-colors text-left text-sm cursor-pointer ${lang === "fr" ? "text-orange-600 font-semibold bg-orange-50/70 dark:bg-white/5" : "text-gray-700 dark:text-white/80"}`}
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
              {t.login.loginWelcome}
            </h1>
            <p className="text-gray-500 dark:text-white/60 text-sm">
              {t.login.loginSubtitle}
            </p>
          </div>

          {errorMessage && (
            <div
              role="alert"
              className="mb-5 flex items-start gap-2.5 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 rounded-xl px-4 py-3 text-xs text-red-700 dark:text-red-300"
            >
              <FaExclamationCircle size={13} className="mt-0.5 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-white/80 mb-2">
                {t.login.emailLabel}
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <FaEnvelope size={14} />
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t.login.emailPlaceholder}
                  required
                  autoComplete="email"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-orange-200 dark:border-orange-900/40 bg-white dark:bg-[#1A1310] text-[#1A1310] dark:text-white placeholder-gray-400 dark:placeholder-white/30 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-white/80">
                  {t.login.passwordLabel}
                </label>
                <Link href="/auth/forgot-password" className="text-xs text-orange-600 dark:text-orange-400 hover:underline">
                  {t.login.forgotPassword}
                </Link>
              </div>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <FaLock size={14} />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t.login.passwordPlaceholder}
                  required
                  autoComplete="current-password"
                  className="w-full pl-10 pr-11 py-3 rounded-xl border border-orange-200 dark:border-orange-900/40 bg-white dark:bg-[#1A1310] text-[#1A1310] dark:text-white placeholder-gray-400 dark:placeholder-white/30 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? t.login.hidePassword : t.login.showPassword}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-orange-500 transition-colors cursor-pointer"
                >
                  {showPassword ? <FaEyeSlash size={15} /> : <FaEye size={15} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 inline-flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-red-600 hover:shadow-lg hover:shadow-orange-500/30 text-white font-bold py-3.5 rounded-xl transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? t.login.signingIn : t.login.signIn}
              {!loading && <FaArrowRight size={12} />}
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-gray-500 dark:text-white/60">
            {t.login.noAccount}{" "}
            <Link href="/auth/register" className="text-orange-600 dark:text-orange-400 font-bold hover:underline">
              {t.login.getStarted}
            </Link>
          </div>
        </div>
      </main>

      <footer className="w-full py-6 text-center text-xs text-gray-400 dark:text-white/40 border-t border-orange-100 dark:border-orange-900/20">
        © {new Date().getFullYear()} <span className="font-semibold text-gray-600 dark:text-white/70">FeastIQ</span>. {t.footer.rights}
      </footer>

      {langOpen && <div className="fixed inset-0 z-40" onClick={() => setLangOpen(false)} />}
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginContent />
    </Suspense>
  );
}