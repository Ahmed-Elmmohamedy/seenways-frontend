"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductCard from "@/components/shop/ProductCard";
import { getProducts } from "@/lib/api";
import { Product } from "@/types";

const categories = [
  { name: "T-SHIRTS", slug: "t-shirts", image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80" },
  { name: "PANTS", slug: "pants", image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800&q=80" },
  { name: "SETS", slug: "sets", image: "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=800&q=80" },
];

const instagramImages = [
  "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=400&q=80",
  "https://images.unsplash.com/photo-1536766820879-059fec98ec0a?w=400&q=80",
  "https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?w=400&q=80",
  "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400&q=80",
];

export default function HomePage() {
  const [latest, setLatest] = useState<Product[]>([]);
  const [featured, setFeatured] = useState<Product[]>([]);

  useEffect(() => {
    getProducts({ limit: 4 }).then((r) => setLatest(r.data.products)).catch(() => {});
    getProducts({ featured: true, limit: 4 }).then((r) => setFeatured(r.data.products)).catch(() => {});
  }, []);

  return (
    <>
      <Navbar />
      <main>

        {/* Hero */}
        <section className="relative h-screen overflow-hidden">
          <Image src="https://images.unsplash.com/photo-1536766820879-059fec98ec0a?w=1600&q=80" alt="SEENWAYS" fill className="object-cover object-center" priority />
          <div className="absolute inset-0 bg-black/35" />
          <div className="relative z-10 h-full flex items-end pb-32 md:pb-24">
            <div className="container">
              <p className="text-[10px] tracking-[0.4em] uppercase text-white/60 mb-3">NEW COLLECTION 2026</p>
              <h1 className="text-3xl sm:text-5xl md:text-7xl font-display text-white leading-tight mb-2">
                SEENWAYS
              </h1>
              <p className="text-xs md:text-base tracking-[0.3em] uppercase text-white/70 mb-6">
                MODERN MENSWEAR
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <Link href="/shop" className="inline-flex items-center gap-3 bg-white text-black px-8 py-4 text-xs tracking-widest uppercase hover:bg-gray-100 transition-colors">
                  SHOP NOW <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Announcement */}
        <div className="bg-black text-white text-center py-4">
          <p className="text-xs tracking-[0.4em] uppercase px-4">FREE SHIPPING ON ORDERS OVER 1000 EGP &nbsp;·&nbsp; NEW COLLECTION 2026</p>
        </div>

        {/* Categories */}
        <section className="py-24 md:py-32">
          <div className="container">
            <div className="flex items-end justify-between mb-16">
              <div>
                <p className="text-xs tracking-[0.4em] uppercase text-gray-400 mb-3">EXPLORE</p>
                <h2 className="text-5xl md:text-6xl font-display">SHOP BY CATEGORY</h2>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {categories.map((cat) => (
                <Link key={cat.slug} href={`/shop?category=${cat.slug}`} className="group relative overflow-hidden aspect-[3/4]">
                  <Image src={cat.image} alt={cat.name} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/45 transition-all duration-500" />
                  <div className="absolute bottom-0 left-0 right-0 p-8">
                    <h3 className="text-3xl font-display text-white mb-3">{cat.name}</h3>
                    <span className="inline-flex items-center gap-2 text-white/70 text-xs tracking-widest uppercase group-hover:gap-4 transition-all">
                      SHOP NOW <ArrowRight size={12} />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* New Arrivals */}
        {latest.length > 0 && (
          <section className="py-24 md:py-32 border-t border-gray-100">
            <div className="container">
              <div className="flex items-end justify-between mb-16">
                <div>
                  <p className="text-xs tracking-[0.4em] uppercase text-gray-400 mb-3">JUST ARRIVED</p>
                  <h2 className="text-5xl md:text-6xl font-display">NEW ARRIVALS</h2>
                </div>
                <Link href="/shop" className="hidden md:flex items-center gap-2 text-xs tracking-widest uppercase hover:opacity-50 transition-opacity border-b border-black pb-0.5">
                  VIEW ALL <ArrowRight size={12} />
                </Link>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {latest.map((p) => <ProductCard key={p.id} product={p} />)}
              </div>
              <div className="mt-10 text-center md:hidden">
                <Link href="/shop" className="inline-flex items-center gap-2 text-xs tracking-widest uppercase border-b border-black pb-0.5">
                  VIEW ALL <ArrowRight size={12} />
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* Philosophy Banner */}
        <section className="py-24 md:py-32 bg-black text-white">
          <div className="container">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
              <div className="relative aspect-[4/5] overflow-hidden">
                <Image src="https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?w=800&q=80" alt="Philosophy" fill className="object-cover" />
              </div>
              <div className="md:pl-12">
                <p className="text-xs tracking-[0.5em] uppercase text-white/30 mb-8">OUR PHILOSOPHY</p>
                <h2 className="text-5xl md:text-7xl font-display leading-tight mb-8">
                  DESIGNED<br />FOR EVERYDAY<br />CONFIDENCE.
                </h2>
                <p className="text-white/40 text-sm leading-relaxed tracking-wider mb-12 max-w-sm">
                  At SEENWAYS, we believe in creating timeless pieces that speak through quality, fit, and simplicity. Every piece is crafted for the modern Egyptian man.
                </p>
                <Link href="/about" className="inline-flex items-center gap-3 border border-white/30 px-10 py-4 text-xs tracking-widest uppercase hover:bg-white hover:text-black transition-all duration-500">
                  LEARN MORE <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Featured */}
        {featured.length > 0 && (
          <section className="py-24 md:py-32">
            <div className="container">
              <div className="flex items-end justify-between mb-16">
                <div>
                  <p className="text-xs tracking-[0.4em] uppercase text-gray-400 mb-3">SELECTED FOR YOU</p>
                  <h2 className="text-5xl md:text-6xl font-display">FEATURED</h2>
                </div>
                <Link href="/shop?featured=true" className="hidden md:flex items-center gap-2 text-xs tracking-widest uppercase hover:opacity-50 transition-opacity border-b border-black pb-0.5">
                  VIEW ALL <ArrowRight size={12} />
                </Link>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {featured.map((p) => <ProductCard key={p.id} product={p} />)}
              </div>
            </div>
          </section>
        )}

        {/* Instagram */}
        <section className="py-24 md:py-32 border-t border-gray-100">
          <div className="container">
            <div className="flex items-center justify-between mb-16">
              <h2 className="text-xs tracking-[0.4em] uppercase">FOLLOW US ON INSTAGRAM</h2>
              <a href="https://www.instagram.com/seen__ways" target="_blank" rel="noopener noreferrer" className="text-xs tracking-widest uppercase hover:opacity-50 transition-opacity">
                @SEEN__WAYS
              </a>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {instagramImages.map((img, i) => (
                <a key={i} href="https://www.instagram.com/seen__ways" target="_blank" rel="noopener noreferrer" className="group relative aspect-square overflow-hidden bg-gray-100">
                  <Image src={img} alt="Instagram" fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-500" />
                </a>
              ))}
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
