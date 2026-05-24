import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Newsletter from "@/models/Newsletter";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    // 1. Basic Validation
    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    // Email regex validation
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Please provide a valid email address" },
        { status: 400 }
      );
    }

    // 2. Connect to Database
    await connectDB();

    // 3. Check for existing subscription
    const existingSubscriber = await Newsletter.findOne({ email: email.toLowerCase() });
    
    if (existingSubscriber) {
      if (existingSubscriber.status === "active") {
        return NextResponse.json(
          { error: "This email is already subscribed!" },
          { status: 409 }
        );
      } else {
        // Re-activate if they previously unsubscribed
        existingSubscriber.status = "active";
        existingSubscriber.subscribedAt = new Date();
        await existingSubscriber.save();
        
        return NextResponse.json(
          { message: "Welcome back! Subscription re-activated." },
          { status: 200 }
        );
      }
    }

    // 4. Create new subscriber
    await Newsletter.create({
      email: email.toLowerCase(),
      subscribedAt: new Date(),
    });

    return NextResponse.json(
      { message: "Successfully subscribed to our newsletter!" },
      { status: 201 }
    );

  } catch (error: any) {
    console.error("Newsletter API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error. Please try again later." },
      { status: 500 }
    );
  }
}
