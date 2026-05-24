import mongoose, { Schema, model, models } from "mongoose";

const BannerSchema = new Schema({
  title: { type: String, default: "", trim: true },
  type: { type: String, default: "slider", enum: ["slider", "static", "promo"] },
  isSlider: { type: Boolean },
  images: [{ type: String, default: [] }],
  speed: { type: Number, default: 5000 },
  displayTime: { type: Number },
  active: { type: Boolean, default: true },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

if (models && models.Banner) {
  delete (mongoose as any).models.Banner;
}

const Banner = models.Banner || model("Banner", BannerSchema);
export default Banner;
