// app/admin/restaurants/page.tsx
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
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaLock,
  FaStore,
  FaImage,
  FaCalendarAlt
} from "react-icons/fa";
import Topbar from "@/app/components/Topbar";
import Sidebar from "@/app/components/Sidebar";
import { useLanguage } from "@/app/context/LanguageContext";
import { useState } from "react";

export default function AdminRestaurantsPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { t } = useLanguage();
  const restT = t.adminRestaurants || {};

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [restaurants, setRestaurants] = useState([
    { id: 1, name: "Le Bicateur", email: "contact@lebicateur.cm", phone: "+237 670000001", address: "Bonanjo, Douala", cuisineTags: ["African", "Grill"], logoURL: "", openingAndClosingHours: "08:00 - 22:00", status: "APPROVED" },
    { id: 2, name: "S4 Restaurant", email: "info@s4.cm", phone: "+237 670000002", address: "Akwa, Douala", cuisineTags: ["Fast Food", "Burger"], logoURL: "", openingAndClosingHours: "10:00 - 23:00", status: "PENDING" },
    { id: 3, name: "Pizzeria La Dolce Vita", email: "order@ladolcevita.cm", phone: "+237 670000003", address: "Bastos, Yaoundé", cuisineTags: ["Italian", "Pizza"], logoURL: "", openingAndClosingHours: "11:00 - 23:30", status: "APPROVED" },
    { id: 4, name: "The Grill Master", email: "grill@master.cm", phone: "+237 670000004", address: "Molyko, Buea", cuisineTags: ["Steakhouse", "BBQ"], logoURL: "", openingAndClosingHours: "12:00 - 00:00", status: "SUSPENEDED" },
    { id: 5, name: "China Garden", email: "chinagarden@cm.com", phone: "+237 670000005", address: "Bonapriso, Douala", cuisineTags: ["Asian", "Chinese"], logoURL: "", openingAndClosingHours: "10:30 - 22:30", status: "PENDING" },
    { id: 6, name: "Carrefour Food", email: "food@carrefour.cm", phone: "+237 670000006", address: "Bonamoussadi, Douala", cuisineTags: ["Continental", "Bakery"], logoURL: "", openingAndClosingHours: "08:00 - 21:00", status: "APPROVED" }
  ]);

  // Modal States
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const [selectedRestaurant, setSelectedRestaurant] = useState<any>(null);

  // Form States (matching CreateRestaurantDTO)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    description: "",
    address: "",
    cuisineTags: "",
    logoURL: "",
    openingAndClosingHours: "",
    status: "PENDING",
  });

  const totalRestaurants = restaurants.length;
  const approvedRestaurants = restaurants.filter(r => r.status === "APPROVED").length;
  const pendingRestaurants = restaurants.filter(r => r.status === "PENDING").length;

  const filteredRestaurants = restaurants.filter(r => {
    const matchesSearch = r.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          r.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (r.address && r.address.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesFilter = statusFilter === "all" || r.status === statusFilter;
    return matchesSearch && matchesFilter;
  });

  const totalPages = Math.ceil(filteredRestaurants.length / itemsPerPage) || 1;
  const paginatedRestaurants = filteredRestaurants.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newRest = {
      id: restaurants.length + 1,
      name: formData.name,
      email: formData.email,
      phone: "+237 600000000",
      address: formData.address || "Douala, Cameroon",
      cuisineTags: formData.cuisineTags ? formData.cuisineTags.split(",").map(tag => tag.trim()) : ["General"],
      logoURL: formData.logoURL,
      openingAndClosingHours: formData.openingAndClosingHours || "09:00 - 22:00",
      status: formData.status || "PENDING",
    };
    setRestaurants([newRest, ...restaurants]);
    setFormData({ name: "", email: "", password: "", description: "", address: "", cuisineTags: "", logoURL: "", openingAndClosingHours: "", status: "PENDING" });
    setIsCreateOpen(false);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRestaurants(restaurants.map(r => r.id === selectedRestaurant.id ? { 
      ...r, 
      name: formData.name,
      email: formData.email,
      address: formData.address,
      cuisineTags: formData.cuisineTags ? formData.cuisineTags.split(",").map((tag: string) => tag.trim()) : r.cuisineTags,
      logoURL: formData.logoURL,
      openingAndClosingHours: formData.openingAndClosingHours,
      status: formData.status
    } : r));
    setIsEditOpen(false);
  };

  const handleStatusConfirm = () => {
    setRestaurants(restaurants.map(r => {
      if (r.id === selectedRestaurant.id) {
        const nextStatus = r.status === "APPROVED" ? "SUSPENEDED" : "APPROVED";
        return { ...r, status: nextStatus };
      }
      return r;
    }));
    setIsStatusOpen(false);
  };

  const handleDeleteConfirm = () => {
    setRestaurants(restaurants.filter(r => r.id !== selectedRestaurant.id));
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
                {restT.title || "Restaurants Management"}
              </h1>
              <p className="text-xs text-gray-500 dark:text-white/60 mt-0.5">
                {restT.subtitle || "Manage platform partner restaurants, approvals, and profiles."}
              </p>
            </div>
            <button 
              onClick={() => {
                setFormData({ name: "", email: "", password: "", description: "", address: "", cuisineTags: "", logoURL: "", openingAndClosingHours: "", status: "PENDING" });
                setIsCreateOpen(true);
              }}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-orange-600 hover:bg-orange-700 text-white shadow-sm transition-all"
            >
              <FaPlus size={12} /> {restT.createRestaurant || "Add Restaurant"}
            </button>
          </div>

          {/* Three Summary Cards */}
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

          {/* Search Bar & Filters Section */}
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

            {/* Table Container */}
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
                  {paginatedRestaurants.length > 0 ? (
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
                            {rest.cuisineTags?.map((tag: string, idx: number) => (
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
                              onClick={() => { setSelectedRestaurant(rest); setIsViewOpen(true); }}
                              title="View Details" 
                              className="p-1.5 rounded-lg bg-blue-100/50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 hover:bg-blue-200 transition-colors"
                            >
                              <FaEye size={12} />
                            </button>
                            <button 
                              onClick={() => { setSelectedRestaurant(rest); setIsStatusOpen(true); }}
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
                                  description: rest.address || "", 
                                  address: rest.address || "", 
                                  cuisineTags: rest.cuisineTags ? rest.cuisineTags.join(", ") : "", 
                                  logoURL: rest.logoURL || "", 
                                  openingAndClosingHours: rest.openingAndClosingHours || "", 
                                  status: rest.status 
                                });
                                setIsEditOpen(true); 
                              }}
                              title="Edit Restaurant" 
                              className="p-1.5 rounded-lg bg-orange-100/50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 hover:bg-orange-200 transition-colors"
                            >
                              <FaEdit size={12} />
                            </button>
                            <button 
                              onClick={() => { setSelectedRestaurant(rest); setIsDeleteOpen(true); }}
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

            {/* Pagination Controls */}
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

      {/* CREATE RESTAURANT MODAL */}
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
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
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
                    placeholder="Enter password"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className="w-full px-3 py-2 text-xs bg-orange-50/30 dark:bg-[#1A1310] border border-orange-200 dark:border-orange-900/40 rounded-lg focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-white/70 mb-1">Cuisine Tags (comma separated)</label>
                  <input 
                    type="text" 
                    placeholder="e.g. African, Fast Food"
                    value={formData.cuisineTags}
                    onChange={(e) => setFormData({...formData, cuisineTags: e.target.value})}
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
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
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
                    onChange={(e) => setFormData({...formData, openingAndClosingHours: e.target.value})}
                    className="w-full px-3 py-2 text-xs bg-orange-50/30 dark:bg-[#1A1310] border border-orange-200 dark:border-orange-900/40 rounded-lg focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-white/70 mb-1">Logo URL</label>
                  <input 
                    type="text" 
                    placeholder="https://..."
                    value={formData.logoURL}
                    onChange={(e) => setFormData({...formData, logoURL: e.target.value})}
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
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-3 py-2 text-xs bg-orange-50/30 dark:bg-[#1A1310] border border-orange-200 dark:border-orange-900/40 rounded-lg focus:outline-none focus:border-orange-500 resize-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-white/70 mb-1">Initial Status</label>
                <select 
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                  className="w-full px-3 py-2 text-xs bg-orange-50/30 dark:bg-[#1A1310] border border-orange-200 dark:border-orange-900/40 rounded-lg focus:outline-none focus:border-orange-500"
                >
                  <option value="PENDING">PENDING</option>
                  <option value="APPROVED">APPROVED</option>
                </select>
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
                  Save Restaurant
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VIEW RESTAURANT MODAL */}
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

      {/* EDIT RESTAURANT MODAL */}
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-white/70 mb-1">Cuisine Tags</label>
                  <input 
                    type="text" 
                    value={formData.cuisineTags}
                    onChange={(e) => setFormData({...formData, cuisineTags: e.target.value})}
                    className="w-full px-3 py-2 text-xs bg-orange-50/30 dark:bg-[#1A1310] border border-orange-200 dark:border-orange-900/40 rounded-lg focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-white/70 mb-1">Hours</label>
                  <input 
                    type="text" 
                    value={formData.openingAndClosingHours}
                    onChange={(e) => setFormData({...formData, openingAndClosingHours: e.target.value})}
                    className="w-full px-3 py-2 text-xs bg-orange-50/30 dark:bg-[#1A1310] border border-orange-200 dark:border-orange-900/40 rounded-lg focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-white/70 mb-1">Address</label>
                <input 
                  type="text" 
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  className="w-full px-3 py-2 text-xs bg-orange-50/30 dark:bg-[#1A1310] border border-orange-200 dark:border-orange-900/40 rounded-lg focus:outline-none focus:border-orange-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-white/70 mb-1">Status</label>
                <select 
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                  className="w-full px-3 py-2 text-xs bg-orange-50/30 dark:bg-[#1A1310] border border-orange-200 dark:border-orange-900/40 rounded-lg focus:outline-none focus:border-orange-500"
                >
                  <option value="PENDING">PENDING</option>
                  <option value="APPROVED">APPROVED</option>
                  <option value="SUSPENEDED">SUSPENEDED</option>
                </select>
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
                  Update Restaurant
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* STATUS TOGGLE MODAL */}
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

      {/* DELETE RESTAURANT MODAL */}
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