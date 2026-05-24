"use client";

import React from "react";
import { motion } from "framer-motion";
import { RefreshCcw, CheckCircle2, XCircle, Mail } from "lucide-react";

export default function RefundPolicyPage() {
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
            Refund <span className="text-pickle-600">Policy</span>
          </motion.h1>
          <div className="w-24 h-1 bg-pickle-500 mx-auto rounded-full"></div>
        </div>
      </section>

      <div className="container mx-auto px-4 md:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="prose prose-lg text-brown-800 font-medium leading-relaxed mb-12">
            <p className="text-xl">At Ayzah Pickle, we ensure quality in every product. However, refunds or replacements are applicable under the following conditions:</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {/* Eligible */}
            <div className="bg-green-50 p-8 rounded-3xl border border-green-100">
              <div className="flex items-center gap-3 mb-6 text-green-700">
                <CheckCircle2 size={24} />
                <h3 className="text-2xl font-bold">Eligible</h3>
              </div>
              <ul className="space-y-4">
                <li className="flex gap-3 text-brown-800 font-medium">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2.5 shrink-0"></span>
                  Damaged product during delivery
                </li>
                <li className="flex gap-3 text-brown-800 font-medium">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2.5 shrink-0"></span>
                  Wrong product delivered
                </li>
              </ul>
            </div>

            {/* Not Eligible */}
            <div className="bg-red-50 p-8 rounded-3xl border border-red-100">
              <div className="flex items-center gap-3 mb-6 text-red-700">
                <XCircle size={24} />
                <h3 className="text-2xl font-bold">Not Eligible</h3>
              </div>
              <ul className="space-y-4">
                <li className="flex gap-3 text-brown-800 font-medium">
                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2.5 shrink-0"></span>
                  Change of mind after delivery
                </li>
                <li className="flex gap-3 text-brown-800 font-medium">
                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2.5 shrink-0"></span>
                  Opened or used products
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-pickle-50 p-10 rounded-[40px] border border-pickle-100 shadow-sm text-center">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-pickle-600 mx-auto mb-6 shadow-sm">
              <Mail size={32} />
            </div>
            <h3 className="text-3xl font-bold text-brown-900 mb-4">To request a refund</h3>
            <div className="max-w-md mx-auto space-y-4 text-brown-700 font-medium mb-8">
              <p>Contact us within <span className="text-pickle-600 font-bold">48 hours</span> of delivery</p>
              <p>Share order details and product photos</p>
            </div>
            <p className="text-lg font-bold text-brown-900">After verification, we will process a replacement or refund.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
