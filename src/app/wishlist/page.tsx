"use client";
import { useEffect, useState } from "react";
import { Heart, ArrowRight } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductCard from "@/components/shop/ProductCard";
import { useWishlistStore } from "@/lib/store";
import { getProducts } from "@/lib/api";
import { Product } from "@/types";

export default function WishlistPage() {
  const { items } = useWishlistStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (items.length === 0) { setLoading(false); return; }
    getProducts({ limit: 100 }).then((r) => {
      const wishlistProducts = r.data.products.filter((p: Product) => items.includes(p.id));
      setProducts(wishlistProducts);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [items]);

  return (
    <>
      <Navbar />
      <main className="pt-20">
        <div className="container py-12 md:py-20">
          <div className="mb-12">
            <p className="text-xs tracking-[0.4em] uppercase text-gray-400 mb-2">{items.length} ITEMS</p>
            <h1 className="text-5xl md:text-6xl font-display">WISHLIST</h1>
          </div>

          {items.length === 0 ? (
            <div className="text-center py-32">
              <Heart size={56} className="text-gray-200 mx-auto mb-6" />
              <h2 className="text-4xl font-display mb-4">YOUR WISHLIST IS EMPTY</h2>
              <p className="text-gray-400 text-sm tracking-wider mb-10">Save items you love for later</p>
              <Link href="/shop" className="inline-flex items-center gap-3 bg-black text-white px-12 py-4 text-xs tracking-widest uppercase hover:bg-gray-900 transition-colors">
                EXPLORE PRODUCTS <ArrowRight size={14} />
              </Link>
            </div>
          ) : loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {[...Array(4)].map((_, i) => <div key={i} className="aspect-[3/4] bg-gray-100 animate-pulse" />)}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {products.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
