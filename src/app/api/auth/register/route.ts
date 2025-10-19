import { NextResponse } from "next/server";
import { randomUUID } from "crypto";

// Simulate a database of users
const users: { email: string; id: string }[] = [];

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    // Check if user already exists
    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
      return NextResponse.json(
        { message: "User with this email already exists." },
        { status: 409 } // 409 Conflict is a good status code for this
      );
    }
    
    // Simulate user creation and OTP generation
    const userId = randomUUID();
    users.push({ email, id: userId });

    console.log(`✅ User registration simulated for: ${email}`);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log(`🔑 Simulated OTP for ${email}: ${otp}`);

    return NextResponse.json({
      success: true,
      message: "Registration successful. Please check your email for the OTP.",
      redirect: `/${userId}/verify-email`,
    });
  } catch (error: any) {
    console.error("❌ Register API error:", error);
    return NextResponse.json(
      { message: "An error occurred during registration." },
      { status: 500 }
    );
  }
}
