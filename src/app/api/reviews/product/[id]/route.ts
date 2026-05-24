import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Review from "@/models/Review";
import mongoose from "mongoose";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: "Product ID or slug is required" }, { status: 400 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") || "approved";

    // Detect if ID is a valid MongoDB ObjectId
    const isObjectId = mongoose.Types.ObjectId.isValid(id);
    const query: Record<string, any> = { status };

    if (isObjectId) {
      query.product = new mongoose.Types.ObjectId(id);
    } else {
      query.productSlug = id;
    }

    const reviews = await Review.find(query).sort({ createdAt: -1 }).lean();

    // Aggregate statistics (approved reviews only)
    const approvedQuery = { ...query, status: "approved" };
    const allApproved = await Review.find(approvedQuery).lean();
    const totalCount = allApproved.length;
    const avgRating = totalCount > 0 
      ? Math.round((allApproved.reduce((sum, r) => sum + r.rating, 0) / totalCount) * 10) / 10 
      : 0;

    const breakdown = [1, 2, 3, 4, 5].map((star) => ({
      star,
      count: allApproved.filter((r) => r.rating === star).length,
    }));

    return NextResponse.json({
      reviews,
      totalCount,
      avgRating,
      breakdown
    });

  } catch (error: any) {
    console.error("GET /api/reviews/product/[id] error:", error);
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 });
  }
}
