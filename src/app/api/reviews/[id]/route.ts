import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Review from "@/models/Review";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// DELETE /api/reviews/[id] — Admin only
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any).role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { id } = await params;
    await connectDB();
    const review = await Review.findByIdAndDelete(id);
    if (!review) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    // Recalculate average rating & count for the product
    const { updateProductRating } = require("@/lib/ratingHelper");
    await updateProductRating(review.product.toString());

    return NextResponse.json({ message: "Review deleted successfully" });
  } catch (error) {
    console.error("DELETE /api/reviews/[id] error:", error);
    return NextResponse.json({ error: "Failed to delete review" }, { status: 500 });
  }
}

// PATCH /api/reviews/[id] — Admin approve / reject / toggle featured
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any).role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { id } = await params;
    await connectDB();
    const body = await request.json();
    const { status, featured } = body;

    const updateFields: Record<string, any> = {};
    if (status !== undefined) {
      if (!['approved', 'rejected', 'pending'].includes(status)) {
        return NextResponse.json({ error: "Invalid status" }, { status: 400 });
      }
      updateFields.status = status;
    }
    if (featured !== undefined) {
      updateFields.featured = !!featured;
    }

    if (Object.keys(updateFields).length === 0) {
      return NextResponse.json({ error: "No fields to update" }, { status: 400 });
    }

    const review = await Review.findByIdAndUpdate(
      id,
      { $set: updateFields },
      { new: true }
    );

    if (!review) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    // Recalculate average rating & count for the product if status was updated
    if (status !== undefined) {
      const { updateProductRating } = require("@/lib/ratingHelper");
      await updateProductRating(review.product.toString());
    }

    return NextResponse.json({ message: "Review updated successfully", review });
  } catch (error) {
    console.error("PATCH /api/reviews/[id] error:", error);
    return NextResponse.json({ error: "Failed to update review" }, { status: 500 });
  }
}
