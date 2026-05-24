"use client";

import React from "react";
import { motion } from "framer-motion";

const blogs = [
  {
    id: 1,
    title: "Best Foods to Pair with Tender Mango Pickle",
    image: "https://images.unsplash.com/photo-1589115792942-5bf04db08bf4?q=80&w=1500&auto=format&fit=crop",
    date: "Aug 12, 2026"
  },
  {
    id: 2,
    title: "The Art of Traditional Kerala Pickle Making",
    image: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?q=80&w=1470&auto=format&fit=crop",
    date: "Sep 05, 2026"
  },
  {
    id: 3,
    title: "How to Keep Homemade Pickles Fresh for Years",
    image: "https://images.unsplash.com/photo-1541535882672-13eb287e0b51?q=80&w=1384&auto=format&fit=crop",
    date: "Sep 22, 2026"
  }
];

export default function FeaturedCollection() {
  return (
    <section className="py-24 bg-white relative">
      {/* Name implies FeaturedCollection but rendering BlogSection */}
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex justify-between items-end mb-12">
          <div>
            <span className="text-pickle-600 font-bold uppercase tracking-widest text-sm mb-2 block">From Our Kitchen</span>
            <h2 className="text-3xl md:text-4xl font-bold text-brown-900 mb-2">Pickle <span className="text-pickle-500">Stories & Recipes</span></h2>
          </div>
          <a href="#" className="hidden md:inline-block text-pickle-600 font-semibold hover:text-pickle-700 transition-colors">
            Read All Articles →
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {blogs.map((blog, index) => (
            <motion.div 
              key={blog.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="group cursor-pointer"
            >
              <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden mb-6 shadow-sm group-hover:shadow-lg transition-all duration-300">
                <img 
                  src={blog.image} 
                  alt={blog.title} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                />
              </div>
              <p className="text-sm text-gray-500 font-medium mb-2">{blog.date}</p>
              <h3 className="text-xl font-bold text-brown-900 leading-snug group-hover:text-pickle-600 transition-colors">
                {blog.title}
              </h3>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
