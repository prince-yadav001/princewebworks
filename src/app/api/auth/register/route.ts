// IMPORTANT: This is a placeholder API file.
// It uses the correct Next.js App Router format, but the logic inside
// is simulated because a database is not yet fully configured.

import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

// In-memory "database" for simulation purposes
const users: any[] = [];

export async function POST(req: Request) {
  try {
    const { name, username, email, password } = await req.json();

    // Check if user already exists in our simulated DB
    const existingUser = users.find((user) => user.email === email);
    if (existingUser) {
      return new Response(
        JSON.stringify({ message: "User with this email already exists." }),
        { status: 409 } // 409 Conflict
      );
    }

    // Simulate creating a new user
    const userId = `pww-${uuidv4()}`;
    const newUser = {
      id: userId,
      name,
      username,
      email,
      password, // In a real app, hash this!
      otp: Math.floor(100000 + Math.random() * 900000).toString(),
    };
    users.push(newUser);

    console.log("✅ User registration simulated for:", email);
    console.log(`🔑 Simulated OTP for ${email}: ${newUser.otp}`);

    // Return the new user's ID
    return NextResponse.json(
      {
        success: true,
        message: "Registration successful. Please verify your email.",
        userId: newUser.id, // Include the userId in the response
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return new Response(
      JSON.stringify({ message: "Internal Server Error" }),
      { status: 500 }
    );
  }
}