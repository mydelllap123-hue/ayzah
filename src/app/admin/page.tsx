"use client";

import React, { useState, useEffect } from "react";
import { 
  ShoppingBag, 
  Users, 
  Package, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  Loader2,
  TrendingDown,
  Activity,
  Truck,
  XCircle,
  FileText,
  DollarSign
} from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import Link from "next/link";
import toast from "react-hot-toast";

interface Stats {
  totalOrders: number;
  orderedOrders: number;
  processingOrders: number;
  shippedOrders: number;
  deliveredOrders: number;
  cancelledOrders: number;
  totalProducts: number;
  totalUsers: number;
  totalCustomers: number;
  lowStockCount: number;
  revenue: number;
}

interface DashboardData {
  stats: Stats;
  lowStockProducts: any[];
  salesData: any[];
  recentOrders: any[];
}

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      const res = await fetch("/api/admin/dashboard");
      if (!res.ok) throw new Error("Failed to fetch dashboard data");
      const result = await res.json();
      setData(result);
    } catch (error) {
      console.error("Dashboard Error:", error);
      toast.error("Failed to load dashboard statistics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="animate-spin text-pickle-600" size={40} />
        <p className="text-brown-600 font-bold animate-pulse text-sm">Analyzing Store Data...</p>
      </div>
    );
  }

  if (!data) return null;

  const { stats, salesData, lowStockProducts, recentOrders } = data;

  return (
    <div className="space-y-6 font-poppins">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-brown-900 uppercase tracking-tight">Dashboard Overview</h1>
          <p className="text-brown-500 font-medium text-xs mt-0.5">Welcome back! Here's your store's performance at a glance.</p>
        </div>
        <div>
          <button 
            onClick={() => {
              setLoading(true);
              fetchDashboardData();
            }}
            className="bg-white border border-pickle-200 text-brown-900 px-4 py-2 rounded-xl font-bold text-xs hover:bg-pickle-50 hover:border-pickle-300 transition-colors shadow-sm cursor-pointer"
          >
            Refresh Data
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard 
          title="Total Revenue" 
          value={`₹${stats.revenue.toLocaleString()}`} 
          icon={DollarSign} 
          trend="+12.5% vs last month" 
          isUp={true}
          color="bg-green-50 text-green-600" 
        />
        <StatsCard 
          title="Total Orders" 
          value={stats.totalOrders} 
          icon={ShoppingBag} 
          trend="+8.2% vs last week" 
          isUp={true}
          color="bg-blue-50 text-blue-600" 
        />
        <StatsCard 
          title="Total Customers" 
          value={stats.totalCustomers} 
          icon={Users} 
          trend="+5.4% vs last week" 
          isUp={true}
          color="bg-purple-50 text-purple-600" 
        />
        <StatsCard 
          title="Low Stock Alerts" 
          value={stats.lowStockCount} 
          icon={AlertTriangle} 
          trend={stats.lowStockCount > 0 ? "Immediate attention required" : "Inventory fully stocked"} 
          isUp={stats.lowStockCount === 0}
          color={stats.lowStockCount > 0 ? "bg-red-50 text-red-600" : "bg-pickle-50 text-pickle-600"} 
        />
      </div>

      {/* Charts & Status Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Chart */}
        <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-pickle-100 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-center mb-5">
            <div>
              <h2 className="text-base font-extrabold text-brown-900">Revenue Stream</h2>
              <p className="text-xs text-brown-500 font-medium">Authentic monthly store sales</p>
            </div>
            <span className="text-[10px] bg-pickle-100 text-pickle-700 px-3 py-1 rounded-full font-bold uppercase tracking-wider">
              Last 6 Months
            </span>
          </div>
          
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesData}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ea580c" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#ea580c" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748b', fontSize: 10, fontFamily: 'Poppins', fontWeight: 600 }} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748b', fontSize: 10, fontFamily: 'Poppins', fontWeight: 600 }} 
                  dx={-10}
                  tickFormatter={(value) => `₹${value.toLocaleString()}`}
                />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '12px', 
                    border: '1px solid #ffecd9', 
                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.05)',
                    padding: '8px',
                    fontSize: '11px',
                    fontFamily: 'Poppins'
                  }} 
                  formatter={(value: any) => [`₹${value.toLocaleString()}`, 'Revenue']}
                />
                <Area 
                  type="monotone" 
                  dataKey="sales" 
                  stroke="#ea580c" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorSales)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Order Status Cards */}
          <div className="bg-white p-5 rounded-2xl border border-pickle-100 shadow-sm space-y-4">
            <h2 className="text-base font-extrabold text-brown-900">Order Status Breakdown</h2>
            <div className="grid grid-cols-1 gap-3">
              <StatusRow icon={Clock} title="Ordered" count={stats.orderedOrders} color="bg-amber-50 text-amber-600" />
              <StatusRow icon={Activity} title="Processing" count={stats.processingOrders} color="bg-blue-50 text-blue-600" />
              <StatusRow icon={Truck} title="Shipped" count={stats.shippedOrders} color="bg-purple-50 text-purple-600" />
              <StatusRow icon={CheckCircle2} title="Delivered" count={stats.deliveredOrders} color="bg-green-50 text-green-600" />
              <StatusRow icon={XCircle} title="Cancelled" count={stats.cancelledOrders} color="bg-red-50 text-red-600" />
            </div>
          </div>

          {/* Stock Alerts */}
          <div className="bg-white p-5 rounded-2xl border border-pickle-100 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-base font-extrabold text-brown-900">Stock Alerts</h2>
              <div className="p-1.5 bg-red-50 text-red-600 rounded-lg">
                <AlertTriangle size={16} />
              </div>
            </div>
            <div className="space-y-3">
              {lowStockProducts.length === 0 ? (
                <p className="text-xs text-center text-brown-400 py-3 font-medium">All products are well stocked! 🎉</p>
              ) : lowStockProducts.slice(0, 3).map((product) => (
                <div key={product._id} className="flex items-center justify-between p-2.5 bg-pickle-50/50 rounded-xl border border-pickle-100/50">
                  <div className="flex items-center gap-2">
                    <img src={product.images?.[0] || "/images/placeholder.png"} alt="" className="w-8 h-8 rounded-lg object-cover border border-pickle-100" />
                    <div>
                      <p className="text-xs font-bold text-brown-900 line-clamp-1">{product.name || product.title}</p>
                      <p className="text-[8px] font-bold text-brown-400 uppercase tracking-widest leading-none mt-0.5">{product.category === "veg" ? "Veg Pickles" : "Non-Veg Pickles"}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-xs font-black ${product.stock === 0 ? 'text-red-600' : 'text-amber-600'}`}>
                      {product.stock === 0 ? "OUT OF STOCK" : `${product.stock} left`}
                    </p>
                  </div>
                </div>
              ))}
              <Link href="/admin/products" className="w-full py-2.5 bg-brown-900 text-white rounded-xl font-bold text-[10px] flex items-center justify-center gap-1.5 hover:bg-brown-800 transition-all mt-3 shadow-md shadow-brown-900/10 uppercase tracking-wider">
                View Full Inventory <ChevronRight size={12} />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders Section */}
      <div className="bg-white p-5 rounded-2xl border border-pickle-100 shadow-sm space-y-4">
        <div className="flex justify-between items-center pb-2 border-b border-pickle-100">
          <div>
            <h2 className="text-base font-extrabold text-brown-900">Recent Placement Orders</h2>
            <p className="text-xs text-brown-500 font-medium">Monitor latest transactions and shipping timeline</p>
          </div>
          <Link href="/admin/orders" className="text-pickle-600 hover:text-pickle-700 text-xs font-bold flex items-center gap-1">
            Manage All Orders <ChevronRight size={14} />
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className="text-center py-8 text-brown-400 font-semibold text-sm">
            No orders placed yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-[10px] font-black uppercase tracking-wider text-brown-400 border-b border-pickle-50">
                  <th className="pb-3 font-black">Order ID</th>
                  <th className="pb-3 font-black">Customer</th>
                  <th className="pb-3 font-black">Method</th>
                  <th className="pb-3 font-black">Total</th>
                  <th className="pb-3 font-black">Status</th>
                  <th className="pb-3 font-black">Date</th>
                  <th className="pb-3 text-center font-black">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-pickle-50">
                {recentOrders.map(order => (
                  <tr key={order._id} className="hover:bg-pickle-50/30 transition-colors">
                    <td className="py-3.5 font-bold text-brown-900">#{order._id.slice(-8).toUpperCase()}</td>
                    <td className="py-3.5 font-semibold text-brown-800">
                      {order.customerInfo?.firstName} {order.customerInfo?.lastName}
                      <span className="block text-[10px] text-brown-400 font-medium">{order.customerInfo?.phone}</span>
                    </td>
                    <td className="py-3.5 font-bold uppercase text-[10px] text-brown-500">{order.paymentMethod}</td>
                    <td className="py-3.5 font-extrabold text-pickle-600">₹{order.totalAmount}</td>
                    <td className="py-3.5">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                        order.status === "delivered" ? "bg-green-50 text-green-700 border border-green-100" :
                        order.status === "cancelled" ? "bg-red-50 text-red-700 border border-red-100" :
                        order.status === "shipped" ? "bg-purple-50 text-purple-700 border border-purple-100" :
                        order.status === "processing" ? "bg-blue-50 text-blue-700 border border-blue-100" :
                        "bg-amber-50 text-amber-700 border border-amber-100"
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3.5 font-semibold text-brown-400">{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td className="py-3.5 text-center">
                      <Link href={`/admin/orders?open=${order._id}`} className="inline-flex items-center gap-1 text-[10px] bg-pickle-50 hover:bg-pickle-100 text-pickle-700 px-2.5 py-1.5 rounded-lg border border-pickle-100 transition-colors font-bold uppercase tracking-wider">
                        <FileText size={12} /> View Invoice
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function StatsCard({ title, value, icon: Icon, trend, isUp, color }: any) {
  return (
    <div className="bg-white p-4 rounded-2xl border border-pickle-100 shadow-sm hover:shadow-md transition-shadow group">
      <div className="flex justify-between items-start mb-3">
        <div className={`p-2.5 rounded-xl transition-transform group-hover:scale-110 ${color}`}>
          <Icon size={20} />
        </div>
        <div className={`flex items-center gap-0.5 text-[9px] font-extrabold ${isUp ? 'text-green-600' : 'text-red-500'}`}>
          {isUp ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />} {trend}
        </div>
      </div>
      <h3 className="text-[10px] font-bold text-brown-500 uppercase tracking-widest">{title}</h3>
      <p className="text-2xl font-black text-brown-900 mt-0.5">{value}</p>
    </div>
  );
}

function StatusRow({ icon: Icon, title, count, color }: any) {
  return (
    <div className="flex items-center justify-between p-2.5 bg-pickle-50/30 rounded-xl border border-pickle-50 hover:bg-pickle-50/60 transition-colors">
      <div className="flex items-center gap-3">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${color}`}>
          <Icon size={16} />
        </div>
        <div>
          <p className="text-xs font-bold text-brown-900 leading-none">{title}</p>
          <p className="text-[8px] font-bold text-brown-400 uppercase tracking-widest leading-none mt-1">Status segment</p>
        </div>
      </div>
      <span className="text-base font-black text-brown-900">{count}</span>
    </div>
  );
}
