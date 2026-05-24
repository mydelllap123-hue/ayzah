export const dynamic = "force-dynamic";
export const revalidate = 0;

import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { Product } from "@/models/AdminModels";

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    
    // Normalize Payload to force standard naming
    const normalizedName = (body.name || body.title || body.productTitle || "").trim();
    const productData = {
      name: normalizedName,
      title: normalizedName,
      slug: (body.slug || "").trim().toLowerCase().replace(/\s+/g, "-"),
      description: (body.description || body.fullDescription || "").trim(),
      category: body.category || "General",
      categorySlug: body.categorySlug || (body.category || "").toLowerCase().replace(/\s+/g, "-"),
      images: Array.isArray(body.images) ? body.images : [],
      price: Number(body.price || 0),
      offerPrice: Number(body.offerPrice || 0),
      stock: Number(body.stock || 0),
      weight: body.weight || "250g",
      featured: Boolean(body.featured),
      forceBestseller: Boolean(body.forceBestseller),
      status: body.status || "active"
    };

    if (!productData.name) {
      return NextResponse.json({ success: false, error: "Product name is required" }, { status: 400 });
    }

    const product = await Product.create(productData);
    return NextResponse.json({ success: true, data: product }, { status: 201 });
  } catch (error: any) {
    console.error("ADMIN_PRODUCT_POST_ERROR:", error);
    return NextResponse.json({ success: false, error: error.message || "Internal Server Error" }, { status: 500 });
  }
}

export async function GET() {
  try {
    await connectDB();
    const products = await Product.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: products });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: "Failed to fetch products" }, { status: 500 });
  }
}
