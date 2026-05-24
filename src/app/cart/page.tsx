"use client";
import Link from "next/link";
import Image from "next/image";
import { Trash2, ShoppingBag, ArrowRight, ArrowLeft } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useCartStore } from "@/lib/store";
import { formatPrice } from "@/lib/utils";

export default function CartPage() {
  const { items, removeItem, updateQuantity, total, clearCart } = useCartStore();

  if (items.length === 0) {
    return (
      <>
        <Navbar />
        <main className="pt-20 min-h-screen flex flex-col items-center justify-center gap-8 px-6">
          <ShoppingBag size={56} className="text-gray-200" />
          <div className="text-center">
            <h1 className="text-5xl font-display mb-3">YOUR BAG IS EMPTY</h1>
            <p className="text-gray-400 text-sm tracking-wider">Looks like you haven't added anything yet</p>
          </div>
          <Link href="/shop" className="inline-flex items-center gap-3 bg-black text-white px-12 py-4 text-xs tracking-widest uppercase hover:bg-gray-900 transition-colors">
            SHOP NOW <ArrowRight size={14} />
          </Link>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="pt-20">
        <div className="container py-12 md:py-20">
          {/* Header */}
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-xs tracking-[0.4em] uppercase text-gray-400 mb-2">{items.length} ITEMS</p>
              <h1 className="text-5xl md:text-6xl font-display">YOUR BAG</h1>
            </div>
            <button onClick={clearCart} className="text-xs tracking-widest text-gray-400 hover:text-black transition-colors uppercase border-b border-transparent hover:border-black pb-0.5">
              CLEAR ALL
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            {/* Items */}
            <div className="lg:col-span-2 divide-y divide-gray-100">
              {items.map((item) => (
                <div key={item.id} className="flex gap-6 py-8">
                  <Link href={`/product/${item.slug}`} className="relative w-24 h-32 md:w-28 md:h-36 bg-gray-50 flex-shrink-0 overflow-hidden">
                    <Image src={item.image || "https://placehold.co/200x267/f5f5f5/000?text=SW"} alt={item.name} fill className="object-cover" />
                  </Link>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="text-sm font-medium tracking-wide uppercase">{item.name}</h3>
                          <div className="flex gap-4 mt-2">
                            {item.size && <span className="text-xs text-gray-400 tracking-wider">SIZE: {item.size}</span>}
                            {item.color && <span className="text-xs text-gray-400 tracking-wider">COLOR: {item.color}</span>}
                          </div>
                        </div>
                        <button onClick={() => removeItem(item.id)} className="text-gray-300 hover:text-red-400 transition-colors flex-shrink-0">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center border border-gray-200">
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-9 h-9 flex items-center justify-center hover:bg-gray-50 transition-colors text-sm">−</button>
                        <span className="w-9 h-9 flex items-center justify-center text-xs">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-9 h-9 flex items-center justify-center hover:bg-gray-50 transition-colors text-sm">+</button>
                      </div>
                      <p className="text-sm font-medium">{formatPrice(item.price * item.quantity)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="lg:col-span-1">
              <div className="bg-gray-50 p-8 sticky top-24">
                <h2 className="text-xl font-display tracking-widest mb-8">ORDER SUMMARY</h2>
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 tracking-wider">Subtotal</span>
                    <span>{formatPrice(total())}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 tracking-wider">Shipping</span>
                    <span className="text-gray-400 text-xs tracking-wider">Calculated at checkout</span>
                  </div>
                </div>
                <div className="border-t border-gray-200 pt-6 mb-8">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium tracking-widest uppercase">Total</span>
                    <span className="text-xl font-display tracking-widest">{formatPrice(total())}</span>
                  </div>
                </div>
                <Link href="/checkout" className="flex items-center justify-center gap-3 w-full bg-black text-white py-4 text-xs tracking-widest uppercase hover:bg-gray-900 transition-colors mb-4">
                  PROCEED TO CHECKOUT <ArrowRight size={14} />
                </Link>
                <Link href="/shop" className="flex items-center justify-center gap-2 w-full text-xs tracking-widest text-gray-400 hover:text-black transition-colors uppercase">
                  <ArrowLeft size={12} /> CONTINUE SHOPPING
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
