"use client";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Plus, Trash2, ToggleLeft, ToggleRight, Tag, Copy, Check } from "lucide-react";
import { getCoupons, createCoupon, toggleCoupon, deleteCoupon } from "@/lib/api";

interface Coupon {
  id: string;
  code: string;
  type: "PERCENTAGE" | "FIXED";
  value: number;
  minOrderValue: number;
  maxUses: number | null;
  usedCount: number;
  isActive: boolean;
  expiresAt: string | null;
  createdAt: string;
}

const emptyForm = { code: "", type: "PERCENTAGE" as const, value: "", minOrderValue: "", maxUses: "", expiresAt: "" };

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState("");

  const load = () => {
    setLoading(true);
    getCoupons().then((r) => { setCoupons(r.data); setLoading(false); }).catch(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.code || !form.value) { toast.error("Code and value are required"); return; }
    setSaving(true);
    try {
      await createCoupon({
        code: form.code,
        type: form.type,
        value: parseFloat(form.value),
        minOrderValue: form.minOrderValue ? parseFloat(form.minOrderValue) : 0,
        maxUses: form.maxUses ? parseInt(form.maxUses) : null,
        expiresAt: form.expiresAt || null,
      });
      toast.success("Coupon created");
      setForm(emptyForm);
      setShowForm(false);
      load();
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to create coupon");
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = async (id: string) => {
    try { await toggleCoupon(id); load(); }
    catch { toast.error("Update failed"); }
  };

  const handleDelete = async (id: string, code: string) => {
    if (!confirm(`Delete coupon "${code}"?`)) return;
    try { await deleteCoupon(id); load(); toast.success("Deleted"); }
    catch { toast.error("Delete failed"); }
  };

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(code);
    setTimeout(() => setCopied(""), 2000);
  };

  const isExpired = (expiresAt: string | null) => expiresAt && new Date() > new Date(expiresAt);

  return (
    <div dir="ltr">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-display tracking-widest">COUPONS</h1>
          <p className="text-gray-400 text-xs tracking-wider mt-1">{coupons.length} total coupons</p>
        </div>
        <button onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-black text-white px-6 py-3 text-xs tracking-widest uppercase hover:bg-gray-900 transition-colors">
          <Plus size={15} /> New Coupon
        </button>
      </div>

      {/* Create Form */}
      {showForm && (
        <div className="bg-white border border-gray-100 p-6 mb-6">
          <h2 className="text-sm font-display tracking-widest mb-6">CREATE COUPON</h2>
          <form onSubmit={handleCreate}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-[10px] tracking-widest uppercase mb-2 text-gray-500">Code *</label>
                <input
                  value={form.code}
                  onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                  placeholder="e.g. SUMMER20"
                  className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors font-mono uppercase"
                />
              </div>
              <div>
                <label className="block text-[10px] tracking-widest uppercase mb-2 text-gray-500">Type *</label>
                <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as "PERCENTAGE" | "FIXED" })}
                  className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors">
                  <option value="PERCENTAGE">Percentage (%)</option>
                  <option value="FIXED">Fixed Amount (ج.م)</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] tracking-widest uppercase mb-2 text-gray-500">
                  Value * {form.type === "PERCENTAGE" ? "(1-100%)" : "(ج.م)"}
                </label>
                <input
                  type="number"
                  value={form.value}
                  onChange={(e) => setForm({ ...form, value: e.target.value })}
                  min="1" max={form.type === "PERCENTAGE" ? "100" : undefined}
                  className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors"
                />
              </div>
              <div>
                <label className="block text-[10px] tracking-widest uppercase mb-2 text-gray-500">Min Order Value (ج.م)</label>
                <input type="number" value={form.minOrderValue} onChange={(e) => setForm({ ...form, minOrderValue: e.target.value })}
                  placeholder="0"
                  className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors" />
              </div>
              <div>
                <label className="block text-[10px] tracking-widest uppercase mb-2 text-gray-500">Max Uses (optional)</label>
                <input type="number" value={form.maxUses} onChange={(e) => setForm({ ...form, maxUses: e.target.value })}
                  placeholder="Unlimited"
                  className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors" />
              </div>
              <div>
                <label className="block text-[10px] tracking-widest uppercase mb-2 text-gray-500">Expires At (optional)</label>
                <input type="date" value={form.expiresAt} onChange={(e) => setForm({ ...form, expiresAt: e.target.value })}
                  className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors" />
              </div>
            </div>
            <div className="flex gap-3">
              <button type="submit" disabled={saving}
                className="bg-black text-white px-8 py-3 text-xs tracking-widest uppercase hover:bg-gray-900 transition-colors disabled:opacity-50">
                {saving ? "Creating..." : "Create Coupon"}
              </button>
              <button type="button" onClick={() => { setShowForm(false); setForm(emptyForm); }}
                className="border border-gray-200 px-6 py-3 text-xs tracking-widest uppercase hover:bg-gray-50 transition-colors">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Coupons Table */}
      <div className="bg-white border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-8 space-y-3">
            {[...Array(4)].map((_, i) => <div key={i} className="h-14 bg-gray-50 animate-pulse rounded" />)}
          </div>
        ) : coupons.length === 0 ? (
          <div className="text-center py-20">
            <Tag size={36} className="text-gray-200 mx-auto mb-4" />
            <p className="text-gray-400 text-xs tracking-widest uppercase">No coupons yet</p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-[10px] tracking-widest uppercase text-gray-400">Code</th>
                <th className="px-6 py-4 text-left text-[10px] tracking-widest uppercase text-gray-400">Discount</th>
                <th className="px-6 py-4 text-left text-[10px] tracking-widest uppercase text-gray-400 hidden md:table-cell">Usage</th>
                <th className="px-6 py-4 text-left text-[10px] tracking-widest uppercase text-gray-400 hidden md:table-cell">Min Order</th>
                <th className="px-6 py-4 text-left text-[10px] tracking-widest uppercase text-gray-400 hidden md:table-cell">Expires</th>
                <th className="px-6 py-4 text-left text-[10px] tracking-widest uppercase text-gray-400">Status</th>
                <th className="px-6 py-4 text-right text-[10px] tracking-widest uppercase text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {coupons.map((coupon) => (
                <tr key={coupon.id} className={`hover:bg-gray-50 transition-colors ${isExpired(coupon.expiresAt) ? "opacity-50" : ""}`}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <code className="text-sm font-mono font-semibold tracking-widest">{coupon.code}</code>
                      <button onClick={() => handleCopy(coupon.code)} className="text-gray-300 hover:text-black transition-colors">
                        {copied === coupon.code ? <Check size={12} className="text-green-500" /> : <Copy size={12} />}
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium">
                      {coupon.type === "PERCENTAGE" ? `${coupon.value}%` : `${coupon.value} ج.م`}
                    </span>
                  </td>
                  <td className="px-6 py-4 hidden md:table-cell">
                    <span className="text-xs text-gray-500">
                      {coupon.usedCount} / {coupon.maxUses ?? "∞"}
                    </span>
                    {coupon.maxUses && (
                      <div className="w-16 h-1 bg-gray-100 rounded-full mt-1 overflow-hidden">
                        <div className="h-full bg-black rounded-full" style={{ width: `${Math.min((coupon.usedCount / coupon.maxUses) * 100, 100)}%` }} />
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 hidden md:table-cell text-xs text-gray-400">
                    {coupon.minOrderValue > 0 ? `${coupon.minOrderValue} ج.م` : "—"}
                  </td>
                  <td className="px-6 py-4 hidden md:table-cell text-xs text-gray-400">
                    {coupon.expiresAt
                      ? <span className={isExpired(coupon.expiresAt) ? "text-red-400" : ""}>{new Date(coupon.expiresAt).toLocaleDateString("en-GB")}</span>
                      : "Never"}
                  </td>
                  <td className="px-6 py-4">
                    {isExpired(coupon.expiresAt) ? (
                      <span className="text-[10px] px-2.5 py-1 bg-red-50 text-red-400 tracking-widest uppercase">Expired</span>
                    ) : (
                      <span className={`text-[10px] px-2.5 py-1 tracking-widest uppercase ${coupon.isActive ? "bg-green-50 text-green-600" : "bg-gray-100 text-gray-400"}`}>
                        {coupon.isActive ? "Active" : "Inactive"}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-3">
                      <button onClick={() => handleToggle(coupon.id)} className="text-gray-400 hover:text-black transition-colors" title={coupon.isActive ? "Deactivate" : "Activate"}>
                        {coupon.isActive ? <ToggleRight size={18} className="text-green-500" /> : <ToggleLeft size={18} />}
                      </button>
                      <button onClick={() => handleDelete(coupon.id, coupon.code)} className="text-gray-300 hover:text-red-400 transition-colors">
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
