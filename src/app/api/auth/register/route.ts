import { NextResponse } from "next/server";
import { randomUUID } from "crypto";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    // Simulate user creation and OTP generation
    console.log(`✅ User registration simulated for: ${email}`);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log(`🔑 Simulated OTP for ${email}: ${otp}`);

    // Generate a unique user ID for the verification link
    const userId = randomUUID();

    return NextResponse.json({
      success: true,
      message: "Registration successful. Please check your email for the OTP.",
      redirect: `/id/${userId}/verify-email`,
    });
  } catch (error: any) {
    console.error("❌ Register API error:", error);
    return NextResponse.json(
      { message: "An error occurred during registration." },
      { status: 500 }
    );
  }
}
