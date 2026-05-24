"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Heart, ShoppingCart } from "lucide-react";
import { useStore } from "@/context/StoreContext";
import Link from "next/link";

export default function WishlistDrawer() {
  const { isWishlistOpen, setIsWishlistOpen, wishlist, toggleWishlist, addToCart } = useStore();

  return (
    <AnimatePresence>
      {isWishlistOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsWishlistOpen(false)}
            className="fixed inset-0 bg-brown-900/40 backdrop-blur-sm z-[60]"
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="fixed inset-y-0 right-0 w-full md:w-[400px] bg-white z-[70] shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-pickle-100 flex justify-between items-center bg-pickle-50">
              <h2 className="text-xl font-bold text-brown-900 flex items-center gap-2">
                <Heart size={20} className="text-pickle-600 fill-pickle-600" /> Your Wishlist ({wishlist.length})
              </h2>
              <button
                onClick={() => setIsWishlistOpen(false)}
                className="w-8 h-8 rounded-full bg-white text-brown-500 flex items-center justify-center hover:bg-pickle-200 hover:text-pickle-700 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Wishlist Items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {wishlist.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <div className="w-20 h-20 bg-pickle-50 rounded-full flex items-center justify-center text-pickle-300 mb-4">
                    <Heart size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-brown-900 mb-2">Your wishlist is empty</h3>
                  <p className="text-brown-500 mb-6">Save your favorite pickles here for later!</p>
                  <button
                    onClick={() => setIsWishlistOpen(false)}
                    className="bg-pickle-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-pickle-700 transition-colors"
                  >
                    Explore Flavours
                  </button>
                </div>
              ) : (
                wishlist.map((item) => (
                  <div key={item.id} className="flex gap-4 border-b border-pickle-100 pb-6 last:border-0 last:pb-0">
                    <div className="w-20 h-20 rounded-xl overflow-hidden border border-pickle-100 shrink-0 relative">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      <button 
                        onClick={() => toggleWishlist(item)}
                        className="absolute top-1 left-1 w-6 h-6 bg-white/80 backdrop-blur rounded-full flex items-center justify-center text-red-500 hover:bg-white"
                      >
                        <Heart size={12} fill="currentColor" />
                      </button>
                    </div>
                    <div className="flex-1 flex flex-col">
                      <Link href={`/product/${item.id}`} onClick={() => setIsWishlistOpen(false)}>
                        <h4 className="font-bold text-brown-900 text-sm line-clamp-2 hover:text-pickle-600 transition-colors">{item.name}</h4>
                      </Link>
                      <div className="mt-auto flex justify-between items-center">
                        <span className="font-bold text-pickle-600">₹{item.price}</span>
                        <button 
                          onClick={() => addToCart(item, 1)}
                          className="text-xs bg-pickle-100 text-pickle-700 px-3 py-1.5 rounded-lg font-bold flex items-center gap-1 hover:bg-pickle-600 hover:text-white transition-colors"
                        >
                          <ShoppingCart size={14} /> Add
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
