import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { Banner } from "@/models/AdminModels";

export async function GET() {
  try {
    await connectDB();
    const banners = await Banner.find({
      $or: [
        { active: true },
        { isActive: true }
      ]
    }).sort({ createdAt: -1 });

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
  } catch (error: any) {
    return NextResponse.json({ success: false, error: "Failed to fetch banners" }, { status: 500 });
  }
}
