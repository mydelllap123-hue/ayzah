"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Search as SearchIcon, ArrowRight, History, Sparkles, ShoppingBag } from "lucide-react";
import { useStore } from "@/context/StoreContext";
import Link from "next/link";
import { products } from "@/lib/products";

export default function SearchModal() {
  const { isSearchOpen, setIsSearchOpen } = useStore();
  const [searchQuery, setSearchQuery] = useState("");

  const trendingSearches = ["Tender Mango", "Beef Pickle", "Kerala Chicken", "Spicy Garlic", "Prawn Pickle"];

  const filteredProducts = searchQuery.length > 1 
    ? products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.category.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 4)
    : [];

  return (
    <AnimatePresence>
      {isSearchOpen && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 md:p-6 font-poppins">
          {/* Blur Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => { setIsSearchOpen(false); setSearchQuery(""); }}
            className="absolute inset-0 bg-brown-950/60 backdrop-blur-md"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: "spring", duration: 0.4 }}
            className="bg-white/95 backdrop-blur-xl w-full max-w-lg md:max-w-xl rounded-2xl border border-pickle-100 shadow-[0_20px_50px_rgba(41,15,2,0.2)] flex flex-col overflow-hidden relative z-10"
          >
            
            {/* Search Input Area */}
            <div className="px-4 py-3 md:px-5 md:py-3.5 border-b border-pickle-100/60 flex items-center gap-3 relative bg-pickle-50/50">
              <SearchIcon size={18} className="text-pickle-600 shrink-0" />
              <input 
                autoFocus
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for pickles, categories..." 
                className="flex-1 bg-transparent border-none outline-none text-sm md:text-base font-medium text-brown-900 placeholder-brown-300/80 focus:ring-0"
              />
              <button 
                onClick={() => { setIsSearchOpen(false); setSearchQuery(""); }}
                className="w-7 h-7 bg-white/80 border border-pickle-100/60 rounded-full flex items-center justify-center text-brown-500 hover:text-pickle-600 shadow-sm shrink-0 hover:scale-105 active:scale-95 transition-all"
              >
                <X size={14} />
              </button>
            </div>

            {/* Suggestions & Results Area */}
            <div className="p-4 md:p-5 flex-1 overflow-y-auto max-h-[48vh] scrollbar-thin">
              
              {searchQuery.length > 1 ? (
                <div className="space-y-3">
                  <h3 className="text-[10px] font-bold text-brown-400 uppercase tracking-widest flex items-center gap-1.5">
                    <ShoppingBag size={12} className="text-pickle-600" /> Matches Found
                  </h3>
                  <div className="space-y-2">
                    {filteredProducts.length > 0 ? (
                      filteredProducts.map(p => (
                        <Link 
                          key={p.id}
                          href={`/product/${p.slug}`}
                          onClick={() => { setIsSearchOpen(false); setSearchQuery(""); }}
                          className="flex items-center gap-3 p-2 bg-white/50 border border-pickle-100/40 rounded-xl hover:border-pickle-500/50 hover:bg-white transition-all shadow-sm group"
                        >
                          <div className="w-11 h-11 bg-pickle-50 rounded-lg overflow-hidden shrink-0 border border-pickle-100/40">
                            <img src={p.image} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-brown-900 text-xs md:text-sm group-hover:text-pickle-600 transition-colors truncate">{p.name}</h4>
                            <p className="text-[10px] md:text-xs text-gray-500 font-medium">{p.category} • <span className="font-bold text-pickle-600">₹{p.price}</span></p>
                          </div>
                          <ArrowRight size={14} className="text-pickle-300 group-hover:text-pickle-600 transition-colors shrink-0 group-hover:translate-x-0.5 transition-transform" />
                        </Link>
                      ))
                    ) : (
                      <p className="text-brown-500 font-medium italic text-xs py-2">No matches found for "{searchQuery}"</p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-[10px] font-bold text-brown-400 uppercase tracking-widest mb-2.5 flex items-center gap-1.5">
                      <History size={12} className="text-pickle-500" /> Recent Searches
                    </h3>
                    <div className="flex flex-wrap gap-1.5">
                      {["Fish Pickle", "Lemon"].map(term => (
                        <button 
                          key={term} 
                          onClick={() => setSearchQuery(term)}
                          className="px-3 py-1 bg-pickle-50 hover:bg-pickle-100 text-brown-700 rounded-full text-xs font-bold transition-colors active:scale-95"
                        >
                          {term}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-[10px] font-bold text-brown-400 uppercase tracking-widest mb-2.5 flex items-center gap-1.5">
                      <Sparkles size={12} className="text-amber-500" /> Trending Now
                    </h3>
                    <div className="flex flex-wrap gap-1.5">
                      {trendingSearches.map((term, i) => (
                        <button 
                          key={i}
                          onClick={() => setSearchQuery(term)}
                          className="px-3 py-1 bg-white border border-pickle-100 text-brown-800 rounded-full text-xs font-bold hover:border-pickle-500 hover:text-pickle-600 transition-all active:scale-95 shadow-sm"
                        >
                          {term}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
