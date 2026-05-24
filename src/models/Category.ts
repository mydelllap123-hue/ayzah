import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    description: {
      type: String,
      default: "",
    },

    thumbnail: {
      type: String,
      default: "",
    },

    banner: {
      type: String,
      default: "",
    },

    featured: {
      type: Boolean,
      default: false,
    },

    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],

    linkedProducts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Prevent Next.js model re-definition issues in development
if (mongoose.models && mongoose.models.Category) {
  delete (mongoose as any).models.Category;
}

export default mongoose.models.Category ||
  mongoose.model("Category", CategorySchema, "categories");
