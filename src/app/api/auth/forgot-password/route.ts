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
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ message: "Email is required." }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      // Don't reveal if a user doesn't exist for security reasons
      return NextResponse.json({ message: "If a user with that email exists, a reset link has been sent." }, { status: 200 });
    }

    const resetLink = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:9002'}/${user.id}/reset-password`;

    // ✉️ Send Reset Link via SendGrid
    if (process.env.SENDGRID_API_KEY && process.env.EMAIL_FROM) {
      const msg = {
        to: email,
        from: {
          email: process.env.EMAIL_FROM!,
          name: "PrinceWebWork CRM",
        },
        subject: "Your Password Reset Link for PrinceWebWork CRM",
        html: `
          <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f5f5f5; margin: 0; padding: 0;">
            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f5f5f5;">
              <tr>
                <td align="center" style="padding: 20px 0;">
                  <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
                    <tr><td align="center" style="padding: 40px 20px; border-bottom: 1px solid #eeeeee;"><h1 style="color: #333333; font-size: 24px; font-weight: 600; margin: 0;">PrinceWebWork CRM</h1></td></tr>
                    <tr><td style="padding: 40px 30px;">
                        <h2 style="color: #333333; font-size: 20px; font-weight: 500; margin-top: 0; margin-bottom: 20px;">Hi ${user.name},</h2>
                        <p style="color: #555555; font-size: 16px; line-height: 1.6; margin: 0 0 20px;">You requested a password reset. Click the button below to set a new password:</p>
                        <div align="center" style="margin-bottom: 30px;">
                          <a href="${resetLink}" style="background-color: #1a73e8; border-radius: 8px; color: #ffffff; display: inline-block; font-size: 16px; font-weight: bold; padding: 15px 30px; text-decoration: none;">Reset Your Password</a>
                        </div>
                        <p style="color: #555555; font-size: 16px; line-height: 1.6; margin: 0 0 20px;">If you did not request this, you can safely ignore this email.</p>
                    </td></tr>
                    <tr><td align="center" style="padding: 20px 30px; background-color: #f9f9f9; border-top: 1px solid #eeeeee;"><p style="color: #999999; font-size: 12px; margin: 0;">&copy; ${new Date().getFullYear()} PrinceWebWork CRM. All rights reserved.</p></td></tr>
                  </table>
                </td>
              </tr>
            </table>
          </div>
        `,
      };

      try {
        await sgMail.send(msg);
        console.log(`📧 Password reset email sent to ${email}`);
      } catch (emailError) {
        console.error("❌ SendGrid email error:", emailError);
      }
    } else {
        console.log(`🔑 Simulated Password Reset Link for ${email}: ${resetLink}`)
    }

    return NextResponse.json({ message: "Password reset link sent." }, { status: 200 });

  } catch (error) {
    console.error("❌ Forgot password error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
