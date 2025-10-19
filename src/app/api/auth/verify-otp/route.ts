import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { userId, otp } = await req.json();

    if (!userId || !otp) {
      return NextResponse.json(
        { message: "User ID and OTP are required." },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    if (user.otp !== otp) {
      return NextResponse.json({ message: "Invalid or expired OTP." }, { status: 400 });
    }

    // Mark user as verified and clear OTP
    await prisma.user.update({
      where: { id: userId },
      data: { isVerified: true, otp: null },
    });

    // In a real app, you would generate a JWT token here and send it back
    // For now, we'll just confirm success
    return NextResponse.json(
      {
        success: true,
        message: "Email verified successfully.",
        user: { id: user.id, name: user.name, email: user.email },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Verification error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
