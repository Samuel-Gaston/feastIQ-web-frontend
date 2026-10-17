"use client";

import {
  FaUsers,
  FaStore,
  FaShoppingCart,
  FaBrain,
  FaArrowUp,
  FaArrowDown,
  FaEllipsisV,
  FaRobot,
  FaCheckCircle,
  FaExclamationTriangle,
  FaInfoCircle,
} from "react-icons/fa";
import Topbar from "@/app/components/Topbar";
import Sidebar from "@/app/components/Sidebar";
import { useLanguage } from "@/app/context/LanguageContext";
import api from "@/app/api/api";
import { useState, useEffect } from "react";

type StatBlock = { value: number; change: number | null };

interface ActivityItem {
  id: string;
  type: "ORDER" | "RESTAURANT";
  actor: string | null;
  target: string | null;
  status: string;
  createdAt: string;
}

interface Overview {
  stats: {
    customers: StatBlock;
    restaurants: StatBlock;
    orders: StatBlock;
    aiReplies: StatBlock;
  };
  orderVolume: {
    days: { date: string; count: number }[];
    dailyAverage: number;
    changeVsLastWeek: number | null;
  };
  aiUsage: { assistantReplies: number; dishesAutoTagged: number };
  recentActivity: ActivityItem[];
}

const fill = (template: string, vars: Record<string, string>) =>
  template.replace(/\{(\w+)\}/g, (_, key) => vars[key] ?? "");

const formatChange = (change: number | null | undefined) =>
  change === null || change === undefined ? "—" : `${change >= 0 ? "+" : ""}${change}%`;

const isPositive = (change: number | null | undefined) =>
  change === null || change === undefined || change >= 0;

export default function AdminDashboardPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [data, setData] = useState<Overview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [activityPage, setActivityPage] = useState(1);
  const activityPageSize = 5;
  const { t, lang } = useLanguage();
  const adminT = t.adminDashboard || {};

  const fetchOverview = async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await api.get("/admin/analytics");
      setData(res.data?.data ?? res.data);
    } catch (err: any) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOverview();
  }, []);

  const statsCards = [
    { title: adminT.totalCustomers, block: data?.stats.customers, icon: FaUsers, color: "from-blue-500 to-indigo-600" },
    { title: adminT.partnerRestaurants, block: data?.stats.restaurants, icon: FaStore, color: "from-orange-500 to-amber-600" },
    { title: adminT.totalOrders, block: data?.stats.orders, icon: FaShoppingCart, color: "from-emerald-500 to-teal-600" },
    { title: adminT.groqRequests, block: data?.stats.aiReplies, icon: FaBrain, color: "from-purple-500 to-pink-600" },
  ];

  const volumeDays = data?.orderVolume.days ?? [];
  const maxVolume = Math.max(...volumeDays.map((d) => d.count), 1);

  const dayLabel = (date: string) =>
    new Date(`${date}T00:00:00Z`).toLocaleDateString(lang === "fr" ? "fr-FR" : "en-US", {
      weekday: "short",
      timeZone: "UTC",
    });

  const assistantReplies = data?.aiUsage.assistantReplies ?? 0;
  const dishesAutoTagged = data?.aiUsage.dishesAutoTagged ?? 0;
  const aiTotal = assistantReplies + dishesAutoTagged;
  const aiUsageBars = [
    { label: adminT.assistantLabel || "Groq API Assistant", count: assistantReplies, color: "bg-orange-500" },
    { label: adminT.classifierLabel || "Food Vision Classifier", count: dishesAutoTagged, color: "bg-red-500" },
  ].map((item) => ({
    ...item,
    percentage: aiTotal === 0 ? 0 : Math.round((item.count / aiTotal) * 100),
  }));

  const activities = data?.recentActivity ?? [];
  const activityTotalPages = Math.max(1, Math.ceil(activities.length / activityPageSize));
  const paginatedActivities = activities.slice(
    (activityPage - 1) * activityPageSize,
    activityPage * activityPageSize
  );

  const timeAgo = (iso: string) => {
    const seconds = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
    if (seconds < 60) return adminT.timeJustNow || "Just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return fill(adminT.timeMinutes || "{n} min ago", { n: String(minutes) });
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return fill(adminT.timeHours || "{n} h ago", { n: String(hours) });
    const days = Math.floor(hours / 24);
    return fill(adminT.timeDays || "{n} d ago", { n: String(days) });
  };

  const describeActivity = (item: ActivityItem) => {
    if (item.type === "RESTAURANT") {
      return fill(adminT.activityRestaurantRegistered || "{restaurant} registered on the platform", {
        restaurant: item.actor ?? "—",
      });
    }
    const vars = { user: item.actor ?? "—", restaurant: item.target ?? "—" };
    if (item.status === "CANCELLED") {
      return fill(adminT.activityOrderCancelled || "{user}'s order at {restaurant} was cancelled", vars);
    }
    if (item.status === "DELIVERED" || item.status === "COMPLETED") {
      return fill(adminT.activityOrderDelivered || "{user}'s order from {restaurant} was delivered", vars);
    }
    return fill(adminT.activityOrderPlaced || "{user} placed an order at {restaurant}", vars);
  };

  const badgeFor = (item: ActivityItem): "success" | "warning" | "info" => {
    if (item.type === "RESTAURANT") {
      if (item.status === "APPROVED") return "success";
      return "warning";
    }
    if (item.status === "CANCELLED") return "warning";
    if (item.status === "DELIVERED" || item.status === "COMPLETED") return "success";
    return "info";
  };

  return (
    <div style={{ fontFamily: "'Times New Roman', Times, serif" }} className="min-h-screen bg-white dark:bg-[#1A1310] text-[#1A1310] dark:text-white flex transition-colors duration-300">
      <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(v => !v)} />

      <div className="flex-1 flex flex-col min-w-0">
        <Topbar />

        <main className="flex-1 p-6 space-y-6 overflow-y-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-black text-[#1A1310] dark:text-white">
                {adminT.title}
              </h1>
              <p className="text-xs text-gray-500 dark:text-white/60 mt-0.5">
                {adminT.subtitle}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-orange-100/70 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-900/40 text-orange-600 dark:text-orange-400">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span> {adminT.groqActive}
              </span>
            </div>
          </div>

          {error && (
            <div className="flex items-center justify-between bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 rounded-xl px-4 py-3 text-xs text-red-700 dark:text-red-300">
              <span>{adminT.loadError || "Could not load dashboard data."}</span>
              <button onClick={fetchOverview} className="font-bold underline cursor-pointer">
                {adminT.retry || "Retry"}
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {statsCards.map((stat, idx) => {
              const Icon = stat.icon;
              const positive = isPositive(stat.block?.change);
              return (
                <div
                  key={idx}
                  className="bg-orange-50/30 dark:bg-[#241C17]/60 border border-orange-100 dark:border-orange-900/30 rounded-xl p-4 shadow-sm relative overflow-hidden flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className={`w-9 h-9 rounded-lg bg-gradient-to-tr ${stat.color} flex items-center justify-center text-white shadow-sm`}>
                      <Icon size={16} />
                    </div>
                    <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full ${
                      positive
                        ? "bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400"
                        : "bg-red-100 dark:bg-red-950/50 text-red-600 dark:text-red-400"
                    }`}>
                      {stat.block?.change !== null && stat.block?.change !== undefined && (positive ? <FaArrowUp size={9} /> : <FaArrowDown size={9} />)}
                      {loading ? "—" : formatChange(stat.block?.change)}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-[#1A1310] dark:text-white mb-0.5">
                      {loading || !stat.block ? "—" : stat.block.value.toLocaleString()}
                    </h3>
                    <p className="text-[11px] font-semibold text-gray-500 dark:text-white/60">
                      {stat.title}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 bg-orange-50/30 dark:bg-[#241C17]/60 border border-orange-100 dark:border-orange-900/30 rounded-xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-base font-bold text-[#1A1310] dark:text-white">
                    {adminT.orderVolumeTitle}
                  </h2>
                  <p className="text-[11px] text-gray-500 dark:text-white/60">
                    {adminT.orderVolumeSub}
                  </p>
                </div>
                <button className="text-gray-400 hover:text-gray-600 dark:hover:text-white">
                  <FaEllipsisV size={13} />
                </button>
              </div>

              <div className="h-70 flex items-end justify-between gap-2 pt-4 px-2 border-b border-orange-100 dark:border-orange-900/30 pb-2">
                {(loading ? Array.from({ length: 7 }, () => ({ date: "", count: 0 })) : volumeDays).map((bar, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                    <span className="text-[10px] font-bold text-gray-500 dark:text-white/60 opacity-0 group-hover:opacity-100 transition-opacity">
                      {bar.count}
                    </span>
                    <div className="w-full bg-orange-100 dark:bg-white/5 rounded-t-lg overflow-hidden h-full flex items-end">
                      <div
                        style={{ height: bar.count === 0 ? "3%" : `${Math.max(6, Math.round((bar.count / maxVolume) * 100))}%` }}
                        className="w-full bg-gradient-to-t from-orange-500 to-red-600 rounded-t-lg group-hover:opacity-90 transition-all shadow-sm"
                      ></div>
                    </div>
                    <span className="text-[11px] font-semibold text-gray-500 dark:text-white/60">
                      {bar.date ? dayLabel(bar.date) : "—"}
                    </span>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between pt-3 text-[11px] text-gray-500 dark:text-white/60">
                <span>{adminT.dailyAvg}: {loading ? "—" : data?.orderVolume.dailyAverage}</span>
                <span className="text-orange-600 dark:text-orange-400 font-bold">
                  {loading ? "—" : formatChange(data?.orderVolume.changeVsLastWeek)} {adminT.vsLastWeek}
                </span>
              </div>
            </div>

            <div className="bg-orange-50/30 dark:bg-[#241C17]/60 border border-orange-100 dark:border-orange-900/30 rounded-xl p-5 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-base font-bold text-[#1A1310] dark:text-white">
                    {adminT.aiEngineTitle}
                  </h2>
                  <FaRobot className="text-orange-500" size={16} />
                </div>
                <p className="text-[11px] text-gray-500 dark:text-white/60 mb-4">
                  {adminT.aiEngineSub}
                </p>

                <div className="space-y-3">
                  {aiUsageBars.map((item, idx) => (
                    <div key={idx} className="space-y-1" style={{ padding: 9 }}>
                      <div className="flex justify-between text-[15px] font-semibold">
                        <span className="text-[#1A1310] dark:text-white">{item.label}</span>
                        <span className="text-gray-500 dark:text-white/60">
                          {loading ? "—" : `${item.count.toLocaleString()} (${item.percentage}%)`}
                        </span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-orange-100 dark:bg-white/5 overflow-hidden">
                        <div style={{ width: `${loading ? 0 : item.percentage}%` }} className={`h-full ${item.color} rounded-full`}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-3 rounded-lg bg-orange-100/50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-900/40 text-[11px] text-gray-700 dark:text-white/80 mt-4">
                <strong>Status:</strong> {adminT.statusLatency}
              </div>
            </div>
          </div>

          <div className="bg-orange-50/30 dark:bg-[#241C17]/60 border border-orange-100 dark:border-orange-900/30 rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-bold text-[#1A1310] dark:text-white">
                  {adminT.recentActivityTitle}
                </h2>
                <p className="text-[13px] text-gray-500 dark:text-white/60">
                  {adminT.recentActivitySub}
                </p>
              </div>
            </div>
            <div
              className="overflow-x-auto w-full pb-2"
              style={{
                scrollbarWidth: "thin",
                scrollbarColor: "rgba(234, 88, 12, 0.4) transparent",
              }}
            >
              <table className="w-full text-left text-xs min-w-[550px]">
                <thead>
                  <tr className="border-b border-orange-100 dark:border-orange-900/30 text-[13px] text-gray-400 dark:text-white/40 uppercase tracking-wider">
                    <th className="pb-2.5 font-bold">{adminT.entityUser}</th>
                    <th className="pb-2.5 font-bold">{adminT.actionEvent}</th>
                    <th className="pb-2.5 font-bold">{adminT.timestamp}</th>
                    <th className="pb-2.5 font-bold">{adminT.status}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-orange-100/50 dark:divide-orange-900/20 text-[13px]">
                  {loading ? (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-gray-400">...</td>
                    </tr>
                  ) : paginatedActivities.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-gray-400">
                        {adminT.noActivity || "No recent activity."}
                      </td>
                    </tr>
                  ) : (
                    paginatedActivities.map((act) => {
                      const badge = badgeFor(act);
                      return (
                        <tr key={`${act.type}-${act.id}`} className="hover:bg-orange-100/20 dark:hover:bg-white/5 transition-colors">
                          <td className="py-3 font-bold text-[#1A1310] dark:text-white whitespace-nowrap">
                            {act.actor ?? "—"}
                          </td>
                          <td className="py-3 text-gray-600 dark:text-white/80">
                            {describeActivity(act)}
                          </td>
                          <td className="py-3 text-[11px] text-gray-400 dark:text-white/50 whitespace-nowrap">
                            {timeAgo(act.createdAt)}
                          </td>
                          <td className="py-3 whitespace-nowrap">
                            {badge === "success" && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400">
                                <FaCheckCircle size={10} /> {adminT.success}
                              </span>
                            )}
                            {badge === "info" && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-blue-100 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400">
                                <FaInfoCircle size={10} /> Info
                              </span>
                            )}
                            {badge === "warning" && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-100 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400">
                                <FaExclamationTriangle size={10} /> {adminT.warning}
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {!loading && activities.length > 0 && (
              <div className="flex items-center justify-between pt-3 border-t border-orange-100 dark:border-orange-900/30">
                <p className="text-[11px] text-gray-500 dark:text-white/50">
                  {adminT.paginationShowing || "Showing"} {(activityPage - 1) * activityPageSize + 1}
                  –{Math.min(activityPage * activityPageSize, activities.length)} {adminT.paginationOf || "of"} {activities.length}
                </p>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setActivityPage((p) => Math.max(1, p - 1))}
                    disabled={activityPage === 1}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold text-gray-600 dark:text-white/70 border border-orange-200 dark:border-orange-900/40 hover:bg-orange-50 dark:hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
                  >
                    {adminT.prev || "Prev"}
                  </button>
                  {Array.from({ length: activityTotalPages }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setActivityPage(i + 1)}
                      className={`w-7 h-7 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
                        activityPage === i + 1
                          ? "bg-gradient-to-r from-orange-500 to-red-600 text-white"
                          : "text-gray-600 dark:text-white/70 hover:bg-orange-50 dark:hover:bg-white/5 border border-orange-200 dark:border-orange-900/40"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => setActivityPage((p) => Math.min(activityTotalPages, p + 1))}
                    disabled={activityPage === activityTotalPages}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold text-gray-600 dark:text-white/70 border border-orange-200 dark:border-orange-900/40 hover:bg-orange-50 dark:hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
                  >
                    {adminT.next || "Next"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}