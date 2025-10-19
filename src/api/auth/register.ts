import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import crypto from "crypto";
import sgMail from "@sendgrid/mail";

const prisma = new PrismaClient();
sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export async function POST(req: Request) {
  try {
    const { name, username, email, password } = await req.json();

    // ✅ Check if user already exists
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ message: "Email already registered" }, { status: 400 });
    }

    // ✅ Generate custom user ID (e.g. pww-xxxxx)
    const userId = "pww-" + crypto.randomBytes(16).toString("hex");

    // ✅ Generate OTP (6-digit)
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // ✅ Create user in DB
    const user = await prisma.user.create({
      data: {
        id: userId,
        name,
        username,
        email,
        password, // (hash karna mat bhoolna real project me)
        otp,
        isVerified: false,
      },
    });

    // ✅ Send OTP via SendGrid
    const msg = {
      to: email,
      from: {
        email: "noreply@yourdomain.com", // ⚠️ yah address verified hona chahiye SendGrid me
        name: "Project Portal",
      },
      subject: "Verify your email address",
      html: `
        <div style="font-family:Arial,sans-serif;line-height:1.6;">
          <h2>Welcome, ${name}!</h2>
          <p>Use the following OTP to verify your email:</p>
          <h3 style="color:#4CAF50;">${otp}</h3>
          <p>This code will expire in 10 minutes.</p>
        </div>
      `,
    };

    await sgMail.send(msg);

    // ✅ Return redirect to verify-email page
    return NextResponse.json({
      success: true,
      redirect: `/id/verify-email?email=${encodeURIComponent(email)}`,
    });
  } catch (error: any) {
    console.error("Register error:", error);
    return NextResponse.json({ message: "Error registering user" }, { status: 500 });
  }
}
