"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Heart, ShoppingBag, Star, ShieldCheck, Truck, RefreshCcw, ChevronLeft, Minus, Plus, Loader2 } from "lucide-react";
import { useStore } from "@/context/StoreContext";
import Link from "next/link";
import ReviewSection from "@/components/product/ReviewSection";

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
        const res = await fetch(`/api/products/${slug}`);
        const data = await res.json();
        
        if (res.ok) {
          setProduct(data);
          
          // Fetch related
          const relRes = await fetch(`/api/products?category=${data.categorySlug}`);
          const relData = await relRes.json();
          setRelatedProducts(relData.filter((p: any) => p._id !== data._id).slice(0, 4));
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
      <div className="min-h-screen flex items-center justify-center bg-pickle-50">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-brown-900 mb-4">Product Not Found</h2>
          <Link href="/shop" className="text-pickle-600 font-bold hover:underline">Return to Shop</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen pt-32 pb-24">
      <div className="container mx-auto px-4 md:px-8">
        {/* Back Button & Breadcrumbs */}
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => router.back()} className="w-10 h-10 rounded-full border border-pickle-100 flex items-center justify-center hover:bg-pickle-50 transition-colors">
            <ChevronLeft size={20} />
          </button>
          <div className="flex gap-2 text-sm text-brown-600 font-medium">
            <Link href="/" className="hover:text-pickle-600">Home</Link>
            <span>/</span>
            <Link href="/shop" className="hover:text-pickle-600">Shop</Link>
            <span>/</span>
            <span className="text-brown-900">{product.title}</span>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 mb-20">
          {/* Image Gallery */}
          <div className="w-full lg:w-1/2">
            <div className="relative aspect-square rounded-3xl overflow-hidden bg-pickle-50 border border-pickle-100">
              <motion.img 
                key={activeImage}
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                src={product.images?.[activeImage] || "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?q=80&w=1470&auto=format&fit=crop"} 
                alt={product.title} 
                className="w-full h-full object-cover" 
              />
              {product.badge && (
                <div className="absolute top-6 left-6 bg-pickle-600 text-white px-4 py-1.5 rounded-full text-xs font-bold shadow-lg">
                  {product.badge}
                </div>
              )}
            </div>
            
            {/* Thumbnails (Real) */}
            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-4 mt-4">
                {product.images.map((img: string, i: number) => (
                  <div 
                    key={i} 
                    onClick={() => setActiveImage(i)}
                    className={`aspect-square rounded-xl overflow-hidden border-2 cursor-pointer transition-all ${activeImage === i ? 'border-pickle-500' : 'border-transparent hover:border-pickle-200'}`}
                  >
                    <img src={img} alt="" className={`w-full h-full object-cover ${activeImage !== i ? 'opacity-60' : ''}`} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="w-full lg:w-1/2">
            <div className="mb-6">
              <div className="flex items-center gap-4 mb-4">
                <span className="bg-pickle-100 text-pickle-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">{product.category}</span>
                <div className="flex items-center gap-1 text-amber-400">
                  <Star size={16} fill="currentColor" />
                  <span className="text-sm text-brown-900 font-bold">{product.ratings || 4.5} <span className="font-medium text-brown-500">({product.reviews || 0} Reviews)</span></span>
                </div>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-brown-900 mb-4">{product.title}</h1>
              <p className="text-brown-600 text-lg leading-relaxed mb-6 font-medium">
                {product.description}
              </p>
              
              <div className="flex items-end gap-4 mb-8">
                <span className="text-4xl font-bold text-pickle-600">₹{product.offerPrice || product.price}</span>
                {product.offerPrice && product.offerPrice < product.price && (
                  <span className="text-xl text-gray-400 line-through mb-1">₹{product.price}</span>
                )}
              </div>

              {/* Weight Selector */}
              <div className="mb-8">
                <h4 className="font-bold text-brown-900 mb-4">Select Weight</h4>
                <div className="flex gap-4">
                  {["250g", "400g", "500g", "1kg"].map((w) => (
                    <button 
                      key={w}
                      onClick={() => setSelectedWeight(w)}
                      className={`px-6 py-3 rounded-xl font-bold transition-all border-2 ${selectedWeight === w ? 'border-pickle-600 bg-pickle-50 text-pickle-600' : 'border-pickle-100 text-brown-600 hover:border-pickle-300'}`}
                    >
                      {w}
                    </button>
                  ))}
                </div>
              </div>

                <div className="flex flex-col sm:flex-row gap-4 mb-10">
                  <div className="flex items-center bg-pickle-50 rounded-xl px-4 py-3 border border-pickle-100">
                    <button 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-8 h-8 flex items-center justify-center text-brown-600 hover:text-pickle-600"
                    >
                      <Minus size={20} />
                    </button>
                    <span className="w-12 text-center font-bold text-lg text-brown-900">{quantity}</span>
                    <button 
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-8 h-8 flex items-center justify-center text-brown-600 hover:text-pickle-600"
                    >
                      <Plus size={20} />
                    </button>
                  </div>
                  <button 
                    onClick={() => addToCart(product, quantity)}
                    className="flex-1 bg-brown-900 text-white font-bold py-4 rounded-xl shadow-xl shadow-brown-900/10 hover:bg-brown-800 transition-all flex items-center justify-center gap-3"
                  >
                    <ShoppingBag size={20} /> Add to Cart
                  </button>
                  <button 
                    onClick={() => {
                      addToCart(product, quantity);
                      router.push("/checkout");
                    }}
                    className="flex-1 bg-pickle-600 text-white font-bold py-4 rounded-xl shadow-xl shadow-pickle-600/20 hover:bg-pickle-700 transition-all flex items-center justify-center gap-3"
                  >
                    Buy Now
                  </button>
                  <button 
                    onClick={() => toggleWishlist(product)}
                    className={`w-14 h-14 rounded-xl border-2 flex items-center justify-center transition-all ${isInWishlist(product._id) ? 'bg-red-50 border-red-500 text-red-500' : 'border-pickle-100 text-brown-500 hover:border-red-500 hover:text-red-500'}`}
                  >
                    <Heart size={24} fill={isInWishlist(product._id) ? "currentColor" : "none"} />
                  </button>
                </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-4 border-t border-pickle-100 pt-8">
                <div className="flex flex-col items-center text-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-pickle-50 flex items-center justify-center text-pickle-600">
                    <ShieldCheck size={20} />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-brown-700">100% Natural</span>
                </div>
                <div className="flex flex-col items-center text-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-pickle-50 flex items-center justify-center text-pickle-600">
                    <Truck size={20} />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-brown-700">Fast Delivery</span>
                </div>
                <div className="flex flex-col items-center text-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-pickle-50 flex items-center justify-center text-pickle-600">
                    <RefreshCcw size={20} />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-brown-700">Easy Returns</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        <div>
          <h2 className="text-3xl font-bold text-brown-900 mb-8">You May Also Like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {relatedProducts.map((p) => (
              <Link key={p._id} href={`/product/${p.slug}`} className="group">
                <div className="bg-white rounded-2xl border border-pickle-100 overflow-hidden shadow-sm hover:shadow-xl transition-all">
                  <div className="aspect-square bg-pickle-50 overflow-hidden">
                    <img src={p?.images?.[0] || "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?q=80&w=1470&auto=format&fit=crop"} alt={p.title || p.name || "Product"} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  <div className="p-4">
                    <h4 className="font-bold text-brown-900 group-hover:text-pickle-600 transition-colors mb-1">{p.title || p.name}</h4>
                    <p className="font-bold text-pickle-600">₹{p.offerPrice || p.price}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Reviews Section */}
        <ReviewSection productSlug={slug} />
      </div>
    </div>
  );
}
