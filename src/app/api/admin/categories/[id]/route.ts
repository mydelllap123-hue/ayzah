import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Category from "@/models/Category";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const ALLOWED_SLUGS = ["veg", "non-veg"];

// PATCH /api/admin/categories/[id]
// Only allows updating description, thumbnail, banner, active (featured) for the 2 permanent categories
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any).role !== "admin") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 403 });
    }

    const { id: slug } = await params;

    if (!ALLOWED_SLUGS.includes(slug)) {
      return NextResponse.json(
        { success: false, error: "Invalid category slug. Only 'veg' and 'non-veg' are allowed." },
        { status: 400 }
      );
    }

    await connectDB();

    const body = await request.json();
    const { description, thumbnail, banner, active } = body;

    // Build update object — only allow safe fields
    const updatePayload: Record<string, any> = {};
    if (typeof description === "string") updatePayload.description = description.trim();
    if (typeof thumbnail === "string") updatePayload.thumbnail = thumbnail.trim();
    if (typeof banner === "string") updatePayload.banner = banner.trim();
    if (typeof active === "boolean") updatePayload.featured = active;

    // Use findOneAndUpdate with upsert — creates the doc if it doesn't exist yet
    const updated = await Category.findOneAndUpdate(
      { slug },
      {
        $set: {
          name: slug === "veg" ? "Veg Pickles" : "Non-Veg Pickles",
          slug,
          ...updatePayload,
        },
      },
      { new: true, upsert: true }
    );

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    console.error("ADMIN_CATEGORIES_PATCH_ERROR:", error);
    return NextResponse.json({ success: false, error: "Failed to update category" }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json(
    { success: false, error: "Use /api/admin/categories to list categories." },
    { status: 405 }
  );
}

export async function DELETE() {
  return NextResponse.json(
    { success: false, error: "Category deletion is permanently disabled." },
    { status: 405 }
  );
}
