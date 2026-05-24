"use client";

import React from "react";
import { Truck, ShieldCheck, MapPin, Clock } from "lucide-react";

export default function ShippingPolicyPage() {
  return (
    <div className="min-h-screen pt-40 pb-24 bg-pickle-50 font-poppins">
      <div className="container mx-auto px-4 md:px-8 max-w-4xl">
        <div className="text-center mb-16">
          <span className="text-pickle-600 font-bold uppercase tracking-widest text-sm mb-4 block">Information</span>
          <h1 className="text-4xl md:text-5xl font-bold text-brown-900 mb-6">Shipping <span className="text-pickle-600">Policy</span></h1>
          <p className="text-brown-600 text-lg font-medium">Everything you need to know about how we deliver our pickles to your home.</p>
        </div>

        <div className="bg-white rounded-[40px] shadow-sm border border-pickle-100 overflow-hidden">
          <div className="p-8 md:p-12 space-y-12">
            
            {/* Delivery Time */}
            <section className="flex gap-6">
              <div className="w-14 h-14 bg-pickle-100 rounded-2xl flex items-center justify-center shrink-0 text-pickle-600">
                <Clock size={28} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-brown-900 mb-3">Delivery Timeline</h2>
                <p className="text-brown-600 leading-relaxed font-medium">
                  Orders are processed within 24-48 hours. Once shipped, delivery typically takes:
                  <ul className="list-disc ml-5 mt-4 space-y-2">
                    <li>Kerala: 2-3 business days</li>
                    <li>South India: 3-5 business days</li>
                    <li>Rest of India: 5-7 business days</li>
                  </ul>
                </p>
              </div>
            </section>

            {/* Shipping Charges */}
            <section className="flex gap-6">
              <div className="w-14 h-14 bg-pickle-100 rounded-2xl flex items-center justify-center shrink-0 text-pickle-600">
                <Truck size={28} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-brown-900 mb-3">Shipping Charges</h2>
                <p className="text-brown-600 leading-relaxed font-medium">
                  We offer free shipping on orders above ₹999. For orders below this amount, a flat shipping fee of ₹50 is applicable pan-India.
                </p>
              </div>
            </section>

            {/* Tracking */}
            <section className="flex gap-6">
              <div className="w-14 h-14 bg-pickle-100 rounded-2xl flex items-center justify-center shrink-0 text-pickle-600">
                <ShieldCheck size={28} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-brown-900 mb-3">Order Tracking</h2>
                <p className="text-brown-600 leading-relaxed font-medium">
                  Once your order is dispatched, you will receive a tracking link via email and WhatsApp. You can also track your order directly on our <a href="/track-order" className="text-pickle-600 font-bold underline">Tracking Page</a>.
                </p>
              </div>
            </section>

            {/* Coverage */}
            <section className="flex gap-6">
              <div className="w-14 h-14 bg-pickle-100 rounded-2xl flex items-center justify-center shrink-0 text-pickle-600">
                <MapPin size={28} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-brown-900 mb-3">Delivery Coverage</h2>
                <p className="text-brown-600 leading-relaxed font-medium">
                  We currently ship to over 25,000 pin codes across India. If we are unable to deliver to your specific location, we will contact you within 24 hours to initiate a full refund.
                </p>
              </div>
            </section>

          </div>
          
          <div className="bg-pickle-50 p-8 text-center border-t border-pickle-100">
            <p className="text-brown-700 font-bold mb-2">Need more information?</p>
            <p className="text-brown-500 text-sm mb-0">Contact our support team at <a href="mailto:ayzahgroup@gmail.com" className="text-pickle-600 underline">ayzahgroup@gmail.com</a></p>
          </div>
        </div>
      </div>
    </div>
  );
}
