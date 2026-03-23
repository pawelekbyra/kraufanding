import { PrismaClient, UserTier, SystemRole } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create or find a user for the creator
  const user = await prisma.user.upsert({
    where: { clerkUserId: 'user_2tW7q1Z5vW3N8mR0pL4K6j9H1D2' },
    update: {},
    create: {
      clerkUserId: 'user_2tW7q1Z5vW3N8mR0pL4K6j9H1D2',
      email: 'creator@polutek.pl',
      tier: UserTier.FREE,
      role: SystemRole.CREATOR,
    },
  });

  // Create the creator
  const creator = await prisma.creator.upsert({
    where: { slug: 'jan-kowalski' },
    update: {},
    create: {
      userId: user.id,
      slug: 'jan-kowalski',
      name: 'Jan Kowalski',
      bio: 'Pasjonat technologii i innowacji z Warszawy.',
      isApproved: true,
    },
  });

  // Create the "Nowoczesny plecak smart" campaign
  const smartPack = await prisma.project.upsert({
    where: { slug: 'smart-backpack' },
    update: {},
    create: {
      creatorId: creator.id,
      title: 'Nowoczesny plecak smart',
      slug: 'smart-backpack',
      status: 'active',
      publishedAt: new Date(),
      posts: {
        create: [
          {
            title: 'Pierwsza aktualizacja',
            slug: 'first-update',
            contentPublic: 'Zakończyliśmy fazę prototypowania!',
            publishedAt: new Date(),
          },
        ],
      },
    },
  });

  // Create the original "Secret Project"
  await prisma.project.upsert({
    where: { slug: 'secret-project' },
    update: {
      title: 'I raise money for my Secret Project',
    },
    create: {
      creatorId: creator.id,
      title: 'I raise money for my Secret Project',
      slug: 'secret-project',
      status: 'active',
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
