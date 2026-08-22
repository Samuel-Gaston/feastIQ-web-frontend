"use client";

import { useState, useEffect } from "react";
import {
  FaMoneyBillWave,
  FaShoppingBag,
  FaChartLine,
  FaUsers,
  FaEllipsisV,
  FaArrowUp,
  FaArrowDown,
} from "react-icons/fa";
import OwnerTopbar from "@/app/components/restaurantTopbar";
import OwnerSidebar from "@/app/components/restaurantSidebar";
import { useLanguage } from "@/app/context/LanguageContext";

interface DishStat {
  name: string;
  category: string;
  orders: number;
  revenue: number;
}

const mockDishStats: DishStat[] = [
  { name: "Jollof Rice", category: "Lunch", orders: 33, revenue: 66000 },
  { name: "Grilled Chicken", category: "Dinner", orders: 28, revenue: 98000 },
  { name: "Fried Rice", category: "Lunch", orders: 24, revenue: 52800 },
  { name: "Spring Rolls", category: "Lunch", orders: 19, revenue: 28500 },
  { name: "Mango Juice", category: "Drinks", orders: 17, revenue: 8500 },
  { name: "Croissant", category: "Breakfast", orders: 15, revenue: 7500 },
  { name: "Fresh Mango Bowl", category: "Fruits", orders: 12, revenue: 9600 },
  { name: "Ndole with Plantain", category: "Lunch", orders: 11, revenue: 27500 },
  { name: "Bottled Water", category: "Drinks", orders: 20, revenue: 6000 },
  { name: "Ginger Drink", category: "Drinks", orders: 9, revenue: 3600 },
  { name: "Soft Drink", category: "Drinks", orders: 14, revenue: 7000 },
  { name: "Omelette", category: "Breakfast", orders: 8, revenue: 8000 },
];

const weeklyRevenue = [
  { day: "Mon", value: 65 },
  { day: "Tue", value: 80 },
  { day: "Wed", value: 55 },
  { day: "Thu", value: 90 },
  { day: "Fri", value: 95 },
  { day: "Sat", value: 100 },
  { day: "Sun", value: 85 },
];

export default function OwnerAnalyticsPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [range, setRange] = useState<"week" | "month">("week");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;
  const { t, lang } = useLanguage();
  const analyticsT = t.ownerAnalytics || {};

  useEffect(() => {
    setCurrentPage(1);
  }, [range]);

  const sortedDishes = [...mockDishStats].sort((a, b) => b.orders - a.orders);
  const totalPages = Math.max(1, Math.ceil(sortedDishes.length / pageSize));
  const paginatedDishes = sortedDishes.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const statsCards = [
    { title: analyticsT.totalRevenue || "Total Revenue", value: "184,500 XAF", change: "+14.2%", isPositive: true, icon: FaMoneyBillWave, color: "from-emerald-500 to-teal-600" },
    { title: analyticsT.totalOrders || "Total Orders", value: "38", change: "+9.1%", isPositive: true, icon: FaShoppingBag, color: "from-orange-500 to-amber-600" },
    { title: analyticsT.avgOrderValue || "Avg. Order Value", value: "4,855 XAF", change: "+3.4%", isPositive: true, icon: FaChartLine, color: "from-purple-500 to-pink-600" },
    { title: analyticsT.repeatCustomers || "Repeat Customers", value: "62%", change: "-1.8%", isPositive: false, icon: FaUsers, color: "from-blue-500 to-indigo-600" },
  ];

  return (
    <div style={{ fontFamily: "'Times New Roman', Times, serif" }} className="min-h-screen bg-white dark:bg-[#1A1310] text-[#1A1310] dark:text-white flex transition-colors duration-300">
      <OwnerSidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed((v) => !v)} />

      <div className="flex-1 flex flex-col min-w-0">
        <OwnerTopbar />

        <main className="flex-1 p-6 space-y-6 overflow-y-auto">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h1 className="text-2xl font-black text-[#1A1310] dark:text-white">
                {analyticsT.title || "Sales Analytics"}
              </h1>
              <p className="text-xs text-gray-500 dark:text-white/60 mt-0.5">
                {analyticsT.subtitle || "Track your restaurant's performance over time"}
              </p>
            </div>
            <div className="flex items-center gap-1 bg-orange-50/50 dark:bg-white/5 border border-orange-200 dark:border-orange-900/40 rounded-xl p-1">
              <button
                onClick={() => setRange("week")}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  range === "week"
                    ? "bg-gradient-to-r from-orange-500 to-red-600 text-white"
                    : "text-gray-600 dark:text-white/70 hover:bg-orange-100 dark:hover:bg-white/10"
                }`}
              >
                {analyticsT.thisWeek || "This Week"}
              </button>
              <button
                onClick={() => setRange("month")}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  range === "month"
                    ? "bg-gradient-to-r from-orange-500 to-red-600 text-white"
                    : "text-gray-600 dark:text-white/70 hover:bg-orange-100 dark:hover:bg-white/10"
                }`}
              >
                {analyticsT.thisMonth || "This Month"}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {statsCards.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div
                  key={idx}
                  className="bg-orange-50/30 dark:bg-[#241C17]/60 border border-orange-100 dark:border-orange-900/30 rounded-xl p-4 shadow-sm flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className={`w-9 h-9 rounded-lg bg-gradient-to-tr ${stat.color} flex items-center justify-center text-white shadow-sm`}>
                      <Icon size={15} />
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
                    <h3 className="text-xl font-black text-[#1A1310] dark:text-white mb-0.5">{stat.value}</h3>
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
                  {analyticsT.revenueTrendTitle || "Revenue Trend"}
                </h2>
                <p className="text-[11px] text-gray-500 dark:text-white/60">
                  {analyticsT.revenueTrendSub || "Daily revenue for the selected period"}
                </p>
              </div>
              <button className="text-gray-400 hover:text-gray-600 dark:hover:text-white cursor-pointer">
                <FaEllipsisV size={13} />
              </button>
            </div>

            <div className="h-56 flex items-end justify-between gap-2 pt-4 px-2 border-b border-orange-100 dark:border-orange-900/30 pb-2">
              {weeklyRevenue.map((bar, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                  <div className="w-full bg-orange-100 dark:bg-white/5 rounded-t-lg overflow-hidden h-full flex items-end">
                    <div
                      style={{ height: `${bar.value}%` }}
                      className="w-full bg-gradient-to-t from-orange-500 to-red-600 rounded-t-lg group-hover:opacity-90 transition-all shadow-sm"
                    />
                  </div>
                  <span className="text-[11px] font-semibold text-gray-500 dark:text-white/60">{bar.day}</span>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between pt-3 text-[11px] text-gray-500 dark:text-white/60">
              <span>{analyticsT.dailyAvg || "Daily average"}</span>
              <span className="text-orange-600 dark:text-orange-400 font-bold">
                +14.2% {analyticsT.vsLastWeek || "vs last week"}
              </span>
            </div>
          </div>

          <div className="bg-orange-50/30 dark:bg-[#241C17]/60 border border-orange-100 dark:border-orange-900/30 rounded-xl overflow-hidden shadow-sm">
            <div className="flex items-center justify-between p-5 pb-4">
              <div>
                <h2 className="text-base font-bold text-[#1A1310] dark:text-white">
                  {analyticsT.bestSellersTitle || "Best-Selling Dishes"}
                </h2>
                <p className="text-[11px] text-gray-500 dark:text-white/60">
                  {analyticsT.bestSellersSub || "Ranked by number of orders"}
                </p>
              </div>
            </div>

            <div className="overflow-x-auto" style={{ scrollbarWidth: "thin" }}>
              <table className="w-full text-left text-xs min-w-[500px]">
                <thead>
                  <tr className="border-b border-orange-100 dark:border-orange-900/30 text-[11px] text-gray-400 dark:text-white/40 uppercase tracking-wider">
                    <th className="px-5 py-3 font-bold">{analyticsT.colDish || "Dish"}</th>
                    <th className="px-5 py-3 font-bold">{analyticsT.colCategory || "Category"}</th>
                    <th className="px-5 py-3 font-bold">{analyticsT.colOrders || "Orders"}</th>
                    <th className="px-5 py-3 font-bold text-right">{analyticsT.colRevenue || "Revenue"}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-orange-100/50 dark:divide-orange-900/20 text-[13px]">
                  {paginatedDishes.map((dish, i) => (
                    <tr key={dish.name} className="hover:bg-orange-100/20 dark:hover:bg-white/5 transition-colors">
                      <td className="px-5 py-3.5 font-bold text-[#1A1310] dark:text-white whitespace-nowrap">
                        <div className="flex items-center gap-2.5">
                          <span className="w-5 h-5 rounded-md bg-gradient-to-tr from-orange-500 to-red-600 text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                            {(currentPage - 1) * pageSize + i + 1}
                          </span>
                          {dish.name}
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-gray-500 dark:text-white/60 whitespace-nowrap">{dish.category}</td>
                      <td className="px-5 py-3.5 text-gray-600 dark:text-white/80 whitespace-nowrap">{dish.orders}</td>
                      <td className="px-5 py-3.5 text-right font-mono font-semibold text-orange-600 dark:text-orange-400 whitespace-nowrap">
                        {dish.revenue.toLocaleString()} XAF
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between px-5 py-3 border-t border-orange-100 dark:border-orange-900/30">
              <p className="text-[11px] text-gray-500 dark:text-white/50">
                {analyticsT.paginationShowing || "Showing"} {(currentPage - 1) * pageSize + 1}
                –{Math.min(currentPage * pageSize, sortedDishes.length)} {analyticsT.paginationOf || "of"} {sortedDishes.length}
              </p>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold text-gray-600 dark:text-white/70 border border-orange-200 dark:border-orange-900/40 hover:bg-orange-50 dark:hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
                >
                  {analyticsT.prev || "Prev"}
                </button>
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-7 h-7 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
                      currentPage === i + 1
                        ? "bg-gradient-to-r from-orange-500 to-red-600 text-white"
                        : "text-gray-600 dark:text-white/70 hover:bg-orange-50 dark:hover:bg-white/5 border border-orange-200 dark:border-orange-900/40"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold text-gray-600 dark:text-white/70 border border-orange-200 dark:border-orange-900/40 hover:bg-orange-50 dark:hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
                >
                  {analyticsT.next || "Next"}
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}