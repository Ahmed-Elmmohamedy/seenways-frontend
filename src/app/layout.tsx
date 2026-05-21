import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import CartDrawer from "@/components/layout/CartDrawer";

export const metadata: Metadata = {
  title: { default: "SEENWAYS | Modern Menswear", template: "%s | SEENWAYS" },
  description: "Premium menswear collection. Minimal pieces, maximum presence.",
  keywords: ["menswear", "fashion", "SEENWAYS", "ملابس رجالي", "موضة"],
  openGraph: {
    title: "SEENWAYS | Modern Menswear",
    description: "Premium menswear collection.",
    url: "https://seenways.com",
    siteName: "SEENWAYS",
    locale: "ar_EG",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
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
