import Link from "next/link";
import Image from "next/image";

const LOGO_WHITE = "https://qxkevpcrzpywtalzctsz.supabase.co/storage/v1/object/public/seenways-images/logo-white-transparent.png";

export default function Footer() {
  return (
    <footer className="bg-black text-white">
      {/* Newsletter */}
      <div className="border-b border-white/10 py-16">
        <div className="container text-center">
          <p className="text-xs tracking-[0.4em] uppercase text-white/40 mb-4">JOIN THE CLUB</p>
          <h2 className="text-4xl md:text-5xl font-display mb-4">GET 10% OFF YOUR FIRST ORDER</h2>
          <p className="text-white/40 text-sm tracking-wider mb-10">Be the first to know about new arrivals and exclusive offers</p>
          <div className="flex max-w-md mx-auto">
            <input type="email" placeholder="YOUR EMAIL ADDRESS" className="flex-1 bg-transparent border border-white/20 px-6 py-4 text-xs tracking-widest placeholder:text-white/20 outline-none focus:border-white/50 transition-colors" />
            <button className="bg-white text-black px-8 py-4 text-xs tracking-widest uppercase hover:bg-gray-200 transition-colors flex-shrink-0">
              SUBSCRIBE
            </button>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="py-16">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="md:col-span-1">
              <Image src={LOGO_WHITE} alt="SEENWAYS" width={140} height={28} className="h-7 w-auto object-contain mb-6" />
              <p className="text-white/40 text-xs leading-relaxed tracking-wider max-w-xs">
                Premium menswear for the modern man. Minimal pieces, maximum presence.
              </p>
              <div className="flex items-center gap-6 mt-8">
                <a href="https://www.instagram.com/seen__ways" target="_blank" rel="noopener noreferrer"
                  className="text-white/40 hover:text-white transition-colors text-xs tracking-widest uppercase">
                  Instagram
                </a>
                <a href="https://www.facebook.com/profile.php?id=100090374707078" target="_blank" rel="noopener noreferrer"
                  className="text-white/40 hover:text-white transition-colors text-xs tracking-widest uppercase">
                  Facebook
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-xs tracking-[0.4em] uppercase mb-6 text-white/60">Shop</h3>
              <ul className="space-y-4">
                {[["All Products", "/shop"], ["T-Shirts", "/shop?category=t-shirts"], ["Pants", "/shop?category=pants"], ["New In", "/shop?featured=true"]].map(([label, href]) => (
                  <li key={href}><Link href={href} className="text-white/40 hover:text-white transition-colors text-xs tracking-wider">{label}</Link></li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-xs tracking-[0.4em] uppercase mb-6 text-white/60">Customer Care</h3>
              <ul className="space-y-4">
                {[["Shipping & Delivery", "/shipping"], ["Returns & Exchanges", "/returns"], ["Contact Us", "/contact"]].map(([label, href]) => (
                  <li key={href}><Link href={href} className="text-white/40 hover:text-white transition-colors text-xs tracking-wider">{label}</Link></li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-xs tracking-[0.4em] uppercase mb-6 text-white/60">About</h3>
              <ul className="space-y-4">
                {[["Our Story", "/about"], ["Privacy Policy", "/privacy"], ["Terms & Conditions", "/terms"]].map(([label, href]) => (
                  <li key={href}><Link href={href} className="text-white/40 hover:text-white transition-colors text-xs tracking-wider">{label}</Link></li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-white/10 py-6">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/20 text-xs tracking-widest">© 2026 SEENWAYS. ALL RIGHTS RESERVED.</p>
          <p className="text-white/20 text-xs tracking-widest">EGYPT</p>
        </div>
      </div>
    </footer>
  );
}
