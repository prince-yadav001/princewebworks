import { NextResponse } from "next/server";
import sgMail from "@sendgrid/mail";
import { prisma } from "@/lib/prisma";

if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY!);
} else {
    console.warn("SENDGRID_API_KEY not set. Email will not be sent.");
}

export async function POST(req: Request) {
  try {
    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json({ message: "User ID is required." }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      return NextResponse.json({ message: "User not found." }, { status: 404 });
    }
    
    // User is already verified
    if (user.isVerified) {
        return NextResponse.json({ message: "User is already verified." }, { status: 400 });
    }

    // Generate a new OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Update user with the new OTP
    await prisma.user.update({
        where: { id: userId },
        data: { otp },
    });

    console.log(`🔑 Resent OTP for ${user.email}: ${otp}`);

    // Send the new OTP via SendGrid
    if (process.env.SENDGRID_API_KEY && process.env.EMAIL_FROM) {
        const msg = {
          to: user.email,
          from: {
            email: process.env.EMAIL_FROM!,
            name: "PrinceWebWork CRM"
          },
          subject: `Your New Verification Code for PrinceWebWork CRM`,
          html: `
            <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f5f5f5; margin: 0; padding: 0;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f5f5f5;">
                <tr><td align="center" style="padding: 20px 0;">
                  <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
                    <tr><td align="center" style="padding: 40px 20px; border-bottom: 1px solid #eeeeee;"><h1 style="color: #333333; font-size: 24px; font-weight: 600; margin: 0;">PrinceWebWork CRM</h1></td></tr>
                    <tr><td style="padding: 40px 30px;">
                        <h2 style="color: #333333; font-size: 20px; font-weight: 500; margin-top: 0; margin-bottom: 20px;">Hi ${user.name},</h2>
                        <p style="color: #555555; font-size: 16px; line-height: 1.6; margin: 0 0 20px;">Here is your new verification code:</p>
                        <div align="center" style="margin-bottom: 30px;">
                          <span style="background-color: #e9efff; border-radius: 8px; color: #1a73e8; display: inline-block; font-size: 28px; font-weight: bold; letter-spacing: 4px; padding: 15px 30px;">${otp}</span>
                        </div>
                        <p style="color: #555555; font-size: 16px; line-height: 1.6; margin: 0 0 20px;">This code is valid for 10 minutes. If you did not request this, you can ignore this email.</p>
                    </td></tr>
                    <tr><td align="center" style="padding: 20px 30px; background-color: #f9f9f9; border-top: 1px solid #eeeeee;"><p style="color: #999999; font-size: 12px; margin: 0;">&copy; ${new Date().getFullYear()} PrinceWebWork CRM. All rights reserved.</p></td></tr>
                  </table>
                </td></tr>
              </table>
            </div>
          `,
        };
  
        try {
          await sgMail.send(msg);
          console.log(`📧 New OTP email sent to ${user.email}`);
        } catch (emailError) {
          console.error("❌ SendGrid email error:", emailError);
        }
      }

    return NextResponse.json({ message: "A new verification code has been sent to your email." }, { status: 200 });

  } catch (error) {
    console.error("❌ Resend OTP error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
