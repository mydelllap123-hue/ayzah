import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Review from "@/models/Review";
import Product from "@/models/Product";
import Order from "@/models/Order";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET /api/reviews?productSlug=xxx&status=approved
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const productSlug = searchParams.get("productSlug");
    const status = searchParams.get("status") || "approved";

    const query: Record<string, any> = { status };
    if (productSlug) {
      query.productSlug = productSlug;
    }

    const reviews = await Review.find(query).sort({ createdAt: -1 }).limit(20).lean();

    if (productSlug) {
      // Calculate aggregate stats for specific product
      const allApproved = await Review.find({ productSlug, status: "approved" }).lean();
      const totalCount = allApproved.length;
      const avgRating =
        totalCount > 0
          ? Math.round(
              (allApproved.reduce((sum, r) => sum + r.rating, 0) / totalCount) * 10
            ) / 10
          : 0;

      // Rating breakdown (1-5)
      const breakdown = [1, 2, 3, 4, 5].map((star) => ({
        star,
        count: allApproved.filter((r) => r.rating === star).length,
      }));

      return NextResponse.json({ reviews, totalCount, avgRating, breakdown });
    }

    // Homepage / general query
    return NextResponse.json({ reviews });
  } catch (error) {
    console.error("GET /api/reviews error:", error);
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 });
  }
}

// POST /api/reviews  — submit a new review
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "You must be logged in to submit a review" }, { status: 401 });
    }

    await connectDB();

    const body = await request.json();
    const { productSlug, rating, title, reviewBody } = body;

    if (!productSlug || !rating || !reviewBody) {
      return NextResponse.json({ error: "productSlug, rating, and review body are required" }, { status: 400 });
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Rating must be between 1 and 5" }, { status: 400 });
    }

    if (reviewBody.trim().length < 10) {
      return NextResponse.json({ error: "Review must be at least 10 characters" }, { status: 400 });
    }

    // Find the product
    const product = await Product.findOne({ slug: productSlug });
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const userId = (session.user as any).id;

    // Check for duplicate review
    const existing = await Review.findOne({ product: product._id, user: userId });
    if (existing) {
      return NextResponse.json({ error: "You have already reviewed this product" }, { status: 409 });
    }

    // Check verified purchase
    const order = await Order.findOne({
      "customerInfo.email": session.user.email,
      "items.productId": product._id,
      status: { $in: ["delivered", "shipped", "processing"] },
    });

    if (!order) {
      return NextResponse.json({ error: "Only customer who purchased the product can review." }, { status: 403 });
    }

    const verifiedPurchase = true;

    // Sanitize input texts
    const sanitize = (text: string) => text.replace(/<[^>]*>/g, "").trim();
    const cleanTitle = title ? sanitize(title) : "";
    const cleanBody = sanitize(reviewBody);

    const review = await Review.create({
      product: product._id,
      productId: product._id,
      productSlug,
      user: userId,
      userId: userId,
      userName: session.user.name || "Anonymous",
      userEmail: session.user.email,
      userImage: session.user.image || "",
      rating,
      title: cleanTitle,
      body: cleanBody,
      reviewText: cleanBody,
      verifiedPurchase,
      status: "pending", // Admin must approve
    });

    return NextResponse.json(
      { message: "Review submitted successfully! It will appear after admin approval.", review },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("POST /api/reviews error:", error);
    if (error.code === 11000) {
      return NextResponse.json({ error: "You have already reviewed this product" }, { status: 409 });
    }
    return NextResponse.json({ error: "Failed to submit review" }, { status: 500 });
  }
}
