"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Package, Truck, Check, Clock, X, ArrowRight } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { trackOrder } from "@/lib/api";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";

const statusSteps = [
  { key: "PENDING", label: "Order Placed", icon: Clock },
  { key: "CONFIRMED", label: "Confirmed", icon: Check },
  { key: "PROCESSING", label: "Processing", icon: Package },
  { key: "SHIPPED", label: "Shipped", icon: Truck },
  { key: "DELIVERED", label: "Delivered", icon: Check },
];

const statusOrder = ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED"];

export default function TrackOrderPage() {
  const [orderNumber, setOrderNumber] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<any>(null);
  const [error, setError] = useState("");

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderNumber.trim() || !phone.trim()) return;
    setLoading(true);
    setError("");
    setOrder(null);
    try {
      const res = await trackOrder(orderNumber.trim().toUpperCase(), phone.trim());
      setOrder(res.data);
    } catch (err: any) {
      setError(err.response?.data?.error || "Order not found. Please check your details.");
    } finally { setLoading(false); }
  };

  const currentStep = order ? statusOrder.indexOf(order.status) : -1;

  return (
    <>
      <Navbar />
      <main className="pt-20 min-h-screen" dir="ltr">
        <div className="container py-12 md:py-20 max-w-2xl">

          {/* Header */}
          <div className="mb-12">
            <p className="text-xs tracking-[0.4em] uppercase text-gray-400 mb-3">SEENWAYS</p>
            <h1 className="text-5xl md:text-6xl font-display mb-4">TRACK ORDER</h1>
            <p className="text-gray-400 text-sm tracking-wider">Enter your order number and phone number to track your order.</p>
          </div>

          {/* Search Form */}
          <form onSubmit={handleTrack} className="space-y-4 mb-10">
            <div>
              <label className="block text-[10px] tracking-widests uppercase mb-2 text-gray-400">Order Number</label>
              <input
                value={orderNumber}
                onChange={e => setOrderNumber(e.target.value.toUpperCase())}
                placeholder="SW-XXXXXX-XXX"
                className="w-full border border-gray-200 px-4 py-4 text-sm font-mono tracking-widest focus:outline-none focus:border-black transition-colors uppercase"
              />
            </div>
            <div>
              <label className="block text-[10px] tracking-widests uppercase mb-2 text-gray-400">Phone Number</label>
              <input
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="01XXXXXXXXX"
                className="w-full border border-gray-200 px-4 py-4 text-sm focus:outline-none focus:border-black transition-colors"
              />
            </div>
            <button type="submit" disabled={loading || !orderNumber.trim() || !phone.trim()}
              className="w-full bg-black text-white py-4 flex items-center justify-center gap-3 text-xs tracking-widest uppercase hover:bg-gray-900 transition-colors disabled:opacity-40">
              {loading ? "SEARCHING..." : <><Search size={14} /> TRACK ORDER</>}
            </button>
          </form>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-3 p-4 border border-red-100 bg-red-50 mb-8">
              <X size={16} className="text-red-400 flex-shrink-0" />
              <p className="text-sm text-red-500">{error}</p>
            </div>
          )}

          {/* Order Result */}
          {order && (
            <div className="space-y-8">
              {/* Order Header */}
              <div className="border border-gray-100 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-[10px] tracking-widest uppercase text-gray-400 mb-1">Order Number</p>
                    <p className="text-xl font-display tracking-widest">{order.orderNumber}</p>
                  </div>
                  <span className={`text-[10px] px-3 py-1.5 tracking-widest uppercase ${
                    order.status === "DELIVERED" ? "bg-green-50 text-green-600" :
                    order.status === "CANCELLED" ? "bg-red-50 text-red-400" :
                    order.status === "SHIPPED" ? "bg-blue-50 text-blue-600" :
                    "bg-gray-100 text-gray-600"
                  }`}>
                    {order.status}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <p className="text-gray-400 tracking-widest uppercase mb-1">Customer</p>
                    <p className="font-medium">{order.customer.name}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 tracking-widest uppercase mb-1">City</p>
                    <p className="font-medium">{order.customer.city}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 tracking-widest uppercase mb-1">Order Date</p>
                    <p className="font-medium">{new Date(order.createdAt).toLocaleDateString("en-GB")}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 tracking-widest uppercase mb-1">Total</p>
                    <p className="font-medium">{formatPrice(order.totalAmount)}</p>
                  </div>
                </div>
              </div>

              {/* Status Timeline */}
              {order.status !== "CANCELLED" && (
                <div>
                  <p className="text-[10px] tracking-widest uppercase text-gray-400 mb-6">ORDER STATUS</p>
                  <div className="relative">
                    {/* Progress Line */}
                    <div className="absolute top-5 left-5 right-5 h-px bg-gray-100" />
                    <div
                      className="absolute top-5 left-5 h-px bg-black transition-all duration-500"
                      style={{ width: currentStep >= 0 ? `${(currentStep / (statusSteps.length - 1)) * 100}%` : "0%" }}
                    />
                    <div className="relative flex justify-between">
                      {statusSteps.map((step, idx) => {
                        const Icon = step.icon;
                        const isCompleted = idx <= currentStep;
                        const isCurrent = idx === currentStep;
                        return (
                          <div key={step.key} className="flex flex-col items-center gap-2">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all z-10 ${
                              isCompleted ? "bg-black border-black text-white" :
                              "bg-white border-gray-200 text-gray-300"
                            } ${isCurrent ? "ring-4 ring-black/10" : ""}`}>
                              <Icon size={14} />
                            </div>
                            <p className={`text-[10px] tracking-widest uppercase text-center max-w-16 ${isCompleted ? "text-black" : "text-gray-300"}`}>
                              {step.label}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {order.status === "CANCELLED" && (
                <div className="flex items-center gap-3 p-4 border border-red-100 bg-red-50">
                  <X size={16} className="text-red-400 flex-shrink-0" />
                  <p className="text-sm text-red-500 tracking-wider">This order has been cancelled.</p>
                </div>
              )}

              {/* Items */}
              <div>
                <p className="text-[10px] tracking-widest uppercase text-gray-400 mb-4">ITEMS ({order.items.length})</p>
                <div className="space-y-3">
                  {order.items.map((item: any, idx: number) => (
                    <div key={idx} className="flex gap-4 p-4 border border-gray-100">
                      {item.image && (
                        <img src={item.image} alt={item.name} className="w-14 h-18 object-cover bg-gray-50 flex-shrink-0" />
                      )}
                      <div className="flex-1">
                        <p className="text-xs font-medium uppercase tracking-wider">{item.name}</p>
                        <div className="flex gap-3 mt-1">
                          {item.color && <span className="text-[10px] text-gray-400 tracking-wider">Color: {item.color}</span>}
                          {item.size && <span className="text-[10px] text-gray-400 tracking-wider">Size: {item.size}</span>}
                          <span className="text-[10px] text-gray-400 tracking-wider">Qty: {item.quantity}</span>
                        </div>
                      </div>
                      <p className="text-xs font-medium">{formatPrice(item.price)}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Link href="/shop" className="flex-1 flex items-center justify-center gap-2 bg-black text-white py-4 text-xs tracking-widest uppercase hover:bg-gray-900 transition-colors">
                  CONTINUE SHOPPING <ArrowRight size={14} />
                </Link>
                <Link href="/contact" className="flex-1 flex items-center justify-center gap-2 border border-gray-200 py-4 text-xs tracking-widest uppercase hover:border-black transition-colors">
                  CONTACT US
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
