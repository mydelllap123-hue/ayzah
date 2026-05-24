"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star,
  ShieldCheck,
  Send,
  ThumbsUp,
  MessageCircle,
  Lock,
  Loader2,
  CheckCircle,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useStore } from "@/context/StoreContext";
import toast from "react-hot-toast";

interface Review {
  _id: string;
  userName: string;
  userImage: string;
  rating: number;
  title: string;
  body: string;
  verifiedPurchase: boolean;
  createdAt: string;
}

interface ReviewStats {
  reviews: Review[];
  totalCount: number;
  avgRating: number;
  breakdown: { star: number; count: number }[];
}

interface ReviewSectionProps {
  productSlug: string;
}

function StarPicker({
  rating,
  onChange,
  readonly = false,
  size = 24,
}: {
  rating: number;
  onChange?: (v: number) => void;
  readonly?: boolean;
  size?: number;
}) {
  const [hovered, setHovered] = useState(0);
  const display = readonly ? rating : hovered || rating;

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((s) => (
        <button
          key={s}
          type="button"
          disabled={readonly}
          onClick={() => onChange?.(s)}
          onMouseEnter={() => !readonly && setHovered(s)}
          onMouseLeave={() => !readonly && setHovered(0)}
          className={`transition-transform ${!readonly ? "hover:scale-110 cursor-pointer" : "cursor-default"}`}
        >
          <Star
            size={size}
            className={
              s <= display
                ? "text-amber-400 fill-amber-400"
                : "text-gray-300 fill-gray-100"
            }
          />
        </button>
      ))}
    </div>
  );
}

function RatingBar({ star, count, total }: { star: number; count: number; total: number }) {
  const pct = total > 0 ? (count / total) * 100 : 0;
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs font-bold text-brown-700 w-4 text-right">{star}</span>
      <Star size={11} className="text-amber-400 fill-amber-400 flex-shrink-0" />
      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="h-full bg-amber-400 rounded-full"
        />
      </div>
      <span className="text-xs text-brown-400 w-6 text-right">{count}</span>
    </div>
  );
}

function ReviewCard({ review }: { review: Review }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl border border-pickle-100 p-5 shadow-sm"
    >
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="flex-shrink-0">
          {review.userImage ? (
            <img
              src={review.userImage}
              alt={review.userName}
              className="w-11 h-11 rounded-full object-cover border-2 border-pickle-100"
            />
          ) : (
            <div className="w-11 h-11 rounded-full bg-brown-900 flex items-center justify-center text-white font-bold text-sm">
              {review.userName.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <span className="font-bold text-brown-900 text-sm">{review.userName}</span>
          </div>

          <div className="flex items-center gap-3 mb-2">
            <StarPicker rating={review.rating} readonly size={14} />
            <span className="text-[11px] text-brown-400">
              {new Date(review.createdAt).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
          </div>

          {review.title && (
            <p className="font-bold text-brown-800 text-sm mb-1">{review.title}</p>
          )}
          <p className="text-brown-600 text-sm leading-relaxed">{review.body}</p>
        </div>
      </div>
    </motion.div>
  );
}

export default function ReviewSection({ productSlug }: ReviewSectionProps) {
  const { data: session } = useSession();
  const { setIsLoginOpen } = useStore();

  const [stats, setStats] = useState<ReviewStats | null>(null);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Form state
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  const fetchReviews = useCallback(async () => {
    setLoadingReviews(true);
    try {
      const res = await fetch(`/api/reviews?productSlug=${productSlug}&status=approved`);
      const data = await res.json();
      if (res.ok) setStats(data);
    } catch {
      // silent
    } finally {
      setLoadingReviews(false);
    }
  }, [productSlug]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!session?.user) {
      setIsLoginOpen(true);
      return;
    }

    if (rating === 0) {
      toast.error("Please select a star rating");
      return;
    }

    if (body.trim().length < 10) {
      toast.error("Review must be at least 10 characters");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productSlug, rating, title, reviewBody: body }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to submit");
      }

      toast.success(data.message);
      setSubmitted(true);
      setRating(0);
      setTitle("");
      setBody("");
    } catch (err: any) {
      toast.error(err.message || "Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  const totalReviews = stats?.totalCount ?? 0;
  const avgRating = stats?.avgRating ?? 0;

  return (
    <section className="mt-16 pt-12 border-t border-pickle-100">
      <div className="flex flex-col md:flex-row gap-12">
        {/* ── Left: Summary ── */}
        <div className="md:w-72 flex-shrink-0">
          <h2 className="text-2xl font-bold text-brown-900 mb-6 flex items-center gap-2">
            <MessageCircle size={22} className="text-pickle-600" />
            Customer Reviews
          </h2>

          {/* Avg Rating Block */}
          <div className="bg-white rounded-2xl border border-pickle-100 p-6 shadow-sm mb-4">
            <div className="text-center mb-4">
              <p className="text-5xl font-bold text-brown-900">
                {avgRating > 0 ? avgRating.toFixed(1) : "—"}
              </p>
              <StarPicker rating={Math.round(avgRating)} readonly size={20} />
              <p className="text-sm text-brown-500 font-medium mt-2">
                {totalReviews} {totalReviews === 1 ? "review" : "reviews"}
              </p>
            </div>

            {/* Breakdown bars */}
            <div className="space-y-1.5">
              {[5, 4, 3, 2, 1].map((star) => {
                const bar = stats?.breakdown?.find((b) => b.star === star);
                return (
                  <RatingBar
                    key={star}
                    star={star}
                    count={bar?.count ?? 0}
                    total={totalReviews}
                  />
                );
              })}
            </div>
          </div>

          {/* Write Review CTA */}
          {!submitted && (
            <div className="bg-pickle-50 rounded-2xl border border-pickle-200 p-4 text-center">
              <ThumbsUp size={24} className="text-pickle-600 mx-auto mb-2" />
              <p className="text-sm font-bold text-brown-800 mb-1">Share your experience</p>
              <p className="text-xs text-brown-500">Your review helps other customers</p>
            </div>
          )}
        </div>

        {/* ── Right: Reviews + Form ── */}
        <div className="flex-1 space-y-6">
          {/* Submit Form */}
          <div className="bg-white rounded-2xl border border-pickle-100 shadow-sm overflow-hidden">
            <div className="bg-gradient-to-r from-pickle-600 to-pickle-700 px-6 py-4">
              <h3 className="text-white font-bold text-base">Write a Review</h3>
              <p className="text-pickle-100 text-xs mt-0.5">
                {session?.user
                  ? "Share your honest opinion about this product"
                  : "Log in to write a review"}
              </p>
            </div>

            <div className="p-6">
              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-8"
                >
                  <CheckCircle size={48} className="text-green-500 mx-auto mb-3" />
                  <h4 className="text-lg font-bold text-brown-900 mb-1">Review Submitted!</h4>
                  <p className="text-brown-500 text-sm">
                    Thank you! Your review will appear after admin approval.
                  </p>
                </motion.div>
              ) : !session?.user ? (
                <div className="text-center py-8">
                  <Lock size={36} className="text-brown-300 mx-auto mb-3" />
                  <p className="text-brown-600 font-bold mb-1">Login required</p>
                  <p className="text-brown-400 text-sm mb-4">
                    You need to be logged in to submit a review
                  </p>
                  <button
                    onClick={() => setIsLoginOpen(true)}
                    className="bg-pickle-600 text-white font-bold px-6 py-2.5 rounded-xl hover:bg-pickle-700 transition-colors text-sm"
                  >
                    Login / Sign Up
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Star Rating */}
                  <div>
                    <label className="block text-sm font-bold text-brown-800 mb-2">
                      Your Rating <span className="text-red-500">*</span>
                    </label>
                    <StarPicker rating={rating} onChange={setRating} size={28} />
                    {rating > 0 && (
                      <p className="text-xs text-pickle-600 font-medium mt-1">
                        {["", "Poor", "Fair", "Good", "Very Good", "Excellent"][rating]}
                      </p>
                    )}
                  </div>

                  {/* Review Title */}
                  <div>
                    <label className="block text-sm font-bold text-brown-800 mb-1.5">
                      Review Title <span className="text-brown-400 font-normal">(optional)</span>
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      maxLength={120}
                      placeholder="Summarize your experience…"
                      className="w-full px-4 py-2.5 bg-pickle-50 border border-pickle-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pickle-500/20 focus:border-pickle-400 transition-all"
                    />
                  </div>

                  {/* Review Body */}
                  <div>
                    <label className="block text-sm font-bold text-brown-800 mb-1.5">
                      Your Review <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={body}
                      onChange={(e) => setBody(e.target.value)}
                      rows={4}
                      minLength={10}
                      maxLength={1000}
                      required
                      placeholder="Tell others what you liked or didn't like about this product…"
                      className="w-full px-4 py-2.5 bg-pickle-50 border border-pickle-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pickle-500/20 focus:border-pickle-400 transition-all resize-none"
                    />
                    <p className="text-xs text-brown-400 text-right mt-1">{body.length}/1000</p>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full flex items-center justify-center gap-2 bg-brown-900 text-white font-bold py-3 rounded-xl hover:bg-brown-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        Submitting…
                      </>
                    ) : (
                      <>
                        <Send size={16} />
                        Submit Review
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Reviews List */}
          {loadingReviews ? (
            <div className="text-center py-10">
              <Loader2 size={28} className="animate-spin text-pickle-500 mx-auto" />
            </div>
          ) : (stats?.reviews ?? []).length === 0 ? (
            <div className="bg-white rounded-2xl border border-pickle-100 p-10 text-center">
              <MessageCircle size={36} className="text-brown-200 mx-auto mb-3" />
              <p className="text-brown-500 font-bold">No reviews yet</p>
              <p className="text-brown-400 text-sm mt-1">Be the first to review this product!</p>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm font-bold text-brown-500">
                {totalReviews} verified review{totalReviews !== 1 ? "s" : ""}
              </p>
              <AnimatePresence>
                {(stats?.reviews ?? []).map((review) => (
                  <ReviewCard key={review._id} review={review} />
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
