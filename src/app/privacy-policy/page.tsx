"use client";

import React from "react";
import { motion } from "framer-motion";
import { Lock, Eye, Database, Globe } from "lucide-react";

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-white min-h-screen pt-32 pb-24 font-poppins">
      {/* Hero Header */}
      <section className="bg-pickle-50 py-20 mb-16">
        <div className="container mx-auto px-4 md:px-8 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-brown-900 mb-6 uppercase tracking-tight"
          >
            Privacy <span className="text-pickle-600">Policy</span>
          </motion.h1>
          <div className="w-24 h-1 bg-pickle-500 mx-auto rounded-full"></div>
        </div>
      </section>

      <div className="container mx-auto px-4 md:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-12">
            
            <div className="flex gap-6">
              <div className="w-12 h-12 bg-pickle-50 rounded-xl flex items-center justify-center text-pickle-600 shadow-sm shrink-0">
                <Globe size={24} />
              </div>
              <div className="prose prose-lg text-brown-800 font-medium leading-relaxed">
                <p>Ayzah Pickle operates this website and is committed to protecting your personal information.</p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="w-12 h-12 bg-pickle-50 rounded-xl flex items-center justify-center text-pickle-600 shadow-sm shrink-0">
                <Database size={24} />
              </div>
              <div className="prose prose-lg text-brown-800 font-medium leading-relaxed">
                <h3 className="text-2xl font-bold text-brown-900 mb-4">Information Collection</h3>
                <p>We collect personal details such as name, phone number, email address, and shipping address when you place an order. This information is used only to process your orders, provide customer support, and improve our services.</p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="w-12 h-12 bg-pickle-50 rounded-xl flex items-center justify-center text-pickle-600 shadow-sm shrink-0">
                <Eye size={24} />
              </div>
              <div className="prose prose-lg text-brown-800 font-medium leading-relaxed">
                <h3 className="text-2xl font-bold text-brown-900 mb-4">Data Sharing</h3>
                <p>We do not sell, trade, or share your personal information with third parties, except for trusted partners such as payment gateways and delivery services to complete your order.</p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="w-12 h-12 bg-pickle-50 rounded-xl flex items-center justify-center text-pickle-600 shadow-sm shrink-0">
                <Lock size={24} />
              </div>
              <div className="prose prose-lg text-brown-800 font-medium leading-relaxed">
                <h3 className="text-2xl font-bold text-brown-900 mb-4">Security</h3>
                <p>We use secure payment methods to ensure your data is protected.</p>
                <p className="mt-8 pt-8 border-t border-pickle-100 font-bold text-pickle-600 italic">
                  By using our website, you consent to our Privacy Policy.
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
