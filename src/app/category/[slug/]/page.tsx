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
        const result = await catRes.json();
        
        if (result.success && Array.isArray(result.data)) {
          const currentCat = result.data.find((c: any) => c.slug === slug);
          setCategory(currentCat);
        }

        // Fetch Products for this Category
        const prodRes = await fetch(`/api/products?category=${slug}`);
        const prodResult = await prodRes.json();
        if (prodResult.success) {
          setProducts(prodResult.data);
        }
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

  const categoryName = category?.name || "Category";

  return (
    <div className="bg-pickle-50 min-h-screen pb-24 font-poppins">
      
      {/* Category Banner */}
      <div className="relative h-[40vh] md:h-[50vh] overflow-hidden">
        <img 
          src={category?.banner || category?.thumbnail || "/images/hero-bg.jpg"} 
          alt={categoryName} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brown-900/80 via-brown-900/40 to-transparent"></div>
        
        <div className="absolute bottom-12 left-0 w-full">
          <div className="container mx-auto px-4 md:px-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-3xl"
            >
              <div className="flex items-center gap-2 text-white/60 text-xs font-black uppercase tracking-[0.3em] mb-4">
                <Link href="/" className="hover:text-white transition-colors">Home</Link>
                <ChevronRight size={12} />
                <span className="text-white">Collections</span>
                <ChevronRight size={12} />
                <span className="text-pickle-400">{categoryName}</span>
              </div>
              <h1 className="text-4xl md:text-7xl font-black text-white mb-4 tracking-tight drop-shadow-2xl">
                {categoryName}
              </h1>
              <p className="text-white/80 text-sm md:text-lg font-medium leading-relaxed max-w-xl">
                {category?.description || "Explore our premium range of authentic Kerala pickles."}
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8 -mt-10 relative z-10">
        {/* Stats Bar */}
        <div className="bg-white rounded-[2rem] p-6 shadow-2xl border border-pickle-100 flex flex-wrap items-center justify-between gap-6 mb-12">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-pickle-50 text-pickle-600 rounded-2xl flex items-center justify-center">
                <Package size={24} />
              </div>
              <div>
                <p className="text-[10px] font-black text-brown-400 uppercase tracking-widest">Total Products</p>
                <p className="text-xl font-black text-brown-900">{products.length} Items</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
             <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center">
                <Sparkles size={24} />
              </div>
              <div>
                <p className="text-[10px] font-black text-brown-400 uppercase tracking-widest">Quality Assurance</p>
                <p className="text-sm font-black text-brown-900 uppercase">100% Homemade</p>
              </div>
          </div>
        </div>

        {/* Product Grid */}
        {products.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-[3rem] border border-pickle-100 shadow-xl">
            <Package size={48} className="mx-auto text-pickle-100 mb-4" />
            <p className="text-brown-500 font-black text-xl uppercase tracking-widest">No products found in this collection.</p>
            <Link href="/shop" className="inline-block mt-6 bg-pickle-600 text-white px-8 py-3 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-pickle-700 transition-all shadow-xl shadow-pickle-600/20">
              Browse All Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {products.map((product, index) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-[2.5rem] shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden border border-pickle-100 group flex flex-col p-4"
              >
                <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] bg-pickle-50">
                  <div className="absolute top-4 right-4 z-10">
                    <motion.button 
                      whileTap={{ scale: 0.8 }}
                      onClick={() => toggleWishlist(product)}
                      className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all shadow-lg ${isInWishlist(product._id) ? 'bg-red-500 text-white' : 'bg-white/90 backdrop-blur text-brown-500 hover:bg-pickle-600 hover:text-white'}`}
                    >
                      <Heart size={18} fill={isInWishlist(product._id) ? "currentColor" : "none"} />
                    </motion.button>
                  </div>

                  <Link href={`/product/${product.slug}`} className="block w-full h-full">
                    <img 
                      src={product.images?.[0] || "/placeholder.jpg"} 
                      alt={product.name || "Product"} 
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                    />
                  </Link>
                </div>

                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1 text-amber-500">
                      <Star size={14} fill="currentColor" />
                      <span className="text-xs text-brown-600 font-black">{product.ratings || 4.8}</span>
                    </div>
                    <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-full ${product.stock > 0 ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-red-50 text-red-600 border border-red-100'}`}>
                      {product.stock > 0 ? "In Stock" : "Sold Out"}
                    </span>
                  </div>
                  
                  <Link href={`/product/${product.slug}`}>
                    <h3 className="font-black text-brown-900 text-xl leading-tight mb-2 hover:text-pickle-600 transition-colors line-clamp-2 uppercase tracking-tight">{product.name || "Unnamed Product"}</h3>
                  </Link>
                  
                  <div className="mt-auto pt-4 flex justify-between items-center">
                    <div className="flex flex-col">
                      {product.offerPrice && product.offerPrice < product.price && (
                        <span className="text-xs text-gray-400 line-through font-bold">₹{product.price}</span>
                      )}
                      <span className="font-black text-2xl text-pickle-600 tracking-tight">₹{product.offerPrice || product.price}</span>
                    </div>
                    
                    <button 
                      onClick={() => addToCart(product, 1)}
                      disabled={product.stock <= 0}
                      className="bg-brown-900 text-white w-14 h-14 rounded-2xl flex items-center justify-center hover:bg-pickle-600 hover:shadow-2xl transition-all group-hover:scale-110 active:scale-95 disabled:opacity-30"
                    >
                      <ShoppingBag size={24} />
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
