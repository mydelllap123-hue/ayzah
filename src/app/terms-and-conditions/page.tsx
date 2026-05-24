"use client";

import React from "react";
import { motion } from "framer-motion";
import { FileText, Phone, Mail, MapPin, ChevronRight, Home, MessageCircle } from "lucide-react";
import Link from "next/link";

interface TermSection {
  num: string;
  title: string;
  content: string;
}

export default function TermsPage() {
  const sections: TermSection[] = [
    {
      num: "1",
      title: "Introduction",
      content: "Welcome to Ayzah Pickles. By using our website and placing orders, you agree to follow the terms and conditions mentioned below. Please read them carefully before purchasing."
    },
    {
      num: "2",
      title: "Homemade Product Notice",
      content: "All Ayzah Pickles products are homemade and prepared using fresh ingredients, traditional Kerala recipes, and hygienic methods. Minor variations in color, texture, or taste may occur naturally."
    },
    {
      num: "3",
      title: "Product Freshness & Storage",
      content: "Our pickles are prepared in small batches to maintain freshness and quality. Customers are advised to store products in a cool and dry place and always use a dry spoon after opening."
    },
    {
      num: "4",
      title: "Orders & Acceptance",
      content: "Orders placed through our website are subject to availability and confirmation. Ayzah Pickles reserves the right to cancel or refuse any order if necessary."
    },
    {
      num: "5",
      title: "Pricing",
      content: "All prices displayed on the website are in Indian Rupees (₹). Prices may change without prior notice depending on ingredient availability and market conditions."
    },
    {
      num: "6",
      title: "Shipping & Delivery",
      content: "We aim to deliver orders within the estimated delivery period shown on the website. Delivery delays caused by courier services, weather conditions, or other unavoidable situations are not under our control."
    },
    {
      num: "7",
      title: "Cancellation Policy",
      content: "Orders can only be cancelled before they are packed or shipped. Once shipped, cancellation requests may not be accepted."
    },
    {
      num: "8",
      title: "Return & Refund Policy",
      content: "Since food products are perishable items, returns are generally not accepted. Refunds or replacements will only be provided for damaged, incorrect, or spoiled products reported within 24 hours of delivery with proper proof."
    },
    {
      num: "9",
      title: "Online Payments",
      content: "We support secure online payments through trusted payment gateways including UPI, cards, wallets, and net banking. Ayzah Pickles is not responsible for temporary payment gateway failures or bank-related issues."
    },
    {
      num: "10",
      title: "Cash on Delivery (COD)",
      content: "COD service may be available only for selected locations. Repeated fake or rejected COD orders may lead to account restrictions."
    },
    {
      num: "11",
      title: "Customer Responsibility",
      content: "Customers must provide accurate shipping address, contact number, and delivery details while placing orders. Ayzah Pickles will not be responsible for failed deliveries caused by incorrect information."
    },
    {
      num: "12",
      title: "Allergies & Ingredients",
      content: "Some products may contain ingredients such as mustard, sesame oil, seafood, or spices that may cause allergies in sensitive individuals. Customers are advised to review ingredients carefully before consumption."
    },
    {
      num: "13",
      title: "Intellectual Property",
      content: "All website content including logo, product images, branding, and designs belong to Ayzah Pickles and may not be copied or reused without permission."
    },
    {
      num: "14",
      title: "Privacy",
      content: "Customer information collected through the website will only be used for order processing, support, and service improvement. We do not sell customer data to third parties."
    },
    {
      num: "15",
      title: "Changes to Terms",
      content: "Ayzah Pickles reserves the right to update or modify these terms at any time without prior notice."
    }
  ];

  return (
    <div className="bg-pickle-50 min-h-screen pt-32 pb-24 font-poppins">
      <title>Ayzah Pickles | Terms & Conditions</title>
      <meta name="description" content="Review the official Terms & Conditions, homemade Kerala pickles guidelines, ordering policies, shipping information, secure payment rules, and customer support contact details for Ayzah Pickles." />
      <div className="max-w-4xl mx-auto px-4 md:px-6 w-full">
        
        {/* Page Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-pickle-100 text-pickle-700 px-4 py-2 rounded-full text-xs font-bold mb-4 shadow-sm border border-pickle-100">
            <FileText size={14} /> TERMS OF SERVICE
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-brown-900 mb-2 uppercase tracking-tight">
            Terms & <span className="text-pickle-600">Conditions</span>
          </h1>
          <p className="text-brown-600 text-sm md:text-base font-semibold italic mt-2">
            “Please read our policies carefully before placing an order.”
          </p>
          <p className="text-brown-400 text-[10px] md:text-xs font-bold uppercase tracking-widest mt-3">
            Last Updated: May 23, 2026
          </p>
        </div>

        {/* Content Container */}
        <div className="bg-white rounded-[2.5rem] p-6 md:p-12 border border-pickle-100 shadow-sm space-y-10">
          
          {/* Introduction block */}
          <div className="p-6 bg-pickle-50/50 rounded-3xl border border-pickle-100/50 flex flex-col md:flex-row gap-5 items-start">
            <div className="w-12 h-12 bg-pickle-600 text-white rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-pickle-600/10">
              <FileText size={22} />
            </div>
            <div>
              <p className="text-sm font-bold text-brown-900 leading-relaxed">
                Welcome to Ayzah Pickles. These Terms & Conditions govern your access to and use of our online pickle platform, including orders and purchases. By accessing or shopping with us, you agree to comply with all terms stated below.
              </p>
            </div>
          </div>

          {/* Grid of Sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
            {sections.map((section, idx) => (
              <motion.div
                key={section.num}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: Math.min(idx * 0.05, 0.3) }}
                className="bg-white p-6 rounded-3xl border border-pickle-100 hover:shadow-lg transition-all duration-300 flex gap-4"
              >
                <span className="text-pickle-600 font-black text-lg bg-pickle-50 w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border border-pickle-100/50">
                  {section.num}
                </span>
                <div>
                  <h3 className="font-extrabold text-brown-900 text-base mb-2 leading-tight border-l-2 border-pickle-500 pl-2">
                    {section.title}
                  </h3>
                  <p className="text-brown-600 text-xs font-medium leading-relaxed">
                    {section.content}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Contact Section (Clause 16) */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-brown-900 text-pickle-50 p-8 rounded-3xl border border-brown-800 shadow-xl shadow-brown-900/10"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <span className="text-pickle-400 text-[10px] font-black uppercase tracking-widest block mb-1">Clause 16</span>
                <h3 className="text-xl font-black uppercase tracking-tight mb-2">Contact Information</h3>
                <p className="text-brown-300 text-xs font-medium max-w-md leading-relaxed">
                  Have questions or queries regarding our homemade pickles or orders? Reach out to our traditional Kerala pickle center.
                </p>
              </div>
              
              <div className="space-y-3.5 shrink-0 bg-brown-950/40 p-5 rounded-2xl border border-white/5 min-w-[240px]">
                <div className="flex items-center gap-3 text-xs font-bold">
                  <Phone size={15} className="text-pickle-400 shrink-0" />
                  <span>9072354069</span>
                </div>
                <div className="flex items-center gap-3 text-xs font-bold">
                  <Mail size={15} className="text-pickle-400 shrink-0" />
                  <span className="lowercase">ayzahgroup@gmail.com</span>
                </div>
                <div className="flex items-center gap-3 text-xs font-bold">
                  <MapPin size={15} className="text-pickle-400 shrink-0" />
                  <span>Malappuram, Kerala, India</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <div className="flex flex-wrap justify-center gap-4 pt-8 border-t border-pickle-100">
            <Link 
              href="/" 
              className="inline-flex items-center gap-2 bg-white text-brown-900 border border-pickle-200 px-6 py-3.5 rounded-2xl font-bold hover:bg-pickle-50 hover:border-pickle-300 transition-all active:scale-95 text-sm shadow-sm"
            >
              <Home size={18} className="text-pickle-600" />
              Back to Home
            </Link>
            <a 
              href="https://wa.me/919072354069?text=Hello!%20I%20have%20a%20question%20about%20your%20Terms%20%26%20Conditions." 
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#25D366] text-white px-6 py-3.5 rounded-2xl font-bold hover:bg-[#128C7E] transition-all active:scale-95 text-sm shadow-md shadow-green-900/10"
            >
              <MessageCircle size={18} />
              WhatsApp Support
            </a>
          </div>

        </div>

        {/* Footer Breadcrumb Navigation */}
        <div className="mt-12 flex justify-center items-center gap-2 text-xs font-bold text-brown-400 uppercase tracking-widest">
          <Link href="/" className="hover:text-pickle-600 transition-colors">Home</Link>
          <ChevronRight size={12} className="text-brown-300" />
          <Link href="/shop" className="hover:text-pickle-600 transition-colors">Shop</Link>
          <ChevronRight size={12} className="text-brown-300" />
          <span className="text-brown-900 font-extrabold">Terms & Conditions</span>
        </div>

      </div>
    </div>
  );
}
