"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Heart, ShoppingCart, Star, Flame, Minus, Plus, Zap } from "lucide-react";
import { useStore } from "@/context/StoreContext";
import { useRouter } from "next/navigation";

export default function QuickViewModal() {
  const router = useRouter();
  const { quickViewProduct, setQuickViewProduct, addToCart, toggleWishlist, isInWishlist } = useStore();
  const [quantity, setQuantity] = useState(1);

  if (!quickViewProduct) return null;

  const handleAddToCart = () => {
    addToCart(quickViewProduct, quantity);
    setQuickViewProduct(null);
    setQuantity(1);
  };

  const handleBuyNow = () => {
    addToCart(quickViewProduct, quantity);
    setQuickViewProduct(null);
    setQuantity(1);
    router.push("/checkout");
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setQuickViewProduct(null)}
        className="fixed inset-0 bg-brown-900/60 backdrop-blur-sm z-[80] p-4 flex items-center justify-center overflow-y-auto"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-3xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col md:flex-row relative my-auto max-h-[90vh]"
        >
          <button 
            onClick={() => setQuickViewProduct(null)}
            className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/80 backdrop-blur rounded-full flex items-center justify-center text-brown-500 hover:text-pickle-600 hover:bg-pickle-50 transition-colors shadow-sm"
          >
            <X size={20} />
          </button>

          {/* Image */}
          <div className="w-full md:w-1/2 bg-pickle-50 relative aspect-square md:aspect-auto h-64 md:h-auto">
            <img 
              src={quickViewProduct.images?.[0] || quickViewProduct.image} 
              alt={quickViewProduct.title || quickViewProduct.name} 
              className="w-full h-full object-cover"
            />
          </div>

          {/* Details */}
          <div className="w-full md:w-1/2 p-8 md:p-10 flex flex-col overflow-y-auto">
            <div className="flex items-center gap-2 text-amber-400 mb-3">
              <Star size={16} fill="currentColor" />
              <Star size={16} fill="currentColor" />
              <Star size={16} fill="currentColor" />
              <Star size={16} fill="currentColor" />
              <Star size={16} fill="currentColor" />
              <span className="text-sm font-bold text-brown-900 ml-1">4.8 (124)</span>
            </div>

            <h2 className="text-2xl md:text-3xl font-bold text-brown-900 mb-2 leading-tight">
              {quickViewProduct.title || quickViewProduct.name}
            </h2>
            
            <p className="text-sm text-gray-500 font-medium mb-6">
              Weight: {quickViewProduct.weight || "500g"}
            </p>

            <div className="flex items-end gap-3 mb-6">
              <span className="text-3xl font-bold text-pickle-600">₹{quickViewProduct.offerPrice || quickViewProduct.price}</span>
              {quickViewProduct.offerPrice && quickViewProduct.offerPrice < quickViewProduct.price && (
                <span className="text-lg text-gray-400 line-through mb-1">₹{quickViewProduct.price}</span>
              )}
            </div>

            <p className="text-brown-600 mb-8 leading-relaxed">
              Experience the authentic taste of Kerala with our homemade pickle. Made from fresh ingredients, marinated in traditional spices and pure sesame oil. 
            </p>

            <div className="flex items-center gap-2 mb-8 text-pickle-600 font-bold bg-pickle-50 px-4 py-2 rounded-xl self-start">
              <Flame size={18} fill="currentColor" /> Medium Hot
            </div>

            <div className="mt-auto pt-6 border-t border-pickle-100 space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                {/* Quantity */}
                <div className="flex items-center justify-between bg-white border-2 border-pickle-100 rounded-xl px-2 h-14 w-32 shrink-0">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-8 h-8 flex items-center justify-center text-brown-500 hover:text-pickle-600 transition-colors">
                    <Minus size={16} strokeWidth={2.5} />
                  </button>
                  <span className="font-bold text-lg text-brown-900">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="w-8 h-8 flex items-center justify-center text-brown-500 hover:text-pickle-600 transition-colors">
                    <Plus size={16} strokeWidth={2.5} />
                  </button>
                </div>

                {/* Wishlist */}
                <button 
                  onClick={() => toggleWishlist(quickViewProduct)}
                  className={`w-14 h-14 shrink-0 rounded-xl border-2 flex items-center justify-center transition-all ${isInWishlist(quickViewProduct._id || quickViewProduct.id || "") ? 'border-red-200 bg-red-50 text-red-500' : 'border-pickle-100 text-brown-500 hover:border-red-200 hover:text-red-500 hover:bg-red-50'}`}
                >
                  <Heart size={24} fill={isInWishlist(quickViewProduct._id || quickViewProduct.id || "") ? "currentColor" : "none"} />
                </button>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button 
                  onClick={handleAddToCart}
                  className="flex-1 bg-brown-900 text-white font-bold text-base h-14 rounded-xl flex items-center justify-center gap-2 hover:bg-brown-800 shadow-lg shadow-brown-900/20 transition-all"
                >
                  <ShoppingCart size={18} /> Add to Cart
                </button>

                <button 
                  onClick={handleBuyNow}
                  className="flex-1 bg-pickle-600 text-white font-bold text-base h-14 rounded-xl flex items-center justify-center gap-2 hover:bg-pickle-700 shadow-lg shadow-pickle-600/30 transition-all"
                >
                  <Zap size={18} fill="currentColor" /> Buy Now
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
