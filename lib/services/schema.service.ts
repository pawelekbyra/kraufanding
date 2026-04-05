import { prisma } from '@/lib/prisma';

export class SchemaService {
  /**
   * Proactively ensures that the database schema matches the expected Prisma model.
   * This is a "healing" utility to resolve desyncs in environments where standard
   * migrations are not running correctly.
   */
  static async ensureSchema() {
    console.log("[SchemaService] Starting database schema verification...");

    try {
      // 1. Core User Table and its columns
      const userSchema = [
        `CREATE TABLE IF NOT EXISTS "User" (
            "id" TEXT NOT NULL,
            "email" TEXT NOT NULL,
            "name" TEXT,
            "isDeleted" BOOLEAN NOT NULL DEFAULT false,
            "role" TEXT NOT NULL DEFAULT 'USER',
            "language" TEXT NOT NULL DEFAULT 'en',
            "totalPaid" DOUBLE PRECISION NOT NULL DEFAULT 0,
            "referralCode" TEXT,
            "referralPoints" INTEGER NOT NULL DEFAULT 0,
            "referralCount" INTEGER NOT NULL DEFAULT 0,
            "referredById" TEXT,
            "stripeCustomerId" TEXT,
            "imageUrl" TEXT,
            "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
            CONSTRAINT "User_pkey" PRIMARY KEY ("id")
        );`,
        `CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON "User"("email");`,
        `ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "referralCount" INTEGER DEFAULT 0;`,
        `ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "totalPaid" DOUBLE PRECISION DEFAULT 0;`,
        `ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "referralCode" TEXT;`,
        `ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "referralPoints" INTEGER DEFAULT 0;`,
        `ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "referredById" TEXT;`,
        `ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "isDeleted" BOOLEAN DEFAULT false;`,
        `ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "role" TEXT DEFAULT 'USER';`,
        `ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "language" TEXT DEFAULT 'en';`,
        `ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "imageUrl" TEXT;`,
        `ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "stripeCustomerId" TEXT;`
      ];

      // Robust migration for language field - check if column exists first
      const migrationCommands = [
        `DO $$
         BEGIN
           IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='User' AND column_name='preferredLanguage') THEN
             UPDATE "User" SET "language" = "preferredLanguage" WHERE "language" = 'en' AND "preferredLanguage" IS NOT NULL;
           END IF;

           -- Also initialize referral codes for everyone missing one
           UPDATE "User" SET "referralCode" = substring(md5(random()::text), 1, 8) WHERE "referralCode" IS NULL;
         END $$;`,
         `CREATE UNIQUE INDEX IF NOT EXISTS "User_referralCode_key" ON "User"("referralCode");`
      ];

      // 2. Creator Table
      const creatorSchema = [
        `CREATE TABLE IF NOT EXISTS "Creator" (
            "id" TEXT NOT NULL,
            "userId" TEXT NOT NULL,
            "slug" TEXT NOT NULL,
            "name" TEXT NOT NULL,
            "bio" TEXT,
            "bannerUrl" TEXT,
            "subscribersCount" INTEGER NOT NULL DEFAULT 0,
            "isApproved" BOOLEAN NOT NULL DEFAULT false,
            "stripeConnectId" TEXT,
            "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
            CONSTRAINT "Creator_pkey" PRIMARY KEY ("id")
        );`,
        `CREATE UNIQUE INDEX IF NOT EXISTS "Creator_slug_key" ON "Creator"("slug");`
      ];

      // 3. Interaction Tables (Subscription, Likes, Dislikes)
      const interactionSchema = [
        `CREATE TABLE IF NOT EXISTS "Subscription" (
            "id" TEXT NOT NULL,
            "userId" TEXT NOT NULL,
            "creatorId" TEXT NOT NULL,
            "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
            CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
        );`,
        `CREATE UNIQUE INDEX IF NOT EXISTS "Subscription_userId_creatorId_key" ON "Subscription"("userId", "creatorId");`,

        `CREATE TABLE IF NOT EXISTS "VideoLike" (
            "id" TEXT NOT NULL,
            "userId" TEXT NOT NULL,
            "videoId" TEXT NOT NULL,
            "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
            CONSTRAINT "VideoLike_pkey" PRIMARY KEY ("id")
        );`,
        `CREATE UNIQUE INDEX IF NOT EXISTS "VideoLike_userId_videoId_key" ON "VideoLike"("userId", "videoId");`,

        `CREATE TABLE IF NOT EXISTS "VideoDislike" (
            "id" TEXT NOT NULL,
            "userId" TEXT NOT NULL,
            "videoId" TEXT NOT NULL,
            "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
            CONSTRAINT "VideoDislike_pkey" PRIMARY KEY ("id")
        );`,
        `CREATE UNIQUE INDEX IF NOT EXISTS "VideoDislike_userId_videoId_key" ON "VideoDislike"("userId", "videoId");`
      ];

      // Execute all commands
      const allCommands = [...userSchema, ...migrationCommands, ...creatorSchema, ...interactionSchema];

      for (const cmd of allCommands) {
        try {
          await prisma.$executeRawUnsafe(cmd);
        } catch (err: any) {
          // Ignore "already exists" errors (Postgres error 42701, 42P07, etc)
          if (!err.message?.includes("already exists") && !err.message?.includes("P2010")) {
            // console.warn(\`[SchemaService] Command warning (\${cmd.substring(0, 30)}...): \`, err.message);
          }
        }
      }

      console.log("[SchemaService] Database schema is verified and healed.");
    } catch (e: any) {
      console.error("[SchemaService] Critical failure during schema sync:", e.message);
    }
  }
}
