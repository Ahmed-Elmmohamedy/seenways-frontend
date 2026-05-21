"use client";
import { useState } from "react";
import { MessageCircle, Instagram, Mail } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import toast from "react-hot-toast";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "", _hp: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form._hp) return;
    if (!form.name || !form.email || !form.message) { toast.error("Please fill all fields"); return; }
    const wa = `https://wa.me/201000000000?text=Name: ${form.name}%0AEmail: ${form.email}%0AMessage: ${form.message}`;
    window.open(wa, "_blank");
    setSent(true);
    toast.success("Redirecting to WhatsApp...");
  };

  return (
    <>
      <Navbar />
      <main className="pt-20">
        <div className="container py-12 md:py-20">
          <div className="mb-16">
            <p className="text-xs tracking-[0.4em] uppercase text-gray-400 mb-2">GET IN TOUCH</p>
            <h1 className="text-5xl md:text-6xl font-display">CONTACT US</h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
            {/* Info */}
            <div className="space-y-12">
              <div>
                <p className="text-xs tracking-widest uppercase text-gray-400 mb-6">CONNECT WITH US</p>
                <div className="space-y-6">
                  <a href="https://wa.me/201000000000" target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-4 group">
                    <div className="w-12 h-12 border border-gray-200 flex items-center justify-center group-hover:bg-black group-hover:border-black group-hover:text-white transition-all">
                      <MessageCircle size={18} />
                    </div>
                    <div>
                      <p className="text-xs tracking-widest uppercase font-medium">WhatsApp</p>
                      <p className="text-sm text-gray-400 tracking-wider mt-1">Chat with us directly</p>
                    </div>
                  </a>
                  <a href="https://www.instagram.com/seen__ways" target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-4 group">
                    <div className="w-12 h-12 border border-gray-200 flex items-center justify-center group-hover:bg-black group-hover:border-black group-hover:text-white transition-all">
                      <Instagram size={18} />
                    </div>
                    <div>
                      <p className="text-xs tracking-widest uppercase font-medium">Instagram</p>
                      <p className="text-sm text-gray-400 tracking-wider mt-1">@seen__ways</p>
                    </div>
                  </a>
                  <a href="mailto:hello@seenways.com"
                    className="flex items-center gap-4 group">
                    <div className="w-12 h-12 border border-gray-200 flex items-center justify-center group-hover:bg-black group-hover:border-black group-hover:text-white transition-all">
                      <Mail size={18} />
                    </div>
                    <div>
                      <p className="text-xs tracking-widest uppercase font-medium">Email</p>
                      <p className="text-sm text-gray-400 tracking-wider mt-1">hello@seenways.com</p>
                    </div>
                  </a>
                </div>
              </div>
              <div className="border-t border-gray-100 pt-12">
                <p className="text-xs tracking-widest uppercase text-gray-400 mb-4">HOURS</p>
                <p className="text-sm text-gray-500 tracking-wider">Saturday – Thursday: 10AM – 10PM</p>
                <p className="text-sm text-gray-500 tracking-wider mt-1">Friday: 2PM – 10PM</p>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <input type="text" className="hidden" value={form._hp} onChange={(e) => setForm({ ...form, _hp: e.target.value })} tabIndex={-1} autoComplete="off" />
              <div>
                <label className="block text-xs tracking-widest uppercase mb-2 text-gray-500">Your Name</label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full border border-gray-200 px-4 py-4 text-sm focus:outline-none focus:border-black transition-colors" />
              </div>
              <div>
                <label className="block text-xs tracking-widest uppercase mb-2 text-gray-500">Email Address</label>
                <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full border border-gray-200 px-4 py-4 text-sm focus:outline-none focus:border-black transition-colors" />
              </div>
              <div>
                <label className="block text-xs tracking-widest uppercase mb-2 text-gray-500">Message</label>
                <textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} rows={5}
                  className="w-full border border-gray-200 px-4 py-4 text-sm focus:outline-none focus:border-black transition-colors resize-none" />
              </div>
              <button type="submit" disabled={sent}
                className="w-full bg-black text-white py-4 text-xs tracking-widest uppercase hover:bg-gray-900 transition-colors disabled:opacity-50">
                {sent ? "MESSAGE SENT" : "SEND MESSAGE"}
              </button>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
