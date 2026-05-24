import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Banner from "@/models/Banner";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    console.log("Deleting banner (Public API):", id);

    const banner = await Banner.findByIdAndDelete(id);
    
    if (!banner) {
      return NextResponse.json({ error: "Banner not found" }, { status: 404 });
    }
    
    return NextResponse.json({ message: "Banner deleted successfully" });
  } catch (error) {
    console.error("Delete error:", error);
    return NextResponse.json({ error: "Failed to delete banner" }, { status: 500 });
  }
}
