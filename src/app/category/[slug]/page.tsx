"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { ShoppingBag, Heart, Star, ChevronRight, Loader2, Package, Sparkles } from "lucide-react";
import { useStore } from "@/context/StoreContext";

export default function CategoryPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { addToCart, toggleWishlist, isInWishlist } = useStore();
  const [products, setProducts] = useState<any[]>([]);
  const [category, setCategory] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Category Details
        const catRes = await fetch("/api/categories");
        const catJson = await catRes.json();
        
        const categoriesList = catJson && Array.isArray(catJson.data) 
          ? catJson.data 
          : (Array.isArray(catJson) ? catJson : []);
          
        const currentCat = categoriesList.find((c: any) => c.slug === slug);
        setCategory(currentCat);

        // Fetch Products for this Category
        const prodRes = await fetch(`/api/products?category=${slug}`);
        const prodJson = await prodRes.json();
        
        const productsList = prodJson && Array.isArray(prodJson.data) 
          ? prodJson.data 
          : (Array.isArray(prodJson) ? prodJson : []);
          
        setProducts(productsList);
      } catch (error) {
        console.error("Failed to fetch category data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [slug]);

  if (loading) {
    return (
      <div className="bg-pickle-50 min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-pickle-600" size={48} />
      </div>
    );
  }

  return (
    <div className="bg-pickle-50 min-h-screen pb-16 font-poppins">
      
      {/* Category Banner */}
      <div className="relative h-[200px] md:h-[240px] overflow-hidden">
        <img 
          src={category?.banner || "/images/hero-bg.jpg"} 
          alt={category?.name} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brown-900/80 via-brown-900/40 to-transparent"></div>
        
        <div className="absolute bottom-6 left-0 w-full">
          <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 w-full">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-3xl"
            >
              <div className="flex items-center gap-1.5 text-white/60 text-[9px] font-black uppercase tracking-[0.3em] mb-2">
                <Link href="/" className="hover:text-white transition-colors">Home</Link>
                <ChevronRight size={10} />
                <span className="text-white">Collections</span>
                <ChevronRight size={10} />
                <span className="text-pickle-400">{category?.name || "Category"}</span>
              </div>
              <h1 className="text-3xl md:text-5xl font-black text-white mb-2 tracking-tight drop-shadow-2xl uppercase">
                {category?.name || "Category"}
              </h1>
              <p className="text-white/80 text-xs md:text-sm font-medium leading-relaxed max-w-xl line-clamp-2">
                {category?.description || "Explore our premium range of authentic Kerala pickles."}
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 w-full -mt-6 relative z-10">
        {/* Stats Bar */}
        <div className="bg-white rounded-2xl p-4 shadow-xl border border-pickle-100 flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-pickle-50 text-pickle-600 rounded-xl flex items-center justify-center">
                <Package size={18} />
              </div>
              <div>
                <p className="text-[8px] font-black text-brown-400 uppercase tracking-widest">Total Products</p>
                <p className="text-base font-black text-brown-900">{products.length} Items</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
             <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
                <Sparkles size={18} />
              </div>
              <div>
                <p className="text-[8px] font-black text-brown-400 uppercase tracking-widest">Quality Assurance</p>
                <p className="text-xs font-black text-brown-900 uppercase">100% Homemade</p>
              </div>
          </div>
        </div>

        {/* Product Grid */}
        {products.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-pickle-100 shadow-lg">
            <Package size={40} className="mx-auto text-pickle-100 mb-3" />
            <p className="text-brown-500 font-black text-lg uppercase tracking-widest">No products found in this collection.</p>
            <Link href="/shop" className="inline-block mt-4 bg-pickle-600 text-white px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-pickle-700 transition-all shadow-md">
              Browse All Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {(Array.isArray(products) ? products : []).map((product, index) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-pickle-100 group flex flex-col max-w-[280px] w-full mx-auto p-3"
              >
                <div className="relative h-[220px] overflow-hidden rounded-xl bg-pickle-50">
                  <div className="absolute top-2.5 right-2.5 z-10">
                    <motion.button 
                      whileTap={{ scale: 0.8 }}
                      onClick={() => toggleWishlist(product)}
                      className={`w-7 h-7 rounded-xl flex items-center justify-center transition-all shadow-sm ${isInWishlist(product._id) ? 'bg-red-50 text-red-500' : 'bg-white/90 backdrop-blur text-brown-500 hover:bg-pickle-600 hover:text-white'}`}
                    >
                      <Heart size={14} fill={isInWishlist(product._id) ? "currentColor" : "none"} />
                    </motion.button>
                  </div>

                  <Link href={`/product/${product.slug}`} className="block w-full h-full">
                    <img 
                      src={product.images?.[0] || "/placeholder.jpg"} 
                      alt={product.name} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                    />
                  </Link>
                </div>

                <div className="p-3.5 flex-1 flex flex-col">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1 text-amber-400">
                      <Star size={12} fill="currentColor" />
                      <span className="text-[10px] text-brown-600 font-black">({product.reviews || 0})</span>
                    </div>
                    <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-lg ${product.stock > 0 ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-red-50 text-red-600 border border-red-100'}`}>
                      {product.stock > 0 ? "In Stock" : "Sold Out"}
                    </span>
                  </div>
                  
                  <Link href={`/product/${product.slug}`}>
                    <h3 className="font-bold text-brown-900 text-sm mb-1 hover:text-pickle-600 transition-colors line-clamp-1 cursor-pointer">{product.name}</h3>
                  </Link>
                  
                  <div className="mt-auto pt-3 border-t border-pickle-50 flex justify-between items-center">
                    <div className="flex flex-col">
                      {product.offerPrice && product.offerPrice < product.price && (
                        <span className="text-[9px] text-gray-400 line-through font-bold">₹{product.price}</span>
                      )}
                      <span className="font-black text-base text-pickle-600">₹{product.offerPrice || product.price}</span>
                    </div>
                    
                    <button 
                      onClick={() => addToCart(product, 1)}
                      disabled={product.stock <= 0}
                      className="bg-pickle-100 text-pickle-700 w-8 h-8 rounded-xl flex items-center justify-center hover:bg-pickle-600 hover:text-white transition-colors shadow-sm disabled:opacity-30 active:scale-95"
                    >
                      <ShoppingBag size={14} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
