export const dynamic = "force-dynamic";
export const revalidate = 0;

import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import Category from "@/models/Category";

const DEFAULTS: Record<string, {
  name: string; slug: string; type: string; icon: string;
  description: string; thumbnail: string; banner: string;
}> = {
  veg: {
    name: "Veg Pickles",
    slug: "veg",
    type: "veg",
    icon: "leaf",
    description: "Delectable handcrafted 100% vegetarian pickles bursting with authentic regional spices.",
    thumbnail: "https://images.unsplash.com/photo-1589135303604-b936edcbb197?q=80&w=800&auto=format&fit=crop",
    banner: "https://images.unsplash.com/photo-1589135303604-b936edcbb197?q=80&w=1600&auto=format&fit=crop",
  },
  "non-veg": {
    name: "Non-Veg Pickles",
    slug: "non-veg",
    type: "non-veg",
    icon: "drumstick",
    description: "Premium spicy non-vegetarian pickles prepared with fresh local seafood and meat varieties.",
    thumbnail: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?q=80&w=800&auto=format&fit=crop",
    banner: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?q=80&w=1600&auto=format&fit=crop",
  },
};

export async function GET() {
  try {
    await connectDB();

    const [vegCount, nonVegCount, vegOverride, nonVegOverride] = await Promise.all([
      Product.countDocuments({ category: { $in: ["veg", "Veg Pickles", "veg-pickles"] } }),
      Product.countDocuments({ category: { $in: ["non-veg", "Non-Veg Pickles", "non-veg-pickles"] } }),
      Category.findOne({ slug: "veg" }).lean(),
      Category.findOne({ slug: "non-veg" }).lean(),
    ]);

    const buildCategory = (slug: string, count: number, override: any) => {
      const def = DEFAULTS[slug];
      return {
        _id: slug,
        name: def.name,
        slug: def.slug,
        type: def.type,
        icon: def.icon,
        description: override?.description || def.description,
        thumbnail: override?.thumbnail || def.thumbnail,
        banner: override?.banner || def.banner,
        productCount: count,
        products: [],
        linkedProducts: [],
      };
    };

    const categories = [
      buildCategory("veg", vegCount, vegOverride),
      buildCategory("non-veg", nonVegCount, nonVegOverride),
    ];

    return NextResponse.json({ success: true, data: categories });
  } catch (error: any) {
    console.error("CATEGORIES_GET_ERROR:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch categories" }, { status: 500 });
  }
}
