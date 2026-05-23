import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import type { Metadata } from "next";
import { RotateCcw, CheckCircle, XCircle, ArrowRight } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Returns & Exchanges | SEENWAYS",
  description: "سياسة الإرجاع والاستبدال - SEENWAYS",
};

export default function ReturnsPage() {
  return (
    <>
      <Navbar />
      <main className="pt-20" dir="ltr">

        {/* Hero */}
        <section className="py-20 md:py-32 bg-black text-white">
          <div className="container">
            <p className="text-xs tracking-[0.5em] uppercase text-white/40 mb-4">SEENWAYS</p>
            <h1 className="text-6xl md:text-8xl font-display leading-none mb-6">
              RETURNS &<br />EXCHANGES
            </h1>
            <p className="text-white/50 text-sm tracking-wider max-w-md">
              We want you to love what you ordered. If something isn't right, we'll make it right.
            </p>
          </div>
        </section>

        {/* Key Numbers */}
        <section className="py-16 border-b border-gray-100">
          <div className="container">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-0 divide-y md:divide-y-0 md:divide-x divide-gray-100">
              <div className="py-10 md:py-0 md:px-12 first:pl-0 last:pr-0">
                <p className="text-6xl font-display mb-3">14</p>
                <p className="text-xs tracking-widest uppercase text-gray-400">Days to Return</p>
              </div>
              <div className="py-10 md:py-0 md:px-12">
                <p className="text-6xl font-display mb-3">FREE</p>
                <p className="text-xs tracking-widest uppercase text-gray-400">If We Made a Mistake</p>
              </div>
              <div className="py-10 md:py-0 md:px-12">
                <p className="text-6xl font-display mb-3">COD</p>
                <p className="text-xs tracking-widest uppercase text-gray-400">Inspect Before You Pay</p>
              </div>
            </div>
          </div>
        </section>

        {/* Return Policy */}
        <section className="py-16 md:py-24 border-b border-gray-100">
          <div className="container max-w-3xl">
            <p className="text-xs tracking-[0.4em] uppercase text-gray-400 mb-3">RETURN POLICY</p>
            <h2 className="text-4xl md:text-5xl font-display mb-12">THE DETAILS</h2>
            <div className="space-y-8">
              {[
                {
                  title: "14-DAY RETURN WINDOW",
                  desc: "You have 14 days from the date of delivery to initiate a return or exchange. After 14 days, we are unable to accept returns."
                },
                {
                  title: "INSPECT ON DELIVERY",
                  desc: "Since we offer cash on delivery, you are welcome to inspect your order before completing payment. If you're not satisfied with what you receive, you can refuse the delivery on the spot at no cost to you."
                },
                {
                  title: "ORIGINAL CONDITION",
                  desc: "Items must be returned unworn, unwashed, and in their original packaging with all tags still attached. Items that have been worn, washed, or damaged will not be accepted."
                },
                {
                  title: "SHIPPING COSTS",
                  desc: "If the return is due to our error (wrong item, damaged product, manufacturing defect), we will cover the return shipping cost. If you changed your mind or ordered the wrong size, the return shipping cost is your responsibility."
                },
              ].map((item) => (
                <div key={item.title} className="border-l-2 border-black pl-6">
                  <h3 className="text-sm font-display tracking-widest mb-2">{item.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* What's Accepted */}
        <section className="py-16 md:py-24 border-b border-gray-100 bg-gray-50">
          <div className="container max-w-3xl">
            <p className="text-xs tracking-[0.4em] uppercase text-gray-400 mb-3">ELIGIBILITY</p>
            <h2 className="text-4xl md:text-5xl font-display mb-12">WHAT CAN BE RETURNED?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <CheckCircle size={18} className="text-green-500 flex-shrink-0" />
                  <h3 className="text-sm font-display tracking-widest">ACCEPTED</h3>
                </div>
                <ul className="space-y-3">
                  {[
                    "Unworn and unwashed items",
                    "Items with original tags attached",
                    "Items in original packaging",
                    "Wrong item received",
                    "Damaged or defective items",
                    "Items refused on delivery",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm text-gray-500">
                      <span className="w-1 h-1 bg-black rounded-full mt-2 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <XCircle size={18} className="text-red-400 flex-shrink-0" />
                  <h3 className="text-sm font-display tracking-widest">NOT ACCEPTED</h3>
                </div>
                <ul className="space-y-3">
                  {[
                    "Worn or washed items",
                    "Items without original tags",
                    "Items returned after 14 days",
                    "Items damaged by the customer",
                    "Sale or discounted items",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm text-gray-500">
                      <span className="w-1 h-1 bg-red-400 rounded-full mt-2 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* How to Return */}
        <section className="py-16 md:py-24 border-b border-gray-100">
          <div className="container max-w-3xl">
            <p className="text-xs tracking-[0.4em] uppercase text-gray-400 mb-3">PROCESS</p>
            <h2 className="text-4xl md:text-5xl font-display mb-12">HOW TO RETURN</h2>
            <div className="space-y-8">
              {[
                { step: "01", title: "CONTACT US", desc: "Reach out through the same channel you used to place your order — WhatsApp, Instagram, or our contact form. Mention your order number and the reason for return." },
                { step: "02", title: "GET APPROVAL", desc: "Our team will review your request and confirm eligibility within 24 hours. We'll provide you with return instructions." },
                { step: "03", title: "SHIP IT BACK", desc: "Send the item back in its original condition. If the return is our fault, we'll arrange pickup at no cost to you." },
                { step: "04", title: "REFUND OR EXCHANGE", desc: "Once we receive and inspect the item, we'll process your exchange or refund within 3-5 business days." },
              ].map((item) => (
                <div key={item.step} className="flex gap-6">
                  <span className="text-4xl font-display text-gray-100 flex-shrink-0">{item.step}</span>
                  <div className="pt-2">
                    <h3 className="text-sm font-display tracking-widest mb-2">{item.title}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 md:py-24">
          <div className="container max-w-3xl">
            <h2 className="text-4xl md:text-5xl font-display mb-6">HAVE QUESTIONS?</h2>
            <p className="text-gray-400 text-sm leading-relaxed mb-8 max-w-md">
              Our team is here to help. Reach out and we'll get back to you as soon as possible.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="mailto:seenwayseg@gmail.com"
                className="inline-flex items-center gap-3 bg-black text-white px-8 py-4 text-xs tracking-widest uppercase hover:bg-gray-900 transition-colors">
                EMAIL US
              </a>
              <a href="https://www.instagram.com/seen__ways" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-3 border border-black px-8 py-4 text-xs tracking-widest uppercase hover:bg-black hover:text-white transition-colors">
                INSTAGRAM @SEEN__WAYS
              </a>
              <Link href="/contact"
                className="inline-flex items-center gap-3 border border-black px-8 py-4 text-xs tracking-widest uppercase hover:bg-black hover:text-white transition-colors">
                CONTACT FORM <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
