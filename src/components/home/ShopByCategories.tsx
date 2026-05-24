"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Leaf, Loader2, ImageIcon } from "lucide-react";
import Link from "next/link";

function ImageWithFallback({ src, alt, className }: { src: string; alt: string; className?: string }) {
  const [errored, setErrored] = useState(false);
  if (!src || errored) {
    return (
      <div className={`flex items-center justify-center bg-pickle-50 ${className || ""}`}>
        <ImageIcon size={40} className="text-pickle-200" />
      </div>
    );
  }
  return <img src={src} alt={alt} onError={() => setErrored(true)} className={className} />;
}

interface Category {
  _id: string;
  name: string;
  slug: string;
  description: string;
  thumbnail: string;
  productCount: number;
}

export default function ShopByCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/categories");
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setCategories(json.data);
        }
      } catch (error) {
        console.error("Failed to fetch categories on homepage:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="py-16 bg-pickle-50/50 flex items-center justify-center border-b border-pickle-100">
        <Loader2 className="animate-spin text-pickle-600" size={32} />
      </div>
    );
  }

  return (
    <section className="py-16 bg-pickle-50/50 border-b border-pickle-100 font-poppins">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 w-full">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-10">
          <div className="max-w-2xl">
            <span className="text-pickle-600 font-black uppercase tracking-widest text-[10px] mb-1.5 block">
              Shop By Category
            </span>
            <h2 className="text-2xl md:text-3xl font-black text-brown-900 uppercase tracking-tight leading-tight">
              Explore Our <span className="text-pickle-500">Pickle Collections</span>
            </h2>
            <p className="text-brown-500 text-xs mt-2 font-medium leading-relaxed">
              Explore our traditional Kerala pickle recipes curated by rich tastes and fresh regional spices. 
              Find your favorite flavors easily.
            </p>
          </div>
          <Link 
            href="/categories" 
            className="mt-4 md:mt-0 text-pickle-600 font-black text-xs uppercase tracking-widest hover:text-pickle-700 transition-colors flex items-center gap-1.5 shrink-0"
          >
            All Collections <ArrowRight size={14} />
          </Link>
        </div>

        {/* Categories Grid (Fixed 2-Category structure) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {categories.map((category, index) => {
            const isVeg = category.slug === "veg";

            return (
              <motion.div
                key={category._id || index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                whileHover={{ y: -6 }}
                className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-pickle-100 group flex flex-col relative"
              >
                {/* Floating Food Type Symbol at the top */}
                <div className="absolute top-4 left-4 z-20 flex gap-2">
                  <div 
                    className={`w-7 h-7 rounded-xl flex items-center justify-center shadow-lg border bg-white ${
                      isVeg ? "border-green-200 text-green-600" : "border-red-200 text-red-600"
                    }`}
                  >
                    {isVeg ? (
                      <Leaf size={14} className="fill-green-50" />
                    ) : (
                      /* Custom Meat Drumstick SVG */
                      <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                        <path d="M19.5,3A4.5,4.5 0 0,0 15,7.5c0,1.25 .5,2.4 1.34,3.23L11.5,15.56c-1.12,-0.36 -2.4,0 -3.3,0.9l-4,4a2,2 0 0,0 0,2.83a2,2 0 0,0 2.83,0l4,-4c.9,-.9 1.26,-2.18 .9,-3.3l4.83,-4.83C17.1,12 18.25,12.5 19.5,12.5A4.5,4.5 0 0,0 24,8A4.5,4.5 0 0,0 19.5,3Z" />
                      </svg>
                    )}
                  </div>
                  
                  {/* Standard Indian food label badge */}
                  <div className={`px-2.5 py-1 rounded-xl text-[7px] font-black uppercase tracking-wider text-white shadow-md flex items-center ${
                    isVeg ? "bg-green-600" : "bg-red-600"
                  }`}>
                    {isVeg ? "100% vegetarian" : "premium non-veg"}
                  </div>
                </div>

                {/* Category Image Area */}
                <div className="relative h-[200px] w-full overflow-hidden bg-pickle-50">
                  <Link href={`/collections/${category.slug}`} className="block w-full h-full">
                    <ImageWithFallback
                      src={category.thumbnail}
                      alt={category.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-brown-900/40 via-transparent to-transparent opacity-60" />
                  </Link>
                </div>

                {/* Card Content Area */}
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <Link href={`/collections/${category.slug}`}>
                      <h3 className="font-black text-brown-900 text-lg uppercase tracking-tight group-hover:text-pickle-600 transition-colors">
                        {category.name}
                      </h3>
                    </Link>
                  </div>
                  
                  <p className="text-brown-500 text-xs font-medium leading-relaxed mb-6 line-clamp-2">
                    {category.description}
                  </p>

                  {/* Bottom action row */}
                  <Link href={`/collections/${category.slug}`} className="mt-auto block">
                    <div className="flex justify-between items-center border-t border-pickle-50 pt-4">
                      <span className="text-[9px] font-black text-pickle-600 uppercase tracking-widest">
                        {category.productCount || 0} {category.productCount === 1 ? "Product" : "Products"} available
                      </span>
                      <div className="w-9 h-9 rounded-xl bg-pickle-50 text-pickle-600 group-hover:bg-pickle-600 group-hover:text-white flex items-center justify-center transition-all duration-300 shadow-sm active:scale-90">
                        <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform duration-300" />
                      </div>
                    </div>
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
