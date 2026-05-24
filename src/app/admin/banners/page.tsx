"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Plus, 
  Trash2, 
  Edit, 
  Image as ImageIcon,
  Loader2,
  Save,
  X,
  Upload,
  Settings,
  Eye,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import toast from "react-hot-toast";

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  
  const [editingBanner, setEditingBanner] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: "",
    type: "static",
    speed: 3000,
    active: true
  });
  
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchBanners = async () => {
    try {
      const res = await fetch("/api/admin/banners");
      const result = await res.json();
      if (result.success) setBanners(result.data);
    } catch (error) {
      toast.error("Failed to load banners");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBanners(); }, []);

  const openModal = (banner: any = null) => {
    if (banner) {
      setEditingBanner(banner);
      setFormData({
        title: banner.title,
        type: banner.type || "static",
        speed: banner.speed || 3000,
        active: banner.active !== undefined ? banner.active : true
      });
      setExistingImages(banner.images || []);
    } else {
      setEditingBanner(null);
      setFormData({ title: "Marketing Campaign", type: "static", speed: 3000, active: true });
      setExistingImages([]);
    }
    setSelectedImages([]);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const data = new FormData();
    data.append("title", formData.title);
    data.append("type", formData.type);
    data.append("speed", formData.speed.toString());
    data.append("active", formData.active.toString());
    
    selectedImages.forEach(file => data.append("images", file));
    data.append("existingImages", JSON.stringify(existingImages));

    try {
      const url = editingBanner ? `/api/admin/banners/${editingBanner._id}` : "/api/admin/banners";
      const method = editingBanner ? "PUT" : "POST";
      
      const res = await fetch(url, { method, body: data });
      const result = await res.json();
      
      if (result.success) {
        toast.success(editingBanner ? "Banner updated!" : "Banner created!");
        setIsModalOpen(false);
        fetchBanners();
      } else {
        toast.error(result.error || "Operation failed");
      }
    } catch (error) {
      toast.error("Network error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this banner?")) return;
    try {
      const res = await fetch(`/api/admin/banners/${id}`, { method: "DELETE" });
      const result = await res.json();
      if (result.success) {
        toast.success("Banner deleted");
        fetchBanners();
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="space-y-10">
      <div className="flex justify-between items-center bg-white p-8 rounded-[2.5rem] border border-pickle-100 shadow-sm">
        <div>
          <h1 className="text-3xl font-black text-brown-900 tracking-tight">Banner Management</h1>
          <p className="text-brown-500 font-bold uppercase text-[10px] tracking-[0.3em] mt-1">Design your homepage marketing engine</p>
        </div>
        <button 
          onClick={() => openModal()}
          className="bg-pickle-600 text-white px-8 py-4 rounded-2xl font-black flex items-center gap-3 shadow-xl shadow-pickle-600/20 hover:bg-pickle-700 transition-all active:scale-95"
        >
          <Plus size={20} /> NEW BANNER
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-pickle-600" size={40} />
        </div>
      ) : banners.length === 0 ? (
        <div className="bg-white p-20 rounded-[3rem] border-4 border-dashed border-pickle-100 text-center">
          <ImageIcon className="mx-auto text-pickle-200 mb-6" size={60} />
          <h2 className="text-2xl font-black text-brown-900 mb-2">No Banners Yet</h2>
          <p className="text-brown-500 font-medium">Create your first banner to liven up your store's homepage.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-20">
          {banners.map((banner) => (
            <div key={banner._id} className="bg-white group rounded-[3rem] border border-pickle-100 overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500">
              <div className="relative aspect-[21/9] bg-pickle-50 overflow-hidden">
                <img src={banner?.images?.[0] || banner.image || "/placeholder.jpg"} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute top-6 left-6 flex gap-2">
                  <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-lg ${banner.active ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                    {banner.active ? 'Active' : 'Inactive'}
                  </span>
                  <span className="bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full text-[9px] font-black text-brown-900 uppercase tracking-widest shadow-lg border border-white/50">
                    {banner.type}
                  </span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-brown-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              
              <div className="p-8 flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-black text-brown-900 tracking-tight">{banner.title}</h3>
                  <p className="text-brown-400 font-bold text-[10px] uppercase tracking-widest mt-1">
                    {banner.images.length} Images • {banner.speed}ms Rotation
                  </p>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => openModal(banner)} className="w-12 h-12 bg-pickle-50 text-pickle-600 rounded-2xl flex items-center justify-center hover:bg-pickle-600 hover:text-white transition-all shadow-sm">
                    <Edit size={20} />
                  </button>
                  <button onClick={() => handleDelete(banner._id)} className="w-12 h-12 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center hover:bg-red-500 hover:text-white transition-all shadow-sm">
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-xl bg-brown-900/40">
          <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden border border-pickle-100 flex flex-col max-h-[90vh]">
            <div className="p-10 border-b border-pickle-50 flex justify-between items-center shrink-0">
              <h2 className="text-2xl font-black text-brown-900 uppercase tracking-tighter">
                {editingBanner ? "Edit Marketing Banner" : "New Marketing Banner"}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-brown-400 hover:text-red-500 transition-colors">
                <X size={28} />
              </button>
            </div>
            
            <form onSubmit={handleSave} className="p-8 overflow-y-auto space-y-6 custom-scrollbar">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-brown-400 uppercase tracking-widest ml-4">Banner Mode</label>
                  <select value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})} className="w-full bg-pickle-50 border border-pickle-100 px-8 py-5 rounded-[2rem] font-black text-brown-900 focus:outline-none appearance-none">
                    <option value="static">Static Banner</option>
                    <option value="slider">Auto Slider</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-brown-400 uppercase tracking-widest ml-4">Speed (ms)</label>
                  <input type="number" step="500" value={formData.speed} onChange={(e) => setFormData({...formData, speed: Number(e.target.value)})} className="w-full bg-pickle-50 border border-pickle-100 px-8 py-5 rounded-[2rem] font-black text-brown-900 focus:outline-none" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-brown-400 uppercase tracking-widest ml-4">Campaign Visibility</label>
                <label className="flex items-center justify-between bg-pickle-50 px-8 py-6 rounded-[2.5rem] border border-pickle-100 cursor-pointer">
                  <div className="flex items-center gap-4">
                    {formData.active ? <CheckCircle2 className="text-green-500" size={24} /> : <AlertCircle className="text-red-500" size={24} />}
                    <span className="text-[11px] font-black text-brown-900 uppercase">{formData.active ? 'Active on Homepage' : 'Hidden from Store'}</span>
                  </div>
                  <div className={`w-12 h-6 rounded-full p-1 transition-all ${formData.active ? 'bg-green-500' : 'bg-brown-200'}`}>
                    <div className={`w-4 h-4 bg-white rounded-full transition-transform ${formData.active ? 'translate-x-6' : 'translate-x-0'}`} />
                  </div>
                  <input type="checkbox" checked={formData.active} onChange={(e) => setFormData({...formData, active: e.target.checked})} className="hidden" />
                </label>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black text-brown-400 uppercase tracking-widest ml-4">Marketing Assets</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {existingImages.map((img, idx) => (
                    <div key={idx} className="relative aspect-[21/9] rounded-2xl overflow-hidden border border-pickle-100">
                      <img src={img} className="w-full h-full object-cover" />
                      <button type="button" onClick={() => setExistingImages(existingImages.filter((_, i) => i !== idx))} className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg"><X size={12} /></button>
                    </div>
                  ))}
                  {selectedImages.map((file, idx) => (
                    <div key={idx} className="relative aspect-[21/9] rounded-2xl overflow-hidden border border-pickle-100 bg-pickle-50">
                      <img src={URL.createObjectURL(file)} className="w-full h-full object-cover opacity-60" />
                      <div className="absolute inset-0 flex items-center justify-center"><p className="text-[8px] font-black text-brown-900 bg-white/80 px-2 py-1 rounded">PENDING UPLOAD</p></div>
                      <button type="button" onClick={() => setSelectedImages(selectedImages.filter((_, i) => i !== idx))} className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg"><X size={12} /></button>
                    </div>
                  ))}
                  <button type="button" onClick={() => fileInputRef.current?.click()} className="aspect-[21/9] rounded-2xl border-2 border-dashed border-pickle-200 flex flex-col items-center justify-center gap-2 hover:bg-pickle-50 hover:border-pickle-400 transition-all text-pickle-400">
                    <Plus size={24} />
                    <span className="text-[8px] font-black uppercase">Add Image</span>
                  </button>
                  <input type="file" multiple ref={fileInputRef} onChange={(e) => { if(e.target.files) setSelectedImages([...selectedImages, ...Array.from(e.target.files)]) }} className="hidden" />
                </div>
              </div>
            </form>

            <div className="p-10 border-t border-pickle-50 shrink-0">
              <button disabled={saving} onClick={handleSave} className="w-full bg-pickle-600 text-white py-6 rounded-[2rem] font-black flex items-center justify-center gap-3 shadow-xl shadow-pickle-600/20 hover:bg-pickle-700 transition-all active:scale-95 disabled:opacity-50">
                {saving ? <Loader2 size={24} className="animate-spin" /> : <Save size={24} />}
                {saving ? "SAVING CAMPAIGN..." : "SAVE BANNER CAMPAIGN"}
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #fdfaf5; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #dccfb8; border-radius: 10px; }
      `}</style>
    </div>
  );
}
