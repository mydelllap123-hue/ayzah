import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { Banner } from "@/models/AdminModels";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function GET() {
  try {
    await connectDB();
    const banners = await Banner.find().sort({ createdAt: -1 });
    
    const normalizedBanners = banners.map(b => {
      const doc = b.toObject();
      const images = Array.isArray(doc.images) ? doc.images : (doc.image ? [doc.image] : []);
      const active = doc.active !== undefined ? doc.active : doc.isActive;
      const title = doc.title || "Special Offer";
      const type = doc.type || (doc.isSlider ? "slider" : "static");
      const speed = doc.speed || (doc.displayTime ? doc.displayTime * 1000 : 5000);
      
      return {
        ...doc,
        title,
        type,
        images,
        speed,
        active,
        isActive: active
      };
    });
    
    return NextResponse.json({ success: true, data: normalizedBanners });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch banners" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const formData = await request.formData();
    
    const title = (formData.get("title") as string || "").trim();
    const type = formData.get("type") as string || "static";
    const speed = Number(formData.get("speed") || 3000);
    const active = formData.get("active") === "true";
    
    const files = formData.getAll("images") as File[];

    if (!title) return NextResponse.json({ success: false, error: "Title is required" }, { status: 400 });
    if (files.length === 0) return NextResponse.json({ success: false, error: "At least one image is required" }, { status: 400 });

    const uploadDir = path.join(process.cwd(), "public", "uploads", "banners");
    try { await mkdir(uploadDir, { recursive: true }); } catch (e) {}

    const imageUrls = await Promise.all(files.map(async (file) => {
      const bytes = await file.arrayBuffer();
      const filename = `${crypto.randomUUID()}-${file.name.replace(/\s/g, "-")}`;
      await writeFile(path.join(uploadDir, filename), Buffer.from(bytes));
      return `/uploads/banners/${filename}`;
    }));

    const banner = await Banner.create({ title, type, images: imageUrls, speed, active });

    return NextResponse.json({ success: true, data: banner }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
