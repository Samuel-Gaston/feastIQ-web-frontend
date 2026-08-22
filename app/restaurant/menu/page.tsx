"use client";

import { useState } from "react";
import {
  FaPlus,
  FaSearch,
  FaEdit,
  FaTrash,
  FaMagic,
  FaClock,
  FaToggleOn,
  FaToggleOff,
  FaTimes,
  FaImage,
} from "react-icons/fa";
import OwnerTopbar from "@/app/components/restaurantTopbar";
import OwnerSidebar from "@/app/components/restaurantSidebar";
import { useLanguage } from "@/app/context/LanguageContext";

type MenuItemCategory = "BREAKFAST" | "LUNCH" | "DINNER" | "DRINKS" | "FRUITS" | "DESSERT" | "CUSTOM";

interface MenuItem {
  id: string;
  name: string;
  description: string;
  category: MenuItemCategory;
  price: number;
  photoUrl: string;
  tags: string[];
  aiTag?: { predictedCategory: string; confidence: number };
  isAvailable: boolean;
  prepTimeMinutes: number;
}

const mockMenuItems: MenuItem[] = [
  { id: "1", name: "Jollof Rice", description: "Smoky, spiced rice with tomato base", category: "LUNCH", price: 2000, photoUrl: "", tags: ["local", "spicy"], isAvailable: true, prepTimeMinutes: 20 },
  { id: "2", name: "Grilled Chicken", description: "Charcoal-grilled, served with plantain", category: "DINNER", price: 3500, photoUrl: "", tags: ["grill", "protein"], aiTag: { predictedCategory: "DINNER", confidence: 0.94 }, isAvailable: true, prepTimeMinutes: 30 },
  { id: "3", name: "Croissant", description: "Fresh baked, buttery", category: "BREAKFAST", price: 500, photoUrl: "", tags: ["pastry"], isAvailable: true, prepTimeMinutes: 5 },
  { id: "4", name: "Mango Juice", description: "Freshly blended, no added sugar", category: "DRINKS", price: 500, photoUrl: "", tags: ["juice", "fruit"], isAvailable: true, prepTimeMinutes: 5 },
  { id: "5", name: "Fresh Mango Bowl", description: "Sliced seasonal mango", category: "FRUITS", price: 800, photoUrl: "", tags: ["fruit", "healthy"], isAvailable: false, prepTimeMinutes: 5 },
  { id: "6", name: "Fried Rice", description: "Wok-tossed with vegetables", category: "LUNCH", price: 2200, photoUrl: "", tags: ["asian", "rice"], aiTag: { predictedCategory: "LUNCH", confidence: 0.88 }, isAvailable: true, prepTimeMinutes: 18 },
];

const categoryLabels: Record<MenuItemCategory | "ALL", string> = {
  ALL: "All",
  BREAKFAST: "Breakfast",
  LUNCH: "Lunch",
  DINNER: "Dinner",
  DRINKS: "Drinks",
  FRUITS: "Fruits",
  DESSERT: "Dessert",
  CUSTOM: "Custom",
};

const dishCategories: MenuItemCategory[] = ["BREAKFAST", "LUNCH", "DINNER", "DRINKS", "FRUITS", "DESSERT", "CUSTOM"];

const emptyForm = {
  id: "",
  name: "",
  description: "",
  category: "LUNCH" as MenuItemCategory,
  price: "",
  photoUrl: "",
  tags: "",
  isAvailable: true,
  prepTimeMinutes: "",
};

export default function OwnerMenuPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeCategory, setActiveCategory] = useState<MenuItemCategory | "ALL">("ALL");
  const [search, setSearch] = useState("");
  const [items, setItems] = useState<MenuItem[]>(mockMenuItems);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [deleteTarget, setDeleteTarget] = useState<MenuItem | null>(null);
  const { t } = useLanguage();
  const menuT = t.ownerMenu || {};

  const categories: (MenuItemCategory | "ALL")[] = ["ALL", ...dishCategories];

  const filteredItems = items.filter((item) => {
    const matchesCategory = activeCategory === "ALL" || item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleAvailability = (id: string) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, isAvailable: !item.isAvailable } : item)));
  };

  const openAddModal = () => {
    setEditingId(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEditModal = (item: MenuItem) => {
    setEditingId(item.id);
    setForm({
      id: item.id,
      name: item.name,
      description: item.description,
      category: item.category,
      price: String(item.price),
      photoUrl: item.photoUrl,
      tags: item.tags.join(", "),
      isAvailable: item.isAvailable,
      prepTimeMinutes: String(item.prepTimeMinutes),
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleSave = () => {
    if (!form.name.trim() || !form.price) return;

    const parsedTags = form.tags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);

    if (editingId) {
      setItems((prev) =>
        prev.map((item) =>
          item.id === editingId
            ? {
                ...item,
                name: form.name,
                description: form.description,
                category: form.category,
                price: Number(form.price),
                photoUrl: form.photoUrl,
                tags: parsedTags,
                isAvailable: form.isAvailable,
                prepTimeMinutes: Number(form.prepTimeMinutes) || 0,
              }
            : item
        )
      );
    } else {
      const newItem: MenuItem = {
        id: crypto.randomUUID(),
        name: form.name,
        description: form.description,
        category: form.category,
        price: Number(form.price),
        photoUrl: form.photoUrl,
        tags: parsedTags,
        isAvailable: form.isAvailable,
        prepTimeMinutes: Number(form.prepTimeMinutes) || 0,
      };
      setItems((prev) => [newItem, ...prev]);
    }

    closeModal();
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    setItems((prev) => prev.filter((item) => item.id !== deleteTarget.id));
    setDeleteTarget(null);
  };

  return (
    <div style={{ fontFamily: "'Times New Roman', Times, serif" }} className="min-h-screen bg-white dark:bg-[#1A1310] text-[#1A1310] dark:text-white flex transition-colors duration-300">
      <OwnerSidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed((v) => !v)} />

      <div className="flex-1 flex flex-col min-w-0">
        <OwnerTopbar />

        <main className="flex-1 p-6 space-y-6 overflow-y-auto">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h1 className="text-2xl font-black text-[#1A1310] dark:text-white">
                {menuT.title || "Menu Manager"}
              </h1>
              <p className="text-xs text-gray-500 dark:text-white/60 mt-0.5">
                {menuT.subtitle || "Manage your dishes, categories, and pricing"}
              </p>
            </div>
            <button
              onClick={openAddModal}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold px-5 py-2.5 rounded-xl text-sm hover:shadow-lg hover:shadow-orange-500/25 transition-all cursor-pointer"
            >
              <FaPlus size={12} />
              {menuT.addDish || "Add Dish"}
            </button>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex items-center gap-3 flex-1 bg-orange-50/50 dark:bg-white/5 border border-orange-200 dark:border-orange-900/40 rounded-xl px-4 py-2.5">
              <FaSearch size={13} className="text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={menuT.searchPlaceholder || "Search your dishes..."}
                className="bg-transparent border-none outline-none text-sm text-[#1A1310] dark:text-white placeholder-gray-400 dark:placeholder-white/30 w-full"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: "thin" }}>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`shrink-0 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeCategory === cat
                    ? "bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-sm shadow-orange-500/25"
                    : "bg-orange-50/50 dark:bg-white/5 text-gray-600 dark:text-white/70 hover:bg-orange-100 dark:hover:bg-white/10 border border-orange-100 dark:border-orange-900/20"
                }`}
              >
                {categoryLabels[cat]}
              </button>
            ))}
          </div>

          {filteredItems.length === 0 ? (
            <div className="bg-orange-50/30 dark:bg-[#241C17]/60 border border-orange-100 dark:border-orange-900/30 rounded-xl p-12 text-center">
              <p className="text-sm text-gray-500 dark:text-white/60">
                {menuT.noResults || "No dishes match your filters."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  className={`bg-orange-50/30 dark:bg-[#241C17]/60 border rounded-xl overflow-hidden shadow-sm transition-all ${
                    item.isAvailable
                      ? "border-orange-100 dark:border-orange-900/30"
                      : "border-gray-200 dark:border-white/10 opacity-60"
                  }`}
                >
                  <div className="h-32 bg-gradient-to-br from-orange-200 to-red-200 dark:from-orange-950/40 dark:to-red-950/40 flex items-center justify-center relative">
                    {item.photoUrl ? (
                      <img src={item.photoUrl} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-3xl">🍽️</span>
                    )}
                    {item.aiTag && (
                      <span className="absolute top-2 left-2 inline-flex items-center gap-1 bg-purple-100 dark:bg-purple-950/70 text-purple-700 dark:text-purple-300 text-[10px] font-bold px-2 py-1 rounded-full shadow-sm">
                        <FaMagic size={9} />
                        {menuT.aiSuggested || "AI-tagged"} · {Math.round(item.aiTag.confidence * 100)}%
                      </span>
                    )}
                  </div>

                  <div className="p-4">
                    <div className="flex items-start justify-between mb-1.5">
                      <h3 className="text-sm font-bold text-[#1A1310] dark:text-white">{item.name}</h3>
                      <span className="text-sm font-mono font-bold text-orange-600 dark:text-orange-400 shrink-0 ml-2">
                        {item.price.toLocaleString()} XAF
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-500 dark:text-white/50 mb-3 line-clamp-2">
                      {item.description}
                    </p>

                    <div className="flex items-center gap-1.5 flex-wrap mb-3">
                      {item.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] font-semibold bg-orange-100/70 dark:bg-white/5 text-orange-700 dark:text-orange-400 px-2 py-0.5 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-orange-100/50 dark:border-white/5">
                      <span className="text-[10px] text-gray-400 dark:text-white/40 flex items-center gap-1">
                        <FaClock size={9} /> {item.prepTimeMinutes} min
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleAvailability(item.id)}
                          className={`cursor-pointer ${item.isAvailable ? "text-emerald-500" : "text-gray-300 dark:text-white/20"}`}
                          title={item.isAvailable ? (menuT.available || "Available") : (menuT.unavailable || "Unavailable")}
                        >
                          {item.isAvailable ? <FaToggleOn size={20} /> : <FaToggleOff size={20} />}
                        </button>
                        <button
                          onClick={() => openEditModal(item)}
                          className="text-gray-400 hover:text-orange-600 dark:hover:text-orange-400 transition-colors cursor-pointer"
                        >
                          <FaEdit size={13} />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(item)}
                          className="text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                        >
                          <FaTrash size={13} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={closeModal}>
          <div
            className="bg-white dark:bg-[#241C17] rounded-2xl border border-orange-100 dark:border-orange-900/30 shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-orange-100 dark:border-orange-900/30 sticky top-0 bg-white dark:bg-[#241C17] z-10">
              <h2 className="text-base font-bold text-[#1A1310] dark:text-white">
                {editingId ? (menuT.editDish || "Edit Dish") : (menuT.addDish || "Add Dish")}
              </h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 dark:hover:text-white cursor-pointer">
                <FaTimes size={16} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-600 dark:text-white/70 mb-1.5 block">
                  {menuT.formName || "Dish Name"}
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder={menuT.formNamePlaceholder || "e.g. Jollof Rice"}
                  className="w-full bg-orange-50/50 dark:bg-white/5 border border-orange-200 dark:border-orange-900/40 rounded-lg px-3.5 py-2.5 text-sm text-[#1A1310] dark:text-white placeholder-gray-400 dark:placeholder-white/30 outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-600 dark:text-white/70 mb-1.5 block">
                  {menuT.formDescription || "Description"}
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder={menuT.formDescriptionPlaceholder || "Describe the dish..."}
                  rows={3}
                  className="w-full bg-orange-50/50 dark:bg-white/5 border border-orange-200 dark:border-orange-900/40 rounded-lg px-3.5 py-2.5 text-sm text-[#1A1310] dark:text-white placeholder-gray-400 dark:placeholder-white/30 outline-none focus:border-orange-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-gray-600 dark:text-white/70 mb-1.5 block">
                    {menuT.formCategory || "Category"}
                  </label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value as MenuItemCategory })}
                    className="w-full bg-orange-50/50 dark:bg-white/5 border border-orange-200 dark:border-orange-900/40 rounded-lg px-3.5 py-2.5 text-sm text-[#1A1310] dark:text-white outline-none focus:border-orange-500 cursor-pointer"
                  >
                    {dishCategories.map((cat) => (
                      <option key={cat} value={cat}>
                        {categoryLabels[cat]}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-600 dark:text-white/70 mb-1.5 block">
                    {menuT.formPrice || "Price (XAF)"}
                  </label>
                  <input
                    type="number"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    placeholder="2000"
                    className="w-full bg-orange-50/50 dark:bg-white/5 border border-orange-200 dark:border-orange-900/40 rounded-lg px-3.5 py-2.5 text-sm text-[#1A1310] dark:text-white placeholder-gray-400 dark:placeholder-white/30 outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-600 dark:text-white/70 mb-1.5 block">
                  {menuT.formPhoto || "Photo URL"}
                </label>
                <div className="flex items-center gap-2 bg-orange-50/50 dark:bg-white/5 border border-orange-200 dark:border-orange-900/40 rounded-lg px-3.5 py-2.5">
                  <FaImage size={13} className="text-gray-400 shrink-0" />
                  <input
                    type="text"
                    value={form.photoUrl}
                    onChange={(e) => setForm({ ...form, photoUrl: e.target.value })}
                    placeholder="https://..."
                    className="bg-transparent border-none outline-none text-sm text-[#1A1310] dark:text-white placeholder-gray-400 dark:placeholder-white/30 w-full"
                  />
                </div>
                <p className="text-[10px] text-gray-400 dark:text-white/40 mt-1">
                  {menuT.aiHint || "AI will suggest a category tag automatically once a photo is added."}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-gray-600 dark:text-white/70 mb-1.5 block">
                    {menuT.formTags || "Tags (comma separated)"}
                  </label>
                  <input
                    type="text"
                    value={form.tags}
                    onChange={(e) => setForm({ ...form, tags: e.target.value })}
                    placeholder="spicy, local"
                    className="w-full bg-orange-50/50 dark:bg-white/5 border border-orange-200 dark:border-orange-900/40 rounded-lg px-3.5 py-2.5 text-sm text-[#1A1310] dark:text-white placeholder-gray-400 dark:placeholder-white/30 outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-600 dark:text-white/70 mb-1.5 block">
                    {menuT.formPrepTime || "Prep Time (min)"}
                  </label>
                  <input
                    type="number"
                    value={form.prepTimeMinutes}
                    onChange={(e) => setForm({ ...form, prepTimeMinutes: e.target.value })}
                    placeholder="20"
                    className="w-full bg-orange-50/50 dark:bg-white/5 border border-orange-200 dark:border-orange-900/40 rounded-lg px-3.5 py-2.5 text-sm text-[#1A1310] dark:text-white placeholder-gray-400 dark:placeholder-white/30 outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between bg-orange-50/50 dark:bg-white/5 border border-orange-200 dark:border-orange-900/40 rounded-lg px-3.5 py-3">
                <span className="text-xs font-bold text-gray-600 dark:text-white/70">
                  {menuT.formAvailable || "Available for order"}
                </span>
                <button
                  onClick={() => setForm({ ...form, isAvailable: !form.isAvailable })}
                  className={`cursor-pointer ${form.isAvailable ? "text-emerald-500" : "text-gray-300 dark:text-white/20"}`}
                >
                  {form.isAvailable ? <FaToggleOn size={22} /> : <FaToggleOff size={22} />}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3 px-6 py-4 border-t border-orange-100 dark:border-orange-900/30 sticky bottom-0 bg-white dark:bg-[#241C17]">
              <button
                onClick={closeModal}
                className="flex-1 py-2.5 rounded-xl text-sm font-bold text-gray-600 dark:text-white/70 border border-orange-200 dark:border-orange-900/40 hover:bg-orange-50 dark:hover:bg-white/5 transition-colors cursor-pointer"
              >
                {menuT.cancel || "Cancel"}
              </button>
              <button
                onClick={handleSave}
                disabled={!form.name.trim() || !form.price}
                className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-orange-500 to-red-600 hover:shadow-lg hover:shadow-orange-500/25 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                {editingId ? (menuT.saveChanges || "Save Changes") : (menuT.createDish || "Add Dish")}
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteTarget && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setDeleteTarget(null)}>
          <div
            className="bg-white dark:bg-[#241C17] rounded-2xl border border-orange-100 dark:border-orange-900/30 shadow-2xl w-full max-w-sm p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-base font-bold text-[#1A1310] dark:text-white mb-2">
              {menuT.deleteTitle || "Delete this dish?"}
            </h3>
            <p className="text-sm text-gray-500 dark:text-white/60 mb-6">
              {menuT.deleteConfirm || `"${deleteTarget.name}" will be permanently removed from your menu.`}
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="flex-1 py-2.5 rounded-xl text-sm font-bold text-gray-600 dark:text-white/70 border border-orange-200 dark:border-orange-900/40 hover:bg-orange-50 dark:hover:bg-white/5 transition-colors cursor-pointer"
              >
                {menuT.cancel || "Cancel"}
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white bg-red-600 hover:bg-red-700 transition-colors cursor-pointer"
              >
                {menuT.delete || "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}