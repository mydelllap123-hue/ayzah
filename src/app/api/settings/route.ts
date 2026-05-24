import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { Settings } from "@/models/AdminModels";

export async function GET() {
  try {
    await connectDB();
    let settings = await Settings.findOne({});
    
    if (!settings) {
      settings = await Settings.create({
        siteName: "Ayzah Pickles",
        socialLinks: { facebook: "", instagram: "", twitter: "", whatsapp: "" }
      });
    }

    return NextResponse.json({ success: true, data: settings });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: "Failed to fetch settings" }, { status: 500 });
  }
}
