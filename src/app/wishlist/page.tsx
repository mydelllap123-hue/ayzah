"use client";

import React from "react";
import { useStore } from "@/context/StoreContext";
import { Heart, ShoppingBag, Trash2 } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function WishlistPage() {
  const { wishlist, toggleWishlist, addToCart } = useStore();

  return (
    <div className="bg-pickle-50 min-h-screen pt-32 pb-24">
      <div className="container mx-auto px-4 md:px-8">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex gap-2 text-sm text-brown-600 mb-4 font-medium">
            <Link href="/" className="hover:text-pickle-600">Home</Link>
            <span>/</span>
            <span className="text-brown-900">Your Wishlist</span>
          </div>
          <h1 className="text-4xl font-bold text-brown-900 mb-2 flex items-center gap-3">
            <Heart className="text-pickle-600 fill-pickle-600" size={32} /> My Wishlist
          </h1>
          <p className="text-brown-600 font-medium">{wishlist.length} items saved</p>
        </div>

        {wishlist.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl shadow-sm border border-pickle-100 flex flex-col items-center justify-center text-center">
            <div className="w-24 h-24 bg-pickle-50 rounded-full flex items-center justify-center text-pickle-300 mb-6">
              <Heart size={40} />
            </div>
            <h2 className="text-2xl font-bold text-brown-900 mb-3">Your wishlist is empty</h2>
            <p className="text-brown-500 mb-8 max-w-md">Save your favorite pickles here so you never forget them. Explore our shop to find delicious traditional flavors!</p>
            <Link href="/shop" className="bg-pickle-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-pickle-700 transition-colors shadow-lg shadow-pickle-600/30">
              Explore Flavours
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {wishlist.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-pickle-100 group flex flex-col"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-pickle-50">
                  <div className="absolute top-3 right-3 z-10">
                    <button 
                      onClick={() => toggleWishlist(item)}
                      className="w-8 h-8 bg-red-50 text-red-500 rounded-full flex items-center justify-center hover:bg-red-100 transition-colors shadow-sm"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <Link href={`/product/${item.id}`}>
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                    />
                  </Link>
                </div>

                <div className="p-5 flex-1 flex flex-col">
                  <Link href={`/product/${item.id}`}>
                    <h3 className="font-bold text-brown-900 text-lg leading-tight mb-2 hover:text-pickle-600 transition-colors cursor-pointer">{item.name}</h3>
                  </Link>
                  <p className="text-sm text-gray-500 mb-4 font-medium">{item.weight || "500g"}</p>
                  
                  <div className="mt-auto flex justify-between items-end">
                    <span className="font-bold text-2xl text-pickle-600">₹{item.price}</span>
                    
                    <button 
                      onClick={() => addToCart(item, 1)}
                      className="bg-pickle-100 text-pickle-700 font-bold px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-pickle-600 hover:text-white transition-all shadow-sm"
                    >
                      <ShoppingBag size={16} /> Add
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
