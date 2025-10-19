
import { NextResponse } from "next/server";
// SendGrid se judi samasyaon se bachne ke liye abhi isko comment kar rahe hain.
// import sgMail from "@sendgrid/mail";

// if (process.env.SENDGRID_API_KEY) {
//   sgMail.setApiKey(process.env.SENDGRID_API_KEY);
// }

// Next.js App Router ke liye API route
export async function POST(req: Request) {
  try {
    const { name, username, email, password } = await req.json();

    // Abhi ke liye, hum maan rahe hain ki user exist nahi karta.
    // Database logic yahan add kiya ja sakta hai.

    // Ek dummy OTP generate karein (asal project mein isse securely manage karein)
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Email bhejne ko simulate kar rahe hain
    console.log(`Simulating email sending to ${email} with OTP: ${otp}`);
    
    // if (process.env.SENDGRID_API_KEY && process.env.EMAIL_FROM) {
    //   const msg = {
    //     to: email,
    //     from: {
    //       email: process.env.EMAIL_FROM,
    //       name: "PrinceWebWork CRM",
    //     },
    //     subject: "Verify your email for PrinceWebWork CRM",
    //     html: `...`,
    //   };
    //   await sgMail.send(msg);
    // }

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
