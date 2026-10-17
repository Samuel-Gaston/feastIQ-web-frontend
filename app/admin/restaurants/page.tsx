"use client";

import {
  FaUtensils,
  FaCheckCircle,
  FaClock,
  FaBan,
  FaSearch,
  FaPlus,
  FaEye,
  FaEdit,
  FaTrash,
  FaChevronLeft,
  FaChevronRight,
  FaTimes,
} from "react-icons/fa";
import Topbar from "@/app/components/Topbar";
import Sidebar from "@/app/components/Sidebar";
import { useLanguage } from "@/app/context/LanguageContext";
import { useState, useEffect, useCallback } from "react";
import api from "@/app/api/api";

type Restaurant = {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  description: string;
  cuisineTags: string[];
  logoURL: string;
  openingAndClosingHours: string;
  status: string;
};

const emptyForm = {
  name: "",
  email: "",
  password: "",
  description: "",
  address: "",
  cuisineTags: "",
  logoURL: "",
  openingAndClosingHours: "",
  status: "PENDING",
};

const normalizeRestaurant = (r: any): Restaurant => ({
  id: String(r._id ?? r.id),
  name: r.name ?? "",
  email: r.email ?? r.user?.email ?? "",
  phone: r.phone ?? "",
  address: r.address ?? "",
  description: r.description ?? "",
  cuisineTags: Array.isArray(r.cuisineTags) ? r.cuisineTags : [],
  logoURL: r.logoURL ?? "",
  openingAndClosingHours: r.openingAndClosingHours ?? "",
  status: r.status ?? "PENDING",
});

const toTags = (value: string): string[] =>
  value.split(",").map((tag) => tag.trim()).filter(Boolean);

const getErrorMessage = (err: any, fallback: string): string => {
  if (!err?.response) return "Cannot reach the server. Check your connection.";
  const m = err.response?.data?.message;
  if (Array.isArray(m)) return m.join(", ");
  return m || fallback;
};

const FormError = ({ message }: { message: string | null }) =>
  message ? (
    <div
      role="alert"
      className="text-xs rounded-lg border border-red-200 dark:border-red-900/30 bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-300 px-3 py-2"
    >
      {message}
    </div>
  ) : null;

export default function AdminRestaurantsPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { t } = useLanguage();
  const restT = t.adminRestaurants || {};

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const [selectedRestaurant, setSelectedRestaurant] = useState<any>(null);
  const [formData, setFormData] = useState(emptyForm);

  const fetchRestaurants = useCallback(async () => {
    try {
      setLoadError(null);
      const res = await api.get("/restaurants");
      const raw = res.data?.data ?? res.data;
      const list = Array.isArray(raw) ? raw : raw?.items ?? [];
      setRestaurants(list.map(normalizeRestaurant));
    } catch (err) {
      setLoadError(getErrorMessage(err, "Could not load restaurants."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRestaurants();
  }, [fetchRestaurants]);

  const totalRestaurants = restaurants.length;
  const approvedRestaurants = restaurants.filter((r) => r.status === "APPROVED").length;
  const pendingRestaurants = restaurants.filter((r) => r.status === "PENDING").length;

  const filteredRestaurants = restaurants.filter((r) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      r.name.toLowerCase().includes(q) ||
      r.email.toLowerCase().includes(q) ||
      (r.address && r.address.toLowerCase().includes(q));
    const matchesFilter = statusFilter === "all" || r.status === statusFilter;
    return matchesSearch && matchesFilter;
  });

  const totalPages = Math.ceil(filteredRestaurants.length / itemsPerPage) || 1;
  const paginatedRestaurants = filteredRestaurants.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [totalPages, currentPage]);

  const openView = async (rest: Restaurant) => {
    setSelectedRestaurant(rest);
    setIsViewOpen(true);
    try {
      const res = await api.get(`/restaurants/${rest.id}`);
      const raw = res.data?.data ?? res.data;
      if (raw && typeof raw === "object") {
        setSelectedRestaurant({ ...rest, ...normalizeRestaurant(raw) });
      }
    } catch {}
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setFormError(null);
    try {
      const payload: Record<string, any> = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        status: formData.status,
      };
      if (formData.description.trim()) payload.description = formData.description.trim();
      if (formData.address.trim()) payload.address = formData.address.trim();
      if (formData.logoURL.trim()) payload.logoURL = formData.logoURL.trim();
      if (formData.openingAndClosingHours.trim()) payload.openingAndClosingHours = formData.openingAndClosingHours.trim();
      const tags = toTags(formData.cuisineTags);
      if (tags.length) payload.cuisineTags = tags;

      await api.post("/restaurants", payload);
      await fetchRestaurants();
      setFormData(emptyForm);
      setCurrentPage(1);
      setIsCreateOpen(false);
    } catch (err) {
      setFormError(getErrorMessage(err, "Could not create the restaurant."));
    } finally {
      setSaving(false);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setFormError(null);
    try {
      const payload: Record<string, any> = {
        name: formData.name.trim(),
        email: formData.email.trim(),
      };
      if (formData.address.trim()) payload.address = formData.address.trim();
      if (formData.openingAndClosingHours.trim()) payload.openingAndClosingHours = formData.openingAndClosingHours.trim();
      const tags = toTags(formData.cuisineTags);
      if (tags.length) payload.cuisineTags = tags;

      await api.patch(`/restaurants/${selectedRestaurant.id}`, payload);
      if (formData.status !== selectedRestaurant.status) {
        await api.patch(`/restaurants/${selectedRestaurant.id}/status`, { status: formData.status });
      }
      await fetchRestaurants();
      setIsEditOpen(false);
    } catch (err) {
      setFormError(getErrorMessage(err, "Could not update the restaurant."));
    } finally {
      setSaving(false);
    }
  };

  const handleStatusConfirm = async () => {
    setSaving(true);
    setFormError(null);
    try {
      const nextStatus = selectedRestaurant.status === "APPROVED" ? "SUSPENEDED" : "APPROVED";
      await api.patch(`/restaurants/${selectedRestaurant.id}/status`, { status: nextStatus });
      await fetchRestaurants();
      setIsStatusOpen(false);
    } catch (err) {
      setFormError(getErrorMessage(err, "Could not update the restaurant status."));
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteConfirm = async () => {
    setSaving(true);
    setFormError(null);
    try {
      await api.delete(`/restaurants/${selectedRestaurant.id}`);
      await fetchRestaurants();
      setIsDeleteOpen(false);
    } catch (err) {
      setFormError(getErrorMessage(err, "Could not delete the restaurant."));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ fontFamily: "'Times New Roman', Times, serif" }} className="min-h-screen bg-white dark:bg-[#1A1310] text-[#1A1310] dark:text-white flex transition-colors duration-300">
      <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed((v) => !v)} />

      <div className="flex-1 flex flex-col min-w-0">
        <Topbar />

        <main className="flex-1 p-6 space-y-6 overflow-y-auto">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-2xl font-black text-[#1A1310] dark:text-white">
                {restT.title || "Restaurants Management"}
              </h1>
              <p className="text-xs text-gray-500 dark:text-white/60 mt-0.5">
                {restT.subtitle || "Manage platform partner restaurants, approvals, and profiles."}
              </p>
            </div>
            <button
              onClick={() => {
                setFormData(emptyForm);
                setFormError(null);
                setIsCreateOpen(true);
              }}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-orange-600 hover:bg-orange-700 text-white shadow-sm transition-all"
            >
              <FaPlus size={12} /> {restT.createRestaurant || "Add Restaurant"}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div
              onClick={() => { setStatusFilter("all"); setCurrentPage(1); }}
              className={`cursor-pointer bg-orange-50/30 dark:bg-[#241C17]/60 border ${statusFilter === "all" ? "border-orange-500 dark:border-orange-500" : "border-orange-100 dark:border-orange-900/30"} rounded-xl p-4 shadow-sm flex items-center justify-between transition-all`}
            >
              <div>
                <p className="text-[11px] font-semibold text-gray-500 dark:text-white/60">{restT.totalCard || "Total Restaurants"}</p>
                <h3 className="text-2xl font-black text-[#1A1310] dark:text-white mt-1">{totalRestaurants}</h3>
              </div>
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <FaUtensils size={18} />
              </div>
            </div>

            <div
              onClick={() => { setStatusFilter("APPROVED"); setCurrentPage(1); }}
              className={`cursor-pointer bg-orange-50/30 dark:bg-[#241C17]/60 border ${statusFilter === "APPROVED" ? "border-emerald-500 dark:border-emerald-500" : "border-orange-100 dark:border-orange-900/30"} rounded-xl p-4 shadow-sm flex items-center justify-between transition-all`}
            >
              <div>
                <p className="text-[11px] font-semibold text-gray-500 dark:text-white/60">{restT.approvedCard || "Approved"}</p>
                <h3 className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">{approvedRestaurants}</h3>
              </div>
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <FaCheckCircle size={18} />
              </div>
            </div>

            <div
              onClick={() => { setStatusFilter("PENDING"); setCurrentPage(1); }}
              className={`cursor-pointer bg-orange-50/30 dark:bg-[#241C17]/60 border ${statusFilter === "PENDING" ? "border-amber-500 dark:border-amber-500" : "border-orange-100 dark:border-orange-900/30"} rounded-xl p-4 shadow-sm flex items-center justify-between transition-all`}
            >
              <div>
                <p className="text-[11px] font-semibold text-gray-500 dark:text-white/60">{restT.pendingCard || "Pending Approval"}</p>
                <h3 className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1">{pendingRestaurants}</h3>
              </div>
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <FaClock size={18} />
              </div>
            </div>
          </div>

          {loadError && (
            <div
              role="alert"
              className="flex items-center justify-between gap-3 text-xs rounded-xl border border-red-200 dark:border-red-900/30 bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-300 px-4 py-3"
            >
              <span>{loadError}</span>
              <button
                onClick={() => { setLoading(true); fetchRestaurants(); }}
                className="px-3 py-1.5 rounded-lg bg-red-600 text-white font-bold hover:bg-red-700"
              >
                Retry
              </button>
            </div>
          )}

          <div className="bg-orange-50/30 dark:bg-[#241C17]/60 border border-orange-100 dark:border-orange-900/30 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="relative w-full sm:w-80">
                <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={13} />
                <input
                  type="text"
                  placeholder={restT.searchPlaceholder || "Search restaurants..."}
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                  className="w-full pl-9 pr-4 py-2 text-xs bg-white dark:bg-[#1A1310] border border-orange-200 dark:border-orange-900/40 rounded-lg text-[#1A1310] dark:text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <span className="text-xs text-gray-500 dark:text-white/60 font-semibold">Status:</span>
                <select
                  value={statusFilter}
                  onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
                  className="px-3 py-2 text-xs bg-white dark:bg-[#1A1310] border border-orange-200 dark:border-orange-900/40 rounded-lg text-[#1A1310] dark:text-white focus:outline-none focus:border-orange-500"
                >
                  <option value="all">All Statuses</option>
                  <option value="APPROVED">Approved</option>
                  <option value="PENDING">Pending</option>
                  <option value="SUSPENEDED">Suspended</option>
                </select>
              </div>
            </div>

            <div
              className="overflow-x-auto w-full pb-2"
              style={{
                scrollbarWidth: "thin",
                scrollbarColor: "rgba(234, 88, 12, 0.4) transparent",
              }}
            >
              <table className="w-full text-left text-xs min-w-[700px]">
                <thead>
                  <tr className="border-b border-orange-100 dark:border-orange-900/30 text-[13px] text-gray-400 dark:text-white/40 uppercase tracking-wider">
                    <th className="pb-2.5 font-bold">Restaurant Name</th>
                    <th className="pb-2.5 font-bold">Email</th>
                    <th className="pb-2.5 font-bold">Cuisine Tags</th>
                    <th className="pb-2.5 font-bold">Hours</th>
                    <th className="pb-2.5 font-bold">Status</th>
                    <th className="pb-2.5 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-orange-100/50 dark:divide-orange-900/20 text-[13px]">
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="py-6 text-center text-gray-400 dark:text-white/40 text-xs">
                        Loading restaurants...
                      </td>
                    </tr>
                  ) : paginatedRestaurants.length > 0 ? (
                    paginatedRestaurants.map((rest) => (
                      <tr key={rest.id} className="hover:bg-orange-100/20 dark:hover:bg-white/5 transition-colors">
                        <td className="py-3 font-bold text-[#1A1310] dark:text-white whitespace-nowrap flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-orange-500/10 text-orange-600 flex items-center justify-center font-bold text-xs">
                            {rest.name.charAt(0)}
                          </div>
                          {rest.name}
                        </td>
                        <td className="py-3 text-gray-600 dark:text-white/80 whitespace-nowrap">
                          {rest.email}
                        </td>
                        <td className="py-3 whitespace-nowrap">
                          <div className="flex gap-1 flex-wrap">
                            {rest.cuisineTags.map((tag, idx) => (
                              <span key={idx} className="px-2 py-0.5 rounded-md text-[10px] bg-orange-100 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 font-semibold">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="py-3 text-gray-500 dark:text-white/60 whitespace-nowrap">
                          {rest.openingAndClosingHours || "N/A"}
                        </td>
                        <td className="py-3 whitespace-nowrap">
                          {rest.status === "APPROVED" && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400">
                              Approved
                            </span>
                          )}
                          {rest.status === "PENDING" && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-100 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400">
                              Pending
                            </span>
                          )}
                          {rest.status === "SUSPENEDED" && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-red-100 dark:bg-red-950/50 text-red-600 dark:text-red-400">
                              Suspended
                            </span>
                          )}
                        </td>
                        <td className="py-3 text-right whitespace-nowrap">
                          <div className="inline-flex items-center gap-2">
                            <button
                              onClick={() => openView(rest)}
                              title="View Details"
                              className="p-1.5 rounded-lg bg-blue-100/50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 hover:bg-blue-200 transition-colors"
                            >
                              <FaEye size={12} />
                            </button>
                            <button
                              onClick={() => { setSelectedRestaurant(rest); setFormError(null); setIsStatusOpen(true); }}
                              title="Toggle Status"
                              className="p-1.5 rounded-lg bg-amber-100/50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 hover:bg-amber-200 transition-colors"
                            >
                              <FaBan size={12} />
                            </button>
                            <button
                              onClick={() => {
                                setSelectedRestaurant(rest);
                                setFormData({
                                  name: rest.name,
                                  email: rest.email,
                                  password: "",
                                  description: rest.description,
                                  address: rest.address,
                                  cuisineTags: rest.cuisineTags.join(", "),
                                  logoURL: rest.logoURL,
                                  openingAndClosingHours: rest.openingAndClosingHours,
                                  status: rest.status,
                                });
                                setFormError(null);
                                setIsEditOpen(true);
                              }}
                              title="Edit Restaurant"
                              className="p-1.5 rounded-lg bg-orange-100/50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 hover:bg-orange-200 transition-colors"
                            >
                              <FaEdit size={12} />
                            </button>
                            <button
                              onClick={() => { setSelectedRestaurant(rest); setFormError(null); setIsDeleteOpen(true); }}
                              title="Delete Restaurant"
                              className="p-1.5 rounded-lg bg-red-100/50 dark:bg-red-950/40 text-red-600 dark:text-red-400 hover:bg-red-200 transition-colors"
                            >
                              <FaTrash size={12} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="py-6 text-center text-gray-400 dark:text-white/40 text-xs">
                        No restaurants found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-between pt-3 border-t border-orange-100 dark:border-orange-900/30 text-xs">
                <span className="text-gray-500 dark:text-white/60">
                  Page {currentPage} of {totalPages}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg border border-orange-200 dark:border-orange-900/40 disabled:opacity-40 text-gray-600 dark:text-white hover:bg-orange-100/30 transition-colors"
                  >
                    <FaChevronLeft size={10} />
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-1 rounded-lg font-bold transition-all ${
                        currentPage === page
                          ? "bg-orange-600 text-white shadow-sm"
                          : "border border-orange-200 dark:border-orange-900/40 text-gray-600 dark:text-white hover:bg-orange-100/30"
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg border border-orange-200 dark:border-orange-900/40 disabled:opacity-40 text-gray-600 dark:text-white hover:bg-orange-100/30 transition-colors"
                  >
                    <FaChevronRight size={10} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white dark:bg-[#241C17] border border-orange-200 dark:border-orange-900/40 rounded-2xl w-full max-w-lg p-6 shadow-xl space-y-4 my-8">
            <div className="flex items-center justify-between border-b border-orange-100 dark:border-orange-900/30 pb-3">
              <h3 className="text-base font-bold text-[#1A1310] dark:text-white">Register New Restaurant</h3>
              <button onClick={() => setIsCreateOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-white">
                <FaTimes size={16} />
              </button>
            </div>
            <form onSubmit={handleCreateSubmit} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-white/70 mb-1">Restaurant Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-orange-50/30 dark:bg-[#1A1310] border border-orange-200 dark:border-orange-900/40 rounded-lg focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-white/70 mb-1">Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="Enter email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-orange-50/30 dark:bg-[#1A1310] border border-orange-200 dark:border-orange-900/40 rounded-lg focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-white/70 mb-1">Password *</label>
                  <input
                    type="password"
                    required
                    placeholder="Enter password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-orange-50/30 dark:bg-[#1A1310] border border-orange-200 dark:border-orange-900/40 rounded-lg focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-white/70 mb-1">Cuisine Tags (comma separated)</label>
                  <input
                    type="text"
                    placeholder="e.g. African, Fast Food"
                    value={formData.cuisineTags}
                    onChange={(e) => setFormData({ ...formData, cuisineTags: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-orange-50/30 dark:bg-[#1A1310] border border-orange-200 dark:border-orange-900/40 rounded-lg focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-white/70 mb-1">Address</label>
                <input
                  type="text"
                  placeholder="Enter restaurant location"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-orange-50/30 dark:bg-[#1A1310] border border-orange-200 dark:border-orange-900/40 rounded-lg focus:outline-none focus:border-orange-500"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-white/70 mb-1">Opening & Closing Hours</label>
                  <input
                    type="text"
                    placeholder="e.g. 08:00 - 22:00"
                    value={formData.openingAndClosingHours}
                    onChange={(e) => setFormData({ ...formData, openingAndClosingHours: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-orange-50/30 dark:bg-[#1A1310] border border-orange-200 dark:border-orange-900/40 rounded-lg focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-white/70 mb-1">Logo URL</label>
                  <input
                    type="text"
                    placeholder="https://..."
                    value={formData.logoURL}
                    onChange={(e) => setFormData({ ...formData, logoURL: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-orange-50/30 dark:bg-[#1A1310] border border-orange-200 dark:border-orange-900/40 rounded-lg focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-white/70 mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="Brief description of the restaurant..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-orange-50/30 dark:bg-[#1A1310] border border-orange-200 dark:border-orange-900/40 rounded-lg focus:outline-none focus:border-orange-500 resize-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-white/70 mb-1">Initial Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-orange-50/30 dark:bg-[#1A1310] border border-orange-200 dark:border-orange-900/40 rounded-lg focus:outline-none focus:border-orange-500"
                >
                  <option value="PENDING">PENDING</option>
                  <option value="APPROVED">APPROVED</option>
                </select>
              </div>
              <FormError message={formError} />
              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="px-4 py-2 rounded-lg border border-orange-200 dark:border-orange-900/40 text-xs font-bold hover:bg-orange-100/30"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 rounded-lg bg-orange-600 text-white text-xs font-bold hover:bg-orange-700 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? "Saving..." : "Save Restaurant"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isViewOpen && selectedRestaurant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-[#241C17] border border-orange-200 dark:border-orange-900/40 rounded-2xl w-full max-w-md p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-orange-100 dark:border-orange-900/30 pb-3">
              <h3 className="text-base font-bold text-[#1A1310] dark:text-white">Restaurant Details</h3>
              <button onClick={() => setIsViewOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-white">
                <FaTimes size={16} />
              </button>
            </div>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1.5 border-b border-orange-100/50 dark:border-orange-900/20">
                <span className="font-semibold text-gray-500 dark:text-white/60">Name:</span>
                <span className="font-bold text-[#1A1310] dark:text-white">{selectedRestaurant.name}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-orange-100/50 dark:border-orange-900/20">
                <span className="font-semibold text-gray-500 dark:text-white/60">Email:</span>
                <span className="text-[#1A1310] dark:text-white">{selectedRestaurant.email}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-orange-100/50 dark:border-orange-900/20">
                <span className="font-semibold text-gray-500 dark:text-white/60">Phone:</span>
                <span className="text-[#1A1310] dark:text-white">{selectedRestaurant.phone || "N/A"}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-orange-100/50 dark:border-orange-900/20">
                <span className="font-semibold text-gray-500 dark:text-white/60">Address:</span>
                <span className="text-[#1A1310] dark:text-white">{selectedRestaurant.address || "N/A"}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-orange-100/50 dark:border-orange-900/20">
                <span className="font-semibold text-gray-500 dark:text-white/60">Cuisine Tags:</span>
                <span className="text-[#1A1310] dark:text-white">{selectedRestaurant.cuisineTags?.join(", ") || "N/A"}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-orange-100/50 dark:border-orange-900/20">
                <span className="font-semibold text-gray-500 dark:text-white/60">Hours:</span>
                <span className="text-[#1A1310] dark:text-white">{selectedRestaurant.openingAndClosingHours || "N/A"}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="font-semibold text-gray-500 dark:text-white/60">Status:</span>
                <span className="font-bold text-orange-600 dark:text-orange-400">{selectedRestaurant.status}</span>
              </div>
            </div>
            <div className="flex justify-end pt-2">
              <button
                onClick={() => setIsViewOpen(false)}
                className="px-4 py-2 rounded-lg bg-orange-600 text-white text-xs font-bold hover:bg-orange-700 shadow-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {isEditOpen && selectedRestaurant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white dark:bg-[#241C17] border border-orange-200 dark:border-orange-900/40 rounded-2xl w-full max-w-lg p-6 shadow-xl space-y-4 my-8">
            <div className="flex items-center justify-between border-b border-orange-100 dark:border-orange-900/30 pb-3">
              <h3 className="text-base font-bold text-[#1A1310] dark:text-white">Edit Restaurant</h3>
              <button onClick={() => setIsEditOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-white">
                <FaTimes size={16} />
              </button>
            </div>
            <form onSubmit={handleEditSubmit} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-white/70 mb-1">Restaurant Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-orange-50/30 dark:bg-[#1A1310] border border-orange-200 dark:border-orange-900/40 rounded-lg focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-white/70 mb-1">Email *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-orange-50/30 dark:bg-[#1A1310] border border-orange-200 dark:border-orange-900/40 rounded-lg focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-white/70 mb-1">Cuisine Tags</label>
                  <input
                    type="text"
                    value={formData.cuisineTags}
                    onChange={(e) => setFormData({ ...formData, cuisineTags: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-orange-50/30 dark:bg-[#1A1310] border border-orange-200 dark:border-orange-900/40 rounded-lg focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-white/70 mb-1">Hours</label>
                  <input
                    type="text"
                    value={formData.openingAndClosingHours}
                    onChange={(e) => setFormData({ ...formData, openingAndClosingHours: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-orange-50/30 dark:bg-[#1A1310] border border-orange-200 dark:border-orange-900/40 rounded-lg focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-white/70 mb-1">Address</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-orange-50/30 dark:bg-[#1A1310] border border-orange-200 dark:border-orange-900/40 rounded-lg focus:outline-none focus:border-orange-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-white/70 mb-1">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-orange-50/30 dark:bg-[#1A1310] border border-orange-200 dark:border-orange-900/40 rounded-lg focus:outline-none focus:border-orange-500"
                >
                  <option value="PENDING">PENDING</option>
                  <option value="APPROVED">APPROVED</option>
                  <option value="SUSPENEDED">SUSPENEDED</option>
                </select>
              </div>
              <FormError message={formError} />
              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsEditOpen(false)}
                  className="px-4 py-2 rounded-lg border border-orange-200 dark:border-orange-900/40 text-xs font-bold hover:bg-orange-100/30"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 rounded-lg bg-orange-600 text-white text-xs font-bold hover:bg-orange-700 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? "Saving..." : "Update Restaurant"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isStatusOpen && selectedRestaurant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-[#241C17] border border-orange-200 dark:border-orange-900/40 rounded-2xl w-full max-w-sm p-6 shadow-xl space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto">
              <FaBan size={20} />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#1A1310] dark:text-white">
                {selectedRestaurant.status === "APPROVED" ? "Suspend Restaurant?" : "Approve Restaurant?"}
              </h3>
              <p className="text-xs text-gray-500 dark:text-white/60 mt-1">
                Change status for <span className="font-bold text-[#1A1310] dark:text-white">{selectedRestaurant.name}</span>?
              </p>
            </div>
            <FormError message={formError} />
            <div className="flex justify-center gap-2 pt-2">
              <button
                onClick={() => setIsStatusOpen(false)}
                className="px-4 py-2 rounded-lg border border-orange-200 dark:border-orange-900/40 text-xs font-bold hover:bg-orange-100/30"
              >
                Cancel
              </button>
              <button
                onClick={handleStatusConfirm}
                disabled={saving}
                className="px-4 py-2 rounded-lg bg-amber-600 text-white text-xs font-bold hover:bg-amber-700 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? "Saving..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}

      {isDeleteOpen && selectedRestaurant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-[#241C17] border border-orange-200 dark:border-orange-900/40 rounded-2xl w-full max-w-sm p-6 shadow-xl space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-950/50 text-red-600 dark:text-red-400 flex items-center justify-center mx-auto">
              <FaTrash size={20} />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#1A1310] dark:text-white">Delete Restaurant?</h3>
              <p className="text-xs text-gray-500 dark:text-white/60 mt-1">
                This will permanently remove <span className="font-bold text-[#1A1310] dark:text-white">{selectedRestaurant.name}</span>.
              </p>
            </div>
            <FormError message={formError} />
            <div className="flex justify-center gap-2 pt-2">
              <button
                onClick={() => setIsDeleteOpen(false)}
                className="px-4 py-2 rounded-lg border border-orange-200 dark:border-orange-900/40 text-xs font-bold hover:bg-orange-100/30"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={saving}
                className="px-4 py-2 rounded-lg bg-red-600 text-white text-xs font-bold hover:bg-red-700 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}