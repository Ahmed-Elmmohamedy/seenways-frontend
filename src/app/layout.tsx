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
      <Script src="https://www.googletagmanager.com/gtag/js?id=G-VCGF3JP7EK" strategy="afterInteractive" />
      <Script id="google-analytics" strategy="afterInteractive">{`
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'G-VCGF3JP7EK');
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
