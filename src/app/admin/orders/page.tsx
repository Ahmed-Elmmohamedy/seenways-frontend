"use client";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { X, Download, Trash2, Search } from "lucide-react";
import { getOrders, updateOrderStatus, deleteOrder, exportOrdersCSV } from "@/lib/api";
import { Order, OrderStatus } from "@/types";
import { statusAr, statusColor, formatPrice } from "@/lib/utils";

const ALL_STATUSES: OrderStatus[] = ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];

function OrderDetail({ order, onClose, onUpdate, onDelete }: {
  order: Order; onClose: () => void; onUpdate: (u: Order) => void; onDelete: (id: string) => void;
}) {
  const [updating, setUpdating] = useState(false);
  const customer = order.customer as any;

  const handleStatus = async (status: OrderStatus) => {
    setUpdating(true);
    try { const res = await updateOrderStatus(order.id, status); toast.success("Status updated"); onUpdate(res.data); }
    catch { toast.error("Update failed"); }
    finally { setUpdating(false); }
  };

  const handleDelete = async () => {
    if (!confirm(`Delete order ${order.orderNumber}?`)) return;
    try { await deleteOrder(order.id); toast.success("Deleted"); onDelete(order.id); onClose(); }
    catch { toast.error("Delete failed"); }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-end" onClick={onClose}>
      <div className="w-full max-w-md bg-white h-full overflow-y-auto shadow-2xl flex flex-col" onClick={(e) => e.stopPropagation()} dir="ltr">
        <div className="sticky top-0 bg-white border-b border-gray-100 flex items-center justify-between p-5 z-10">
          <div>
            <h2 className="text-base font-display tracking-widest">{order.orderNumber}</h2>
            <p className="text-[10px] text-gray-400 mt-0.5">{new Date(order.createdAt).toLocaleDateString("en-GB")}</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={handleDelete} className="text-gray-300 hover:text-red-400 transition-colors"><Trash2 size={16} /></button>
            <button onClick={onClose} className="text-gray-400 hover:text-black transition-colors"><X size={18} /></button>
          </div>
        </div>
        <div className="flex-1 p-5 space-y-6">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-[10px] px-3 py-1.5 tracking-widest uppercase ${statusColor[order.status]}`}>{statusAr[order.status]}</span>
            {(order as any).couponCode && <span className="text-[10px] bg-purple-50 text-purple-600 px-3 py-1.5 tracking-widest uppercase">COUPON: {(order as any).couponCode}</span>}
          </div>
          <div>
            <p className="text-[10px] tracking-widest uppercase text-gray-300 mb-3">Customer</p>
            <div className="space-y-2">
              {[["Name", customer?.name], ["Phone", customer?.phone], ["City", customer?.city], ["Address", customer?.address]].map(([l, v]) => v && (
                <div key={l} className="flex justify-between text-xs"><span className="text-gray-400">{l}</span><span className="font-medium text-right max-w-[60%]">{v}</span></div>
              ))}
            </div>
          </div>
          <div>
            <p className="text-[10px] tracking-widest uppercase text-gray-300 mb-3">Items</p>
            <div className="space-y-3">
              {order.items?.map((item: any) => (
                <div key={item.id} className="flex justify-between items-start pb-3 border-b border-gray-50 last:border-0">
                  <div><p className="text-xs font-medium">{item.product?.name}</p><p className="text-[10px] text-gray-400 mt-0.5">{[item.size && `Size: ${item.size}`, item.color && `Color: ${item.color}`, `Qty: ${item.quantity}`].filter(Boolean).join(" · ")}</p></div>
                  <p className="text-xs font-medium">{formatPrice(item.price * item.quantity)}</p>
                </div>
              ))}
            </div>
            <div className="mt-3 pt-3 border-t border-gray-100 space-y-1.5">
              {(order as any).discount > 0 && (
                <div className="flex justify-between text-xs text-green-600"><span>Discount</span><span>-{formatPrice((order as any).discount)}</span></div>
              )}
              <div className="flex justify-between font-medium pt-1"><span className="text-xs tracking-widest uppercase">Total</span><span className="text-sm font-display">{formatPrice(order.totalAmount)}</span></div>
            </div>
          </div>
          {order.notes && <div><p className="text-[10px] tracking-widest uppercase text-gray-300 mb-2">Notes</p><p className="text-xs text-gray-500 bg-gray-50 p-3">{order.notes}</p></div>}
          <div>
            <p className="text-[10px] tracking-widest uppercase text-gray-300 mb-3">Update Status</p>
            <div className="grid grid-cols-2 gap-2">
              {ALL_STATUSES.map((s) => (
                <button key={s} onClick={() => handleStatus(s)} disabled={updating}
                  className={`py-2.5 text-[10px] tracking-widest uppercase border transition-all disabled:opacity-40 ${order.status === s ? "bg-black text-white border-black" : "border-gray-200 hover:border-black"}`}>
                  {statusAr[s]}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Order | null>(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [exporting, setExporting] = useState(false);

  const load = (searchVal = search) => {
    setLoading(true);
    const params: any = { page, limit: 20 };
    if (filter) params.status = filter;
    if (searchVal) params.search = searchVal;
    getOrders(params).then((r) => { setOrders(r.data.orders); setTotal(r.data.total); setLoading(false); }).catch(() => setLoading(false));
  };

  useEffect(() => { load(); }, [filter, page]);

  const handleSearch = (e: React.FormEvent) => { e.preventDefault(); load(search); };

  const handleExport = async () => {
    setExporting(true);
    try {
      const res = await exportOrdersCSV(filter ? { status: filter } : {});
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement("a"); a.href = url; a.download = `orders-${Date.now()}.csv`; a.click();
      window.URL.revokeObjectURL(url); toast.success("CSV exported");
    } catch { toast.error("Export failed"); }
    finally { setExporting(false); }
  };

  const handleUpdate = (updated: Order) => { setOrders((p) => p.map((o) => o.id === updated.id ? updated : o)); setSelected(updated); };
  const handleDelete = (id: string) => { setOrders((p) => p.filter((o) => o.id !== id)); setTotal((t) => t - 1); };

  return (
    <div dir="ltr">
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="text-3xl font-display tracking-widest">ORDERS</h1><p className="text-gray-400 text-xs tracking-wider mt-1">{total} total</p></div>
        <button onClick={handleExport} disabled={exporting} className="flex items-center gap-2 border border-gray-200 px-4 py-2.5 text-xs tracking-widest uppercase hover:border-black transition-colors disabled:opacity-50">
          <Download size={14} /> {exporting ? "Exporting..." : "Export CSV"}
        </button>
      </div>
      <div className="flex flex-col md:flex-row gap-3 mb-5">
        <form onSubmit={handleSearch} className="flex-1 relative">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by order number..."
            className="w-full border border-gray-200 pl-9 pr-4 py-2.5 text-xs focus:outline-none focus:border-black transition-colors" />
        </form>
        <div className="flex gap-1.5 flex-wrap">
          <button onClick={() => { setFilter(""); setPage(1); }} className={`px-3 py-2.5 text-[10px] tracking-widest uppercase border transition-all ${!filter ? "bg-black text-white border-black" : "border-gray-200 hover:border-black"}`}>ALL</button>
          {ALL_STATUSES.map((s) => (
            <button key={s} onClick={() => { setFilter(s); setPage(1); }} className={`px-3 py-2.5 text-[10px] tracking-widest uppercase border transition-all ${filter === s ? "bg-black text-white border-black" : "border-gray-200 hover:border-black"}`}>{statusAr[s]}</button>
          ))}
        </div>
      </div>
      <div className="bg-white border border-gray-100 overflow-hidden">
        {loading ? <div className="p-6 space-y-3">{[...Array(5)].map((_, i) => <div key={i} className="h-12 bg-gray-50 animate-pulse rounded" />)}</div> : (
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-5 py-3.5 text-left text-[10px] tracking-widest uppercase text-gray-400">Order</th>
                <th className="px-5 py-3.5 text-left text-[10px] tracking-widest uppercase text-gray-400 hidden md:table-cell">Customer</th>
                <th className="px-5 py-3.5 text-left text-[10px] tracking-widest uppercase text-gray-400">Status</th>
                <th className="px-5 py-3.5 text-left text-[10px] tracking-widest uppercase text-gray-400">Total</th>
                <th className="px-5 py-3.5 text-left text-[10px] tracking-widest uppercase text-gray-400 hidden lg:table-cell">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {orders.map((o) => (
                <tr key={o.id} onClick={() => setSelected(o)} className="hover:bg-gray-50 cursor-pointer group transition-colors">
                  <td className="px-5 py-3.5"><p className="text-xs font-medium group-hover:underline">{o.orderNumber}</p><p className="text-[10px] text-gray-400 md:hidden">{(o.customer as any)?.name}</p></td>
                  <td className="px-5 py-3.5 hidden md:table-cell"><p className="text-xs">{(o.customer as any)?.name}</p><p className="text-[10px] text-gray-400">{(o.customer as any)?.phone}</p></td>
                  <td className="px-5 py-3.5"><span className={`text-[10px] px-2.5 py-1 tracking-widest uppercase ${statusColor[o.status]}`}>{statusAr[o.status]}</span></td>
                  <td className="px-5 py-3.5"><p className="text-xs font-medium">{formatPrice(o.totalAmount)}</p>{(o as any).discount > 0 && <p className="text-[10px] text-green-500">-{formatPrice((o as any).discount)}</p>}</td>
                  <td className="px-5 py-3.5 text-[10px] text-gray-400 hidden lg:table-cell">{new Date(o.createdAt).toLocaleDateString("en-GB")}</td>
                </tr>
              ))}
              {orders.length === 0 && <tr><td colSpan={5} className="text-center py-16 text-gray-400 text-xs tracking-widest uppercase">No orders found</td></tr>}
            </tbody>
          </table>
        )}
      </div>
      {total > 20 && (
        <div className="flex items-center justify-between mt-4">
          <p className="text-xs text-gray-400">{Math.min(page * 20, total)} of {total}</p>
          <div className="flex gap-2">
            <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1} className="px-4 py-2 border border-gray-200 text-xs tracking-widest uppercase hover:border-black disabled:opacity-30 transition-colors">Prev</button>
            <button onClick={() => setPage(page + 1)} disabled={page * 20 >= total} className="px-4 py-2 border border-gray-200 text-xs tracking-widest uppercase hover:border-black disabled:opacity-30 transition-colors">Next</button>
          </div>
        </div>
      )}
      {selected && <OrderDetail order={selected} onClose={() => setSelected(null)} onUpdate={handleUpdate} onDelete={handleDelete} />}
    </div>
  );
}
