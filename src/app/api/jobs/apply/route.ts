
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import sgMail from "@sendgrid/mail";

const prisma = new PrismaClient();

if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY!);
} else {
    console.warn("SENDGRID_API_KEY not set. Email will not be sent.");
}

export async function POST(req: Request) {
  try {
    const { userId, jobId } = await req.json();

    if (!userId || !jobId) {
      return NextResponse.json({ message: "User ID and Job ID are required" }, { status: 400 });
    }

    // Check if the user has already applied for this job
    const existingApplication = await prisma.jobApplication.findUnique({
      where: {
        userId_jobId: {
          userId,
          jobId,
        },
      },
    });

    if (existingApplication) {
      return NextResponse.json({ message: "You have already applied for this job" }, { status: 409 });
    }

    // Create the new application
    const newApplication = await prisma.jobApplication.create({
      data: {
        userId,
        jobId,
      },
      include: {
        user: true,
        job: true,
      }
    });

    // Send confirmation email
    if (process.env.SENDGRID_API_KEY && process.env.EMAIL_FROM) {
      const msg = {
        to: newApplication.user.email,
        from: {
          email: process.env.EMAIL_FROM!,
          name: "PrinceWebWork Careers",
        },
        subject: `Your Application for ${newApplication.job.title} has been received`,
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6;">
            <h2>Hi ${newApplication.user.name},</h2>
            <p>Thank you for applying for the <strong>${newApplication.job.title}</strong> position at PrinceWebWork.</p>
            <p>We have received your application and our hiring team will review it shortly. If your profile matches our requirements, we will get in touch with you for the next steps.</p>
            <p>You can track the status of your application in your dashboard.</p>
            <br>
            <p>Best regards,</p>
            <p>The PrinceWebWork Team</p>
          </div>
        `,
      };
      await sgMail.send(msg);
    }

    return NextResponse.json({ success: true, message: "Application submitted successfully", application: newApplication }, { status: 201 });

  } catch (error) {
    console.error("Failed to process application:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  } finally {
      await prisma.$disconnect();
  }
}
