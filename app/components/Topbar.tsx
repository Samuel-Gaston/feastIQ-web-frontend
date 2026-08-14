// app/components/Topbar.tsx
"use client";

import { useState } from "react";
import { FaSun, FaMoon, FaChevronDown, FaSearch, FaBell, FaCheckCircle, FaExclamationCircle, FaInfoCircle, FaUserCircle } from "react-icons/fa";
import { GB, FR } from "country-flag-icons/react/3x2";
import { useLanguage } from "@/app/context/LanguageContext";
import { useTheme } from "@/app/context/ThemeContext";

export default function Topbar() {
  const { lang, setLang, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const [langOpen, setLangOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  // Fallback translation object using English as the fallback
  const topbarT = t?.topbar || {};

  // Mock user and handlers (replace with your actual user state/handlers if needed)
  const user = {
    name: "Samuel Gaston",
    email: "admin@feastiq.com",
    role: "Super Admin"
  };
  const goToProfile = () => {
    setProfileOpen(false);
    // Add your profile navigation logic here
  };
  const handleLogout = () => {
    setProfileOpen(false);
    // Add your logout logic here
  };

  // Mock notifications list using translation keys/fallbacks
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: topbarT.notifNewRestaurant || "New restaurant registered",
      time: topbarT.time5Mins || "5 mins ago",
      type: "info",
      read: false,
    },
    {
      id: 2,
      title: topbarT.notifUserReport || "User report submitted",
      time: topbarT.time1Hour || "1 hour ago",
      type: "alert",
      read: false,
    },
    {
      id: 3,
      title: topbarT.notifSystemUpdate || "System update completed",
      time: topbarT.time3Hours || "3 hours ago",
      type: "success",
      read: true,
    },
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  return (
    <header className="h-20 bg-white/80 dark:bg-[#1A1310]/80 backdrop-blur-md border-b border-orange-100 dark:border-orange-900/30 px-8 flex items-center justify-between sticky top-0 z-30 transition-colors duration-300">
      {/* Search Bar */}
      <div className="flex items-center gap-3 w-96 bg-orange-50/50 dark:bg-white/5 border border-orange-200 dark:border-orange-900/40 rounded-xl px-4 py-2.5">
        <FaSearch size={14} className="text-gray-400" />
        <input 
          type="text"
          placeholder={topbarT.searchPlaceholder || "Search customer, restaurant..."}
          className="bg-transparent border-none outline-none text-sm text-[#1A1310] dark:text-white placeholder-gray-400 dark:placeholder-white/30 w-full"
        />
      </div>

      {/* Controls & Profile */}
      <div className="flex items-center gap-4">
        {/* Theme Toggle */}
        <button 
          onClick={toggleTheme} 
          className="p-2.5 rounded-xl border border-orange-100 dark:border-orange-900/30 bg-orange-50/60 dark:bg-white/5 hover:bg-orange-100 dark:hover:bg-white/15 transition-all text-orange-600 dark:text-amber-400 cursor-pointer" 
          aria-label="Toggle theme"
        >
          {theme === "dark" ? <FaSun size={15} /> : <FaMoon size={15} />}
        </button>

        {/* Language Selector */}
        <div className="relative">
          <button 
            onClick={() => setLangOpen(!langOpen)} 
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-orange-100 dark:border-orange-900/30 bg-orange-50/60 dark:bg-white/5 hover:bg-orange-100 dark:hover:bg-white/15 transition-all text-xs cursor-pointer"
          >
            {lang === "en" ? <GB style={{ width: 18, height: 13 }} /> : <FR style={{ width: 18, height: 13 }} />}
            <span className="font-semibold text-gray-700 dark:text-white">{lang.toUpperCase()}</span>
            <FaChevronDown className={`text-gray-400 transition-transform text-[10px] ${langOpen ? "rotate-180" : ""}`} />
          </button>
          {langOpen && (
            <div className="absolute right-0 top-full mt-2 w-40 bg-white dark:bg-[#241C17] border border-orange-100 dark:border-orange-900/30 rounded-xl shadow-xl overflow-hidden z-50">
              <button 
                onClick={() => { setLang("en"); setLangOpen(false); }} 
                className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-orange-50 dark:hover:bg-white/5 transition-colors text-left text-xs cursor-pointer ${lang === "en" ? "text-orange-600 font-semibold bg-orange-50/70 dark:bg-white/5" : "text-gray-700 dark:text-white/80"}`}
              >
                <GB style={{ width: 18, height: 13 }} /> English
              </button>
              <button 
                onClick={() => { setLang("fr"); setLangOpen(false); }} 
                className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-orange-50 dark:hover:bg-white/5 transition-colors text-left text-xs cursor-pointer ${lang === "fr" ? "text-orange-600 font-semibold bg-orange-50/70 dark:bg-white/5" : "text-gray-700 dark:text-white/80"}`}
              >
                <FR style={{ width: 18, height: 13 }} /> Français
              </button>
            </div>
          )}
        </div>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button 
            onClick={() => setNotifOpen(!notifOpen)}
            className="relative p-2.5 rounded-xl border border-orange-100 dark:border-orange-900/30 bg-orange-50/60 dark:bg-white/5 hover:bg-orange-100 dark:hover:bg-white/15 transition-all text-gray-600 dark:text-white/80 cursor-pointer"
          >
            <FaBell size={15} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 px-1.5 py-0.2 min-w-[18px] h-[18px] flex items-center justify-center rounded-full bg-red-600 text-white font-bold text-[10px] shadow-sm">
                {unreadCount}
              </span>
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 top-full mt-3 w-80 bg-white dark:bg-[#241C17] border border-orange-100 dark:border-orange-900/30 rounded-2xl shadow-2xl overflow-hidden z-50 animate-fade-in">
              <div className="p-4 border-b border-orange-100 dark:border-orange-900/30 flex items-center justify-between bg-orange-50/40 dark:bg-white/5">
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-800 dark:text-white">
                    {topbarT.notifications || "Notifications"}
                  </h4>
                  {unreadCount > 0 && (
                    <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-orange-500 text-white">
                      {unreadCount}
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button 
                    onClick={markAllAsRead}
                    className="text-[11px] text-orange-600 dark:text-orange-400 hover:underline font-semibold cursor-pointer bg-transparent border-none"
                  >
                    {topbarT.markAllRead || "Mark all read"}
                  </button>
                )}
              </div>

              <div className="max-h-72 overflow-y-auto divide-y divide-orange-100 dark:divide-orange-900/20">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-xs text-gray-400">
                    {topbarT.noNotifications || "No notifications"}
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div 
                      key={n.id} 
                      className={`p-3.5 flex items-start gap-3 transition-colors ${
                        !n.read 
                          ? "bg-orange-100/60 dark:bg-orange-950/40 hover:bg-orange-100 dark:hover:bg-orange-950/60" 
                          : "bg-white dark:bg-[#241C17] hover:bg-orange-50/40 dark:hover:bg-white/5"
                      }`}
                    >
                      <div className="mt-0.5 shrink-0">
                        {n.type === "success" && <FaCheckCircle className="text-emerald-500" size={14} />}
                        {n.type === "alert" && <FaExclamationCircle className="text-red-500" size={14} />}
                        {n.type === "info" && <FaInfoCircle className="text-orange-500" size={14} />}
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className={`text-xs ${!n.read ? "font-bold text-gray-900 dark:text-white" : "font-medium text-gray-600 dark:text-white/70"}`}>
                          {n.title}
                        </p>
                        <p className="text-[10px] text-gray-400 dark:text-white/40">
                          {n.time}
                        </p>
                      </div>
                      {!n.read && (
                        <span className="w-2 h-2 rounded-full bg-orange-500 self-center shrink-0"></span>
                      )}
                    </div>
                  ))
                )}
              </div>

              <div className="p-2.5 border-t border-orange-100 dark:border-orange-900/30 text-center bg-orange-50/30 dark:bg-white/5">
                <button 
                  onClick={() => setNotifOpen(false)}
                  className="text-xs font-semibold text-orange-600 dark:text-orange-400 hover:underline cursor-pointer bg-transparent border-none"
                >
                  {topbarT.close || "Close"}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Admin Profile Dropdown */}
        <div className="relative border-l border-orange-100 dark:border-orange-900/30 pl-4">
          <button 
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-3 text-left focus:outline-none cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-500 to-red-600 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-orange-500/20">
              SG
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#1A1310] dark:text-white">Samuel Gaston</h4>
              <p className="text-[11px] text-orange-600 dark:text-orange-400 font-semibold">{topbarT.superAdmin || "Super Admin"}</p>
            </div>
          </button>
          {profileOpen && (
            <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-[#241C17] border border-orange-100 dark:border-orange-900/30 rounded-xl shadow-lg overflow-hidden z-50">
              <div className="px-4 py-3 border-b border-orange-100 dark:border-orange-900/30">
                <p className="font-semibold text-gray-800 dark:text-white/90" style={{ fontSize: "14px" }}>{user?.name || "..."}</p>
                <p className="text-gray-400 dark:text-white/40" style={{ fontSize: "12px" }}>{user?.email || "..."}</p>
                <span className="inline-block mt-1.5 bg-orange-100 dark:bg-orange-950/50 text-orange-600 dark:text-orange-400 font-semibold px-2 py-0.5 rounded-full" style={{ fontSize: "10.5px" }}>
                  {user?.role || "..."}
                </span>
              </div>
              <button 
                className="cursor-pointer w-full flex items-center gap-2 px-4 py-2.5 text-gray-700 dark:text-white/80 hover:bg-orange-50 dark:hover:bg-white/5 transition-colors text-left" 
                style={{ fontSize: "13px" }}
                onClick={goToProfile}
              >
                <FaUserCircle size={14} className="text-orange-500" />
                {topbarT.myProfile || "My Profile"}
              </button>
              <button 
                onClick={handleLogout} 
                className="cursor-pointer w-full flex items-center gap-2 px-4 py-2.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors text-left border-t border-orange-100 dark:border-orange-900/30" 
                style={{ fontSize: "13px" }}
              >
                {topbarT.signOut || "Sign Out"}
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}