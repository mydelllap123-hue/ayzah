"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Loader2,
  Package,
  Sparkles,
  Pencil,
  X,
  Upload,
  ImageIcon,
  CheckCircle,
  AlertCircle,
  Leaf,
  Save,
  RefreshCw,
  Eye,
  EyeOff,
  Cloud,
  AlertTriangle,
} from "lucide-react";
import toast from "react-hot-toast";

interface Category {
  _id: string;
  dbId: string | null;
  name: string;
  slug: string;
  type: string;
  description: string;
  thumbnail: string;
  banner: string;
  active: boolean;
  productCount: number;
}

// ─── Safe Image with Error Fallback ──────────────────────────────────────────
function SafeImage({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  const [errored, setErrored] = useState(false);

  if (!src || errored) {
    return (
      <div className={`flex flex-col items-center justify-center bg-pickle-50 gap-2 ${className || ""}`}>
        <ImageIcon size={32} className="text-pickle-200" />
        <p className="text-[9px] text-pickle-300 font-medium">No image</p>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      onError={() => setErrored(true)}
      className={`w-full h-full object-cover ${className || ""}`}
    />
  );
}

// ─── Upload Progress Ring ─────────────────────────────────────────────────────
function UploadOverlay({ uploading }: { uploading: boolean }) {
  return (
    <AnimatePresence>
      {uploading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-brown-900/70 flex flex-col items-center justify-center gap-2 z-10"
        >
          <Loader2 size={28} className="text-white animate-spin" />
          <p className="text-white text-xs font-bold">Uploading to Cloudinary…</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Edit Modal ───────────────────────────────────────────────────────────────
function EditCategoryModal({
  category,
  onClose,
  onSaved,
}: {
  category: Category;
  onClose: () => void;
  onSaved: (updated: Category) => void;
}) {
  const isVeg = category.slug === "veg";
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [description, setDescription] = useState(category.description);
  const [thumbnail, setThumbnail] = useState(category.thumbnail);
  const [active, setActive] = useState(category.active);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [previewSrc, setPreviewSrc] = useState(category.thumbnail);
  const [imageChanged, setImageChanged] = useState(false);

  // Prevent saving while upload is in progress or already saving
  const isBusy = uploading || saving;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || uploading) return;

    // Client-side validation
    const allowed = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowed.includes(file.type)) {
      toast.error("Only JPG, PNG, and WebP images are supported");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File is too large — maximum size is 5 MB");
      return;
    }

    // Instant local blob preview
    const objectUrl = URL.createObjectURL(file);
    setPreviewSrc(objectUrl);

    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("slug", category.slug); // used to create stable Cloudinary public_id

      const res = await fetch("/api/admin/categories/upload", {
        method: "POST",
        body: fd,
      });

      const data = await res.json();

      if (!res.ok || !data.url) {
        throw new Error(data.error || "Upload failed");
      }

      setThumbnail(data.url);
      setPreviewSrc(data.url);
      setImageChanged(true);
      toast.success("✓ Image uploaded & optimized via Cloudinary");
    } catch (err: any) {
      toast.error(err.message || "Image upload failed");
      // Revert preview to original
      setPreviewSrc(category.thumbnail);
    } finally {
      setUploading(false);
      // Reset input so same file can be re-selected
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleSave = async () => {
    if (isBusy) return; // prevent duplicate saves
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/categories/${category.slug}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          description: description.trim(),
          thumbnail,
          banner: thumbnail,
          active,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Save failed");
      }

      toast.success(`${category.name} updated successfully`);
      onSaved({
        ...category,
        description: description.trim(),
        thumbnail,
        banner: thumbnail,
        active,
      });
    } catch (err: any) {
      toast.error(err.message || "Failed to save changes");
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={(e) => !isBusy && e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ duration: 0.22, ease: "easeOut" }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-xl overflow-hidden"
      >
        {/* Header */}
        <div
          className={`px-6 py-4 flex items-center justify-between border-b ${
            isVeg ? "bg-green-50 border-green-100" : "bg-red-50 border-red-100"
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                isVeg ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
              }`}
            >
              {isVeg ? (
                <Leaf size={18} />
              ) : (
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M19.5,3A4.5,4.5 0 0,0 15,7.5c0,1.25.5,2.4 1.34,3.23L11.5,15.56c-1.12-.36-2.4,0-3.3.9l-4,4a2,2 0 0,0 0,2.83 2,2 0 0,0 2.83,0l4-4c.9-.9 1.26-2.18.9-3.3l4.83-4.83C17.1,12 18.25,12.5 19.5,12.5A4.5,4.5 0 0,0 24,8 4.5,4.5 0 0,0 19.5,3Z" />
                </svg>
              )}
            </div>
            <div>
              <h2 className="text-sm font-bold text-brown-900">Edit {category.name}</h2>
              <p className="text-[10px] text-brown-500 mt-0.5">
                Permanent — only image &amp; description editable
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            disabled={isBusy}
            className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-brown-400 hover:text-brown-800 transition-colors disabled:opacity-40"
          >
            <X size={15} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">

          {/* ── Image Upload Section ── */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-bold text-brown-800">Category Image</label>
              <span className="flex items-center gap-1 text-[10px] text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
                <Cloud size={9} />
                Cloudinary CDN
              </span>
            </div>

            {/* Image preview box */}
            <div
              className="relative h-48 w-full rounded-2xl overflow-hidden border-2 border-dashed border-pickle-200 bg-pickle-50 cursor-pointer group"
              onClick={() => !uploading && fileInputRef.current?.click()}
            >
              <SafeImage src={previewSrc} alt={category.name} />
              <UploadOverlay uploading={uploading} />

              {/* Static hover hint (only shows when not uploading) */}
              {!uploading && (
                <div className="absolute inset-0 bg-brown-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                  <Upload size={22} className="text-white" />
                  <span className="text-white text-xs font-bold">Click to change image</span>
                  <span className="text-white/70 text-[10px]">Will be optimized &amp; compressed</span>
                </div>
              )}

              {/* Uploaded badge */}
              {imageChanged && !uploading && (
                <div className="absolute top-3 right-3 bg-green-500 text-white text-[9px] font-bold px-2 py-1 rounded-lg flex items-center gap-1">
                  <CheckCircle size={9} />
                  Uploaded
                </div>
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              onChange={handleFileChange}
              className="hidden"
            />

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="mt-2.5 w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-pickle-200 bg-pickle-50 rounded-xl text-xs font-bold text-pickle-700 hover:bg-pickle-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? (
                <>
                  <Loader2 size={13} className="animate-spin" />
                  Uploading to Cloudinary…
                </>
              ) : (
                <>
                  <Upload size={13} />
                  Upload New Image
                </>
              )}
            </button>
            <p className="text-[10px] text-brown-400 text-center mt-1">
              JPG · PNG · WebP &nbsp;|&nbsp; Max 5 MB &nbsp;|&nbsp; Auto-compressed to WebP
            </p>
          </div>

          {/* ── Description ── */}
          <div>
            <label className="block text-sm font-bold text-brown-800 mb-1.5">
              Category Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              maxLength={300}
              placeholder="Write a short description for this category…"
              className="w-full px-4 py-3 bg-pickle-50 border border-pickle-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pickle-500/20 focus:border-pickle-400 transition-all resize-none"
            />
            <p className="text-[10px] text-brown-400 text-right mt-0.5">{description.length}/300</p>
          </div>

          {/* ── Active Status Toggle ── */}
          <div className="flex items-center justify-between p-4 bg-pickle-50 rounded-2xl border border-pickle-100">
            <div>
              <p className="text-sm font-bold text-brown-800">Category Status</p>
              <p className="text-[11px] text-brown-500 mt-0.5">
                {active ? "Visible to customers on homepage" : "Hidden from customers"}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setActive(!active)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                active
                  ? "bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
                  : "bg-gray-100 text-gray-500 border-gray-200 hover:bg-gray-200"
              }`}
            >
              {active ? <Eye size={13} /> : <EyeOff size={13} />}
              {active ? "Active" : "Inactive"}
            </button>
          </div>

          {/* ── Product Count (read-only info) ── */}
          <div className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-100 rounded-2xl">
            <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center shadow-sm text-amber-500 flex-shrink-0">
              <Package size={16} />
            </div>
            <div>
              <p className="text-[9px] font-black text-brown-400 uppercase tracking-widest">
                Linked Products
              </p>
              <p className="text-sm font-bold text-brown-900">
                {category.productCount} {category.productCount === 1 ? "Product" : "Products"}
              </p>
            </div>
            <p className="ml-auto text-[10px] text-amber-600 font-medium text-right leading-tight">
              Assign via<br />product form
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex gap-3 bg-gray-50">
          <button
            onClick={onClose}
            disabled={isBusy}
            className="flex-1 py-2.5 border border-gray-200 text-brown-600 font-bold text-sm rounded-xl hover:bg-white transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isBusy}
            className="flex-1 py-2.5 bg-brown-900 text-white font-bold text-sm rounded-xl hover:bg-brown-800 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                Saving…
              </>
            ) : (
              <>
                <Save size={14} />
                Save Changes
              </>
            )}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function CategoriesAdminPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/categories");
      const data = await res.json();
      if (data.success) {
        setCategories(data.data);
      } else {
        toast.error(data.error || "Failed to load categories");
      }
    } catch {
      toast.error("Failed to load category data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleSaved = useCallback((updated: Category) => {
    setCategories((prev) =>
      prev.map((c) => (c.slug === updated.slug ? updated : c))
    );
    setEditingCategory(null);
  }, []);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between bg-white p-5 rounded-2xl border border-pickle-100 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-brown-900">Categories</h1>
          <p className="text-brown-500 text-xs mt-0.5 font-medium">
            2 permanent categories — click a card to edit image &amp; description
          </p>
        </div>
        <button
          onClick={fetchCategories}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-pickle-50 border border-pickle-100 text-pickle-700 rounded-xl text-xs font-bold hover:bg-pickle-100 transition-colors disabled:opacity-50"
        >
          <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* Info banner */}
      <div className="flex items-start gap-3 bg-blue-50 border border-blue-200 rounded-2xl p-4">
        <Cloud size={16} className="text-blue-500 flex-shrink-0 mt-0.5" />
        <p className="text-blue-800 text-xs font-medium leading-relaxed">
          <span className="font-bold">Images stored on Cloudinary CDN.</span>{" "}
          Uploads are automatically compressed, resized to 900×600 px, and served
          in WebP format worldwide. Changes instantly reflect on the homepage.
        </p>
      </div>

      <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-2xl p-4">
        <Sparkles size={16} className="text-amber-500 flex-shrink-0 mt-0.5" />
        <p className="text-amber-800 text-xs font-medium leading-relaxed">
          <span className="font-bold">Permanent categories locked.</span>{" "}
          You can only update images and descriptions. To add products, use the
          product&apos;s edit form and select the correct category.
        </p>
      </div>

      {/* Categories Grid */}
      {loading ? (
        <div className="flex justify-center py-16 bg-white rounded-2xl border border-pickle-100 shadow-sm">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="animate-spin text-pickle-600" size={32} />
            <p className="text-xs text-brown-400 font-medium">Loading categories…</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
          {categories.map((cat) => {
            const isVeg = cat.slug === "veg";

            return (
              <motion.div
                key={cat._id}
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                onClick={() => setEditingCategory(cat)}
                className="bg-white group rounded-3xl border border-pickle-100 overflow-hidden shadow-sm hover:shadow-2xl transition-shadow duration-300 flex flex-col cursor-pointer"
              >
                {/* Image */}
                <div className="relative h-52 w-full overflow-hidden bg-pickle-50">
                  <SafeImage
                    src={cat.thumbnail}
                    alt={cat.name}
                    className="group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Dark gradient on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-brown-950/70 via-brown-950/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Veg/Non-veg badge */}
                  <div className="absolute top-3 left-3 flex items-center gap-2 z-10">
                    <div
                      className={`w-7 h-7 rounded-lg bg-white flex items-center justify-center shadow-md border ${
                        isVeg ? "border-green-200 text-green-600" : "border-red-200 text-red-600"
                      }`}
                    >
                      {isVeg ? (
                        <Leaf size={13} />
                      ) : (
                        <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                          <path d="M19.5,3A4.5,4.5 0 0,0 15,7.5c0,1.25.5,2.4 1.34,3.23L11.5,15.56c-1.12-.36-2.4,0-3.3.9l-4,4a2,2 0 0,0 0,2.83 2,2 0 0,0 2.83,0l4-4c.9-.9 1.26-2.18.9-3.3l4.83-4.83C17.1,12 18.25,12.5 19.5,12.5A4.5,4.5 0 0,0 24,8 4.5,4.5 0 0,0 19.5,3Z" />
                        </svg>
                      )}
                    </div>
                    <span
                      className={`px-2.5 py-1 rounded-lg text-[8px] font-black uppercase tracking-wider text-white shadow-md ${
                        isVeg ? "bg-green-600" : "bg-red-600"
                      }`}
                    >
                      {isVeg ? "100% Vegetarian" : "Premium Non-Veg"}
                    </span>
                  </div>

                  {/* Inactive badge */}
                  {!cat.active && (
                    <div className="absolute top-3 right-3 bg-gray-900/80 text-white text-[9px] font-bold uppercase px-2 py-1 rounded-lg flex items-center gap-1 z-10">
                      <EyeOff size={9} /> Inactive
                    </div>
                  )}

                  {/* "Edit Category" hint — visible on hover */}
                  <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0 z-10">
                    <span className="flex items-center gap-1.5 bg-white/95 backdrop-blur-sm text-brown-900 px-3 py-1.5 rounded-xl text-xs font-bold shadow-lg">
                      <Pencil size={11} />
                      Edit Category
                    </span>
                  </div>
                </div>

                {/* Card content */}
                <div className="p-5 flex flex-col flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-base font-bold text-brown-900 group-hover:text-pickle-600 transition-colors">
                      {cat.name}
                    </h3>
                    {cat.active ? (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-green-700 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full">
                        <CheckCircle size={9} /> Active
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-gray-500 bg-gray-50 border border-gray-200 px-2 py-0.5 rounded-full">
                        <AlertCircle size={9} /> Inactive
                      </span>
                    )}
                  </div>

                  <p className="text-brown-500 text-xs leading-relaxed mb-4 line-clamp-2">
                    {cat.description}
                  </p>

                  {/* Stats row */}
                  <div className="mt-auto flex items-center gap-3 bg-pickle-50 border border-pickle-100 p-3 rounded-2xl">
                    <div className="w-9 h-9 bg-white text-pickle-600 rounded-xl flex items-center justify-center shadow-sm flex-shrink-0">
                      <Package size={15} />
                    </div>
                    <div>
                      <p className="text-[8px] font-black text-brown-400 uppercase tracking-widest">
                        Linked Products
                      </p>
                      <p className="text-sm font-black text-brown-900">
                        {cat.productCount} {cat.productCount === 1 ? "Item" : "Items"}
                      </p>
                    </div>
                    <div className="ml-auto flex items-center gap-1.5 bg-white border border-pickle-100 text-pickle-600 px-3 py-1.5 rounded-xl text-[10px] font-bold shadow-sm group-hover:bg-pickle-600 group-hover:text-white group-hover:border-pickle-600 transition-all">
                      <Pencil size={10} />
                      Edit
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Edit Modal */}
      <AnimatePresence>
        {editingCategory && (
          <EditCategoryModal
            category={editingCategory}
            onClose={() => setEditingCategory(null)}
            onSaved={handleSaved}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
