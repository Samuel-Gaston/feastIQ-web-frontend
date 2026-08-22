"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  FaTachometerAlt,
  FaUtensils,
  FaClipboardList,
  FaChartBar,
  FaStar,
  FaStoreAlt,
  FaCog,
  FaSignOutAlt
} from "react-icons/fa";
import { useLanguage } from "@/app/context/LanguageContext";
import Logo from "@/app/components/Logo";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface OwnerSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export default function OwnerSidebar({ collapsed, onToggle }: OwnerSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useLanguage();
  const sidebarT = t?.ownerSidebar || {};

  const goToDashboard = () => router.push("/restaurant/dashboard");
  const goToMenu = () => router.push("/restaurant/menu");
  const goToOrders = () => router.push("/restaurant/orders");
  const goToAnalytics = () => router.push("/restaurant/analytics");
  const goToReviews = () => router.push("/restaurant/reviews");
  const goToRestaurantProfile = () => router.push("/restaurant/restaurant-profile");
  const goToSettings = () => router.push("/restaurant/settings");

  const handleLogout = async (closeToast: () => void) => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          },
        });
      }
    } catch (err) {
      console.error("Server logout failed, proceeding with local clear:", err);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      router.push("/auth/login");
      closeToast();
    }
  };

  const LogoutConfirmation = ({ closeToast }: any) => (
    <div>
      <p className="text-gray-200 font-medium mb-2 text-[13px]">
        {sidebarT.logoutConfirmation || "Are you sure you want to logout?"}
      </p>
      <div className="flex gap-2 justify-end">
        <button
          onClick={closeToast}
          className="px-2 py-1 rounded bg-gray-700 text-gray-200 text-xs hover:bg-gray-600 cursor-pointer"
        >
          {sidebarT.cancel || "Cancel"}
        </button>
        <button
          style={{ cursor: 'pointer' }}
          onClick={() => handleLogout(closeToast)}
          className="px-2 py-1 rounded bg-red-600 text-white text-xs hover:bg-red-500"
        >
          {sidebarT.logout || "Logout"}
        </button>
      </div>
    </div>
  );

  const triggerLogoutToast = () => {
    toast(({ closeToast }) => <LogoutConfirmation closeToast={closeToast} />, {
      position: "bottom-left",
      autoClose: false,
      closeOnClick: false,
      closeButton: false,
      draggable: false,
      theme: "dark",
      icon: <FaSignOutAlt style={{ cursor: 'pointer' }} size={16} className="text-red-400 cursor-pointer" />,
    });
  };

  const getLiClass = (path: string) => {
    const isActive = pathname === path || (path !== "/restaurant/dashboard" && pathname?.startsWith(path + "/"));
    return `flex items-center cursor-pointer transition-colors duration-150 relative group ${
      collapsed ? "justify-center" : "gap-2"
    } ${
      isActive
        ? "bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-sm shadow-orange-500/25 border-l-2 border-red-700 font-semibold"
        : "bg-orange-50/40 dark:bg-[#241C17] text-gray-700 dark:text-white/90 hover:bg-orange-100/60 dark:hover:bg-orange-950/40 hover:text-orange-600 dark:hover:text-white border-l-2 border-transparent"
    }`;
  };

  const liStyle = { padding: collapsed ? "10px 0" : "7px 16px", fontSize: "0.82rem" };

  return (
    <>
      <ToastContainer toastStyle={{ background: "#241C17", border: "1px solid rgba(234, 88, 12, 0.2)", borderRadius: "8px" }} />

      <div
        className="flex flex-col bg-orange-50/40 dark:bg-[#241C17] border-r border-orange-100 dark:border-orange-900/30 sticky top-0 transition-all duration-300 animate-fade-in shrink-0"
        style={{ width: collapsed ? 68 : 220, height: "100vh" }}
      >
        <div
          className="font-bold text-orange-600 dark:text-orange-400 border-b border-orange-100 dark:border-orange-900/30 tracking-tight flex items-center justify-between"
          style={{ padding: "14px 16px", fontSize: "1rem", minHeight: "53px" }}
        >
          <div className="flex items-center gap-3 overflow-hidden" onClick={goToDashboard} style={{ cursor: 'pointer' }}>
            <div className="shrink-0">
              <Logo size={collapsed ? 22 : 28} />
            </div>
          </div>
          <button
            onClick={onToggle}
            className="text-orange-600 dark:text-orange-400 hover:text-red-500 dark:hover:text-red-400 bg-transparent border-none cursor-pointer focus:outline-none shrink-0"
            style={{ fontSize: 20 }}
          >
            {collapsed ? "≫" : "≪"}
          </button>
        </div>

        <ul className="list-none flex-1 overflow-y-auto py-2" style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(234, 88, 12, 0.2) transparent" }}>

          <div>
            {!collapsed && (
              <li className="text-orange-600/70 dark:text-orange-400/70 font-bold uppercase tracking-widest cursor-default" style={{ padding: "12px 16px 4px", fontSize: "0.62rem" }}>
                {sidebarT.overview || "Overview"}
              </li>
            )}
            <li onClick={goToDashboard} className={getLiClass("/restaurant/dashboard")} style={liStyle}>
              <FaTachometerAlt size={16} className={pathname === "/restaurant/dashboard" ? "text-white" : "text-orange-500"} />
              {!collapsed && <span>{sidebarT.dashboard || "Dashboard"}</span>}
            </li>
          </div>

          <div>
            {!collapsed && (
              <li className="text-orange-600/70 dark:text-orange-400/70 font-bold uppercase tracking-widest cursor-default" style={{ padding: "12px 16px 4px", fontSize: "0.62rem" }}>
                {sidebarT.restaurant || "Restaurant"}
              </li>
            )}
            <li onClick={goToMenu} className={getLiClass("/restaurant/menu")} style={liStyle}>
              <FaUtensils size={14} className={pathname.startsWith("/restaurant/menu") ? "text-white" : "text-orange-500"} />
              {!collapsed && <span>{sidebarT.menu || "Menu Manager"}</span>}
            </li>
            <li onClick={goToOrders} className={getLiClass("/restaurant/orders")} style={liStyle}>
              <FaClipboardList size={14} className={pathname.startsWith("/restaurant/orders") ? "text-white" : "text-orange-500"} />
              {!collapsed && <span>{sidebarT.orders || "Order Inbox"}</span>}
            </li>
            <li onClick={goToRestaurantProfile} className={getLiClass("/restaurant/restaurant-profile")} style={liStyle}>
              <FaStoreAlt size={14} className={pathname.startsWith("/restaurant/restaurant-profile") ? "text-white" : "text-orange-500"} />
              {!collapsed && <span>{sidebarT.restaurantProfile || "Restaurant Profile"}</span>}
            </li>
          </div>

          <div>
            {!collapsed && (
              <li className="text-orange-600/70 dark:text-orange-400/70 font-bold uppercase tracking-widest cursor-default" style={{ padding: "12px 16px 4px", fontSize: "0.62rem" }}>
                {sidebarT.insights || "Insights"}
              </li>
            )}
            <li onClick={goToAnalytics} className={getLiClass("/restaurant/analytics")} style={liStyle}>
              <FaChartBar size={14} className={pathname.startsWith("/restaurant/analytics") ? "text-white" : "text-orange-500"} />
              {!collapsed && <span>{sidebarT.analytics || "Sales Analytics"}</span>}
            </li>
            <li onClick={goToReviews} className={getLiClass("/restaurant/reviews")} style={liStyle}>
              <FaStar size={14} className={pathname.startsWith("/restaurant/reviews") ? "text-white" : "text-orange-500"} />
              {!collapsed && <span className="flex-1">{sidebarT.reviews || "Reviews"}</span>}
            </li>
            <li onClick={goToSettings} className={getLiClass("/restaurant/settings")} style={liStyle}>
              <FaCog size={16} className={pathname.startsWith("/restaurant/settings") ? "text-white" : "text-orange-500"} />
              {!collapsed && <span>{sidebarT.settings || "Settings"}</span>}
            </li>
          </div>

        </ul>

        <div className="border-t border-orange-100 dark:border-orange-900/30 flex flex-col gap-2" style={{ padding: "12px 14px" }}>
          <div className={`flex items-center ${collapsed ? "justify-center" : "gap-2"}`}>
            <div
              className="rounded-full bg-gradient-to-r from-orange-500 to-red-600 flex items-center justify-center font-bold text-white shrink-0 shadow-sm"
              style={{ width: 28, height: 28, fontSize: "0.65rem" }}
            >
              RO
            </div>
            <div className={`transition-all duration-200 ${collapsed ? "w-0 opacity-0 overflow-hidden pointer-events-none" : "w-auto opacity-100"}`}>
              <div className="font-bold text-orange-600 dark:text-orange-400" style={{ fontSize: "0.78rem" }}>{sidebarT.ownerLabel || "Owner"}</div>
              <div className="text-gray-500 dark:text-white/60" style={{ fontSize: "0.65rem" }}>{sidebarT.restaurantOwner || "Restaurant Owner"}</div>
            </div>
          </div>

          <button
            onClick={triggerLogoutToast}
            className={`flex items-center justify-center border border-orange-200 dark:border-orange-900/30 rounded-md bg-transparent cursor-pointer text-orange-600 dark:text-orange-400 hover:border-red-500 dark:hover:border-red-400 hover:text-red-500 dark:hover:text-red-400 transition-colors duration-150 ${
              collapsed ? "px-0" : "gap-2 w-full"
            }`}
            style={{ fontSize: "0.76rem", padding: "6px", cursor: 'pointer' }}
          >
            <FaSignOutAlt size={14} />
            <span style={{ cursor: 'pointer' }} className={collapsed ? "w-0 opacity-0 overflow-hidden hidden" : ""}>
              {sidebarT.logout || "Logout"}
            </span>
          </button>
        </div>
      </div>
    </>
  );
}