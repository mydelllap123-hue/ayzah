"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Phone, Mail, MapPin, MessageSquare, Send, Loader2 } from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error" | null, msg: string }>({ type: null, msg: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      setStatus({ type: "error", msg: "Please fill all fields" });
      return;
    }

    setLoading(true);
    setStatus({ type: null, msg: "" });

    try {
      // Formatted message for WhatsApp
      const whatsappMsg = `Name: ${formData.name}%0AEmail: ${formData.email}%0ASubject: ${formData.subject}%0AMessage: ${formData.message}`;
      const whatsappNumber = "918301946206";
      
      // Simulate small delay for loading state
      await new Promise(resolve => setTimeout(resolve, 800));

      // Open WhatsApp
      window.open(`https://wa.me/${whatsappNumber}?text=${whatsappMsg}`, "_blank");
      
      setStatus({ type: "success", msg: "Message sent successfully" });
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      setStatus({ type: "error", msg: "Something went wrong. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white min-h-screen pt-32 pb-24 font-poppins">
      {/* Hero Header */}
      <section className="bg-pickle-50 py-20 mb-16">
        <div className="container mx-auto px-4 md:px-8 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-brown-900 mb-6 uppercase tracking-tight"
          >
            Contact <span className="text-pickle-600">Us</span>
          </motion.h1>
          <p className="text-brown-600 text-lg max-w-2xl mx-auto font-medium">For orders, queries, or support, feel free to contact us anytime. We are happy to help you.</p>
          <div className="w-24 h-1 bg-pickle-500 mx-auto mt-8 rounded-full"></div>
        </div>
      </section>

      <div className="container mx-auto px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            
            {/* Contact Information */}
            <div>
              <h2 className="text-3xl font-bold text-brown-900 mb-10">Get In Touch</h2>
              
              <div className="space-y-8">
                <div className="flex gap-6 items-start group">
                  <div className="w-14 h-14 bg-pickle-50 rounded-2xl flex items-center justify-center text-pickle-600 shadow-sm shrink-0 group-hover:bg-pickle-600 group-hover:text-white transition-all">
                    <Phone size={24} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-brown-400 uppercase tracking-widest mb-1">Phone Number</h4>
                    <p className="text-xl font-bold text-brown-900">+91 8301 946 206</p>
                  </div>
                </div>

                <div className="flex gap-6 items-start group">
                  <div className="w-14 h-14 bg-pickle-50 rounded-2xl flex items-center justify-center text-pickle-600 shadow-sm shrink-0 group-hover:bg-pickle-600 group-hover:text-white transition-all">
                    <Mail size={24} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-brown-400 uppercase tracking-widest mb-1">Email Address</h4>
                    <p className="text-xl font-bold text-brown-900">ayzahgroup@gmail.com</p>
                  </div>
                </div>

                <div className="flex gap-6 items-start group">
                  <div className="w-14 h-14 bg-pickle-50 rounded-2xl flex items-center justify-center text-pickle-600 shadow-sm shrink-0 group-hover:bg-pickle-600 group-hover:text-white transition-all">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-brown-400 uppercase tracking-widest mb-1">Location</h4>
                    <p className="text-xl font-bold text-brown-900">Malappuram, Kerala, India</p>
                  </div>
                </div>

                <div className="flex gap-6 items-start group">
                  <div className="w-14 h-14 bg-pickle-50 rounded-2xl flex items-center justify-center text-pickle-600 shadow-sm shrink-0 group-hover:bg-pickle-600 group-hover:text-white transition-all">
                    <MessageSquare size={24} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-brown-400 uppercase tracking-widest mb-1">Brand Name</h4>
                    <p className="text-xl font-bold text-brown-900">Ayzah Pickle</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-pickle-50 p-8 md:p-12 rounded-[40px] border border-pickle-100 shadow-sm">
              <h3 className="text-2xl font-bold text-brown-900 mb-8">Send us a Message</h3>
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-brown-700 ml-1">Your Name</label>
                    <input 
                      type="text" 
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="John Doe" 
                      className="w-full bg-white border border-pickle-100 rounded-xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-pickle-500/20 font-medium" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-brown-700 ml-1">Email Address</label>
                    <input 
                      type="email" 
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="john@example.com" 
                      className="w-full bg-white border border-pickle-100 rounded-xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-pickle-500/20 font-medium" 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-brown-700 ml-1">Subject</label>
                  <input 
                    type="text" 
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="How can we help?" 
                    className="w-full bg-white border border-pickle-100 rounded-xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-pickle-500/20 font-medium" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-brown-700 ml-1">Message</label>
                  <textarea 
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={4} 
                    placeholder="Your message here..." 
                    className="w-full bg-white border border-pickle-100 rounded-xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-pickle-500/20 font-medium resize-none"
                  ></textarea>
                </div>

                {status.type && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-4 rounded-xl text-sm font-bold ${status.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
                  >
                    {status.msg}
                  </motion.div>
                )}

                <button 
                  disabled={loading}
                  className="w-full bg-pickle-600 text-white font-bold py-5 rounded-xl shadow-xl shadow-pickle-600/20 hover:bg-pickle-700 transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader2 size={20} className="animate-spin" /> Sending...
                    </>
                  ) : (
                    <>
                      <Send size={20} /> Send Message
                    </>
                  )}
                </button>
              </form>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
