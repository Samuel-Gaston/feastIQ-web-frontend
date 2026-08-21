"use client";

import { 
  FaBell, 
  FaCheck, 
  FaCheckDouble, 
  FaPaperPlane, 
  FaBullhorn, 
  FaExclamationCircle,
  FaCheckCircle,
  FaFilter
} from "react-icons/fa";
import Topbar from "@/app/components/Topbar";
import Sidebar from "@/app/components/Sidebar";
import { useLanguage } from "@/app/context/LanguageContext";
import { useState, useEffect } from "react";

interface NotificationItem {
  _id: string;
  title: string;
  body?: string;
  type: string;
  isRead: boolean;
  createdAt: string;
}

export default function AdminNotificationsPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { t } = useLanguage();
  const notifT = t.notifications || {};

  const [notifications, setNotifications] = useState<NotificationItem[]>([
    // Mock initial list to preview UI structure before real API hookup
    {
      _id: "1",
      title: "System Maintenance Scheduled",
      body: "The platform will undergo scheduled routine database maintenance tonight at 02:00 AM.",
      type: "SYSTEM",
      isRead: false,
      createdAt: new Date().toISOString(),
    },
    {
      _id: "2",
      title: "New Restaurant Onboarded",
      body: "Golden Spoon Restaurant has successfully completed registration and is pending approval.",
      type: "PROMO",
      isRead: true,
      createdAt: new Date(Date.now() - 86400000).toISOString(),
    }
  ]);

  const [filterType, setFilterType] = useState<string>("ALL");
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Broadcast Form State
  const [broadcastData, setBroadcastData] = useState({
    title: "",
    body: "",
    type: "PROMO",
    targetRole: "",
  });

  const clearMessages = () => {
    setSuccessMsg(null);
    setErrorMsg(null);
  };

  const handleMarkAsRead = (id: string) => {
    clearMessages();
    // API Call: PATCH /notifications/:id/read
    setNotifications(prev =>
      prev.map(n => (n._id === id ? { ...n, isRead: true } : n))
    );
    setSuccessMsg("Notification marked as read");
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  const handleMarkAllAsRead = () => {
    clearMessages();
    // API Call: PATCH /notifications/read-all
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    setSuccessMsg("All notifications marked as read");
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  const handleBroadcastSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();

    if (!broadcastData.title) {
      setErrorMsg("Title is required for broadcasting.");
      return;
    }

    // API Call: POST /notifications/broadcast with body { dto }
    setSuccessMsg(`Broadcast successfully sent to target audience!`);
    setBroadcastData({ title: "", body: "", type: "PROMO", targetRole: "" });
    setTimeout(() => setSuccessMsg(null), 4000);
  };

  const filteredNotifications = notifications.filter(n => {
    if (filterType === "UNREAD") return !n.isRead;
    if (filterType === "READ") return n.isRead;
    return true;
  });

  return (
    <div style={{ fontFamily: "'Times New Roman', Times, serif" }} className="min-h-screen bg-white dark:bg-[#1A1310] text-[#1A1310] dark:text-white flex transition-colors duration-300">
      <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(v => !v)} />

      <div className="flex-1 flex flex-col min-w-0">
        <Topbar />

        <main className="flex-1 p-6 space-y-6 overflow-y-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-black text-[#1A1310] dark:text-white flex items-center gap-2">
                <FaBell className="text-orange-600" size={20} />
                {notifT.title || "Notification Management"}
              </h1>
              <p className="text-xs text-gray-500 dark:text-white/60 mt-0.5">
                {notifT.subtitle || "View personal notifications, system updates, and dispatch platform-wide broadcasts."}
              </p>
            </div>

            <button
              onClick={handleMarkAllAsRead}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-orange-100 hover:bg-orange-200 dark:bg-orange-950/50 dark:hover:bg-orange-900/60 text-orange-600 dark:text-orange-400 transition-all self-start sm:self-auto"
            >
              <FaCheckDouble size={12} />
              {notifT.markAllRead || "Mark All as Read"}
            </button>
          </div>

          {/* Feedback Banners */}
          {successMsg && (
            <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 text-emerald-700 dark:text-emerald-400 text-xs font-semibold flex items-center gap-2">
              <FaCheckCircle size={14} />
              <span>{successMsg}</span>
            </div>
          )}

          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-400 text-xs font-semibold flex items-center gap-2">
              <FaExclamationCircle size={14} />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column: Broadcast Announcement Form (Admin Only action) */}
            <div className="bg-orange-50/30 dark:bg-[#241C17]/60 border border-orange-100 dark:border-orange-900/30 rounded-xl p-6 shadow-sm h-fit space-y-4">
              <div className="border-b border-orange-100 dark:border-orange-900/30 pb-3 flex items-center gap-2">
                <FaBullhorn className="text-orange-600" size={16} />
                <h2 className="text-base font-bold text-[#1A1310] dark:text-white">
                  {notifT.broadcastTitle || "Send Broadcast"}
                </h2>
              </div>

              <form onSubmit={handleBroadcastSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-white/70 mb-1">
                    Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Announcement Title"
                    value={broadcastData.title}
                    onChange={(e) => setBroadcastData({ ...broadcastData, title: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-white dark:bg-[#1A1310] border border-orange-200 dark:border-orange-900/40 rounded-lg text-[#1A1310] dark:text-white focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-white/70 mb-1">
                    Body Message
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Type broadcast message details..."
                    value={broadcastData.body}
                    onChange={(e) => setBroadcastData({ ...broadcastData, body: e.target.value })}
                    className="w-full p-3 text-xs bg-white dark:bg-[#1A1310] border border-orange-200 dark:border-orange-900/40 rounded-lg text-[#1A1310] dark:text-white focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 dark:text-white/70 mb-1">
                      Type
                    </label>
                    <select
                      value={broadcastData.type}
                      onChange={(e) => setBroadcastData({ ...broadcastData, type: e.target.value })}
                      className="w-full px-2 py-2 text-xs bg-white dark:bg-[#1A1310] border border-orange-200 dark:border-orange-900/40 rounded-lg text-[#1A1310] dark:text-white focus:outline-none focus:border-orange-500"
                    >
                      <option value="PROMO">PROMO</option>
                      <option value="SYSTEM">SYSTEM</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-600 dark:text-white/70 mb-1">
                      Target Role
                    </label>
                    <select
                      value={broadcastData.targetRole}
                      onChange={(e) => setBroadcastData({ ...broadcastData, targetRole: e.target.value })}
                      className="w-full px-2 py-2 text-xs bg-white dark:bg-[#1A1310] border border-orange-200 dark:border-orange-900/40 rounded-lg text-[#1A1310] dark:text-white focus:outline-none focus:border-orange-500"
                    >
                      <option value="">Everyone</option>
                      <option value="ADMIN">ADMIN</option>
                      <option value="RESTAURANT">RESTAURANT</option>
                      <option value="CUSTOMER">CUSTOMER</option>
                    </select>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-orange-600 hover:bg-orange-700 text-white shadow-sm transition-all"
                  >
                    <FaPaperPlane size={12} />
                    {notifT.sendBroadcast || "Send Broadcast"}
                  </button>
                </div>
              </form>
            </div>

            {/* Right Column: Notifications Feed List */}
            <div className="lg:col-span-2 bg-orange-50/30 dark:bg-[#241C17]/60 border border-orange-100 dark:border-orange-900/30 rounded-xl p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-orange-100 dark:border-orange-900/30 pb-3">
                <h2 className="text-base font-bold text-[#1A1310] dark:text-white flex items-center gap-2">
                  <FaBell size={14} className="text-orange-600" />
                  {notifT.inboxTitle || "Inbox Feed"}
                </h2>

                {/* Filter Selector */}
                <div className="flex items-center gap-1.5 text-xs">
                  <FaFilter className="text-gray-400" size={10} />
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="bg-white dark:bg-[#1A1310] border border-orange-200 dark:border-orange-900/40 rounded-lg px-2 py-1 text-xs text-[#1A1310] dark:text-white focus:outline-none"
                  >
                    <option value="ALL">All</option>
                    <option value="UNREAD">Unread</option>
                    <option value="READ">Read</option>
                  </select>
                </div>
              </div>

              {/* Feed List Items */}
              <div className="space-y-3">
                {filteredNotifications.length === 0 ? (
                  <div className="text-center py-12 text-gray-400 text-xs">
                    No notifications available.
                  </div>
                ) : (
                  filteredNotifications.map((item) => (
                    <div
                      key={item._id}
                      className={`p-4 rounded-xl border transition-all flex items-start justify-between gap-4 ${
                        item.isRead
                          ? "bg-white/50 dark:bg-[#1A1310]/40 border-orange-100 dark:border-orange-900/20 text-gray-500 dark:text-white/60"
                          : "bg-white dark:bg-[#1A1310] border-orange-200 dark:border-orange-900/50 shadow-sm text-[#1A1310] dark:text-white"
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            item.type === "SYSTEM" 
                              ? "bg-blue-100 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400" 
                              : "bg-orange-100 dark:bg-orange-950/50 text-orange-600 dark:text-orange-400"
                          }`}>
                            {item.type}
                          </span>
                          <h3 className="text-xs font-bold">{item.title}</h3>
                        </div>
                        {item.body && (
                          <p className="text-xs text-gray-600 dark:text-white/70 pl-0.5">
                            {item.body}
                          </p>
                        )}
                        <span className="block text-[10px] text-gray-400 pt-1">
                          {new Date(item.createdAt).toLocaleString()}
                        </span>
                      </div>

                      {!item.isRead && (
                        <button
                          onClick={() => handleMarkAsRead(item._id)}
                          title="Mark as read"
                          className="p-2 rounded-lg bg-orange-100/60 hover:bg-orange-200 dark:bg-orange-950/50 dark:hover:bg-orange-900 text-orange-600 dark:text-orange-400 transition-colors shrink-0"
                        >
                          <FaCheck size={12} />
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}