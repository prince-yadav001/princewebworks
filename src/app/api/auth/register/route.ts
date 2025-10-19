import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcryptjs";
import sgMail from "@sendgrid/mail";

const prisma = new PrismaClient();

if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY!);
} else {
    console.warn("SENDGRID_API_KEY not set. Email will not be sent.");
}

export async function POST(req: Request) {
  try {
    const { name, username, email, password } = await req.json();

    if (!name || !username || !email || !password) {
      return NextResponse.json({ message: "All fields are required." }, { status: 400 });
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ message: "User with this email already exists." }, { status: 409 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate user ID and OTP
    const userId = `pww-${uuidv4()}`;
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Save user in database
    const newUser = await prisma.user.create({
      data: {
        id: userId,
        name,
        username,
        email,
        password: hashedPassword,
        otp,
        isVerified: false,
      },
    });

    console.log(`✅ User saved: ${email}`);
    console.log(`🔑 OTP for ${email}: ${otp}`);

    // ✉️ Send OTP via SendGrid
    if (process.env.SENDGRID_API_KEY && process.env.EMAIL_FROM) {
      const msg = {
        to: email,
        from: {
          email: process.env.EMAIL_FROM!,
          name: "PrinceWebWork CRM",
        },
        subject: `Your Verification Code for PrinceWebWork CRM`,
        html: `
          <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f5f5f5; margin: 0; padding: 0; -webkit-font-smoothing: antialiased;">
            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f5f5f5;">
              <tr>
                <td align="center" style="padding: 20px 0;">
                  <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
                    <!-- Header -->
                    <tr>
                      <td align="center" style="padding: 40px 20px; border-bottom: 1px solid #eeeeee;">
                        <h1 style="color: #333333; font-size: 24px; font-weight: 600; margin: 0;">PrinceWebWork CRM</h1>
                      </td>
                    </tr>
                    <!-- Body -->
                    <tr>
                      <td style="padding: 40px 30px;">
                        <h2 style="color: #333333; font-size: 20px; font-weight: 500; margin-top: 0; margin-bottom: 20px;">Hi ${name},</h2>
                        <p style="color: #555555; font-size: 16px; line-height: 1.6; margin: 0 0 20px;">
                          Thank you for signing up. Please use the following One-Time Password (OTP) to verify your email address:
                        </p>
                        <div align="center" style="margin-bottom: 30px;">
                          <span style="background-color: #e9efff; border-radius: 8px; color: #1a73e8; display: inline-block; font-size: 28px; font-weight: bold; letter-spacing: 4px; padding: 15px 30px;">
                            ${otp}
                          </span>
                        </div>
                        <p style="color: #555555; font-size: 16px; line-height: 1.6; margin: 0 0 20px;">
                          This code is valid for 10 minutes. If you did not request this, you can safely ignore this email.
                        </p>
                      </td>
                    </tr>
                    <!-- Footer -->
                    <tr>
                      <td align="center" style="padding: 20px 30px; background-color: #f9f9f9; border-top: 1px solid #eeeeee;">
                        <p style="color: #999999; font-size: 12px; margin: 0;">
                          &copy; ${new Date().getFullYear()} PrinceWebWork CRM. All rights reserved.
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </div>
        `,
      };

      try {
        await sgMail.send(msg);
        console.log(`📧 OTP email sent to ${email}`);
      } catch (emailError) {
        console.error("❌ SendGrid email error:", emailError);
        // We still return success to the user, as the user is created.
        // Email failure can be handled separately (e.g., offer resend).
      }
    }


    return NextResponse.json(
      {
        success: true,
        message: "Registration successful. Please check your email for OTP.",
        userId: newUser.id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("❌ Registration error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
