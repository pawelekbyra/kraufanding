import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function fix() {
  const commands = [
    `ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "referralCount" INTEGER DEFAULT 0;`,
    `ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "referralCode" TEXT;`,
    `ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "referralPoints" INTEGER DEFAULT 0;`,
    `ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "totalPaid" DOUBLE PRECISION DEFAULT 0;`,
    `ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "referredById" TEXT;`,
    `ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "isDeleted" BOOLEAN DEFAULT false;`,
    `ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "language" TEXT DEFAULT 'en';`,
    `DO $$ BEGIN IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='User' AND column_name='preferredLanguage') THEN UPDATE "User" SET "language" = "preferredLanguage" WHERE "language" = 'en' AND "preferredLanguage" IS NOT NULL; END IF; UPDATE "User" SET "referralCode" = substring(md5(random()::text), 1, 8) WHERE "referralCode" IS NULL; END $$;`,
    `CREATE UNIQUE INDEX IF NOT EXISTS "User_referralCode_key" ON "User"("referralCode");`
  ];
  for (const cmd of commands) { try { await prisma.$executeRawUnsafe(cmd); } catch (err) {} }
  await prisma.$disconnect();
}
fix();
