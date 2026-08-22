"use client";

import {
  FaShoppingBag,
  FaMoneyBillWave,
  FaStar,
  FaClock,
  FaFire,
  FaMotorcycle,
  FaCheckDouble,
  FaChevronRight,
  FaUtensils,
} from "react-icons/fa";
import OwnerTopbar from "@/app/components/restaurantTopbar";
import OwnerSidebar from "@/app/components/restaurantSidebar";
import { useLanguage } from "@/app/context/LanguageContext";
import { useState } from "react";

export default function OwnerDashboardPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { t } = useLanguage();
  const ownerT = t.ownerDashboard || {};

  const restaurantOpen = true;

  const todayStats = [
    { title: ownerT.ordersToday, value: "38", icon: FaShoppingBag, color: "from-orange-500 to-amber-600" },
    { title: ownerT.revenueToday, value: "184,500 XAF", icon: FaMoneyBillWave, color: "from-emerald-500 to-teal-600" },
    { title: ownerT.avgRating, value: "4.7", icon: FaStar, color: "from-amber-500 to-yellow-500" },
  ];

  const queue = {
    new: [
      { id: "#FQ-8841", items: "2x Fried Rice, 1x Soft Drink", time: "2 min ago", total: "4,900 XAF" },
      { id: "#FQ-8840", items: "1x Grilled Chicken", time: "4 min ago", total: "3,500 XAF" },
    ],
    preparing: [
      { id: "#FQ-8837", items: "3x Spring Rolls, 2x Juice", time: "9 min ago", total: "5,500 XAF" },
    ],
    ready: [
      { id: "#FQ-8832", items: "1x Jollof Rice, 1x Water", time: "14 min ago", total: "2,300 XAF" },
      { id: "#FQ-8829", items: "2x Ndole with Plantain", time: "17 min ago", total: "5,000 XAF" },
    ],
  };

  const topDishes = [
    { name: "Jollof Rice", orders: 33, revenue: "66,000 XAF" },
    { name: "Grilled Chicken", orders: 28, revenue: "98,000 XAF" },
    { name: "Fried Rice", orders: 24, revenue: "52,800 XAF" },
    { name: "Spring Rolls", orders: 19, revenue: "28,500 XAF" },
  ];

  const recentReviews = [
    { customer: "Aïcha M.", rating: 5, comment: "Fastest delivery I've had, food still hot!", time: "1 hr ago" },
    { customer: "Junior T.", rating: 4, comment: "Great taste, portion could be bigger.", time: "3 hr ago" },
  ];

  return (
    <div style={{ fontFamily: "'Times New Roman', Times, serif" }} className="min-h-screen bg-white dark:bg-[#1A1310] text-[#1A1310] dark:text-white flex transition-colors duration-300">
      <OwnerSidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(v => !v)} />

      <div className="flex-1 flex flex-col min-w-0">
        <OwnerTopbar />

        <main className="flex-1 p-6 space-y-6 overflow-y-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-black text-[#1A1310] dark:text-white">
                {ownerT.greeting || "Welcome back, Chez Maman Douala"}
              </h1>
              <p className="text-xs text-gray-500 dark:text-white/60 mt-0.5">
                {ownerT.subtitle || "Here's what's happening in your kitchen today"}
              </p>
            </div>
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border ${
              restaurantOpen
                ? "bg-emerald-100/70 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900/40 text-emerald-600 dark:text-emerald-400"
                : "bg-gray-100 dark:bg-white/5 border-gray-200 dark:border-white/10 text-gray-500 dark:text-white/50"
            }`}>
              <span className={`w-2 h-2 rounded-full ${restaurantOpen ? "bg-emerald-500 animate-pulse" : "bg-gray-400"}`} />
              {restaurantOpen ? (ownerT.openNow || "Open Now") : (ownerT.closed || "Closed")}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {todayStats.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div
                  key={idx}
                  className="bg-orange-50/30 dark:bg-[#241C17]/60 border border-orange-100 dark:border-orange-900/30 rounded-xl p-4 shadow-sm flex items-center gap-4"
                >
                  <div className={`w-11 h-11 rounded-lg bg-gradient-to-tr ${stat.color} flex items-center justify-center text-white shadow-sm shrink-0`}>
                    <Icon size={17} />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-[#1A1310] dark:text-white">{stat.value}</h3>
                    <p className="text-[11px] font-semibold text-gray-500 dark:text-white/60">{stat.title}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="bg-orange-50/30 dark:bg-[#241C17]/60 border border-orange-100 dark:border-orange-900/30 rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-bold text-[#1A1310] dark:text-white">
                  {ownerT.liveQueueTitle || "Live Order Queue"}
                </h2>
                <p className="text-[11px] text-gray-500 dark:text-white/60">
                  {ownerT.liveQueueSub || "Track incoming orders as they move through your kitchen"}
                </p>
              </div>
              <button className="text-[13px] font-bold text-orange-600 dark:text-orange-400 hover:underline flex items-center gap-1">
                {ownerT.viewAllOrders || "View All Orders"} <FaChevronRight size={10} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white dark:bg-[#1A1310] rounded-xl border border-orange-100 dark:border-orange-900/20 p-3.5">
                <div className="flex items-center gap-2 mb-3 px-1">
                  <FaFire size={13} className="text-orange-500" />
                  <span className="text-xs font-bold uppercase tracking-wide text-gray-600 dark:text-white/70">
                    {ownerT.newOrders || "New"}
                  </span>
                  <span className="ml-auto text-[11px] font-bold bg-orange-100 dark:bg-orange-950/50 text-orange-600 dark:text-orange-400 px-2 py-0.5 rounded-full">
                    {queue.new.length}
                  </span>
                </div>
                <div className="space-y-2.5">
                  {queue.new.map((order) => (
                    <div key={order.id} className="bg-orange-50/50 dark:bg-white/5 border border-orange-100 dark:border-orange-900/20 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-[#1A1310] dark:text-white">{order.id}</span>
                        <span className="text-[10px] text-gray-400 dark:text-white/40 flex items-center gap-1">
                          <FaClock size={9} /> {order.time}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-600 dark:text-white/70 mb-1.5">{order.items}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-mono font-semibold text-orange-600 dark:text-orange-400">{order.total}</span>
                        <button className="text-[10px] font-bold bg-gradient-to-r from-orange-500 to-red-600 text-white px-2.5 py-1 rounded-md hover:shadow-sm transition-all">
                          {ownerT.accept || "Accept"}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white dark:bg-[#1A1310] rounded-xl border border-orange-100 dark:border-orange-900/20 p-3.5">
                <div className="flex items-center gap-2 mb-3 px-1">
                  <FaUtensils size={13} className="text-amber-500" />
                  <span className="text-xs font-bold uppercase tracking-wide text-gray-600 dark:text-white/70">
                    {ownerT.preparing || "Preparing"}
                  </span>
                  <span className="ml-auto text-[11px] font-bold bg-amber-100 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 px-2 py-0.5 rounded-full">
                    {queue.preparing.length}
                  </span>
                </div>
                <div className="space-y-2.5">
                  {queue.preparing.map((order) => (
                    <div key={order.id} className="bg-amber-50/50 dark:bg-white/5 border border-amber-100 dark:border-amber-900/20 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-[#1A1310] dark:text-white">{order.id}</span>
                        <span className="text-[10px] text-gray-400 dark:text-white/40 flex items-center gap-1">
                          <FaClock size={9} /> {order.time}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-600 dark:text-white/70 mb-1.5">{order.items}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-mono font-semibold text-amber-600 dark:text-amber-400">{order.total}</span>
                        <button className="text-[10px] font-bold bg-amber-500 text-white px-2.5 py-1 rounded-md hover:shadow-sm transition-all">
                          {ownerT.markReady || "Mark Ready"}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white dark:bg-[#1A1310] rounded-xl border border-orange-100 dark:border-orange-900/20 p-3.5">
                <div className="flex items-center gap-2 mb-3 px-1">
                  <FaMotorcycle size={13} className="text-emerald-500" />
                  <span className="text-xs font-bold uppercase tracking-wide text-gray-600 dark:text-white/70">
                    {ownerT.ready || "Ready for Pickup"}
                  </span>
                  <span className="ml-auto text-[11px] font-bold bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-full">
                    {queue.ready.length}
                  </span>
                </div>
                <div className="space-y-2.5">
                  {queue.ready.map((order) => (
                    <div key={order.id} className="bg-emerald-50/50 dark:bg-white/5 border border-emerald-100 dark:border-emerald-900/20 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-[#1A1310] dark:text-white">{order.id}</span>
                        <span className="text-[10px] text-gray-400 dark:text-white/40 flex items-center gap-1">
                          <FaClock size={9} /> {order.time}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-600 dark:text-white/70 mb-1.5">{order.items}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-mono font-semibold text-emerald-600 dark:text-emerald-400">{order.total}</span>
                        <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                          <FaCheckDouble size={9} /> {ownerT.awaitingRider || "Awaiting rider"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-orange-50/30 dark:bg-[#241C17]/60 border border-orange-100 dark:border-orange-900/30 rounded-xl p-5 shadow-sm">
              <h2 className="text-base font-bold text-[#1A1310] dark:text-white mb-1">
                {ownerT.topDishesTitle || "Top Dishes This Week"}
              </h2>
              <p className="text-[11px] text-gray-500 dark:text-white/60 mb-4">
                {ownerT.topDishesSub || "Your best sellers, ranked by orders"}
              </p>
              <div className="space-y-1">
                {topDishes.map((dish, i) => (
                  <div key={dish.name} className="flex items-center justify-between py-2.5 border-b border-orange-100/50 dark:border-white/5 last:border-0">
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-md bg-gradient-to-tr from-orange-500 to-red-600 text-white text-[11px] font-bold flex items-center justify-center">
                        {i + 1}
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-[#1A1310] dark:text-white">{dish.name}</p>
                        <p className="text-[11px] text-gray-400 dark:text-white/40">{dish.orders} orders</p>
                      </div>
                    </div>
                    <span className="text-[12px] font-mono font-bold text-orange-600 dark:text-orange-400">{dish.revenue}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-orange-50/30 dark:bg-[#241C17]/60 border border-orange-100 dark:border-orange-900/30 rounded-xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-base font-bold text-[#1A1310] dark:text-white">
                    {ownerT.recentReviewsTitle || "Recent Reviews"}
                  </h2>
                  <p className="text-[11px] text-gray-500 dark:text-white/60">
                    {ownerT.recentReviewsSub || "What customers are saying"}
                  </p>
                </div>
                <button className="text-[13px] font-bold text-orange-600 dark:text-orange-400 hover:underline">
                  {ownerT.viewAll || "View All"}
                </button>
              </div>
              <div className="space-y-3">
                {recentReviews.map((review, i) => (
                  <div key={i} className="bg-white dark:bg-[#1A1310] rounded-lg border border-orange-100 dark:border-orange-900/20 p-3.5">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-bold text-[#1A1310] dark:text-white">{review.customer}</span>
                      <div className="flex items-center gap-0.5 text-amber-500">
                        {Array.from({ length: 5 }).map((_, s) => (
                          <FaStar key={s} size={10} className={s < review.rating ? "" : "opacity-20"} />
                        ))}
                      </div>
                    </div>
                    <p className="text-[12px] text-gray-600 dark:text-white/70 mb-1">{review.comment}</p>
                    <p className="text-[10px] text-gray-400 dark:text-white/40">{review.time}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}