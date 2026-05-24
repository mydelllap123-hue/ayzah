import mongoose, { Schema, model, models } from "mongoose";

const UserSchema = new Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
  },
  email: {
    type: String,
    unique: true,
    required: [true, "Email is required"],
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "Please fill a valid email address"],
  },
  password: {
    type: String,
    required: false,
    select: false, // Don't return password by default
  },
  image: {
    type: String,
  },
  role: {
    type: String,
    default: "user",
  },
  provider: {
    type: String,
    default: "credentials",
  },
}, { timestamps: true });

const User = models.User || model("User", UserSchema, "users");

export default User;
