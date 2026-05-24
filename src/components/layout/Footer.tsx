"use client";

import React, { useState } from "react";
import { 
  Phone, 
  Mail, 
  MapPin, 
  Send, 
  Loader2, 
  Globe 
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import toast from "react-hot-toast";
import { useSettings } from "@/context/SettingsContext";

export default function Footer() {
  const { settings } = useSettings();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      toast.success(data.message || "Subscribed successfully!");
      setEmail("");
    } catch (error: any) {
      toast.error(error.message || "Failed to subscribe");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Newsletter Section */}
      <section className="bg-pickle-50 py-12 border-t border-pickle-100">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 w-full">
          <div className="max-w-2xl mx-auto text-center">
            <span className="text-pickle-600 font-bold uppercase tracking-widest text-[10px] mb-2 block">Newsletter</span>
            <h2 className="text-2xl md:text-3xl font-black text-brown-900 mb-2 tracking-tight">Join our email list</h2>
            <p className="text-brown-600 text-sm mb-6 font-medium">Get exclusive deals and early access to new products.</p>
            
            <form className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto" onSubmit={handleSubscribe}>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address" 
                className="flex-1 px-5 py-3 rounded-xl bg-white border border-pickle-200 focus:outline-none focus:ring-2 focus:ring-pickle-500/20 font-medium text-sm"
              />
              <button 
                type="submit"
                disabled={loading}
                className="bg-pickle-600 text-white font-bold px-6 py-3 rounded-xl shadow-lg shadow-pickle-600/10 hover:bg-pickle-700 transition-all flex items-center justify-center gap-2 disabled:opacity-70 text-sm"
              >
                {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />} Subscribe
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Main Footer */}
      <footer className="bg-brown-900 text-pickle-50 pt-16 pb-8 font-poppins relative overflow-hidden">
        {/* Subtle Background Pattern */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-pickle-600/5 rounded-full blur-[100px] -mr-48 -mt-48" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-pickle-600/5 rounded-full blur-[100px] -ml-48 -mb-48" />

        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 w-full relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
            
            {/* Brand Info */}
            <div className="space-y-5">
              <Link href="/" className="block active:scale-95 transition-transform">
                <Image
                  src="/images/ayzah-logo.png"
                  alt="Ayzah Pickles"
                  width={220}
                  height={70}
                  className="h-[36px] w-auto object-contain brightness-0 invert"
                />
              </Link>
              <p className="text-brown-200 text-xs leading-relaxed font-medium">
                Bringing the authentic taste of Kerala homes to your dining table. Made with love, traditional recipes, and 100% pure ingredients.
              </p>
              
              {/* Dynamic Social Links */}
              <div className="flex gap-3">
                {[
                  { key: 'instagram', href: settings?.socialLinks?.instagram, label: "Instagram" },
                  { key: 'facebook', href: settings?.socialLinks?.facebook, label: "Facebook" },
                  { key: 'twitter', href: settings?.socialLinks?.twitter, label: "Twitter" },
                  { key: 'youtube', href: settings?.socialLinks?.youtube, label: "Youtube" }
                ].map((social, i) => social.href && (
                  <a
                    key={i}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-xl bg-brown-800 flex items-center justify-center hover:bg-pickle-600 transition-all duration-500 shadow-xl border border-white/5 active:scale-90"
                    aria-label={social.label}
                  >
                    <Globe className="w-4.5 h-4.5 text-white" />
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-[9px] font-black uppercase tracking-[0.3em] mb-6 text-pickle-500">Navigation</h4>
              <ul className="space-y-3.5 text-xs text-brown-200 font-bold uppercase tracking-widest">
                <li><Link href="/" className="hover:text-pickle-400 transition-all block hover:translate-x-1.5">Home</Link></li>
                <li><Link href="/shop" className="hover:text-pickle-400 transition-all block hover:translate-x-1.5">Shop All</Link></li>
                <li><Link href="/categories" className="hover:text-pickle-400 transition-all block hover:translate-x-1.5">Collections</Link></li>
                <li><Link href="/best-sellers" className="hover:text-pickle-400 transition-all block hover:translate-x-1.5">Popular Items</Link></li>
              </ul>
            </div>

            {/* Policies */}
            <div>
              <h4 className="text-[9px] font-black uppercase tracking-[0.3em] mb-6 text-pickle-500">Customer Care</h4>
              <ul className="space-y-3.5 text-xs text-brown-200 font-bold uppercase tracking-widest">
                <li><Link href="/privacy-policy" className="hover:text-pickle-400 transition-all block hover:translate-x-1.5">Privacy Policy</Link></li>
                <li><Link href="/terms-and-conditions" className="hover:text-pickle-400 transition-all block hover:translate-x-1.5">Terms & Conds</Link></li>
                <li><Link href="/refund" className="hover:text-pickle-400 transition-all block hover:translate-x-1.5">Returns</Link></li>
                <li><Link href="/shipping" className="hover:text-pickle-400 transition-all block hover:translate-x-1.5">Delivery Info</Link></li>
              </ul>
            </div>

            {/* Contact Info */}
            <div className="space-y-6">
              <h4 className="text-[9px] font-black uppercase tracking-[0.3em] text-pickle-500">Reach Us</h4>
              <ul className="space-y-4 text-xs text-brown-200 font-bold">
                <li className="flex gap-3 items-start">
                  <MapPin size={18} className="text-pickle-500 shrink-0 mt-0.5" />
                  <span className="leading-tight">{settings?.address || "Malappuram, Kerala, India"}</span>
                </li>
                <li className="flex gap-3 items-center">
                  <Phone size={18} className="text-pickle-500 shrink-0" />
                  <span>{settings?.phone || "+91 8301 946 206"}</span>
                </li>
                <li className="flex gap-3 items-center">
                  <Mail size={18} className="text-pickle-500 shrink-0" />
                  <span className="truncate">{settings?.email || "ayzahgroup@gmail.com"}</span>
                </li>
              </ul>
              {settings?.phone && (
                <a 
                  href={`https://wa.me/${settings.phone.replace(/[^0-9]/g, '')}`} 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 bg-[#25D366] text-white px-6 py-3.5 rounded-xl font-black text-[10px] uppercase tracking-wider hover:bg-[#128C7E] transition-all shadow-xl shadow-green-900/20 active:scale-95"
                >
                  Direct WhatsApp
                </a>
              )}
            </div>

          </div>

          {/* Bottom Bar */}
          <div className="pt-6 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-[9px] font-black uppercase tracking-[0.2em] text-brown-400">
            <p>© {new Date().getFullYear()} {settings?.siteName || "Ayzah Pickle"}. All Rights Reserved.</p>
            <div className="flex items-center gap-6">
              <div className="flex gap-2">
                <span className="px-2 py-0.5 bg-white/5 rounded-md border border-white/5">UPI</span>
                <span className="px-2 py-0.5 bg-white/5 rounded-md border border-white/5">COD</span>
                <span className="px-2 py-0.5 bg-white/5 rounded-md border border-white/5">SECURE</span>
              </div>
              <p className="opacity-40">Handcrafted with ❤️</p>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
