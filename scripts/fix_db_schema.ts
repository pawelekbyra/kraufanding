import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function fix() {
  console.log("--- MANUAL DB SCHEMA FIX START ---");
  const commands = [
    `ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "referralCount" INTEGER DEFAULT 0;`,
    `ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "referralCode" TEXT;`,
    `ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "referralPoints" INTEGER DEFAULT 0;`,
    `ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "totalPaid" DOUBLE PRECISION DEFAULT 0;`,
    `ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "referredById" TEXT;`,
    `ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "isDeleted" BOOLEAN DEFAULT false;`,
    `ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "language" TEXT DEFAULT 'en';`,
    `UPDATE "User" SET "language" = "preferredLanguage" WHERE "preferredLanguage" IS NOT NULL AND "language" = 'en';`,
    `ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "role" TEXT DEFAULT 'USER';`,
    `ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "imageUrl" TEXT;`,
    `ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "stripeCustomerId" TEXT;`,
  ];

  for (const cmd of commands) {
    try {
      console.log(`Executing: ${cmd}`);
      await prisma.$executeRawUnsafe(cmd);
      console.log("Success.");
    } catch (err: any) {
      if (err.message?.includes("already exists")) {
        console.log("Column already exists, skipping.");
      } else {
        console.error("Error executing command:", err.message);
      }
    }
  }

  console.log("--- MANUAL DB SCHEMA FIX END ---");
  await prisma.$disconnect();
}

fix();
