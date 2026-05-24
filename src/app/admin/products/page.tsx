"use client";

import React, { useState, useEffect } from "react";
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Filter, 
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Loader2
} from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/admin/products");
      const result = await res.json();
      if (result.success) {
        setProducts(result.data);
      } else {
        toast.error(result.error || "Failed to load products");
      }
    } catch (error) {
      console.error("Failed to fetch products:", error);
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    
    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
      const result = await res.json();

      if (result.success) {
        toast.success("Product deleted successfully");
        setProducts(prev => prev.filter(p => p._id !== id));
      } else {
        toast.error(result.error || "Failed to delete product");
      }
    } catch (error) {
      toast.error("An error occurred while deleting the product");
    }
  };

  const filteredProducts = products.filter(p => {
    const productName = (p.name || p.title || "").toLowerCase();
    const search = (searchTerm || "").toLowerCase();
    return productName.includes(search) || (p.slug || "").toLowerCase().includes(search);
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-brown-900">Product Management</h1>
          <p className="text-brown-500 font-medium text-xs mt-0.5">Manage your inventory, prices, and stock levels.</p>
        </div>
        <Link 
          href="/admin/products/add" 
          className="bg-pickle-600 text-white px-4 py-2.5 rounded-lg font-bold text-xs flex items-center gap-2 shadow-lg shadow-pickle-600/10 hover:bg-pickle-700 transition-all active:scale-95 uppercase tracking-wider"
        >
          <Plus size={16} /> Add New Product
        </Link>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-2xl border border-pickle-100 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:w-72">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brown-400" />
          <input 
            type="text" 
            placeholder="Search products by name, slug..." 
            className="w-full bg-pickle-50 border border-pickle-100 pl-10 pr-4 py-2 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-pickle-500/20"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex gap-3 w-full md:w-auto">
          <button className="flex-1 md:flex-none flex items-center justify-center gap-1.5 px-4 py-2 bg-pickle-50 text-brown-700 rounded-lg font-bold text-xs hover:bg-pickle-100 transition-colors border border-pickle-100">
            <Filter size={16} /> Category
          </button>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl border border-pickle-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-pickle-50/50 text-left border-b border-pickle-100">
              <tr>
                <th className="px-4 py-3 text-[10px] font-bold text-brown-500 uppercase tracking-wider">Product Info</th>
                <th className="px-4 py-3 text-[10px] font-bold text-brown-500 uppercase tracking-wider">Category</th>
                <th className="px-4 py-3 text-[10px] font-bold text-brown-500 uppercase tracking-wider">Price</th>
                <th className="px-4 py-3 text-[10px] font-bold text-brown-500 uppercase tracking-wider">Stock</th>
                <th className="px-4 py-3 text-[10px] font-bold text-brown-500 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-[10px] font-bold text-brown-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-pickle-50">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center">
                    <Loader2 className="animate-spin text-pickle-600 mx-auto" size={32} />
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-brown-500 font-bold text-sm">No products found.</td>
                </tr>
              ) : filteredProducts.map((p) => (
                <tr key={p._id} className="hover:bg-pickle-50/30 transition-colors group">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 bg-pickle-50 rounded-xl flex items-center justify-center text-3xl group-hover:scale-105 transition-transform shadow-sm overflow-hidden flex-shrink-0">
                        <img src={p.images?.[0] || "/placeholder.jpg"} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-brown-900 group-hover:text-pickle-600 transition-colors flex items-center gap-1.5 truncate">
                          {p.name || p.title || "Unnamed Product"}
                          <ExternalLink size={10} className="opacity-0 group-hover:opacity-100 flex-shrink-0" />
                        </p>
                        <p className="text-[10px] text-brown-400 font-medium truncate">Slug: {p.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs font-medium text-brown-700">{p.category}</td>
                  <td className="px-4 py-3">
                    <p className="text-xs font-bold text-brown-900">₹{p.offerPrice || p.price}</p>
                    {p.offerPrice && p.offerPrice < p.price && (
                      <p className="text-[9px] text-brown-400 font-bold line-through">₹{p.price}</p>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col gap-1">
                      <p className="text-xs font-bold text-brown-900">{p.stock} pcs</p>
                      <div className="w-20 h-1 bg-pickle-100 rounded-full overflow-hidden">
                        <div 
                           className="h-full bg-pickle-500 rounded-full" 
                           style={{ width: `${Math.min((p.stock / 100) * 100, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${p.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {p.stock > 0 ? 'Active' : 'Out of Stock'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-1.5">
                      <Link href={`/admin/products/edit/${p._id}`} className="p-2 bg-pickle-50 text-pickle-600 rounded-lg hover:bg-pickle-600 hover:text-white transition-all">
                        <Edit size={14} />
                      </Link>
                      <button 
                        onClick={() => handleDelete(p._id)}
                        className="p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
