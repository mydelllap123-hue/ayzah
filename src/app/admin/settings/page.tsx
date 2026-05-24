"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Save, 
  Globe, 
  Mail, 
  Phone, 
  MapPin, 
  Upload,
  Loader2,
  ShieldCheck,
  Truck,
  CreditCard
} from "lucide-react";
import toast from "react-hot-toast";
import { useSettings } from "@/context/SettingsContext";

// Custom SVG components for brand icons since lucide-react removed them in v1.0
interface BrandIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

const FacebookIcon = ({ size = 24, className, ...props }: BrandIconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const InstagramIcon = ({ size = 24, className, ...props }: BrandIconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const TwitterIcon = ({ size = 24, className, ...props }: BrandIconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);

const YoutubeIcon = ({ size = 24, className, ...props }: BrandIconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17z" />
    <polygon points="9.7 15 9.7 9 15 12" />
  </svg>
);

export default function AdminSettingsPage() {
  const { settings: contextSettings, refreshSettings } = useSettings();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  
  const [formData, setFormData] = useState({
    siteName: "",
    email: "",
    phone: "",
    address: "",
    deliveryCharge: 0,
    enableOnlinePayment: false,
    facebook: "",
    instagram: "",
    twitter: "",
    youtube: ""
  });

  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [faviconPreview, setFaviconPreview] = useState<string | null>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const faviconInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (contextSettings) {
      setFormData({
        siteName: contextSettings.siteName || "",
        email: contextSettings.email || "",
        phone: contextSettings.phone || "",
        address: contextSettings.address || "",
        deliveryCharge: contextSettings.deliveryCharge || 0,
        enableOnlinePayment: contextSettings.enableOnlinePayment || false,
        facebook: contextSettings.socialLinks?.facebook || "",
        instagram: contextSettings.socialLinks?.instagram || "",
        twitter: contextSettings.socialLinks?.twitter || "",
        youtube: contextSettings.socialLinks?.youtube || ""
      });
      setLogoPreview(contextSettings.logo || null);
      setFaviconPreview(contextSettings.favicon || null);
      setFetching(false);
    }
  }, [contextSettings]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    data.append("siteName", formData.siteName);
    data.append("email", formData.email);
    data.append("phone", formData.phone);
    data.append("address", formData.address);
    data.append("deliveryCharge", formData.deliveryCharge.toString());
    data.append("enableOnlinePayment", formData.enableOnlinePayment.toString());
    
    data.append("socialLinks", JSON.stringify({
      facebook: formData.facebook,
      instagram: formData.instagram,
      twitter: formData.twitter,
      youtube: formData.youtube
    }));

    if (logoInputRef.current?.files?.[0]) {
      data.append("logo", logoInputRef.current.files[0]);
    }
    if (faviconInputRef.current?.files?.[0]) {
      data.append("favicon", faviconInputRef.current.files[0]);
    }

    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        body: data
      });
      const result = await res.json();
      
      if (result.success) {
        toast.success("Settings updated successfully!");
        refreshSettings();
      } else {
        toast.error(result.error || "Failed to update settings");
      }
    } catch (error) {
      toast.error("Network error");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Loader2 className="animate-spin text-pickle-600" size={40} />
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-20">
      <div className="flex justify-between items-center bg-white p-8 rounded-[3rem] border border-pickle-100 shadow-sm">
        <div>
          <h1 className="text-4xl font-black text-brown-900 tracking-tight">Website Settings</h1>
          <p className="text-brown-500 font-bold uppercase text-[10px] tracking-[0.3em] mt-2">Control your brand identity & global parameters</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={loading}
          className="bg-pickle-600 text-white px-12 py-5 rounded-[2rem] font-black flex items-center gap-3 hover:bg-pickle-700 transition-all shadow-xl shadow-pickle-600/20 active:scale-95 disabled:opacity-50"
        >
          {loading ? <Loader2 size={24} className="animate-spin" /> : <Save size={24} />}
          {loading ? "SAVING..." : "SAVE CHANGES"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Left Column: Brand Assets */}
        <div className="space-y-10">
          <div className="bg-white p-10 rounded-[3.5rem] border border-pickle-100 shadow-sm space-y-8">
            <h2 className="text-xl font-black text-brown-900 flex items-center gap-3">
              <ShieldCheck className="text-pickle-600" size={24} /> Brand Assets
            </h2>
            
            <div className="space-y-6">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-brown-400 uppercase tracking-widest ml-4">Primary Logo</label>
                <div onClick={() => logoInputRef.current?.click()} className="h-40 bg-pickle-50/50 rounded-[2.5rem] border-4 border-dashed border-pickle-100 flex flex-col items-center justify-center cursor-pointer group hover:border-pickle-300 transition-all overflow-hidden relative">
                  {logoPreview ? (
                    <img src={logoPreview} className="h-20 object-contain group-hover:scale-110 transition-transform" />
                  ) : (
                    <div className="text-center">
                      <Upload size={32} className="text-pickle-400 mx-auto mb-2" />
                      <p className="text-[9px] font-black text-pickle-600 uppercase">Upload Logo</p>
                    </div>
                  )}
                  <input type="file" ref={logoInputRef} onChange={(e) => { const f = e.target.files?.[0]; if(f) setLogoPreview(URL.createObjectURL(f)) }} className="hidden" />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-brown-400 uppercase tracking-widest ml-4">Favicon (Square)</label>
                <div onClick={() => faviconInputRef.current?.click()} className="h-28 bg-pickle-50/50 rounded-[2.5rem] border-4 border-dashed border-pickle-100 flex flex-col items-center justify-center cursor-pointer group hover:border-pickle-300 transition-all overflow-hidden relative">
                  {faviconPreview ? (
                    <img src={faviconPreview} className="w-12 h-12 object-contain group-hover:scale-110 transition-transform" />
                  ) : (
                    <Upload size={24} className="text-pickle-400" />
                  )}
                  <input type="file" ref={faviconInputRef} onChange={(e) => { const f = e.target.files?.[0]; if(f) setFaviconPreview(URL.createObjectURL(f)) }} className="hidden" />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-10 rounded-[3.5rem] border border-pickle-100 shadow-sm space-y-8">
            <h2 className="text-xl font-black text-brown-900 flex items-center gap-3">
              <Truck className="text-pickle-600" size={24} /> Shipping & Payment
            </h2>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-brown-400 uppercase tracking-widest ml-4">Delivery Charge (₹)</label>
                <input type="number" name="deliveryCharge" value={formData.deliveryCharge} onChange={handleChange} className="w-full bg-pickle-50 border border-pickle-100 px-8 py-5 rounded-[2rem] font-black text-brown-900 focus:outline-none" />
              </div>
              <label className="flex items-center justify-between bg-pickle-50 px-8 py-6 rounded-[2rem] border border-pickle-100 cursor-pointer hover:border-pickle-300 transition-all">
                <div className="flex items-center gap-4">
                  <CreditCard className={formData.enableOnlinePayment ? "text-pickle-600" : "text-brown-300"} size={20} />
                  <span className="text-[11px] font-black text-brown-900 uppercase">Online Payment</span>
                </div>
                <div className={`w-12 h-6 rounded-full p-1 transition-all ${formData.enableOnlinePayment ? 'bg-pickle-600' : 'bg-brown-200'}`}>
                  <div className={`w-4 h-4 bg-white rounded-full transition-transform ${formData.enableOnlinePayment ? 'translate-x-6' : 'translate-x-0'}`} />
                </div>
                <input type="checkbox" name="enableOnlinePayment" checked={formData.enableOnlinePayment} onChange={(e) => setFormData({...formData, enableOnlinePayment: e.target.checked})} className="hidden" />
              </label>
            </div>
          </div>
        </div>

        {/* Middle & Right: Business Details & Socials */}
        <div className="lg:col-span-2 space-y-10">
          <div className="bg-white p-12 rounded-[4rem] border border-pickle-100 shadow-sm space-y-10">
            <h2 className="text-2xl font-black text-brown-900 flex items-center gap-4">
              <Globe className="text-pickle-600" size={32} /> Business Identity
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-brown-400 uppercase tracking-widest ml-4">Website Name</label>
                <input type="text" name="siteName" value={formData.siteName} onChange={handleChange} className="w-full bg-pickle-50 border border-pickle-100 px-8 py-5 rounded-[2rem] font-black text-lg text-brown-900 focus:outline-none" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-brown-400 uppercase tracking-widest ml-4">Official Email</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full bg-pickle-50 border border-pickle-100 px-8 py-5 rounded-[2rem] font-black text-brown-900 focus:outline-none" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-brown-400 uppercase tracking-widest ml-4">Contact Phone</label>
                <input type="text" name="phone" value={formData.phone} onChange={handleChange} className="w-full bg-pickle-50 border border-pickle-100 px-8 py-5 rounded-[2rem] font-black text-brown-900 focus:outline-none" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-brown-400 uppercase tracking-widest ml-4">HQ Address</label>
                <input type="text" name="address" value={formData.address} onChange={handleChange} className="w-full bg-pickle-50 border border-pickle-100 px-8 py-5 rounded-[2rem] font-black text-brown-900 focus:outline-none" />
              </div>
            </div>

            <div className="pt-8 border-t border-pickle-50">
              <h3 className="text-lg font-black text-brown-900 mb-8 uppercase tracking-widest flex items-center gap-3">
                <div className="w-1.5 h-6 bg-pickle-600 rounded-full" /> Social Media Links
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="relative">
                  <FacebookIcon className="absolute left-6 top-1/2 -translate-y-1/2 text-pickle-600" size={20} />
                  <input type="text" name="facebook" value={formData.facebook} onChange={handleChange} placeholder="Facebook URL" className="w-full bg-pickle-50 border border-pickle-100 pl-16 pr-8 py-5 rounded-[2rem] font-bold text-sm text-brown-700 focus:outline-none" />
                </div>
                <div className="relative">
                  <InstagramIcon className="absolute left-6 top-1/2 -translate-y-1/2 text-pickle-600" size={20} />
                  <input type="text" name="instagram" value={formData.instagram} onChange={handleChange} placeholder="Instagram URL" className="w-full bg-pickle-50 border border-pickle-100 pl-16 pr-8 py-5 rounded-[2rem] font-bold text-sm text-brown-700 focus:outline-none" />
                </div>
                <div className="relative">
                  <TwitterIcon className="absolute left-6 top-1/2 -translate-y-1/2 text-pickle-600" size={20} />
                  <input type="text" name="twitter" value={formData.twitter} onChange={handleChange} placeholder="Twitter URL" className="w-full bg-pickle-50 border border-pickle-100 pl-16 pr-8 py-5 rounded-[2rem] font-bold text-sm text-brown-700 focus:outline-none" />
                </div>
                <div className="relative">
                  <YoutubeIcon className="absolute left-6 top-1/2 -translate-y-1/2 text-pickle-600" size={20} />
                  <input type="text" name="youtube" value={formData.youtube} onChange={handleChange} placeholder="Youtube URL" className="w-full bg-pickle-50 border border-pickle-100 pl-16 pr-8 py-5 rounded-[2rem] font-bold text-sm text-brown-700 focus:outline-none" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
