import mongoose from "mongoose";

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable inside .env.local");
}

let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000, // Timeout after 5s
    };

    console.log("⏳ Connecting to MongoDB...");

    cached.promise = mongoose.connect(MONGODB_URI!, opts)
      .then((mongoose) => {
        console.log("✅ MongoDB Connected Successfully");
        return mongoose;
      })
      .catch((error) => {
        console.error("❌ MongoDB Connection Error:");
        
        if (error.message.includes("ECONNREFUSED")) {
          console.error("   CAUSE: Connection refused. Check if your IP is whitelisted in MongoDB Atlas.");
        } else if (error.message.includes("querySrv")) {
          console.error("   CAUSE: DNS/SRV Error. Check if your MONGODB_URI string is correctly formatted.");
        } else if (error.message.includes("Authentication failed")) {
          console.error("   CAUSE: Invalid Username or Password in connection string.");
        } else {
          console.error(`   ${error.message}`);
        }
        
        cached.promise = null; // Reset promise so we can try again
        throw error;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectDB;
