import React from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  Users, 
  Settings, 
  Image as ImageIcon, 
  Layers, 
  LogOut,
  ChevronRight,
  Plus,
  Star
} from "lucide-react";

export default function AdminSidebar() {
  const menuItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Products", href: "/admin/products", icon: Package },
    { name: "Orders", href: "/admin/orders", icon: ShoppingBag },
    { name: "Users", href: "/admin/users", icon: Users },
    { name: "Reviews", href: "/admin/reviews", icon: Star },
    { name: "Categories", href: "/admin/categories", icon: Layers },
    { name: "Banners", href: "/admin/banners", icon: ImageIcon },
    { name: "Settings", href: "/admin/settings", icon: Settings },
  ];

  return (
    <aside className="w-56 bg-brown-900 text-pickle-50 flex flex-col fixed inset-y-0 z-50">
      <div className="p-5 border-b border-brown-800">
        <Link href="/admin" className="block active:scale-95 transition-transform">
          <Image
            src="/images/ayzah-logo.png"
            alt="Ayzah Pickles"
            width={220}
            height={70}
            priority
            className="h-[30px] w-auto object-contain brightness-0 invert"
          />
        </Link>
      </div>

      <nav className="flex-1 px-3 py-5 space-y-1.5 overflow-y-auto">
        {menuItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-brown-800 transition-colors group"
          >
            <item.icon size={18} className="text-pickle-500 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold">{item.name}</span>
            <ChevronRight size={12} className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-brown-800">
        <Link 
          href="/" 
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-brown-400 hover:text-white transition-colors"
        >
          <LogOut size={18} />
          <span className="text-xs font-bold">Back to Store</span>
        </Link>
      </div>
    </aside>
  );
}
