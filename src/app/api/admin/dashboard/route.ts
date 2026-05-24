import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import Product from "@/models/Product";
import User from "@/models/User";

export async function GET() {
  try {
    await connectDB();

    const [
      totalOrders,
      orders,
      totalProducts,
      totalUsers,
      totalCustomers,
      lowStockCount,
      lowStockProducts,
      recentOrders
    ] = await Promise.all([
      Order.countDocuments(),
      Order.find(),
      Product.countDocuments(),
      User.countDocuments(),
      User.countDocuments({ role: "customer" }),
      Product.countDocuments({ stock: { $lte: 5 } }), // Alert at stock <= 5
      Product.find({ stock: { $lte: 5 } }).limit(5),
      Order.find().sort({ createdAt: -1 }).limit(5)
    ]);

    const revenue = orders
      .filter(o => o.status !== "cancelled")
      .reduce((acc, order) => acc + (order.totalAmount || 0), 0);

    const orderedOrders = orders.filter(o => o.status === "ordered").length;
    const processingOrders = orders.filter(o => o.status === "processing").length;
    const shippedOrders = orders.filter(o => o.status === "shipped").length;
    const deliveredOrders = orders.filter(o => o.status === "delivered").length;
    const cancelledOrders = orders.filter(o => o.status === "cancelled").length;

    // Monthly revenue chart data
    const last6Months = Array.from({ length: 6 }).map((_, i) => {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      return d.toLocaleString('default', { month: 'short' });
    }).reverse();

    // Real monthly sales aggregation
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);
    sixMonthsAgo.setHours(0, 0, 0, 0);

    const monthlySalesAggregation = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: sixMonthsAgo },
          status: { $ne: "cancelled" }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" }
          },
          totalSales: { $sum: "$totalAmount" }
        }
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 }
      }
    ]);

    const salesData = last6Months.map(monthName => {
      const monthsList = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const monthIndex = monthsList.indexOf(monthName);
      
      const aggResult = monthlySalesAggregation.find(item => (item._id.month - 1) === monthIndex);
      
      return {
        name: monthName,
        sales: aggResult ? aggResult.totalSales : 0
      };
    });

    return NextResponse.json({
      stats: {
        totalOrders,
        orderedOrders,
        processingOrders,
        shippedOrders,
        deliveredOrders,
        cancelledOrders,
        totalProducts,
        totalUsers,
        totalCustomers,
        lowStockCount,
        revenue,
      },
      lowStockProducts,
      salesData,
      recentOrders
    });

  } catch (error) {
    console.error("Dashboard Stats API Error:", error);
    return NextResponse.json({ error: "Failed to fetch dashboard stats" }, { status: 500 });
  }
}
