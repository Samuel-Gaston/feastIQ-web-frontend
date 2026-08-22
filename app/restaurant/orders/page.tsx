"use client";

import { useState } from "react";
import {
  FaSearch,
  FaClock,
  FaTimes,
  FaMotorcycle,
  FaCheckDouble,
  FaFire,
  FaBoxOpen,
  FaBan,
  FaMapMarkerAlt,
  FaMoneyBillWave,
} from "react-icons/fa";
import OwnerTopbar from "@/app/components/restaurantTopbar";
import OwnerSidebar from "@/app/components/restaurantSidebar";
import { useLanguage } from "@/app/context/LanguageContext";

type OrderStatus =
  | "PLACED"
  | "CONFIRMED"
  | "PREPARING"
  | "READY_FOR_PICKUP"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"
  | "COMPLETED"
  | "CANCELLED";

type PaymentStatus = "PENDING" | "PAID" | "FAILED";

interface OrderItem {
  menuItem: string;
  name: string;
  unitPrice: number;
  quantity: number;
  subtotal: number;
}

interface OrderStatusEvent {
  status: OrderStatus;
  timestamp: string;
}

interface Order {
  id: string;
  customerName: string;
  items: OrderItem[];
  deliveryAddress: string;
  subtotal: number;
  deliveryFee: number;
  total: number;
  status: OrderStatus;
  statusHistory: OrderStatusEvent[];
  paymentMethod: "COD";
  paymentStatus: PaymentStatus;
  cancellationReason?: string;
}

const ALLOWED_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  PLACED: ["CONFIRMED", "CANCELLED"],
  CONFIRMED: ["PREPARING", "CANCELLED"],
  PREPARING: ["READY_FOR_PICKUP"],
  READY_FOR_PICKUP: ["OUT_FOR_DELIVERY"],
  OUT_FOR_DELIVERY: ["DELIVERED"],
  DELIVERED: ["COMPLETED"],
  COMPLETED: [],
  CANCELLED: [],
};

const statusLabels: Record<OrderStatus, string> = {
  PLACED: "Placed",
  CONFIRMED: "Confirmed",
  PREPARING: "Preparing",
  READY_FOR_PICKUP: "Ready for Pickup",
  OUT_FOR_DELIVERY: "Out for Delivery",
  DELIVERED: "Delivered",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
};

const statusStyles: Record<OrderStatus, string> = {
  PLACED: "bg-orange-100 dark:bg-orange-950/50 text-orange-600 dark:text-orange-400",
  CONFIRMED: "bg-blue-100 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400",
  PREPARING: "bg-amber-100 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400",
  READY_FOR_PICKUP: "bg-purple-100 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400",
  OUT_FOR_DELIVERY: "bg-cyan-100 dark:bg-cyan-950/50 text-cyan-600 dark:text-cyan-400",
  DELIVERED: "bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400",
  COMPLETED: "bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-white/70",
  CANCELLED: "bg-red-100 dark:bg-red-950/50 text-red-600 dark:text-red-400",
};

const nextActionLabel: Partial<Record<OrderStatus, string>> = {
  PLACED: "Confirm",
  CONFIRMED: "Start Preparing",
  PREPARING: "Mark Ready",
  READY_FOR_PICKUP: "Send Out for Delivery",
  OUT_FOR_DELIVERY: "Mark Delivered",
  DELIVERED: "Mark Completed",
};

const mockOrders: Order[] = [
  {
    id: "FQ-8841", customerName: "Aïcha M.",
    items: [
      { menuItem: "1", name: "Fried Rice", unitPrice: 2200, quantity: 2, subtotal: 4400 },
      { menuItem: "4", name: "Mango Juice", unitPrice: 500, quantity: 1, subtotal: 500 },
    ],
    deliveryAddress: "Rue Joss, Akwa, Douala", subtotal: 4900, deliveryFee: 0, total: 4900,
    status: "PLACED",
    statusHistory: [{ status: "PLACED", timestamp: "2026-08-22T10:12:00Z" }],
    paymentMethod: "COD", paymentStatus: "PENDING",
  },
  {
    id: "FQ-8840", customerName: "Junior T.",
    items: [{ menuItem: "2", name: "Grilled Chicken", unitPrice: 3500, quantity: 1, subtotal: 3500 }],
    deliveryAddress: "Bonapriso, Douala", subtotal: 3500, deliveryFee: 0, total: 3500,
    status: "PLACED",
    statusHistory: [{ status: "PLACED", timestamp: "2026-08-22T10:10:00Z" }],
    paymentMethod: "COD", paymentStatus: "PENDING",
  },
  {
    id: "FQ-8837", customerName: "Grace N.",
    items: [
      { menuItem: "3", name: "Spring Rolls", unitPrice: 1500, quantity: 3, subtotal: 4500 },
      { menuItem: "4", name: "Mango Juice", unitPrice: 500, quantity: 2, subtotal: 1000 },
    ],
    deliveryAddress: "Deido, Douala", subtotal: 5500, deliveryFee: 0, total: 5500,
    status: "PREPARING",
    statusHistory: [
      { status: "PLACED", timestamp: "2026-08-22T09:55:00Z" },
      { status: "CONFIRMED", timestamp: "2026-08-22T09:58:00Z" },
      { status: "PREPARING", timestamp: "2026-08-22T10:03:00Z" },
    ],
    paymentMethod: "COD", paymentStatus: "PENDING",
  },
  {
    id: "FQ-8832", customerName: "Samuel E.",
    items: [{ menuItem: "1", name: "Jollof Rice", unitPrice: 2000, quantity: 1, subtotal: 2000 }],
    deliveryAddress: "Bonanjo, Douala", subtotal: 2000, deliveryFee: 0, total: 2000,
    status: "READY_FOR_PICKUP",
    statusHistory: [
      { status: "PLACED", timestamp: "2026-08-22T09:40:00Z" },
      { status: "CONFIRMED", timestamp: "2026-08-22T09:42:00Z" },
      { status: "PREPARING", timestamp: "2026-08-22T09:45:00Z" },
      { status: "READY_FOR_PICKUP", timestamp: "2026-08-22T09:58:00Z" },
    ],
    paymentMethod: "COD", paymentStatus: "PENDING",
  },
  {
    id: "FQ-8811", customerName: "Marlyse D.",
    items: [{ menuItem: "5", name: "Fresh Mango Bowl", unitPrice: 800, quantity: 2, subtotal: 1600 }],
    deliveryAddress: "Makepe, Douala", subtotal: 1600, deliveryFee: 0, total: 1600,
    status: "CANCELLED",
    statusHistory: [
      { status: "PLACED", timestamp: "2026-08-22T08:10:00Z" },
      { status: "CANCELLED", timestamp: "2026-08-22T08:15:00Z" },
    ],
    paymentMethod: "COD", paymentStatus: "FAILED",
    cancellationReason: "Customer requested cancellation — changed their mind.",
  },
  {
    id: "FQ-8790", customerName: "Blaise K.",
    items: [{ menuItem: "6", name: "Fried Rice", unitPrice: 2200, quantity: 1, subtotal: 2200 }],
    deliveryAddress: "Bali, Douala", subtotal: 2200, deliveryFee: 0, total: 2200,
    status: "COMPLETED",
    statusHistory: [
      { status: "PLACED", timestamp: "2026-08-21T18:00:00Z" },
      { status: "CONFIRMED", timestamp: "2026-08-21T18:02:00Z" },
      { status: "PREPARING", timestamp: "2026-08-21T18:05:00Z" },
      { status: "READY_FOR_PICKUP", timestamp: "2026-08-21T18:20:00Z" },
      { status: "OUT_FOR_DELIVERY", timestamp: "2026-08-21T18:22:00Z" },
      { status: "DELIVERED", timestamp: "2026-08-21T18:40:00Z" },
      { status: "COMPLETED", timestamp: "2026-08-21T18:41:00Z" },
    ],
    paymentMethod: "COD", paymentStatus: "PAID",
  },
];

const filterTabs: (OrderStatus | "ALL")[] = ["ALL", "PLACED", "CONFIRMED", "PREPARING", "READY_FOR_PICKUP", "OUT_FOR_DELIVERY", "DELIVERED", "COMPLETED", "CANCELLED"];

export default function OwnerOrdersPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [activeFilter, setActiveFilter] = useState<OrderStatus | "ALL">("ALL");
  const [search, setSearch] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [cancelTarget, setCancelTarget] = useState<Order | null>(null);
  const [cancelReason, setCancelReason] = useState("");
  const { t } = useLanguage();
  const ordersT = t.ownerOrders || {};

  const filteredOrders = orders.filter((order) => {
    const matchesFilter = activeFilter === "ALL" || order.status === activeFilter;
    const matchesSearch =
      order.id.toLowerCase().includes(search.toLowerCase()) ||
      order.customerName.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const advanceStatus = (order: Order, newStatus: OrderStatus) => {
    const updated: Order = {
      ...order,
      status: newStatus,
      statusHistory: [...order.statusHistory, { status: newStatus, timestamp: new Date().toISOString() }],
      paymentStatus: newStatus === "DELIVERED" ? "PAID" : order.paymentStatus,
    };
    setOrders((prev) => prev.map((o) => (o.id === order.id ? updated : o)));
    setSelectedOrder((prev) => (prev && prev.id === order.id ? updated : prev));
  };

  const handleCancel = () => {
    if (!cancelTarget || !cancelReason.trim()) return;
    const updated: Order = {
      ...cancelTarget,
      status: "CANCELLED",
      cancellationReason: cancelReason,
      statusHistory: [...cancelTarget.statusHistory, { status: "CANCELLED", timestamp: new Date().toISOString() }],
    };
    setOrders((prev) => prev.map((o) => (o.id === cancelTarget.id ? updated : o)));
    setSelectedOrder((prev) => (prev && prev.id === cancelTarget.id ? updated : prev));
    setCancelTarget(null);
    setCancelReason("");
  };

  const formatTime = (iso: string) =>
    new Date(iso).toLocaleString(t?.lang === "fr" ? "fr-FR" : "en-US", {
      month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
    });

  return (
    <div style={{ fontFamily: "'Times New Roman', Times, serif" }} className="min-h-screen bg-white dark:bg-[#1A1310] text-[#1A1310] dark:text-white flex transition-colors duration-300">
      <OwnerSidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed((v) => !v)} />

      <div className="flex-1 flex flex-col min-w-0">
        <OwnerTopbar />

        <main className="flex-1 p-6 space-y-6 overflow-y-auto">
          <div>
            <h1 className="text-2xl font-black text-[#1A1310] dark:text-white">
              {ordersT.title || "Order Inbox"}
            </h1>
            <p className="text-xs text-gray-500 dark:text-white/60 mt-0.5">
              {ordersT.subtitle || "Manage incoming orders through every stage"}
            </p>
          </div>

          <div className="flex items-center gap-3 bg-orange-50/50 dark:bg-white/5 border border-orange-200 dark:border-orange-900/40 rounded-xl px-4 py-2.5 max-w-md">
            <FaSearch size={13} className="text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={ordersT.searchPlaceholder || "Search by order ID or customer..."}
              className="bg-transparent border-none outline-none text-sm text-[#1A1310] dark:text-white placeholder-gray-400 dark:placeholder-white/30 w-full"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: "thin" }}>
            {filterTabs.map((status) => (
              <button
                key={status}
                onClick={() => setActiveFilter(status)}
                className={`shrink-0 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeFilter === status
                    ? "bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-sm shadow-orange-500/25"
                    : "bg-orange-50/50 dark:bg-white/5 text-gray-600 dark:text-white/70 hover:bg-orange-100 dark:hover:bg-white/10 border border-orange-100 dark:border-orange-900/20"
                }`}
              >
                {status === "ALL" ? (ordersT.all || "All") : statusLabels[status]}
              </button>
            ))}
          </div>

          {filteredOrders.length === 0 ? (
            <div className="bg-orange-50/30 dark:bg-[#241C17]/60 border border-orange-100 dark:border-orange-900/30 rounded-xl p-12 text-center">
              <p className="text-sm text-gray-500 dark:text-white/60">
                {ordersT.noResults || "No orders match your filters."}
              </p>
            </div>
          ) : (
            <div className="bg-orange-50/30 dark:bg-[#241C17]/60 border border-orange-100 dark:border-orange-900/30 rounded-xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto" style={{ scrollbarWidth: "thin" }}>
                <table className="w-full text-left text-xs min-w-[700px]">
                  <thead>
                    <tr className="border-b border-orange-100 dark:border-orange-900/30 text-[11px] text-gray-400 dark:text-white/40 uppercase tracking-wider">
                      <th className="px-5 py-3 font-bold">{ordersT.colOrder || "Order"}</th>
                      <th className="px-5 py-3 font-bold">{ordersT.colCustomer || "Customer"}</th>
                      <th className="px-5 py-3 font-bold">{ordersT.colItems || "Items"}</th>
                      <th className="px-5 py-3 font-bold">{ordersT.colTotal || "Total"}</th>
                      <th className="px-5 py-3 font-bold">{ordersT.colStatus || "Status"}</th>
                      <th className="px-5 py-3 font-bold text-right">{ordersT.colAction || "Action"}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-orange-100/50 dark:divide-orange-900/20 text-[13px]">
                    {filteredOrders.map((order) => {
                      const nextStatuses = ALLOWED_TRANSITIONS[order.status];
                      const nextAdvance = nextStatuses.find((s) => s !== "CANCELLED");
                      return (
                        <tr
                          key={order.id}
                          className="hover:bg-orange-100/20 dark:hover:bg-white/5 transition-colors cursor-pointer"
                          onClick={() => setSelectedOrder(order)}
                        >
                          <td className="px-5 py-3.5 font-bold text-[#1A1310] dark:text-white whitespace-nowrap">
                            #{order.id}
                          </td>
                          <td className="px-5 py-3.5 text-gray-600 dark:text-white/80 whitespace-nowrap">
                            {order.customerName}
                          </td>
                          <td className="px-5 py-3.5 text-gray-500 dark:text-white/60 max-w-[200px] truncate">
                            {order.items.map((i) => `${i.quantity}x ${i.name}`).join(", ")}
                          </td>
                          <td className="px-5 py-3.5 font-mono font-semibold text-orange-600 dark:text-orange-400 whitespace-nowrap">
                            {order.total.toLocaleString()} XAF
                          </td>
                          <td className="px-5 py-3.5 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold ${statusStyles[order.status]}`}>
                              {statusLabels[order.status]}
                            </span>
                          </td>
                          <td className="px-5 py-3.5 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                            {nextAdvance ? (
                              <button
                                onClick={() => advanceStatus(order, nextAdvance)}
                                className="text-[11px] font-bold bg-gradient-to-r from-orange-500 to-red-600 text-white px-3 py-1.5 rounded-lg hover:shadow-sm transition-all cursor-pointer"
                              >
                                {nextActionLabel[order.status]}
                              </button>
                            ) : (
                              <span className="text-[11px] text-gray-300 dark:text-white/20">—</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>

      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelectedOrder(null)}>
          <div
            className="bg-white dark:bg-[#241C17] rounded-2xl border border-orange-100 dark:border-orange-900/30 shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-orange-100 dark:border-orange-900/30 sticky top-0 bg-white dark:bg-[#241C17] z-10">
              <div>
                <h2 className="text-base font-bold text-[#1A1310] dark:text-white">#{selectedOrder.id}</h2>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold mt-1 ${statusStyles[selectedOrder.status]}`}>
                  {statusLabels[selectedOrder.status]}
                </span>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="text-gray-400 hover:text-gray-600 dark:hover:text-white cursor-pointer">
                <FaTimes size={16} />
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div>
                <p className="text-[11px] font-bold text-gray-400 dark:text-white/40 uppercase tracking-wide mb-1.5">
                  {ordersT.customer || "Customer"}
                </p>
                <p className="text-sm font-semibold text-[#1A1310] dark:text-white">{selectedOrder.customerName}</p>
                <p className="text-[12px] text-gray-500 dark:text-white/60 flex items-center gap-1.5 mt-1">
                  <FaMapMarkerAlt size={10} className="text-orange-500" /> {selectedOrder.deliveryAddress}
                </p>
              </div>

              <div>
                <p className="text-[11px] font-bold text-gray-400 dark:text-white/40 uppercase tracking-wide mb-2">
                  {ordersT.items || "Items"}
                </p>
                <div className="space-y-2">
                  {selectedOrder.items.map((item, i) => (
                    <div key={i} className="flex items-center justify-between text-sm">
                      <span className="text-gray-700 dark:text-white/80">
                        {item.quantity}x {item.name}
                      </span>
                      <span className="font-mono text-gray-500 dark:text-white/60">{item.subtotal.toLocaleString()} XAF</span>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between pt-3 mt-3 border-t border-orange-100 dark:border-white/10 text-sm">
                  <span className="font-bold text-[#1A1310] dark:text-white">{ordersT.total || "Total"}</span>
                  <span className="font-mono font-bold text-orange-600 dark:text-orange-400">{selectedOrder.total.toLocaleString()} XAF</span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-gray-400 dark:text-white/40 mt-1">
                  <FaMoneyBillWave size={10} />
                  {ordersT.cod || "Cash on Delivery"} · {selectedOrder.paymentStatus}
                </div>
              </div>

              <div>
                <p className="text-[11px] font-bold text-gray-400 dark:text-white/40 uppercase tracking-wide mb-2">
                  {ordersT.statusHistory || "Status History"}
                </p>
                <div className="space-y-2.5">
                  {selectedOrder.statusHistory.map((event, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <span className="w-2 h-2 rounded-full bg-orange-500 shrink-0" />
                      <span className="text-xs font-semibold text-[#1A1310] dark:text-white">{statusLabels[event.status]}</span>
                      <span className="text-[10px] text-gray-400 dark:text-white/40 ml-auto flex items-center gap-1">
                        <FaClock size={9} /> {formatTime(event.timestamp)}
                      </span>
                    </div>
                  ))}
                </div>
                {selectedOrder.cancellationReason && (
                  <div className="mt-3 p-3 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30">
                    <p className="text-[11px] font-bold text-red-600 dark:text-red-400 mb-1">
                      {ordersT.cancellationReason || "Cancellation Reason"}
                    </p>
                    <p className="text-xs text-red-700 dark:text-red-300">{selectedOrder.cancellationReason}</p>
                  </div>
                )}
              </div>
            </div>

            {ALLOWED_TRANSITIONS[selectedOrder.status].length > 0 && (
              <div className="flex items-center gap-3 px-6 py-4 border-t border-orange-100 dark:border-orange-900/30 sticky bottom-0 bg-white dark:bg-[#241C17]">
                {ALLOWED_TRANSITIONS[selectedOrder.status].includes("CANCELLED") && (
                  <button
                    onClick={() => setCancelTarget(selectedOrder)}
                    className="flex-1 py-2.5 rounded-xl text-sm font-bold text-red-600 border border-red-200 dark:border-red-900/40 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors cursor-pointer flex items-center justify-center gap-2"
                  >
                    <FaBan size={12} /> {ordersT.cancelOrder || "Cancel Order"}
                  </button>
                )}
                {ALLOWED_TRANSITIONS[selectedOrder.status].find((s) => s !== "CANCELLED") && (
                  <button
                    onClick={() =>
                      advanceStatus(selectedOrder, ALLOWED_TRANSITIONS[selectedOrder.status].find((s) => s !== "CANCELLED")!)
                    }
                    className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-orange-500 to-red-600 hover:shadow-lg hover:shadow-orange-500/25 transition-all cursor-pointer"
                  >
                    {nextActionLabel[selectedOrder.status]}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {cancelTarget && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4" onClick={() => setCancelTarget(null)}>
          <div
            className="bg-white dark:bg-[#241C17] rounded-2xl border border-orange-100 dark:border-orange-900/30 shadow-2xl w-full max-w-sm p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-base font-bold text-[#1A1310] dark:text-white mb-2">
              {ordersT.cancelTitle || "Cancel this order?"}
            </h3>
            <p className="text-sm text-gray-500 dark:text-white/60 mb-4">
              #{cancelTarget.id} — {ordersT.cancelSub || "Please provide a reason for this cancellation."}
            </p>
            <textarea
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder={ordersT.cancelReasonPlaceholder || "e.g. Out of ingredients for this dish"}
              rows={3}
              className="w-full bg-orange-50/50 dark:bg-white/5 border border-orange-200 dark:border-orange-900/40 rounded-lg px-3.5 py-2.5 text-sm text-[#1A1310] dark:text-white placeholder-gray-400 dark:placeholder-white/30 outline-none focus:border-orange-500 resize-none mb-4"
            />
            <div className="flex items-center gap-3">
              <button
                onClick={() => { setCancelTarget(null); setCancelReason(""); }}
                className="flex-1 py-2.5 rounded-xl text-sm font-bold text-gray-600 dark:text-white/70 border border-orange-200 dark:border-orange-900/40 hover:bg-orange-50 dark:hover:bg-white/5 transition-colors cursor-pointer"
              >
                {ordersT.keepOrder || "Keep Order"}
              </button>
              <button
                onClick={handleCancel}
                disabled={!cancelReason.trim()}
                className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white bg-red-600 hover:bg-red-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                {ordersT.confirmCancel || "Confirm Cancellation"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}