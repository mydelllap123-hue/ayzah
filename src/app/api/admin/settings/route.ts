import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { Settings } from "@/models/AdminModels";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function GET() {
  try {
    await connectDB();
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({
        siteName: "Ayzah Pickles",
        socialLinks: { facebook: "", instagram: "", twitter: "", youtube: "" }
      });
    }
    return NextResponse.json({ success: true, data: settings });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch settings" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    await connectDB();
    const formData = await request.formData();
    
    const siteName = formData.get("siteName") as string;
    const phone = formData.get("phone") as string;
    const email = formData.get("email") as string;
    const address = formData.get("address") as string;
    const deliveryCharge = Number(formData.get("deliveryCharge") || 0);
    const enableOnlinePayment = formData.get("enableOnlinePayment") === "true";
    
    const socialLinksRaw = formData.get("socialLinks") as string;
    let socialLinks = {};
    if (socialLinksRaw) socialLinks = JSON.parse(socialLinksRaw);

    const logoFile = formData.get("logo") as File;
    const faviconFile = formData.get("favicon") as File;

    const uploadDir = path.join(process.cwd(), "public", "uploads", "settings");
    try { await mkdir(uploadDir, { recursive: true }); } catch (e) {}

    const saveFile = async (file: File) => {
      const bytes = await file.arrayBuffer();
      const filename = `${crypto.randomUUID()}-${file.name.replace(/\s/g, "-")}`;
      await writeFile(path.join(uploadDir, filename), Buffer.from(bytes));
      return `/uploads/settings/${filename}`;
    };

    let settings = await Settings.findOne();
    if (!settings) settings = new Settings();

    if (logoFile && typeof logoFile !== "string") settings.logo = await saveFile(logoFile);
    if (faviconFile && typeof faviconFile !== "string") settings.favicon = await saveFile(faviconFile);

    settings.siteName = siteName || settings.siteName;
    settings.phone = phone || settings.phone;
    settings.email = email || settings.email;
    settings.address = address || settings.address;
    settings.deliveryCharge = deliveryCharge;
    settings.enableOnlinePayment = enableOnlinePayment;
    settings.socialLinks = { ...settings.socialLinks, ...socialLinks };

    await settings.save();

    return NextResponse.json({ success: true, data: settings });
  } catch (error: any) {
    console.error("SETTINGS_UPDATE_ERROR:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
