"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, Menu, X, Search } from "lucide-react";
import { useCartStore } from "@/lib/store";
import { useRouter, usePathname } from "next/navigation";

const LOGO_BLACK = "https://qxkevpcrzpywtalzctsz.supabase.co/storage/v1/object/public/seenways-images/logo-black-hq.png";
const LOGO_WHITE = "https://qxkevpcrzpywtalzctsz.supabase.co/storage/v1/object/public/seenways-images/logo-white-transparent.png";
const ICON_BLACK = "https://qxkevpcrzpywtalzctsz.supabase.co/storage/v1/object/public/seenways-images/icon-black.png";
const ICON_WHITE = "https://qxkevpcrzpywtalzctsz.supabase.co/storage/v1/object/public/seenways-images/icon-white.png";

const navLinks = [
  { label: "SHOP ALL", href: "/shop" },
  { label: "T-SHIRTS", href: "/shop?category=t-shirts" },
  { label: "PANTS", href: "/shop?category=pants" },
  { label: "NEW IN", href: "/shop?featured=true" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { count, openCart } = useCartStore();
  const router = useRouter();
  const cartCount = count();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  const pathname = usePathname(); const isTransparent = pathname === "/" && !scrolled && !mobileOpen;

  return (
    <>
      <nav dir="ltr" className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isTransparent ? "bg-transparent" : "bg-white border-b border-black/10"}`}>
        <div className="container">
          <div className="flex items-center justify-between h-16 md:h-20">
            <button onClick={() => setMobileOpen(true)} className={`md:hidden p-2 transition-colors ${isTransparent ? "text-white" : "text-black"}`}>
              <Menu size={22} />
            </button>
            <div className="hidden md:flex items-center gap-10">
              <Link href="/">
                <Image src={isTransparent ? LOGO_WHITE : LOGO_BLACK} alt="SEENWAYS" width={160} height={30} className="object-contain h-7 w-auto" priority />
              </Link>
              <div className="flex items-center gap-8">
                {navLinks.map((link) => (
                  <Link key={link.href} href={link.href} className={`text-xs tracking-widest hover:opacity-50 transition-opacity ${isTransparent ? "text-white" : "text-black"}`}>
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
            <Link href="/" className="md:hidden absolute left-1/2 -translate-x-1/2">
              <Image src={isTransparent ? ICON_WHITE : ICON_BLACK} alt="SEENWAYS" width={32} height={32} className="h-8 w-8 object-contain" />
            </Link>
            <div className="flex items-center gap-3">
              <button onClick={() => setSearchOpen(true)} className={`p-2 transition-colors ${isTransparent ? "text-white" : "text-black"}`}>
                <Search size={20} />
              </button>
              <button onClick={openCart} className={`relative p-2 transition-colors ${isTransparent ? "text-white" : "text-black"}`}>
                <ShoppingBag size={20} />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-black text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {searchOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setSearchOpen(false)} />
          <div className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 shadow-sm z-50 h-14 md:h-20 flex items-center">
            <div className="container">
              <form onSubmit={handleSearch} className="flex items-center gap-3">
                <Search size={16} className="text-gray-400 flex-shrink-0" />
                <input
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="flex-1 text-sm focus:outline-none bg-transparent py-1"
                />
                <button type="button" onClick={() => setSearchOpen(false)} className="text-gray-400 hover:text-black transition-colors">
                  <X size={16} />
                </button>
              </form>
            </div>
          </div>
        </>
      )}

      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="w-80 max-w-full bg-white h-full flex flex-col shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <Image src={LOGO_BLACK} alt="SEENWAYS" width={120} height={24} className="h-6 w-auto object-contain" />
              <button onClick={() => setMobileOpen(false)}><X size={22} /></button>
            </div>
            <nav className="flex-1 p-6 space-y-6">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)} className="block text-2xl font-display tracking-widest hover:opacity-50 transition-opacity">
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="p-6 border-t border-gray-100">
              <a href="https://www.instagram.com/seen__ways" target="_blank" rel="noopener noreferrer" className="text-xs tracking-widest text-gray-400 hover:text-black transition-colors uppercase">
                @SEEN__WAYS
              </a>
            </div>
          </div>
          <div className="flex-1 bg-black/50" onClick={() => setMobileOpen(false)} />
        </div>
      )}
    </>
  );
}
