"use client";

import React from "react";
import { motion } from "framer-motion";
import { Mail } from "lucide-react";

export default function Newsletter() {
  return (
    <section className="py-24 bg-pickle-50 border-t border-pickle-100">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto bg-white rounded-[2.5rem] p-10 md:p-16 shadow-xl border border-pickle-100 relative overflow-hidden text-center">
          {/* Decorative shapes */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-pickle-100 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-leaf-500/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2"></div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative z-10"
          >
            <div className="w-16 h-16 bg-pickle-50 text-pickle-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Mail size={28} />
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold text-brown-900 mb-4">
              Join Our Foodie Family
            </h2>
            
            <p className="text-brown-600 max-w-lg mx-auto mb-10 text-lg">
              Subscribe to get special offers, free giveaways, and traditional recipes delivered directly to your inbox.
            </p>
            
            <form className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
              <input 
                type="email" 
                placeholder="Enter your email address" 
                className="flex-1 bg-pickle-50 border border-pickle-200 text-brown-900 px-6 py-4 rounded-xl focus:outline-none focus:border-pickle-500 focus:ring-2 focus:ring-pickle-200 transition-all font-medium"
                required
              />
              <button 
                type="submit" 
                className="bg-pickle-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-pickle-700 transition-colors shadow-lg shadow-pickle-600/20 whitespace-nowrap"
              >
                Subscribe Now
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
