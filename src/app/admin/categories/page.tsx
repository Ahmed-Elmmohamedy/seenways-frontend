"use client";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Plus, Trash2, Tag } from "lucide-react";
import { getCategories, createCategory, deleteCategory } from "@/lib/api";
import { Category } from "@/types";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  const load = () => {
    setLoading(true);
    getCategories().then((r) => { setCategories(r.data); setLoading(false); }).catch(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) { toast.error("Enter a category name"); return; }
    setAdding(true);
    try {
      await createCategory({ name: name.trim() });
      setName("");
      load();
      toast.success("Category created");
    } catch { toast.error("Failed to create"); }
    finally { setAdding(false); }
  };

  const handleDelete = async (id: string, catName: string) => {
    if (!confirm(`Delete "${catName}"? Products in this category will be uncategorized.`)) return;
    try { await deleteCategory(id); load(); toast.success("Deleted"); }
    catch { toast.error("Cannot delete — category may have products"); }
  };

  return (
    <div dir="ltr" className="max-w-2xl">
      <div className="mb-8">
        <h1 className="text-3xl font-display tracking-widest">CATEGORIES</h1>
        <p className="text-gray-400 text-xs tracking-wider mt-1">Organize your products by category</p>
      </div>

      {/* Add Form */}
      <div className="bg-white border border-gray-100 p-6 mb-6">
        <h2 className="text-sm font-display tracking-widest mb-5">ADD NEW CATEGORY</h2>
        <form onSubmit={handleAdd} className="flex gap-3">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. T-Shirts, Pants, Hoodies..."
            className="flex-1 border border-gray-200 px-4 py-3.5 text-sm focus:outline-none focus:border-black transition-colors"
          />
          <button type="submit" disabled={adding}
            className="flex items-center gap-2 bg-black text-white px-6 py-3.5 text-xs tracking-widest uppercase hover:bg-gray-900 transition-colors disabled:opacity-50 flex-shrink-0">
            <Plus size={15} /> {adding ? "Adding..." : "Add"}
          </button>
        </form>
        <p className="text-[10px] text-gray-400 tracking-wider mt-3">
          The slug will be auto-generated from the name (e.g. "T-Shirts" → "t-shirts")
        </p>
      </div>

      {/* List */}
      <div className="bg-white border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-sm font-display tracking-widest">ALL CATEGORIES ({categories.length})</h2>
        </div>
        {loading ? (
          <div className="p-6 space-y-3">
            {[...Array(4)].map((_, i) => <div key={i} className="h-14 bg-gray-50 animate-pulse rounded" />)}
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-16">
            <Tag size={32} className="text-gray-200 mx-auto mb-4" />
            <p className="text-gray-400 text-xs tracking-widest uppercase">No categories yet</p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-[10px] tracking-widest uppercase text-gray-400">Name</th>
                <th className="px-6 py-4 text-left text-[10px] tracking-widest uppercase text-gray-400">Slug</th>
                <th className="px-6 py-4 text-left text-[10px] tracking-widest uppercase text-gray-400">Products</th>
                <th className="px-6 py-4 text-right text-[10px] tracking-widest uppercase text-gray-400">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {categories.map((cat: any) => (
                <tr key={cat.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium">{cat.name}</td>
                  <td className="px-6 py-4">
                    <code className="text-xs bg-gray-100 px-2 py-1 text-gray-500">{cat.slug}</code>
                  </td>
                  <td className="px-6 py-4 text-xs text-gray-400">{cat._count?.products || 0} products</td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => handleDelete(cat.id, cat.name)} className="text-gray-300 hover:text-red-400 transition-colors">
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
