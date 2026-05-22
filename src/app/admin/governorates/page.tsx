"use client";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Trash2, Shield, Plus, MapPin, ToggleLeft, ToggleRight, Edit2, Check, X } from "lucide-react";
import { api } from "@/lib/api";
import { formatPrice } from "@/lib/utils";

interface Governorate {
  id: string;
  name: string;
  shippingFee: number;
  isActive: boolean;
}

export default function GovernoratesPage() {
  const [govs, setGovs] = useState<Governorate[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [fee, setFee] = useState("");
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editFee, setEditFee] = useState("");

  const load = () => {
    setLoading(true);
    api.get("/governorates/admin/all")
      .then(r => { setGovs(r.data); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) { toast.error("أدخل اسم المحافظة"); return; }
    setAdding(true);
    try {
      await api.post("/governorates", { name: name.trim(), shippingFee: parseFloat(fee) || 0 });
      toast.success("تمت الإضافة");
      setName(""); setFee(""); setShowForm(false); load();
    } catch (err: any) {
      toast.error(err.response?.data?.error || "فشل الإضافة");
    } finally { setAdding(false); }
  };

  const handleToggle = async (gov: Governorate) => {
    try {
      await api.put(`/governorates/${gov.id}`, { isActive: !gov.isActive });
      load();
    } catch { toast.error("فشل التحديث"); }
  };

  const handleEditFee = async (gov: Governorate) => {
    try {
      await api.put(`/governorates/${gov.id}`, { shippingFee: parseFloat(editFee) || 0 });
      toast.success("تم تحديث سعر الشحن");
      setEditingId(null); load();
    } catch { toast.error("فشل التحديث"); }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`حذف محافظة "${name}"؟`)) return;
    try {
      await api.delete(`/governorates/${id}`);
      toast.success("تم الحذف"); load();
    } catch { toast.error("فشل الحذف"); }
  };

  const activeCount = govs.filter(g => g.isActive).length;

  return (
    <div dir="rtl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-display tracking-widest">المحافظات والشحن</h1>
          <p className="text-gray-400 text-xs tracking-wider mt-1">{activeCount} محافظة متاحة من {govs.length}</p>
        </div>
        <button onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-black text-white px-5 py-2.5 text-xs tracking-widest uppercase hover:bg-gray-900 transition-colors">
          <Plus size={14} /> إضافة محافظة
        </button>
      </div>

      {showForm && (
        <div className="bg-white border border-gray-100 p-5 mb-5">
          <h2 className="text-sm font-display tracking-widest mb-4">إضافة محافظة جديدة</h2>
          <form onSubmit={handleAdd}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-[10px] tracking-widest uppercase mb-2 text-gray-400">اسم المحافظة *</label>
                <input value={name} onChange={e => setName(e.target.value)}
                  placeholder="مثال: دمياط"
                  className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors" />
              </div>
              <div>
                <label className="block text-[10px] tracking-widest uppercase mb-2 text-gray-400">سعر الشحن (ج.م)</label>
                <input type="number" value={fee} onChange={e => setFee(e.target.value)}
                  placeholder="0 = مجاني"
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
            {[...Array(5)].map((_, i) => <div key={i} className="h-12 bg-gray-50 animate-pulse rounded" />)}
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-5 py-3.5 text-right text-[10px] tracking-widest uppercase text-gray-400">المحافظة</th>
                <th className="px-5 py-3.5 text-right text-[10px] tracking-widest uppercase text-gray-400">سعر الشحن</th>
                <th className="px-5 py-3.5 text-right text-[10px] tracking-widest uppercase text-gray-400">الحالة</th>
                <th className="px-5 py-3.5 text-left text-[10px] tracking-widest uppercase text-gray-400">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {govs.map(gov => (
                <tr key={gov.id} className={`hover:bg-gray-50 transition-colors ${!gov.isActive ? "opacity-40" : ""}`}>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <MapPin size={13} className="text-gray-400" />
                      <span className="text-sm">{gov.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    {editingId === gov.id ? (
                      <div className="flex items-center gap-2">
                        <input type="number" value={editFee} onChange={e => setEditFee(e.target.value)}
                          className="w-24 border border-gray-200 px-2 py-1 text-xs focus:outline-none focus:border-black" />
                        <button onClick={() => handleEditFee(gov)} className="text-green-500"><Check size={14} /></button>
                        <button onClick={() => setEditingId(null)} className="text-gray-300 hover:text-red-400"><X size={14} /></button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">
                          {gov.shippingFee === 0 ? <span className="text-green-600 text-xs">مجاني</span> : formatPrice(gov.shippingFee)}
                        </span>
                        <button onClick={() => { setEditingId(gov.id); setEditFee(String(gov.shippingFee)); }}
                          className="text-gray-300 hover:text-black transition-colors">
                          <Edit2 size={12} />
                        </button>
                      </div>
                    )}
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`text-[10px] px-2.5 py-1 tracking-widest uppercase ${gov.isActive ? "bg-green-50 text-green-600" : "bg-gray-100 text-gray-400"}`}>
                      {gov.isActive ? "متاحة" : "موقوفة"}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3 justify-end">
                      <button onClick={() => handleToggle(gov)} className="text-gray-400 hover:text-black transition-colors">
                        {gov.isActive ? <ToggleRight size={18} className="text-green-500" /> : <ToggleLeft size={18} />}
                      </button>
                      <button onClick={() => handleDelete(gov.id, gov.name)} className="text-gray-300 hover:text-red-400 transition-colors">
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