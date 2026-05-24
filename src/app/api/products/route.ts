import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { Product } from "@/models/AdminModels";

export async function GET(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    
    let query = {};
    if (category) {
      query = { 
        $or: [
          { category: category },
          { categorySlug: category.toLowerCase() }
        ]
      };
    }

    const products = await Product.find(query).sort({ createdAt: -1 });
    
    return NextResponse.json({ 
      success: true, 
      data: products 
    });
  } catch (error: any) {
    return NextResponse.json({ 
      success: false, 
      error: "Failed to fetch products" 
    }, { status: 500 });
  }
}
