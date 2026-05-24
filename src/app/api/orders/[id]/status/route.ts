import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { reduceProductStock, restoreProductStock } from "@/lib/stockHelper";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any).role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    await connectDB();
    const { id } = await params;
    const body = await request.json();
    const { status } = body;

    const validStatuses = ["ordered", "processing", "shipped", "delivered", "cancelled"];
    if (!status || !validStatuses.includes(status)) {
      return NextResponse.json({ error: "Invalid or missing status" }, { status: 400 });
    }

    const currentOrder = await Order.findById(id);
    if (!currentOrder) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const previousStatus = currentOrder.status;

    // Handle stock changes dynamically based on status transitions
    if (status === "cancelled" && previousStatus !== "cancelled") {
      await restoreProductStock(currentOrder.items);
    } else if (previousStatus === "cancelled" && status !== "cancelled") {
      await reduceProductStock(currentOrder.items);
    }

    currentOrder.status = status;
    const updatedOrder = await currentOrder.save();

    // Call dynamic bestseller stats recalculation if order status changed
    try {
      const { recalculateBestsellers } = require("@/lib/bestsellerHelper");
      await recalculateBestsellers();
    } catch (e) {
      console.warn("recalculateBestsellers not implemented or failed:", e);
    }

    return NextResponse.json({ 
      success: true, 
      message: `Order status updated to ${status} successfully.`, 
      order: updatedOrder 
    });

  } catch (error: any) {
    console.error("PATCH Order Status Error:", error);
    return NextResponse.json({ error: "Failed to update order status" }, { status: 500 });
  }
}
