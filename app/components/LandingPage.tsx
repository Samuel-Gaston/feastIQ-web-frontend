"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  FaSun, FaMoon, FaChevronDown, FaMagic, FaCamera, FaComments,
  FaMapMarkedAlt, FaCheckCircle, FaStar,
} from "react-icons/fa";
import { GB, FR } from "country-flag-icons/react/3x2";
import { useLanguage } from "@/app/context/LanguageContext";
import { useTheme } from "@/app/context/ThemeContext";
import Logo from "./Logo";

const iconMap: Record<string, any> = { FaMagic, FaCamera, FaComments, FaMapMarkedAlt };

export default function LandingPage() {
  const { t, lang, setLang } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const [langOpen, setLangOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setStage((s) => (s + 1) % 4), 2200);
    return () => clearInterval(timer);
  }, []);

  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  const demoStages = [
    { label: t.liveDemo.placed, color: "bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400 border-amber-200 dark:border-amber-900/40", width: "25%" },
    { label: t.liveDemo.preparing, color: "bg-orange-100 text-orange-700 dark:bg-orange-950/50 dark:text-orange-400 border-orange-200 dark:border-orange-900/40", width: "55%" },
    { label: t.liveDemo.onTheWay, color: "bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-400 border-red-200 dark:border-red-900/40", width: "85%" },
    { label: t.liveDemo.delivered, color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/40", width: "100%" },
  ];

  return (
    <div style={{ fontFamily: "'Times New Roman', Times, serif" }} className="min-h-screen bg-white dark:bg-[#1A1310] text-[#1A1310] dark:text-white transition-colors duration-300">

      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-white/95 dark:bg-[#1A1310]/95 shadow-md border-b border-orange-100 dark:border-orange-900/20 backdrop-blur-md" : "bg-white/80 dark:bg-[#1A1310]/80 backdrop-blur-md"}`}>
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Logo size={34} />

          <div className="hidden md:flex items-center gap-8">
            <button onClick={() => scrollTo("home")} className="text-gray-700 dark:text-white/85 hover:text-orange-600 dark:hover:text-orange-400 transition-colors font-medium text-sm cursor-pointer">{t.nav.home}</button>
            <button onClick={() => scrollTo("how")} className="text-gray-700 dark:text-white/85 hover:text-orange-600 dark:hover:text-orange-400 transition-colors font-medium text-sm cursor-pointer">{t.nav.howItWorks}</button>
            <button onClick={() => scrollTo("features")} className="text-gray-700 dark:text-white/85 hover:text-orange-600 dark:hover:text-orange-400 transition-colors font-medium text-sm cursor-pointer">{t.nav.features}</button>
            <button onClick={() => scrollTo("restaurants")} className="text-gray-700 dark:text-white/85 hover:text-orange-600 dark:hover:text-orange-400 transition-colors font-medium text-sm cursor-pointer">{t.nav.forRestaurants}</button>
          </div>

          <div className="flex items-center gap-2.5">
            <button onClick={toggleTheme} className="cursor-pointer p-2 rounded-lg border border-orange-100 dark:border-orange-900/30 bg-orange-50/60 dark:bg-white/5 hover:bg-orange-100 dark:hover:bg-white/10 transition-all" aria-label="Toggle theme">
              {theme === "dark" ? <FaSun size={14} className="text-amber-400" /> : <FaMoon size={14} className="text-orange-600" />}
            </button>

            <div className="relative cursor-pointer">
              <button onClick={() => setLangOpen(!langOpen)} className="flex items-center gap-2 px-3 py-2 rounded-lg border border-orange-100 dark:border-orange-900/30 bg-orange-50/60 dark:bg-white/5 hover:bg-orange-100 dark:hover:bg-white/10 transition-all text-[13px] cursor-pointer">
                {lang === "en" ? <GB style={{ width: 18, height: 13 }} /> : <FR style={{ width: 18, height: 13 }} />}
                <span className="font-semibold text-gray-700 dark:text-white">{lang.toUpperCase()}</span>
                <FaChevronDown className={`text-gray-400 transition-transform text-[10px] cursor-pointer ${langOpen ? "rotate-180" : ""}`} />
              </button>
              {langOpen && (
                <div className="absolute right-0 top-full mt-2 w-40 bg-white dark:bg-[#241C17] border border-orange-100 dark:border-orange-900/30 rounded-xl shadow-lg overflow-hidden z-50">
                  <button onClick={() => { setLang("en"); setLangOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-orange-50 dark:hover:bg-white/5 transition-colors text-left text-sm cursor-pointer ${lang === "en" ? "text-orange-600 font-semibold bg-orange-50/70 dark:bg-white/5" : "text-gray-700 dark:text-white/80"}`}>
                    <GB style={{ width: 18, height: 13 }} /> English
                  </button>
                  <button onClick={() => { setLang("fr"); setLangOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-orange-50 dark:hover:bg-white/5 transition-colors text-left text-sm cursor-pointer ${lang === "fr" ? "text-orange-600 font-semibold bg-orange-50/70 dark:bg-white/5" : "text-gray-700 dark:text-white/80"}`}>
                    <FR style={{ width: 18, height: 13 }} /> Français
                  </button>
                </div>
              )}
            </div>

            <Link href="/auth/login" className="hidden sm:inline-flex items-center h-9 px-4 rounded-lg text-sm font-medium text-gray-700 dark:text-white/85 hover:bg-orange-50 dark:hover:bg-white/5 transition-colors">
              {t.nav.login}
            </Link>
            <Link href="/auth/register" className="inline-flex items-center h-9 px-5 rounded-lg text-sm font-bold text-white bg-gradient-to-r from-orange-500 to-red-600 hover:shadow-lg hover:shadow-orange-500/30 hover:-translate-y-0.5 transition-all">
              {t.nav.getStarted}
            </Link>
          </div>
        </div>
      </nav>

      <section id="home" className="pt-32 pb-20 px-6 bg-gradient-to-br from-orange-50 via-white to-yellow-50 dark:from-[#1A1310] dark:via-[#1A1310] dark:to-red-950/10 min-h-screen flex items-center">
        <div className="max-w-6xl mx-auto w-full grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
          <div className="md:col-span-7">
            <span className="inline-flex items-center gap-1.5 bg-orange-100 dark:bg-orange-950/40 text-orange-700 dark:text-orange-400 px-4 py-1.5 rounded-full mb-6 font-semibold text-[12px]">
              {t.hero.badge}
            </span>
            <h1 className="font-black leading-[1.05] mb-6 text-[2.75rem] sm:text-[3.6rem]">
              <span className="block text-[#1A1310] dark:text-white">{t.hero.line1}</span>
              <span className="block bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent">{t.hero.line2}</span>
              <span className="block text-[#1A1310] dark:text-white">{t.hero.line3}</span>
            </h1>
            <p className="text-gray-600 dark:text-white/70 mb-8 leading-relaxed max-w-lg text-[16px]">
              {t.hero.subtitle}
            </p>
            <div className="flex flex-wrap gap-3 mb-10">
              <Link href="/signup" className="inline-flex items-center bg-gradient-to-r from-orange-500 to-red-600 hover:shadow-xl hover:shadow-orange-500/30 text-white font-bold px-7 py-3.5 rounded-xl transition-all hover:-translate-y-0.5 text-[15px]">
                {t.hero.ctaPrimary}
              </Link>
              <Link href="/restaurant-signup" className="inline-flex items-center bg-white dark:bg-white/5 hover:bg-yellow-50 dark:hover:bg-white/10 text-orange-700 dark:text-orange-400 font-bold px-7 py-3.5 rounded-xl border-2 border-orange-200 dark:border-orange-900/40 transition-all text-[15px]">
                {t.hero.ctaSecondary}
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                [t.hero.stat1Value, t.hero.stat1Label, "text-orange-600"],
                [t.hero.stat2Value, t.hero.stat2Label, "text-red-600"],
                [t.hero.stat3Value, t.hero.stat3Label, "text-orange-600"],
                [t.hero.stat4Value, t.hero.stat4Label, "text-red-600"],
              ].map(([value, label, color]) => (
                <div key={label as string} className="bg-white dark:bg-white/5 rounded-xl border border-orange-100 dark:border-orange-900/20 p-3 text-center shadow-sm">
                  <div className={`font-black text-[20px] ${color}`}>{value}</div>
                  <div className="text-gray-500 dark:text-white/50 leading-tight mt-1 text-[11px]">{label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="md:col-span-5 relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-tr from-orange-400 to-yellow-300 opacity-25 dark:opacity-10 blur-3xl rounded-full pointer-events-none" />
            <div className="relative bg-white dark:bg-[#241C17] rounded-2xl border border-orange-100 dark:border-orange-900/20 shadow-2xl p-6">
              <div className="flex items-center justify-between mb-5 pb-4 border-b border-orange-50 dark:border-white/5">
                <span className="font-bold text-gray-800 dark:text-white text-sm">{t.liveDemo.label}</span>
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              </div>
              <div className={`px-4 py-3 rounded-xl border font-semibold text-sm mb-5 transition-colors duration-500 ${demoStages[stage].color}`}>
                {demoStages[stage].label}
              </div>
              <div className="h-2 bg-orange-50 dark:bg-white/5 rounded-full overflow-hidden mb-5">
                <div
                  className="h-2 rounded-full bg-gradient-to-r from-orange-500 to-red-600 transition-all duration-700 ease-out"
                  style={{ width: demoStages[stage].width }}
                />
              </div>
              <div className="flex items-center justify-between text-xs text-gray-400 dark:text-white/40">
                <span>Golden Wok</span>
                <span className="font-mono">#FQ-8841</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="how" className="py-20 px-6 bg-white dark:bg-[#1A1310]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-orange-600 dark:text-orange-400 font-bold uppercase tracking-widest mb-2 text-[12px]">{t.how.eyebrow}</p>
            <h2 className="font-black text-[#1A1310] dark:text-white mb-4 text-[2rem]">{t.how.title}</h2>
            <p className="text-gray-500 dark:text-white/60 max-w-xl mx-auto text-[15px]">{t.how.subtitle}</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {t.how.steps.map((step, i) => {
              const gradients = ["from-orange-500 to-amber-500", "from-red-500 to-orange-500", "from-amber-500 to-yellow-500"];
              return (
                <div key={step.title} className="bg-orange-50/50 dark:bg-white/5 hover:bg-orange-50 dark:hover:bg-white/10 border border-orange-100 dark:border-orange-900/20 rounded-2xl p-6 transition-all hover:shadow-md">
                  <div className={`w-10 h-10 bg-gradient-to-br ${gradients[i]} text-white rounded-xl flex items-center justify-center font-bold mb-4 text-sm`}>
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <h3 className="font-bold text-[#1A1310] dark:text-white mb-2 text-lg">{step.title}</h3>
                  <p className="text-gray-600 dark:text-white/70 leading-relaxed text-sm">{step.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="features" className="py-20 px-6 bg-gradient-to-br from-yellow-50/60 to-orange-50/40 dark:from-white/[0.02] dark:to-red-950/10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-red-600 dark:text-red-400 font-bold uppercase tracking-widest mb-2 text-[12px]">{t.features.eyebrow}</p>
            <h2 className="font-black text-[#1A1310] dark:text-white mb-4 text-[2rem]">{t.features.title}</h2>
            <p className="text-gray-500 dark:text-white/60 max-w-xl mx-auto text-[15px]">{t.features.subtitle}</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {t.features.list.map((f, i) => {
              const Icon = iconMap[f.icon] || FaMagic;
              const chips = [
                "bg-orange-100 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400",
                "bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400",
                "bg-amber-100 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400",
                "bg-yellow-100 dark:bg-yellow-950/40 text-yellow-600 dark:text-yellow-500",
              ];
              return (
                <div key={f.title} className="bg-white dark:bg-white/5 rounded-2xl border border-orange-100 dark:border-orange-900/20 p-5 hover:shadow-lg hover:-translate-y-1 transition-all">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${chips[i]}`}>
                    <Icon size={19} />
                  </div>
                  <h3 className="font-bold text-[#1A1310] dark:text-white mb-2 text-lg">{f.title}</h3>
                  <p className="text-gray-500 dark:text-white/60 leading-relaxed text-[13px]">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="restaurants" className="py-20 px-6 bg-white dark:bg-[#1A1310]">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-14 items-center">
          <div>
            <p className="text-orange-600 dark:text-orange-400 font-bold uppercase tracking-widest mb-2 text-[12px]">{t.forRestaurants.eyebrow}</p>
            <h2 className="font-black text-[#1A1310] dark:text-white mb-4 text-[2rem]">{t.forRestaurants.title}</h2>
            <p className="text-gray-500 dark:text-white/60 mb-8 leading-relaxed text-[15px]">{t.forRestaurants.subtitle}</p>
            <Link href="/restaurant-signup" className="inline-flex items-center bg-gradient-to-r from-orange-500 to-red-600 hover:shadow-xl hover:shadow-orange-500/30 text-white font-bold px-7 py-3.5 rounded-xl transition-all hover:-translate-y-0.5 text-[15px]">
              {t.forRestaurants.cta}
            </Link>
          </div>
          <div className="bg-gradient-to-br from-[#2A1810] to-[#1A0F0A] rounded-2xl shadow-xl p-6">
            {t.forRestaurants.bullets.map((b, i) => (
              <p key={b} className="flex items-start gap-3 text-white/85 mb-4 last:mb-0 text-[14.5px]">
                <span className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-white ${i % 2 === 0 ? "bg-orange-500" : "bg-red-500"}`}>
                  <FaCheckCircle size={11} />
                </span>
                {b}
              </p>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-gradient-to-br from-yellow-50/60 to-red-50/40 dark:from-white/[0.02] dark:to-red-950/10">
        <div className="max-w-4xl mx-auto text-center mb-10">
          <p className="text-orange-600 dark:text-orange-400 font-bold uppercase tracking-widest mb-2 text-[12px]">{t.showcase.eyebrow}</p>
          <h2 className="font-black text-[#1A1310] dark:text-white mb-4 text-[2rem]">{t.showcase.title}</h2>
          <p className="text-gray-500 dark:text-white/60 max-w-xl mx-auto text-[15px]">{t.showcase.subtitle}</p>
        </div>
        <div className="max-w-md mx-auto bg-white dark:bg-[#241C17] rounded-2xl border border-orange-100 dark:border-orange-900/20 shadow-xl p-6">
          <div className="flex items-center justify-between mb-5 pb-4 border-b border-orange-50 dark:border-white/5">
            <div>
              <p className="font-bold text-gray-800 dark:text-white text-sm">{t.showcase.previewTitle}</p>
              <p className="text-xs text-gray-400 dark:text-white/40 mt-0.5">{t.showcase.restaurantName}</p>
            </div>
            <div className="flex items-center gap-1 text-amber-500">
              <FaStar size={11} /><FaStar size={11} /><FaStar size={11} /><FaStar size={11} /><FaStar size={11} />
            </div>
          </div>
          {[
            { name: "Fried Rice x2", price: "4,400 XAF" },
            { name: "Spring Rolls", price: "1,500 XAF" },
            { name: "Soft Drink", price: "500 XAF" },
          ].map((item) => (
            <div key={item.name} className="flex items-center justify-between text-sm py-2 text-gray-600 dark:text-white/70">
              <span>{item.name}</span>
              <span className="font-mono">{item.price}</span>
            </div>
          ))}
          <div className="flex items-center justify-between pt-4 mt-3 border-t border-orange-50 dark:border-white/5">
            <span className="font-bold text-gray-800 dark:text-white text-sm">Total</span>
            <span className="font-mono font-bold text-orange-600">6,400 XAF</span>
          </div>
          <button className="w-full mt-5 bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold py-3 rounded-xl hover:shadow-lg transition-all text-sm">
            {t.showcase.viewOrderBtn}
          </button>
        </div>
      </section>

      <section className="py-24 px-6 bg-gradient-to-br from-orange-500 to-red-600 text-center">
        <div className="max-w-2xl mx-auto">
          <p className="text-yellow-200 font-bold uppercase tracking-widest mb-3 text-[12px]">{t.cta.eyebrow}</p>
          <h2 className="font-black text-white mb-5 text-[2rem]">{t.cta.title}</h2>
          <p className="text-orange-50 mb-10 leading-relaxed text-[16px]">{t.cta.subtitle}</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/auth/register" className="bg-white hover:bg-yellow-50 text-orange-600 font-bold px-8 py-3.5 rounded-xl transition-all hover:shadow-xl hover:-translate-y-0.5 text-[15px]">
              {t.cta.btn1}
            </Link>
            <Link href="/auth/register" className="bg-transparent hover:bg-white/10 text-white font-semibold px-8 py-3.5 rounded-xl border-2 border-white/50 hover:border-white transition-all text-[15px]">
              {t.cta.btn2}
            </Link>
          </div>
        </div>
      </section>

      <footer className="bg-[#1A1310] text-white/60 py-12 px-6 sm:px-12 border-t border-orange-900/20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 text-left">
          <div className="flex flex-col gap-3">
            <Logo size={30} />
            <p className="text-sm text-white/60 max-w-xs leading-relaxed mt-1">{t.footer.tagline}</p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4 uppercase tracking-wider text-xs">{t.footer.navHeading}</h4>
            <ul className="space-y-2.5 text-sm">
              <li><button onClick={() => scrollTo("home")} className="hover:text-orange-400 transition-colors">{t.nav.home}</button></li>
              <li><button onClick={() => scrollTo("how")} className="hover:text-orange-400 transition-colors">{t.nav.howItWorks}</button></li>
              <li><button onClick={() => scrollTo("features")} className="hover:text-orange-400 transition-colors">{t.nav.features}</button></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4 uppercase tracking-wider text-xs">{t.footer.platformHeading}</h4>
            <ul className="space-y-2.5 text-sm">
              <li><button onClick={() => scrollTo("restaurants")} className="hover:text-orange-400 transition-colors">{t.nav.forRestaurants}</button></li>
              <li><Link href="/login" className="hover:text-orange-400 transition-colors">{t.nav.login}</Link></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto pt-8 border-t border-orange-900/10 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm">
          <p className="text-[13.5px]">© {new Date().getFullYear()} <span className="text-white font-semibold">FeastIQ</span>. {t.footer.rights}</p>
          <div className="flex gap-6 text-xs text-white/30">
            <a href="/terms" className="hover:text-white/60 transition-colors">{t.footer.terms}</a>
            <a href="/privacy" className="hover:text-white/60 transition-colors">{t.footer.privacy}</a>
          </div>
        </div>
      </footer>

      {langOpen && <div className="fixed inset-0 z-40" onClick={() => setLangOpen(false)} />}
    </div>
  );
}