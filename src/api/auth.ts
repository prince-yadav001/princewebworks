// IMPORTANT: This is a placeholder API file.
// It uses the correct Next.js App Router format, but the logic inside
// (like user creation and database checks) is commented out because
// a database is not yet configured in this project.

import {NextRequest, NextResponse} from 'next/server';
import sgMail from '@sendgrid/mail';
import jwt from 'jsonwebtoken';

// This is commented out as there is no db configured.
// import { db } from "@/lib/db";

if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

// This function is intended to be used in a route handler, e.g., src/app/api/auth/register/route.ts
export async function registerUser(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();

    // --- Database logic is commented out ---
    /*
    // check if user exists
    const existing = await db.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ message: "User already exists" }, { status: 400 });
    }

    // hash password
    const hashed = await bcrypt.hash(password, 10);

    // save user in DB
    const user = await db.user.create({
      data: { name, email, password: hashed },
    });

    // generate token
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, { expiresIn: "7d" });
    */

    // Placeholder response since DB is not connected
    const user = { id: '123', name, email };
    const token = 'placeholder-jwt-token';


    // send welcome email if SendGrid key is available
    if (process.env.SENDGRID_API_KEY && process.env.EMAIL_FROM) {
        await sgMail.send({
            to: email,
            from: process.env.EMAIL_FROM!,
            subject: `Welcome to PrinceWebWork CRM, ${name}!`,
            html: `
              <div style="font-family:sans-serif;">
                <h2>Welcome ${name} 👋</h2>
                <p>Thank you for registering with <strong>PrinceWebWork CRM</strong>.</p>
                <p>You can now log in and start managing your clients efficiently.</p>
                <br/>
                <a href="${process.env.NEXT_PUBLIC_BASE_URL || ''}/login"
                   style="padding:10px 20px;background:#007bff;color:white;text-decoration:none;border-radius:5px;">
                   Login Now
                </a>
              </div>
            `,
          });
    }


    return NextResponse.json({ message: "User registered and email sent", token }, { status: 201 });

  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
  }
}
