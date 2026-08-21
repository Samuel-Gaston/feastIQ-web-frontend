"use client";

import { 
  FaShieldAlt, 
  FaCheckCircle, 
  FaLock, 
  FaSearch, 
  FaPlus, 
  FaEye, 
  FaEdit, 
  FaTrash, 
  FaChevronLeft, 
  FaChevronRight,
  FaTimes,
  FaBan
} from "react-icons/fa";
import Topbar from "@/app/components/Topbar";
import Sidebar from "@/app/components/Sidebar";
import { useLanguage } from "@/app/context/LanguageContext";
import { useState } from "react";

export default function AdminRolesPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { t } = useLanguage();
  const roleT = t.adminRoles || {};

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [roles, setRoles] = useState([
    { id: 1, name: "Admin", description: "Full system administration privileges across all modules.", isSystem: true, isActive: true, usersCount: 2 },
    { id: 2, name: "Customer", description: "Standard client account for browsing restaurants and placing orders.", isSystem: true, isActive: true, usersCount: 145 },
    { id: 3, name: "Restaurant Owner", description: "Manages restaurant menus, incoming orders, and operational status.", isSystem: false, isActive: true, usersCount: 12 },
    { id: 4, name: "Moderator", description: "Reviews user content, handles dispute resolution and support inquiries.", isSystem: false, isActive: true, usersCount: 4 },
    { id: 5, name: "Delivery Driver", description: "Assigned to fulfillment and order delivery tracking pipelines.", isSystem: false, isActive: false, usersCount: 0 }
  ]);

  // Modal States
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const [selectedRole, setSelectedRole] = useState<any>(null);

  // Form States (matching Role Schema)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    isSystem: false,
    isActive: true,
  });

  const totalRoles = roles.length;
  const activeRoles = roles.filter(r => r.isActive).length;
  const systemRoles = roles.filter(r => r.isSystem).length;

  const filteredRoles = roles.filter(r => {
    const matchesSearch = (r.name && r.name.toLowerCase().includes(searchQuery.toLowerCase())) || 
                          (r.description && r.description.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesFilter = statusFilter === "all" || 
                          (statusFilter === "active" && r.isActive) || 
                          (statusFilter === "inactive" && !r.isActive) ||
                          (statusFilter === "system" && r.isSystem);
    return matchesSearch && matchesFilter;
  });

  const totalPages = Math.ceil(filteredRoles.length / itemsPerPage) || 1;
  const paginatedRoles = filteredRoles.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newRole = {
      id: roles.length + 1,
      name: formData.name,
      description: formData.description,
      isSystem: formData.isSystem,
      isActive: formData.isActive,
      usersCount: 0,
    };
    setRoles([newRole, ...roles]);
    setFormData({ name: "", description: "", isSystem: false, isActive: true });
    setIsCreateOpen(false);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRoles(roles.map(r => r.id === selectedRole.id ? { 
      ...r, 
      name: formData.name,
      description: formData.description,
      isSystem: formData.isSystem,
      isActive: formData.isActive,
    } : r));
    setIsEditOpen(false);
  };

  const handleStatusConfirm = () => {
    setRoles(roles.map(r => {
      if (r.id === selectedRole.id) {
        return { ...r, isActive: !r.isActive };
      }
      return r;
    }));
    setIsStatusOpen(false);
  };

  const handleDeleteConfirm = () => {
    setRoles(roles.filter(r => r.id !== selectedRole.id));
    setIsDeleteOpen(false);
  };

  return (
    <div style={{ fontFamily: "'Times New Roman', Times, serif" }} className="min-h-screen bg-white dark:bg-[#1A1310] text-[#1A1310] dark:text-white flex transition-colors duration-300">
      <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(v => !v)} />

      <div className="flex-1 flex flex-col min-w-0">
        <Topbar />

        <main className="flex-1 p-6 space-y-6 overflow-y-auto">
          {/* Page Header */}
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-2xl font-black text-[#1A1310] dark:text-white">
                {roleT.title || "Roles Management"}
              </h1>
              <p className="text-xs text-gray-500 dark:text-white/60 mt-0.5">
                {roleT.subtitle || "Configure system roles, descriptions, access privileges, and system protection."}
              </p>
            </div>
            <button 
              onClick={() => {
                setFormData({ name: "", description: "", isSystem: false, isActive: true });
                setIsCreateOpen(true);
              }}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-orange-600 hover:bg-orange-700 text-white shadow-sm transition-all"
            >
              <FaPlus size={12} /> {roleT.createRole || "Add Role"}
            </button>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div 
              onClick={() => { setStatusFilter("all"); setCurrentPage(1); }}
              className={`cursor-pointer bg-orange-50/30 dark:bg-[#241C17]/60 border ${statusFilter === "all" ? "border-orange-500" : "border-orange-100 dark:border-orange-900/30"} rounded-xl p-4 shadow-sm flex items-center justify-between transition-all`}
            >
              <div>
                <p className="text-[11px] font-semibold text-gray-500 dark:text-white/60">{roleT.totalCard || "Total Roles"}</p>
                <h3 className="text-2xl font-black text-[#1A1310] dark:text-white mt-1">{totalRoles}</h3>
              </div>
              <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-600 dark:text-orange-400 flex items-center justify-center">
                <FaShieldAlt size={18} />
              </div>
            </div>

            <div 
              onClick={() => { setStatusFilter("active"); setCurrentPage(1); }}
              className={`cursor-pointer bg-orange-50/30 dark:bg-[#241C17]/60 border ${statusFilter === "active" ? "border-emerald-500" : "border-orange-100 dark:border-orange-900/30"} rounded-xl p-4 shadow-sm flex items-center justify-between transition-all`}
            >
              <div>
                <p className="text-[11px] font-semibold text-gray-500 dark:text-white/60">{roleT.activeCard || "Active Roles"}</p>
                <h3 className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">{activeRoles}</h3>
              </div>
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <FaCheckCircle size={18} />
              </div>
            </div>

            <div 
              onClick={() => { setStatusFilter("system"); setCurrentPage(1); }}
              className={`cursor-pointer bg-orange-50/30 dark:bg-[#241C17]/60 border ${statusFilter === "system" ? "border-blue-500" : "border-orange-100 dark:border-orange-900/30"} rounded-xl p-4 shadow-sm flex items-center justify-between transition-all`}
            >
              <div>
                <p className="text-[11px] font-semibold text-gray-500 dark:text-white/60">{roleT.systemCard || "System Roles"}</p>
                <h3 className="text-2xl font-black text-blue-600 dark:text-blue-400 mt-1">{systemRoles}</h3>
              </div>
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <FaLock size={18} />
              </div>
            </div>
          </div>

          {/* Search & Table Section */}
          <div className="bg-orange-50/30 dark:bg-[#241C17]/60 border border-orange-100 dark:border-orange-900/30 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="relative w-full sm:w-80">
                <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={13} />
                <input 
                  type="text"
                  placeholder={roleT.searchPlaceholder || "Search roles..."}
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                  className="w-full pl-9 pr-4 py-2 text-xs bg-white dark:bg-[#1A1310] border border-orange-200 dark:border-orange-900/40 rounded-lg text-[#1A1310] dark:text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <span className="text-xs text-gray-500 dark:text-white/60 font-semibold">Filter:</span>
                <select 
                  value={statusFilter}
                  onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
                  className="px-3 py-2 text-xs bg-white dark:bg-[#1A1310] border border-orange-200 dark:border-orange-900/40 rounded-lg text-[#1A1310] dark:text-white focus:outline-none focus:border-orange-500"
                >
                  <option value="all">All Roles</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="system">System Protected</option>
                </select>
              </div>
            </div>

            {/* Table */}
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
                    <th className="pb-2.5 font-bold">{roleT.colName || "Role Name"}</th>
                    <th className="pb-2.5 font-bold">{roleT.colDescription || "Description"}</th>
                    <th className="pb-2.5 font-bold">{roleT.colSystem || "System Role"}</th>
                    <th className="pb-2.5 font-bold">{roleT.colStatus || "Status"}</th>
                    <th className="pb-2.5 font-bold text-right">{roleT.colActions || "Actions"}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-orange-100/50 dark:divide-orange-900/20 text-[13px]">
                  {paginatedRoles.length > 0 ? (
                    paginatedRoles.map((role) => (
                      <tr key={role.id} className="hover:bg-orange-100/20 dark:hover:bg-white/5 transition-colors">
                        <td className="py-3 font-bold text-[#1A1310] dark:text-white whitespace-nowrap flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-orange-500/10 text-orange-600 flex items-center justify-center font-bold text-xs">
                            {role.name ? role.name.charAt(0) : "R"}
                          </div>
                          {role.name || "Unnamed Role"}
                        </td>
                        <td className="py-3 text-gray-600 dark:text-white/80 max-w-xs truncate">
                          {role.description || "No description provided."}
                        </td>
                        <td className="py-3 whitespace-nowrap">
                          {role.isSystem ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] bg-blue-100 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-semibold">
                              <FaLock size={9} /> Protected
                            </span>
                          ) : (
                            <span className="px-2.5 py-0.5 rounded-md text-[11px] bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-white/70 font-semibold">
                              Custom
                            </span>
                          )}
                        </td>
                        <td className="py-3 whitespace-nowrap">
                          {role.isActive ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400">
                              Active
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-red-100 dark:bg-red-950/50 text-red-600 dark:text-red-400">
                              Inactive
                            </span>
                          )}
                        </td>
                        <td className="py-3 text-right whitespace-nowrap">
                          <div className="inline-flex items-center gap-2">
                            <button 
                              onClick={() => { setSelectedRole(role); setIsViewOpen(true); }}
                              title="View Details" 
                              className="p-1.5 rounded-lg bg-blue-100/50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 hover:bg-blue-200 transition-colors"
                            >
                              <FaEye size={12} />
                            </button>
                            <button 
                              onClick={() => { setSelectedRole(role); setIsStatusOpen(true); }}
                              title="Toggle Active Status" 
                              className="p-1.5 rounded-lg bg-amber-100/50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 hover:bg-amber-200 transition-colors"
                            >
                              <FaBan size={12} />
                            </button>
                            <button 
                              onClick={() => { 
                                setSelectedRole(role); 
                                setFormData({ 
                                  name: role.name || "", 
                                  description: role.description || "", 
                                  isSystem: role.isSystem ?? false, 
                                  isActive: role.isActive ?? true 
                                });
                                setIsEditOpen(true); 
                              }}
                              title="Edit Role" 
                              className="p-1.5 rounded-lg bg-orange-100/50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 hover:bg-orange-200 transition-colors"
                            >
                              <FaEdit size={12} />
                            </button>
                            <button 
                              onClick={() => { setSelectedRole(role); setIsDeleteOpen(true); }}
                              title="Delete Role" 
                              disabled={role.isSystem}
                              className="p-1.5 rounded-lg bg-red-100/50 dark:bg-red-950/40 text-red-600 dark:text-red-400 hover:bg-red-200 disabled:opacity-30 transition-colors"
                            >
                              <FaTrash size={12} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="py-6 text-center text-gray-400 dark:text-white/40 text-xs">
                        {roleT.noRolesFound || "No roles found."}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between pt-3 border-t border-orange-100 dark:border-orange-900/30 text-xs">
                <span className="text-gray-500 dark:text-white/60">
                  Page {currentPage} of {totalPages}
                </span>
                <div className="flex items-center gap-1">
                  <button 
                    onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
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
                    onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
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

      {/* CREATE ROLE MODAL */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white dark:bg-[#241C17] border border-orange-200 dark:border-orange-900/40 rounded-2xl w-full max-w-md p-6 shadow-xl space-y-4 my-8">
            <div className="flex items-center justify-between border-b border-orange-100 dark:border-orange-900/30 pb-3">
              <h3 className="text-base font-bold text-[#1A1310] dark:text-white">Create New Role</h3>
              <button onClick={() => setIsCreateOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-white">
                <FaTimes size={16} />
              </button>
            </div>
            <form onSubmit={handleCreateSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-white/70 mb-1">Role Name *</label>
                <input 
                  type="text" 
                  required 
                  placeholder="e.g. Supervisor"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3 py-2 text-xs bg-orange-50/30 dark:bg-[#1A1310] border border-orange-200 dark:border-orange-900/40 rounded-lg focus:outline-none focus:border-orange-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-white/70 mb-1">Description</label>
                <textarea 
                  rows={3}
                  placeholder="Describe role responsibilities..."
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-3 py-2 text-xs bg-orange-50/30 dark:bg-[#1A1310] border border-orange-200 dark:border-orange-900/40 rounded-lg focus:outline-none focus:border-orange-500"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                  <input 
                    type="checkbox"
                    checked={formData.isSystem}
                    onChange={(e) => setFormData({...formData, isSystem: e.target.checked})}
                    className="rounded border-orange-300 text-orange-600 focus:ring-orange-500"
                  />
                  <span>System Role</span>
                </label>
                <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                  <input 
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                    className="rounded border-orange-300 text-orange-600 focus:ring-orange-500"
                  />
                  <span>Is Active</span>
                </label>
              </div>
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
                  className="px-4 py-2 rounded-lg bg-orange-600 text-white text-xs font-bold hover:bg-orange-700 shadow-sm"
                >
                  Save Role
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VIEW ROLE MODAL */}
      {isViewOpen && selectedRole && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-[#241C17] border border-orange-200 dark:border-orange-900/40 rounded-2xl w-full max-w-md p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-orange-100 dark:border-orange-900/30 pb-3">
              <h3 className="text-base font-bold text-[#1A1310] dark:text-white">Role Details</h3>
              <button onClick={() => setIsViewOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-white">
                <FaTimes size={16} />
              </button>
            </div>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1.5 border-b border-orange-100/50 dark:border-orange-900/20">
                <span className="font-semibold text-gray-500 dark:text-white/60">Role Name:</span>
                <span className="font-bold text-[#1A1310] dark:text-white">{selectedRole.name}</span>
              </div>
              <div className="py-1.5 border-b border-orange-100/50 dark:border-orange-900/20">
                <span className="font-semibold text-gray-500 dark:text-white/60 block mb-1">Description:</span>
                <p className="text-[#1A1310] dark:text-white bg-orange-50/20 dark:bg-[#1A1310] p-2.5 rounded-lg border border-orange-100 dark:border-orange-900/30">
                  {selectedRole.description || "No description provided."}
                </p>
              </div>
              <div className="flex justify-between py-1.5 border-b border-orange-100/50 dark:border-orange-900/20">
                <span className="font-semibold text-gray-500 dark:text-white/60">System Protected:</span>
                <span className="text-[#1A1310] dark:text-white font-semibold">{selectedRole.isSystem ? "Yes" : "No"}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-orange-100/50 dark:border-orange-900/20">
                <span className="font-semibold text-gray-500 dark:text-white/60">Assigned Users:</span>
                <span className="text-[#1A1310] dark:text-white font-bold">{selectedRole.usersCount ?? 0} users</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="font-semibold text-gray-500 dark:text-white/60">Active Status:</span>
                <span className="font-bold text-orange-600 dark:text-orange-400">{selectedRole.isActive ? "Active" : "Inactive"}</span>
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

      {/* EDIT ROLE MODAL */}
      {isEditOpen && selectedRole && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white dark:bg-[#241C17] border border-orange-200 dark:border-orange-900/40 rounded-2xl w-full max-w-md p-6 shadow-xl space-y-4 my-8">
            <div className="flex items-center justify-between border-b border-orange-100 dark:border-orange-900/30 pb-3">
              <h3 className="text-base font-bold text-[#1A1310] dark:text-white">Edit Role</h3>
              <button onClick={() => setIsEditOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-white">
                <FaTimes size={16} />
              </button>
            </div>
            <form onSubmit={handleEditSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-white/70 mb-1">Role Name *</label>
                <input 
                  type="text" 
                  required 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3 py-2 text-xs bg-orange-50/30 dark:bg-[#1A1310] border border-orange-200 dark:border-orange-900/40 rounded-lg focus:outline-none focus:border-orange-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-white/70 mb-1">Description</label>
                <textarea 
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-3 py-2 text-xs bg-orange-50/30 dark:bg-[#1A1310] border border-orange-200 dark:border-orange-900/40 rounded-lg focus:outline-none focus:border-orange-500"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                  <input 
                    type="checkbox"
                    checked={formData.isSystem}
                    onChange={(e) => setFormData({...formData, isSystem: e.target.checked})}
                    className="rounded border-orange-300 text-orange-600 focus:ring-orange-500"
                  />
                  <span>System Role</span>
                </label>
                <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                  <input 
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                    className="rounded border-orange-300 text-orange-600 focus:ring-orange-500"
                  />
                  <span>Is Active</span>
                </label>
              </div>
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
                  className="px-4 py-2 rounded-lg bg-orange-600 text-white text-xs font-bold hover:bg-orange-700 shadow-sm"
                >
                  Update Role
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* STATUS TOGGLE MODAL */}
      {isStatusOpen && selectedRole && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-[#241C17] border border-orange-200 dark:border-orange-900/40 rounded-2xl w-full max-w-sm p-6 shadow-xl space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto">
              <FaBan size={20} />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#1A1310] dark:text-white">
                {selectedRole.isActive ? "Deactivate Role?" : "Activate Role?"}
              </h3>
              <p className="text-xs text-gray-500 dark:text-white/60 mt-1">
                Toggle status for <span className="font-bold text-[#1A1310] dark:text-white">{selectedRole.name}</span>?
              </p>
            </div>
            <div className="flex justify-center gap-2 pt-2">
              <button 
                onClick={() => setIsStatusOpen(false)}
                className="px-4 py-2 rounded-lg border border-orange-200 dark:border-orange-900/40 text-xs font-bold hover:bg-orange-100/30"
              >
                Cancel
              </button>
              <button 
                onClick={handleStatusConfirm}
                className="px-4 py-2 rounded-lg bg-amber-600 text-white text-xs font-bold hover:bg-amber-700 shadow-sm"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE ROLE MODAL */}
      {isDeleteOpen && selectedRole && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-[#241C17] border border-orange-200 dark:border-orange-900/40 rounded-2xl w-full max-w-sm p-6 shadow-xl space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-950/50 text-red-600 dark:text-red-400 flex items-center justify-center mx-auto">
              <FaTrash size={20} />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#1A1310] dark:text-white">Delete Role?</h3>
              <p className="text-xs text-gray-500 dark:text-white/60 mt-1">
                This will permanently delete <span className="font-bold text-[#1A1310] dark:text-white">{selectedRole.name}</span>.
              </p>
            </div>
            <div className="flex justify-center gap-2 pt-2">
              <button 
                onClick={() => setIsDeleteOpen(false)}
                className="px-4 py-2 rounded-lg border border-orange-200 dark:border-orange-900/40 text-xs font-bold hover:bg-orange-100/30"
              >
                Cancel
              </button>
              <button 
                onClick={handleDeleteConfirm}
                className="px-4 py-2 rounded-lg bg-red-600 text-white text-xs font-bold hover:bg-red-700 shadow-sm"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}