import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { name, username, email, password } = await req.json();

    if (!name || !username || !email || !password) {
      return NextResponse.json(
        { message: "All fields are required." },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "User with this email already exists." },
        { status: 409 } // Conflict
      );
    }

    // Hash password for security
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate user ID and OTP
    const userId = `pww-${uuidv4()}`;
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Save user to database
    const newUser = await prisma.user.create({
      data: {
        id: userId,
        name,
        username,
        email,
        password: hashedPassword,
        otp,
        isVerified: false, // default false until email verified
      },
    });

    console.log("✅ User saved:", newUser.email);
    console.log(`🔑 OTP for ${email}: ${otp}`);

    return NextResponse.json(
      {
        success: true,
        message: "Registration successful. Please verify your email.",
        userId: newUser.id,
        redirect: `/id/verify-email?email=${encodeURIComponent(email)}`,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("❌ Registration error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
