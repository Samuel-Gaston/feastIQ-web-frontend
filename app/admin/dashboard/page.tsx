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
  FaExclamationTriangle 
} from "react-icons/fa";
import Topbar from "@/app/components/Topbar";
import Sidebar from "@/app/components/Sidebar";
import { useLanguage } from "@/app/context/LanguageContext";
import { useState } from "react";

export default function AdminDashboardPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { t, lang } = useLanguage();
  const adminT = t.adminDashboard || {};

  const statsCards = [
    {
      title: adminT.totalCustomers,
      value: "12,480",
      change: "+12.5%",
      isPositive: true,
      icon: FaUsers,
      color: "from-blue-500 to-indigo-600",
    },
    {
      title: adminT.partnerRestaurants,
      value: "342",
      change: "+4.2%",
      isPositive: true,
      icon: FaStore,
      color: "from-orange-500 to-amber-600",
    },
    {
      title: adminT.totalOrders,
      value: "45,210",
      change: "+18.3%",
      isPositive: true,
      icon: FaShoppingCart,
      color: "from-emerald-500 to-teal-600",
    },
    {
      title: adminT.groqRequests,
      value: "189.4k",
      change: "-2.1%",
      isPositive: false,
      icon: FaBrain,
      color: "from-purple-500 to-pink-600",
    },
  ];

  const recentActivities = [
    {
      id: 1,
      user: "Marie Claire",
      action: "ordered 2x Poulet DG via Groq AI",
      time: "2 mins ago",
      status: "success",
    },
    {
      id: 2,
      user: "Le Gourmet Resto",
      action: "updated its main menu",
      time: "15 mins ago",
      status: "info",
    },
    {
      id: 3,
      user: "Vision Classifier",
      action: "Food image recognition accuracy at 98.4%",
      time: "1 hour ago",
      status: "ai",
    },
    {
      id: 4,
      user: "Jean Paul",
      action: "reported a delivery issue",
      time: "3 hours ago",
      status: "warning",
    },
  ];

  return (
    <div style={{ fontFamily: "'Times New Roman', Times, serif" }} className="min-h-screen bg-white dark:bg-[#1A1310] text-[#1A1310] dark:text-white flex transition-colors duration-300">
      {/* Sidebar */}
      <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(v => !v)} />

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar />

        <main className="flex-1 p-6 space-y-6 overflow-y-auto">
          {/* Page Heading */}
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

          {/* Stats Cards (Compact) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {statsCards.map((stat, idx) => {
              const Icon = stat.icon;
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
                      stat.isPositive 
                        ? "bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400" 
                        : "bg-red-100 dark:bg-red-950/50 text-red-600 dark:text-red-400"
                    }`}>
                      {stat.isPositive ? <FaArrowUp size={9} /> : <FaArrowDown size={9} />}
                      {stat.change}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-[#1A1310] dark:text-white mb-0.5">
                      {stat.value}
                    </h3>
                    <p className="text-[11px] font-semibold text-gray-500 dark:text-white/60">
                      {stat.title}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Graphs & Charts Section */}
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

              {/* Reduced Height Chart Visual */}
              <div className="h-70 flex items-end justify-between gap-2 pt-4 px-2 border-b border-orange-100 dark:border-orange-900/30 pb-2">
                {[
                  { day: "Mon", height: "65%" },
                  { day: "Tue", height: "80%" },
                  { day: "Wed", height: "55%" },
                  { day: "Thu", height: "90%" },
                  { day: "Fri", height: "95%" },
                  { day: "Sat", height: "100%" },
                  { day: "Sun", height: "85%" },
                ].map((bar, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                    <div className="w-full bg-orange-100 dark:bg-white/5 rounded-t-lg overflow-hidden h-full flex items-end">
                      <div 
                        style={{ height: bar.height }} 
                        className="w-full bg-gradient-to-t from-orange-500 to-red-600 rounded-t-lg group-hover:opacity-90 transition-all shadow-sm"
                      ></div>
                    </div>
                    <span className="text-[11px] font-semibold text-gray-500 dark:text-white/60">{bar.day}</span>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between pt-3 text-[11px] text-gray-500 dark:text-white/60">
                <span>{adminT.dailyAvg}</span>
                <span className="text-orange-600 dark:text-orange-400 font-bold">+14.2% {adminT.vsLastWeek}</span>
              </div>
            </div>

            {/* AI Recommendation Engine Stats / Breakdown */}
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

                {/* Progress breakdown */}
                <div className="space-y-3">
                  {[
                    { label: "Groq API Assistant", percentage: 55, color: "bg-orange-500" },
                    { label: "Food Vision Classifier", percentage: 30, color: "bg-red-500" },
                    { label: "Recommendation Engine", percentage: 15, color: "bg-amber-500" },
                  ].map((item, idx) => (
                    <div key={idx} className="space-y-1" style={{padding:9}}>
                      <div className="flex justify-between text-[15px] font-semibold">
                        <span className="text-[#1A1310] dark:text-white">{item.label}</span>
                        <span className="text-gray-500 dark:text-white/60">{item.percentage}%</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-orange-100 dark:bg-white/5 overflow-hidden">
                        <div style={{ width: `${item.percentage}%` }} className={`h-full ${item.color} rounded-full`}></div>
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

          {/* Recent Activity Table (Compact) */}
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
              <button className="text-[13px] font-bold text-orange-600 dark:text-orange-400 hover:underline">
                {adminT.viewAll}
              </button>
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
                  {recentActivities.map((act) => (
                    <tr key={act.id} className="hover:bg-orange-100/20 dark:hover:bg-white/5 transition-colors">
                      <td className="py-3 font-bold text-[#1A1310] dark:text-white whitespace-nowrap">
                        {act.user}
                      </td>
                      <td className="py-3 text-gray-600 dark:text-white/80">
                        {act.action}
                      </td>
                      <td className="py-3 text-[11px] text-gray-400 dark:text-white/50 whitespace-nowrap">
                        {act.time}
                      </td>
                      <td className="py-3 whitespace-nowrap">
                        {act.status === "success" && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400">
                            <FaCheckCircle size={10} /> {adminT.success}
                          </span>
                        )}
                        {act.status === "info" && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-blue-100 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400">
                            Info
                          </span>
                        )}
                        {act.status === "ai" && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-purple-100 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400">
                            <FaRobot size={10} /> {adminT.aiMetric}
                          </span>
                        )}
                        {act.status === "warning" && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-100 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400">
                            <FaExclamationTriangle size={10} /> {adminT.warning}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}