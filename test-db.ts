import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function test() {
  try {
    const users = await prisma.user.findMany();
    console.log("✅ Connected successfully!");
    console.log("Users:", users);
  } catch (err) {
    console.error("❌ Error connecting to database:", err);
  } finally {
    await prisma.$disconnect();
  }
}

test();
