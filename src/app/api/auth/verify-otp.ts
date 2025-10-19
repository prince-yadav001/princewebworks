import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import sgMail from "@sendgrid/mail";

const prisma = new PrismaClient();
sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export async function POST(req: Request) {
  try {
    const { email, otp } = await req.json();

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 });

    if (user.otp !== otp)
      return NextResponse.json({ message: "Invalid OTP" }, { status: 400 });

    // ✅ Mark user as verified
    await prisma.user.update({
      where: { email },
      data: { isVerified: true, otp: null },
    });

    // ✅ Send notification to admin
    const adminMsg = {
      to: "pb6620113@gmail.com",
      from: {
        email: "noreply@yourdomain.com",
        name: "System Notification",
      },
      subject: "New User Verified ✅",
      html: `
        <p>User <strong>${user.name}</strong> (${user.email}) has verified their email.</p>
        <p>You can now review or approve them in the admin dashboard.</p>
      `,
    };

    await sgMail.send(adminMsg);

    return NextResponse.json({
      success: true,
      redirect: "/dashboard",
      message: "Email verified successfully",
    });
  } catch (error: any) {
    console.error("Verify OTP error:", error);
    return NextResponse.json({ message: "Verification failed" }, { status: 500 });
  }
}
