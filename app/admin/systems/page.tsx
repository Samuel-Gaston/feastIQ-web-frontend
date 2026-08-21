"use client";

import { 
  FaUser, 
  FaLock, 
  FaEnvelope, 
  FaPhone, 
  FaShieldAlt, 
  FaSave, 
  FaCheckCircle, 
  FaExclamationCircle,
  FaKey,
  FaEye,
  FaEyeSlash
} from "react-icons/fa";
import Topbar from "@/app/components/Topbar";
import Sidebar from "@/app/components/Sidebar";
import { useLanguage } from "@/app/context/LanguageContext";
import { useState } from "react";

export default function AdminProfilePage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { t } = useLanguage();
  const profileT = t.adminProfile || {};

  const [activeTab, setActiveTab] = useState<"profile" | "security">("profile");

  // Profile Form State
  const [profileData, setProfileData] = useState({
    fullName: "Samuel Gaston",
    email: "samuelgaston@gmail.com",
    phone: "+237 690 000 000",
    role: "Super Admin",
    bio: "Head Platform Administrator responsible for system operations and module management.",
  });

  // Password Change Form State
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Password Visibility States
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Alert States
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const clearMessages = () => {
    setSuccessMsg(null);
    setErrorMsg(null);
  };

  // Helper to extract first letters of two names for the avatar initials
  const getInitials = (name: string) => {
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return `${parts[0].charAt(0)}${parts[1].charAt(0)}`.toUpperCase();
    }
    return name.charAt(0).toUpperCase() || "A";
  };

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();
    
    // Simulate update API call
    setSuccessMsg(profileT.profileUpdated || "Profile details updated successfully!");
    setTimeout(() => setSuccessMsg(null), 4000);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();

    if (passwordData.newPassword.length < 6) {
      setErrorMsg(profileT.passwordTooShort || "New password must be at least 6 characters long.");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setErrorMsg(profileT.passwordMismatch || "New password and confirmation do not match.");
      return;
    }

    // Simulate password change API call
    setSuccessMsg(profileT.passwordUpdated || "Your password has been changed successfully!");
    setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    setTimeout(() => setSuccessMsg(null), 4000);
  };

  return (
    <div style={{ fontFamily: "'Times New Roman', Times, serif" }} className="min-h-screen bg-white dark:bg-[#1A1310] text-[#1A1310] dark:text-white flex transition-colors duration-300">
      <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(v => !v)} />

      <div className="flex-1 flex flex-col min-w-0">
        <Topbar />

        <main className="flex-1 p-6 space-y-6 overflow-y-auto">
          {/* Header */}
          <div>
            <h1 className="text-2xl font-black text-[#1A1310] dark:text-white">
              {profileT.title || "Profile Settings"}
            </h1>
            <p className="text-xs text-gray-500 dark:text-white/60 mt-0.5">
              {profileT.subtitle || "Manage your personal information, contact details, and account security credentials."}
            </p>
          </div>

          {/* Feedback Banners */}
          {successMsg && (
            <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 text-emerald-700 dark:text-emerald-400 text-xs font-semibold flex items-center gap-2 animate-fadeIn">
              <FaCheckCircle size={14} />
              <span>{successMsg}</span>
            </div>
          )}

          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-400 text-xs font-semibold flex items-center gap-2 animate-fadeIn">
              <FaExclamationCircle size={14} />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column: Admin Overview Card */}
            <div className="bg-orange-50/30 dark:bg-[#241C17]/60 border border-orange-100 dark:border-orange-900/30 rounded-xl p-6 shadow-sm flex flex-col items-center text-center space-y-4 h-fit">
              {/* Initials Avatar */}
              <div className="w-24 h-24 rounded-full bg-orange-600 text-white flex items-center justify-center font-black text-2xl tracking-widest shadow-md border-4 border-white dark:border-[#1A1310]">
                {getInitials(profileData.fullName)}
              </div>

              <div>
                <h3 className="text-lg font-bold text-[#1A1310] dark:text-white">{profileData.fullName}</h3>
                <p className="text-xs text-gray-500 dark:text-white/60">{profileData.email}</p>
                <span className="inline-flex items-center gap-1 mt-2 px-3 py-1 rounded-full text-[11px] font-bold bg-orange-100 dark:bg-orange-950/50 text-orange-600 dark:text-orange-400">
                  <FaShieldAlt size={10} /> {profileData.role}
                </span>
              </div>

              {/* Navigation Tabs */}
              <div className="w-full pt-4 border-t border-orange-100 dark:border-orange-900/30 space-y-2">
                <button
                  onClick={() => { setActiveTab("profile"); clearMessages(); }}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    activeTab === "profile"
                      ? "bg-orange-600 text-white shadow-sm"
                      : "bg-white dark:bg-[#1A1310] text-gray-600 dark:text-white/80 hover:bg-orange-100/40 border border-orange-100 dark:border-orange-900/30"
                  }`}
                >
                  <FaUser size={12} />
                  <span>{profileT.tabProfile || "Personal Information"}</span>
                </button>

                <button
                  onClick={() => { setActiveTab("security"); clearMessages(); }}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    activeTab === "security"
                      ? "bg-orange-600 text-white shadow-sm"
                      : "bg-white dark:bg-[#1A1310] text-gray-600 dark:text-white/80 hover:bg-orange-100/40 border border-orange-100 dark:border-orange-900/30"
                  }`}
                >
                  <FaLock size={12} />
                  <span>{profileT.tabSecurity || "Security & Password"}</span>
                </button>
              </div>
            </div>

            {/* Right Column: Active Tab Form */}
            <div className="lg:col-span-2 bg-orange-50/30 dark:bg-[#241C17]/60 border border-orange-100 dark:border-orange-900/30 rounded-xl p-6 shadow-sm">
              {activeTab === "profile" ? (
                /* EDIT PROFILE FORM */
                <form onSubmit={handleProfileSubmit} className="space-y-4">
                  <div className="border-b border-orange-100 dark:border-orange-900/30 pb-3">
                    <h2 className="text-base font-bold text-[#1A1310] dark:text-white flex items-center gap-2">
                      <FaUser size={14} className="text-orange-600" />
                      {profileT.tabProfile || "Personal Information"}
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 dark:text-white/70 mb-1">
                        {profileT.fullName || "Full Name"} *
                      </label>
                      <div className="relative">
                        <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={12} />
                        <input
                          type="text"
                          required
                          value={profileData.fullName}
                          onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
                          className="w-full pl-9 pr-3 py-2 text-xs bg-white dark:bg-[#1A1310] border border-orange-200 dark:border-orange-900/40 rounded-lg text-[#1A1310] dark:text-white focus:outline-none focus:border-orange-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-600 dark:text-white/70 mb-1">
                        {profileT.email || "Email Address"} *
                      </label>
                      <div className="relative">
                        <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={12} />
                        <input
                          type="email"
                          required
                          value={profileData.email}
                          onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                          className="w-full pl-9 pr-3 py-2 text-xs bg-white dark:bg-[#1A1310] border border-orange-200 dark:border-orange-900/40 rounded-lg text-[#1A1310] dark:text-white focus:outline-none focus:border-orange-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-600 dark:text-white/70 mb-1">
                        {profileT.phone || "Phone Number"}
                      </label>
                      <div className="relative">
                        <FaPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={12} />
                        <input
                          type="text"
                          value={profileData.phone}
                          onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                          className="w-full pl-9 pr-3 py-2 text-xs bg-white dark:bg-[#1A1310] border border-orange-200 dark:border-orange-900/40 rounded-lg text-[#1A1310] dark:text-white focus:outline-none focus:border-orange-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-600 dark:text-white/70 mb-1">
                        {profileT.role || "Admin Role"}
                      </label>
                      <div className="relative">
                        <FaShieldAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={12} />
                        <input
                          type="text"
                          disabled
                          value={profileData.role}
                          className="w-full pl-9 pr-3 py-2 text-xs bg-gray-100 dark:bg-white/5 border border-orange-200 dark:border-orange-900/40 rounded-lg text-gray-500 dark:text-white/50 cursor-not-allowed font-semibold"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-600 dark:text-white/70 mb-1">
                      {profileT.bio || "Bio / Note"}
                    </label>
                    <textarea
                      rows={4}
                      value={profileData.bio}
                      onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                      className="w-full p-3 text-xs bg-white dark:bg-[#1A1310] border border-orange-200 dark:border-orange-900/40 rounded-lg text-[#1A1310] dark:text-white focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      type="submit"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-orange-600 hover:bg-orange-700 text-white shadow-sm transition-all"
                    >
                      <FaSave size={12} /> {profileT.saveProfile || "Save Changes"}
                    </button>
                  </div>
                </form>
              ) : (
                /* CHANGE PASSWORD FORM */
                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                  <div className="border-b border-orange-100 dark:border-orange-900/30 pb-3">
                    <h2 className="text-base font-bold text-[#1A1310] dark:text-white flex items-center gap-2">
                      <FaKey size={14} className="text-orange-600" />
                      {profileT.tabSecurity || "Security & Password"}
                    </h2>
                  </div>

                  <div className="space-y-3 max-w-md">
                    {/* Current Password */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 dark:text-white/70 mb-1">
                        {profileT.currentPassword || "Current Password"} *
                      </label>
                      <div className="relative">
                        <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={12} />
                        <input
                          type={showCurrentPassword ? "text" : "password"}
                          required
                          placeholder="••••••••"
                          value={passwordData.currentPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                          className="w-full pl-9 pr-9 py-2 text-xs bg-white dark:bg-[#1A1310] border border-orange-200 dark:border-orange-900/40 rounded-lg text-[#1A1310] dark:text-white focus:outline-none focus:border-orange-500"
                        />
                        <button
                          type="button"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-white/80 transition-colors"
                        >
                          {showCurrentPassword ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
                        </button>
                      </div>
                    </div>

                    {/* New Password */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 dark:text-white/70 mb-1">
                        {profileT.newPassword || "New Password"} *
                      </label>
                      <div className="relative">
                        <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={12} />
                        <input
                          type={showNewPassword ? "text" : "password"}
                          required
                          placeholder="••••••••"
                          value={passwordData.newPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                          className="w-full pl-9 pr-9 py-2 text-xs bg-white dark:bg-[#1A1310] border border-orange-200 dark:border-orange-900/40 rounded-lg text-[#1A1310] dark:text-white focus:outline-none focus:border-orange-500"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-white/80 transition-colors"
                        >
                          {showNewPassword ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
                        </button>
                      </div>
                    </div>

                    {/* Confirm Password */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 dark:text-white/70 mb-1">
                        {profileT.confirmPassword || "Confirm New Password"} *
                      </label>
                      <div className="relative">
                        <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={12} />
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          required
                          placeholder="••••••••"
                          value={passwordData.confirmPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                          className="w-full pl-9 pr-9 py-2 text-xs bg-white dark:bg-[#1A1310] border border-orange-200 dark:border-orange-900/40 rounded-lg text-[#1A1310] dark:text-white focus:outline-none focus:border-orange-500"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-white/80 transition-colors"
                        >
                          {showConfirmPassword ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-start pt-2">
                    <button
                      type="submit"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-orange-600 hover:bg-orange-700 text-white shadow-sm transition-all"
                    >
                      <FaLock size={12} /> {profileT.updatePassword || "Update Password"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}