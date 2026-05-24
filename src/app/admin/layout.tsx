"use client";

import React from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { Search, Bell, User } from "lucide-react";
import { usePathname } from "next/navigation";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";

  if (isLoginPage) {
    return <div className="min-h-screen bg-pickle-50 font-poppins">{children}</div>;
  }

  return (
    <div className="min-h-screen bg-pickle-50 flex font-poppins">
      <AdminSidebar />
      
      <main className="flex-1 ml-56 min-h-screen">
        {/* Header */}
        <header className="bg-white border-b border-pickle-100 h-16 flex items-center justify-between px-6 sticky top-0 z-40">
          <div className="relative w-72">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brown-400" />
            <input 
              type="text" 
              placeholder="Search dashboard..." 
              className="w-full bg-pickle-50 border border-pickle-100 pl-10 pr-4 py-2 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-pickle-500/20"
            />
          </div>

          <div className="flex items-center gap-4">
            <button className="relative w-8 h-8 bg-pickle-50 rounded-full flex items-center justify-center text-brown-600 hover:bg-pickle-100 transition-colors">
              <Bell size={18} />
              <span className="absolute top-1.5 right-2 w-1.5 h-1.5 bg-red-500 rounded-full border border-white"></span>
            </button>
            
            <div className="flex items-center gap-3 pl-4 border-l border-pickle-100">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold text-brown-900 leading-tight">Ayzah Admin</p>
                <p className="text-[9px] text-pickle-600 font-bold uppercase tracking-wider leading-none">Superuser</p>
              </div>
              <div className="w-8 h-8 bg-brown-900 rounded-full flex items-center justify-center text-pickle-500">
                <User size={18} />
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
