import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ message: "Email and password are required." }, { status: 400 });
    }

    // Find the user by email
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ message: "Invalid credentials." }, { status: 401 });
    }

    // Check if the user is verified
    if (!user.isVerified) {
        return NextResponse.json({ message: "Please verify your email before logging in." }, { status: 403 });
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json({ message: "Invalid credentials." }, { status: 401 });
    }

    console.log(`✅ Login successful for: ${email}`);

    // Exclude password from the returned user object
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json({ 
        success: true, 
        message: "Login successful",
        user: userWithoutPassword 
    });

  } catch (error) {
    console.error("❌ Login error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
