"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Home, AlertCircle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-pickle-50 flex items-center justify-center px-4 font-poppins">
      <div className="max-w-md w-full text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="w-24 h-24 bg-pickle-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle size={48} className="text-pickle-600" />
          </div>
          <h1 className="text-8xl font-black text-brown-900 mb-2">404</h1>
          <h2 className="text-2xl font-bold text-brown-800 mb-4">Page Not Found</h2>
          <p className="text-brown-600 mb-10 font-medium">
            The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
          </p>
        </motion.div>

        <Link 
          href="/" 
          className="inline-flex items-center gap-2 bg-pickle-600 text-white px-8 py-4 rounded-2xl font-bold shadow-xl shadow-pickle-600/20 hover:bg-pickle-700 transition-all group"
        >
          <Home size={20} className="group-hover:-translate-y-0.5 transition-transform" />
          Back to Home
        </Link>
      </div>
    </div>
  );
}
