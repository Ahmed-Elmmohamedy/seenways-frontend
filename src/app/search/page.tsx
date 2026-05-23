"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductCard from "@/components/shop/ProductCard";
import { getProducts } from "@/lib/api";
import { Product } from "@/types";
import { search as fbSearch } from "@/lib/fbpixel";

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query.trim()) return;
    setLoading(true);
    fbSearch(query);
    getProducts({ search: query }).then((r) => { setProducts(r.data.products); setLoading(false); }).catch(() => setLoading(false));
  }, [query]);

  return (
    <>
      <Navbar />
      <main className="pt-20">
        <div className="container py-12 md:py-20">
          <div className="mb-12">
            <p className="text-xs tracking-[0.4em] uppercase text-gray-400 mb-2">SEARCH RESULTS</p>
            <h1 className="text-5xl md:text-6xl font-display">
              {query ? `"${query}"` : "SEARCH"}
            </h1>
            {!loading && query && (
              <p className="text-sm text-gray-400 tracking-wider mt-3">{products.length} results found</p>
            )}
          </div>

          {!query ? (
            <div className="text-center py-32">
              <Search size={48} className="text-gray-200 mx-auto mb-6" />
              <p className="text-gray-400 text-sm tracking-wider">Use the search bar above to find products</p>
            </div>
          ) : loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="space-y-3">
                  <div className="aspect-[3/4] bg-gray-100 animate-pulse" />
                  <div className="h-3 bg-gray-100 animate-pulse rounded w-3/4" />
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-32">
              <h2 className="text-4xl font-display mb-4">NO RESULTS FOUND</h2>
              <p className="text-gray-400 text-sm tracking-wider">Try a different search term</p>
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

export default function SearchPage() {
  return <Suspense fallback={<div className="pt-20 min-h-screen" />}><SearchContent /></Suspense>;
}
