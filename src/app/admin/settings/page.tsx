"use client";
import { useState } from "react";
import { useAuthStore } from "@/lib/store";
import toast from "react-hot-toast";
import { ExternalLink, Copy, Check } from "lucide-react";

export default function AdminSettingsPage() {
  const { admin } = useAuthStore();
  const [copied, setCopied] = useState("");

  const copy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    toast.success("Copied!");
    setTimeout(() => setCopied(""), 2000);
  };

  const storeUrl = typeof window !== "undefined" ? window.location.origin : "https://seenways.com";
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://seenways-production.up.railway.app/api";

  const links = [
    { label: "Store Frontend", url: storeUrl, desc: "Your live store" },
    { label: "Backend API", url: apiUrl, desc: "Railway API endpoint" },
    { label: "Supabase Dashboard", url: "https://app.supabase.com", desc: "Database & Storage" },
    { label: "Vercel Dashboard", url: "https://vercel.com/dashboard", desc: "Frontend hosting" },
    { label: "Railway Dashboard", url: "https://railway.app/dashboard", desc: "Backend hosting" },
    { label: "Instagram", url: "https://www.instagram.com/seen__ways", desc: "@seen__ways" },
  ];

  const envVars = [
    { key: "NEXT_PUBLIC_API_URL", value: apiUrl },
    { key: "NEXT_PUBLIC_WHATSAPP_NUMBER", value: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "" },
  ];

  return (
    <div dir="ltr" className="max-w-2xl">
      <div className="mb-8">
        <h1 className="text-3xl font-display tracking-widest">SETTINGS</h1>
        <p className="text-gray-400 text-xs tracking-wider mt-1">Store configuration and quick links</p>
      </div>

      {/* Account */}
      <div className="bg-white border border-gray-100 p-6 mb-6">
        <h2 className="text-sm font-display tracking-widest mb-5">ACCOUNT</h2>
        <div className="space-y-4">
          <div className="flex justify-between items-center py-3 border-b border-gray-50">
            <div>
              <p className="text-xs font-medium tracking-wider">{admin?.name}</p>
              <p className="text-[10px] text-gray-400 mt-0.5">{admin?.email}</p>
            </div>
            <span className="text-[10px] bg-black text-white px-3 py-1 tracking-widest uppercase">Admin</span>
          </div>
          <p className="text-xs text-gray-400 tracking-wider">
            To change your password or email, contact your developer or use Supabase directly.
          </p>
        </div>
      </div>

      {/* Quick Links */}
      <div className="bg-white border border-gray-100 p-6 mb-6">
        <h2 className="text-sm font-display tracking-widest mb-5">QUICK LINKS</h2>
        <div className="space-y-2">
          {links.map((link) => (
            <a key={link.label} href={link.url} target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-between p-4 border border-gray-100 hover:border-black transition-all group">
              <div>
                <p className="text-xs font-medium tracking-wider">{link.label}</p>
                <p className="text-[10px] text-gray-400 mt-0.5">{link.desc}</p>
              </div>
              <ExternalLink size={14} className="text-gray-300 group-hover:text-black transition-colors" />
            </a>
          ))}
        </div>
      </div>

      {/* Env Vars */}
      <div className="bg-white border border-gray-100 p-6 mb-6">
        <h2 className="text-sm font-display tracking-widest mb-5">ENVIRONMENT VARIABLES</h2>
        <div className="space-y-3">
          {envVars.map((env) => (
            <div key={env.key} className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-100">
              <div className="flex-1 min-w-0">
                <p className="text-[10px] text-gray-400 tracking-widest uppercase mb-1">{env.key}</p>
                <p className="text-xs font-mono truncate">{env.value || "Not set"}</p>
              </div>
              <button onClick={() => copy(env.value, env.key)} className="flex-shrink-0 text-gray-400 hover:text-black transition-colors">
                {copied === env.key ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Store Info */}
      <div className="bg-white border border-gray-100 p-6">
        <h2 className="text-sm font-display tracking-widest mb-5">STORE INFO</h2>
        <div className="space-y-3 text-sm">
          {[
            ["Store Name", "SEENWAYS"],
            ["Country", "Egypt"],
            ["Currency", "EGP (ج.م)"],
            ["WhatsApp Orders", "Enabled"],
            ["Free Shipping Over", "500 ج.م"],
          ].map(([label, value]) => (
            <div key={label} className="flex justify-between py-3 border-b border-gray-50">
              <span className="text-xs text-gray-400 tracking-wider">{label}</span>
              <span className="text-xs font-medium">{value}</span>
            </div>
          ))}
        </div>
        <p className="text-[10px] text-gray-400 tracking-wider mt-4">
          To update store settings, contact your developer.
        </p>
      </div>
    </div>
  );
}
