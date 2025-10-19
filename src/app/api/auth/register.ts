import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { name, username, email, password } = await req.json();

    // Basic validation
    if (!name || !username || !email || !password) {
      return NextResponse.json(
        { message: "All fields are required." },
        { status: 400 }
      );
    }
    
    // Simulate user creation and OTP sending since no DB is connected
    console.log(`Simulating registration for user: ${name} (${email})`);
    console.log(`Username: ${username}, Password: [REDACTED]`);

    // Simulate sending an OTP for verification
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log(`Simulating OTP email to ${email} with OTP: ${otp}`);

    // Return a success response to the frontend
    return NextResponse.json({
      success: true,
      message: "Registration successful. Please check your email for the OTP.",
      // Provide a redirect path for the frontend
      redirect: `/id/verify-email?email=${encodeURIComponent(email)}`,
    });

  } catch (error: any) {
    console.error("Register API error:", error);
    return NextResponse.json(
      { message: "Error registering user", error: error.message },
      { status: 500 }
    );
  }
}
