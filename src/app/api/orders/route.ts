export const dynamic = "force-dynamic";
export const revalidate = 0;

import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import { checkStockAvailability, reduceProductStock } from "@/lib/stockHelper";

export async function POST(request: Request) {
  try {
    await connectDB();
    const data = await request.json();
    
    const { 
      customerInfo, 
      items, 
      totalAmount, 
      subtotal, 
      deliveryCharge, 
      paymentMethod 
    } = data;

    // Validate required fields
    if (!customerInfo || !items || items.length === 0) {
      return NextResponse.json({ error: "Missing required order information" }, { status: 400 });
    }

    // Only allow COD placement directly through this endpoint
    if (paymentMethod !== "cod") {
      return NextResponse.json({ error: "Invalid payment method for direct order placement" }, { status: 400 });
    }

    // 1. Stock check
    const stockStatus = await checkStockAvailability(items);
    if (!stockStatus.available) {
      return NextResponse.json({ 
        error: "Some items are out of stock", 
        details: stockStatus.insufficientItems 
      }, { status: 400 });
    }

    // 2. Create Mongoose Order
    const newOrder = new Order({
      customerInfo,
      items: items.map((item: any) => ({
        productId: item.productId,
        title: item.title,
        price: item.price,
        quantity: item.quantity,
        image: item.image
      })),
      totalAmount,
      subtotal,
      deliveryCharge,
      paymentMethod,
      status: "ordered",
      paymentStatus: "pending"
    });

    await newOrder.save();

    // 3. Commit Stock Reduction
    await reduceProductStock(items);

    // 4. Recalculate bestsellers since an active order is placed
    try {
      const { recalculateBestsellers } = require("@/lib/bestsellerHelper");
      await recalculateBestsellers();
    } catch (e) {
      console.warn("recalculateBestsellers not implemented or failed:", e);
    }

    return NextResponse.json({ 
      success: true, 
      message: "Order placed successfully", 
      orderId: newOrder._id 
    }, { status: 201 });

  } catch (error: any) {
    console.error("Order Creation Error:", error);
    return NextResponse.json({ error: "Failed to place order" }, { status: 500 });
  }
}

export async function GET() {
  try {
    await connectDB();
    const orders = await Order.find().sort({ createdAt: -1 });
    return NextResponse.json(orders);
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    await connectDB();
    const { id, status, paymentStatus } = await request.json();
    
    if (!id) {
      return NextResponse.json({ error: "Order ID is required" }, { status: 400 });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { $set: { status, paymentStatus } },
      { new: true }
    );

    if (!updatedOrder) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, order: updatedOrder });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
  }
}
