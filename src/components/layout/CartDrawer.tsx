"use client";
import { useCartStore } from "@/lib/store";
import { X, ShoppingBag, Trash2, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, total } = useCartStore();

  return (
    <>
      {/* Overlay */}
      {isOpen && <div className="fixed inset-0 bg-black/40 z-50 transition-opacity" onClick={closeCart} />}

      {/* Drawer */}
      <div className={`fixed top-0 right-0 h-full w-full max-w-md bg-white z-50 flex flex-col shadow-2xl transition-transform duration-500 ease-in-out ${isOpen ? "translate-x-0 visible" : "translate-x-full invisible"}`}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <ShoppingBag size={18} />
            <span className="text-xs tracking-widest uppercase font-medium">Shopping Bag ({items.length})</span>
          </div>
          <button onClick={closeCart} className="p-1 hover:opacity-50 transition-opacity"><X size={20} /></button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto no-scrollbar">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-6 px-6">
              <ShoppingBag size={48} className="text-gray-200" />
              <div className="text-center">
                <p className="text-lg font-display tracking-widest mb-2">YOUR BAG IS EMPTY</p>
                <p className="text-xs text-gray-400 tracking-wider">Add items to get started</p>
              </div>
              <button onClick={closeCart} className="border border-black px-8 py-3 text-xs tracking-widest uppercase hover:bg-black hover:text-white transition-all">
                CONTINUE SHOPPING
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 p-6">
                  <Link href={`/product/${item.slug}`} onClick={closeCart} className="relative w-20 h-24 bg-gray-50 flex-shrink-0 overflow-hidden">
                    <Image src={item.image || "https://placehold.co/80x96/f5f5f5/000?text=SW"} alt={item.name} fill className="object-cover" />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium tracking-wide truncate">{item.name}</h3>
                    <div className="flex gap-3 mt-1">
                      {item.size && <span className="text-xs text-gray-400">Size: {item.size}</span>}
                      {item.color && <span className="text-xs text-gray-400">Color: {item.color}</span>}
                    </div>
                    <p className="text-sm font-medium mt-2">{formatPrice(item.price)}</p>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center border border-gray-200">
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-7 h-7 flex items-center justify-center text-sm hover:bg-gray-50 transition-colors">−</button>
                        <span className="w-7 h-7 flex items-center justify-center text-xs">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-7 h-7 flex items-center justify-center text-sm hover:bg-gray-50 transition-colors">+</button>
                      </div>
                      <button onClick={() => removeItem(item.id)} className="text-gray-300 hover:text-red-400 transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{formatPrice(item.price * item.quantity)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-gray-100 p-6 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-xs tracking-widest uppercase text-gray-500">Subtotal</span>
              <span className="text-sm font-medium">{formatPrice(total())}</span>
            </div>
            <div className="flex justify-between items-center pb-4 border-b border-gray-100">
              <span className="text-xs tracking-widest uppercase text-gray-500">Shipping</span>
              <span className="text-xs text-gray-400 tracking-wider">Calculated at checkout</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium tracking-wider">TOTAL</span>
              <span className="text-lg font-display tracking-widest">{formatPrice(total())}</span>
            </div>
            <Link href="/checkout" onClick={closeCart} className="flex items-center justify-center gap-3 w-full bg-black text-white py-4 text-xs tracking-widest uppercase hover:bg-gray-900 transition-colors">
              CHECKOUT <ArrowRight size={14} />
            </Link>
            <button onClick={closeCart} className="w-full text-center text-xs text-gray-400 tracking-wider hover:text-black transition-colors underline">
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  );
}
