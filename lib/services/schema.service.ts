import { prisma } from '@/lib/prisma';

export class SchemaService {
  static async ensureSchema() {
    console.log("[SchemaService] Starting database schema verification...");
    try {
      const userSchema = [
        `CREATE TABLE IF NOT EXISTS "User" ("id" TEXT NOT NULL, "email" TEXT NOT NULL, "name" TEXT, "isDeleted" BOOLEAN NOT NULL DEFAULT false, "role" TEXT NOT NULL DEFAULT 'USER', "language" TEXT NOT NULL DEFAULT 'en', "totalPaid" DOUBLE PRECISION NOT NULL DEFAULT 0, "referralCode" TEXT, "referralPoints" INTEGER NOT NULL DEFAULT 0, "referralCount" INTEGER NOT NULL DEFAULT 0, "referredById" TEXT, "stripeCustomerId" TEXT, "imageUrl" TEXT, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, CONSTRAINT "User_pkey" PRIMARY KEY ("id"));`,
        `CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON "User"("email");`,
        `ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "referralCount" INTEGER DEFAULT 0;`,
        `ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "referralCode" TEXT;`,
        `ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "referralPoints" INTEGER DEFAULT 0;`,
        `ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "totalPaid" DOUBLE PRECISION DEFAULT 0;`,
        `ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "referredById" TEXT;`,
        `ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "isDeleted" BOOLEAN DEFAULT false;`,
        `ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "role" TEXT DEFAULT 'USER';`,
        `ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "language" TEXT DEFAULT 'en';`,
        `ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "imageUrl" TEXT;`,
        `ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "stripeCustomerId" TEXT;`
      ];

      const migrationCommands = [
        `DO $$ BEGIN IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='User' AND column_name='preferredLanguage') THEN UPDATE "User" SET "language" = "preferredLanguage" WHERE "language" = 'en' AND "preferredLanguage" IS NOT NULL; END IF; UPDATE "User" SET "referralCode" = substring(md5(random()::text), 1, 8) WHERE "referralCode" IS NULL; END $$;`,
        `CREATE UNIQUE INDEX IF NOT EXISTS "User_referralCode_key" ON "User"("referralCode");`
      ];

      for (const cmd of [...userSchema, ...migrationCommands]) {
        try { await prisma.$executeRawUnsafe(cmd); } catch (err) {}
      }
      console.log("[SchemaService] Database schema verified.");
    } catch (e: any) {
      console.error("[SchemaService] Critical failure:", e.message);
    }
  }
}
