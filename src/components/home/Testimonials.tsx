"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Quote, Loader2, MessageSquare, ShieldCheck } from "lucide-react";

interface Review {
  _id: string;
  userName: string;
  userImage: string;
  rating: number;
  title?: string;
  body: string;
  verifiedPurchase: boolean;
  createdAt: string;
}

export default function Testimonials() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeReviews = async () => {
      try {
        const res = await fetch("/api/reviews?status=approved");
        const data = await res.json();
        // Limit to latest 3 approved reviews for the home grid
        if (data.reviews && Array.isArray(data.reviews)) {
          setReviews(data.reviews.slice(0, 3));
        }
      } catch (error) {
        console.error("Testimonials: Failed to fetch reviews", error);
      } finally {
        setLoading(false);
      }
    };
    fetchHomeReviews();
  }, []);

  return (
    <section className="py-16 bg-pickle-50 relative overflow-hidden font-poppins">
      {/* Decorative background details */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-pickle-100/10 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2"></div>
      
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 w-full">
        <div className="text-center mb-12">
          <span className="text-pickle-600 font-bold uppercase tracking-widest text-[10px] mb-2 block">Real Customer Stories</span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-2xl md:text-3xl font-black text-brown-900 mb-2 tracking-tight uppercase"
          >
            Happy <span className="text-pickle-500">Foodies</span>
          </motion.h2>
          <div className="w-12 h-1 bg-pickle-500 mx-auto rounded-full"></div>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="animate-spin text-pickle-600" size={32} />
          </div>
        ) : reviews.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 border border-pickle-100/60 shadow-sm text-center max-w-xl mx-auto">
            <MessageSquare size={36} className="text-pickle-200 mx-auto mb-3" />
            <h3 className="font-bold text-brown-900 text-sm mb-1">Be the First to Share Your Story!</h3>
            <p className="text-brown-500 text-xs leading-relaxed max-w-xs mx-auto">We value your opinion. Purchase our delicious pickles and leave your verified review on the product details page!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <AnimatePresence>
              {reviews.map((test, index) => (
                <motion.div
                  key={test._id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.15 }}
                  className="bg-white p-6 rounded-2xl shadow-sm border border-pickle-100 relative group hover:shadow-xl hover:border-pickle-300/60 transition-all duration-500 flex flex-col justify-between"
                >
                  <Quote size={28} className="text-pickle-100/60 absolute top-5 right-5 group-hover:text-pickle-200/60 transition-colors pointer-events-none" />
                  
                  <div>
                    {/* Stars */}
                    <div className="flex gap-0.5 text-amber-400 mb-3.5">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={13} fill={i < test.rating ? "currentColor" : "none"} className={i < test.rating ? "text-amber-400" : "text-gray-200"} />
                      ))}
                    </div>
                    
                    {test.title && (
                      <h4 className="font-bold text-brown-900 text-xs md:text-sm mb-1.5 line-clamp-1">"{test.title}"</h4>
                    )}
                    <p className="text-brown-700 mb-6 relative z-10 leading-relaxed text-xs md:text-sm font-medium">
                      "{test.body}"
                    </p>
                  </div>
                  
                  {/* User info */}
                  <div className="flex items-center gap-3 border-t border-pickle-100/50 pt-4 mt-auto">
                    {test.userImage ? (
                      <img src={test.userImage} alt={test.userName} className="w-9 h-9 rounded-full object-cover border border-pickle-200" />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-brown-900 text-white flex items-center justify-center font-bold text-xs shrink-0">
                        {test.userName.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="min-w-0">
                      <h4 className="font-bold text-brown-900 text-xs truncate">{test.userName}</h4>
                      {test.verifiedPurchase ? (
                        <p className="text-[9px] text-green-700 font-bold flex items-center gap-0.5 bg-green-50 px-1.5 py-0.5 rounded-full border border-green-200/50 mt-0.5 w-max">
                          <ShieldCheck size={9} /> Verified Buyer
                        </p>
                      ) : (
                        <p className="text-[9px] text-pickle-600 font-bold mt-0.5">Valued Customer</p>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </section>
  );
}
