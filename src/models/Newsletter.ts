import mongoose, { Schema, model, models } from "mongoose";

const NewsletterSchema = new Schema({
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "Please fill a valid email address"],
  },
  subscribedAt: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ["active", "unsubscribed"],
    default: "active",
  }
}, { timestamps: true });

const Newsletter = models.Newsletter || model("Newsletter", NewsletterSchema);

export default Newsletter;
