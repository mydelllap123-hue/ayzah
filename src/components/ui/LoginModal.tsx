"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Lock, User, Loader2 } from "lucide-react";
import { useStore } from "@/context/StoreContext";
import { signIn } from "next-auth/react";
import toast from "react-hot-toast";

export default function LoginModal() {
  const { isLoginOpen, setIsLoginOpen } = useStore();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCredentialsAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        name: formData.name,
        isSignUp: !isLogin ? "true" : "false",
        redirect: false,
      });

      if (result?.error) {
        throw new Error(result.error);
      }

      toast.success(isLogin ? "Logged in successfully!" : "Account created successfully!");
      setIsLoginOpen(false);
      setFormData({ name: "", email: "", password: "" });
      
      // Fetch session to check role and redirect
      const sessionRes = await fetch("/api/auth/session");
      const session = await sessionRes.json();
      
      if (session?.user?.role === "admin" || session?.user?.role === "superadmin") {
        window.location.href = "/admin";
      } else {
        window.location.reload();
      }
      
    } catch (error: any) {
      toast.error(error.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      await signIn("google", { callbackUrl: "/" });
    } catch (error) {
      toast.error("Google login failed. Please try again.");
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isLoginOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsLoginOpen(false)}
            className="fixed inset-0 bg-brown-900/60 backdrop-blur-sm z-[80]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-md bg-white rounded-3xl z-[90] shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="bg-pickle-50 p-6 flex justify-between items-center border-b border-pickle-100">
              <h2 className="text-xl font-bold text-brown-900">
                {isLogin ? "Welcome Back" : "Create Account"}
              </h2>
              <button
                onClick={() => setIsLoginOpen(false)}
                className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-brown-500 hover:text-red-500 shadow-sm transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Content */}
            <div className="p-8">
              
              <div className="flex p-1 bg-pickle-50 rounded-xl mb-8 border border-pickle-100">
                <button 
                  className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${isLogin ? 'bg-white text-pickle-600 shadow-sm' : 'text-brown-500'}`}
                  onClick={() => setIsLogin(true)}
                >
                  Login
                </button>
                <button 
                  className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${!isLogin ? 'bg-white text-pickle-600 shadow-sm' : 'text-brown-500'}`}
                  onClick={() => setIsLogin(false)}
                >
                  Sign Up
                </button>
              </div>

              <form onSubmit={handleCredentialsAuth} className="space-y-4">
                {!isLogin && (
                  <div className="relative">
                    <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-brown-400" />
                    <input 
                      type="text" 
                      name="name"
                      placeholder="Full Name" 
                      required 
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full bg-white border border-pickle-200 text-brown-900 pl-11 pr-4 py-3 rounded-xl focus:outline-none focus:border-pickle-500 focus:ring-1 focus:ring-pickle-500" 
                    />
                  </div>
                )}
                
                <div className="relative">
                  <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-brown-400" />
                  <input 
                    type="email" 
                    name="email"
                    placeholder="Email Address" 
                    required 
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-white border border-pickle-200 text-brown-900 pl-11 pr-4 py-3 rounded-xl focus:outline-none focus:border-pickle-500 focus:ring-1 focus:ring-pickle-500" 
                  />
                </div>
                
                <div className="relative">
                  <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-brown-400" />
                  <input 
                    type="password" 
                    name="password"
                    placeholder="Password" 
                    required 
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full bg-white border border-pickle-200 text-brown-900 pl-11 pr-4 py-3 rounded-xl focus:outline-none focus:border-pickle-500 focus:ring-1 focus:ring-pickle-500" 
                  />
                </div>

                {isLogin && (
                  <div className="flex justify-between items-center text-sm">
                    <label className="flex items-center gap-2 cursor-pointer text-brown-600 font-medium">
                      <input type="checkbox" className="accent-pickle-600 w-4 h-4" /> Remember me
                    </label>
                    <a href="#" className="text-pickle-600 font-bold hover:underline">Forgot Password?</a>
                  </div>
                )}

                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-pickle-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-pickle-600/30 hover:bg-pickle-700 transition-colors mt-4 flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {loading ? <Loader2 className="animate-spin" size={20} /> : (isLogin ? "Login to Account" : "Create Account")}
                </button>

                <div className="relative flex items-center py-4">
                  <div className="flex-grow border-t border-pickle-100"></div>
                  <span className="flex-shrink-0 mx-4 text-brown-400 text-sm font-medium">Or continue with</span>
                  <div className="flex-grow border-t border-pickle-100"></div>
                </div>

                <button 
                  type="button" 
                  onClick={handleGoogleLogin}
                  disabled={loading}
                  className="w-full bg-white border-2 border-pickle-100 text-brown-900 font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 hover:bg-pickle-50 transition-colors disabled:opacity-70"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25C22.56 11.47 22.49 10.72 22.36 10H12V14.26H17.92C17.66 15.63 16.88 16.78 15.71 17.57V20.34H19.28C21.36 18.42 22.56 15.6 22.56 12.25Z" fill="#4285F4"/>
                    <path d="M12 23C14.97 23 17.46 22.02 19.28 20.34L15.71 17.57C14.73 18.23 13.48 18.64 12 18.64C9.13 18.64 6.7 16.71 5.82 14.12H2.15V16.96C3.96 20.57 7.68 23 12 23Z" fill="#34A853"/>
                    <path d="M5.82 14.12C5.6 13.46 5.47 12.75 5.47 12C5.47 11.25 5.6 10.54 5.82 9.88V7.04H2.15C1.41 8.52 1 10.21 1 12C1 13.79 1.41 15.48 2.15 16.96L5.82 14.12Z" fill="#FBBC05"/>
                    <path d="M12 5.38C13.62 5.38 15.06 5.93 16.21 7.02L19.36 3.87C17.46 2.1 14.97 1 12 1C7.68 1 3.96 3.43 2.15 7.04L5.82 9.88C6.7 7.29 9.13 5.38 12 5.38Z" fill="#EA4335"/>
                  </svg>
                  Google Login
                </button>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
