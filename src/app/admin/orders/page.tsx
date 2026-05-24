"use client";

import React, { useState, useEffect } from "react";
import { 
  ShoppingBag, 
  Search, 
  Filter, 
  Eye, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Truck, 
  Loader2,
  ExternalLink,
  Printer,
  Download,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import jsPDF from "jspdf";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const handlePrint = () => {
    toast.success("Opening print dialog...");
    setTimeout(() => {
      window.print();
    }, 150);
  };

  const handleDownloadPDF = async () => {
    if (!selectedOrder) return;
    setIsGeneratingPDF(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 600));

      const doc = new jsPDF();
      
      // Header Address / Details
      doc.setFont("helvetica", "bold");
      doc.setFontSize(22);
      doc.setTextColor(69, 26, 3); // Brown-900: #451a03
      doc.text("AYZAH PICKLES", 20, 25);
      
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(120, 120, 120);
      doc.text("100% Homemade Traditional Kerala Pickles", 20, 31);
      doc.text("Email: support@ayzahpickles.com | Tel: +91 98765 43210", 20, 36);

      // Line Separator
      doc.setDrawColor(234, 88, 12); // Mango Orange: #ea580c
      doc.setLineWidth(1);
      doc.line(20, 42, 190, 42);

      // Invoice metadata
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.setTextColor(41, 15, 2);
      doc.text("RETAIL INVOICE", 20, 52);
      
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.text(`Invoice: INV-${selectedOrder._id.slice(-6).toUpperCase()}`, 20, 60);
      doc.text(`Date: ${new Date(selectedOrder.createdAt).toLocaleDateString("en-IN")}`, 20, 66);
      doc.text(`Payment: ${selectedOrder.paymentMethod.toUpperCase()}`, 20, 72);
      doc.text(`Status: ${selectedOrder.status.toUpperCase()}`, 20, 78);

      // Billed Address
      doc.setFont("helvetica", "bold");
      doc.text("Billed To:", 120, 52);
      doc.setFont("helvetica", "normal");
      doc.text(`${selectedOrder.customerInfo.firstName} ${selectedOrder.customerInfo.lastName}`, 120, 60);
      doc.text(`Phone: ${selectedOrder.customerInfo.phone}`, 120, 66);
      doc.text(`${selectedOrder.customerInfo.address}`, 120, 72);
      doc.text(`${selectedOrder.customerInfo.city} - ${selectedOrder.customerInfo.pincode}`, 120, 78);

      // Line Separator
      doc.setDrawColor(240, 240, 240);
      doc.line(20, 85, 190, 85);

      // Table Headers
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(41, 15, 2);
      doc.text("Product Details", 20, 94);
      doc.text("Qty", 120, 94);
      doc.text("Unit Price", 145, 94);
      doc.text("Total", 170, 94);

      // Table Border Line
      doc.setDrawColor(200, 200, 200);
      doc.line(20, 97, 190, 97);

      // Table rows mapping
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(60, 60, 60);
      let y = 105;
      selectedOrder.items.forEach((item: any) => {
        doc.text(item.title, 20, y);
        doc.text(item.quantity.toString(), 120, y);
        doc.text(`Rs. ${item.price}`, 145, y);
        doc.text(`Rs. ${item.price * item.quantity}`, 170, y);
        y += 10;
      });

      // Break border
      doc.setDrawColor(220, 220, 220);
      doc.line(20, y - 5, 190, y - 5);

      // Breakdown summaries
      y += 5;
      doc.text("Subtotal:", 120, y);
      doc.text(`Rs. ${selectedOrder.subtotal}`, 170, y);

      y += 8;
      doc.text("Delivery Charge:", 120, y);
      doc.text("FREE", 170, y);

      y += 8;
      const gstAmount = Math.round(selectedOrder.totalAmount * 0.05);
      doc.text("GST Included (5%):", 120, y);
      doc.text(`Rs. ${gstAmount}`, 170, y);

      y += 10;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.setTextColor(234, 88, 12); // Orange brand color
      doc.text("Total Amount:", 120, y);
      doc.text(`Rs. ${selectedOrder.totalAmount}`, 170, y);

      // Footer message
      y += 25;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text("This is a system generated retail invoice.", 20, y);
      doc.text("Thank you for shopping with Ayzah Pickles! Enjoy the authentic taste of Kerala.", 20, y + 5);

      doc.save(`invoice-${selectedOrder._id.toUpperCase()}.pdf`);
      toast.success("PDF Invoice downloaded successfully!");
    } catch (error) {
      console.error("Failed to generate PDF:", error);
      toast.error("Failed to generate PDF Invoice");
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/orders");
      const data = await res.json();
      setOrders(data);
    } catch (error) {
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateOrderStatus = async (id: string, status: string) => {
    setUpdatingId(id);
    try {
      const res = await fetch(`/api/orders/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        toast.success(`Order status updated to ${status}`);
        fetchOrders();
        if (selectedOrder?._id === id) {
          setSelectedOrder({ ...selectedOrder, status });
        }
      } else {
        toast.error("Failed to update status");
      }
    } catch (error) {
      toast.error("Error updating status");
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ordered": return "bg-amber-100 text-amber-700";
      case "processing": return "bg-orange-100 text-orange-700";
      case "shipped": return "bg-blue-100 text-blue-700";
      case "delivered": return "bg-green-100 text-green-700";
      case "cancelled": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerInfo.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerInfo.phone.includes(searchTerm);
    
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-brown-900">Order Management</h1>
          <p className="text-brown-500 font-medium mt-1">Track, process, and manage customer orders.</p>
        </div>
        <div className="flex gap-4">
          <div className="bg-white px-6 py-4 rounded-2xl border border-pickle-100 shadow-sm flex flex-col items-center">
            <span className="text-xs font-bold text-brown-400 uppercase tracking-widest">Total Orders</span>
            <span className="text-2xl font-black text-brown-900">{orders.length}</span>
          </div>
          <div className="bg-white px-6 py-4 rounded-2xl border border-pickle-100 shadow-sm flex flex-col items-center">
            <span className="text-xs font-bold text-brown-400 uppercase tracking-widest">Ordered</span>
            <span className="text-2xl font-black text-amber-600">{orders.filter(o => o.status === "ordered").length}</span>
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-6 rounded-3xl border border-pickle-100 shadow-sm flex flex-col md:flex-row gap-6 justify-between items-center">
        <div className="relative w-full md:w-96">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-brown-400" />
          <input 
            type="text" 
            placeholder="Search by Order ID, Name, Phone..." 
            className="w-full bg-pickle-50 border border-pickle-100 pl-11 pr-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pickle-500/20"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex gap-4 w-full md:w-auto">
          <div className="relative w-full md:w-48">
            <Filter size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-brown-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-pickle-50 border border-pickle-100 pl-10 pr-4 py-3 rounded-xl text-xs font-bold text-brown-700 outline-none appearance-none cursor-pointer focus:ring-2 focus:ring-pickle-500/20"
            >
              <option value="all">All Statuses</option>
              <option value="ordered">Ordered</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-[2.5rem] border border-pickle-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-pickle-50/50 border-b border-pickle-100">
              <tr>
                <th className="px-8 py-6 text-xs font-black text-brown-500 uppercase tracking-widest">Order Info</th>
                <th className="px-8 py-6 text-xs font-black text-brown-500 uppercase tracking-widest">Customer</th>
                <th className="px-8 py-6 text-xs font-black text-brown-500 uppercase tracking-widest">Total</th>
                <th className="px-8 py-6 text-xs font-black text-brown-500 uppercase tracking-widest">Method</th>
                <th className="px-8 py-6 text-xs font-black text-brown-500 uppercase tracking-widest">Status</th>
                <th className="px-8 py-6 text-xs font-black text-brown-500 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-pickle-50">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-8 py-20 text-center">
                    <Loader2 className="animate-spin text-pickle-600 mx-auto" size={40} />
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-8 py-20 text-center text-brown-500 font-bold">No orders found matching your search.</td>
                </tr>
              ) : filteredOrders.map((order) => (
                <tr key={order._id} className="hover:bg-pickle-50/30 transition-colors group">
                  <td className="px-8 py-6">
                    <div>
                      <p className="text-sm font-black text-brown-900">#{order._id.slice(-8).toUpperCase()}</p>
                      <p className="text-[10px] text-brown-400 font-bold uppercase mt-1">{new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div>
                      <p className="text-sm font-bold text-brown-900">{order.customerInfo.firstName} {order.customerInfo.lastName}</p>
                      <p className="text-xs text-brown-400 font-medium">{order.customerInfo.phone}</p>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <p className="text-base font-black text-pickle-600">₹{order.totalAmount}</p>
                    <p className="text-[10px] text-brown-400 font-bold uppercase">{order.items.length} items</p>
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-xs font-bold text-brown-600 uppercase tracking-wider bg-pickle-50 px-3 py-1 rounded-lg border border-pickle-100">
                      {order.paymentMethod}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => setSelectedOrder(order)}
                        className="p-2.5 bg-pickle-50 text-pickle-600 rounded-xl hover:bg-pickle-600 hover:text-white transition-all shadow-sm"
                      >
                        <Eye size={18} />
                      </button>
                      <div className="relative group/menu">
                        <button className="p-2.5 bg-brown-50 text-brown-600 rounded-xl hover:bg-brown-900 hover:text-white transition-all shadow-sm">
                          <CheckCircle2 size={18} />
                        </button>
                        <div className="absolute right-0 bottom-full mb-2 w-52 bg-white rounded-2xl shadow-2xl border border-pickle-100 opacity-0 invisible group-hover/menu:opacity-100 group-hover/menu:visible transition-all z-20 overflow-hidden">
                          {[
                            { value: "ordered", label: "Mark as Ordered" },
                            { value: "processing", label: "Mark as Processing" },
                            { value: "shipped", label: "Mark as Shipped" },
                            { value: "delivered", label: "Mark as Delivered" },
                            { value: "cancelled", label: "Cancel Order" },
                          ].map((action) => (
                            <button 
                              key={action.value}
                              onClick={() => updateOrderStatus(order._id, action.value)}
                              className="w-full text-left px-5 py-3.5 text-xs font-bold text-brown-600 hover:bg-pickle-50 hover:text-pickle-600 transition-colors border-b border-pickle-50 last:border-0"
                            >
                              {action.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Mock */}
        <div className="p-8 border-t border-pickle-100 flex flex-col sm:flex-row justify-between items-center gap-6 bg-pickle-50/30">
          <p className="text-sm font-medium text-brown-500">
            Showing <span className="font-bold text-brown-900">1 to {filteredOrders.length}</span> of <span className="font-bold text-brown-900">{filteredOrders.length}</span> results
          </p>
          <div className="flex gap-3">
            <button className="p-3 bg-white border border-pickle-200 text-brown-500 rounded-xl hover:bg-pickle-50 transition-colors disabled:opacity-50">
              <ChevronLeft size={18} />
            </button>
            <button className="w-12 h-12 rounded-xl text-sm font-bold bg-pickle-600 text-white shadow-lg shadow-pickle-600/20 transition-all">1</button>
            <button className="p-3 bg-white border border-pickle-200 text-brown-500 rounded-xl hover:bg-pickle-50 transition-colors">
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Order Detail Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-brown-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 overflow-y-auto"
            onClick={() => setSelectedOrder(null)}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-[3rem] w-full max-w-4xl shadow-2xl overflow-hidden relative my-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                onClick={() => setSelectedOrder(null)}
                className="absolute top-6 right-6 w-12 h-12 bg-pickle-50 text-brown-500 rounded-full flex items-center justify-center hover:bg-red-500 hover:text-white transition-all shadow-sm z-10"
              >
                <XCircle size={24} />
              </button>

              <div className="flex flex-col md:flex-row h-full max-h-[90vh]">
                {/* Items Side */}
                <div className="w-full md:w-1/2 p-8 md:p-12 border-r border-pickle-50 overflow-y-auto">
                  <div className="flex items-center gap-3 mb-8">
                    <ShoppingBag className="text-pickle-600" size={32} />
                    <h2 className="text-2xl font-black text-brown-900 tracking-tight">Order Details</h2>
                  </div>

                  <div className="space-y-6">
                    {selectedOrder.items.map((item: any, i: number) => (
                      <div key={i} className="flex gap-4 group">
                        <div className="w-20 h-20 rounded-2xl overflow-hidden bg-pickle-50 border border-pickle-100 shrink-0 shadow-sm">
                          <img src={item.image} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        </div>
                        <div className="flex-1 flex flex-col justify-center">
                          <p className="font-bold text-brown-900 text-lg leading-tight mb-1">{item.title}</p>
                          <div className="flex justify-between items-center">
                            <span className="text-xs font-black text-brown-400 bg-pickle-50 px-2.5 py-1 rounded-lg uppercase tracking-widest">Qty: {item.quantity}</span>
                            <span className="font-black text-pickle-600 text-lg">₹{item.price * item.quantity}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-10 pt-10 border-t-2 border-dashed border-pickle-100 space-y-4">
                    <div className="flex justify-between text-brown-500 font-bold">
                      <span>Subtotal</span>
                      <span className="text-brown-900">₹{selectedOrder.subtotal}</span>
                    </div>
                    <div className="flex justify-between text-brown-500 font-bold">
                      <span>Delivery Charge</span>
                      <span className="text-green-600 uppercase text-xs tracking-widest">Free</span>
                    </div>
                    <div className="flex justify-between text-3xl font-black text-brown-900 pt-4 border-t-2 border-pickle-100">
                      <span>Total</span>
                      <span className="text-pickle-600">₹{selectedOrder.totalAmount}</span>
                    </div>
                  </div>
                </div>

                {/* Customer Side */}
                <div className="w-full md:w-1/2 p-8 md:p-12 bg-pickle-50/30 overflow-y-auto">
                  <div className="space-y-10">
                    <section>
                      <h4 className="text-xs font-black text-brown-400 uppercase tracking-[0.2em] mb-4">Customer Info</h4>
                      <div className="bg-white p-6 rounded-3xl border border-pickle-100 shadow-sm space-y-2">
                        <p className="text-xl font-black text-brown-900 tracking-tight">{selectedOrder.customerInfo.firstName} {selectedOrder.customerInfo.lastName}</p>
                        <p className="text-sm font-bold text-pickle-600">{selectedOrder.customerInfo.email}</p>
                        <p className="text-sm font-bold text-brown-500">{selectedOrder.customerInfo.phone}</p>
                      </div>
                    </section>

                    <section>
                      <h4 className="text-xs font-black text-brown-400 uppercase tracking-[0.2em] mb-4">Shipping Address</h4>
                      <div className="bg-white p-6 rounded-3xl border border-pickle-100 shadow-sm">
                        <p className="text-sm font-bold text-brown-600 leading-relaxed">
                          {selectedOrder.customerInfo.address}<br />
                          {selectedOrder.customerInfo.city}, {selectedOrder.customerInfo.pincode}
                        </p>
                      </div>
                    </section>

                    <section>
                      <h4 className="text-xs font-black text-brown-400 uppercase tracking-[0.2em] mb-4">Order Status</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className={`p-4 rounded-2xl flex flex-col items-center justify-center text-center gap-1 border-2 ${getStatusColor(selectedOrder.status)} border-current opacity-20`}>
                          <span className="text-[10px] font-black uppercase tracking-widest">Payment</span>
                          <span className="text-sm font-bold">{selectedOrder.paymentMethod.toUpperCase()}</span>
                        </div>
                        <div className={`p-4 rounded-2xl flex flex-col items-center justify-center text-center gap-1 border-2 ${getStatusColor(selectedOrder.status)}`}>
                          <span className="text-[10px] font-black uppercase tracking-widest">Status</span>
                          <span className="text-sm font-bold">{selectedOrder.status.toUpperCase()}</span>
                        </div>
                      </div>
                    </section>

                    <section>
                      <h4 className="text-xs font-black text-brown-400 uppercase tracking-[0.2em] mb-3">Update Progress</h4>
                      <div className="grid grid-cols-2 gap-2.5">
                        <button
                          onClick={() => updateOrderStatus(selectedOrder._id, "processing")}
                          disabled={updatingId !== null}
                          className="px-4 py-2.5 bg-orange-50 hover:bg-orange-600 hover:text-white text-orange-600 text-xs font-bold rounded-xl transition-all border border-orange-100 disabled:opacity-50 cursor-pointer"
                        >
                          Mark Processing
                        </button>
                        <button
                          onClick={() => updateOrderStatus(selectedOrder._id, "shipped")}
                          disabled={updatingId !== null}
                          className="px-4 py-2.5 bg-blue-50 hover:bg-blue-600 hover:text-white text-blue-600 text-xs font-bold rounded-xl transition-all border border-blue-100 disabled:opacity-50 cursor-pointer"
                        >
                          Mark Shipped
                        </button>
                        <button
                          onClick={() => updateOrderStatus(selectedOrder._id, "delivered")}
                          disabled={updatingId !== null}
                          className="px-4 py-2.5 bg-green-50 hover:bg-green-600 hover:text-white text-green-600 text-xs font-bold rounded-xl transition-all border border-green-100 disabled:opacity-50 cursor-pointer"
                        >
                          Mark Delivered
                        </button>
                        <button
                          onClick={() => updateOrderStatus(selectedOrder._id, "cancelled")}
                          disabled={updatingId !== null}
                          className="px-4 py-2.5 bg-red-50 hover:bg-red-600 hover:text-white text-red-600 text-xs font-bold rounded-xl transition-all border border-red-100 disabled:opacity-50 cursor-pointer"
                        >
                          Cancel Order
                        </button>
                      </div>
                    </section>

                    <button 
                      onClick={() => window.open(`/track-order?id=${selectedOrder._id}`, '_blank')}
                      className="w-full bg-brown-900 text-white py-4 rounded-xl font-bold text-sm hover:bg-brown-800 transition-all shadow-xl shadow-brown-900/10 flex items-center justify-center gap-3 cursor-pointer"
                    >
                      View Tracking Page <ExternalLink size={16} />
                    </button>

                    <div className="grid grid-cols-2 gap-3 mt-4">
                      <button 
                        onClick={handlePrint}
                        className="bg-white border border-pickle-200 text-brown-950 py-3.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 hover:bg-pickle-50 transition-all cursor-pointer shadow-sm active:scale-95"
                      >
                        <Printer size={15} className="text-pickle-600" /> Print Invoice
                      </button>
                      
                      <button 
                        onClick={handleDownloadPDF}
                        disabled={isGeneratingPDF}
                        className="bg-pickle-600 text-white py-3.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 hover:bg-pickle-700 transition-all cursor-pointer shadow-lg shadow-pickle-600/10 active:scale-95 disabled:opacity-75 animate-shimmer"
                      >
                        {isGeneratingPDF ? (
                          <>
                            <Loader2 size={15} className="animate-spin" /> Generating...
                          </>
                        ) : (
                          <>
                            <Download size={15} /> Download PDF
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Branded Hidden Printable Invoice Layout for Browser Printing */}
      {selectedOrder && (
        <div className="hidden-print-invoice print-invoice-area text-brown-950 font-poppins">
          {/* Branded Header */}
          <div className="flex justify-between items-start mb-8 pb-6 border-b-2 border-pickle-100">
            <div>
              <h1 className="text-2xl font-black text-brown-900 tracking-tight">AYZAH PICKLES</h1>
              <p className="text-xs text-brown-500 font-semibold mt-1">100% Homemade Traditional Kerala Pickles</p>
              <p className="text-[10px] text-brown-400 mt-0.5">Email: support@ayzahpickles.com | Tel: +91 98765 43210</p>
            </div>
            <div className="text-right">
              <h2 className="text-lg font-black text-brown-800 uppercase tracking-wider">RETAIL INVOICE</h2>
              <p className="text-xs text-brown-500 font-bold mt-1">Invoice: INV-{selectedOrder._id.slice(-6).toUpperCase()}</p>
              <p className="text-[10px] text-brown-400 mt-0.5">Order ID: #{selectedOrder._id.toUpperCase()}</p>
            </div>
          </div>

          {/* Details Row */}
          <div className="grid grid-cols-2 gap-8 mb-8">
            <div className="space-y-1">
              <h3 className="text-xs font-black text-brown-400 uppercase tracking-widest mb-2">Billed To</h3>
              <p className="text-sm font-black text-brown-900">{selectedOrder.customerInfo.firstName} {selectedOrder.customerInfo.lastName}</p>
              <p className="text-xs font-bold text-pickle-600">{selectedOrder.customerInfo.email}</p>
              <p className="text-xs font-bold text-brown-500">Phone: {selectedOrder.customerInfo.phone}</p>
            </div>
            <div className="space-y-1 text-right">
              <h3 className="text-xs font-black text-brown-400 uppercase tracking-widest mb-2">Shipping Destination</h3>
              <p className="text-xs font-bold text-brown-600 leading-relaxed">
                {selectedOrder.customerInfo.address}<br />
                {selectedOrder.customerInfo.city}, {selectedOrder.customerInfo.pincode}
              </p>
              <p className="text-[10px] text-brown-400 mt-2 font-bold uppercase">Date: {new Date(selectedOrder.createdAt).toLocaleString("en-IN")}</p>
            </div>
          </div>

          {/* Items Table */}
          <div className="border border-pickle-100 rounded-2xl overflow-hidden mb-8">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-pickle-50/50 border-b border-pickle-100">
                  <th className="px-6 py-4 text-xs font-black text-brown-500 uppercase tracking-widest">Product Details</th>
                  <th className="px-6 py-4 text-xs font-black text-brown-500 uppercase tracking-widest text-center">Qty</th>
                  <th className="px-6 py-4 text-xs font-black text-brown-500 uppercase tracking-widest text-right">Unit Price</th>
                  <th className="px-6 py-4 text-xs font-black text-brown-500 uppercase tracking-widest text-right">Total Price</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-pickle-50">
                {selectedOrder.items.map((item: any, i: number) => (
                  <tr key={i} className="text-xs text-brown-800">
                    <td className="px-6 py-4 font-bold">{item.title}</td>
                    <td className="px-6 py-4 text-center font-bold">{item.quantity}</td>
                    <td className="px-6 py-4 text-right font-semibold">₹{item.price}</td>
                    <td className="px-6 py-4 text-right font-black text-pickle-600">₹{item.price * item.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Invoice Summary */}
          <div className="flex justify-between items-start border-t-2 border-dashed border-pickle-100 pt-6">
            <div className="space-y-1">
              <p className="text-xs font-bold text-brown-500">Payment Status: <span className="font-black text-green-600 bg-green-50 border border-green-200 px-2 py-0.5 rounded-md uppercase tracking-wider">{selectedOrder.paymentStatus || "PAID"}</span></p>
              <p className="text-xs font-bold text-brown-500">Method: <span className="font-extrabold text-brown-800 uppercase">{selectedOrder.paymentMethod.toUpperCase()}</span></p>
              <p className="text-xs font-bold text-brown-500">Order Status: <span className="font-extrabold text-pickle-600 uppercase">{selectedOrder.status.toUpperCase()}</span></p>
            </div>
            
            <div className="w-64 space-y-3 font-bold text-right text-xs">
              <div className="flex justify-between text-brown-500">
                <span>Subtotal</span>
                <span className="text-brown-900 font-extrabold">₹{selectedOrder.subtotal}</span>
              </div>
              <div className="flex justify-between text-brown-500">
                <span>Delivery Charge</span>
                <span className="text-green-600 font-extrabold uppercase text-[10px]">Free</span>
              </div>
              <div className="flex justify-between text-brown-500">
                <span>GST Included (5%)</span>
                <span className="text-brown-900 font-extrabold">₹{Math.round(selectedOrder.totalAmount * 0.05)}</span>
              </div>
              <div className="flex justify-between text-base font-black border-t-2 border-pickle-100 pt-3 text-right">
                <span className="text-brown-900 uppercase tracking-tight">Total Amount</span>
                <span className="text-pickle-600">₹{selectedOrder.totalAmount}</span>
              </div>
            </div>
          </div>

          {/* Branded Footer */}
          <div className="mt-16 text-center border-t border-pickle-100 pt-6">
            <p className="text-[10px] text-brown-400 font-semibold uppercase tracking-wider">Ayzah Pickles • 100% Kerala Heritage taste</p>
            <p className="text-[9px] text-brown-300 mt-1">Thank you for your business! Enjoy our mouthwatering traditional pickles.</p>
          </div>
        </div>
      )}

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #fdfaf5; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #dccfb8; border-radius: 10px; }
        
        /* Premium Branded Invoicing Print Style Settings */
        @media print {
          /* Hide EVERYTHING in the DOM */
          body * {
            visibility: hidden !important;
            background: none !important;
            box-shadow: none !important;
          }
          /* Except our special print container */
          .print-invoice-area, .print-invoice-area * {
            visibility: visible !important;
          }
          /* Position printable area perfectly at standard padding limits */
          .print-invoice-area {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            background: white !important;
            color: #290f02 !important; /* Dark text for printing */
            padding: 0.5in !important;
            margin: 0 !important;
            box-shadow: none !important;
            border: none !important;
          }
        }
        
        .hidden-print-invoice {
          display: none;
        }
        
        @media print {
          .hidden-print-invoice {
            display: block !important;
          }
        }
      `}</style>
    </div>
  );
}
