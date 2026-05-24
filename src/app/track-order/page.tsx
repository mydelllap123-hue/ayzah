"use client";

import React, { useState, useEffect, Suspense } from "react";
import { Truck, Package, Calendar, MapPin, CheckCircle2, Clock, Loader2, XCircle } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import Link from "next/link";

function TrackOrderContent() {
  const searchParams = useSearchParams();
  const orderIdFromUrl = searchParams.get("id");
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const fetchOrder = async (id: string) => {
    if (!id) return;
    setLoading(true);
    try {
      // First try searching all orders if it's a guest search, 
      // but the API GET /api/orders returns all, we should filter or add a specific GET route.
      // For now we'll fetch all and filter client side for demo, 
      // but in production we'd use GET /api/orders/[id]
      const res = await fetch(`/api/orders`);
      const orders = await res.json();
      const foundOrder = orders.find((o: any) => o._id === id || o.orderId === id);
      
      if (foundOrder) {
        setOrder(foundOrder);
      } else {
        toast.error("Order not found. Please check the ID.");
        setOrder(null);
      }
    } catch (error) {
      toast.error("Failed to fetch order details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (orderIdFromUrl) {
      fetchOrder(orderIdFromUrl);
    }
  }, [orderIdFromUrl]);

  const statusSteps = [
    { label: "Ordered", status: "ordered", icon: <Calendar size={20} /> },
    { label: "Processing", status: "processing", icon: <Clock size={20} /> },
    { label: "Shipped", status: "shipped", icon: <Truck size={20} /> },
    { label: "Delivered", status: "delivered", icon: <CheckCircle2 size={20} /> },
  ];

  const getStatusIndex = (status: string) => {
    if (status === "cancelled") return -1;
    const index = statusSteps.findIndex(s => s.status === status);
    return index === -1 ? 0 : index;
  };

  return (
    <div className="min-h-screen pt-24 pb-20 bg-pickle-50 font-poppins flex flex-col justify-start items-center">
      <div className="container mx-auto px-4 md:px-8 max-w-4xl w-full">
        {loading ? (
          <div className="bg-white rounded-[40px] border border-pickle-100 p-20 flex flex-col items-center justify-center text-center shadow-sm">
            <Loader2 className="animate-spin text-pickle-600 mb-4" size={36} />
            <p className="text-brown-600 font-bold text-sm">Fetching your live order tracking data...</p>
          </div>
        ) : !order ? (
          <div className="bg-white rounded-[40px] border border-pickle-100 p-16 text-center shadow-sm max-w-lg mx-auto">
            <Truck size={48} className="text-pickle-200 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-brown-900 mb-2">No Active Order Selected</h3>
            <p className="text-brown-500 text-xs font-semibold uppercase tracking-widest mb-6 leading-relaxed">Please navigate from your checkout page to track your order.</p>
            <Link href="/shop" className="bg-pickle-600 text-white font-bold px-6 py-3 rounded-xl shadow-lg hover:bg-pickle-700 transition-colors inline-block text-xs uppercase tracking-wider">
              Browse Store
            </Link>
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-[40px] shadow-sm border border-pickle-100 overflow-hidden w-full"
          >
            <div className="p-8 md:p-10 bg-pickle-600 text-white">
              <div className="flex flex-wrap justify-between items-center gap-6">
                <div>
                  <p className="text-pickle-100 text-sm font-bold uppercase tracking-widest mb-1">Order ID</p>
                  <h3 className="text-2xl font-black">#{order._id.slice(-8).toUpperCase()}</h3>
                </div>
                <div className="text-right">
                  <p className="text-pickle-100 text-sm font-bold uppercase tracking-widest mb-1">Estimated Delivery</p>
                  <h3 className="text-2xl font-black">3-5 Working Days</h3>
                </div>
              </div>
            </div>

            <div className="p-8 md:p-10">
              {order.status === "cancelled" ? (
                <div className="bg-red-50/50 border border-red-100 text-red-700 px-6 py-10 rounded-[2.5rem] text-center mb-10 flex flex-col items-center justify-center gap-3">
                  <div className="w-14 h-14 bg-red-100 text-red-500 rounded-full flex items-center justify-center">
                    <XCircle size={28} />
                  </div>
                  <h3 className="text-xl font-bold tracking-tight">Order Cancelled</h3>
                  <p className="text-sm font-medium text-red-600 max-w-md mx-auto leading-relaxed">
                    This order has been cancelled. If you believe this is an error or need assistance, please feel free to reach out to our customer support.
                  </p>
                </div>
              ) : (
                /* Status Timeline */
                <div className="relative flex justify-between mb-16">
                  <div className="absolute top-1/2 left-0 w-full h-1 bg-pickle-50 -translate-y-1/2 -z-0"></div>
                  <div 
                    className="absolute top-1/2 left-0 h-1 bg-pickle-600 -translate-y-1/2 transition-all duration-1000 ease-out"
                    style={{ width: `${(getStatusIndex(order.status) / (statusSteps.length - 1)) * 100}%` }}
                  ></div>
                  
                  {statusSteps.map((step, index) => {
                    const isActive = index <= getStatusIndex(order.status);
                    return (
                      <div key={step.label} className="relative z-10 flex flex-col items-center">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 ${isActive ? 'bg-pickle-600 text-white shadow-lg shadow-pickle-600/30' : 'bg-white border-2 border-pickle-100 text-brown-400'}`}>
                          {step.icon}
                        </div>
                        <p className={`mt-3 text-xs font-black uppercase tracking-tighter ${isActive ? 'text-pickle-600' : 'text-brown-400'}`}>{step.label}</p>
                      </div>
                    );
                  })}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 border-t border-pickle-50 pt-10">
                <div className="space-y-6">
                  <h4 className="text-lg font-bold text-brown-900 flex items-center gap-2">
                    <Package className="text-pickle-600" /> Order Items
                  </h4>
                  <div className="space-y-4">
                    {order.items.map((item: any, i: number) => (
                      <div key={i} className="flex items-center gap-4 bg-pickle-50/50 p-4 rounded-2xl border border-pickle-50">
                        <img src={item.image} alt="" className="w-12 h-12 rounded-xl object-cover" />
                        <div className="flex-1">
                          <p className="text-sm font-bold text-brown-900">{item.title}</p>
                          <p className="text-xs font-medium text-brown-500">Qty: {item.quantity}</p>
                        </div>
                        <p className="font-bold text-pickle-600">₹{item.price * item.quantity}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-6">
                  <h4 className="text-lg font-bold text-brown-900 flex items-center gap-2">
                    <MapPin className="text-pickle-600" /> Delivery Address
                  </h4>
                  <div className="bg-pickle-50/50 p-6 rounded-3xl border border-pickle-50 space-y-2">
                    <p className="font-bold text-brown-900">{order.customerInfo.firstName} {order.customerInfo.lastName}</p>
                    <p className="text-sm text-brown-600 font-medium leading-relaxed">
                      {order.customerInfo.address}<br />
                      {order.customerInfo.city}, {order.customerInfo.pincode}
                    </p>
                    <p className="text-sm font-bold text-pickle-600 pt-2">{order.customerInfo.phone}</p>
                  </div>
                  
                  <div className="flex justify-between items-center p-6 bg-brown-900 text-white rounded-3xl shadow-xl shadow-brown-900/10">
                    <div>
                      <p className="text-xs font-bold text-brown-300 uppercase tracking-widest">Total Amount Paid</p>
                      <p className="text-sm font-medium opacity-70">via {order.paymentMethod.toUpperCase()}</p>
                    </div>
                    <div className="text-2xl font-black text-pickle-400">₹{order.totalAmount}</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default function TrackOrderPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-pickle-50">
        <Loader2 className="animate-spin text-pickle-600" size={50} />
      </div>
    }>
      <TrackOrderContent />
    </Suspense>
  );
}

