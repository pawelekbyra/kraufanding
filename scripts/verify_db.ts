import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function verify() {
  console.log("--- DB VERIFICATION START ---");
  try {
    const userCount = await prisma.user.count();
    const creatorCount = await prisma.creator.count();
    const videoCount = await prisma.video.count();
    const subscriptionCount = await prisma.subscription.count();

    console.log(`User count: ${userCount}`);
    console.log(`Creator count: ${creatorCount}`);
    console.log(`Video count: ${videoCount}`);
    console.log(`Subscription count: ${subscriptionCount}`);

    const testUser = await prisma.user.findFirst();
    console.log("Test User:", testUser ? { id: testUser.id, email: testUser.email, name: testUser.name } : "NONE");

    const testCreator = await prisma.creator.findFirst();
    console.log("Test Creator:", testCreator ? { id: testCreator.id, slug: testCreator.slug, name: testCreator.name } : "NONE");

    const testVideo = await prisma.video.findFirst();
    console.log("Test Video:", testVideo ? { id: testVideo.id, slug: testVideo.slug, title: testVideo.title } : "NONE");

    const testSubscription = await prisma.subscription.findFirst();
    console.log("Test Subscription:", testSubscription ? { id: testSubscription.id, userId: testSubscription.userId, creatorId: testSubscription.creatorId } : "NONE");

    console.log("--- DB VERIFICATION END (SUCCESS) ---");
  } catch (e: any) {
    console.error("--- DB VERIFICATION FAILED ---");
    console.error(`Error message: ${e.message}`);
    console.error(`Prisma error code: ${e.code}`);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

verify();
