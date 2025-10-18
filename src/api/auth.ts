import sgMail from "@sendgrid/mail";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { db } from "@/lib/db"; // apna PostgreSQL connector ya Prisma instance

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export async function registerUser(req, res) {
  try {
    const { name, email, password } = req.body;

    // check if user exists
    const existing = await db.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(400).json({ message: "User already exists" });
    }

    // hash password
    const hashed = await bcrypt.hash(password, 10);

    // save user in DB
    const user = await db.user.create({
      data: { name, email, password: hashed },
    });

    // generate token
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, { expiresIn: "7d" });

    // send welcome email
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
          <a href="${process.env.NEXT_PUBLIC_BASE_URL}/login" 
             style="padding:10px 20px;background:#007bff;color:white;text-decoration:none;border-radius:5px;">
             Login Now
          </a>
        </div>
      `,
    });

    res.status(201).json({ message: "User registered and email sent", token });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
}
