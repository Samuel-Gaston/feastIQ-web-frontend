"use client";

import {
  FaUsers,
  FaUserCheck,
  FaUserTimes,
  FaSearch,
  FaPlus,
  FaEye,
  FaBan,
  FaEdit,
  FaTrash,
  FaChevronLeft,
  FaChevronRight,
  FaTimes,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaLock,
  FaUser,
} from "react-icons/fa";
import Topbar from "@/app/components/Topbar";
import Sidebar from "@/app/components/Sidebar";
import { useLanguage } from "@/app/context/LanguageContext";
import { useState, useEffect, useCallback } from "react";
import api from "@/app/api/api";

type Customer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  status: "active" | "inactive";
  ordersCount?: number;
};

const emptyForm = { name: "", email: "", password: "", phone: "", address: "" };

const normalizeCustomer = (c: any): Customer => ({
  id: String(c._id ?? c.id),
  name: c.name ?? c.user?.name ?? "",
  email: c.email ?? c.user?.email ?? "",
  phone: c.phone ?? "",
  address: c.address ?? "",
  status: (c.user?.isActive ?? c.isActive ?? true) ? "active" : "inactive",
  ordersCount: c.ordersCount,
});

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

export default function AdminCustomersPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { t } = useLanguage();
  const custT = t.adminCustomers || {};

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isSuspendOpen, setIsSuspendOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [formData, setFormData] = useState(emptyForm);

  const fetchCustomers = useCallback(async () => {
    try {
      setLoadError(null);
      const res = await api.get("/customers");
      const raw = res.data?.data ?? res.data;
      const list = Array.isArray(raw) ? raw : raw?.items ?? [];
      setCustomers(list.map(normalizeCustomer));
    } catch (err) {
      setLoadError(getErrorMessage(err, "Could not load customers."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const totalCustomers = customers.length;
  const activeCustomers = customers.filter((c) => c.status === "active").length;
  const inactiveCustomers = customers.filter((c) => c.status === "inactive").length;

  const filteredCustomers = customers.filter((c) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      c.name.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      (c.phone && c.phone.includes(searchQuery));
    const matchesFilter = statusFilter === "all" || c.status === statusFilter;
    return matchesSearch && matchesFilter;
  });

  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage) || 1;
  const paginatedCustomers = filteredCustomers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [totalPages, currentPage]);

  const openView = async (cust: Customer) => {
    setSelectedCustomer(cust);
    setIsViewOpen(true);
    try {
      const res = await api.get(`/customers/${cust.id}`);
      const raw = res.data?.data ?? res.data;
      if (raw && typeof raw === "object") {
        setSelectedCustomer({ ...cust, ...normalizeCustomer(raw) });
      }
    } catch {}
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setFormError(null);
    try {
      const payload: Record<string, string> = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
      };
      if (formData.phone.trim()) payload.phone = formData.phone.trim();
      if (formData.address.trim()) payload.address = formData.address.trim();

      await api.post("/customers", payload);
      await fetchCustomers();
      setFormData(emptyForm);
      setCurrentPage(1);
      setIsCreateOpen(false);
    } catch (err) {
      setFormError(getErrorMessage(err, "Could not create the customer."));
    } finally {
      setSaving(false);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setFormError(null);
    try {
      const payload: Record<string, string> = {
        name: formData.name.trim(),
        email: formData.email.trim(),
      };
      if (formData.phone.trim()) payload.phone = formData.phone.trim();
      if (formData.address.trim()) payload.address = formData.address.trim();

      await api.patch(`/customers/${selectedCustomer.id}`, payload);
      await fetchCustomers();
      setIsEditOpen(false);
    } catch (err) {
      setFormError(getErrorMessage(err, "Could not update the customer."));
    } finally {
      setSaving(false);
    }
  };

  const handleSuspendConfirm = async () => {
    setSaving(true);
    setFormError(null);
    try {
      const nextActive = selectedCustomer.status !== "active";
      await api.patch(`/customers/${selectedCustomer.id}/status`, { isActive: nextActive });
      await fetchCustomers();
      setIsSuspendOpen(false);
    } catch (err) {
      setFormError(getErrorMessage(err, "Could not update the customer status."));
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteConfirm = async () => {
    setSaving(true);
    setFormError(null);
    try {
      await api.delete(`/customers/${selectedCustomer.id}`);
      await fetchCustomers();
      setIsDeleteOpen(false);
    } catch (err) {
      setFormError(getErrorMessage(err, "Could not delete the customer."));
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
                {custT.title}
              </h1>
              <p className="text-xs text-gray-500 dark:text-white/60 mt-0.5">
                {custT.subtitle}
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
              <FaPlus size={12} /> {custT.createCustomer}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div
              onClick={() => { setStatusFilter("all"); setCurrentPage(1); }}
              className={`cursor-pointer bg-orange-50/30 dark:bg-[#241C17]/60 border ${statusFilter === "all" ? "border-orange-500 dark:border-orange-500" : "border-orange-100 dark:border-orange-900/30"} rounded-xl p-4 shadow-sm flex items-center justify-between transition-all`}
            >
              <div>
                <p className="text-[11px] font-semibold text-gray-500 dark:text-white/60">{custT.totalCard}</p>
                <h3 className="text-2xl font-black text-[#1A1310] dark:text-white mt-1">{totalCustomers}</h3>
              </div>
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <FaUsers size={18} />
              </div>
            </div>

            <div
              onClick={() => { setStatusFilter("active"); setCurrentPage(1); }}
              className={`cursor-pointer bg-orange-50/30 dark:bg-[#241C17]/60 border ${statusFilter === "active" ? "border-emerald-500 dark:border-emerald-500" : "border-orange-100 dark:border-orange-900/30"} rounded-xl p-4 shadow-sm flex items-center justify-between transition-all`}
            >
              <div>
                <p className="text-[11px] font-semibold text-gray-500 dark:text-white/60">{custT.activeCard}</p>
                <h3 className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">{activeCustomers}</h3>
              </div>
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <FaUserCheck size={18} />
              </div>
            </div>

            <div
              onClick={() => { setStatusFilter("inactive"); setCurrentPage(1); }}
              className={`cursor-pointer bg-orange-50/30 dark:bg-[#241C17]/60 border ${statusFilter === "inactive" ? "border-amber-500 dark:border-amber-500" : "border-orange-100 dark:border-orange-900/30"} rounded-xl p-4 shadow-sm flex items-center justify-between transition-all`}
            >
              <div>
                <p className="text-[11px] font-semibold text-gray-500 dark:text-white/60">{custT.inactiveCard}</p>
                <h3 className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1">{inactiveCustomers}</h3>
              </div>
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <FaUserTimes size={18} />
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
                onClick={() => { setLoading(true); fetchCustomers(); }}
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
                  placeholder={custT.searchPlaceholder}
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                  className="w-full pl-9 pr-4 py-2 text-xs bg-white dark:bg-[#1A1310] border border-orange-200 dark:border-orange-900/40 rounded-lg text-[#1A1310] dark:text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <span className="text-xs text-gray-500 dark:text-white/60 font-semibold">{custT.filterLabel}:</span>
                <select
                  value={statusFilter}
                  onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
                  className="px-3 py-2 text-xs bg-white dark:bg-[#1A1310] border border-orange-200 dark:border-orange-900/40 rounded-lg text-[#1A1310] dark:text-white focus:outline-none focus:border-orange-500"
                >
                  <option value="all">{custT.filterAll}</option>
                  <option value="active">{custT.filterActive}</option>
                  <option value="inactive">{custT.filterInactive}</option>
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
                    <th className="pb-2.5 font-bold">{custT.colName}</th>
                    <th className="pb-2.5 font-bold">{custT.colEmail}</th>
                    <th className="pb-2.5 font-bold">{custT.colPhone}</th>
                    <th className="pb-2.5 font-bold">{custT.colAddress}</th>
                    <th className="pb-2.5 font-bold">{custT.colStatus}</th>
                    <th className="pb-2.5 font-bold text-right">{custT.colActions}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-orange-100/50 dark:divide-orange-900/20 text-[13px]">
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="py-6 text-center text-gray-400 dark:text-white/40 text-xs">
                        Loading customers...
                      </td>
                    </tr>
                  ) : paginatedCustomers.length > 0 ? (
                    paginatedCustomers.map((cust) => (
                      <tr key={cust.id} className="hover:bg-orange-100/20 dark:hover:bg-white/5 transition-colors">
                        <td className="py-3 font-bold text-[#1A1310] dark:text-white whitespace-nowrap">
                          {cust.name}
                        </td>
                        <td className="py-3 text-gray-600 dark:text-white/80 whitespace-nowrap">
                          {cust.email}
                        </td>
                        <td className="py-3 text-gray-500 dark:text-white/60 whitespace-nowrap">
                          {cust.phone || "N/A"}
                        </td>
                        <td className="py-3 text-gray-500 dark:text-white/60 max-w-[150px] truncate">
                          {cust.address || "N/A"}
                        </td>
                        <td className="py-3 whitespace-nowrap">
                          {cust.status === "active" ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400">
                              {custT.statusActive}
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-100 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400">
                              {custT.statusInactive}
                            </span>
                          )}
                        </td>
                        <td className="py-3 text-right whitespace-nowrap">
                          <div className="inline-flex items-center gap-2">
                            <button
                              onClick={() => openView(cust)}
                              title={custT.actionView}
                              className="p-1.5 rounded-lg bg-blue-100/50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 hover:bg-blue-200 transition-colors"
                            >
                              <FaEye size={12} />
                            </button>
                            <button
                              onClick={() => { setSelectedCustomer(cust); setFormError(null); setIsSuspendOpen(true); }}
                              title={custT.actionSuspend}
                              className="p-1.5 rounded-lg bg-amber-100/50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 hover:bg-amber-200 transition-colors"
                            >
                              <FaBan size={12} />
                            </button>
                            <button
                              onClick={() => {
                                setSelectedCustomer(cust);
                                setFormData({ name: cust.name, email: cust.email, password: "", phone: cust.phone || "", address: cust.address || "" });
                                setFormError(null);
                                setIsEditOpen(true);
                              }}
                              title={custT.actionEdit}
                              className="p-1.5 rounded-lg bg-orange-100/50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 hover:bg-orange-200 transition-colors"
                            >
                              <FaEdit size={12} />
                            </button>
                            <button
                              onClick={() => { setSelectedCustomer(cust); setFormError(null); setIsDeleteOpen(true); }}
                              title={custT.actionDelete}
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
                        {custT.noCustomersFound}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-between pt-3 border-t border-orange-100 dark:border-orange-900/30 text-xs">
                <span className="text-gray-500 dark:text-white/60">
                  {custT.pageText || "Page"} {currentPage} {custT.ofText || "of"} {totalPages}
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-[#241C17] border border-orange-200 dark:border-orange-900/40 rounded-2xl w-full max-w-md p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-orange-100 dark:border-orange-900/30 pb-3">
              <h3 className="text-base font-bold text-[#1A1310] dark:text-white">{custT.modalCreateTitle || "Create New Customer"}</h3>
              <button onClick={() => setIsCreateOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-white">
                <FaTimes size={16} />
              </button>
            </div>
            <form onSubmit={handleCreateSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-white/70 mb-1">{custT.colName} *</label>
                <div className="relative">
                  <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={12} />
                  <input
                    type="text"
                    required
                    minLength={2}
                    maxLength={50}
                    placeholder="Enter name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 text-xs bg-orange-50/30 dark:bg-[#1A1310] border border-orange-200 dark:border-orange-900/40 rounded-lg focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-white/70 mb-1">{custT.colEmail} *</label>
                <div className="relative">
                  <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={12} />
                  <input
                    type="email"
                    required
                    placeholder="Enter email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 text-xs bg-orange-50/30 dark:bg-[#1A1310] border border-orange-200 dark:border-orange-900/40 rounded-lg focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-white/70 mb-1">Password *</label>
                <div className="relative">
                  <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={12} />
                  <input
                    type="password"
                    required
                    placeholder="Enter password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 text-xs bg-orange-50/30 dark:bg-[#1A1310] border border-orange-200 dark:border-orange-900/40 rounded-lg focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-white/70 mb-1">{custT.colPhone}</label>
                <div className="relative">
                  <FaPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={12} />
                  <input
                    type="text"
                    minLength={2}
                    maxLength={50}
                    placeholder="Enter phone number"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 text-xs bg-orange-50/30 dark:bg-[#1A1310] border border-orange-200 dark:border-orange-900/40 rounded-lg focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-white/70 mb-1">{custT.colAddress}</label>
                <div className="relative">
                  <FaMapMarkerAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={12} />
                  <input
                    type="text"
                    minLength={2}
                    maxLength={50}
                    placeholder="Enter address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 text-xs bg-orange-50/30 dark:bg-[#1A1310] border border-orange-200 dark:border-orange-900/40 rounded-lg focus:outline-none focus:border-orange-500"
                  />
                </div>
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
                  {saving ? "Saving..." : "Save Customer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isViewOpen && selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-[#241C17] border border-orange-200 dark:border-orange-900/40 rounded-2xl w-full max-w-md p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-orange-100 dark:border-orange-900/30 pb-3">
              <h3 className="text-base font-bold text-[#1A1310] dark:text-white">Customer Details</h3>
              <button onClick={() => setIsViewOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-white">
                <FaTimes size={16} />
              </button>
            </div>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1.5 border-b border-orange-100/50 dark:border-orange-900/20">
                <span className="font-semibold text-gray-500 dark:text-white/60">{custT.colName}:</span>
                <span className="font-bold text-[#1A1310] dark:text-white">{selectedCustomer.name}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-orange-100/50 dark:border-orange-900/20">
                <span className="font-semibold text-gray-500 dark:text-white/60">{custT.colEmail}:</span>
                <span className="text-[#1A1310] dark:text-white">{selectedCustomer.email}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-orange-100/50 dark:border-orange-900/20">
                <span className="font-semibold text-gray-500 dark:text-white/60">{custT.colPhone}:</span>
                <span className="text-[#1A1310] dark:text-white">{selectedCustomer.phone || "N/A"}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-orange-100/50 dark:border-orange-900/20">
                <span className="font-semibold text-gray-500 dark:text-white/60">{custT.colAddress}:</span>
                <span className="text-[#1A1310] dark:text-white">{selectedCustomer.address || "N/A"}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-orange-100/50 dark:border-orange-900/20">
                <span className="font-semibold text-gray-500 dark:text-white/60">{custT.colStatus}:</span>
                <span className="capitalize font-bold text-orange-600 dark:text-orange-400">{selectedCustomer.status}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="font-semibold text-gray-500 dark:text-white/60">Total Orders:</span>
                <span className="font-bold text-[#1A1310] dark:text-white">{selectedCustomer.ordersCount ?? "N/A"}</span>
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

      {isEditOpen && selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-[#241C17] border border-orange-200 dark:border-orange-900/40 rounded-2xl w-full max-w-md p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-orange-100 dark:border-orange-900/30 pb-3">
              <h3 className="text-base font-bold text-[#1A1310] dark:text-white">Edit Customer</h3>
              <button onClick={() => setIsEditOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-white">
                <FaTimes size={16} />
              </button>
            </div>
            <form onSubmit={handleEditSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-white/70 mb-1">{custT.colName} *</label>
                <input
                  type="text"
                  required
                  minLength={2}
                  maxLength={50}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-orange-50/30 dark:bg-[#1A1310] border border-orange-200 dark:border-orange-900/40 rounded-lg focus:outline-none focus:border-orange-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-white/70 mb-1">{custT.colEmail} *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-orange-50/30 dark:bg-[#1A1310] border border-orange-200 dark:border-orange-900/40 rounded-lg focus:outline-none focus:border-orange-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-white/70 mb-1">{custT.colPhone}</label>
                <input
                  type="text"
                  minLength={2}
                  maxLength={50}
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-orange-50/30 dark:bg-[#1A1310] border border-orange-200 dark:border-orange-900/40 rounded-lg focus:outline-none focus:border-orange-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-white/70 mb-1">{custT.colAddress}</label>
                <input
                  type="text"
                  minLength={2}
                  maxLength={50}
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-orange-50/30 dark:bg-[#1A1310] border border-orange-200 dark:border-orange-900/40 rounded-lg focus:outline-none focus:border-orange-500"
                />
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
                  {saving ? "Saving..." : "Update Customer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isSuspendOpen && selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-[#241C17] border border-orange-200 dark:border-orange-900/40 rounded-2xl w-full max-w-sm p-6 shadow-xl space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto">
              <FaBan size={20} />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#1A1310] dark:text-white">
                {selectedCustomer.status === "active" ? "Suspend Customer?" : "Activate Customer?"}
              </h3>
              <p className="text-xs text-gray-500 dark:text-white/60 mt-1">
                Are you sure you want to change the status of <span className="font-bold text-[#1A1310] dark:text-white">{selectedCustomer.name}</span>?
              </p>
            </div>
            <FormError message={formError} />
            <div className="flex justify-center gap-2 pt-2">
              <button
                onClick={() => setIsSuspendOpen(false)}
                className="px-4 py-2 rounded-lg border border-orange-200 dark:border-orange-900/40 text-xs font-bold hover:bg-orange-100/30"
              >
                Cancel
              </button>
              <button
                onClick={handleSuspendConfirm}
                disabled={saving}
                className="px-4 py-2 rounded-lg bg-amber-600 text-white text-xs font-bold hover:bg-amber-700 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? "Saving..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}

      {isDeleteOpen && selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-[#241C17] border border-orange-200 dark:border-orange-900/40 rounded-2xl w-full max-w-sm p-6 shadow-xl space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-950/50 text-red-600 dark:text-red-400 flex items-center justify-center mx-auto">
              <FaTrash size={20} />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#1A1310] dark:text-white">Delete Customer?</h3>
              <p className="text-xs text-gray-500 dark:text-white/60 mt-1">
                This action is permanent and will remove <span className="font-bold text-[#1A1310] dark:text-white">{selectedCustomer.name}</span> from the database.
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