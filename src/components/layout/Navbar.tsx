"use client";

import React, { useState, useEffect } from "react";
import { Search, ShoppingBag, Heart, User, Menu, X, Phone, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useStore } from "@/context/StoreContext";
import { useSettings } from "@/context/SettingsContext";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const { data: session } = useSession();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const pathname = usePathname();
  
  const { cart, wishlist, setIsCartOpen, setIsWishlistOpen, setIsLoginOpen, setIsSearchOpen } = useStore();
  const [localUser, setLocalUser] = useState<any>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/categories");
        const result = await res.json();
        if (result.success && Array.isArray(result.data)) {
          setCategories(result.data);
        }
      } catch (error) {
        console.error("Navbar: Failed to fetch categories", error);
      }
    };
    fetchCategories();

    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        setLocalUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem("user");
      }
    }
  }, []);

  const activeUser = session?.user || localUser;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSignOut = async () => {
    if (session) {
      await signOut({ callbackUrl: "/" });
    } else {
      localStorage.removeItem("user");
      setLocalUser(null);
    }
  };

  const navLinks = [
    { name: "home", href: "/" },
    { name: "shop", href: "/shop" },
    { 
      name: "collections", 
      href: "/categories",
      dropdown: [
        { name: "veg pickles", href: "/collections/veg" },
        { name: "non-veg pickles", href: "/collections/non-veg" }
      ]
    },
    { name: "best sellers", href: "/best-sellers" },
    { name: "contact", href: "/contact" },
  ];

  const { settings } = useSettings();

  return (
    <>
      {/* Top Bar */}
      <div className="bg-pickle-600 text-white py-2 px-4 text-[10px] font-black uppercase tracking-[0.2em] flex justify-between items-center z-50 relative">
        <div className="hidden md:flex gap-4 items-center">
          <Phone size={12} /> WhatsApp: {settings?.phone || "+91 98765 43210"}
        </div>
        <div className="w-full md:w-auto text-center">
          {settings?.siteName || "Ayzah Pickles"} • 100% Homemade & Authentic
        </div>
        <div className="hidden md:flex gap-6">
          <Link href="/track-order" className="hover:text-pickle-200 transition-all">Track Order</Link>
          <Link href="/help" className="hover:text-pickle-200 transition-all">Support</Link>
        </div>
      </div>

      <header
        className={`fixed w-full z-40 transition-all duration-500 ease-in-out border-b ${
          isScrolled
            ? "bg-white/90 backdrop-blur-xl border-pickle-100 py-2.5 top-0 shadow-xl shadow-brown-900/5"
            : "bg-white border-transparent py-3.5 top-8"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 w-full flex justify-between items-center">
          {/* Mobile Menu Trigger */}
          <button
            className="md:hidden text-brown-900 hover:text-pickle-600 transition-all active:scale-90"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu size={22} strokeWidth={2.5} />
          </button>

          {/* Logo */}
          <Link href="/" className="z-50 relative block active:scale-95 transition-transform">
            <Image
              src="/images/ayzah-logo.png"
              alt="Ayzah Pickles"
              width={220}
              height={70}
              priority
              className="h-[34px] md:h-[42px] w-auto object-contain"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex gap-6 md:gap-8 font-poppins text-sm font-medium text-brown-900 lowercase">
            {navLinks.map((item) => {
              const isActive = pathname === item.href;
              
              return (
                <div key={item.name} className="relative group">
                  <Link
                    href={item.href}
                    className={`flex items-center gap-1 transition-all duration-300 ${isActive ? 'text-orange-500 font-bold' : 'hover:text-orange-500 text-brown-700'}`}
                  >
                    {item.name}
                    {item.dropdown && item.dropdown.length > 0 && <ChevronDown size={12} className="group-hover:rotate-180 transition-transform duration-500 opacity-70" />}
                    <span className={`absolute -bottom-1 left-0 h-[2px] bg-orange-500 transition-all duration-500 ${isActive ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
                  </Link>

                  {/* Desktop Dropdown */}
                  {item.dropdown && item.dropdown.length > 0 && (
                    <div className="absolute top-full left-0 pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-500 translate-y-2 group-hover:translate-y-0 z-50">
                      <div className="bg-white border border-pickle-100 rounded-2xl p-4 shadow-2xl min-w-[200px] border border-pickle-50">
                        <div className="grid gap-2.5">
                          {item.dropdown.map(dropItem => (
                            <Link 
                              key={dropItem.name} 
                              href={dropItem.href}
                              className="text-xs font-medium text-brown-500 hover:text-orange-500 hover:translate-x-1 transition-all block border-b border-pickle-50 pb-2 last:border-0 last:pb-0 font-poppins lowercase"
                            >
                              {dropItem.name}
                            </Link>
                          ))}
                          <Link href="/categories" className="text-orange-500 font-bold text-[11px] hover:underline mt-1 font-poppins lowercase">view all collections</Link>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Action Icons */}
          <div className="flex items-center gap-3.5 md:gap-5 text-brown-900 z-50">
            <button onClick={() => setIsSearchOpen(true)} className="hidden md:block hover:text-pickle-600 transition-all hover:scale-110 active:scale-90">
              <Search size={20} strokeWidth={2.2} />
            </button>
            
            {activeUser ? (
              <div className="hidden md:flex items-center gap-3">
                <div className="flex flex-col items-end">
                  <span className="text-[8px] font-black text-pickle-600 uppercase tracking-widest leading-none mb-1">Account</span>
                  <span className="text-[10px] font-black text-brown-900 truncate max-w-[110px] uppercase leading-none">{activeUser.name || "User"}</span>
                </div>
                <button 
                  onClick={handleSignOut}
                  className="w-8 h-8 bg-pickle-50 rounded-xl flex items-center justify-center text-pickle-600 hover:bg-red-500 hover:text-white transition-all shadow-sm active:scale-90"
                >
                  <X size={14} strokeWidth={3} />
                </button>
              </div>
            ) : (
              <button onClick={() => setIsLoginOpen(true)} className="hidden md:block hover:text-pickle-600 transition-all hover:scale-110 active:scale-90">
                <User size={20} strokeWidth={2.2} />
              </button>
            )}
            
            <div className="flex items-center gap-2.5">
              <button onClick={() => setIsWishlistOpen(true)} className="hover:text-pickle-600 transition-all relative group active:scale-90">
                <Heart size={20} strokeWidth={2.2} className="group-hover:fill-pickle-100" />
                {wishlist.length > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-pickle-600 text-white text-[8px] w-4.5 h-4.5 flex items-center justify-center rounded-md font-black shadow-lg shadow-pickle-600/20">
                    {wishlist.length}
                  </span>
                )}
              </button>
              <button onClick={() => setIsCartOpen(true)} className="hover:text-pickle-600 transition-all relative group active:scale-90">
                <ShoppingBag size={20} strokeWidth={2.2} className="group-hover:fill-pickle-100" />
                {cart.length > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-brown-900 text-white text-[8px] w-4.5 h-4.5 flex items-center justify-center rounded-md font-black shadow-lg shadow-brown-900/20">
                    {cart.length}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setMobileMenuOpen(false)} className="fixed inset-0 bg-brown-900/60 backdrop-blur-md z-[60] md:hidden" />
            <motion.div initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }} transition={{ type: "spring", damping: 30, stiffness: 300 }} className="fixed inset-y-0 left-0 w-[300px] bg-white z-[70] pt-24 px-8 flex flex-col gap-6 md:hidden shadow-2xl border-r border-pickle-100">
              <button className="absolute top-8 right-8 text-brown-500 hover:text-red-500 transition-all active:scale-90" onClick={() => setMobileMenuOpen(false)}>
                <X size={28} strokeWidth={3} />
              </button>
              
              <Link href="/" onClick={() => setMobileMenuOpen(false)} className="mb-6 block active:scale-95 transition-transform">
                <Image
                  src="/images/ayzah-logo.png"
                  alt="Ayzah Pickles"
                  width={220}
                  height={70}
                  className="h-[34px] w-auto object-contain"
                />
              </Link>

              {navLinks.map((item) => (
                <div key={item.name} className="space-y-3">
                  <Link 
                    href={item.href} 
                    onClick={() => setMobileMenuOpen(false)} 
                    className={`text-lg font-medium font-poppins flex items-center justify-between lowercase transition-all duration-300 ${pathname === item.href ? 'text-orange-500 font-bold' : 'text-brown-800 hover:text-orange-500'}`}
                  >
                    {item.name}
                  </Link>
                  {item.dropdown && item.dropdown.length > 0 && (
                    <div className="pl-4 grid gap-3 border-l border-pickle-100">
                      {item.dropdown.map(drop => (
                        <Link 
                          key={drop.name} 
                          href={drop.href} 
                          onClick={() => setMobileMenuOpen(false)} 
                          className="text-xs font-normal text-brown-500 hover:text-orange-500 font-poppins lowercase transition-colors"
                        >
                          {drop.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              
              <div className="mt-auto pb-12 grid grid-cols-2 gap-4">
                <button onClick={() => { setIsLoginOpen(true); setMobileMenuOpen(false); }} className="bg-pickle-50 text-pickle-600 py-4 rounded-2xl flex flex-col items-center gap-2 font-black text-[10px] uppercase tracking-widest shadow-sm">
                  <User size={24} strokeWidth={2.5} /> Account
                </button>
                <button onClick={() => { setIsSearchOpen(true); setMobileMenuOpen(false); }} className="bg-pickle-50 text-pickle-600 py-4 rounded-2xl flex flex-col items-center gap-2 font-black text-[10px] uppercase tracking-widest shadow-sm">
                  <Search size={24} strokeWidth={2.5} /> Search
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
