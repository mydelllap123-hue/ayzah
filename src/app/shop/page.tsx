"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import { Filter, ChevronDown, SlidersHorizontal, Heart, ShoppingBag, Eye, X, Loader2, Package, Star } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "@/context/StoreContext";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

function ShopPageContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");
  
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("All Pickles");
  const [sortBy, setSortBy] = useState("Popularity");

  const { addToCart, toggleWishlist, isInWishlist, setQuickViewProduct } = useStore();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, catRes] = await Promise.all([
          fetch("/api/admin/products"),
          fetch("/api/categories")
        ]);
        const prodResult = await prodRes.json();
        const catResult = await catRes.json();
        
        if (prodResult.success) setProducts(prodResult.data);
        if (catResult.success) setCategories(catResult.data);
      } catch (error) {
        console.error("Shop: Failed to fetch data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (categoryParam) {
      if (categoryParam === "veg") setSelectedCategory("Veg Pickles");
      else if (categoryParam === "non-veg") setSelectedCategory("Non-Veg Pickles");
      else setSelectedCategory(categoryParam);
    }
  }, [categoryParam]);

  const filteredProducts = useMemo(() => {
    let result = products.filter(p => {
      const catMatch = selectedCategory === "All Pickles" || 
                       p.category === selectedCategory || 
                       p.categorySlug === selectedCategory.toLowerCase().replace(/\s+/g, '-') ||
                       (selectedCategory === "Veg Pickles" && (p.category === "veg" || p.categorySlug === "veg" || p.category === "Veg Pickles" || p.categorySlug === "veg-pickles")) ||
                       (selectedCategory === "Non-Veg Pickles" && (p.category === "non-veg" || p.categorySlug === "non-veg" || p.category === "Non-Veg Pickles" || p.categorySlug === "non-veg-pickles"));
      return catMatch;
    });

    if (sortBy === "Price: Low to High") result.sort((a, b) => (a.offerPrice || a.price) - (b.offerPrice || b.price));
    if (sortBy === "Price: High to Low") result.sort((a, b) => (b.offerPrice || b.price) - (a.offerPrice || a.price));
    if (sortBy === "Best Rated") result.sort((a, b) => (b.ratings || 0) - (a.ratings || 0));
    if (sortBy === "Latest Arrivals") result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    return result;
  }, [products, selectedCategory, sortBy]);

  const categoryOptions = ["All Pickles", ...categories.map(c => c.name)];

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-pickle-50">
      <Loader2 className="animate-spin text-pickle-600" size={48} />
    </div>
  );

  return (
    <div className="bg-pickle-50 min-h-screen pt-32 pb-16 font-poppins">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 w-full">
        
        {/* Header & Breadcrumbs */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] text-brown-400 mb-4">
            <Link href="/" className="hover:text-pickle-600 transition-colors">Home</Link>
            <ChevronDown size={10} className="-rotate-90 text-brown-200" />
            <span className="text-brown-900">Shop All Pickles</span>
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div>
              <h1 className="text-3xl md:text-5xl font-black text-brown-900 tracking-tighter mb-2 uppercase">The <span className="text-pickle-600">Pickle Shop</span></h1>
              <p className="text-brown-500 font-bold uppercase text-[9px] tracking-[0.3em]">Showing {filteredProducts.length} Premium Varieties</p>
            </div>
            
            <div className="flex items-center gap-3 w-full md:w-auto">
              <button 
                className="md:hidden flex-1 bg-white border border-pickle-100 text-brown-900 px-6 py-3.5 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 shadow-sm active:scale-95"
                onClick={() => setMobileFilterOpen(true)}
              >
                <Filter size={14} /> Filters
              </button>
              
              <div className="relative flex-1 md:flex-none">
                <button 
                  className="w-full bg-white border border-pickle-100 text-brown-900 px-6 py-3.5 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center justify-between gap-4 shadow-sm min-w-[220px] active:scale-95"
                  onClick={() => setSortOpen(!sortOpen)}
                >
                  <div className="flex items-center gap-2">
                    <SlidersHorizontal size={14} className="text-pickle-600" /> 
                    <span>Sort: {sortBy}</span>
                  </div>
                  <ChevronDown size={14} className={`transition-transform duration-300 ${sortOpen ? 'rotate-180' : ''}`} />
                </button>
                
                <AnimatePresence>
                  {sortOpen && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 top-full mt-3 w-full bg-white border border-pickle-50 rounded-xl shadow-2xl z-[50] overflow-hidden p-1.5"
                    >
                      {["Popularity", "Price: Low to High", "Price: High to Low", "Best Rated", "Latest Arrivals"].map((item) => (
                        <button 
                          key={item} 
                          onClick={() => { setSortBy(item); setSortOpen(false); }}
                          className={`w-full text-left px-4 py-2.5 text-[9px] font-black uppercase tracking-widest transition-all rounded-lg ${sortBy === item ? 'bg-pickle-600 text-white shadow-md' : 'text-brown-500 hover:bg-pickle-50 hover:text-pickle-600'}`}
                        >
                          {item}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Desktop Sidebar Filters */}
          <div className="hidden md:block w-64 shrink-0">
            <div className="sticky top-32 bg-white p-6 rounded-2xl shadow-lg border border-pickle-100 space-y-8">
              
              <div>
                <h3 className="text-xs font-black text-brown-900 mb-6 uppercase tracking-[0.2em] flex items-center gap-2">
                  <div className="w-1 h-4 bg-pickle-600 rounded-full" /> Collections
                </h3>
                <div className="space-y-3.5">
                  {categoryOptions.map((cat) => (
                    <label key={cat} className="flex items-center justify-between cursor-pointer group">
                      <input 
                        type="radio" 
                        name="category" 
                        className="hidden" 
                        checked={selectedCategory === cat} 
                        onChange={() => setSelectedCategory(cat)}
                      />
                      <span className={`text-[10px] font-black uppercase tracking-widest transition-all ${selectedCategory === cat ? "text-pickle-600 translate-x-1.5" : "text-brown-400 group-hover:text-brown-700"}`}>{cat}</span>
                      <div className={`w-4 h-4 rounded-md border transition-all flex items-center justify-center ${selectedCategory === cat ? 'border-pickle-600 bg-pickle-600 text-white scale-110 shadow-md' : 'border-pickle-100 group-hover:border-pickle-300'}`}>
                        {selectedCategory === cat && <X size={8} strokeWidth={4} />}
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t border-pickle-50">
                <div className="bg-pickle-50 p-4 rounded-xl border border-pickle-100">
                  <p className="text-[8px] font-black text-pickle-600 uppercase tracking-widest mb-1">Authenticity Guarantee</p>
                  <p className="text-[10px] font-bold text-brown-700 leading-relaxed uppercase">Each jar is prepared with sun-dried ingredients & cold-pressed oils.</p>
                </div>
              </div>

            </div>
          </div>

          {/* Product Grid */}
          <div className="flex-1">
            <AnimatePresence mode="popLayout">
              {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                  {filteredProducts.map((product, index) => (
                    <motion.div
                      key={product._id}
                      layout
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.5, delay: index * 0.05 }}
                      className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-pickle-100 group flex flex-col max-w-[280px] w-full mx-auto p-3"
                    >
                      <div className="relative h-[220px] overflow-hidden rounded-xl bg-pickle-50">
                        <div className="absolute top-2.5 right-2.5 z-20">
                          <motion.button 
                            whileTap={{ scale: 0.8 }}
                            onClick={() => toggleWishlist(product)}
                            className={`w-7 h-7 rounded-xl flex items-center justify-center transition-all shadow-sm ${isInWishlist(product._id) ? 'bg-red-50 text-red-500' : 'bg-white/80 backdrop-blur text-brown-500 hover:bg-pickle-100 hover:text-pickle-600'}`}
                          >
                            <Heart size={14} fill={isInWishlist(product._id) ? "currentColor" : "none"} strokeWidth={3} />
                          </motion.button>
                        </div>

                        <Link href={`/product/${product.slug}`} className="block w-full h-full">
                          <img 
                            src={product.images?.[0] || "/placeholder.jpg"} 
                            alt={product.name} 
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                          />
                        </Link>
                        
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
                          <button 
                            onClick={() => setQuickViewProduct(product)}
                            className="bg-white text-brown-900 px-3 py-1.5 rounded-lg font-bold text-xs flex items-center gap-1.5 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 hover:bg-pickle-50 pointer-events-auto shadow-md"
                          >
                            <Eye size={14} /> Quick View
                          </button>
                        </div>
                        
                        {product.stock <= 0 && (
                          <div className="absolute inset-0 bg-brown-900/60 backdrop-blur-[2px] flex items-center justify-center">
                            <span className="bg-white text-brown-900 px-3 py-1 rounded-lg font-black text-[8px] uppercase tracking-widest shadow-lg">OUT OF STOCK</span>
                          </div>
                        )}
                      </div>

                      <div className="px-1 py-3 flex-1 flex flex-col">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center gap-1 text-amber-400">
                            <Star size={12} fill="currentColor" />
                            <span className="text-[9px] text-gray-500 ml-0.5">({product.reviews || 0})</span>
                          </div>
                          <span className="text-[8px] font-black uppercase text-pickle-600 tracking-wider">{product.category}</span>
                        </div>
                        
                        <Link href={`/product/${product.slug}`}>
                          <h3 className="font-bold text-brown-900 text-sm mb-1 hover:text-pickle-600 transition-colors line-clamp-1 cursor-pointer">{product.name}</h3>
                        </Link>
                        
                        <div className="mt-auto pt-3 border-t border-pickle-50 flex justify-between items-center">
                          <div className="flex flex-col">
                            {product.offerPrice && product.offerPrice < product.price && (
                              <span className="text-[9px] text-brown-300 line-through font-bold mb-0.5">₹{product.price}</span>
                            )}
                            <span className="font-black text-base text-pickle-600">₹{product.offerPrice || product.price}</span>
                          </div>
                          
                          <button 
                            onClick={() => addToCart(product, 1)}
                            disabled={product.stock <= 0}
                            className="bg-pickle-100 text-pickle-700 w-8 h-8 rounded-xl flex items-center justify-center hover:bg-pickle-600 hover:text-white transition-colors shadow-sm disabled:opacity-20 active:scale-95"
                          >
                            <ShoppingBag size={14} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-pickle-100 text-center"
                >
                  <Package size={56} className="text-pickle-100 mb-6" />
                  <h3 className="text-xl font-black text-brown-900 uppercase tracking-tighter mb-2">No Pickles Found</h3>
                  <p className="text-brown-500 font-bold uppercase text-[9px] tracking-[0.3em] mb-8">Adjust your filters to discover our hidden flavors.</p>
                  <button 
                    onClick={() => setSelectedCategory("All Pickles")}
                    className="bg-pickle-600 text-white px-8 py-3.5 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-pickle-700 transition-all shadow-md active:scale-95"
                  >
                    RESET FILTERS
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      <AnimatePresence>
        {mobileFilterOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-brown-900/60 z-[60] md:hidden backdrop-blur-md"
              onClick={() => setMobileFilterOpen(false)}
            />
            <motion.div 
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed inset-y-0 left-0 w-[320px] bg-white z-[70] md:hidden overflow-y-auto"
            >
              <div className="p-8 border-b border-pickle-100 flex justify-between items-center sticky top-0 bg-white z-10">
                <h2 className="font-black text-2xl text-brown-900 uppercase tracking-tighter">
                  Filters
                </h2>
                <button onClick={() => setMobileFilterOpen(false)} className="w-10 h-10 bg-pickle-50 text-brown-600 rounded-xl flex items-center justify-center active:scale-90">
                  <X size={20} strokeWidth={3} />
                </button>
              </div>
              <div className="p-8 space-y-12">
                <div>
                  <h3 className="text-sm font-black text-brown-900 mb-6 uppercase tracking-widest">Collections</h3>
                  <div className="space-y-4">
                    {categoryOptions.map((cat) => (
                      <label key={cat} className="flex items-center justify-between cursor-pointer group">
                        <input 
                          type="radio" 
                          name="mobile-category" 
                          className="hidden" 
                          checked={selectedCategory === cat} 
                          onChange={() => setSelectedCategory(cat)}
                        />
                        <span className={`text-[11px] font-black uppercase tracking-widest ${selectedCategory === cat ? "text-pickle-600" : "text-brown-500"}`}>{cat}</span>
                        <div className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center ${selectedCategory === cat ? 'border-pickle-600 bg-pickle-600 text-white' : 'border-pickle-100'}`}>
                          {selectedCategory === cat && <X size={10} strokeWidth={4} />}
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
                
                <button className="w-full bg-pickle-600 text-white font-black py-6 rounded-[2rem] shadow-xl uppercase tracking-widest text-xs active:scale-95" onClick={() => setMobileFilterOpen(false)}>
                  SHOW {filteredProducts.length} RESULTS
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen bg-pickle-50">
        <Loader2 className="animate-spin text-pickle-600" size={48} />
      </div>
    }>
      <ShopPageContent />
    </Suspense>
  );
}
