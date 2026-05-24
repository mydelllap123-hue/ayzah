"use client";

import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ShieldAlert, Loader2, Lock, Mail, ArrowLeft } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        toast.error(res.error || "Invalid email or password");
        setLoading(false);
      } else {
        // Fetch session to check if user is admin
        const sessionRes = await fetch("/api/auth/session");
        const session = await sessionRes.json();
        
        const role = session?.user?.role;
        const isAdmin = role === "admin" || role === "superadmin";

        if (isAdmin) {
          toast.success("Welcome back, Administrator!");
          router.push("/admin");
        } else {
          toast.error("Access Denied: You are not authorized as an admin.");
          // Sign out immediately
          await fetch("/api/auth/signout", { method: "POST" });
          setLoading(false);
        }
      }
    } catch (err: any) {
      toast.error("An error occurred during sign in.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-pickle-50 px-4 py-12 relative overflow-hidden font-poppins">
      {/* Background blobs */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-pickle-100 rounded-full blur-3xl opacity-60" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-pickle-200 rounded-full blur-3xl opacity-40" />

      <div className="max-w-md w-full space-y-6 z-10">
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-bold text-brown-500 hover:text-pickle-600 transition-colors mb-4 uppercase tracking-widest">
            <ArrowLeft size={12} /> Back to Store
          </Link>
          <div className="w-16 h-16 bg-brown-900 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-pickle-100 shadow-md">
            <Lock className="text-pickle-500" size={26} />
          </div>
          <h2 className="text-2xl font-black text-brown-900 tracking-tight uppercase">
            Ayzah <span className="text-pickle-600">Pickles</span>
          </h2>
          <p className="text-xs text-brown-500 font-bold uppercase tracking-widest mt-1">
            Ecommerce Control Panel
          </p>
        </div>

        <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-pickle-100 shadow-xl shadow-brown-900/5">
          <h3 className="text-sm font-black text-brown-900 uppercase tracking-widest mb-6 pb-2 border-b border-pickle-100 flex items-center gap-2">
            <ShieldAlert size={16} className="text-pickle-600" /> Admin Authentication
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-brown-700 uppercase tracking-wider block">Administrator Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brown-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@ayzahpickles.com"
                  className="w-full bg-pickle-50 border border-pickle-100 text-brown-900 pl-10 pr-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-pickle-500/20 text-xs font-semibold transition-all"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-brown-700 uppercase tracking-wider block">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brown-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-pickle-50 border border-pickle-100 text-brown-900 pl-10 pr-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-pickle-500/20 text-xs font-semibold transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-pickle-600 text-white py-3 rounded-xl font-bold text-xs hover:bg-pickle-700 transition-all shadow-md shadow-pickle-600/10 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer uppercase tracking-widest mt-6"
            >
              {loading ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>Sign In As Admin</span>
                </>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-[10px] text-brown-400 font-extrabold uppercase tracking-widest">
          Authorized personnel only • 100% Encrypted connection
        </p>
      </div>
    </div>
  );
}
