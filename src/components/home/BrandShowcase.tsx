"use client";

import React from "react";
import { motion } from "framer-motion";
import { Leaf, ShieldCheck, Truck, Utensils, Heart, ThumbsUp } from "lucide-react";

const features = [
  { icon: Heart, title: "Homemade Quality", desc: "Prepared in small batches with love" },
  { icon: Utensils, title: "Traditional Recipe", desc: "Grandma's authentic Kerala spices" },
  { icon: Leaf, title: "Fresh Ingredients", desc: "100% natural and locally sourced" },
  { icon: ShieldCheck, title: "No Preservatives", desc: "Zero artificial colors or chemicals" },
  { icon: ThumbsUp, title: "Hygienic Preparation", desc: "Prepared in a clean, safe environment" },
  { icon: Truck, title: "Fast Delivery", desc: "Safely packed and shipped to you" },
];

export default function BrandShowcase() {
  return (
    <section className="py-20 bg-white border-y border-pickle-100">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-brown-900 mb-4">Why Choose Our Pickles?</h2>
          <div className="w-16 h-1 bg-pickle-500 mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 md:gap-8 text-center">
          {features.map((feat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex flex-col items-center p-4 rounded-xl hover:bg-pickle-50 transition-colors group"
            >
              <div className="w-16 h-16 bg-pickle-100 text-pickle-600 rounded-full flex items-center justify-center mb-4 group-hover:bg-pickle-600 group-hover:text-white transition-colors duration-300">
                <feat.icon size={28} />
              </div>
              <h3 className="font-bold text-brown-900 mb-2 text-sm">{feat.title}</h3>
              <p className="text-xs text-brown-600 leading-relaxed">{feat.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
