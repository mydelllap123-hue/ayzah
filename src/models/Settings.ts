import mongoose, { Schema, model, models } from "mongoose";

const SettingsSchema = new Schema({
  siteName: { type: String, default: "Ayzah Pickles", trim: true },
  logo: { type: String, default: "" },
  favicon: { type: String, default: "" },
  phone: { type: String, default: "", trim: true },
  email: { type: String, default: "", trim: true },
  address: { type: String, default: "", trim: true },
  socialLinks: {
    facebook: { type: String, default: "" },
    instagram: { type: String, default: "" },
    twitter: { type: String, default: "" },
    whatsapp: { type: String, default: "" }
  }
}, { timestamps: true });

if (models && models.Settings) {
  delete (mongoose as any).models.Settings;
}

const Settings = models.Settings || model("Settings", SettingsSchema);
export default Settings;
