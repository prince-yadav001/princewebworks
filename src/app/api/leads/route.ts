import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET all leads
export async function GET() {
  try {
    const leads = await prisma.lead.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        assignedTo: {
          select: { name: true }, // Select only the name of the assigned user
        },
      },
    });
    return NextResponse.json(leads);
  } catch (error) {
    console.error("Failed to fetch leads:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// POST a new lead
export async function POST(req: Request) {
  try {
    const { name, email, phone, assignedToId } = await req.json();

    if (!name || !email) {
      return NextResponse.json(
        { message: "Name and email are required" },
        { status: 400 }
      );
    }

    // Check if lead with this email already exists
    const existingLead = await prisma.lead.findUnique({
      where: { email },
    });

    if (existingLead) {
      return NextResponse.json(
        { message: "A lead with this email already exists" },
        { status: 409 }
      );
    }
    
    // Check if assigned user exists only if assignedToId is provided
    if (assignedToId) {
        const userExists = await prisma.user.findUnique({ where: { id: assignedToId } });
        if (!userExists) {
            return NextResponse.json({ message: "Assigned user not found" }, { status: 404 });
        }
    }

    const newLead = await prisma.lead.create({
      data: {
        name,
        email,
        phone,
        assignedToId,
      },
    });

    return NextResponse.json(
      { success: true, message: "Lead created successfully", lead: newLead },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to create lead:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
