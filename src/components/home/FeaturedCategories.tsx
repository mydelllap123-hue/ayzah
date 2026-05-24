"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Leaf, UtensilsCrossed, ArrowRight, Loader2, Package } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function FeaturedCategories() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/categories");
        const result = await res.json();
        if (result.success && Array.isArray(result.data)) {
          // Only show featured categories on homepage, or all if none marked featured
          const featured = result.data.filter((c: any) => c.featured);
          setCategories(featured.length > 0 ? featured : result.data);
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="py-24 bg-pickle-50 flex items-center justify-center">
        <Loader2 className="animate-spin text-pickle-600" size={40} />
      </div>
    );
  }

  if (categories.length === 0) return null;

  return (
    <section className="py-24 bg-pickle-50">
      <div className="container mx-auto px-4 md:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-pickle-600 font-black uppercase tracking-[0.3em] text-[10px] mb-3 block">Discover Ayzah</span>
          <h2 className="text-4xl md:text-6xl font-black text-brown-900 mb-4 tracking-tight">Our Authentic <span className="text-pickle-500">Collections</span></h2>
          <p className="text-brown-600 max-w-2xl mx-auto font-medium">Explore our curated range of traditional Kerala pickles, from spicy vegetarian delights to authentic seafood treasures.</p>
        </div>

        {/* Categories Grid */}
        <div className={`grid grid-cols-1 ${categories.length === 1 ? 'max-w-2xl' : 'md:grid-cols-2 lg:grid-cols-3'} gap-10 mx-auto`}>
          {categories.map((cat, index) => (
            <Link key={cat._id} href={`/category/${cat.slug}`}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group relative bg-white rounded-[3rem] overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-700 border border-pickle-100 p-5 h-full"
              >
                <div className="relative aspect-[16/11] rounded-[2rem] overflow-hidden mb-8 bg-neutral-100">
                  {cat.thumbnail || cat.image ? (
                    <Image
                      src={cat.thumbnail || cat.image}
                      alt={cat.name}
                      fill
                      className="object-cover transition-transform duration-1000 group-hover:scale-110"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full bg-neutral-100">
                      <Package className="w-12 h-12 text-neutral-400" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-brown-900/40 to-transparent"></div>
                  
                  {/* Floating Icon */}
                  <div className="absolute top-6 left-6 z-10">
                    <div className="w-14 h-14 bg-white/90 backdrop-blur-md text-pickle-600 rounded-[1.25rem] flex items-center justify-center shadow-xl border border-white/20 group-hover:bg-pickle-600 group-hover:text-white transition-all duration-500">
                      {cat.name.toLowerCase().includes('veg') && !cat.name.toLowerCase().includes('non') ? (
                        <Leaf size={28} strokeWidth={2.5} />
                      ) : (
                        <UtensilsCrossed size={28} strokeWidth={2.5} />
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="px-4 pb-4">
                  <div className="flex justify-between items-end">
                    <div className="flex-1">
                      <h3 className="text-3xl font-black text-brown-900 mb-2 group-hover:text-pickle-600 transition-colors tracking-tight">{cat.name}</h3>
                      <p className="text-brown-500 font-medium text-sm line-clamp-2 leading-relaxed">
                        {cat.description || "Traditional Kerala pickle collection preserved with authentic spices."}
                      </p>
                    </div>
                    <div className="ml-4">
                      <div className="w-14 h-14 bg-pickle-50 text-pickle-600 rounded-full flex items-center justify-center group-hover:bg-pickle-600 group-hover:text-white transition-all duration-500 transform group-hover:rotate-[360deg]">
                        <ArrowRight size={24} strokeWidth={3} />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
