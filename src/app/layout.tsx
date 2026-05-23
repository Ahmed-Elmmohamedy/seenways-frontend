import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import CartDrawer from "@/components/layout/CartDrawer";

export const metadata: Metadata = {
  title: { default: "SEENWAYS | Modern Menswear", template: "%s | SEENWAYS" },
  description: "Premium menswear collection. Minimal pieces, maximum presence.",
  keywords: ["menswear", "fashion", "SEENWAYS", "ملابس رجالي", "موضة"],
  icons: {
    icon: "https://qxkevpcrzpywtalzctsz.supabase.co/storage/v1/object/public/seenways-images/icon-black.png",
    apple: "https://qxkevpcrzpywtalzctsz.supabase.co/storage/v1/object/public/seenways-images/icon-black.png",
  },
  openGraph: {
    title: "SEENWAYS | Modern Menswear",
    description: "Premium menswear collection.",
    url: "https://seenways.com",
    siteName: "SEENWAYS",
    locale: "ar_EG",
    type: "website",
    images: ["https://qxkevpcrzpywtalzctsz.supabase.co/storage/v1/object/public/seenways-images/logo-black-hq.png"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      {/* Google Analytics */}
      <Script src="https://www.googletagmanager.com/gtag/js?id=G-VCGF3JP7EK" strategy="afterInteractive" />
      <Script id="google-analytics" strategy="afterInteractive">{`
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'G-VCGF3JP7EK');
      `}</Script>

      {/* Meta Pixel */}
      <Script id="meta-pixel" strategy="afterInteractive">{`
        !function(f,b,e,v,n,t,s)
        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s)}(window, document,'script',
        'https://connect.facebook.net/en_US/fbevents.js');
        fbq('init', '875798924620131');
        fbq('track', 'PageView');
      `}</Script>
      <body>
        {children}
        <CartDrawer />
        <Toaster position="top-center" toastOptions={{
          duration: 3000,
          style: { background: "#000", color: "#fff", fontFamily: "'Inter', sans-serif", fontSize: "13px", letterSpacing: "0.05em" },
        }} />
      </body>
    </html>
  );
}
