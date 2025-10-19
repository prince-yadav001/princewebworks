import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { userId, otp } = await req.json();

    if (!userId || !otp) {
      return NextResponse.json({ message: "User ID and OTP are required" }, { status: 400 });
    }

    // Step 1: Find user by ID
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Step 2: Check OTP
    if (user.otp !== otp) {
      return NextResponse.json({ message: "Invalid OTP" }, { status: 401 });
    }

    // Step 3: Mark user as verified and clear OTP
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        isVerified: true,
        otp: null, // clear OTP after successful verification
      },
    });

    // Remove password from user object before sending it back
    const { password, ...userWithoutPassword } = updatedUser;

    return NextResponse.json({ 
        success: true, 
        message: "Email verified successfully!",
        user: userWithoutPassword 
    });
  } catch (error) {
    console.error("❌ OTP verification error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
