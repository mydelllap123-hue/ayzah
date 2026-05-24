"use client";

import React from "react";
import { useStore } from "@/context/StoreContext";
import { Trash2, ShoppingBag, ArrowRight, Minus, Plus, ShoppingCart, Loader2 } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, cartTotal } = useStore();

  const handleUpdateQuantity = (id: string | number, current: number, delta: number) => {
    const newQty = current + delta;
    if (newQty >= 1) {
      updateQuantity(id, newQty);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen pt-40 pb-24 bg-pickle-50 flex items-center justify-center font-poppins">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center px-4 bg-white p-12 md:p-16 rounded-[3rem] shadow-sm border border-pickle-100 max-w-lg w-full mx-4"
        >
          <div className="w-24 h-24 bg-pickle-50 rounded-full flex items-center justify-center mx-auto mb-8 text-pickle-600">
            <ShoppingCart size={48} />
          </div>
          <h1 className="text-3xl font-black text-brown-900 mb-4">Your Cart is Empty</h1>
          <p className="text-brown-600 mb-10 font-medium">Looks like you haven't added any delicious pickles to your cart yet.</p>
          <Link href="/shop" className="bg-pickle-600 text-white px-10 py-5 rounded-2xl font-black shadow-xl shadow-pickle-600/20 hover:bg-pickle-700 transition-all inline-flex items-center gap-2 group">
            Start Shopping <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-24 bg-pickle-50 font-poppins">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex items-center gap-4 mb-10">
          <div className="w-12 h-12 bg-pickle-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-pickle-600/20">
            <ShoppingBag size={24} />
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-brown-900 tracking-tight">Shopping <span className="text-pickle-600">Cart</span></h1>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Cart Items */}
          <div className="flex-1 space-y-6">
            <AnimatePresence mode="popLayout">
              {cart.map((item) => {
                const itemId = item._id || item.id || "";
                const itemPrice = item.offerPrice || item.price;
                const itemImage = (item.images && item.images[0]) || item.image || "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?q=80&w=1470&auto=format&fit=crop";

                return (
                  <motion.div
                    key={itemId}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -100, scale: 0.9 }}
                    className="bg-white p-5 md:p-8 rounded-[2.5rem] shadow-sm border border-pickle-100 flex flex-col sm:flex-row gap-6 items-center group relative"
                  >
                    <div className="w-full sm:w-32 h-32 rounded-2xl overflow-hidden bg-pickle-50 shrink-0 border border-pickle-100">
                      <img 
                        src={itemImage} 
                        alt={item.title || item.name} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                      />
                    </div>
                    
                    <div className="flex-1 min-w-0 w-full">
                      <div className="flex justify-between items-start gap-4 mb-2">
                        <div>
                          <h3 className="text-xl font-black text-brown-900 group-hover:text-pickle-600 transition-colors truncate">
                            {item.title || item.name}
                          </h3>
                          <p className="text-sm text-brown-500 font-bold uppercase tracking-widest mt-1">
                            {item.weight || '500g'} • Traditional Recipe
                          </p>
                        </div>
                        <button 
                          onClick={() => removeFromCart(itemId)}
                          className="w-10 h-10 bg-red-50 text-red-500 rounded-full flex items-center justify-center hover:bg-red-500 hover:text-white transition-all shrink-0 shadow-sm"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                      
                      <div className="flex flex-wrap justify-between items-end mt-6 gap-4">
                        <div className="flex items-center gap-6 bg-pickle-50 px-5 py-2.5 rounded-2xl border border-pickle-100">
                          <button 
                            disabled={(item.quantity || 1) <= 1}
                            onClick={() => handleUpdateQuantity(itemId, item.quantity || 1, -1)}
                            className="text-pickle-600 hover:text-pickle-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                          >
                            <Minus size={20} strokeWidth={3} />
                          </button>
                          <span className="font-black text-xl text-brown-900 w-6 text-center">{item.quantity}</span>
                          <button 
                            onClick={() => handleUpdateQuantity(itemId, item.quantity || 1, 1)}
                            className="text-pickle-600 hover:text-pickle-800 transition-all"
                          >
                            <Plus size={20} strokeWidth={3} />
                          </button>
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-bold text-brown-400 uppercase tracking-widest mb-1">Subtotal</p>
                          <span className="text-2xl font-black text-pickle-600">₹{itemPrice * (item.quantity || 1)}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Order Summary */}
          <div className="w-full lg:w-[420px] shrink-0">
            <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-pickle-100 sticky top-32">
              <h2 className="text-2xl font-black text-brown-900 mb-8 tracking-tight">Order Summary</h2>
              
              <div className="space-y-6 mb-10">
                <div className="flex justify-between text-brown-600 font-bold">
                  <span>Cart Items ({cart.reduce((a, b) => a + (b.quantity || 1), 0)})</span>
                  <span className="text-brown-900 font-black">₹{cartTotal}</span>
                </div>
                <div className="flex justify-between text-brown-600 font-bold">
                  <span>Shipping</span>
                  <span className="text-green-600 font-black uppercase text-xs tracking-widest">Free Delivery</span>
                </div>
                <div className="h-px bg-pickle-100"></div>
                <div className="flex justify-between text-3xl font-black text-brown-900 pt-2">
                  <span className="uppercase tracking-tighter">Total</span>
                  <span className="text-pickle-600">₹{cartTotal}</span>
                </div>
              </div>

              <div className="space-y-4">
                <Link 
                  href="/checkout"
                  className="w-full bg-pickle-600 text-white py-5 rounded-2xl font-black text-xl hover:bg-pickle-700 shadow-2xl shadow-pickle-600/30 transition-all flex items-center justify-center gap-3 group active:scale-95"
                >
                  Checkout Now
                  <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform" />
                </Link>
                
                <Link 
                  href="/shop"
                  className="w-full bg-pickle-50 text-pickle-600 py-5 rounded-2xl font-black text-lg hover:bg-pickle-100 transition-all flex items-center justify-center gap-2"
                >
                  Continue Shopping
                </Link>
              </div>

              <div className="mt-8 pt-8 border-t border-pickle-100">
                <div className="flex items-center gap-4 text-brown-400 font-bold text-xs uppercase tracking-widest justify-center">
                  <Loader2 className="animate-spin text-pickle-600" size={16} />
                  Safe & Secure Checkout
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

