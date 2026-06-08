"use client";
import { useEffect, useState } from "react";
import { Bell, Check, Trash2, MessageCircle } from "lucide-react";
import { useAuthStore } from "@/lib/store";
import toast from "react-hot-toast";

interface Notification {
  id: string;
  phone: string;
  notified: boolean;
  createdAt: string;
  product: { id: string; name: string };
}

export default function NotificationsPage() {
  const { token } = useAuthStore();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "pending" | "notified">("pending");

  const API = "https://seenways-backend-production.up.railway.app/api";

  const load = async () => {
    setLoading(true);
    try {
      const query = filter === "pending" ? "?notified=false" : filter === "notified" ? "?notified=true" : "";
      const res = await fetch(`${API}/notifications${query}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setNotifications(Array.isArray(data) ? data : []);
    } catch {
      toast.error("فشل تحميل الإشعارات");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [filter]);

  const markNotified = async (id: string) => {
    try {
      await fetch(`${API}/notifications/${id}/notified`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("تم التحديد كـ مُبلَّغ");
      load();
    } catch {
      toast.error("حدث خطأ");
    }
  };

  const deleteNotification = async (id: string) => {
    if (!confirm("حذف هذا الإشعار؟")) return;
    try {
      await fetch(`${API}/notifications/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("تم الحذف");
      load();
    } catch {
      toast.error("حدث خطأ");
    }
  };

  const openWhatsApp = (phone: string, productName: string) => {
    const msg = encodeURIComponent(`مرحباً! المنتج "${productName}" أصبح متاحاً الآن على SEENWAYS 🎉\nتفضل بزيارة الموقع: https://seenways.com`);
    window.open(`https://wa.me/2${phone}?text=${msg}`, "_blank");
  };

  const pending   = notifications.filter(n => !n.notified).length;
  const notified  = notifications.filter(n =>  n.notified).length;

  return (
    <div dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-display tracking-widest">NOTIFICATIONS</h1>
          <p className="text-gray-400 text-xs tracking-wider mt-1">طلبات إشعار توفر المنتجات</p>
        </div>
        <div className="flex gap-4 text-center">
          <div className="bg-black text-white px-4 py-2">
            <p className="text-xl font-display">{pending}</p>
            <p className="text-[10px] tracking-widest uppercase text-white/60">في الانتظار</p>
          </div>
          <div className="bg-gray-100 px-4 py-2">
            <p className="text-xl font-display">{notified}</p>
            <p className="text-[10px] tracking-widest uppercase text-gray-400">تم الإبلاغ</p>
          </div>
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-2 mb-5">
        {[
          { id: "pending",  label: "في الانتظار" },
          { id: "notified", label: "تم الإبلاغ" },
          { id: "all",      label: "الكل" },
        ].map(f => (
          <button key={f.id} onClick={() => setFilter(f.id as any)}
            className={`px-4 py-2 text-xs tracking-widest uppercase transition-colors ${filter === f.id ? "bg-black text-white" : "border border-gray-200 text-gray-400 hover:border-black"}`}>
            {f.label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-3">
            {[...Array(4)].map((_, i) => <div key={i} className="h-16 bg-gray-50 animate-pulse rounded" />)}
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-20">
            <Bell size={32} className="text-gray-200 mx-auto mb-3" />
            <p className="text-gray-400 text-xs tracking-widest uppercase">لا توجد إشعارات</p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-5 py-3.5 text-right text-[10px] tracking-widest uppercase text-gray-400">المنتج</th>
                <th className="px-5 py-3.5 text-right text-[10px] tracking-widest uppercase text-gray-400">رقم التليفون</th>
                <th className="px-5 py-3.5 text-right text-[10px] tracking-widest uppercase text-gray-400 hidden md:table-cell">التاريخ</th>
                <th className="px-5 py-3.5 text-right text-[10px] tracking-widest uppercase text-gray-400">الحالة</th>
                <th className="px-5 py-3.5 text-left text-[10px] tracking-widest uppercase text-gray-400">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {notifications.map(n => (
                <tr key={n.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-4">
                    <p className="text-xs font-medium">{n.product?.name}</p>
                  </td>
                  <td className="px-5 py-4">
                    <p className="text-xs font-mono tracking-wider" dir="ltr">{n.phone}</p>
                  </td>
                  <td className="px-5 py-4 hidden md:table-cell">
                    <p className="text-xs text-gray-400">
                      {new Date(n.createdAt).toLocaleDateString("ar-EG")}
                    </p>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`text-[10px] px-2.5 py-1 tracking-widest uppercase ${n.notified ? "bg-green-50 text-green-600" : "bg-yellow-50 text-yellow-600"}`}>
                      {n.notified ? "تم الإبلاغ" : "في الانتظار"}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2 justify-end">
                      {/* واتساب */}
                      <button
                        onClick={() => openWhatsApp(n.phone, n.product?.name)}
                        title="إرسال واتساب"
                        className="text-green-500 hover:text-green-700 transition-colors">
                        <MessageCircle size={16} />
                      </button>
                      {/* تحديد كـ مُبلَّغ */}
                      {!n.notified && (
                        <button
                          onClick={() => markNotified(n.id)}
                          title="تحديد كـ مُبلَّغ"
                          className="text-gray-400 hover:text-black transition-colors">
                          <Check size={16} />
                        </button>
                      )}
                      {/* حذف */}
                      <button
                        onClick={() => deleteNotification(n.id)}
                        title="حذف"
                        className="text-gray-300 hover:text-red-400 transition-colors">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
