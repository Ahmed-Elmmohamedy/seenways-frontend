import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions | SEENWAYS",
};

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <main className="pt-20" dir="ltr">
        {/* Hero */}
        <section className="py-20 bg-black text-white">
          <div className="container">
            <p className="text-xs tracking-[0.5em] uppercase text-white/40 mb-4">LEGAL</p>
            <h1 className="text-6xl md:text-8xl font-display leading-none">TERMS &<br />CONDITIONS</h1>
            <p className="text-white/40 text-xs tracking-widest mt-6">Last updated: January 2026</p>
          </div>
        </section>

        {/* Content */}
        <section className="py-16 md:py-24">
          <div className="container max-w-3xl">
            <div className="space-y-12 text-sm text-gray-500 leading-relaxed">

              <div>
                <h2 className="text-2xl font-display tracking-widest text-black mb-4">1. ACCEPTANCE OF TERMS</h2>
                <p>
                  By accessing or using the SEENWAYS website (seenways.com) or placing an order, you agree to be bound by these Terms and Conditions. If you do not agree, please do not use our website or services.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-display tracking-widest text-black mb-4">2. PRODUCTS & AVAILABILITY</h2>
                <ul className="space-y-3 ml-4">
                  {[
                    "All products are subject to availability. We reserve the right to discontinue any product at any time.",
                    "Product images are for illustrative purposes. Actual colors may vary slightly due to screen settings.",
                    "We reserve the right to limit quantities of any product.",
                    "Prices are listed in Egyptian Pounds (EGP) and are subject to change without notice.",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <span className="w-1 h-1 bg-gray-400 rounded-full mt-2 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-display tracking-widest text-black mb-4">3. ORDERS</h2>
                <ul className="space-y-3 ml-4">
                  {[
                    "By placing an order, you are making an offer to purchase the selected items.",
                    "We reserve the right to refuse or cancel any order for any reason, including suspected fraud or inaccurate information.",
                    "You may cancel your order before it has been confirmed. Once confirmed, cancellation may not be possible.",
                    "You will receive an order confirmation via the contact information provided.",
                    "We are not responsible for orders placed with incorrect contact or delivery information.",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <span className="w-1 h-1 bg-gray-400 rounded-full mt-2 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-display tracking-widest text-black mb-4">4. PRICING & PAYMENT</h2>
                <ul className="space-y-3 ml-4">
                  {[
                    "All prices are in Egyptian Pounds (EGP) and include applicable taxes.",
                    "We currently accept Cash on Delivery (COD) only.",
                    "You have the right to inspect your order upon delivery before completing payment.",
                    "If you refuse delivery without valid reason after confirming the order, we reserve the right to restrict future orders from your account.",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <span className="w-1 h-1 bg-gray-400 rounded-full mt-2 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-display tracking-widest text-black mb-4">5. SHIPPING & DELIVERY</h2>
                <ul className="space-y-3 ml-4">
                  {[
                    "We ship to all governorates in Egypt via Bosta.",
                    "Free shipping on orders over 1,000 EGP. A shipping fee applies to orders below 1,000 EGP, calculated based on your governorate.",
                    "Delivery times are estimates only and are not guaranteed.",
                    "We are not liable for delays caused by the shipping carrier or circumstances beyond our control.",
                    "Risk of loss and title for items pass to you upon delivery.",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <span className="w-1 h-1 bg-gray-400 rounded-full mt-2 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-display tracking-widest text-black mb-4">6. RETURNS & EXCHANGES</h2>
                <ul className="space-y-3 ml-4">
                  {[
                    "Returns are accepted within 14 days of delivery.",
                    "Items must be unworn, unwashed, and in original condition with all tags attached.",
                    "If the return is due to our error, we cover the shipping cost. Otherwise, the customer bears the cost.",
                    "Sale items may not be eligible for returns.",
                    "For full details, please refer to our Returns & Exchanges page.",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <span className="w-1 h-1 bg-gray-400 rounded-full mt-2 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-display tracking-widest text-black mb-4">7. INTELLECTUAL PROPERTY</h2>
                <p>
                  All content on this website — including text, images, logos, and designs — is the property of SEENWAYS and is protected by applicable intellectual property laws. You may not reproduce, distribute, or use any content without our express written permission.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-display tracking-widest text-black mb-4">8. LIMITATION OF LIABILITY</h2>
                <p>
                  SEENWAYS shall not be liable for any indirect, incidental, or consequential damages arising from the use of our website or products. Our total liability shall not exceed the amount paid for the order in question.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-display tracking-widest text-black mb-4">9. PROHIBITED CONDUCT</h2>
                <p className="mb-4">You agree not to:</p>
                <ul className="space-y-2 ml-4">
                  {[
                    "Place fraudulent or false orders",
                    "Use our website for any unlawful purpose",
                    "Attempt to disrupt or damage our website or systems",
                    "Impersonate any person or entity",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <span className="w-1 h-1 bg-gray-400 rounded-full mt-2 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-display tracking-widest text-black mb-4">10. CHANGES TO TERMS</h2>
                <p>
                  We reserve the right to modify these Terms and Conditions at any time. Changes will be effective immediately upon posting. Your continued use of our website after any changes constitutes your acceptance of the new terms.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-display tracking-widest text-black mb-4">11. GOVERNING LAW</h2>
                <p>
                  These Terms and Conditions are governed by the laws of the Arab Republic of Egypt. Any disputes shall be subject to the exclusive jurisdiction of the Egyptian courts.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-display tracking-widest text-black mb-4">12. CONTACT US</h2>
                <p>For any questions regarding these Terms and Conditions:</p>
                <div className="mt-4 space-y-2">
                  <p><strong className="text-black">Brand:</strong> SEENWAYS</p>
                  <p><strong className="text-black">Instagram:</strong> <a href="https://www.instagram.com/seen__ways" className="underline hover:text-black">@seen__ways</a></p>
                  <p><strong className="text-black">Facebook:</strong> <a href="https://www.facebook.com/profile.php?id=100090374707078" className="underline hover:text-black">SEENWAYS on Facebook</a></p>
                  <p><strong className="text-black">Website:</strong> seenways.com</p>
                </div>
              </div>

            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
