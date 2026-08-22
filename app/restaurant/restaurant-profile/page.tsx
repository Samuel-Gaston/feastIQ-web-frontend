"use client";

import { useState } from "react";
import {
  FaStore,
  FaImage,
  FaMapMarkerAlt,
  FaClock,
  FaTags,
  FaEnvelope,
  FaStar,
  FaCheckCircle,
  FaHourglassHalf,
  FaBan,
  FaSave,
} from "react-icons/fa";
import OwnerTopbar from "@/app/components/restaurantTopbar";
import OwnerSidebar from "@/app/components/restaurantSidebar";
import { useLanguage } from "@/app/context/LanguageContext";

type RestaurantStatus = "PENDING" | "APPROVED" | "SUSPENDED";

interface RestaurantProfile {
  name: string;
  email: string;
  description: string;
  address: string;
  cuisineTags: string[];
  logoURL: string;
  openingAndClosingHours: string;
  status: RestaurantStatus;
  ratings: string;
}

const mockProfile: RestaurantProfile = {
  name: "Chez Maman Douala",
  email: "owner1@feastiq-seed.com",
  description: "Authentic Cameroonian home cooking, made fresh daily with local ingredients.",
  address: "Rue Joss, Akwa, Douala",
  cuisineTags: ["Local", "Grill"],
  logoURL: "",
  openingAndClosingHours: "8:00 AM - 10:00 PM",
  status: "APPROVED",
  ratings: "4.7",
};

const statusConfig: Record<RestaurantStatus, { icon: any; style: string }> = {
  PENDING: { icon: FaHourglassHalf, style: "bg-amber-100 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-900/40" },
  APPROVED: { icon: FaCheckCircle, style: "bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/40" },
  SUSPENDED: { icon: FaBan, style: "bg-red-100 dark:bg-red-950/50 text-red-600 dark:text-red-400 border-red-200 dark:border-red-900/40" },
};

export default function OwnerRestaurantProfilePage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [profile, setProfile] = useState<RestaurantProfile>(mockProfile);
  const [form, setForm] = useState({
    name: mockProfile.name,
    description: mockProfile.description,
    address: mockProfile.address,
    cuisineTags: mockProfile.cuisineTags.join(", "),
    logoURL: mockProfile.logoURL,
    openingAndClosingHours: mockProfile.openingAndClosingHours,
  });
  const [saved, setSaved] = useState(false);
  const { t, lang } = useLanguage();
  const profileT = t.ownerProfile || {};

  const StatusIcon = statusConfig[profile.status].icon;

  const isDirty =
    form.name !== profile.name ||
    form.description !== profile.description ||
    form.address !== profile.address ||
    form.cuisineTags !== profile.cuisineTags.join(", ") ||
    form.logoURL !== profile.logoURL ||
    form.openingAndClosingHours !== profile.openingAndClosingHours;

  const handleSave = () => {
    if (!form.name.trim() || !form.address.trim()) return;

    const parsedTags = form.cuisineTags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);

    setProfile((prev) => ({
      ...prev,
      name: form.name,
      description: form.description,
      address: form.address,
      cuisineTags: parsedTags,
      logoURL: form.logoURL,
      openingAndClosingHours: form.openingAndClosingHours,
    }));

    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleReset = () => {
    setForm({
      name: profile.name,
      description: profile.description,
      address: profile.address,
      cuisineTags: profile.cuisineTags.join(", "),
      logoURL: profile.logoURL,
      openingAndClosingHours: profile.openingAndClosingHours,
    });
  };

  return (
    <div style={{ fontFamily: "'Times New Roman', Times, serif" }} className="min-h-screen bg-white dark:bg-[#1A1310] text-[#1A1310] dark:text-white flex transition-colors duration-300">
      <OwnerSidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed((v) => !v)} />

      <div className="flex-1 flex flex-col min-w-0">
        <OwnerTopbar />

        <main className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-3xl mx-auto space-y-6">
            <div>
              <h1 className="text-2xl font-black text-[#1A1310] dark:text-white">
                {profileT.title || "Restaurant Profile"}
              </h1>
              <p className="text-xs text-gray-500 dark:text-white/60 mt-0.5">
                {profileT.subtitle || "Manage how your restaurant appears to customers"}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className={`rounded-xl border p-4 flex items-center gap-3 ${statusConfig[profile.status].style}`}>
                <StatusIcon size={18} />
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wide opacity-70">
                    {profileT.accountStatus || "Account Status"}
                  </p>
                  <p className="text-sm font-bold">
                    {profile.status === "PENDING" && (profileT.statusPending || "Pending Admin Approval")}
                    {profile.status === "APPROVED" && (profileT.statusApproved || "Approved & Live")}
                    {profile.status === "SUSPENDED" && (profileT.statusSuspended || "Suspended")}
                  </p>
                </div>
              </div>

              <div className="rounded-xl border border-orange-100 dark:border-orange-900/30 bg-orange-50/30 dark:bg-[#241C17]/60 p-4 flex items-center gap-3">
                <FaStar className="text-amber-500" size={18} />
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wide text-gray-500 dark:text-white/50">
                    {profileT.averageRating || "Average Rating"}
                  </p>
                  <p className="text-sm font-bold text-[#1A1310] dark:text-white">
                    {profile.ratings} / 5.0
                  </p>
                </div>
              </div>
            </div>

            {profile.status === "PENDING" && (
              <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/30 rounded-xl p-4 text-xs text-amber-700 dark:text-amber-300">
                {profileT.pendingNotice || "Your restaurant is awaiting admin approval. Customers won't see your menu until you're approved."}
              </div>
            )}
            {profile.status === "SUSPENDED" && (
              <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 rounded-xl p-4 text-xs text-red-700 dark:text-red-300">
                {profileT.suspendedNotice || "Your restaurant has been suspended and is not visible to customers. Contact platform support for details."}
              </div>
            )}

            <div className="bg-orange-50/30 dark:bg-[#241C17]/60 border border-orange-100 dark:border-orange-900/30 rounded-xl p-6 space-y-5">
              <div className="flex items-center gap-2 pb-2 border-b border-orange-100 dark:border-orange-900/20">
                <FaStore className="text-orange-500" size={14} />
                <h2 className="text-sm font-bold text-[#1A1310] dark:text-white">
                  {profileT.businessInfo || "Business Information"}
                </h2>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-600 dark:text-white/70 mb-1.5 block flex items-center gap-1.5">
                  <FaEnvelope size={10} /> {profileT.email || "Email Address"}
                </label>
                <input
                  type="email"
                  value={profile.email}
                  disabled
                  className="w-full bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg px-3.5 py-2.5 text-sm text-gray-500 dark:text-white/40 cursor-not-allowed"
                />
                <p className="text-[10px] text-gray-400 dark:text-white/40 mt-1">
                  {profileT.emailLocked || "Email cannot be changed here — contact support to update it."}
                </p>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-600 dark:text-white/70 mb-1.5 block">
                  {profileT.restaurantName || "Restaurant Name"}
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-white dark:bg-white/5 border border-orange-200 dark:border-orange-900/40 rounded-lg px-3.5 py-2.5 text-sm text-[#1A1310] dark:text-white outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-600 dark:text-white/70 mb-1.5 block">
                  {profileT.description || "Description"}
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={3}
                  className="w-full bg-white dark:bg-white/5 border border-orange-200 dark:border-orange-900/40 rounded-lg px-3.5 py-2.5 text-sm text-[#1A1310] dark:text-white outline-none focus:border-orange-500 resize-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-600 dark:text-white/70 mb-1.5 block flex items-center gap-1.5">
                  <FaImage size={10} /> {profileT.logo || "Logo URL"}
                </label>
                <input
                  type="text"
                  value={form.logoURL}
                  onChange={(e) => setForm({ ...form, logoURL: e.target.value })}
                  placeholder="https://..."
                  className="w-full bg-white dark:bg-white/5 border border-orange-200 dark:border-orange-900/40 rounded-lg px-3.5 py-2.5 text-sm text-[#1A1310] dark:text-white placeholder-gray-400 dark:placeholder-white/30 outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-600 dark:text-white/70 mb-1.5 block flex items-center gap-1.5">
                  <FaMapMarkerAlt size={10} /> {profileT.address || "Address"}
                </label>
                <input
                  type="text"
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  className="w-full bg-white dark:bg-white/5 border border-orange-200 dark:border-orange-900/40 rounded-lg px-3.5 py-2.5 text-sm text-[#1A1310] dark:text-white outline-none focus:border-orange-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-600 dark:text-white/70 mb-1.5 block flex items-center gap-1.5">
                    <FaClock size={10} /> {profileT.hours || "Opening & Closing Hours"}
                  </label>
                  <input
                    type="text"
                    value={form.openingAndClosingHours}
                    onChange={(e) => setForm({ ...form, openingAndClosingHours: e.target.value })}
                    placeholder="8:00 AM - 10:00 PM"
                    className="w-full bg-white dark:bg-white/5 border border-orange-200 dark:border-orange-900/40 rounded-lg px-3.5 py-2.5 text-sm text-[#1A1310] dark:text-white placeholder-gray-400 dark:placeholder-white/30 outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-600 dark:text-white/70 mb-1.5 block flex items-center gap-1.5">
                    <FaTags size={10} /> {profileT.cuisineTags || "Cuisine Tags"}
                  </label>
                  <input
                    type="text"
                    value={form.cuisineTags}
                    onChange={(e) => setForm({ ...form, cuisineTags: e.target.value })}
                    placeholder="Local, Grill"
                    className="w-full bg-white dark:bg-white/5 border border-orange-200 dark:border-orange-900/40 rounded-lg px-3.5 py-2.5 text-sm text-[#1A1310] dark:text-white placeholder-gray-400 dark:placeholder-white/30 outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={handleReset}
                  disabled={!isDirty}
                  className="px-5 py-2.5 rounded-xl text-sm font-bold text-gray-600 dark:text-white/70 border border-orange-200 dark:border-orange-900/40 hover:bg-orange-50 dark:hover:bg-white/5 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  {profileT.discard || "Discard Changes"}
                </button>
                <button
                  onClick={handleSave}
                  disabled={!isDirty || !form.name.trim() || !form.address.trim()}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-orange-500 to-red-600 hover:shadow-lg hover:shadow-orange-500/25 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  <FaSave size={12} />
                  {saved ? (profileT.saved || "Saved!") : (profileT.saveChanges || "Save Changes")}
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}