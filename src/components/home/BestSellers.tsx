"use client";

import React, { useRef } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, ShoppingCart } from "lucide-react";
import { useStore } from "@/context/StoreContext";
import Link from "next/link";

const bestSellers = [
  { id: 8, slug: "lemon-pickle", name: "Traditional Lemon Pickle", price: 180, weight: "400g", image: "https://images.unsplash.com/photo-1590502593747-422ea969a5a9?q=80&w=1374&auto=format&fit=crop" },
  { id: 5, slug: "garlic-pickle", name: "Spicy Garlic Pickle", price: 210, weight: "400g", image: "https://images.unsplash.com/photo-1541535882672-13eb287e0b51?q=80&w=1384&auto=format&fit=crop" },
  { id: 4, slug: "mango-dates-pickle", name: "Mango & Dates Pickle", price: 319, weight: "500g", image: "/images/products/mango-dates.png" },
  { id: 6, slug: "chicken-pickle", name: "Kerala Chicken Pickle", price: 320, weight: "400g", image: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?q=80&w=1470&auto=format&fit=crop" },
  { id: 1, slug: "beef-pickle", name: "Beef Pickle", price: 280, weight: "300g", image: "/images/products/beef.png" },
];

export default function BestSellers() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { addToCart } = useStore();

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const { scrollLeft, clientWidth } = scrollContainerRef.current;
      const scrollAmount = clientWidth / 2;
      scrollContainerRef.current.scrollTo({
        left: direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="py-16 bg-white relative overflow-hidden">
      {/* Decorative leaf background */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-leaf-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 w-full">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-black text-brown-900 mb-1 uppercase tracking-tight">Top Rated Pickles</h2>
            <p className="text-brown-600 text-xs md:text-sm font-medium">Our customer favorites, consistently delicious.</p>
          </div>
          <div className="hidden md:flex gap-2">
            <button 
              onClick={() => scroll('left')}
              className="w-8 h-8 rounded-full border border-pickle-200 flex items-center justify-center text-brown-600 hover:bg-pickle-50 hover:text-pickle-600 transition-all bg-white shadow-sm active:scale-90"
            >
              <ChevronLeft size={16} />
            </button>
            <button 
              onClick={() => scroll('right')}
              className="w-8 h-8 rounded-full border border-pickle-200 flex items-center justify-center text-brown-600 hover:bg-pickle-50 hover:text-pickle-600 transition-all bg-white shadow-sm active:scale-90"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* Carousel */}
        <div 
          ref={scrollContainerRef}
          className="flex overflow-x-auto gap-4 md:gap-6 pb-6 snap-x snap-mandatory scrollbar-hide"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {bestSellers.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="min-w-[220px] md:min-w-[260px] max-w-[280px] snap-start bg-pickle-55 rounded-2xl overflow-hidden border border-pickle-100 group flex flex-col"
            >
              <div className="relative h-[220px] overflow-hidden bg-white">
                <Link href={`/product/${product.slug}`}>
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </Link>
              </div>
              <div className="p-3.5 flex flex-col flex-1 bg-pickle-50">
                <p className="text-[10px] text-gray-500 mb-0.5 font-bold">{product.weight}</p>
                <Link href={`/product/${product.slug}`}>
                  <h3 className="font-bold text-brown-900 text-sm mb-2 line-clamp-1 hover:text-pickle-600 transition-colors cursor-pointer">{product.name}</h3>
                </Link>
                <div className="flex justify-between items-center mt-auto">
                  <span className="font-black text-base text-pickle-600">₹{product.price}</span>
                  <button 
                    onClick={() => addToCart(product, 1)}
                    className="bg-white border border-pickle-200 text-pickle-600 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 hover:bg-pickle-600 hover:text-white hover:border-pickle-600 transition-all active:scale-95 shadow-sm"
                  >
                    Add <ShoppingCart size={12} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
