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
      goalAmount: 2000000, // 20,000.00 PLN in cents
      collectedAmount: 1250000, // 12,500.00 PLN in cents
      status: 'active',
      publishedAt: new Date(),
      tiers: {
        create: [
          {
            level: 2,
            name: 'Wsparcie 50 PLN',
            description: 'Podziękowanie + newsletter',
            priceOneTime: 5000,
            slotsTaken: 45,
          },
          {
            level: 3,
            name: 'Wsparcie 200 PLN',
            description: 'Plecak early bird',
            priceOneTime: 20000,
            slotsTaken: 12,
          },
          {
            level: 4,
            name: 'Wsparcie 500 PLN',
            description: 'Plecak + edycja limitowana',
            priceOneTime: 50000,
            slotsTaken: 5,
          },
        ],
      },
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
    update: {},
    create: {
      creatorId: creator.id,
      title: 'Secret Projekt POLUTEK',
      slug: 'secret-project',
      goalAmount: 1000000,
      collectedAmount: 650000,
      status: 'active',
      publishedAt: new Date(),
      tiers: {
        create: [
          {
            level: 1,
            name: 'Zostaw Napiwek',
            description: 'Dowolna kwota wsparcia projektu (minimum 10 €).',
            priceOneTime: 1000,
            slotsTaken: 0,
          },
          {
            level: 2,
            name: 'Dyszka',
            description: 'Podstawowy dostęp do archiwum.',
            priceOneTime: 1000,
            slotsTaken: 24,
          },
        ],
      },
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
