"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star,
  CheckCircle,
  XCircle,
  Trash2,
  Filter,
  Search,
  RefreshCw,
  MessageSquare,
  ShieldCheck,
  Clock,
  ThumbsUp,
  AlertTriangle,
} from "lucide-react";
import toast from "react-hot-toast";

interface Review {
  _id: string;
  productSlug: string;
  userName: string;
  userEmail: string;
  userImage: string;
  rating: number;
  title: string;
  body: string;
  status: "pending" | "approved" | "rejected";
  verifiedPurchase: boolean;
  featured: boolean;
  createdAt: string;
}

const STATUS_CONFIG = {
  pending: {
    label: "Pending",
    color: "bg-amber-100 text-amber-700 border border-amber-200",
    icon: Clock,
  },
  approved: {
    label: "Approved",
    color: "bg-green-100 text-green-700 border border-green-200",
    icon: CheckCircle,
  },
  rejected: {
    label: "Rejected",
    color: "bg-red-100 text-red-700 border border-red-200",
    icon: XCircle,
  },
};

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          size={14}
          className={s <= rating ? "text-amber-400 fill-amber-400" : "text-gray-300"}
        />
      ))}
    </div>
  );
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("all");
  const [search, setSearch] = useState("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchReviews = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch all statuses
      const [pending, approved, rejected] = await Promise.all([
        fetch("/api/admin/reviews?status=pending").then((r) => r.json()),
        fetch("/api/admin/reviews?status=approved").then((r) => r.json()),
        fetch("/api/admin/reviews?status=rejected").then((r) => r.json()),
      ]);
      const all = [
        ...(pending.reviews || []),
        ...(approved.reviews || []),
        ...(rejected.reviews || []),
      ].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setReviews(all);
    } catch {
      toast.error("Failed to load reviews");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const handleAction = async (
    id: string,
    action: "approved" | "rejected" | "delete"
  ) => {
    setActionLoading(id + action);
    try {
      let res;
      if (action === "delete") {
        res = await fetch(`/api/reviews/${id}`, { method: "DELETE" });
      } else {
        res = await fetch(`/api/reviews/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: action }),
        });
      }

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed");
      }

      toast.success(
        action === "delete"
          ? "Review deleted"
          : `Review ${action} successfully`
      );

      if (action === "delete") {
        setReviews((prev) => prev.filter((r) => r._id !== id));
      } else {
        setReviews((prev) =>
          prev.map((r) => (r._id === id ? { ...r, status: action } : r))
        );
      }
    } catch (err: any) {
      toast.error(err.message || "Action failed");
    } finally {
      setActionLoading(null);
    }
  };

  const handleToggleFeatured = async (id: string, featured: boolean) => {
    setActionLoading(id + "featured");
    try {
      const res = await fetch(`/api/reviews/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ featured }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed");
      }

      toast.success(featured ? "Review marked as featured!" : "Review unfeatured");
      setReviews((prev) =>
        prev.map((r) => (r._id === id ? { ...r, featured } : r))
      );
    } catch (err: any) {
      toast.error(err.message || "Failed to toggle feature state");
    } finally {
      setActionLoading(null);
    }
  };

  const filtered = reviews.filter((r) => {
    const matchStatus = filter === "all" || r.status === filter;
    const matchSearch =
      !search ||
      r.userName.toLowerCase().includes(search.toLowerCase()) ||
      r.userEmail.toLowerCase().includes(search.toLowerCase()) ||
      r.productSlug.toLowerCase().includes(search.toLowerCase()) ||
      r.body.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const counts = {
    all: reviews.length,
    pending: reviews.filter((r) => r.status === "pending").length,
    approved: reviews.filter((r) => r.status === "approved").length,
    rejected: reviews.filter((r) => r.status === "rejected").length,
  };

  const stats = [
    { label: "Total Reviews", value: counts.all, icon: MessageSquare, color: "text-blue-600 bg-blue-50" },
    { label: "Pending", value: counts.pending, icon: Clock, color: "text-amber-600 bg-amber-50" },
    { label: "Approved", value: counts.approved, icon: ThumbsUp, color: "text-green-600 bg-green-50" },
    { label: "Rejected", value: counts.rejected, icon: AlertTriangle, color: "text-red-600 bg-red-50" },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-brown-900">Review Management</h1>
          <p className="text-sm text-brown-500 mt-0.5">Moderate customer reviews before they go live</p>
        </div>
        <button
          onClick={fetchReviews}
          className="flex items-center gap-2 px-4 py-2 bg-pickle-50 border border-pickle-200 text-pickle-700 rounded-xl text-sm font-bold hover:bg-pickle-100 transition-colors"
        >
          <RefreshCw size={15} />
          Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-2xl p-4 border border-pickle-100 shadow-sm">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.color}`}>
                <stat.icon size={18} />
              </div>
              <div>
                <p className="text-2xl font-bold text-brown-900">{stat.value}</p>
                <p className="text-xs text-brown-500 font-medium">{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters + Search */}
      <div className="bg-white rounded-2xl border border-pickle-100 shadow-sm p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Status filter tabs */}
          <div className="flex items-center gap-1 bg-pickle-50 rounded-xl p-1 flex-shrink-0">
            {(["all", "pending", "approved", "rejected"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${
                  filter === f
                    ? "bg-white shadow-sm text-brown-900"
                    : "text-brown-500 hover:text-brown-800"
                }`}
              >
                {f} {f !== "all" ? `(${counts[f]})` : `(${counts.all})`}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brown-400" />
            <input
              type="text"
              placeholder="Search by name, email, product…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-pickle-50 border border-pickle-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pickle-500/20"
            />
          </div>
        </div>
      </div>

      {/* Reviews List */}
      {loading ? (
        <div className="bg-white rounded-2xl border border-pickle-100 p-12 text-center">
          <RefreshCw size={32} className="animate-spin text-pickle-500 mx-auto mb-3" />
          <p className="text-brown-500 text-sm font-medium">Loading reviews…</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-pickle-100 p-12 text-center">
          <MessageSquare size={40} className="text-brown-200 mx-auto mb-3" />
          <p className="text-brown-500 font-bold">No reviews found</p>
          <p className="text-brown-400 text-sm mt-1">Try adjusting your filters</p>
        </div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((review) => {
              const cfg = STATUS_CONFIG[review.status];
              const StatusIcon = cfg.icon;
              return (
                <motion.div
                  key={review._id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  className="bg-white rounded-2xl border border-pickle-100 shadow-sm p-5"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start gap-4">
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
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="font-bold text-brown-900 text-sm">{review.userName}</span>
                        <span className="text-brown-400 text-xs">{review.userEmail}</span>
                        {review.verifiedPurchase && (
                          <span className="flex items-center gap-1 text-[10px] font-bold text-green-700 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full">
                            <ShieldCheck size={10} />
                            Verified Purchase
                          </span>
                        )}
                        <span className={`flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${cfg.color}`}>
                          <StatusIcon size={10} />
                          {cfg.label}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 mb-2">
                        <StarRating rating={review.rating} />
                        <span className="text-[10px] text-brown-400 font-medium">
                          Product: <span className="text-pickle-600 font-bold">{review.productSlug}</span>
                        </span>
                        <span className="text-[10px] text-brown-400">
                          {new Date(review.createdAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      </div>

                      {review.title && (
                        <p className="font-bold text-brown-800 text-sm mb-1">{review.title}</p>
                      )}
                      <p className="text-brown-600 text-sm leading-relaxed line-clamp-3">{review.body}</p>
                    </div>

                    {/* Actions */}
                    <div className="flex sm:flex-col gap-2 flex-shrink-0">
                      {review.status !== "approved" && (
                        <button
                          onClick={() => handleAction(review._id, "approved")}
                          disabled={actionLoading === review._id + "approved"}
                          className="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-green-50 border border-green-200 text-green-700 rounded-xl text-xs font-bold hover:bg-green-100 transition-colors disabled:opacity-50"
                        >
                          <CheckCircle size={13} />
                          Approve
                        </button>
                      )}
                      {review.status !== "rejected" && (
                        <button
                          onClick={() => handleAction(review._id, "rejected")}
                          disabled={actionLoading === review._id + "rejected"}
                          className="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-orange-50 border border-orange-200 text-orange-700 rounded-xl text-xs font-bold hover:bg-orange-100 transition-colors disabled:opacity-50"
                        >
                          <XCircle size={13} />
                          Reject
                        </button>
                      )}
                      <button
                        onClick={() => handleToggleFeatured(review._id, !review.featured)}
                        disabled={actionLoading === review._id + "featured"}
                        className={`flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all disabled:opacity-50 ${
                          review.featured
                            ? "bg-purple-100 text-purple-700 border border-purple-200"
                            : "bg-purple-55 border border-purple-100 text-purple-600 hover:bg-purple-100"
                        }`}
                      >
                        <Star size={13} fill={review.featured ? "currentColor" : "none"} />
                        {review.featured ? "Featured" : "Feature"}
                      </button>
                      <button
                        onClick={() => handleAction(review._id, "delete")}
                        disabled={actionLoading === review._id + "delete"}
                        className="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs font-bold hover:bg-red-100 transition-colors disabled:opacity-50"
                      >
                        <Trash2 size={13} />
                        Delete
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
