"use client";

import React from "react";
import { products } from "@/lib/products";
import { motion } from "framer-motion";
import Link from "next/link";
import { ShoppingBag, Heart, Star, ChevronRight, Trophy } from "lucide-react";
import { useStore } from "@/context/StoreContext";

export default function BestSellersPage() {
  const { addToCart, toggleWishlist, isInWishlist } = useStore();

  // Filter products by rating and specific best seller badges
  const bestSellers = products
    .filter(p => p.rating >= 4.8 || p.badge === "Best Seller")
    .sort((a, b) => b.rating - a.rating);

  return (
    <div className="bg-pickle-50 min-h-screen pt-32 pb-16">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 w-full">
        
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-xs text-brown-600 mb-6 font-medium">
          <Link href="/" className="hover:text-pickle-600 transition-colors">Home</Link>
          <ChevronRight size={12} />
          <span className="text-brown-900 font-bold">Best Sellers</span>
        </div>

        {/* Header */}
        <div className="mb-10 text-center">
          <div className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-600 px-3 py-1.5 rounded-full text-xs font-bold mb-3 shadow-sm">
            <Trophy size={14} /> OUR MOST LOVED PICKLES
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-brown-900 mb-4 uppercase tracking-tight">Best <span className="text-pickle-500">Sellers</span></h1>
          <p className="text-brown-600 text-sm md:text-base max-w-2xl mx-auto font-medium">These are the pickles that our customers can't get enough of. Hand-picked, authentic, and perfectly spicy.</p>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {bestSellers.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-pickle-100 group flex flex-col max-w-[280px] w-full mx-auto"
            >
              <div className="relative h-[220px] overflow-hidden bg-pickle-50">
                <div className="absolute top-2.5 left-2.5 z-10 bg-pickle-600 text-white text-[8px] font-bold px-2 py-0.5 rounded-full shadow-md">
                  BEST SELLER
                </div>
                
                <div className="absolute top-2.5 right-2.5 z-10">
                  <motion.button 
                    whileTap={{ scale: 0.8 }}
                    onClick={() => toggleWishlist(product)}
                    className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors shadow-sm ${isInWishlist(product.id) ? 'bg-red-50 text-red-500' : 'bg-white/80 backdrop-blur text-brown-500 hover:bg-pickle-100 hover:text-pickle-600'}`}
                  >
                    <Heart size={14} fill={isInWishlist(product.id) ? "currentColor" : "none"} />
                  </motion.button>
                </div>

                <Link href={`/product/${product.slug}`}>
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                  />
                </Link>
              </div>

              <div className="p-3.5 flex-1 flex flex-col">
                <div className="flex items-center gap-1 text-amber-400 mb-1">
                  <Star size={12} fill="currentColor" />
                  <span className="text-[10px] text-brown-600 ml-1 font-bold">{product.rating}</span>
                </div>
                
                <Link href={`/product/${product.slug}`}>
                  <h3 className="font-bold text-brown-900 text-sm mb-0.5 line-clamp-1 hover:text-pickle-600 transition-colors cursor-pointer">{product.name}</h3>
                </Link>
                <p className="text-[10px] text-gray-500 mb-2 font-medium">{product.weight}</p>
                
                <div className="mt-auto flex justify-between items-center">
                  <span className="font-black text-base text-pickle-600">₹{product.price}</span>
                  
                  <button 
                    onClick={() => addToCart(product, 1)}
                    className="bg-pickle-100 text-pickle-700 w-8 h-8 rounded-full flex items-center justify-center hover:bg-pickle-600 hover:text-white transition-colors shadow-sm group-hover:bg-pickle-600 group-hover:text-white"
                  >
                    <ShoppingBag size={14} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
