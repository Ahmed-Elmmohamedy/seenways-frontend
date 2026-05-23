import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import type { Metadata } from "next";
import { Truck, Clock, RotateCcw, Shield, Phone, MapPin } from "lucide-react";

export const metadata: Metadata = {
  title: "Shipping & Delivery | SEENWAYS",
  description: "معلومات الشحن والتوصيل لجميع محافظات مصر - SEENWAYS",
};

export default function ShippingPage() {
  return (
    <>
      <Navbar />
      <main className="pt-20" dir="ltr">

        {/* Hero */}
        <section className="py-20 md:py-32 bg-black text-white">
          <div className="container">
            <p className="text-xs tracking-[0.5em] uppercase text-white/40 mb-4">SEENWAYS</p>
            <h1 className="text-6xl md:text-8xl font-display leading-none mb-6">
              SHIPPING &<br />DELIVERY
            </h1>
            <p className="text-white/50 text-sm tracking-wider max-w-md">
              Fast, reliable delivery across all Egyptian governorates via Bosta.
            </p>
          </div>
        </section>

        {/* Key Info Cards */}
        <section className="py-16 md:py-24 border-b border-gray-100">
          <div className="container">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="border border-gray-100 p-8">
                <Truck size={24} className="mb-6 text-gray-400" />
                <h3 className="text-xl font-display tracking-widest mb-3">FREE SHIPPING</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  On all orders over 1,000 EGP. Orders below 1,000 EGP ship for a flat rate of 70 EGP.
                </p>
              </div>
              <div className="border border-gray-100 p-8">
                <Clock size={24} className="mb-6 text-gray-400" />
                <h3 className="text-xl font-display tracking-widest mb-3">FAST DELIVERY</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Cairo & Giza in 2-3 days. Nearby governorates in 3-5 days. Remote areas in 5-7 days.
                </p>
              </div>
              <div className="border border-gray-100 p-8">
                <RotateCcw size={24} className="mb-6 text-gray-400" />
                <h3 className="text-xl font-display tracking-widest mb-3">14-DAY RETURNS</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Not satisfied? Return within 14 days. Items must be in original condition with tags attached.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Delivery Times */}
        <section className="py-16 md:py-24 border-b border-gray-100">
          <div className="container max-w-3xl">
            <p className="text-xs tracking-[0.4em] uppercase text-gray-400 mb-3">DELIVERY TIMES</p>
            <h2 className="text-4xl md:text-5xl font-display mb-12">WHEN TO EXPECT YOUR ORDER</h2>
            <div className="space-y-0 divide-y divide-gray-100">
              {[
                { region: "Cairo & Giza", time: "2 - 3 Business Days", icon: "🏙️" },
                { region: "Nearby Governorates", sub: "Alexandria, Qalyubia, Sharqia, Monufia, Gharbia, Dakahlia, Damietta, Ismailia, Port Said, Suez, Beheira, Fayoum, Beni Suef", time: "3 - 5 Business Days", icon: "🏘️" },
                { region: "Remote Governorates", sub: "Upper Egypt, Sinai, Red Sea, Matrouh, New Valley", time: "5 - 7 Business Days", icon: "🗺️" },
              ].map((item) => (
                <div key={item.region} className="py-6 flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-lg">{item.icon}</span>
                      <h3 className="font-medium text-sm tracking-wider">{item.region}</h3>
                    </div>
                    {item.sub && <p className="text-xs text-gray-400 ml-8 leading-relaxed">{item.sub}</p>}
                  </div>
                  <span className="text-xs tracking-widest uppercase bg-gray-50 px-4 py-2 whitespace-nowrap">{item.time}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-8 leading-relaxed">
              * Delivery times are estimates and may vary during peak seasons or public holidays. Orders placed after 3 PM are processed the next business day.
            </p>
          </div>
        </section>

        {/* Shipping Cost */}
        <section className="py-16 md:py-24 border-b border-gray-100 bg-gray-50">
          <div className="container max-w-3xl">
            <p className="text-xs tracking-[0.4em] uppercase text-gray-400 mb-3">SHIPPING COST</p>
            <h2 className="text-4xl md:text-5xl font-display mb-12">HOW MUCH DOES IT COST?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-black text-white p-8">
                <p className="text-xs tracking-widest uppercase text-white/40 mb-4">Orders over 1,000 EGP</p>
                <p className="text-5xl font-display mb-3">FREE</p>
                <p className="text-white/50 text-xs leading-relaxed">No shipping fees on orders above 1,000 EGP, delivered anywhere in Egypt.</p>
              </div>
              <div className="bg-white border border-gray-200 p-8">
                <p className="text-xs tracking-widest uppercase text-gray-400 mb-4">Orders below 1,000 EGP</p>
                <p className="text-5xl font-display mb-3">VARIES</p>
                <p className="text-gray-400 text-xs leading-relaxed">Shipping fee varies by governorate and is calculated automatically at checkout when you select your governorate.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Payment */}
        <section className="py-16 md:py-24 border-b border-gray-100">
          <div className="container max-w-3xl">
            <p className="text-xs tracking-[0.4em] uppercase text-gray-400 mb-3">PAYMENT</p>
            <h2 className="text-4xl md:text-5xl font-display mb-12">HOW DO YOU PAY?</h2>
            <div className="border border-gray-100 p-8">
              <Shield size={24} className="mb-6 text-gray-400" />
              <h3 className="text-xl font-display tracking-widest mb-4">CASH ON DELIVERY</h3>
              <p className="text-gray-400 text-sm leading-relaxed max-w-lg">
                We currently accept cash on delivery only. Pay when your order arrives at your door — no prepayment required. You can also inspect your items upon delivery before completing payment.
              </p>
            </div>
          </div>
        </section>

        {/* Returns */}
        <section className="py-16 md:py-24 border-b border-gray-100">
          <div className="container max-w-3xl">
            <p className="text-xs tracking-[0.4em] uppercase text-gray-400 mb-3">RETURNS & EXCHANGES</p>
            <h2 className="text-4xl md:text-5xl font-display mb-12">NOT HAPPY? WE'LL MAKE IT RIGHT.</h2>
            <div className="space-y-8">
              {[
                { title: "14-DAY RETURN WINDOW", desc: "You have 14 days from the date of delivery to initiate a return or exchange." },
                { title: "ITEM CONDITION", desc: "Items must be returned in their original condition — unworn, unwashed, with all original tags attached." },
                { title: "INSPECTION ON DELIVERY", desc: "You are welcome to inspect your order upon delivery before accepting it. If you're not satisfied, you can refuse the delivery on the spot." },
                { title: "HOW TO RETURN", desc: "Contact us through the same channel you used to place your order (WhatsApp, Instagram, etc.) and we'll arrange the return process for you." },
              ].map((item) => (
                <div key={item.title} className="border-l-2 border-black pl-6">
                  <h3 className="text-sm font-display tracking-widest mb-2">{item.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact */}
        <section className="py-16 md:py-24">
          <div className="container max-w-3xl">
            <p className="text-xs tracking-[0.4em] uppercase text-gray-400 mb-3">NEED HELP?</p>
            <h2 className="text-4xl md:text-5xl font-display mb-8">CONTACT US</h2>
            <p className="text-gray-400 text-sm leading-relaxed mb-8 max-w-md">
              Have questions about your order, shipping, or returns? We're here to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="https://www.instagram.com/seen__ways" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-3 bg-black text-white px-8 py-4 text-xs tracking-widest uppercase hover:bg-gray-900 transition-colors">
                INSTAGRAM @SEEN__WAYS
              </a>
              <a href="/contact"
                className="inline-flex items-center gap-3 border border-black px-8 py-4 text-xs tracking-widest uppercase hover:bg-black hover:text-white transition-colors">
                CONTACT FORM
              </a>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
