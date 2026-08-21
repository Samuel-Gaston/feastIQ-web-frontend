"use client";

import { 
  FaUsers, 
  FaCheckCircle, 
  FaTimesCircle, 
  FaUserShield, 
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

export default function AdminUsersPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { t } = useLanguage();
  const userT = t.adminUsers || {};

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [users, setUsers] = useState([
    { id: 1, name: "Super Administrator", email: "admin@platform.cm", isVerified: true, isActive: true, roles: { name: "Admin" }, customer: null, restaurant: null },
    { id: 2, name: "Jean Dupont", email: "jean.dupont@gmail.com", isVerified: true, isActive: true, roles: { name: "Customer" }, customer: { id: "cust_1" }, restaurant: null },
    { id: 3, name: "Le Bicateur Manager", email: "contact@lebicateur.cm", isVerified: true, isActive: false, roles: { name: "Restaurant Owner" }, customer: null, restaurant: { id: "rest_1" } },
    { id: 4, name: "Marie Claire", email: "marie.claire@yahoo.fr", isVerified: false, isActive: true, roles: { name: "Customer" }, customer: { id: "cust_2" }, restaurant: null },
    { id: 5, name: "Support Agent Paul", email: "paul.support@platform.cm", isVerified: true, isActive: true, roles: { name: "Moderator" }, customer: null, restaurant: null },
    { id: 6, name: "S4 Restaurant Owner", email: "info@s4.cm", isVerified: false, isActive: false, roles: { name: "Restaurant Owner" }, customer: null, restaurant: { id: "rest_2" } }
  ]);

  // Modal States
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const [selectedUser, setSelectedUser] = useState<any>(null);

  // Form States (matching CreateUserDto)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    isVerified: true,
    isActive: true,
    roleId: "Customer",
    permissionIds: [] as string[],
  });

  const totalUsers = users.length;
  const activeUsers = users.filter(u => u.isActive).length;
  const inactiveUsers = users.filter(u => !u.isActive).length;
  const verifiedUsers = users.filter(u => u.isVerified).length;

  const filteredUsers = users.filter(u => {
    const matchesSearch = (u.name && u.name.toLowerCase().includes(searchQuery.toLowerCase())) || 
                          (u.email && u.email.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesFilter = statusFilter === "all" || 
                          (statusFilter === "active" && u.isActive) || 
                          (statusFilter === "inactive" && !u.isActive) ||
                          (statusFilter === "verified" && u.isVerified);
    return matchesSearch && matchesFilter;
  });

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage) || 1;
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newUser = {
      id: users.length + 1,
      name: formData.name,
      email: formData.email,
      isVerified: formData.isVerified,
      isActive: formData.isActive,
      roles: { name: formData.roleId },
      customer: null,
      restaurant: null,
    };
    setUsers([newUser, ...users]);
    setFormData({ name: "", email: "", password: "", isVerified: true, isActive: true, roleId: "Customer", permissionIds: [] });
    setIsCreateOpen(false);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setUsers(users.map(u => u.id === selectedUser.id ? { 
      ...u, 
      name: formData.name,
      email: formData.email,
      isVerified: formData.isVerified,
      isActive: formData.isActive,
      roles: { name: formData.roleId }
    } : u));
    setIsEditOpen(false);
  };

  const handleStatusConfirm = () => {
    setUsers(users.map(u => {
      if (u.id === selectedUser.id) {
        return { ...u, isActive: !u.isActive };
      }
      return u;
    }));
    setIsStatusOpen(false);
  };

  const handleDeleteConfirm = () => {
    setUsers(users.filter(u => u.id !== selectedUser.id));
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
                {userT.title || "Users Management"}
              </h1>
              <p className="text-xs text-gray-500 dark:text-white/60 mt-0.5">
                {userT.subtitle || "Manage platform user accounts, roles, permissions, and status."}
              </p>
            </div>
            <button 
              onClick={() => {
                setFormData({ name: "", email: "", password: "", isVerified: true, isActive: true, roleId: "Customer", permissionIds: [] });
                setIsCreateOpen(true);
              }}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-orange-600 hover:bg-orange-700 text-white shadow-sm transition-all"
            >
              <FaPlus size={12} /> {userT.createUser || "Add User"}
            </button>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div 
              onClick={() => { setStatusFilter("all"); setCurrentPage(1); }}
              className={`cursor-pointer bg-orange-50/30 dark:bg-[#241C17]/60 border ${statusFilter === "all" ? "border-orange-500" : "border-orange-100 dark:border-orange-900/30"} rounded-xl p-4 shadow-sm flex items-center justify-between transition-all`}
            >
              <div>
                <p className="text-[11px] font-semibold text-gray-500 dark:text-white/60">{userT.totalCard || "Total Users"}</p>
                <h3 className="text-2xl font-black text-[#1A1310] dark:text-white mt-1">{totalUsers}</h3>
              </div>
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <FaUsers size={18} />
              </div>
            </div>

            <div 
              onClick={() => { setStatusFilter("active"); setCurrentPage(1); }}
              className={`cursor-pointer bg-orange-50/30 dark:bg-[#241C17]/60 border ${statusFilter === "active" ? "border-emerald-500" : "border-orange-100 dark:border-orange-900/30"} rounded-xl p-4 shadow-sm flex items-center justify-between transition-all`}
            >
              <div>
                <p className="text-[11px] font-semibold text-gray-500 dark:text-white/60">{userT.activeCard || "Active Users"}</p>
                <h3 className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">{activeUsers}</h3>
              </div>
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <FaCheckCircle size={18} />
              </div>
            </div>

            <div 
              onClick={() => { setStatusFilter("inactive"); setCurrentPage(1); }}
              className={`cursor-pointer bg-orange-50/30 dark:bg-[#241C17]/60 border ${statusFilter === "inactive" ? "border-red-500" : "border-orange-100 dark:border-orange-900/30"} rounded-xl p-4 shadow-sm flex items-center justify-between transition-all`}
            >
              <div>
                <p className="text-[11px] font-semibold text-gray-500 dark:text-white/60">{userT.inactiveCard || "Inactive Users"}</p>
                <h3 className="text-2xl font-black text-red-600 dark:text-red-400 mt-1">{inactiveUsers}</h3>
              </div>
              <div className="w-10 h-10 rounded-xl bg-red-500/10 text-red-600 dark:text-red-400 flex items-center justify-center">
                <FaTimesCircle size={18} />
              </div>
            </div>

            <div 
              onClick={() => { setStatusFilter("verified"); setCurrentPage(1); }}
              className={`cursor-pointer bg-orange-50/30 dark:bg-[#241C17]/60 border ${statusFilter === "verified" ? "border-amber-500" : "border-orange-100 dark:border-orange-900/30"} rounded-xl p-4 shadow-sm flex items-center justify-between transition-all`}
            >
              <div>
                <p className="text-[11px] font-semibold text-gray-500 dark:text-white/60">{userT.verifiedCard || "Verified"}</p>
                <h3 className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1">{verifiedUsers}</h3>
              </div>
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <FaUserShield size={18} />
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
                  placeholder={userT.searchPlaceholder || "Search users..."}
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
                  <option value="all">All Statuses</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="verified">Verified</option>
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
                    <th className="pb-2.5 font-bold">{userT.colName || "Name"}</th>
                    <th className="pb-2.5 font-bold">{userT.colEmail || "Email"}</th>
                    <th className="pb-2.5 font-bold">{userT.colRole || "Role"}</th>
                    <th className="pb-2.5 font-bold">{userT.colVerified || "Verified"}</th>
                    <th className="pb-2.5 font-bold">{userT.colStatus || "Status"}</th>
                    <th className="pb-2.5 font-bold text-right">{userT.colActions || "Actions"}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-orange-100/50 dark:divide-orange-900/20 text-[13px]">
                  {paginatedUsers.length > 0 ? (
                    paginatedUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-orange-100/20 dark:hover:bg-white/5 transition-colors">
                        <td className="py-3 font-bold text-[#1A1310] dark:text-white whitespace-nowrap flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-orange-500/10 text-orange-600 flex items-center justify-center font-bold text-xs">
                            {user.name ? user.name.charAt(0) : "U"}
                          </div>
                          {user.name || "Unnamed User"}
                        </td>
                        <td className="py-3 text-gray-600 dark:text-white/80 whitespace-nowrap">
                          {user.email}
                        </td>
                        <td className="py-3 whitespace-nowrap">
                          <span className="px-2.5 py-0.5 rounded-md text-[11px] bg-orange-100 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 font-semibold">
                            {user.roles?.name || "User"}
                          </span>
                        </td>
                        <td className="py-3 whitespace-nowrap">
                          {user.isVerified ? (
                            <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Yes</span>
                          ) : (
                            <span className="text-amber-600 dark:text-amber-400 font-semibold">No</span>
                          )}
                        </td>
                        <td className="py-3 whitespace-nowrap">
                          {user.isActive ? (
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
                              onClick={() => { setSelectedUser(user); setIsViewOpen(true); }}
                              title="View Details" 
                              className="p-1.5 rounded-lg bg-blue-100/50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 hover:bg-blue-200 transition-colors"
                            >
                              <FaEye size={12} />
                            </button>
                            <button 
                              onClick={() => { setSelectedUser(user); setIsStatusOpen(true); }}
                              title="Toggle Active Status" 
                              className="p-1.5 rounded-lg bg-amber-100/50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 hover:bg-amber-200 transition-colors"
                            >
                              <FaBan size={12} />
                            </button>
                            <button 
                              onClick={() => { 
                                setSelectedUser(user); 
                                setFormData({ 
                                  name: user.name || "", 
                                  email: user.email || "", 
                                  password: "", 
                                  isVerified: user.isVerified ?? true, 
                                  isActive: user.isActive ?? true, 
                                  roleId: user.roles?.name || "Customer",
                                  permissionIds: []
                                });
                                setIsEditOpen(true); 
                              }}
                              title="Edit User" 
                              className="p-1.5 rounded-lg bg-orange-100/50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 hover:bg-orange-200 transition-colors"
                            >
                              <FaEdit size={12} />
                            </button>
                            <button 
                              onClick={() => { setSelectedUser(user); setIsDeleteOpen(true); }}
                              title="Delete User" 
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
                        {userT.noUsersFound || "No users found."}
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

      {/* CREATE USER MODAL */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white dark:bg-[#241C17] border border-orange-200 dark:border-orange-900/40 rounded-2xl w-full max-w-lg p-6 shadow-xl space-y-4 my-8">
            <div className="flex items-center justify-between border-b border-orange-100 dark:border-orange-900/30 pb-3">
              <h3 className="text-base font-bold text-[#1A1310] dark:text-white">Create New User</h3>
              <button onClick={() => setIsCreateOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-white">
                <FaTimes size={16} />
              </button>
            </div>
            <form onSubmit={handleCreateSubmit} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-white/70 mb-1">Name</label>
                  <input 
                    type="text" 
                    placeholder="Full name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-3 py-2 text-xs bg-orange-50/30 dark:bg-[#1A1310] border border-orange-200 dark:border-orange-900/40 rounded-lg focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-white/70 mb-1">Email *</label>
                  <input 
                    type="email" 
                    required 
                    placeholder="Email address"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
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
                    placeholder="Password"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className="w-full px-3 py-2 text-xs bg-orange-50/30 dark:bg-[#1A1310] border border-orange-200 dark:border-orange-900/40 rounded-lg focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-white/70 mb-1">Role</label>
                  <select 
                    value={formData.roleId}
                    onChange={(e) => setFormData({...formData, roleId: e.target.value})}
                    className="w-full px-3 py-2 text-xs bg-orange-50/30 dark:bg-[#1A1310] border border-orange-200 dark:border-orange-900/40 rounded-lg focus:outline-none focus:border-orange-500"
                  >
                    <option value="Admin">Admin</option>
                    <option value="Customer">Customer</option>
                    <option value="Restaurant Owner">Restaurant Owner</option>
                    <option value="Moderator">Moderator</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                  <input 
                    type="checkbox"
                    checked={formData.isVerified}
                    onChange={(e) => setFormData({...formData, isVerified: e.target.checked})}
                    className="rounded border-orange-300 text-orange-600 focus:ring-orange-500"
                  />
                  <span>Is Verified</span>
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
                  Save User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VIEW USER MODAL */}
      {isViewOpen && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-[#241C17] border border-orange-200 dark:border-orange-900/40 rounded-2xl w-full max-w-md p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-orange-100 dark:border-orange-900/30 pb-3">
              <h3 className="text-base font-bold text-[#1A1310] dark:text-white">User Details</h3>
              <button onClick={() => setIsViewOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-white">
                <FaTimes size={16} />
              </button>
            </div>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1.5 border-b border-orange-100/50 dark:border-orange-900/20">
                <span className="font-semibold text-gray-500 dark:text-white/60">Name:</span>
                <span className="font-bold text-[#1A1310] dark:text-white">{selectedUser.name || "N/A"}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-orange-100/50 dark:border-orange-900/20">
                <span className="font-semibold text-gray-500 dark:text-white/60">Email:</span>
                <span className="text-[#1A1310] dark:text-white">{selectedUser.email}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-orange-100/50 dark:border-orange-900/20">
                <span className="font-semibold text-gray-500 dark:text-white/60">Role:</span>
                <span className="text-[#1A1310] dark:text-white font-semibold">{selectedUser.roles?.name || "User"}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-orange-100/50 dark:border-orange-900/20">
                <span className="font-semibold text-gray-500 dark:text-white/60">Verified:</span>
                <span className="text-[#1A1310] dark:text-white">{selectedUser.isVerified ? "Yes" : "No"}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="font-semibold text-gray-500 dark:text-white/60">Active Status:</span>
                <span className="font-bold text-orange-600 dark:text-orange-400">{selectedUser.isActive ? "Active" : "Inactive"}</span>
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

      {/* EDIT USER MODAL */}
      {isEditOpen && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white dark:bg-[#241C17] border border-orange-200 dark:border-orange-900/40 rounded-2xl w-full max-w-lg p-6 shadow-xl space-y-4 my-8">
            <div className="flex items-center justify-between border-b border-orange-100 dark:border-orange-900/30 pb-3">
              <h3 className="text-base font-bold text-[#1A1310] dark:text-white">Edit User</h3>
              <button onClick={() => setIsEditOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-white">
                <FaTimes size={16} />
              </button>
            </div>
            <form onSubmit={handleEditSubmit} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-white/70 mb-1">Name</label>
                  <input 
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-3 py-2 text-xs bg-orange-50/30 dark:bg-[#1A1310] border border-orange-200 dark:border-orange-900/40 rounded-lg focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-white/70 mb-1">Email *</label>
                  <input 
                    type="email" 
                    required 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-3 py-2 text-xs bg-orange-50/30 dark:bg-[#1A1310] border border-orange-200 dark:border-orange-900/40 rounded-lg focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-white/70 mb-1">Role</label>
                <select 
                  value={formData.roleId}
                  onChange={(e) => setFormData({...formData, roleId: e.target.value})}
                  className="w-full px-3 py-2 text-xs bg-orange-50/30 dark:bg-[#1A1310] border border-orange-200 dark:border-orange-900/40 rounded-lg focus:outline-none focus:border-orange-500"
                >
                  <option value="Admin">Admin</option>
                  <option value="Customer">Customer</option>
                  <option value="Restaurant Owner">Restaurant Owner</option>
                  <option value="Moderator">Moderator</option>
                </select>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                  <input 
                    type="checkbox"
                    checked={formData.isVerified}
                    onChange={(e) => setFormData({...formData, isVerified: e.target.checked})}
                    className="rounded border-orange-300 text-orange-600 focus:ring-orange-500"
                  />
                  <span>Is Verified</span>
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
                  Update User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* STATUS TOGGLE MODAL */}
      {isStatusOpen && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-[#241C17] border border-orange-200 dark:border-orange-900/40 rounded-2xl w-full max-w-sm p-6 shadow-xl space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto">
              <FaBan size={20} />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#1A1310] dark:text-white">
                {selectedUser.isActive ? "Deactivate User?" : "Activate User?"}
              </h3>
              <p className="text-xs text-gray-500 dark:text-white/60 mt-1">
                Toggle status for <span className="font-bold text-[#1A1310] dark:text-white">{selectedUser.name || selectedUser.email}</span>?
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

      {/* DELETE USER MODAL */}
      {isDeleteOpen && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-[#241C17] border border-orange-200 dark:border-orange-900/40 rounded-2xl w-full max-w-sm p-6 shadow-xl space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-950/50 text-red-600 dark:text-red-400 flex items-center justify-center mx-auto">
              <FaTrash size={20} />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#1A1310] dark:text-white">Delete User?</h3>
              <p className="text-xs text-gray-500 dark:text-white/60 mt-1">
                This will permanently delete <span className="font-bold text-[#1A1310] dark:text-white">{selectedUser.name || selectedUser.email}</span>.
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