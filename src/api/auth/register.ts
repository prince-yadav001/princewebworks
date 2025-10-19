
import { NextResponse } from "next/server";
import sgMail from "@sendgrid/mail";

// SendGrid API key ko environment variables se set karein
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

// Next.js App Router ke liye API route
export async function POST(req: Request) {
  try {
    const { name, username, email, password } = await req.json();

    // Abhi ke liye, hum maan rahe hain ki user exist nahi karta.
    // Database logic yahan add kiya ja sakta hai.

    // Ek dummy OTP generate karein (asal project mein isse securely manage karein)
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Agar SendGrid API key hai, to OTP email bhejein
    if (process.env.SENDGRID_API_KEY && process.env.EMAIL_FROM) {
      const msg = {
        to: email,
        from: {
          email: process.env.EMAIL_FROM, // Yeh ek verified email hona chahiye
          name: "PrinceWebWork CRM",
        },
        subject: "Verify your email for PrinceWebWork CRM",
        html: `
          <div style="font-family:Arial,sans-serif;line-height:1.6;">
            <h2>Welcome, ${name}!</h2>
            <p>Your One-Time Password (OTP) to verify your email is:</p>
            <h3 style="color:#4CAF50;">${otp}</h3>
            <p>This code is valid for 10 minutes.</p>
            <p>In a real app, we would save this OTP to verify it later.</p>
          </div>
        `,
      };
      await sgMail.send(msg);
    } else {
        console.log(`Simulating email sending to ${email} with OTP: ${otp}`);
    }


    // Frontend ko success response aur redirect URL bhejein
    return NextResponse.json({
      success: true,
      message: "Registration successful. Please check your email for the OTP.",
      // User ko OTP verification page par redirect karein
      redirect: `/id/verify-email?email=${encodeURIComponent(email)}`,
    });

  } catch (error: any) {
    console.error("Register API error:", error);
    return NextResponse.json({ message: "Error registering user" }, { status: 500 });
  }
}
