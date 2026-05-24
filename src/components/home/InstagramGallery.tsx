"use client";

import React from "react";
import { motion } from "framer-motion";
import { Camera } from "lucide-react";

const images = [
  "https://images.unsplash.com/photo-1589115792942-5bf04db08bf4?q=80&w=1500&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?q=80&w=1587&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1541535882672-13eb287e0b51?q=80&w=1384&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?q=80&w=1470&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1590502593747-422ea969a5a9?q=80&w=1374&auto=format&fit=crop",
];

export default function InstagramGallery() {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4 md:px-8 mb-12 text-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 text-pickle-600 font-bold uppercase tracking-widest text-sm mb-3"
        >
          <Camera size={18} /> @keralapickles_official
        </motion.div>
        <h2 className="text-3xl md:text-4xl font-bold text-brown-900 mb-2">Follow Our Kitchen</h2>
        <p className="text-brown-600">Tag your meals with #KeralaPickles to get featured!</p>
      </div>

      <div className="flex flex-wrap md:flex-nowrap w-full">
        {images.map((img, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className={`relative group overflow-hidden w-1/2 md:w-1/5 aspect-square border-2 border-white ${index === 4 ? 'hidden md:block' : ''}`}
          >
            <img 
              src={img} 
              alt="Food photography" 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-pickle-600/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center cursor-pointer">
              <Camera size={36} className="text-white transform scale-50 group-hover:scale-100 transition-transform duration-300 drop-shadow-lg" />
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
