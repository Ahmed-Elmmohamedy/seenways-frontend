import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Our Story" };

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="pt-20" dir="ltr">
        {/* Hero */}
        <section className="relative h-[70vh] overflow-hidden">
          <Image src="https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?w=1600&q=80" alt="SEENWAYS Story" fill className="object-cover" />
          <div className="absolute inset-0 bg-black/50" />
          <div className="relative z-10 h-full flex items-end pb-20">
            <div className="container">
              <p className="text-xs tracking-[0.5em] uppercase text-white/50 mb-4">EST. 2026</p>
              <h1 className="text-7xl md:text-9xl font-display text-white leading-none">OUR STORY</h1>
            </div>
          </div>
        </section>

        {/* Story */}
        <section className="py-24 md:py-32">
          <div className="container">
            <div className="max-w-3xl mx-auto">
              <p className="text-xs tracking-[0.4em] uppercase text-gray-400 mb-8">WHO WE ARE</p>
              <h2 className="text-4xl md:text-5xl font-display mb-10 leading-tight">
                BUILT FOR THE MODERN EGYPTIAN MAN
              </h2>
              <div className="space-y-6 text-gray-500 text-sm leading-relaxed tracking-wide">
                <p>
                  SEENWAYS was born from a simple belief: that every man deserves to dress with intention. In a world flooded with fast fashion and generic designs, we saw a gap — premium menswear that speaks to the modern Egyptian identity.
                </p>
                <p>
                  Our pieces are crafted with precision, using quality fabrics and thoughtful construction. Every stitch, every cut, every detail is considered. We don't follow trends — we create timeless staples that form the foundation of a great wardrobe.
                </p>
                <p>
                  SEENWAYS is more than clothing. It's a lifestyle, a mindset, a way of carrying yourself with quiet confidence. Minimal pieces. Maximum presence.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-24 md:py-32 bg-black text-white">
          <div className="container">
            <p className="text-xs tracking-[0.4em] uppercase text-white/30 mb-16 text-center">OUR VALUES</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {[
                { title: "QUALITY", desc: "We use only premium fabrics and construction methods. Every piece is built to last." },
                { title: "SIMPLICITY", desc: "Minimal design, maximum impact. We believe in the power of restraint." },
                { title: "CONFIDENCE", desc: "Our clothes are designed to make you feel powerful, not just look good." },
              ].map((v) => (
                <div key={v.title} className="border-t border-white/10 pt-8">
                  <h3 className="text-3xl font-display mb-4">{v.title}</h3>
                  <p className="text-white/40 text-sm leading-relaxed tracking-wide">{v.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 md:py-32 text-center">
          <div className="container">
            <h2 className="text-5xl md:text-7xl font-display mb-8">READY TO ELEVATE YOUR STYLE?</h2>
            <Link href="/shop" className="inline-flex items-center gap-3 bg-black text-white px-12 py-4 text-xs tracking-widest uppercase hover:bg-gray-900 transition-colors">
              SHOP THE COLLECTION <ArrowRight size={14} />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
