"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  ArrowLeft, 
  Upload, 
  X, 
  Save, 
  CheckCircle2,
  AlertCircle,
  Loader2
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function EditProductPage() {
  const { id } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    category: "",
    price: "",
    offerPrice: "",
    stock: "",
    weight: "250g",
    description: "",
    featured: false,
    forceBestseller: false
  });

  const [images, setImages] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      handleFiles(Array.from(files));
    }
  };

  const handleFiles = (files: File[]) => {
    const validFiles = files.filter(file => {
      const isValidType = ['image/jpeg', 'image/png', 'image/jpg'].includes(file.type);
      const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB

      if (!isValidType) toast.error(`${file.name} is not a supported format`);
      if (!isValidSize) toast.error(`${file.name} exceeds 5MB limit`);

      return isValidType && isValidSize;
    });

    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImages(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/admin/products/${id}`);
        if (!res.ok) throw new Error("Product fetch failed");
        const product = await res.json();
        
        if (product) {
          const rawCat = product.category || "";
          const normalizedCategory = 
            rawCat === "Veg Pickles" || rawCat === "veg-pickles" || rawCat === "veg"
              ? "veg"
              : rawCat === "Non-Veg Pickles" || rawCat === "non-veg-pickles" || rawCat === "non-veg"
              ? "non-veg"
              : rawCat === "Combo Offers" || rawCat === "combo-offers" || rawCat === "combo"
              ? "combo"
              : rawCat;

          setFormData({
            title: product.title || product.name || "",
            slug: product.slug || "",
            category: normalizedCategory,
            price: product.price || "",
            offerPrice: product.offerPrice || "",
            stock: product.stock || "",
            weight: product.weight || "250g",
            description: product.description || "",
            featured: product.featured || false,
            forceBestseller: product.forceBestseller || false
          });
          setImages(Array.isArray(product.images) ? product.images : []);
        } else {
          toast.error("Product not found");
        }
      } catch (error) {
        console.error("Failed to load product:", error);
        toast.error("Failed to load product");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch(`/api/admin/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          images,
          categorySlug: formData.category === "veg" ? "veg" : "non-veg"
        }),
      });

      if (!response.ok) throw new Error("Failed to update product");

      toast.success("Product updated successfully!");
      router.push("/admin/products");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="animate-spin text-pickle-600" size={40} />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-10">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-6">
          <Link href="/admin/products" className="w-12 h-12 bg-white border border-pickle-100 rounded-2xl flex items-center justify-center text-brown-600 hover:bg-pickle-600 hover:text-white transition-all shadow-sm">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-brown-900">Edit Product</h1>
            <p className="text-brown-500 font-medium mt-1">Modify existing product details.</p>
          </div>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={handleSubmit}
            disabled={saving}
            className="px-8 py-4 bg-pickle-600 text-white rounded-2xl font-bold shadow-xl shadow-pickle-600/20 hover:bg-pickle-700 transition-all flex items-center gap-2 disabled:opacity-70"
          >
            {saving ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />} Save Changes
          </button>
        </div>
      </div>

      <form className="grid grid-cols-1 lg:grid-cols-3 gap-10 pb-20">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-8 rounded-3xl border border-pickle-100 shadow-sm space-y-6">
            <h2 className="text-xl font-bold text-brown-900 mb-2">Basic Information</h2>
            <div className="space-y-2">
              <label className="text-sm font-bold text-brown-700">Product Title</label>
              <input 
                type="text" name="title"
                className="w-full bg-pickle-50 border border-pickle-100 px-6 py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-pickle-500/20 font-medium"
                value={formData.title} onChange={handleChange}
              />
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-brown-700">Slug</label>
                <input 
                  type="text" name="slug"
                  className="w-full bg-pickle-50 border border-pickle-100 px-6 py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-pickle-500/20 font-medium"
                  value={formData.slug} onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-brown-700">Category</label>
                <select 
                  name="category"
                  className="w-full bg-pickle-50 border border-pickle-100 px-6 py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-pickle-500/20 font-medium"
                  value={formData.category} onChange={handleChange}
                >
                  <option value="veg">Veg Pickles</option>
                  <option value="non-veg">Non-Veg Pickles</option>
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-brown-700">Description</label>
              <textarea 
                name="description" rows={6}
                className="w-full bg-pickle-50 border border-pickle-100 px-6 py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-pickle-500/20 font-medium resize-none"
                value={formData.description} onChange={handleChange}
              />
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-pickle-100 shadow-sm space-y-6">
            <h2 className="text-xl font-bold text-brown-900 mb-2">Pricing & Inventory</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-brown-700">Price (₹)</label>
                <input 
                  type="number" name="price"
                  className="w-full bg-pickle-50 border border-pickle-100 px-6 py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-pickle-500/20 font-medium"
                  value={formData.price} onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-brown-700">Offer Price (₹)</label>
                <input 
                  type="number" name="offerPrice"
                  className="w-full bg-pickle-50 border border-pickle-100 px-6 py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-pickle-500/20 font-medium"
                  value={formData.offerPrice} onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-brown-700">Stock</label>
                <input 
                  type="number" name="stock"
                  className="w-full bg-pickle-50 border border-pickle-100 px-6 py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-pickle-500/20 font-medium"
                  value={formData.stock} onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-brown-700">Jar Weight</label>
                <input 
                  type="text" name="weight"
                  className="w-full bg-pickle-50 border border-pickle-100 px-6 py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-pickle-500/20 font-medium"
                  value={formData.weight} onChange={handleChange}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-white p-8 rounded-3xl border border-pickle-100 shadow-sm space-y-6">
            <h2 className="text-xl font-bold text-brown-900 mb-2">Media</h2>
            
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleFileChange}
              multiple 
              accept="image/png, image/jpeg, image/jpg"
              className="hidden"
            />

            <div 
              onClick={handleImageClick}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-3xl p-10 flex flex-col items-center justify-center gap-4 transition-all cursor-pointer group ${dragActive ? 'border-pickle-500 bg-pickle-50' : 'border-pickle-200 bg-pickle-50/50 hover:bg-pickle-50'}`}
            >
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-pickle-600 shadow-sm group-hover:scale-110 transition-transform">
                <Upload size={24} />
              </div>
              <div className="text-center">
                <p className="text-sm font-bold text-brown-900">Click or drag to upload images</p>
                <p className="text-xs text-brown-400 mt-1 font-medium">PNG, JPG up to 5MB</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {images.map((img, i) => (
                <div key={i} className="relative group aspect-square bg-pickle-50 rounded-2xl border border-pickle-100 overflow-hidden">
                  <img src={img} alt="Preview" className="w-full h-full object-cover" />
                  <button 
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeImage(i);
                    }}
                    className="absolute top-2 right-2 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-pickle-100 shadow-sm space-y-6">
            <h2 className="text-xl font-bold text-brown-900 mb-2">Visibility & Badges</h2>
            <div className="flex items-center justify-between p-4 bg-pickle-50 rounded-2xl border border-pickle-100">
              <div className="flex items-center gap-3 text-pickle-600">
                <CheckCircle2 size={20} />
                <span className="text-sm font-bold text-brown-900">Featured Product</span>
              </div>
              <input 
                type="checkbox" name="featured"
                className="w-6 h-6 accent-pickle-600 cursor-pointer"
                checked={formData.featured} onChange={handleChange}
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-pickle-50 rounded-2xl border border-pickle-100">
              <div className="flex items-center gap-3 text-pickle-600">
                <CheckCircle2 size={20} />
                <span className="text-sm font-bold text-brown-900">Force Bestseller</span>
              </div>
              <input 
                type="checkbox" name="forceBestseller"
                className="w-6 h-6 accent-pickle-600 cursor-pointer"
                checked={formData.forceBestseller} onChange={handleChange}
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
