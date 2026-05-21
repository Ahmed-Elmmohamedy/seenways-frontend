"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { LayoutDashboard, Package, ShoppingCart, Tag, LogOut, Menu, X, Settings, ChevronRight, Ticket } from "lucide-react";
import { useAuthStore } from "@/lib/store";

const LOGO_WHITE = "https://qxkevpcrzpywtalzctsz.supabase.co/storage/v1/object/public/seenways-images/logo-white-transparent.png";

const navItems = [
  { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/admin/products", icon: Package, label: "Products" },
  { href: "/admin/orders", icon: ShoppingCart, label: "Orders" },
  { href: "/admin/categories", icon: Tag, label: "Categories" },
  { href: "/admin/coupons", icon: Ticket, label: "Coupons" },
  { href: "/admin/settings", icon: Settings, label: "Settings" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { token, admin, logout } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!token && pathname !== "/admin/login") router.push("/admin/login");
  }, [token, pathname]);

  if (pathname === "/admin/login") return <>{children}</>;
  if (!token) return <div className="min-h-screen bg-black" />;

  const handleLogout = () => { logout(); router.push("/admin/login"); };

  const NavLink = ({ item, onClick }: { item: typeof navItems[0]; onClick?: () => void }) => {
    const active = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
    return (
      <Link href={item.href} onClick={onClick}
        className={`flex items-center gap-3 px-4 py-3 text-xs tracking-widest uppercase transition-all rounded-sm ${active ? "bg-white text-black" : "text-white/50 hover:text-white hover:bg-white/5"}`}>
        <item.icon size={16} />
        {item.label}
        {active && <ChevronRight size={12} className="ml-auto" />}
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex" dir="ltr">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-56 bg-black text-white flex-col fixed top-0 left-0 bottom-0 z-40">
        <div className="p-6 border-b border-white/10">
          <Image src={LOGO_WHITE} alt="SEENWAYS" width={110} height={22} className="h-5 w-auto object-contain" />
          <p className="text-[10px] text-white/20 tracking-widest uppercase mt-2">Admin Panel</p>
        </div>
        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => <NavLink key={item.href} item={item} />)}
        </nav>
        <div className="p-3 border-t border-white/10">
          <div className="px-4 py-2 mb-1">
            <p className="text-xs text-white/50 font-medium truncate">{admin?.name}</p>
            <p className="text-[10px] text-white/20 tracking-wider mt-0.5 truncate">{admin?.email}</p>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-2.5 text-white/30 hover:text-white text-xs tracking-widest uppercase w-full transition-colors rounded-sm hover:bg-white/5">
            <LogOut size={14} /> Logout
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <aside className="w-56 bg-black text-white flex flex-col">
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <Image src={LOGO_WHITE} alt="SEENWAYS" width={100} height={20} className="h-5 w-auto object-contain" />
              <button onClick={() => setSidebarOpen(false)}><X size={18} className="text-white/40" /></button>
            </div>
            <nav className="flex-1 p-3 space-y-0.5">
              {navItems.map((item) => <NavLink key={item.href} item={item} onClick={() => setSidebarOpen(false)} />)}
            </nav>
            <div className="p-3 border-t border-white/10">
              <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-2.5 text-white/30 text-xs tracking-widest uppercase w-full">
                <LogOut size={14} /> Logout
              </button>
            </div>
          </aside>
          <div className="flex-1 bg-black/60" onClick={() => setSidebarOpen(false)} />
        </div>
      )}

      {/* Main */}
      <div className="flex-1 md:ml-56 flex flex-col min-h-screen">
        <header className="bg-white border-b border-gray-100 h-14 flex items-center justify-between px-6 sticky top-0 z-30">
          <button onClick={() => setSidebarOpen(true)} className="md:hidden p-1 text-gray-500"><Menu size={20} /></button>
          <div className="hidden md:block">
            <p className="text-[10px] text-gray-300 tracking-widest uppercase">
              {pathname.split("/").filter(Boolean).map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(" › ")}
            </p>
          </div>
          <Link href="/" target="_blank" className="text-[10px] tracking-widest text-gray-400 hover:text-black transition-colors uppercase border-b border-transparent hover:border-gray-400 pb-0.5">
            View Store ↗
          </Link>
        </header>
        <main className="flex-1 p-6 md:p-8 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
