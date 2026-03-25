import { PrismaClient, AccessTier, SystemRole } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create or find a user for the creator
  const user = await prisma.user.upsert({
    where: { clerkUserId: 'user_2tW7q1Z5vW3N8mR0pL4K6j9H1D2' },
    update: {},
    create: {
      clerkUserId: 'user_2tW7q1Z5vW3N8mR0pL4K6j9H1D2',
      email: 'pawel.perfect@gmail.com',
      role: SystemRole.ADMIN,
    },
  });

  // Create the creator
  const creator = await prisma.creator.upsert({
    where: { slug: 'polutek' },
    update: {},
    create: {
      userId: user.id,
      slug: 'polutek',
      name: 'Paweł Polutek',
      bio: 'Twórca platformy polutek.pl.',
      isApproved: true,
      subscribersCount: 1240562
    },
  });

  // Create the main featured video
  await prisma.video.upsert({
    where: { slug: 'secret-project' },
    update: {
      isMainFeatured: true,
    },
    create: {
      creatorId: creator.id,
      title: 'I raise money for my Secret Project',
      slug: 'secret-project',
      videoUrl: 'https://vimeo.com/placeholder',
      thumbnailUrl: 'https://picsum.photos/seed/secret/1200/675',
      description: 'To jest mój sekretny projekt, który zmieni wszystko.',
      tier: AccessTier.PUBLIC,
      isMainFeatured: true,
      publishedAt: new Date(),
    },
  });

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
