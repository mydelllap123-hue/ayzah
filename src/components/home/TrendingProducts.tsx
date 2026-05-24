"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Heart, ShoppingBag, Star, Eye, Loader2 } from "lucide-react";
import { useStore } from "@/context/StoreContext";
import Link from "next/link";

export default function TrendingProducts() {
  const { addToCart, toggleWishlist, isInWishlist, setQuickViewProduct } = useStore();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/products");
        const data = await res.json();
        setProducts(data.data || data.products || []);
      } catch (error) {
        console.error("Failed to fetch products:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="py-16 flex items-center justify-center">
        <Loader2 className="animate-spin text-pickle-600" size={32} />
      </div>
    );
  }

  const productsArray = Array.isArray(products) ? products : [];

  return (
    <section className="py-16 bg-white border-y border-pickle-100">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 w-full">
        <div className="flex flex-col md:flex-row justify-between items-end mb-8">
          <div>
            <span className="text-pickle-600 font-bold uppercase tracking-widest text-[10px] mb-1 block">Our Full Collection</span>
            <h2 className="text-2xl md:text-3xl font-black text-brown-900 uppercase tracking-tight">All <span className="text-pickle-500">Products</span></h2>
          </div>
          <Link href="/shop" className="mt-4 md:mt-0 text-pickle-600 font-black text-xs uppercase tracking-widest hover:text-pickle-700 transition-colors">
            Browse Collection →
          </Link>
        </div>

        {productsArray.length === 0 ? (
          <div className="text-center py-16 bg-pickle-50 rounded-2xl border-2 border-dashed border-pickle-200">
            <p className="text-brown-500 font-bold text-lg">No products found in the database.</p>
            <p className="text-brown-400 mt-1 text-sm">Add some products from the Admin Panel to see them here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {(Array.isArray(products) ? products : [])
              .slice(0, 8)
              .map((product, index) => {
                const productName = product.name || product.title || "Unnamed Product";
              return (
                <motion.div
                  key={product._id || index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-pickle-100 group flex flex-col max-w-[280px] w-full mx-auto"
                >
                  {/* Image Area */}
                  <div className="relative h-[220px] overflow-hidden bg-pickle-50">
                    {product.featured && (
                      <div className="absolute top-2.5 left-2.5 z-10 bg-leaf-500 text-white text-[8px] font-bold px-2 py-0.5 rounded-full shadow-md">
                        FEATURED
                      </div>
                    )}
                    
                    <div className="absolute top-2.5 right-2.5 z-10">
                      <motion.button 
                        whileTap={{ scale: 0.8 }}
                        onClick={() => toggleWishlist(product)}
                        className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors shadow-sm ${isInWishlist(product._id || "") ? 'bg-red-50 text-red-500' : 'bg-white/80 backdrop-blur text-brown-500 hover:bg-pickle-100 hover:text-pickle-600'}`}
                      >
                        <Heart size={14} fill={isInWishlist(product._id || "") ? "currentColor" : "none"} />
                      </motion.button>
                    </div>

                    <Link href={`/product/${product.slug}`}>
                      <img 
                        src={product.images?.[0] || "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?q=80&w=1470&auto=format&fit=crop"} 
                        alt={productName} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                      />
                    </Link>
                    
                    {/* Quick View Overlay */}
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
                      <button 
                        onClick={() => setQuickViewProduct(product)}
                        className="bg-white text-brown-900 px-3 py-1.5 rounded-lg font-bold text-xs flex items-center gap-1.5 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 hover:bg-pickle-50 pointer-events-auto"
                      >
                        <Eye size={14} /> Quick View
                      </button>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="p-3.5 flex-1 flex flex-col">
                    <div className="flex items-center gap-1 text-amber-400 mb-1">
                      <Star size={12} fill="currentColor" />
                      <span className="text-[10px] text-gray-500 ml-1">({product.reviews || 0})</span>
                    </div>
                    
                    <Link href={`/product/${product.slug}`}>
                      <h3 className="font-bold text-brown-900 text-sm mb-0.5 line-clamp-1 hover:text-pickle-600 transition-colors cursor-pointer">{productName}</h3>
                    </Link>
                    <p className="text-[8px] font-bold text-brown-400 uppercase tracking-wider mb-1">{product.category}</p>
                    <p className="text-[11px] text-gray-500 mb-3">{product.stock > 0 ? `${product.stock} in stock` : "Out of Stock"}</p>
                    
                    <div className="mt-auto flex justify-between items-center">
                      <div className="flex flex-col">
                        {product.offerPrice && product.offerPrice < product.price && (
                          <span className="text-[10px] text-gray-400 line-through">₹{product.price}</span>
                        )}
                        <span className="font-black text-base text-pickle-600">₹{product.offerPrice || product.price}</span>
                      </div>
                      
                      <button 
                        onClick={() => addToCart(product, 1)}
                        className="bg-pickle-100 text-pickle-700 w-8 h-8 rounded-full flex items-center justify-center hover:bg-pickle-600 hover:text-white transition-colors shadow-sm group-hover:bg-pickle-600 group-hover:text-white"
                      >
                        <ShoppingBag size={14} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

