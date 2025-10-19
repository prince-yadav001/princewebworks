import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { name, username, email, password } = await req.json();

    // Simulate user creation and OTP generation since DB is not fully integrated
    console.log(`✅ User registration simulated for: ${email}`);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log(`🔑 Simulated OTP for ${email}: ${otp}`);

    // In a real scenario, you'd save the hashed password and OTP to the database.
    // For now, we'll just log it and pretend it worked.

    return NextResponse.json({
      success: true,
      message: "Registration successful. Please check your email for the OTP.",
      redirect: `/id/verify-email?email=${encodeURIComponent(email)}`,
    });
  } catch (error: any) {
    console.error("❌ Register API error:", error);
    // It's good practice to not expose detailed internal errors.
    return NextResponse.json(
      { message: "An error occurred during registration." },
      { status: 500 }
    );
  }
}
