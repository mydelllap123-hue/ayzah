import mongoose, { Schema, model, models } from "mongoose";

const ProductSchema = new Schema({
  name: { type: String, required: true, trim: true },
  title: { type: String, trim: true },
  slug: { type: String, required: true, unique: true, index: true, trim: true },
  description: { type: String, default: "", trim: true },
  category: { type: String, required: true, index: true },
  categorySlug: { type: String, index: true },
  images: [{ type: String, default: [] }],
  price: { type: Number, required: true, default: 0 },
  offerPrice: { type: Number, default: 0 },
  stock: { type: Number, default: 0 },
  weight: { type: String, default: "250g" },
  featured: { type: Boolean, default: false },
  forceBestseller: { type: Boolean, default: false },
  status: { type: String, default: "active", enum: ["active", "draft", "archived"] },
  ratings: { type: Number, default: 4.8 },
  reviews: { type: Number, default: 0 }
}, { timestamps: true });

// Prevent model re-definition errors
if (models && models.Product) {
  delete (mongoose as any).models.Product;
}

const Product = models.Product || model("Product", ProductSchema, "products");
export default Product;
