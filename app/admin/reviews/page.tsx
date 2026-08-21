"use client";

import { 
  FaStar, 
  FaCommentAlt, 
  FaStore, 
  FaUser, 
  FaSearch, 
  FaEye, 
  FaTrash, 
  FaChevronLeft, 
  FaChevronRight,
  FaTimes,
  FaReply
} from "react-icons/fa";
import Topbar from "@/app/components/Topbar";
import Sidebar from "@/app/components/Sidebar";
import { useLanguage } from "@/app/context/LanguageContext";
import { useState } from "react";

export default function AdminReviewsPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { t } = useLanguage();
  const reviewT = t.adminReviews || {};

  const [searchQuery, setSearchQuery] = useState("");
  const [ratingFilter, setRatingFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [reviews, setReviews] = useState([
    { 
      id: 1, 
      customer: { name: "Jean Dupont", email: "jean@gmail.com" }, 
      restaurant: { name: "Le Bicateur" }, 
      order: { id: "ORD-9381" },
      rating: 5, 
      comment: "Absolutely stellar food quality and prompt delivery! Will definitely order again.",
      dishRatings: [
        { menuItem: { name: "Grilled Tilapia" }, rating: 5 },
        { menuItem: { name: "Plantains" }, rating: 4 }
      ],
      ownerResponse: { text: "Thank you so much Jean! We appreciate your support.", respondedAt: "2026-08-18T10:30:00Z" }
    },
    { 
      id: 2, 
      customer: { name: "Marie Claire", email: "marie@yahoo.fr" }, 
      restaurant: { name: "S4 Fast Food" }, 
      order: { id: "ORD-9382" },
      rating: 3, 
      comment: "Food was okay, but delivery took longer than expected during peak hours.",
      dishRatings: [
        { menuItem: { name: "Cheeseburger Meal" }, rating: 3 }
      ],
      ownerResponse: null
    },
    { 
      id: 3, 
      customer: { name: "Paul Support", email: "paul@platform.cm" }, 
      restaurant: { name: "Afrifood Express" }, 
      order: { id: "ORD-9383" },
      rating: 4, 
      comment: "Great flavours, nice hot packaging. Portion size could be slightly larger.",
      dishRatings: [
        { menuItem: { name: "Ndole & Plantains" }, rating: 4 }
      ],
      ownerResponse: { text: "We'll look into portion adjustments. Thanks for the feedback!", respondedAt: "2026-08-19T14:15:00Z" }
    },
    { 
      id: 4, 
      customer: { name: "Alice Ngono", email: "alice@gmail.com" }, 
      restaurant: { name: "Douala Grill House" }, 
      order: { id: "ORD-9384" },
      rating: 5, 
      comment: "Best grilled fish in town by far! Super fresh ingredients.",
      dishRatings: [
        { menuItem: { name: "Whole Braised Fish" }, rating: 5 }
      ],
      ownerResponse: null
    },
    { 
      id: 5, 
      customer: { name: "Samuel E.", email: "sam@cameroon.net" }, 
      restaurant: { name: "Le Bicateur" }, 
      order: { id: "ORD-9385" },
      rating: 2, 
      comment: "Disappointed with the packaging, soup leaked into the bag.",
      dishRatings: [
        { menuItem: { name: "Eru Soup" }, rating: 2 }
      ],
      ownerResponse: { text: "We apologize for the spill, Samuel. We have upgraded our container seals.", respondedAt: "2026-08-20T08:00:00Z" }
    }
  ]);

  // Modal States
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState<any>(null);

  const totalReviews = reviews.length;
  const avgRating = totalReviews > (reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews ? 0 : 0) 
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews).toFixed(1) 
    : "0.0";
  const respondedCount = reviews.filter(r => r.ownerResponse !== null).length;

  const filteredReviews = reviews.filter(r => {
    const matchesSearch = (r.customer?.name && r.customer.name.toLowerCase().includes(searchQuery.toLowerCase())) || 
                          (r.restaurant?.name && r.restaurant.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
                          (r.comment && r.comment.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesFilter = ratingFilter === "all" || 
                          (ratingFilter === "responded" && r.ownerResponse !== null) ||
                          (ratingFilter === "unresponded" && r.ownerResponse === null) ||
                          (ratingFilter === "5star" && r.rating === 5) ||
                          (ratingFilter === "lowstar" && r.rating <= 3);
    return matchesSearch && matchesFilter;
  });

  const totalPages = Math.ceil(filteredReviews.length / itemsPerPage) || 1;
  const paginatedReviews = filteredReviews.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleDeleteConfirm = () => {
    setReviews(reviews.filter(r => r.id !== selectedReview.id));
    setIsDeleteOpen(false);
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5 text-amber-500">
        {Array.from({ length: 5 }, (_, i) => (
          <FaStar key={i} size={10} className={i < rating ? "text-amber-500" : "text-gray-300 dark:text-white/20"} />
        ))}
      </div>
    );
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
                {reviewT.title || "Platform Reviews"}
              </h1>
              <p className="text-xs text-gray-500 dark:text-white/60 mt-0.5">
                {reviewT.subtitle || "Monitor customer feedback, overall ratings, per-dish evaluations, and owner responses."}
              </p>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div 
              onClick={() => { setRatingFilter("all"); setCurrentPage(1); }}
              className={`cursor-pointer bg-orange-50/30 dark:bg-[#241C17]/60 border ${ratingFilter === "all" ? "border-orange-500" : "border-orange-100 dark:border-orange-900/30"} rounded-xl p-4 shadow-sm flex items-center justify-between transition-all`}
            >
              <div>
                <p className="text-[11px] font-semibold text-gray-500 dark:text-white/60">{reviewT.totalCard || "Total Reviews"}</p>
                <h3 className="text-2xl font-black text-[#1A1310] dark:text-white mt-1">{totalReviews}</h3>
              </div>
              <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-600 dark:text-orange-400 flex items-center justify-center">
                <FaCommentAlt size={18} />
              </div>
            </div>

            <div 
              onClick={() => { setRatingFilter("5star"); setCurrentPage(1); }}
              className={`cursor-pointer bg-orange-50/30 dark:bg-[#241C17]/60 border ${ratingFilter === "5star" ? "border-amber-500" : "border-orange-100 dark:border-orange-900/30"} rounded-xl p-4 shadow-sm flex items-center justify-between transition-all`}
            >
              <div>
                <p className="text-[11px] font-semibold text-gray-500 dark:text-white/60">{reviewT.avgRatingCard || "Average Rating"}</p>
                <h3 className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1 flex items-center gap-1.5">
                  {avgRating} <FaStar size={16} />
                </h3>
              </div>
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <FaStar size={18} />
              </div>
            </div>

            <div 
              onClick={() => { setRatingFilter("responded"); setCurrentPage(1); }}
              className={`cursor-pointer bg-orange-50/30 dark:bg-[#241C17]/60 border ${ratingFilter === "responded" ? "border-emerald-500" : "border-orange-100 dark:border-orange-900/30"} rounded-xl p-4 shadow-sm flex items-center justify-between transition-all`}
            >
              <div>
                <p className="text-[11px] font-semibold text-gray-500 dark:text-white/60">{reviewT.respondedCard || "Owner Responses"}</p>
                <h3 className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">{respondedCount}</h3>
              </div>
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <FaStore size={18} />
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
                  placeholder={reviewT.searchPlaceholder || "Search reviews..."}
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                  className="w-full pl-9 pr-4 py-2 text-xs bg-white dark:bg-[#1A1310] border border-orange-200 dark:border-orange-900/40 rounded-lg text-[#1A1310] dark:text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <span className="text-xs text-gray-500 dark:text-white/60 font-semibold">Filter:</span>
                <select 
                  value={ratingFilter}
                  onChange={(e) => { setRatingFilter(e.target.value); setCurrentPage(1); }}
                  className="px-3 py-2 text-xs bg-white dark:bg-[#1A1310] border border-orange-200 dark:border-orange-900/40 rounded-lg text-[#1A1310] dark:text-white focus:outline-none focus:border-orange-500"
                >
                  <option value="all">All Reviews</option>
                  <option value="5star">5 Star Ratings</option>
                  <option value="lowstar">Low Ratings (less or equal to 3)</option>
                  <option value="responded">Responded By Owner</option>
                  <option value="unresponded">Pending Response</option>
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
              <table className="w-full text-left text-xs min-w-[750px]">
                <thead>
                  <tr className="border-b border-orange-100 dark:border-orange-900/30 text-[13px] text-gray-400 dark:text-white/40 uppercase tracking-wider">
                    <th className="pb-2.5 font-bold">{reviewT.colCustomer || "Customer"}</th>
                    <th className="pb-2.5 font-bold">{reviewT.colRestaurant || "Restaurant"}</th>
                    <th className="pb-2.5 font-bold">{reviewT.colRating || "Rating"}</th>
                    <th className="pb-2.5 font-bold">{reviewT.colComment || "Comment"}</th>
                    <th className="pb-2.5 font-bold">{reviewT.colResponse || "Owner Response"}</th>
                    <th className="pb-2.5 font-bold text-right">{reviewT.colActions || "Actions"}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-orange-100/50 dark:divide-orange-900/20 text-[13px]">
                  {paginatedReviews.length > 0 ? (
                    paginatedReviews.map((review) => (
                      <tr key={review.id} className="hover:bg-orange-100/20 dark:hover:bg-white/5 transition-colors">
                        <td className="py-3 font-bold text-[#1A1310] dark:text-white whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-orange-500/10 text-orange-600 flex items-center justify-center font-bold text-xs">
                              {review.customer?.name ? review.customer.name.charAt(0) : "C"}
                            </div>
                            <div>
                              <p>{review.customer?.name || "Customer"}</p>
                              <p className="text-[11px] text-gray-400 font-normal">{review.customer?.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 text-gray-600 dark:text-white/80 whitespace-nowrap">
                          <span className="px-2.5 py-0.5 rounded-md text-[11px] bg-orange-100 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 font-semibold">
                            {review.restaurant?.name || "Restaurant"}
                          </span>
                        </td>
                        <td className="py-3 whitespace-nowrap">
                          <div className="flex items-center gap-1">
                            <span className="font-bold text-[#1A1310] dark:text-white">{review.rating}.0</span>
                            {renderStars(review.rating)}
                          </div>
                        </td>
                        <td className="py-3 text-gray-600 dark:text-white/80 max-w-xs truncate">
                          {review.comment || "No comment provided."}
                        </td>
                        <td className="py-3 whitespace-nowrap">
                          {review.ownerResponse ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400">
                              <FaReply size={9} /> Responded
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-100 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400">
                              Pending
                            </span>
                          )}
                        </td>
                        <td className="py-3 text-right whitespace-nowrap">
                          <div className="inline-flex items-center gap-2">
                            <button 
                              onClick={() => { setSelectedReview(review); setIsViewOpen(true); }}
                              title="View Full Review & Dish Ratings" 
                              className="p-1.5 rounded-lg bg-blue-100/50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 hover:bg-blue-200 transition-colors"
                            >
                              <FaEye size={12} />
                            </button>
                            <button 
                              onClick={() => { setSelectedReview(review); setIsDeleteOpen(true); }}
                              title="Delete Review" 
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
                        {reviewT.noReviewsFound || "No reviews found."}
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

      {/* VIEW REVIEW DETAILS MODAL */}
      {isViewOpen && selectedReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white dark:bg-[#241C17] border border-orange-200 dark:border-orange-900/40 rounded-2xl w-full max-w-lg p-6 shadow-xl space-y-4 my-8">
            <div className="flex items-center justify-between border-b border-orange-100 dark:border-orange-900/30 pb-3">
              <h3 className="text-base font-bold text-[#1A1310] dark:text-white">Review & Feedback Details</h3>
              <button onClick={() => setIsViewOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-white">
                <FaTimes size={16} />
              </button>
            </div>
            
            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3 pb-2 border-b border-orange-100/50 dark:border-orange-900/20">
                <div>
                  <span className="font-semibold text-gray-500 dark:text-white/60 block">Customer:</span>
                  <span className="font-bold text-[#1A1310] dark:text-white">{selectedReview.customer?.name}</span>
                </div>
                <div>
                  <span className="font-semibold text-gray-500 dark:text-white/60 block">Restaurant:</span>
                  <span className="font-bold text-[#1A1310] dark:text-white">{selectedReview.restaurant?.name}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pb-2 border-b border-orange-100/50 dark:border-orange-900/20">
                <div>
                  <span className="font-semibold text-gray-500 dark:text-white/60 block">Order Ref:</span>
                  <span className="text-[#1A1310] dark:text-white font-mono">{selectedReview.order?.id}</span>
                </div>
                <div>
                  <span className="font-semibold text-gray-500 dark:text-white/60 block">Overall Rating:</span>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="font-bold text-[#1A1310] dark:text-white">{selectedReview.rating}.0</span>
                    {renderStars(selectedReview.rating)}
                  </div>
                </div>
              </div>

              <div>
                <span className="font-semibold text-gray-500 dark:text-white/60 block mb-1">Customer Comment:</span>
                <p className="bg-orange-50/20 dark:bg-[#1A1310] p-3 rounded-xl border border-orange-100 dark:border-orange-900/30 text-[#1A1310] dark:text-white">
                  {selectedReview.comment || "No comment provided."}
                </p>
              </div>

              {/* Per-Dish Ratings Section */}
              {selectedReview.dishRatings && selectedReview.dishRatings.length > 0 && (
                <div>
                  <span className="font-semibold text-gray-500 dark:text-white/60 block mb-1.5">Per-Dish Ratings:</span>
                  <div className="space-y-1.5">
                    {selectedReview.dishRatings.map((dish: any, idx: number) => (
                      <div key={idx} className="flex items-center justify-between bg-orange-50/30 dark:bg-[#1A1310] px-3 py-2 rounded-lg border border-orange-100 dark:border-orange-900/30">
                        <span className="font-semibold text-[#1A1310] dark:text-white">{dish.menuItem?.name || "Dish Item"}</span>
                        <div className="flex items-center gap-1">
                          <span className="font-bold">{dish.rating}.0</span>
                          {renderStars(dish.rating)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Owner Response Section */}
              {selectedReview.ownerResponse ? (
                <div>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400 block mb-1">Restaurant Owner Response:</span>
                  <div className="bg-emerald-50/30 dark:bg-emerald-950/20 p-3 rounded-xl border border-emerald-100 dark:border-emerald-900/30 text-[#1A1310] dark:text-white space-y-1">
                    <p>{selectedReview.ownerResponse.text}</p>
                    <p className="text-[10px] text-gray-400">Responded on {new Date(selectedReview.ownerResponse.respondedAt).toLocaleDateString()}</p>
                  </div>
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-amber-50/30 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/30 text-amber-700 dark:text-amber-400 font-semibold text-center">
                  No response from restaurant owner yet.
                </div>
              )}
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

      {/* DELETE REVIEW MODAL */}
      {isDeleteOpen && selectedReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-[#241C17] border border-orange-200 dark:border-orange-900/40 rounded-2xl w-full max-w-sm p-6 shadow-xl space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-950/50 text-red-600 dark:text-red-400 flex items-center justify-center mx-auto">
              <FaTrash size={20} />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#1A1310] dark:text-white">Delete Review?</h3>
              <p className="text-xs text-gray-500 dark:text-white/60 mt-1">
                This will permanently delete this review from <span className="font-bold text-[#1A1310] dark:text-white">{selectedReview.customer?.name}</span>.
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