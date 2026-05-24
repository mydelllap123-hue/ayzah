"use client";

import React, { useState } from "react";
import { useStore } from "@/context/StoreContext";
import { CreditCard, Truck, ShieldCheck, Banknote, Loader2, AlertCircle, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface FormErrors {
  [key: string]: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, cartTotal, clearCart } = useStore();
  const [paymentMethod, setPaymentMethod] = useState("online");
  const [selectedApp, setSelectedApp] = useState<string | null>("google_pay");
  const [isProcessing, setIsProcessing] = useState(false);

  const upiApps = [
    { id: "google_pay", name: "GPay", label: "Google Pay" },
    { id: "phonepe", name: "PhonePe", label: "PhonePe" },
    { id: "paytm", name: "Paytm", label: "Paytm" },
    { id: "bhim", name: "BHIM", label: "BHIM UPI" },
    { id: "amazonpay", name: "Amazon Pay", label: "Amazon Pay" }
  ];
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    pincode: ""
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const validateForm = () => {
    const newErrors: FormErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = "Must be exactly 10 digits";
    }
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.pincode.trim()) {
      newErrors.pincode = "PIN code is required";
    } else if (!/^\d{6}$/.test(formData.pincode)) {
      newErrors.pincode = "Must be 6 digits";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if ((window as any).Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    setIsProcessing(true);

    try {
      const orderItems = cart.map(item => ({
        productId: item._id || item.id,
        title: item.title || item.name,
        price: item.offerPrice || item.price,
        quantity: item.quantity || 1,
        image: (item.images && item.images[0]) || item.image
      }));

      const orderData = {
        customerInfo: formData,
        items: orderItems,
        subtotal: cartTotal,
        deliveryCharge: 0,
        totalAmount: cartTotal,
        paymentMethod
      };

      if (paymentMethod === "cod") {
        // Place COD order directly
        const response = await fetch("/api/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(orderData)
        });

        const data = await response.json();

        if (response.ok) {
          toast.success("Order Placed Successfully!");
          clearCart();
          router.push(`/track-order?id=${data.orderId}`);
        } else {
          throw new Error(data.error || "Failed to place order");
        }
      } else {
        // Razorpay Online Flow
        const isScriptLoaded = await loadRazorpayScript();
        if (!isScriptLoaded) {
          toast.error("Failed to load Razorpay Payment Gateway. Check your internet connection.");
          setIsProcessing(false);
          return;
        }

        // Initialize Razorpay Order ID on backend
        const orderRes = await fetch("/api/payment/create-order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ items: orderItems })
        });

        const orderResult = await orderRes.json();

        if (!orderRes.ok) {
          throw new Error(orderResult.error || "Failed to initialize payment gateway");
        }

        // Open Razorpay Popup Modal
        const options = {
          key: orderResult.keyId || "rzp_test_SssL08i84bcjUM",
          amount: orderResult.amount,
          currency: orderResult.currency,
          name: "Ayzah Pickles",
          description: "Premium Homemade Authentic Pickles",
          image: "/images/ayzah-logo.png",
          order_id: orderResult.id,
          config: {
            display: {
              blocks: {
                upi: {
                  name: "Pay via UPI",
                  instruments: [
                    {
                      method: "upi",
                      flows: ["intent", "collect", "qr"],
                      apps: selectedApp ? [selectedApp] : ["google_pay", "phonepe", "paytm", "bhim", "amazonpay"]
                    }
                  ]
                }
              },
              sequence: ["block.upi", "block.other"],
              preferences: {
                show_default_blocks: true
              }
            }
          },
          handler: async function (response: any) {
            setIsProcessing(true);
            try {
              // Verify cryptographic signature and save order in MongoDB
              const verifyRes = await fetch("/api/payment/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  razorpayOrderId: response.razorpay_order_id,
                  razorpayPaymentId: response.razorpay_payment_id,
                  razorpaySignature: response.razorpay_signature,
                  orderData: orderData
                })
              });

              const verifyResult = await verifyRes.json();

              if (verifyRes.ok) {
                toast.success("Payment Successful! Order Confirmed.");
                clearCart();
                router.push(`/track-order?id=${verifyResult.orderId}`);
              } else {
                toast.error(verifyResult.error || "Payment verification failed");
              }
            } catch (err) {
              toast.error("Payment verification request failed.");
            } finally {
              setIsProcessing(false);
            }
          },
          prefill: {
            name: `${formData.firstName} ${formData.lastName}`,
            email: formData.email,
            contact: formData.phone,
            method: "upi",
            provider: selectedApp || undefined
          },
          theme: {
            color: "#c2410c", // Spicy brand color
          },
          modal: {
            ondismiss: function () {
              toast.error("Payment Cancelled");
              setIsProcessing(false);
            }
          }
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.on("payment.failed", function (response: any) {
          toast.error("Payment Failed: " + (response.error.description || "Transaction rejected"));
          setIsProcessing(false);
        });
        rzp.open();
      }
    } catch (error: any) {
      toast.error(error.message || "Something went wrong. Please try again.");
      setIsProcessing(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen pt-32 pb-20 bg-pickle-50 flex items-center justify-center font-poppins">
        <div className="text-center bg-white p-8 rounded-3xl border border-pickle-100 shadow-md max-w-md w-full mx-4">
          <div className="w-16 h-16 bg-pickle-50 rounded-full flex items-center justify-center mx-auto mb-4 text-pickle-600">
            <Truck size={32} />
          </div>
          <h1 className="text-2xl font-black text-brown-900 mb-2">Checkout</h1>
          <p className="text-brown-600 text-sm mb-6 font-semibold">Your cart is empty. Add some pickles to proceed.</p>
          <Link href="/shop" className="bg-pickle-600 text-white px-8 py-3 rounded-2xl font-bold hover:bg-pickle-700 transition-all shadow-lg shadow-pickle-600/20 inline-block text-sm">
            Explore Pickles
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-16 bg-pickle-50 font-poppins">
      <div className="max-w-5xl mx-auto px-4 md:px-6 w-full">
        
        {/* Back Link and Page Title */}
        <div className="flex items-center gap-3 mb-6">
          <Link href="/cart" className="w-8 h-8 bg-white rounded-xl flex items-center justify-center text-brown-500 hover:bg-pickle-600 hover:text-white transition-all shadow-sm border border-pickle-100">
            <ArrowLeft size={16} />
          </Link>
          <h1 className="text-2xl font-black text-brown-900 tracking-tight">Secure Checkout</h1>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Form & Payment Side */}
          <div className="flex-1 order-2 lg:order-1">
            <div className="bg-white p-4 md:p-6 rounded-3xl shadow-md border border-pickle-100 space-y-5">
              {/* Header */}
              <div className="flex items-center gap-2 pb-3 border-b border-pickle-100">
                <div className="w-8 h-8 rounded-lg bg-pickle-50 flex items-center justify-center text-pickle-600 shrink-0">
                  <Truck size={18} />
                </div>
                <div>
                  <h2 className="text-base font-extrabold text-brown-900">1. Delivery Information</h2>
                  <p className="text-[10px] text-brown-500 font-semibold uppercase tracking-wider">Where should we send your pickles?</p>
                </div>
              </div>

              {/* Grid of Inputs */}
              <div className="grid grid-cols-2 gap-x-3 gap-y-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-brown-700">First Name</label>
                  <input 
                    type="text" 
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="John"
                    className={`w-full bg-pickle-50 border ${errors.firstName ? 'border-red-500' : 'border-pickle-100'} text-brown-900 px-3.5 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-pickle-500/20 text-xs font-semibold transition-all`} 
                  />
                  {errors.firstName && <p className="text-red-500 text-[10px] font-bold mt-0.5 flex items-center gap-1"><AlertCircle size={10} /> {errors.firstName}</p>}
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-brown-700">Last Name</label>
                  <input 
                    type="text" 
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Doe"
                    className={`w-full bg-pickle-50 border ${errors.lastName ? 'border-red-500' : 'border-pickle-100'} text-brown-900 px-3.5 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-pickle-500/20 text-xs font-semibold transition-all`} 
                  />
                  {errors.lastName && <p className="text-red-500 text-[10px] font-bold mt-0.5 flex items-center gap-1"><AlertCircle size={10} /> {errors.lastName}</p>}
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-brown-700">Email Address</label>
                  <input 
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    className={`w-full bg-pickle-50 border ${errors.email ? 'border-red-500' : 'border-pickle-100'} text-brown-900 px-3.5 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-pickle-500/20 text-xs font-semibold transition-all`} 
                  />
                  {errors.email && <p className="text-red-500 text-[10px] font-bold mt-0.5 flex items-center gap-1"><AlertCircle size={10} /> {errors.email}</p>}
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-brown-700">Mobile Number</label>
                  <input 
                    type="tel" 
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="9876543210"
                    maxLength={10}
                    className={`w-full bg-pickle-50 border ${errors.phone ? 'border-red-500' : 'border-pickle-100'} text-brown-900 px-3.5 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-pickle-500/20 text-xs font-semibold transition-all`} 
                  />
                  {errors.phone && <p className="text-red-500 text-[10px] font-bold mt-0.5 flex items-center gap-1"><AlertCircle size={10} /> {errors.phone}</p>}
                </div>
                <div className="col-span-2 space-y-1">
                  <label className="text-[11px] font-bold text-brown-700">Full Delivery Address</label>
                  <input 
                    type="text" 
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="House No, Street Name, Area"
                    className={`w-full bg-pickle-50 border ${errors.address ? 'border-red-500' : 'border-pickle-100'} text-brown-900 px-3.5 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-pickle-500/20 text-xs font-semibold transition-all`} 
                  />
                  {errors.address && <p className="text-red-500 text-[10px] font-bold mt-0.5 flex items-center gap-1"><AlertCircle size={10} /> {errors.address}</p>}
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-brown-700">City / District</label>
                  <input 
                    type="text" 
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Kochi"
                    className={`w-full bg-pickle-50 border ${errors.city ? 'border-red-500' : 'border-pickle-100'} text-brown-900 px-3.5 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-pickle-500/20 text-xs font-semibold transition-all`} 
                  />
                  {errors.city && <p className="text-red-500 text-[10px] font-bold mt-0.5 flex items-center gap-1"><AlertCircle size={10} /> {errors.city}</p>}
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-brown-700">PIN Code</label>
                  <input 
                    type="text" 
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    placeholder="682001"
                    maxLength={6}
                    className={`w-full bg-pickle-50 border ${errors.pincode ? 'border-red-500' : 'border-pickle-100'} text-brown-900 px-3.5 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-pickle-500/20 text-xs font-semibold transition-all`} 
                  />
                  {errors.pincode && <p className="text-red-500 text-[10px] font-bold mt-0.5 flex items-center gap-1"><AlertCircle size={10} /> {errors.pincode}</p>}
                </div>
              </div>

              {/* Payment Section Header */}
              <div className="flex flex-col gap-1 pt-3 border-t border-pickle-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-pickle-50 flex items-center justify-center text-pickle-600 shrink-0">
                    <CreditCard size={18} />
                  </div>
                  <div>
                    <h2 className="text-base font-extrabold text-brown-900">2. Choose Your Payment App</h2>
                    <p className="text-[10px] text-brown-500 font-semibold uppercase tracking-wider">Select your preferred UPI app or Cash on Delivery</p>
                  </div>
                </div>
              </div>

              {/* UPI Apps Grid */}
              <div className="space-y-3">
                <span className="text-[10px] font-extrabold text-brown-500 uppercase tracking-widest block mb-1">Instant UPI Payment</span>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5">
                  {upiApps.map(app => {
                    const isSelected = paymentMethod === "online" && selectedApp === app.id;
                    return (
                      <button
                        key={app.id}
                        type="button"
                        onClick={() => {
                          setPaymentMethod("online");
                          setSelectedApp(app.id);
                        }}
                        className={`flex items-center gap-3 p-3 rounded-2xl border-2 transition-all text-left cursor-pointer group active:scale-95 ${
                          isSelected 
                            ? 'border-pickle-500 bg-pickle-50/50 shadow-inner' 
                            : 'border-pickle-100 hover:border-pickle-300 hover:bg-pickle-50/30'
                        }`}
                      >
                        {/* Custom Brand Icon */}
                        <div className="shrink-0">
                          {app.id === "google_pay" && (
                            <div className="w-8 h-8 rounded-xl bg-white shadow-sm border border-gray-100 flex items-center justify-center font-bold text-xs select-none">
                              <span className="text-[#4285F4]">G</span>
                              <span className="text-[#EA4335]">P</span>
                              <span className="text-[#FBBC05]">a</span>
                              <span className="text-[#34A853]">y</span>
                            </div>
                          )}
                          {app.id === "phonepe" && (
                            <div className="w-8 h-8 rounded-xl bg-[#5f259f] text-white shadow-sm flex items-center justify-center font-black text-xs select-none">
                              Pe
                            </div>
                          )}
                          {app.id === "paytm" && (
                            <div className="w-8 h-8 rounded-xl bg-[#00baf2] text-white shadow-sm flex items-center justify-center font-black text-[9px] select-none uppercase tracking-tighter">
                              Paytm
                            </div>
                          )}
                          {app.id === "bhim" && (
                            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#e9580c] to-[#f472b6] text-white shadow-sm flex items-center justify-center font-bold text-xs select-none italic">
                              BHIM
                            </div>
                          )}
                          {app.id === "amazonpay" && (
                            <div className="w-8 h-8 rounded-xl bg-[#232F3E] text-[#FF9900] shadow-sm flex flex-col items-center justify-center font-black text-[7px] select-none leading-none">
                              <span>amazon</span>
                              <span className="text-[6px] text-white font-bold">pay</span>
                            </div>
                          )}
                        </div>

                        <div>
                          <span className="font-extrabold text-brown-900 block text-xs leading-none">{app.name}</span>
                          <span className="text-[8px] text-brown-500 font-semibold block leading-none mt-1">Direct pay</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* COD Option */}
              <div className="space-y-2 pt-1">
                <span className="text-[10px] font-extrabold text-brown-500 uppercase tracking-widest block mb-1">Other Options</span>
                <button
                  type="button"
                  onClick={() => {
                    setPaymentMethod("cod");
                    setSelectedApp(null);
                  }}
                  className={`w-full flex items-center gap-3 p-3.5 rounded-2xl border-2 transition-all text-left cursor-pointer active:scale-98 ${
                    paymentMethod === "cod"
                      ? 'border-pickle-500 bg-pickle-50/50 shadow-inner' 
                      : 'border-pickle-100 hover:border-pickle-300 hover:bg-pickle-50/30'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-colors ${paymentMethod === 'cod' ? 'bg-pickle-600 text-white' : 'bg-pickle-100 text-pickle-600'}`}>
                    <Banknote size={16} />
                  </div>
                  <div>
                    <span className="font-extrabold text-brown-900 block text-xs leading-none">Cash on Delivery (COD)</span>
                    <span className="text-[9px] text-brown-500 font-semibold block leading-none mt-1">Pay with cash when your pickle jar is delivered</span>
                  </div>
                </button>
              </div>

              {/* Secure Payment Note */}
              <div className="bg-pickle-50/80 p-2.5 rounded-2xl border border-pickle-100 flex items-center justify-between gap-2">
                <span className="text-[9px] font-black text-brown-500 uppercase tracking-widest">100% Secure Payments via Razorpay</span>
                <div className="flex items-center gap-1.5 text-[8px] font-extrabold text-green-700 bg-green-50 px-2 py-0.5 rounded-md border border-green-100">
                  <ShieldCheck size={10} /> SECURE GATEWAY
                </div>
              </div>
            </div>
          </div>

          {/* Summary Side */}
          <div className="w-full lg:w-[380px] shrink-0 order-1 lg:order-2">
            <div className="bg-white p-4 md:p-5 rounded-3xl shadow-lg border border-pickle-100 lg:sticky lg:top-[120px] space-y-4">
              <h2 className="text-base font-extrabold text-brown-900 pb-2 border-b border-pickle-100 flex items-center justify-between">
                <span>Order Summary</span>
                <span className="text-[10px] bg-pickle-100 text-pickle-700 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">{cart.length} {cart.length === 1 ? 'Item' : 'Items'}</span>
              </h2>
              
              {/* Product List */}
              <div className="space-y-3 max-h-[180px] overflow-y-auto pr-1 custom-scrollbar">
                {cart.map(item => (
                  <div key={item._id || item.id} className="flex gap-3 group">
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-pickle-50 border border-pickle-100 shrink-0 shadow-sm">
                      <img 
                        src={(item.images && item.images[0]) || item.image || "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?q=80&w=1470&auto=format&fit=crop"} 
                        alt={item.title || item.name} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-center min-w-0">
                      <h4 className="font-bold text-xs text-brown-900 group-hover:text-pickle-600 transition-colors truncate">{item.title || item.name}</h4>
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-[9px] font-extrabold text-brown-500 bg-pickle-50 px-2 py-0.5 rounded">Qty: {item.quantity}</span>
                        <span className="font-extrabold text-pickle-600 text-xs">₹{(item.offerPrice || item.price) * (item.quantity || 1)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Details */}
              <div className="border-t border-pickle-100 pt-3 space-y-2.5 text-xs font-bold">
                <div className="flex justify-between text-brown-500">
                  <span>Subtotal</span>
                  <span className="text-brown-900 font-extrabold">₹{cartTotal}</span>
                </div>
                <div className="flex justify-between text-brown-500">
                  <span>Delivery Charge</span>
                  <span className="text-green-600 font-extrabold uppercase text-[10px] tracking-wider">Free Delivery</span>
                </div>
                <div className="flex justify-between text-base font-black border-t border-pickle-100 pt-3 mt-1">
                  <span className="text-brown-900 uppercase tracking-tight">Total Amount</span>
                  <span className="text-pickle-600">₹{cartTotal}</span>
                </div>
              </div>

              {/* Confirm button */}
              <button 
                onClick={handlePlaceOrder} 
                disabled={isProcessing}
                className="w-full bg-pickle-600 text-white py-3.5 rounded-2xl font-extrabold text-sm hover:bg-pickle-700 transition-all shadow-md shadow-pickle-600/20 flex items-center justify-center gap-2 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed group cursor-pointer"
              >
                {isProcessing ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Processing Order...</span>
                  </>
                ) : (
                  <>
                    <span>Confirm Order</span>
                    <ShieldCheck size={16} className="group-hover:scale-110 transition-transform" />
                  </>
                )}
              </button>
              
              <p className="text-center text-[9px] text-brown-400 font-bold uppercase tracking-widest flex items-center justify-center gap-1">
                <ShieldCheck size={10} className="text-green-600" /> 100% Safe & Secure Checkout
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

