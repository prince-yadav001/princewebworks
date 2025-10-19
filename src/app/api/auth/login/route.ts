import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import sgMail from "@sendgrid/mail";
import { prisma } from "@/lib/prisma";

if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY!);
} else {
    console.warn("SENDGRID_API_KEY not set. Email will not be sent.");
}

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

    // Update last login time
    const updatedUser = await prisma.user.update({
        where: { email },
        data: { lastLogin: new Date() },
    });

    console.log(`✅ Login successful for: ${email}`);

    // ✉️ Send Login Notification via SendGrid
    if (process.env.SENDGRID_API_KEY && process.env.EMAIL_FROM) {
        const msg = {
          to: email,
          from: {
            email: process.env.EMAIL_FROM!,
            name: "PrinceWebWork CRM Security",
          },
          subject: "Security Alert: New Login to Your Account",
          html: `
            <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f5f5f5; margin: 0; padding: 0;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f5f5f5;">
                <tr>
                  <td align="center" style="padding: 20px 0;">
                    <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
                      <tr><td align="center" style="padding: 40px 20px; border-bottom: 1px solid #eeeeee;"><h1 style="color: #333333; font-size: 24px; font-weight: 600; margin: 0;">PrinceWebWork CRM</h1></td></tr>
                      <tr><td style="padding: 40px 30px;">
                          <h2 style="color: #333333; font-size: 20px; font-weight: 500; margin-top: 0; margin-bottom: 20px;">Hi ${user.name},</h2>
                          <p style="color: #555555; font-size: 16px; line-height: 1.6; margin: 0 0 20px;">We're writing to let you know that there was a recent login to your account. If this was you, you can safely disregard this email.</p>
                          <p style="color: #555555; font-size: 16px; line-height: 1.6; margin: 0 0 20px;">If you don't recognize this activity, please reset your password immediately to secure your account.</p>
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
          console.log(`📧 Login notification email sent to ${email}`);
        } catch (emailError) {
          console.error("❌ SendGrid email error:", emailError);
        }
      }

    // Exclude password from the returned user object
    const { password: _, ...userWithoutPassword } = updatedUser;

    return NextResponse.json({ 
        success: true, 
        message: "Login successful",
        user: userWithoutPassword 
    });

  } catch (error) {
    console.error("❌ Login error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
