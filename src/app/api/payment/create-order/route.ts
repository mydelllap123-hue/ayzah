import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import { checkStockAvailability } from "@/lib/stockHelper";

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "rzp_test_SssL08i84bcjUM",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "jkzIaqAmn66T4CtSy4wFnHS2",
});

export async function POST(request: Request) {
  try {
    await connectDB();
    const { items } = await request.json();

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "No items provided" }, { status: 400 });
    }

    // 1. Stock Check
    const stockStatus = await checkStockAvailability(items);
    if (!stockStatus.available) {
      return NextResponse.json({
        error: "Some items are out of stock",
        details: stockStatus.insufficientItems,
      }, { status: 400 });
    }

    // 2. Secure Price Calculation (database-level pricing integrity)
    let secureTotal = 0;
    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return NextResponse.json({ error: `Product not found: ${item.title}` }, { status: 400 });
      }
      const price = product.offerPrice || product.price;
      secureTotal += price * item.quantity;
    }

    // 3. Create Razorpay Order
    const options = {
      amount: secureTotal * 100, // Razorpay expects amount in paise (1 INR = 100 paise)
      currency: "INR",
      receipt: `rcpt_${Date.now().toString().slice(-8)}`,
    };

    const razorpayOrder = await razorpay.orders.create(options);

    return NextResponse.json({
      success: true,
      keyId: process.env.RAZORPAY_KEY_ID || "rzp_test_SssL08i84bcjUM",
      id: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
    });

  } catch (error: any) {
    console.error("Razorpay Order Generation Error:", error);
    return NextResponse.json({ error: "Failed to initialize payment order" }, { status: 500 });
  }
}
