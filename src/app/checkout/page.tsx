"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Check, ArrowRight, ShieldCheck, Tag, X } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useCartStore } from "@/lib/store";
import { createOrder, validateCoupon, getGovernorates } from "@/lib/api";
import { formatPrice, validatePhone, isRateLimited } from "@/lib/utils";
import { initiateCheckout, purchase as fbPurchase } from "@/lib/fbpixel";
import Image from "next/image";

interface FormData {
  name: string; phone: string; email?: string; city: string; address: string; notes?: string; _hp?: string;
}

interface CouponState {
  code: string; discount: number; type: string; value: number; applied: boolean;
}

interface Governorate {
  id: string; name: string; shippingFee: number;
}

export default function CheckoutPage() {
  const { items, total, clearCart } = useCartStore();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");
  const [couponInput, setCouponInput] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);
  const [coupon, setCoupon] = useState<CouponState | null>(null);
  const [governorates, setGovernorates] = useState<Governorate[]>([]);
  const [selectedGov, setSelectedGov] = useState<Governorate | null>(null);
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();

  const subtotal = total();
  const discountAmount = coupon?.discount || 0;
  const shippingFee = selectedGov?.shippingFee || 0;
  const finalTotal = subtotal - discountAmount + shippingFee;

  useEffect(() => {
    getGovernorates().then(r => setGovernorates(r.data)).catch(() => {});
  }, []);

  useEffect(() => {
    if (items.length > 0) {
      initiateCheckout({ total: finalTotal, numItems: items.length });
    }
  }, []);

  const handleApplyCoupon = async () => {
    if (!couponInput.trim()) return;
    setCouponLoading(true);
    try {
      const res = await validateCoupon(couponInput.trim(), subtotal);
      const { coupon: c, discount } = res.data;
      setCoupon({ code: c.code, discount, type: c.type, value: c.value, applied: true });
      toast.success(`Coupon applied! You save ${formatPrice(discount)}`);
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Invalid coupon");
    } finally { setCouponLoading(false); }
  };

  const removeCoupon = () => { setCoupon(null); setCouponInput(""); };

  const onSubmit = async (data: FormData) => {
    if (data._hp && data._hp !== "") { toast.error("Invalid submission"); return; }
    if (isRateLimited()) { toast.error("Too many requests. Please wait."); return; }
    if (!validatePhone(data.phone)) { toast.error("Please enter a valid Egyptian phone number"); return; }
    if (items.length === 0) { toast.error("Your bag is empty"); return; }
    setLoading(true);
    try {
      const res = await createOrder({
        customer: { name: data.name.trim(), phone: data.phone.trim(), email: data.email?.trim() || null, address: data.address.trim(), city: data.city.trim() },
        notes: data.notes?.trim() || null,
        couponCode: coupon?.code || null,
        items: items.map((i) => {
          if (i.isBundle) {
            return {
              productId: i.productId,
              quantity: 1,
              isBundle: true,
              bundlePrice: i.price,
              bundleQuantity: i.bundleQuantity,
              bundleItems: i.bundleItems || [],
            };
          }
          return { productId: i.productId, quantity: i.quantity, size: i.size || null, color: i.color || null };
        }),
      });
      setOrderNumber(res.data.orderNumber);
      fbPurchase({
        orderNumber: res.data.orderNumber,
        total: finalTotal,
        items: items.map(i => ({ id: i.productId, name: i.name, price: i.price, quantity: i.quantity })),
      });
      clearCart();
      setDone(true);
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Something went wrong. Please try again.");
    } finally { setLoading(false); }
  };

  if (done) return (
    <>
      <Navbar />
      <main className="pt-20 min-h-screen flex flex-col items-center justify-center gap-8 px-6" dir="ltr">
        <div className="w-20 h-20 rounded-full bg-black flex items-center justify-center">
          <Check size={36} className="text-white" />
        </div>
        <div className="text-center max-w-md">
          <h1 className="text-5xl font-display mb-4">ORDER PLACED!</h1>
          <p className="text-gray-400 text-sm mb-2">Order Number</p>
          <p className="text-2xl font-display tracking-widest mb-3">{orderNumber}</p>
          <p className="text-[10px] text-gray-400 tracking-widest uppercase mb-6">Save this number to track your order</p>
          <p className="text-gray-400 text-sm leading-relaxed">We'll contact you shortly to confirm. Thank you for shopping with SEENWAYS.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm">
          <Link href={`/track-order?order=${orderNumber}`}
            className="flex-1 flex items-center justify-center gap-2 bg-black text-white py-4 text-xs tracking-widest uppercase hover:bg-gray-900 transition-colors">
            TRACK ORDER <ArrowRight size={14} />
          </Link>
          <button onClick={() => router.push("/")}
            className="flex-1 border border-gray-200 py-4 text-xs tracking-widest uppercase hover:border-black transition-colors">
            BACK TO HOME
          </button>
        </div>
      </main>
      <Footer />
    </>
  );

  if (items.length === 0) { router.push("/shop"); return null; }

  return (
    <>
      <Navbar />
      <main className="pt-20">
        <div className="container py-12 md:py-20">
          <div className="mb-12">
            <p className="text-xs tracking-[0.4em] uppercase text-gray-400 mb-2">ALMOST THERE</p>
            <h1 className="text-5xl md:text-6xl font-display">CHECKOUT</h1>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <input {...register("_hp")} type="text" className="hidden" tabIndex={-1} autoComplete="off" />
              <h2 className="text-lg font-display tracking-widest">SHIPPING INFORMATION</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-[10px] tracking-widest uppercase mb-2 text-gray-500">Full Name *</label>
                  <input {...register("name", { required: "Name is required", minLength: { value: 3, message: "Name too short" } })}
                    className="w-full border border-gray-200 px-4 py-3.5 text-sm focus:outline-none focus:border-black transition-colors" />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                </div>
                <div>
                  <label className="block text-[10px] tracking-widest uppercase mb-2 text-gray-500">Phone *</label>
                  <input {...register("phone", { required: "Phone is required" })} placeholder="01XXXXXXXXX"
                    className="w-full border border-gray-200 px-4 py-3.5 text-sm focus:outline-none focus:border-black transition-colors" />
                  {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
                </div>
                <div>
                  <label className="block text-[10px] tracking-widest uppercase mb-2 text-gray-500">Email (Optional)</label>
                  <input {...register("email")} type="email" className="w-full border border-gray-200 px-4 py-3.5 text-sm focus:outline-none focus:border-black transition-colors" />
                </div>
                <div>
                  <label className="block text-[10px] tracking-widest uppercase mb-2 text-gray-500">المحافظة *</label>
                  <select {...register("city", { required: "اختر المحافظة" })}
                    onChange={(e) => {
                      const gov = governorates.find(g => g.name === e.target.value);
                      setSelectedGov(gov || null);
                    }}
                    className="w-full border border-gray-200 px-4 py-3.5 text-sm focus:outline-none focus:border-black transition-colors">
                    <option value="">اختر المحافظة</option>
                    {governorates.map(g => (
                      <option key={g.id} value={g.name}>
                        {g.name} {g.shippingFee === 0 ? "(شحن مجاني)" : `(${g.shippingFee} ج.م)`}
                      </option>
                    ))}
                  </select>
                  {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city.message}</p>}
                </div>
                <div className="md:col-span-2">
                  <label className="block text-[10px] tracking-widest uppercase mb-2 text-gray-500">Address *</label>
                  <textarea {...register("address", { required: "Address is required" })} rows={3} className="w-full border border-gray-200 px-4 py-3.5 text-sm focus:outline-none focus:border-black transition-colors resize-none" />
                  {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>}
                </div>
                <div className="md:col-span-2">
                  <label className="block text-[10px] tracking-widest uppercase mb-2 text-gray-500">Notes (Optional)</label>
                  <textarea {...register("notes")} rows={2} className="w-full border border-gray-200 px-4 py-3.5 text-sm focus:outline-none focus:border-black transition-colors resize-none" />
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-gray-50 border border-gray-100">
                <ShieldCheck size={15} className="text-gray-400 flex-shrink-0" />
                <p className="text-xs text-gray-400">Your information is secure and only used to process your order.</p>
              </div>
              <button type="submit" disabled={loading} className="w-full bg-black text-white py-4 flex items-center justify-center gap-3 text-xs tracking-widest uppercase hover:bg-gray-900 transition-colors disabled:opacity-50">
                {loading ? "PLACING ORDER..." : <><span>PLACE ORDER</span><ArrowRight size={14} /></>}
              </button>
            </form>

            {/* Summary */}
            <div>
              <h2 className="text-lg font-display tracking-widest mb-6">ORDER SUMMARY</h2>
              <div className="divide-y divide-gray-100 mb-6">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4 py-4">
                    <div className="relative w-14 h-18 bg-gray-50 flex-shrink-0 overflow-hidden">
                      <Image src={item.image || "https://placehold.co/56x72/f5f5f5/000?text=SW"} alt={item.name} fill className="object-cover" />
                      {item.isBundle ? (
                        <span className="absolute -top-1 -right-1 bg-black text-white text-[9px] w-4 h-4 flex items-center justify-center rounded-full">{item.bundleQuantity}</span>
                      ) : (
                        <span className="absolute -top-1 -right-1 bg-black text-white text-[9px] w-4 h-4 flex items-center justify-center rounded-full">{item.quantity}</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-medium uppercase">{item.name}</p>
                      {item.isBundle ? (
                        <p className="text-[10px] text-gray-400 mt-0.5">Bundle x{item.bundleQuantity}</p>
                      ) : (
                        <p className="text-[10px] text-gray-400 mt-0.5">{[item.size && `Size: ${item.size}`, item.color && `Color: ${item.color}`].filter(Boolean).join(" · ")}</p>
                      )}
                    </div>
                    <p className="text-xs font-medium">{formatPrice(item.price)}</p>
                  </div>
                ))}
              </div>

              {/* Coupon */}
              <div className="mb-6">
                <label className="block text-[10px] tracking-widest uppercase mb-2 text-gray-500">Coupon Code</label>
                {coupon?.applied ? (
                  <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200">
                    <div className="flex items-center gap-2">
                      <Tag size={14} className="text-green-600" />
                      <span className="text-xs font-mono font-semibold text-green-700">{coupon.code}</span>
                      <span className="text-xs text-green-600">-{formatPrice(coupon.discount)}</span>
                    </div>
                    <button onClick={removeCoupon} className="text-green-400 hover:text-green-600 transition-colors"><X size={14} /></button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input value={couponInput} onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                      placeholder="ENTER CODE" onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleApplyCoupon())}
                      className="flex-1 border border-gray-200 px-4 py-3 text-xs font-mono uppercase focus:outline-none focus:border-black transition-colors" />
                    <button onClick={handleApplyCoupon} disabled={couponLoading || !couponInput.trim()}
                      className="border border-black px-4 py-3 text-xs tracking-widest uppercase hover:bg-black hover:text-white transition-all disabled:opacity-40">
                      {couponLoading ? "..." : "APPLY"}
                    </button>
                  </div>
                )}
              </div>

              {/* Totals */}
              <div className="border-t border-gray-100 pt-4 space-y-2">
                <div className="flex justify-between text-xs text-gray-500"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
                {discountAmount > 0 && <div className="flex justify-between text-xs text-green-600"><span>Discount</span><span>-{formatPrice(discountAmount)}</span></div>}
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Shipping</span>
                  <span className={shippingFee === 0 ? "text-green-600" : ""}>
                    {shippingFee === 0 ? "FREE" : `${shippingFee} EGP`}
                  </span>
                </div>
                <div className="border-t border-gray-100 pt-3 flex justify-between">
                  <span className="text-sm font-medium tracking-widest uppercase">Total</span>
                  <span className="text-xl font-display tracking-widest">{formatPrice(finalTotal)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
