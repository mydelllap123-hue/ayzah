"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, ShoppingBag, ArrowRight, ShoppingCart } from "lucide-react";
import { useStore } from "@/context/StoreContext";
import Link from "next/link";

export default function CartDrawer() {
  const { isCartOpen, setIsCartOpen, cart, updateQuantity, removeFromCart, cartTotal } = useStore();

  const handleUpdateQuantity = (id: string | number, current: number, delta: number) => {
    const newQty = current + delta;
    if (newQty >= 1) {
      updateQuantity(id, newQty);
    }
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 bg-brown-900/60 backdrop-blur-sm z-[60]"
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 w-full md:w-[450px] bg-white z-[70] shadow-[0_0_50px_rgba(0,0,0,0.3)] flex flex-col font-poppins"
          >
            {/* Header */}
            <div className="p-8 border-b border-pickle-100 flex justify-between items-center bg-white sticky top-0 z-10">
              <div>
                <h2 className="text-2xl font-black text-brown-900 flex items-center gap-3">
                  <ShoppingCart size={24} className="text-pickle-600" /> Cart <span className="text-pickle-500 font-medium">({cart.length})</span>
                </h2>
                <p className="text-[10px] font-black text-brown-400 uppercase tracking-widest mt-1">Review your selections</p>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="w-12 h-12 rounded-full bg-pickle-50 text-brown-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all shadow-sm"
              >
                <X size={24} />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <div className="w-24 h-24 bg-pickle-50 rounded-full flex items-center justify-center text-pickle-200 mb-6">
                    <ShoppingCart size={48} />
                  </div>
                  <h3 className="text-2xl font-black text-brown-900 mb-3">Your cart is empty</h3>
                  <p className="text-brown-500 mb-10 font-medium px-10">Looks like you haven't added any delicious pickles yet!</p>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="bg-pickle-600 text-white px-10 py-4 rounded-2xl font-black shadow-xl shadow-pickle-600/20 hover:bg-pickle-700 transition-all"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <AnimatePresence mode="popLayout">
                  {cart.map((item) => {
                    const itemId = item._id || item.id || "";
                    const itemPrice = item.offerPrice || item.price;
                    const itemImage = (item.images && item.images[0]) || item.image || "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?q=80&w=1470&auto=format&fit=crop";

                    return (
                      <motion.div 
                        key={itemId} 
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="flex gap-5 group"
                      >
                        <div className="w-24 h-24 rounded-2xl overflow-hidden border border-pickle-100 shrink-0 bg-pickle-50">
                          <img 
                            src={itemImage} 
                            alt={item.title || item.name} 
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                          />
                        </div>
                        <div className="flex-1 flex flex-col justify-center">
                          <div className="flex justify-between items-start mb-1">
                            <h4 className="font-black text-brown-900 text-base leading-tight line-clamp-1">{item.title || item.name}</h4>
                            <button 
                              onClick={() => removeFromCart(itemId)} 
                              className="text-brown-300 hover:text-red-500 transition-colors"
                            >
                              <X size={18} />
                            </button>
                          </div>
                          <p className="text-[10px] font-black text-brown-400 uppercase tracking-widest mb-3">
                            {item.weight || '500g'}
                          </p>
                          <div className="mt-auto flex justify-between items-center">
                            <div className="flex items-center bg-pickle-50 rounded-xl px-3 py-1.5 gap-4 border border-pickle-100">
                              <button 
                                disabled={(item.quantity || 1) <= 1}
                                onClick={() => handleUpdateQuantity(itemId, item.quantity || 1, -1)} 
                                className="text-pickle-600 hover:text-pickle-800 disabled:opacity-30"
                              >
                                <Minus size={16} strokeWidth={3} />
                              </button>
                              <span className="text-sm font-black text-brown-900 w-4 text-center">{item.quantity}</span>
                              <button 
                                onClick={() => handleUpdateQuantity(itemId, item.quantity || 1, 1)} 
                                className="text-pickle-600 hover:text-pickle-800"
                              >
                                <Plus size={16} strokeWidth={3} />
                              </button>
                            </div>
                            <span className="font-black text-pickle-600 text-lg">₹{itemPrice * (item.quantity || 1)}</span>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              )}
            </div>

            {/* Footer */}
            {cart.length > 0 && (
              <div className="p-8 bg-pickle-50/50 border-t border-pickle-100 space-y-6">
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-brown-600 font-bold">
                    <span>Subtotal</span>
                    <span className="text-brown-900 font-black">₹{cartTotal}</span>
                  </div>
                  <div className="flex justify-between items-center text-brown-600 font-bold">
                    <span>Shipping</span>
                    <span className="text-green-600 font-black uppercase text-[10px] tracking-widest">Free Delivery</span>
                  </div>
                  <div className="pt-4 border-t border-pickle-100 flex justify-between items-center text-xl font-black text-brown-900">
                    <span className="uppercase tracking-tighter">Total</span>
                    <span className="text-pickle-600 text-3xl">₹{cartTotal}</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <Link 
                    href="/cart" 
                    onClick={() => setIsCartOpen(false)} 
                    className="bg-white border-2 border-pickle-100 text-brown-900 py-4 rounded-2xl font-black text-center hover:bg-pickle-50 transition-all flex items-center justify-center gap-2"
                  >
                    View Cart
                  </Link>
                  <Link 
                    href="/checkout" 
                    onClick={() => setIsCartOpen(false)} 
                    className="bg-pickle-600 text-white py-4 rounded-2xl font-black text-center hover:bg-pickle-700 transition-all shadow-xl shadow-pickle-600/20 flex items-center justify-center gap-2 group"
                  >
                    Checkout <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

