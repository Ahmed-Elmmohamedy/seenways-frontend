"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { SlidersHorizontal, X } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductCard from "@/components/shop/ProductCard";
import { getProducts, getCategories } from "@/lib/api";
import { Product, Category } from "@/types";

function ShopContent() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState(searchParams.get("category") || "");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const featured = searchParams.get("featured");

  useEffect(() => {
    getCategories().then((r) => setCategories(r.data)).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    const params: Record<string, string | boolean> = {};
    if (featured) params.featured = true;
    if (activeCategory) params.category = activeCategory;
    getProducts(params).then((r) => { setProducts(r.data.products); setLoading(false); }).catch(() => setLoading(false));
  }, [featured, activeCategory]);

  const title = featured ? "FEATURED" : activeCategory ? activeCategory.toUpperCase() : "SHOP ALL";

  return (
    <>
      <Navbar />
      <main className="pt-20">
        {/* Header */}
        <div className="border-b border-gray-100 py-12">
          <div className="container">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-xs tracking-[0.4em] uppercase text-gray-400 mb-2">{products.length} PRODUCTS</p>
                <h1 className="text-5xl md:text-6xl font-display">{title}</h1>
              </div>
              <button onClick={() => setFiltersOpen(!filtersOpen)} className="flex items-center gap-2 text-xs tracking-widest uppercase border border-black px-4 py-3 hover:bg-black hover:text-white transition-all">
                <SlidersHorizontal size={14} /> FILTER
              </button>
            </div>

            {/* Filters */}
            {filtersOpen && (
              <div className="mt-8 pt-8 border-t border-gray-100">
                <div className="flex items-center gap-3 flex-wrap">
                  <button onClick={() => setActiveCategory("")} className={`px-5 py-2.5 text-xs tracking-widest uppercase border transition-all ${!activeCategory ? "bg-black text-white border-black" : "border-gray-200 hover:border-black"}`}>
                    ALL
                  </button>
                  {categories.map((c) => (
                    <button key={c.id} onClick={() => setActiveCategory(c.slug)} className={`px-5 py-2.5 text-xs tracking-widest uppercase border transition-all ${activeCategory === c.slug ? "bg-black text-white border-black" : "border-gray-200 hover:border-black"}`}>
                      {c.name}
                    </button>
                  ))}
                  {activeCategory && (
                    <button onClick={() => setActiveCategory("")} className="flex items-center gap-2 text-xs text-gray-400 tracking-wider ml-4">
                      <X size={12} /> CLEAR
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Products */}
        <div className="container py-16">
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="space-y-3">
                  <div className="aspect-[3/4] bg-gray-100 animate-pulse" />
                  <div className="h-3 bg-gray-100 animate-pulse rounded w-3/4" />
                  <div className="h-3 bg-gray-100 animate-pulse rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-32">
              <h2 className="text-4xl font-display mb-4">NO PRODUCTS FOUND</h2>
              <p className="text-gray-400 text-sm tracking-wider">Try adjusting your filters</p>
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

export default function ShopPage() {
  return <Suspense fallback={<div className="pt-20 min-h-screen" />}><ShopContent /></Suspense>;
}
