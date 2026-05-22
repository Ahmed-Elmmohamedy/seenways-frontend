"use client";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Trash2, Shield, Plus, Phone } from "lucide-react";
import { api } from "@/lib/api";

interface BlacklistEntry {
  id: string;
  phone: string;
  reason?: string;
  createdAt: string;
}

export default function BlacklistPage() {
  const [list, setList] = useState<BlacklistEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [phone, setPhone] = useState("");
  const [reason, setReason] = useState("");
  const [adding, setAdding] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const load = () => {
    setLoading(true);
    api.get("/blacklist")
      .then(r => { setList(r.data); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim()) { toast.error("أدخل رقم التليفون"); return; }
    setAdding(true);
    try {
      await api.post("/blacklist", { phone: phone.trim(), reason: reason.trim() || null });
      toast.success("تم إضافة الرقم للقائمة السوداء");
      setPhone(""); setReason(""); setShowForm(false); load();
    } catch (err: any) {
      toast.error(err.response?.data?.error || "فشل الإضافة");
    } finally { setAdding(false); }
  };

  const handleRemove = async (id: string, phone: string) => {
    if (!confirm(`إزالة ${phone} من القائمة السوداء؟`)) return;
    try {
      await api.delete(`/blacklist/${id}`);
      toast.success("تم الإزالة");
      load();
    } catch { toast.error("فشل الحذف"); }
  };

  return (
    <div dir="rtl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-display tracking-widest">BLACKLIST</h1>
          <p className="text-gray-400 text-xs tracking-wider mt-1">{list.length} رقم محظور</p>
        </div>
        <button onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-black text-white px-5 py-2.5 text-xs tracking-widest uppercase hover:bg-gray-900 transition-colors">
          <Plus size={14} /> إضافة رقم
        </button>
      </div>

      {showForm && (
        <div className="bg-white border border-gray-100 p-5 mb-5">
          <h2 className="text-sm font-display tracking-widest mb-4">إضافة رقم للقائمة السوداء</h2>
          <form onSubmit={handleAdd}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-[10px] tracking-widest uppercase mb-2 text-gray-400">رقم التليفون *</label>
                <input value={phone} onChange={e => setPhone(e.target.value)}
                  placeholder="01XXXXXXXXX"
                  className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors font-mono" />
              </div>
              <div>
                <label className="block text-[10px] tracking-widest uppercase mb-2 text-gray-400">السبب (اختياري)</label>
                <input value={reason} onChange={e => setReason(e.target.value)}
                  placeholder="مثال: طلبات وهمية متكررة"
                  className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors" />
              </div>
            </div>
            <div className="flex gap-3">
              <button type="submit" disabled={adding}
                className="bg-black text-white px-6 py-2.5 text-xs tracking-widest uppercase hover:bg-gray-900 transition-colors disabled:opacity-50">
                {adding ? "جاري الإضافة..." : "إضافة"}
              </button>
              <button type="button" onClick={() => setShowForm(false)}
                className="border border-gray-200 px-5 py-2.5 text-xs tracking-widest uppercase hover:bg-gray-50 transition-colors">
                إلغاء
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-3">
            {[...Array(3)].map((_, i) => <div key={i} className="h-12 bg-gray-50 animate-pulse rounded" />)}
          </div>
        ) : list.length === 0 ? (
          <div className="text-center py-20">
            <Shield size={36} className="text-gray-200 mx-auto mb-4" />
            <p className="text-gray-400 text-xs tracking-widest uppercase">لا توجد أرقام محظورة</p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-5 py-3.5 text-right text-[10px] tracking-widest uppercase text-gray-400">رقم التليفون</th>
                <th className="px-5 py-3.5 text-right text-[10px] tracking-widest uppercase text-gray-400 hidden md:table-cell">السبب</th>
                <th className="px-5 py-3.5 text-right text-[10px] tracking-widest uppercase text-gray-400 hidden md:table-cell">التاريخ</th>
                <th className="px-5 py-3.5 text-left text-[10px] tracking-widest uppercase text-gray-400">إجراء</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {list.map(entry => (
                <tr key={entry.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <Phone size={13} className="text-red-400" />
                      <span className="text-sm font-mono">{entry.phone}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 hidden md:table-cell text-xs text-gray-400">{entry.reason || "—"}</td>
                  <td className="px-5 py-3.5 hidden md:table-cell text-xs text-gray-400">
                    {new Date(entry.createdAt).toLocaleDateString("ar-EG")}
                  </td>
                  <td className="px-5 py-3.5">
                    <button onClick={() => handleRemove(entry.id, entry.phone)}
                      className="text-gray-300 hover:text-red-400 transition-colors">
                      <Trash2 size={15} />
                    </button>
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