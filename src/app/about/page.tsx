"use client";

import React from "react";
import { motion } from "framer-motion";
import { Leaf, Award, Heart, ShieldCheck } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="bg-white min-h-screen pt-32 pb-24">
      {/* Hero Header */}
      <section className="bg-pickle-50 py-20 mb-16">
        <div className="container mx-auto px-4 md:px-8 text-center">
          <motion.span 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-pickle-600 font-bold uppercase tracking-widest text-sm mb-4 block"
          >
            Our Story
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-bold text-brown-900 mb-6"
          >
            About <span className="text-pickle-600">Ayzah Pickle</span>
          </motion.h1>
          <div className="w-24 h-1 bg-pickle-500 mx-auto rounded-full"></div>
        </div>
      </section>

      <div className="container mx-auto px-4 md:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Main Content */}
          <div className="prose prose-lg max-w-none mb-20 text-brown-800 font-medium leading-relaxed">
            <h2 className="text-3xl font-bold text-brown-900 mb-6">Welcome to Ayzah Pickle – where tradition meets taste.</h2>
            <p className="mb-6">
              At Ayzah Pickle, we bring you authentic homemade pickles prepared using traditional Kerala recipes. Every jar is crafted with fresh ingredients, rich spices, and a passion for delivering natural, homemade flavors.
            </p>
            <p className="mb-6">
              We believe in quality, hygiene, and taste. Our pickles are made without added preservatives, ensuring a healthy and authentic experience in every bite.
            </p>
            <p className="mb-12">
              From our kitchen to your table, we deliver pure taste and tradition.
            </p>
          </div>

          {/* Values Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-pickle-50 p-8 rounded-3xl border border-pickle-100 flex gap-6">
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-pickle-600 shadow-sm shrink-0">
                <Leaf size={28} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-brown-900 mb-2">100% Natural</h3>
                <p className="text-brown-600 font-medium">Made with fresh, handpicked ingredients and zero artificial preservatives.</p>
              </div>
            </div>
            <div className="bg-pickle-50 p-8 rounded-3xl border border-pickle-100 flex gap-6">
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-pickle-600 shadow-sm shrink-0">
                <Award size={28} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-brown-900 mb-2">Traditional Recipe</h3>
                <p className="text-brown-600 font-medium">Passed down through generations, our recipes capture the soul of Kerala.</p>
              </div>
            </div>
            <div className="bg-pickle-50 p-8 rounded-3xl border border-pickle-100 flex gap-6">
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-pickle-600 shadow-sm shrink-0">
                <Heart size={28} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-brown-900 mb-2">Made with Love</h3>
                <p className="text-brown-600 font-medium">Every jar is prepared in small batches to ensure authentic homemade taste.</p>
              </div>
            </div>
            <div className="bg-pickle-50 p-8 rounded-3xl border border-pickle-100 flex gap-6">
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-pickle-600 shadow-sm shrink-0">
                <ShieldCheck size={28} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-brown-900 mb-2">Quality & Hygiene</h3>
                <p className="text-brown-600 font-medium">We maintain the highest standards of hygiene throughout our preparation.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
