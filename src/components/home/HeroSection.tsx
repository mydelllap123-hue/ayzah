"use client";

import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation, EffectFade } from "swiper/modules";
import { Loader2, ShoppingBag, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/effect-fade";

export default function HeroSection() {
  const [banners, setBanners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await fetch("/api/banners");
        const result = await res.json();
        if (result.success && Array.isArray(result.data)) {
          // Only show active banners
          setBanners(result.data.filter((b: any) => b.active));
        }
      } catch (error) {
        console.error("Failed to fetch homepage banners:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBanners();
  }, []);

  if (loading) {
    return (
      <div className="bg-white pt-20 pb-8 overflow-hidden font-poppins">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 w-full">
          <div className="relative max-w-[1400px] mx-auto bg-pickle-50 rounded-[20px] md:rounded-[30px] aspect-[16/6.5] md:aspect-[3.2/1] flex items-center justify-center border border-pickle-100">
            <Loader2 className="animate-spin text-pickle-600" size={32} />
          </div>
        </div>
      </div>
    );
  }

  // Fallback if no active banners
  if (banners.length === 0) {
    return (
      <section className="bg-white pt-20 pb-8 overflow-hidden font-poppins">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 w-full">
          <div className="relative max-w-[1400px] mx-auto bg-pickle-50 rounded-[20px] md:rounded-[30px] aspect-[16/6.5] md:aspect-[3.2/1] flex flex-col items-center justify-center text-center p-6 border border-pickle-100">
            <h1 className="text-xl md:text-3xl lg:text-4xl font-black text-brown-900 mb-2 tracking-tighter uppercase">Authentic Kerala Pickles</h1>
            <p className="text-brown-600 max-w-xl font-bold uppercase text-[8px] md:text-[9px] tracking-[0.3em] mb-6">Handmade with tradition • Preserved with love</p>
            <Link href="/shop" className="bg-pickle-600 text-white px-5 py-3 rounded-xl font-black shadow-lg shadow-pickle-600/10 hover:bg-pickle-700 transition-all flex items-center gap-2 text-xs tracking-wider active:scale-95">
              <ShoppingBag size={14} /> START SHOPPING
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white pt-20 pb-8 overflow-hidden font-poppins relative">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 w-full">
        <div className="relative max-w-[1400px] mx-auto group">
          <Swiper
            spaceBetween={0}
            effect={"fade"}
            centeredSlides={true}
            loop={true}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            pagination={{
              el: ".hero-swiper-pagination",
              clickable: true,
            }}
            navigation={{
              nextEl: ".hero-next",
              prevEl: ".hero-prev",
            }}
            modules={[Autoplay, Pagination, Navigation, EffectFade]}
            className="rounded-[20px] md:rounded-[30px] shadow-xl shadow-brown-900/5 border border-pickle-100 overflow-hidden"
          >
            {(Array.isArray(banners) ? banners : []).map((banner) => (
              <React.Fragment key={banner._id}>
                {(Array.isArray(banner.images) ? banner.images : []).map((img: string, idx: number) => (
                  <SwiperSlide key={`${banner._id}-${idx}`} data-swiper-autoplay={banner.speed || 5000}>
                    <div className="relative aspect-[16/6.5] md:aspect-[3.2/1] bg-pickle-50 overflow-hidden">
                      <img
                        src={img || "/placeholder.jpg"}
                        alt={banner.title || "banner"}
                        className="w-full h-full object-cover"
                      />
                      {/* Gradient Overlay for luxury feel and high contrast readability */}
                      <div className="absolute inset-0 bg-gradient-to-t from-brown-950/60 via-brown-950/10 to-transparent pointer-events-none" />
                      
                      {/* Banner Content */}
                      <div className="absolute bottom-6 left-6 md:bottom-10 md:left-12 z-20 pr-6">
                        <motion.h2 
                          initial={{ y: 20, opacity: 0 }}
                          whileInView={{ y: 0, opacity: 1 }}
                          className="text-white text-lg md:text-3xl lg:text-4xl font-black tracking-tight drop-shadow-lg uppercase leading-tight max-w-xl"
                        >
                          {banner.title}
                        </motion.h2>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </React.Fragment>
            ))}
          </Swiper>

          {/* Custom Navigation */}
          {banners.length > 0 && (
            <>
              <button className="hero-prev absolute left-3 md:left-6 top-1/2 -translate-y-1/2 z-30 w-8 h-8 md:w-11 md:h-11 bg-white/80 backdrop-blur-md text-brown-900 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-pickle-600 hover:text-white hover:scale-105 shadow-md border border-pickle-100 active:scale-95 cursor-pointer">
                <ChevronLeft size={18} strokeWidth={2.5} />
              </button>
              <button className="hero-next absolute right-3 md:right-6 top-1/2 -translate-y-1/2 z-30 w-8 h-8 md:w-11 md:h-11 bg-white/80 backdrop-blur-md text-brown-900 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-pickle-600 hover:text-white hover:scale-105 shadow-md border border-pickle-100 active:scale-95 cursor-pointer">
                <ChevronRight size={18} strokeWidth={2.5} />
              </button>
            </>
          )}

          {/* Single Clean Centered Pagination Container */}
          <div className="hero-swiper-pagination flex justify-center items-center gap-1.5 absolute bottom-4 left-1/2 -translate-x-1/2 z-30 pointer-events-auto"></div>
        </div>
      </div>

      <style jsx global>{`
        /* Target ONLY our hero slider pagination bullets to prevent global leakage */
        .hero-swiper-pagination .swiper-pagination-bullet {
          width: 6px !important;
          height: 6px !important;
          background: rgba(255, 255, 255, 0.45) !important;
          opacity: 1 !important;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1) !important;
          border: none !important;
          margin: 0 3px !important;
          cursor: pointer !important;
        }
        .hero-swiper-pagination .swiper-pagination-bullet-active {
          width: 20px !important;
          border-radius: 4px !important;
          background: #ea580c !important; /* Soft orange/mango to match site theme */
          box-shadow: 0 2px 8px rgba(234, 88, 12, 0.4) !important;
        }
      `}</style>
    </section>
  );
}
