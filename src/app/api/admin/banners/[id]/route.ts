import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { Banner } from "@/models/AdminModels";
import { unlink, writeFile, mkdir } from "fs/promises";
import path from "path";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const banner = await Banner.findById(id);
    if (!banner) return NextResponse.json({ success: false, error: "Banner not found" }, { status: 404 });

    const formData = await request.formData();
    const title = (formData.get("title") as string || "").trim();
    const type = formData.get("type") as string || "static";
    const speed = Number(formData.get("speed") || 3000);
    const active = formData.get("active") === "true";
    
    // Existing images (URLs)
    const existingImagesRaw = formData.get("existingImages") as string;
    let images = [];
    if (existingImagesRaw) {
      try { images = JSON.parse(existingImagesRaw); } catch (e) {}
    }

    // New uploaded files
    const newFiles = formData.getAll("images") as File[];
    
    const uploadDir = path.join(process.cwd(), "public", "uploads", "banners");
    try { await mkdir(uploadDir, { recursive: true }); } catch (e) {}

    const newImageUrls = await Promise.all(newFiles.filter(f => typeof f !== "string").map(async (file) => {
      const bytes = await file.arrayBuffer();
      const filename = `${crypto.randomUUID()}-${file.name.replace(/\s/g, "-")}`;
      await writeFile(path.join(uploadDir, filename), Buffer.from(bytes));
      return `/uploads/banners/${filename}`;
    }));

    const finalImages = [...images, ...newImageUrls];
    
    if (finalImages.length === 0) return NextResponse.json({ success: false, error: "At least one image is required" }, { status: 400 });

    const updated = await Banner.findByIdAndUpdate(id, { $set: { title, type, speed, active, images: finalImages } }, { new: true });

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const banner = await Banner.findById(id);
    if (!banner) return NextResponse.json({ success: false, error: "Banner not found" }, { status: 404 });

    // Cleanup files
    for (const img of banner.images) {
      if (img && img.startsWith("/uploads")) {
        try { await unlink(path.join(process.cwd(), "public", img)); } catch (e) {}
      }
    }

    await Banner.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: "Banner deleted" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: "Delete failed" }, { status: 500 });
  }
}
