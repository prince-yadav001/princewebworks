import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { name, username, email, password } = await req.json();

    // Check if user already exists
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return new Response(JSON.stringify({ message: "User already exists" }), { status: 400 });
    }

    // Create new user
    const user = await prisma.user.create({
      data: { name, username, email, password },
    });

    console.log("✅ New user created:", user);

    return new Response(
      JSON.stringify({
        success: true,
        message: "Registration successful",
        redirect: `/id/verify-email?email=${encodeURIComponent(email)}`,
      }),
      { status: 200 }
    );
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ message: "Internal Server Error" }), { status: 500 });
  }
}
