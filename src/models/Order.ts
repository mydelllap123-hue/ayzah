import mongoose, { Schema, model, models } from "mongoose";

const OrderSchema = new Schema({
  customerInfo: {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    pincode: { type: String, required: true },
  },
  items: [{
    productId: { type: Schema.Types.ObjectId, ref: "Product" },
    title: String,
    price: Number,
    quantity: Number,
    image: String
  }],
  totalAmount: { type: Number, required: true },
  subtotal: { type: Number, required: true },
  deliveryCharge: { type: Number, default: 0 },
  paymentMethod: { 
    type: String, 
    enum: ["cod", "online"], 
    required: true 
  },
  status: { 
    type: String, 
    enum: ["ordered", "processing", "shipped", "delivered", "cancelled"],
    default: "ordered"
  },
  paymentStatus: { 
    type: String, 
    enum: ["pending", "paid", "failed"],
    default: "pending"
  },
  orderId: { type: String }, // For Razorpay
  paymentId: { type: String }, // For Razorpay
}, { timestamps: true });

const Order = models.Order || model("Order", OrderSchema);
export default Order;
