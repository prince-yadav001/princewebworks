
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Let's seed some jobs if none exist
    const jobCount = await prisma.job.count();
    if (jobCount === 0) {
      await prisma.job.createMany({
        data: [
          {
            title: "Senior Frontend Developer",
            department: "Engineering",
            description: "Responsible for building and maintaining our user-facing applications. Must have experience with React and Next.js.",
            location: "Remote",
            type: "Full-time",
          },
          {
            title: "Product Manager",
            department: "Product",
            description: "Define product strategy, roadmap, and feature requirements. Work closely with engineering and design teams.",
            location: "New York, NY",
            type: "Full-time",
          },
          {
            title: "UI/UX Designer",
            department: "Design",
            description: "Create beautiful and intuitive user interfaces. A strong portfolio is required.",
            location: "Remote",
            type: "Contract",
          },
        ],
      });
    }

    const jobs = await prisma.job.findMany({
        orderBy: {
            createdAt: 'desc'
        }
    });
    return NextResponse.json(jobs);
  } catch (error) {
    console.error("Failed to fetch jobs:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  } finally {
      await prisma.$disconnect();
  }
}
