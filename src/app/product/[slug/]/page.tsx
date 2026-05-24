"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Heart, ShoppingBag, Star, ShieldCheck, Truck, RefreshCcw, ChevronLeft, Minus, Plus, Loader2, Package } from "lucide-react";
import { useStore } from "@/context/StoreContext";
import Link from "next/link";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const { addToCart, toggleWishlist, isInWishlist } = useStore();
  const [quantity, setQuantity] = useState(1);
  const [selectedWeight, setSelectedWeight] = useState("500g");
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/admin/products`);
        const result = await res.json();
        
        if (result.success) {
          const currentProd = result.data.find((p: any) => p.slug === slug);
          if (currentProd) {
            setProduct(currentProd);
            
            // Fetch related
            const filtered = result.data.filter((p: any) => 
              p.category === currentProd.category && p._id !== currentProd._id
            ).slice(0, 4);
            setRelatedProducts(filtered);
          }
        }
      } catch (error) {
        console.error("Failed to fetch product:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-pickle-50">
        <Loader2 className="animate-spin text-pickle-600" size={50} />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-pickle-50 p-8 text-center">
        <Package size={64} className="text-pickle-200 mb-6" />
        <h1 className="text-4xl font-black text-brown-900 mb-4 tracking-tighter uppercase">Product Not Found</h1>
        <p className="text-brown-500 font-bold uppercase text-[10px] tracking-[0.3em] mb-10">The product you are looking for does not exist or has been removed.</p>
        <Link href="/shop" className="bg-pickle-600 text-white px-10 py-5 rounded-[2rem] font-black shadow-xl shadow-pickle-600/20 hover:bg-pickle-700 transition-all">
          BACK TO SHOP
        </Link>
      </div>
    );
  }

  const productName = product.name || product.title || "Unnamed Product";

  return (
    <div className="bg-white min-h-screen pt-40 pb-24 font-poppins">
      <div className="container mx-auto px-4 md:px-8">
        {/* Back Button & Breadcrumbs */}
        <div className="flex items-center gap-6 mb-12">
          <button onClick={() => router.back()} className="w-12 h-12 rounded-2xl border border-pickle-100 flex items-center justify-center hover:bg-pickle-50 transition-all active:scale-90 shadow-sm">
            <ChevronLeft size={24} strokeWidth={3} className="text-brown-900" />
          </button>
          <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-brown-400">
            <Link href="/" className="hover:text-pickle-600 transition-colors">Home</Link>
            <ChevronLeft size={12} className="-rotate-90 text-brown-200" />
            <Link href="/shop" className="hover:text-pickle-600 transition-colors">Shop</Link>
            <ChevronLeft size={12} className="-rotate-90 text-brown-200" />
            <span className="text-brown-900">{productName}</span>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-20 mb-32">
          {/* Image Gallery */}
          <div className="w-full lg:w-1/2">
            <div className="relative aspect-square rounded-[3rem] overflow-hidden bg-pickle-50 border border-pickle-100 shadow-2xl">
              <motion.img 
                key={activeImage}
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                src={product.images?.[activeImage] || "/placeholder.jpg"} 
                alt={productName} 
                className="w-full h-full object-cover" 
              />
              <div className="absolute top-8 left-8 flex gap-3">
                <span className="bg-pickle-600 text-white px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl">
                  {product.category || "Collection"}
                </span>
                {product.stock <= 0 && (
                   <span className="bg-red-500 text-white px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl">
                    Sold Out
                  </span>
                )}
              </div>
            </div>
            
            {/* Thumbnails */}
            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-6 mt-8">
                {product.images.map((img: string, i: number) => (
                  <div 
                    key={i} 
                    onClick={() => setActiveImage(i)}
                    className={`aspect-square rounded-2xl overflow-hidden border-4 cursor-pointer transition-all ${activeImage === i ? 'border-pickle-600 shadow-xl' : 'border-transparent hover:border-pickle-200 opacity-60'}`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="w-full lg:w-1/2">
            <div className="space-y-10">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5 text-amber-500 bg-amber-50 px-4 py-2 rounded-full border border-amber-100 shadow-sm">
                    <Star size={16} fill="currentColor" />
                    <span className="text-xs text-amber-900 font-black tracking-widest">{product.ratings || 4.8} <span className="font-bold text-amber-500/50">({product.reviews || 128} Reviews)</span></span>
                  </div>
                </div>
                <h1 className="text-5xl md:text-7xl font-black text-brown-900 tracking-tighter uppercase leading-[0.9]">{productName}</h1>
                <p className="text-brown-500 text-lg leading-relaxed font-bold uppercase tracking-widest max-w-xl">
                  {product.description || "Discover the authentic taste of Kerala with our premium handmade pickle."}
                </p>
              </div>
              
              <div className="flex items-baseline gap-6 border-b border-pickle-50 pb-10">
                <span className="text-6xl font-black text-pickle-600 tracking-tighter">₹{product.offerPrice || product.price}</span>
                {product.offerPrice && product.offerPrice < product.price && (
                  <span className="text-2xl text-brown-300 line-through font-black tracking-tighter">₹{product.price}</span>
                )}
                <span className="ml-auto text-brown-400 font-black text-[10px] uppercase tracking-widest">Incl. of all taxes</span>
              </div>

              {/* Weight Selector */}
              <div className="space-y-6">
                <h4 className="text-[10px] font-black text-brown-900 uppercase tracking-[0.3em]">Select Weight Variant</h4>
                <div className="flex flex-wrap gap-4">
                  {["250g", "400g", "500g", "1kg"].map((w) => (
                    <button 
                      key={w}
                      onClick={() => setSelectedWeight(w)}
                      className={`px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all border-4 ${selectedWeight === w ? 'border-pickle-600 bg-pickle-50 text-pickle-600 shadow-xl' : 'border-pickle-50 text-brown-400 hover:border-pickle-100 hover:text-brown-700'}`}
                    >
                      {w}
                    </button>
                  ))}
                </div>
              </div>

                <div className="flex flex-col sm:flex-row gap-6 pt-6">
                  <div className="flex items-center bg-pickle-50 rounded-2xl px-6 py-4 border border-pickle-100 shadow-inner">
                    <button 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 flex items-center justify-center text-brown-400 hover:text-pickle-600 transition-colors"
                    >
                      <Minus size={24} strokeWidth={3} />
                    </button>
                    <span className="w-16 text-center font-black text-2xl text-brown-900">{quantity}</span>
                    <button 
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-10 h-10 flex items-center justify-center text-brown-400 hover:text-pickle-600 transition-colors"
                    >
                      <Plus size={24} strokeWidth={3} />
                    </button>
                  </div>
                  
                  <button 
                    onClick={() => addToCart(product, quantity)}
                    disabled={product.stock <= 0}
                    className="flex-1 bg-brown-900 text-white font-black py-6 rounded-[2rem] shadow-2xl shadow-brown-900/20 hover:bg-pickle-600 transition-all flex items-center justify-center gap-4 active:scale-95 disabled:opacity-20 uppercase tracking-widest text-xs"
                  >
                    <ShoppingBag size={24} strokeWidth={2.5} /> Add to Cart
                  </button>
                  
                  <button 
                    onClick={() => toggleWishlist(product)}
                    className={`w-20 h-20 rounded-[2rem] border-4 flex items-center justify-center transition-all ${isInWishlist(product._id) ? 'bg-red-500 border-red-500 text-white shadow-red-500/20' : 'border-pickle-50 text-brown-200 hover:border-red-500 hover:text-red-500'} shadow-2xl`}
                  >
                    <Heart size={32} fill={isInWishlist(product._id) ? "currentColor" : "none"} strokeWidth={2.5} />
                  </button>
                </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-6 pt-12 border-t border-pickle-50">
                <div className="flex flex-col items-center text-center gap-3 group">
                  <div className="w-14 h-14 rounded-2xl bg-pickle-50 flex items-center justify-center text-pickle-600 group-hover:bg-pickle-600 group-hover:text-white transition-all shadow-sm">
                    <ShieldCheck size={28} />
                  </div>
                  <span className="text-[9px] font-black uppercase tracking-widest text-brown-700">100% Homemade</span>
                </div>
                <div className="flex flex-col items-center text-center gap-3 group">
                  <div className="w-14 h-14 rounded-2xl bg-pickle-50 flex items-center justify-center text-pickle-600 group-hover:bg-pickle-600 group-hover:text-white transition-all shadow-sm">
                    <Truck size={28} />
                  </div>
                  <span className="text-[9px] font-black uppercase tracking-widest text-brown-700">Fast Shipping</span>
                </div>
                <div className="flex flex-col items-center text-center gap-3 group">
                  <div className="w-14 h-14 rounded-2xl bg-pickle-50 flex items-center justify-center text-pickle-600 group-hover:bg-pickle-600 group-hover:text-white transition-all shadow-sm">
                    <RefreshCcw size={28} />
                  </div>
                  <span className="text-[9px] font-black uppercase tracking-widest text-brown-700">Purity Assured</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        <div className="pt-32 border-t border-pickle-50">
          <div className="flex justify-between items-end mb-16">
            <div>
              <span className="text-pickle-600 font-black uppercase tracking-[0.3em] text-[10px] mb-4 block">Handpicked For You</span>
              <h2 className="text-4xl md:text-6xl font-black text-brown-900 uppercase tracking-tighter">You May <span className="text-pickle-600">Also Like</span></h2>
            </div>
            <Link href="/shop" className="text-[10px] font-black uppercase tracking-widest text-brown-400 hover:text-pickle-600 transition-colors border-b-2 border-pickle-50 pb-2">View All Shop</Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {relatedProducts.map((p) => (
              <Link key={p._id} href={`/product/${p.slug}`} className="group">
                <div className="bg-white rounded-[3rem] border border-pickle-100 overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-700 p-4">
                  <div className="aspect-square bg-pickle-50 rounded-[2rem] overflow-hidden shadow-inner">
                    <img src={p.images?.[0] || "/placeholder.jpg"} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                  </div>
                  <div className="px-4 py-8">
                    <h4 className="font-black text-brown-900 text-xl uppercase tracking-tight group-hover:text-pickle-600 transition-colors mb-3 line-clamp-1">{p.name || p.title}</h4>
                    <p className="font-black text-2xl text-pickle-600 tracking-tighter">₹{p.offerPrice || p.price}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
