import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | SEENWAYS",
};

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main className="pt-20" dir="ltr">
        {/* Hero */}
        <section className="py-20 bg-black text-white">
          <div className="container">
            <p className="text-xs tracking-[0.5em] uppercase text-white/40 mb-4">LEGAL</p>
            <h1 className="text-6xl md:text-8xl font-display leading-none">PRIVACY<br />POLICY</h1>
            <p className="text-white/40 text-xs tracking-widest mt-6">Last updated: January 2026</p>
          </div>
        </section>

        {/* Content */}
        <section className="py-16 md:py-24">
          <div className="container max-w-3xl">
            <div className="space-y-12 text-sm text-gray-500 leading-relaxed">

              <div>
                <h2 className="text-2xl font-display tracking-widest text-black mb-4">1. INTRODUCTION</h2>
                <p>
                  Welcome to SEENWAYS. We are committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you visit our website seenways.com or make a purchase from us.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-display tracking-widest text-black mb-4">2. INFORMATION WE COLLECT</h2>
                <p className="mb-4">When you place an order or interact with our website, we may collect the following information:</p>
                <ul className="space-y-2 ml-4">
                  {[
                    "Full name",
                    "Phone number",
                    "Delivery address (governorate, city, street)",
                    "Email address (for order confirmation and marketing, if you opt in)",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <span className="w-1 h-1 bg-gray-400 rounded-full mt-2 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                <p className="mt-4">
                  We do not collect payment information as all transactions are cash on delivery.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-display tracking-widest text-black mb-4">3. HOW WE USE YOUR INFORMATION</h2>
                <p className="mb-4">We use the information we collect to:</p>
                <ul className="space-y-2 ml-4">
                  {[
                    "Process and fulfill your orders",
                    "Send order confirmation and updates via email or phone",
                    "Contact you regarding your delivery",
                    "Send promotional emails and newsletters (only if you have subscribed)",
                    "Improve our website and customer experience",
                    "Prevent fraudulent orders",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <span className="w-1 h-1 bg-gray-400 rounded-full mt-2 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-display tracking-widests text-black mb-4">4. ANALYTICS & TRACKING</h2>
                <p className="mb-4">
                  We use the following tools to understand how visitors interact with our website:
                </p>
                <ul className="space-y-3 ml-4">
                  <li className="flex items-start gap-3">
                    <span className="w-1 h-1 bg-gray-400 rounded-full mt-2 flex-shrink-0" />
                    <span><strong className="text-black">Google Analytics:</strong> Helps us analyze website traffic and user behavior. Google may collect data such as your IP address, browser type, and pages visited. You can opt out via Google's opt-out tool.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-1 h-1 bg-gray-400 rounded-full mt-2 flex-shrink-0" />
                    <span><strong className="text-black">Meta Pixel (Facebook):</strong> We use Meta Pixel to measure the effectiveness of our advertising and to show you relevant ads on Facebook and Instagram. Meta may collect browsing data in accordance with their own privacy policy.</span>
                  </li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-display tracking-widests text-black mb-4">5. SHARING YOUR INFORMATION</h2>
                <p className="mb-4">We do not sell or rent your personal information. We may share your data with:</p>
                <ul className="space-y-2 ml-4">
                  {[
                    "Bosta (our shipping partner) — to fulfill and deliver your orders",
                    "Service providers who assist us in operating our website",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <span className="w-1 h-1 bg-gray-400 rounded-full mt-2 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                <p className="mt-4">All third parties are required to keep your information confidential.</p>
              </div>

              <div>
                <h2 className="text-2xl font-display tracking-widests text-black mb-4">6. DATA RETENTION</h2>
                <p>
                  We retain your personal information for as long as necessary to fulfill the purposes outlined in this policy, including processing orders and handling returns. You may request deletion of your data at any time by contacting us.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-display tracking-widests text-black mb-4">7. YOUR RIGHTS</h2>
                <p className="mb-4">You have the right to:</p>
                <ul className="space-y-2 ml-4">
                  {[
                    "Access the personal data we hold about you",
                    "Request correction of inaccurate data",
                    "Request deletion of your personal data",
                    "Unsubscribe from marketing emails at any time",
                    "Opt out of tracking and analytics",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <span className="w-1 h-1 bg-gray-400 rounded-full mt-2 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-display tracking-widests text-black mb-4">8. COOKIES</h2>
                <p>
                  Our website uses cookies to improve your browsing experience, remember your preferences, and analyze site traffic. By continuing to use our website, you consent to our use of cookies. You can control cookie settings through your browser.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-display tracking-widests text-black mb-4">9. CHANGES TO THIS POLICY</h2>
                <p>
                  We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated date. We encourage you to review this policy periodically.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-display tracking-widests text-black mb-4">10. CONTACT US</h2>
                <p>If you have any questions about this Privacy Policy, please contact us:</p>
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
