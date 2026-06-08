"use client";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Plus, Trash2, Edit2, X, Upload, Image as ImageIcon, ChevronDown, ChevronUp } from "lucide-react";
import { getAdminProducts, createProduct, updateProduct, deleteProduct, getCategories, uploadImage } from "@/lib/api";
import { formatPrice } from "@/lib/utils";

interface SizeVariant  { size: string; stock: number; }
interface ColorVariant { id?: string; name: string; images: string[]; sizes: SizeVariant[]; }
interface Bundle       { quantity: number; price: number; }
interface SizeGuideRow { size: string; chest: string; waist: string; length: string; hip: string; }
interface Product {
  id: string; name: string; slug: string; price: number; oldPrice?: number;
  images: string[]; stock: number; isActive: boolean; isFeatured: boolean;
  categoryId?: string; category?: { name: string };
  metaTitle?: string; metaDescription?: string; metaKeywords?: string;
  colorVariants: ColorVariant[]; bundles?: Bundle[]; sizeGuide?: SizeGuideRow[];
}

const emptyVariant     = (): ColorVariant  => ({ name: "", images: [], sizes: [{ size: "", stock: 0 }] });
const emptySizeGuideRow = (): SizeGuideRow => ({ size: "", chest: "", waist: "", length: "", hip: "" });

const emptyForm = {
  name: "", slug: "", description: "", price: "", oldPrice: "", stock: "0",
  isActive: true, isFeatured: false, categoryId: "",
  metaTitle: "", metaDescription: "", metaKeywords: "",
  colorVariants: [emptyVariant()] as ColorVariant[],
  bundles:   [] as Bundle[],
  sizeGuide: [] as SizeGuideRow[],
};

function ColorVariantEditor({ variant, index, onChange, onRemove, onUpload }: {
  variant: ColorVariant; index: number;
  onChange: (v: ColorVariant) => void;
  onRemove: () => void;
  onUpload: (colorIdx: number, files: FileList) => void;
}) {
  const [open, setOpen] = useState(true);
  const updateSize = (sIdx: number, field: keyof SizeVariant, value: string | number) => {
    const sizes = [...variant.sizes];
    sizes[sIdx] = { ...sizes[sIdx], [field]: field === "stock" ? parseInt(value as string) || 0 : value };
    onChange({ ...variant, sizes });
  };
  const addSize    = () => onChange({ ...variant, sizes: [...variant.sizes, { size: "", stock: 0 }] });
  const removeSize = (sIdx: number) => onChange({ ...variant, sizes: variant.sizes.filter((_, i) => i !== sIdx) });
  const removeImg  = (imgIdx: number) => onChange({ ...variant, images: variant.images.filter((_, i) => i !== imgIdx) });

  return (
    <div className="border border-gray-200 rounded-sm overflow-hidden">
      <div className="flex items-center justify-between bg-gray-50 px-4 py-3">
        <div className="flex items-center gap-3 flex-1">
          <button type="button" onClick={() => setOpen(!open)} className="text-gray-400">
            {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
          <input value={variant.name} onChange={e => onChange({ ...variant, name: e.target.value })}
            placeholder="اسم اللون (مثلاً: أسود، Navy Blue...)"
            className="flex-1 bg-transparent text-sm focus:outline-none font-medium" />
        </div>
        <button type="button" onClick={onRemove} className="text-gray-300 hover:text-red-400 transition-colors mr-2"><X size={14} /></button>
      </div>
      {open && (
        <div className="p-4 space-y-4">
          <div>
            <p className="text-[10px] tracking-widest uppercase text-gray-400 mb-2">صور اللون</p>
            <div className="flex flex-wrap gap-2 mb-2">
              {variant.images.map((img, imgIdx) => (
                <div key={imgIdx} className="relative w-16 h-16 group">
                  <img src={img} alt="" className="w-full h-full object-cover border border-gray-100" />
                  <button type="button" onClick={() => removeImg(imgIdx)}
                    className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <X size={8} />
                  </button>
                </div>
              ))}
              <label className="w-16 h-16 border-2 border-dashed border-gray-200 flex flex-col items-center justify-center cursor-pointer hover:border-black transition-colors">
                <Upload size={14} className="text-gray-300 mb-1" />
                <span className="text-[9px] text-gray-300">Upload</span>
                <input type="file" multiple accept="image/*" className="hidden"
                  onChange={e => e.target.files && onUpload(index, e.target.files)} />
              </label>
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-[10px] tracking-widest uppercase text-gray-400">المقاسات والمخزون</p>
              <button type="button" onClick={addSize}
                className="text-[10px] tracking-widest uppercase flex items-center gap-1 text-gray-400 hover:text-black transition-colors">
                <Plus size={10} /> إضافة مقاس
              </button>
            </div>
            <div className="space-y-2">
              {variant.sizes.map((s, sIdx) => (
                <div key={sIdx} className="flex items-center gap-2">
                  <input value={s.size} onChange={e => updateSize(sIdx, "size", e.target.value)}
                    placeholder="المقاس (S, M, L, XL...)"
                    className="flex-1 border border-gray-200 px-3 py-2 text-xs focus:outline-none focus:border-black transition-colors" />
                  <input type="number" value={s.stock} onChange={e => updateSize(sIdx, "stock", e.target.value)}
                    placeholder="المخزون" min="0"
                    className="w-24 border border-gray-200 px-3 py-2 text-xs focus:outline-none focus:border-black transition-colors" />
                  <button type="button" onClick={() => removeSize(sIdx)} className="text-gray-300 hover:text-red-400 transition-colors"><X size={14} /></button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ProductForm({ product, categories, onSave, onClose }: {
  product?: Product; categories: any[];
  onSave: (data: any) => Promise<void>; onClose: () => void;
}) {
  const [form, setForm] = useState(product ? {
    name: product.name, slug: product.slug || "",
    description: (product as any).description || "",
    price: String(product.price), oldPrice: product.oldPrice ? String(product.oldPrice) : "",
    stock: String(product.stock), isActive: product.isActive, isFeatured: product.isFeatured,
    categoryId: product.categoryId || "",
    metaTitle: product.metaTitle || "", metaDescription: product.metaDescription || "",
    metaKeywords: product.metaKeywords || "",
    colorVariants: product.colorVariants?.length ? product.colorVariants : [emptyVariant()],
    bundles:   (product as any).bundles   || [] as Bundle[],
    sizeGuide: (product as any).sizeGuide || [] as SizeGuideRow[],
  } : { ...emptyForm });

  const [saving, setSaving] = useState(false);
  const [tab, setTab]       = useState<"basic"|"variants"|"bundles"|"sizeGuide"|"seo">("basic");
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(!!product);

  useEffect(() => {
    if (!slugManuallyEdited && form.name) {
      const autoSlug = form.name.toLowerCase().trim()
        .replace(/\s+/g, "-").replace(/[^\w-]/g, "").replace(/--+/g, "-");
      setForm(prev => ({ ...prev, slug: autoSlug }));
    }
  }, [form.name]);

  const handleUpload = async (colorIdx: number, files: FileList) => {
    const uploaded: string[] = [];
    for (const file of Array.from(files)) {
      try { const res = await uploadImage(file); uploaded.push(res.data.url); }
      catch { toast.error("فشل رفع صورة"); }
    }
    if (uploaded.length) {
      const variants = [...form.colorVariants];
      variants[colorIdx] = { ...variants[colorIdx], images: [...variants[colorIdx].images, ...uploaded] };
      setForm({ ...form, colorVariants: variants });
    }
  };

  const updateVariant = (idx: number, v: ColorVariant) => {
    const variants = [...form.colorVariants]; variants[idx] = v; setForm({ ...form, colorVariants: variants });
  };
  const addVariant    = () => setForm({ ...form, colorVariants: [...form.colorVariants, emptyVariant()] });
  const removeVariant = (idx: number) => setForm({ ...form, colorVariants: form.colorVariants.filter((_, i) => i !== idx) });

  const addBundle    = () => setForm({ ...form, bundles: [...form.bundles, { quantity: 2, price: 0 }] });
  const removeBundle = (idx: number) => setForm({ ...form, bundles: form.bundles.filter((_: Bundle, i: number) => i !== idx) });
  const updateBundle = (idx: number, field: keyof Bundle, value: number) => {
    const bundles = [...form.bundles]; bundles[idx] = { ...bundles[idx], [field]: value }; setForm({ ...form, bundles });
  };

  const addSizeGuideRow    = () => setForm({ ...form, sizeGuide: [...(form.sizeGuide||[]), emptySizeGuideRow()] });
  const removeSizeGuideRow = (idx: number) => setForm({ ...form, sizeGuide: (form.sizeGuide||[]).filter((_: SizeGuideRow, i: number) => i !== idx) });
  const updateSizeGuideRow = (idx: number, field: keyof SizeGuideRow, value: string) => {
    const rows = [...(form.sizeGuide||[])]; rows[idx] = { ...rows[idx], [field]: value }; setForm({ ...form, sizeGuide: rows });
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!form.name || !form.price) { toast.error("الاسم والسعر مطلوبان"); return; }
    setSaving(true);
    try {
      await onSave({
        ...form,
        slug:      form.slug || form.name.toLowerCase().replace(/\s+/g,"-").replace(/[^\w-]/g,""),
        price:     parseFloat(form.price),
        oldPrice:  form.oldPrice ? parseFloat(form.oldPrice) : null,
        stock:     parseInt(form.stock) || 0,
        colorVariants: form.colorVariants.filter(cv => cv.name.trim()),
        bundles:   form.bundles?.length > 0 ? form.bundles : null,
        sizeGuide: (form.sizeGuide||[]).filter((r: SizeGuideRow) => r.size.trim()).length > 0
                   ? (form.sizeGuide||[]).filter((r: SizeGuideRow) => r.size.trim()) : null,
      });
    } finally { setSaving(false); }
  };

  const tabs = [
    { id: "basic",     label: "البيانات الأساسية" },
    { id: "variants",  label: `الألوان (${form.colorVariants.length})` },
    { id: "bundles",   label: `Bundles (${form.bundles?.length||0})` },
    { id: "sizeGuide", label: `دليل المقاسات (${(form.sizeGuide||[]).length})` },
    { id: "seo",       label: "SEO" },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl" onClick={e => e.stopPropagation()} dir="rtl">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h2 className="text-lg font-display tracking-widest">{product ? "تعديل المنتج" : "منتج جديد"}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-black"><X size={18} /></button>
        </div>
        <div className="flex border-b border-gray-100 overflow-x-auto">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id as any)}
              className={`px-4 py-3 text-xs tracking-widest uppercase transition-colors whitespace-nowrap ${tab===t.id?"border-b-2 border-black font-medium":"text-gray-400 hover:text-black"}`}>
              {t.label}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5">

          {tab === "basic" && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-[10px] tracking-widest uppercase mb-2 text-gray-400">اسم المنتج *</label>
                  <input value={form.name} onChange={e => setForm({...form, name: e.target.value})}
                    className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors" />
                </div>
                <div className="col-span-2">
                  <label className="block text-[10px] tracking-widest uppercase mb-2 text-gray-400">Slug *</label>
                  <input value={form.slug}
                    onChange={e => { setSlugManuallyEdited(true); setForm({...form, slug: e.target.value.toLowerCase().replace(/\s+/g,"-").replace(/[^\w-]/g,"")}); }}
                    className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors font-mono" />
                  {form.slug && <p className="text-[10px] text-gray-400 mt-1">seenways.com/product/<span className="text-black font-mono">{form.slug}</span></p>}
                </div>
                <div>
                  <label className="block text-[10px] tracking-widest uppercase mb-2 text-gray-400">السعر (ج.م) *</label>
                  <input type="number" value={form.price} onChange={e => setForm({...form, price: e.target.value})}
                    className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors" />
                </div>
                <div>
                  <label className="block text-[10px] tracking-widest uppercase mb-2 text-gray-400">السعر القديم</label>
                  <input type="number" value={form.oldPrice} onChange={e => setForm({...form, oldPrice: e.target.value})}
                    className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors" />
                </div>
                <div>
                  <label className="block text-[10px] tracking-widest uppercase mb-2 text-gray-400">التصنيف</label>
                  <select value={form.categoryId} onChange={e => setForm({...form, categoryId: e.target.value})}
                    className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors">
                    <option value="">بدون تصنيف</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] tracking-widest uppercase mb-2 text-gray-400">المخزون</label>
                  <input type="number" value={form.stock} onChange={e => setForm({...form, stock: e.target.value})}
                    className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors" />
                </div>
                <div className="col-span-2">
                  <label className="block text-[10px] tracking-widest uppercase mb-2 text-gray-400">الوصف</label>
                  <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})}
                    rows={4} className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors resize-none" />
                </div>
              </div>
              <div className="flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.isActive} onChange={e => setForm({...form, isActive: e.target.checked})} className="w-4 h-4" />
                  <span className="text-xs tracking-widest uppercase">نشط</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.isFeatured} onChange={e => setForm({...form, isFeatured: e.target.checked})} className="w-4 h-4" />
                  <span className="text-xs tracking-widest uppercase">مميز</span>
                </label>
              </div>
            </div>
          )}

          {tab === "variants" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-xs text-gray-400">كل لون له صوره الخاصة ومقاساته ومخزونه</p>
                <button type="button" onClick={addVariant}
                  className="flex items-center gap-2 bg-black text-white px-4 py-2.5 text-xs tracking-widest uppercase hover:bg-gray-900 transition-colors">
                  <Plus size={12} /> إضافة لون
                </button>
              </div>
              {form.colorVariants.map((variant, idx) => (
                <ColorVariantEditor key={idx} variant={variant} index={idx}
                  onChange={v => updateVariant(idx, v)}
                  onRemove={() => removeVariant(idx)}
                  onUpload={handleUpload} />
              ))}
            </div>
          )}

          {tab === "bundles" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-xs text-gray-400">أضف عروض الشراء بالجملة</p>
                <button type="button" onClick={addBundle}
                  className="flex items-center gap-2 bg-black text-white px-4 py-2.5 text-xs tracking-widest uppercase hover:bg-gray-900 transition-colors">
                  <Plus size={12} /> إضافة Bundle
                </button>
              </div>
              {(!form.bundles || form.bundles.length === 0) && (
                <div className="text-center py-12 border border-dashed border-gray-200">
                  <p className="text-gray-400 text-xs tracking-widest uppercase">لا توجد bundle deals</p>
                </div>
              )}
              {form.bundles?.map((bundle: Bundle, idx: number) => (
                <div key={idx} className="p-4 border border-gray-100">
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[10px] tracking-widest uppercase mb-2 text-gray-400">عدد القطع</label>
                      <input type="number" min="2" value={bundle.quantity}
                        onChange={e => updateBundle(idx, "quantity", parseInt(e.target.value)||2)}
                        className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors" />
                    </div>
                    <div>
                      <label className="block text-[10px] tracking-widest uppercase mb-2 text-gray-400">السعر الإجمالي (ج.م)</label>
                      <input type="number" min="0" value={bundle.price}
                        onChange={e => updateBundle(idx, "price", parseFloat(e.target.value)||0)}
                        className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors" />
                    </div>
                    <div className="flex flex-col justify-end pb-3">
                      <p className="text-xs text-green-600 mb-1">وفّر {formatPrice((bundle.quantity * parseFloat(form.price||"0")) - bundle.price)}</p>
                      <p className="text-[10px] text-gray-400">بدل {formatPrice(bundle.quantity * parseFloat(form.price||"0"))}</p>
                    </div>
                  </div>
                  <div className="flex justify-end mt-2">
                    <button type="button" onClick={() => removeBundle(idx)}
                      className="text-gray-300 hover:text-red-400 transition-colors text-xs tracking-widest uppercase">حذف</button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === "sizeGuide" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-xs text-gray-400">أضف قياسات كل مقاس بالسنتيمتر</p>
                <button type="button" onClick={addSizeGuideRow}
                  className="flex items-center gap-2 bg-black text-white px-4 py-2.5 text-xs tracking-widest uppercase hover:bg-gray-900 transition-colors">
                  <Plus size={12} /> إضافة صف
                </button>
              </div>
              {(!form.sizeGuide || form.sizeGuide.length === 0) ? (
                <div className="text-center py-16 border border-dashed border-gray-200">
                  <p className="text-gray-400 text-xs tracking-widest uppercase">لا يوجد دليل مقاسات</p>
                  <p className="text-gray-300 text-[10px] mt-2">اضغط "إضافة صف" لإضافة قياسات</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <div className="min-w-[480px]">
                    <div className="grid grid-cols-6 gap-2 mb-2">
                      {["المقاس","الصدر","الخصر","الطول","الورك",""].map((h,i) => (
                        <p key={i} className="text-[10px] tracking-widest uppercase text-gray-400 text-center">{h}</p>
                      ))}
                    </div>
                    <div className="space-y-2">
                      {(form.sizeGuide||[]).map((row: SizeGuideRow, idx: number) => (
                        <div key={idx} className="grid grid-cols-6 gap-2 items-center">
                          {(["size","chest","waist","length","hip"] as const).map(field => (
                            <input key={field} value={row[field]}
                              onChange={e => updateSizeGuideRow(idx, field, e.target.value)}
                              placeholder={field==="size"?"S":"—"}
                              className="border border-gray-200 px-2 py-2 text-xs focus:outline-none focus:border-black transition-colors text-center" />
                          ))}
                          <button type="button" onClick={() => removeSizeGuideRow(idx)}
                            className="text-gray-300 hover:text-red-400 transition-colors flex justify-center">
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              {form.sizeGuide && form.sizeGuide.length > 0 && (
                <div className="border border-gray-100 p-4 bg-gray-50 mt-2">
                  <p className="text-[10px] tracking-widest uppercase text-gray-400 mb-3">معاينة</p>
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-right py-2 text-gray-500 font-medium">المقاس</th>
                        {form.sizeGuide[0]?.chest  && <th className="text-center py-2 text-gray-500 font-medium">الصدر</th>}
                        {form.sizeGuide[0]?.waist  && <th className="text-center py-2 text-gray-500 font-medium">الخصر</th>}
                        {form.sizeGuide[0]?.length && <th className="text-center py-2 text-gray-500 font-medium">الطول</th>}
                        {form.sizeGuide[0]?.hip    && <th className="text-center py-2 text-gray-500 font-medium">الورك</th>}
                      </tr>
                    </thead>
                    <tbody>
                      {form.sizeGuide.map((row: SizeGuideRow, idx: number) => (
                        <tr key={idx} className="border-b border-gray-100">
                          <td className="py-2 font-display tracking-widest">{row.size||"—"}</td>
                          {form.sizeGuide[0]?.chest  && <td className="py-2 text-center text-gray-600">{row.chest ||"—"}</td>}
                          {form.sizeGuide[0]?.waist  && <td className="py-2 text-center text-gray-600">{row.waist ||"—"}</td>}
                          {form.sizeGuide[0]?.length && <td className="py-2 text-center text-gray-600">{row.length||"—"}</td>}
                          {form.sizeGuide[0]?.hip    && <td className="py-2 text-center text-gray-600">{row.hip   ||"—"}</td>}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {tab === "seo" && (
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] tracking-widest uppercase mb-2 text-gray-400">Meta Title</label>
                <input value={form.metaTitle} onChange={e => setForm({...form, metaTitle: e.target.value})}
                  placeholder="عنوان الصفحة في Google (60 حرف)"
                  className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors" />
                <p className="text-[10px] text-gray-400 mt-1">{form.metaTitle.length}/60</p>
              </div>
              <div>
                <label className="block text-[10px] tracking-widest uppercase mb-2 text-gray-400">Meta Description</label>
                <textarea value={form.metaDescription} onChange={e => setForm({...form, metaDescription: e.target.value})}
                  placeholder="وصف الصفحة في Google (160 حرف)" rows={3}
                  className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors resize-none" />
                <p className="text-[10px] text-gray-400 mt-1">{form.metaDescription.length}/160</p>
              </div>
              <div>
                <label className="block text-[10px] tracking-widest uppercase mb-2 text-gray-400">Meta Keywords</label>
                <input value={form.metaKeywords} onChange={e => setForm({...form, metaKeywords: e.target.value})}
                  placeholder="كلمة1, كلمة2, كلمة3"
                  className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors" />
              </div>
            </div>
          )}
        </form>

        <div className="p-5 border-t border-gray-100 flex gap-3">
          <button onClick={() => handleSubmit()} disabled={saving}
            className="flex-1 bg-black text-white py-3 text-xs tracking-widest uppercase hover:bg-gray-900 transition-colors disabled:opacity-50">
            {saving ? "جاري الحفظ..." : product ? "حفظ التعديلات" : "إضافة المنتج"}
          </button>
          <button onClick={onClose} className="border border-gray-200 px-6 py-3 text-xs tracking-widest uppercase hover:bg-gray-50 transition-colors">
            إلغاء
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminProductsPage() {
  const [products, setProducts]   = useState<Product[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading]     = useState(true);
  const [showForm, setShowForm]   = useState(false);
  const [editing, setEditing]     = useState<Product | undefined>();
  const [search, setSearch]       = useState("");

  const load = () => {
    setLoading(true);
    Promise.all([getAdminProducts({ search }), getCategories()])
      .then(([p, c]) => { setProducts(p.data); setCategories(c.data); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleSave = async (data: any) => {
    try {
      if (editing) { await updateProduct(editing.id, data); toast.success("تم التحديث"); }
      else { await createProduct(data); toast.success("تمت الإضافة"); }
      setShowForm(false); setEditing(undefined); load();
    } catch (err: any) { toast.error(err.response?.data?.error || "حدث خطأ"); throw err; }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`حذف "${name}"?`)) return;
    try { await deleteProduct(id); load(); toast.success("تم الحذف"); }
    catch { toast.error("فشل الحذف"); }
  };

  return (
    <div dir="rtl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-display tracking-widest">PRODUCTS</h1>
          <p className="text-gray-400 text-xs tracking-wider mt-1">{products.length} منتج</p>
        </div>
        <button onClick={() => { setEditing(undefined); setShowForm(true); }}
          className="flex items-center gap-2 bg-black text-white px-6 py-3 text-xs tracking-widest uppercase hover:bg-gray-900 transition-colors">
          <Plus size={14} /> منتج جديد
        </button>
      </div>
      <div className="flex gap-3 mb-5">
        <input value={search} onChange={e => setSearch(e.target.value)}
          onKeyDown={e => e.key === "Enter" && load()} placeholder="بحث عن منتج..."
          className="flex-1 border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:border-black transition-colors" />
        <button onClick={load} className="border border-gray-200 px-5 py-2.5 text-xs tracking-widest uppercase hover:border-black transition-colors">بحث</button>
      </div>
      <div className="bg-white border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-3">{[...Array(4)].map((_,i) => <div key={i} className="h-16 bg-gray-50 animate-pulse rounded" />)}</div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-5 py-3.5 text-right text-[10px] tracking-widest uppercase text-gray-400">المنتج</th>
                <th className="px-5 py-3.5 text-right text-[10px] tracking-widest uppercase text-gray-400 hidden md:table-cell">الألوان</th>
                <th className="px-5 py-3.5 text-right text-[10px] tracking-widest uppercase text-gray-400">السعر</th>
                <th className="px-5 py-3.5 text-right text-[10px] tracking-widest uppercase text-gray-400 hidden md:table-cell">الحالة</th>
                <th className="px-5 py-3.5 text-left text-[10px] tracking-widest uppercase text-gray-400">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {products.map(p => (
                <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-50 overflow-hidden flex-shrink-0">
                        {(p as any).colorVariants?.[0]?.images?.[0] || p.images?.[0] ? (
                          <img src={(p as any).colorVariants?.[0]?.images?.[0] || p.images?.[0]} alt={p.name} className="w-full h-full object-cover" />
                        ) : <ImageIcon size={16} className="text-gray-200 m-auto mt-2.5" />}
                      </div>
                      <div>
                        <p className="text-xs font-medium">{p.name}</p>
                        <p className="text-[10px] text-gray-400">{p.category?.name}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 hidden md:table-cell">
                    <div className="flex gap-1 flex-wrap">
                      {p.colorVariants?.map(cv => (
                        <span key={cv.id||cv.name} className="text-[10px] bg-gray-100 px-2 py-0.5 rounded">{cv.name}</span>
                      ))}
                      {(!p.colorVariants?.length) && <span className="text-[10px] text-gray-300">لا يوجد</span>}
                    </div>
                  </td>
                  <td className="px-5 py-4 text-xs font-medium">{formatPrice(p.price)}</td>
                  <td className="px-5 py-4 hidden md:table-cell">
                    <span className={`text-[10px] px-2.5 py-1 tracking-widest uppercase ${p.isActive?"bg-green-50 text-green-600":"bg-gray-100 text-gray-400"}`}>
                      {p.isActive?"نشط":"مخفي"}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3 justify-end">
                      <button onClick={() => { setEditing(p); setShowForm(true); }} className="text-gray-400 hover:text-black transition-colors"><Edit2 size={15} /></button>
                      <button onClick={() => handleDelete(p.id, p.name)} className="text-gray-300 hover:text-red-400 transition-colors"><Trash2 size={15} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr><td colSpan={5} className="text-center py-16 text-gray-400 text-xs tracking-widest uppercase">لا توجد منتجات</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>
      {showForm && (
        <ProductForm product={editing} categories={categories}
          onSave={handleSave} onClose={() => { setShowForm(false); setEditing(undefined); }} />
      )}
    </div>
  );
}
