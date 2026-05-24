"use client";

import React from "react";
import { HelpCircle, MessageCircle, Mail, Phone, ExternalLink } from "lucide-react";

export default function HelpPage() {
  const faqs = [
    { q: "How long does delivery take?", a: "Typically 3-5 business days across India." },
    { q: "Are your pickles organic?", a: "We use fresh, natural ingredients without added preservatives." },
    { q: "Do you ship internationally?", a: "Currently we only ship within India, but international shipping is coming soon!" },
    { q: "How can I store the pickles?", a: "Store in a cool, dry place. Always use a dry spoon for longer shelf life." }
  ];

  return (
    <div className="min-h-screen pt-40 pb-24 bg-pickle-50 font-poppins">
      <div className="container mx-auto px-4 md:px-8 max-w-5xl">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-brown-900 mb-4">How can we <span className="text-pickle-600">Help?</span></h1>
          <p className="text-brown-600 text-lg font-medium">Find answers to common questions or reach out to our support team.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* FAQ Section */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-2xl font-bold text-brown-900 mb-8 flex items-center gap-3">
              <HelpCircle className="text-pickle-600" /> Frequently Asked Questions
            </h2>
            {faqs.map((faq, i) => (
              <div key={i} className="bg-white p-6 md:p-8 rounded-3xl border border-pickle-100 shadow-sm">
                <h3 className="text-lg font-bold text-brown-900 mb-3">{faq.q}</h3>
                <p className="text-brown-600 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>

          {/* Contact Support */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-brown-900 mb-8">Direct Support</h2>
            <div className="bg-pickle-600 rounded-[40px] p-8 text-white shadow-xl shadow-pickle-600/20">
              <h3 className="text-xl font-bold mb-6">Need immediate help?</h3>
              <div className="space-y-4">
                <a href="tel:+918301946206" className="flex items-center gap-4 bg-white/10 hover:bg-white/20 p-4 rounded-2xl transition-colors">
                  <Phone size={20} />
                  <div>
                    <p className="text-xs font-bold text-pickle-200 uppercase tracking-widest">Call Us</p>
                    <p className="font-bold">+91 8301 946 206</p>
                  </div>
                </a>
                <a href="mailto:support@ayzahpickles.com" className="flex items-center gap-4 bg-white/10 hover:bg-white/20 p-4 rounded-2xl transition-colors">
                  <Mail size={20} />
                  <div>
                    <p className="text-xs font-bold text-pickle-200 uppercase tracking-widest">Email Us</p>
                    <p className="font-bold">support@ayzahpickles.com</p>
                  </div>
                </a>
                <a href="/contact" className="flex items-center gap-4 bg-white/10 hover:bg-white/20 p-4 rounded-2xl transition-colors">
                  <MessageCircle size={20} />
                  <div>
                    <p className="text-xs font-bold text-pickle-200 uppercase tracking-widest">Chat with Us</p>
                    <p className="font-bold">Contact Form</p>
                  </div>
                </a>
              </div>
            </div>
            
            <div className="bg-brown-900 rounded-[40px] p-8 text-white shadow-xl shadow-brown-900/20">
              <h3 className="text-xl font-bold mb-4">Refund Policy</h3>
              <p className="text-brown-300 text-sm mb-6 leading-relaxed">Changed your mind? Read our refund and return policies here.</p>
              <a href="/refund-policy" className="inline-flex items-center gap-2 text-pickle-400 font-bold hover:text-pickle-300 transition-colors">
                View Policy <ExternalLink size={16} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
