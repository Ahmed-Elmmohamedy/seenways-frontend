import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="pt-20 min-h-screen flex flex-col items-center justify-center gap-8 text-center px-6">
        <p className="text-xs tracking-[0.5em] uppercase text-gray-400">PAGE NOT FOUND</p>
        <h1 className="text-[12rem] md:text-[18rem] font-display leading-none text-gray-100">404</h1>
        <div className="-mt-16 space-y-4">
          <h2 className="text-3xl font-display">LOST IN THE WARDROBE?</h2>
          <p className="text-gray-400 text-sm tracking-wider">The page you're looking for doesn't exist.</p>
        </div>
        <Link href="/" className="inline-flex items-center gap-3 bg-black text-white px-12 py-4 text-xs tracking-widest uppercase hover:bg-gray-900 transition-colors">
          BACK TO HOME <ArrowRight size={14} />
        </Link>
      </main>
      <Footer />
    </>
  );
}
