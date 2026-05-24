import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Providers } from "@/components/Providers";
import { Toaster } from "react-hot-toast";
import CartDrawer from "@/components/ui/CartDrawer";
import WishlistDrawer from "@/components/ui/WishlistDrawer";
import SearchModal from "@/components/ui/SearchModal";
import LoginModal from "@/components/ui/LoginModal";
import QuickViewModal from "@/components/ui/QuickViewModal";

export const metadata: Metadata = {
  title: "Kerala Homemade Pickles | Authentic Traditional Taste",
  description: "Premium online pickle shopping website selling authentic Kerala homemade traditional pickles. No preservatives, 100% natural ingredients.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="h-full antialiased selection:bg-pickle-500 selection:text-white"
    >
      <body className="font-sans min-h-full flex flex-col bg-pickle-50 text-brown-950">
        <Providers>
          <Toaster position="top-right" toastOptions={{ style: { background: '#fff', color: '#451a03', fontWeight: 'bold' } }} />
          <Navbar />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
          <CartDrawer />
          <WishlistDrawer />
          <SearchModal />
          <LoginModal />
          <QuickViewModal />
        </Providers>
      </body>
    </html>
  );
}

