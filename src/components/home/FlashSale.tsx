"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Timer, ShoppingBag } from "lucide-react";

export default function FlashSale() {
  const [timeLeft, setTimeLeft] = useState({
    days: 2,
    hours: 12,
    minutes: 45,
    seconds: 30
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        if (prev.days > 0) return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 w-full">
        <div className="relative rounded-3xl overflow-hidden bg-pickle-600 shadow-xl flex flex-col md:flex-row items-center">
          {/* Decorative shapes */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-pickle-500 rounded-full blur-3xl opacity-50 translate-x-1/3 -translate-y-1/3 pointer-events-none"></div>
          
          <div className="w-full md:w-1/2 p-8 md:p-12 relative z-10 text-white">
            <span className="inline-block bg-white/20 px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest mb-4">
              Festival Special Offer
            </span>
            
            <h2 className="text-2xl md:text-3xl font-black mb-4 leading-tight uppercase tracking-tight">
              Mega Family Combo Pack
            </h2>
            
            <p className="text-pickle-100 text-xs md:text-sm mb-6 max-w-md font-medium leading-relaxed">
              Get our top 5 best-selling pickles in a beautiful traditional wooden box. Perfect for gifting or family gatherings!
            </p>

            <div className="flex gap-3 mb-6">
              <div className="bg-white/10 backdrop-blur rounded-lg p-2 text-center min-w-[56px] border border-white/20">
                <span className="block text-xl font-bold">{timeLeft.days}</span>
                <span className="text-[9px] uppercase text-pickle-100">Days</span>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-lg p-2 text-center min-w-[56px] border border-white/20">
                <span className="block text-xl font-bold">{timeLeft.hours.toString().padStart(2, '0')}</span>
                <span className="text-[9px] uppercase text-pickle-100">Hrs</span>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-lg p-2 text-center min-w-[56px] border border-white/20">
                <span className="block text-xl font-bold">{timeLeft.minutes.toString().padStart(2, '0')}</span>
                <span className="text-[9px] uppercase text-pickle-100">Mins</span>
              </div>
              <div className="bg-white text-pickle-600 rounded-lg p-2 text-center min-w-[56px] shadow-md">
                <span className="block text-xl font-bold">{timeLeft.seconds.toString().padStart(2, '0')}</span>
                <span className="text-[9px] uppercase font-bold">Secs</span>
              </div>
            </div>

            <div className="flex items-center gap-5">
              <div className="flex flex-col">
                <span className="text-white/60 line-through text-xs font-bold">₹1500</span>
                <span className="text-2xl font-black text-white leading-none">₹999</span>
              </div>
              <button className="bg-white text-pickle-600 px-6 py-3.5 rounded-xl font-black flex items-center gap-2 hover:bg-pickle-50 transition-all text-xs tracking-wider shadow-lg active:scale-95">
                <ShoppingBag size={16} /> Claim Offer
              </button>
            </div>
          </div>
          
          <div className="w-full md:w-1/2 h-64 md:h-full min-h-[300px] relative">
            <img 
              src="https://images.unsplash.com/photo-1541535882672-13eb287e0b51?q=80&w=1384&auto=format&fit=crop" 
              alt="Pickle Combo Offer" 
              className="absolute inset-0 w-full h-full object-cover"
            />
            {/* Gradient overlay for blending */}
            <div className="absolute inset-0 bg-gradient-to-r from-pickle-600 via-pickle-600/50 to-transparent hidden md:block"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-pickle-600 via-transparent to-transparent md:hidden"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
