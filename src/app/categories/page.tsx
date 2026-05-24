"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight, Leaf, UtensilsCrossed, Loader2, ArrowRight, Package } from "lucide-react";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/categories");
        const result = await res.json();
        if (result.success) setCategories(result.data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-pickle-50">
      <Loader2 className="animate-spin text-pickle-600" size={40} />
    </div>
  );

  return (
    <div className="bg-pickle-50 min-h-screen pt-40 pb-24 font-poppins">
      <div className="container mx-auto px-4 md:px-8">
        
        {/* Breadcrumbs */}
        <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-brown-400 mb-12">
          <Link href="/" className="hover:text-pickle-600 transition-colors">Home</Link>
          <ChevronRight size={12} className="text-brown-200" />
          <span className="text-brown-900">Collections</span>
        </div>

        {/* Header */}
        <div className="mb-20 text-center">
          <span className="bg-pickle-600 text-white font-black uppercase tracking-[0.3em] text-[10px] px-6 py-2 rounded-full mb-6 inline-block">Pickle Collections</span>
          <h1 className="text-5xl md:text-7xl font-black text-brown-900 tracking-tighter mb-8 uppercase">Discover <span className="text-pickle-600">The Taste</span></h1>
          <p className="text-brown-500 text-lg max-w-2xl mx-auto font-bold uppercase tracking-widest leading-relaxed">Choose between our traditional vegetarian and authentic non-vegetarian Kerala pickles.</p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto justify-items-center">
          {categories.map((cat, index) => (
            <Link key={cat.slug} href={`/collections/${cat.slug}`} className="w-full">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="group relative bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-pickle-600/20 transition-all duration-700 border border-pickle-100 p-4 h-full flex flex-col"
              >
                <div className="relative h-[180px] w-full rounded-2xl overflow-hidden mb-5 shadow-md shrink-0 bg-neutral-100">
                  {cat.thumbnail || cat.image ? (
                    <Image
                      src={cat.thumbnail || cat.image}
                      alt={cat.name}
                      fill
                      className="object-cover transition-transform duration-1000 group-hover:scale-110"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full bg-neutral-100">
                      <Package className="w-10 h-10 text-neutral-400" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-brown-900/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity"></div>
                  
                  <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                    <div className="bg-white/20 backdrop-blur-xl px-3 py-1.5 rounded-xl border border-white/30 text-white">
                      <p className="text-[9px] font-black uppercase tracking-[0.2em]">{cat.name.includes('Veg') ? '100% VEG' : 'PREMIUM'}</p>
                    </div>
                  </div>
                </div>
                
                <div className="px-2 flex-1 flex flex-col">
                  <h2 className="text-2xl font-black text-brown-900 mb-2 group-hover:text-pickle-600 transition-colors uppercase tracking-tight">{cat.name}</h2>
                  <p className="text-brown-500 font-bold text-sm uppercase tracking-widest leading-relaxed mb-5 flex-1">{cat.description || "Discover the authentic taste of Kerala with our premium pickle collection."}</p>
                  
                  <div className="flex justify-between items-center pt-4 border-t border-pickle-50">
                    <span className="text-pickle-600 font-black text-[9px] uppercase tracking-[0.2em] flex items-center gap-2">
                      Explore Collection <ArrowRight size={12} />
                    </span>
                    <div className="w-12 h-12 bg-pickle-50 rounded-xl flex items-center justify-center text-pickle-600 group-hover:bg-pickle-600 group-hover:text-white transition-all shadow-sm">
                      <ArrowRight size={20} />
                    </div>
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
