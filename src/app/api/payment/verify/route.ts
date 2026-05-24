import { NextResponse } from "next/server";
import crypto from "crypto";
import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import { checkStockAvailability, reduceProductStock } from "@/lib/stockHelper";

export async function POST(request: Request) {
  try {
    await connectDB();
    const { 
      razorpayOrderId, 
      razorpayPaymentId, 
      razorpaySignature, 
      orderData 
    } = await request.json();

    // 1. Basic Fields Validation
    if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature || !orderData) {
      return NextResponse.json({ error: "Missing required verification data" }, { status: 400 });
    }

    // 2. Cryptographic Signature Verification
    const secret = process.env.RAZORPAY_KEY_SECRET || "jkzIaqAmn66T4CtSy4wFnHS2";
    const generatedSignature = crypto
      .createHmac("sha256", secret)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest("hex");

    const isSignatureValid = generatedSignature === razorpaySignature;

    if (!isSignatureValid) {
      return NextResponse.json({ error: "Cryptographic signature verification failed" }, { status: 400 });
    }

    // 3. Stock Check before final commit
    const stockStatus = await checkStockAvailability(orderData.items);
    if (!stockStatus.available) {
      return NextResponse.json({ 
        error: "One or more products went out of stock during the transaction.",
        details: stockStatus.insufficientItems
      }, { status: 400 });
    }

    // 4. Save Order in MongoDB
    const newOrder = new Order({
      customerInfo: orderData.customerInfo,
      items: orderData.items.map((item: any) => ({
        productId: item.productId,
        title: item.title,
        price: item.price,
        quantity: item.quantity,
        image: item.image
      })),
      totalAmount: orderData.totalAmount,
      subtotal: orderData.subtotal,
      deliveryCharge: 0,
      paymentMethod: "online",
      status: "ordered",
      paymentStatus: "paid",
      orderId: razorpayOrderId,
      paymentId: razorpayPaymentId
    });

    await newOrder.save();

    // 5. Commit Stock Reduction
    await reduceProductStock(orderData.items);

    return NextResponse.json({
      success: true,
      message: "Payment verified and order placed successfully",
      orderId: newOrder._id
    }, { status: 201 });

  } catch (error: any) {
    console.error("Razorpay Verification Error:", error);
    return NextResponse.json({ error: "Internal payment verification error" }, { status: 500 });
  }
}
