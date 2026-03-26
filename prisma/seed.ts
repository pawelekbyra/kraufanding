import { PrismaClient, AccessTier, SystemRole } from '@prisma/client';

const prisma = new PrismaClient();

const ADMIN_EMAIL = "pawel.perfect@gmail.com";

async function main() {
  console.log('Starting seeding...');

  // 1. Create or update the Admin User
  const adminUser = await prisma.user.upsert({
    where: { email: ADMIN_EMAIL },
    update: {
      role: SystemRole.ADMIN,
      name: "Paweł Polutek",
    },
    create: {
      id: "user_admin_001", // Placeholder ID, will be synced by Clerk
      email: ADMIN_EMAIL,
      name: "Paweł Polutek",
      role: SystemRole.ADMIN,
    },
  });

  // 2. Create the Creator profile
  const creator = await prisma.creator.upsert({
    where: { slug: 'polutek' },
    update: {
      name: 'Paweł Polutek',
      bio: 'Twórca platformy polutek.pl. Ekskluzywne materiały VOD i niezależne śledztwa.',
      bannerUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop',
      subscribersCount: 1200000,
    },
    create: {
      userId: adminUser.id,
      slug: 'polutek',
      name: 'Paweł Polutek',
      bio: 'Twórca platformy polutek.pl. Ekskluzywne materiały VOD i niezależne śledztwa.',
      bannerUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop',
      subscribersCount: 1200000,
      isApproved: true,
    },
  });

  // 3. Define Videos
  const videosData = [
    {
      title: 'I raise money for my Secret Project',
      slug: 'secret-project',
      description: 'To jest mój najważniejszy projekt. Zbieram fundusze na realizację wizji, która zmieni sposób, w jaki konsumujemy media.',
      videoUrl: 'https://pub-309ebc4b2d654f78b2a22e1d57917b94.r2.dev/Wuthering-Heights.mp4',
      thumbnailUrl: 'https://pub-309ebc4b2d654f78b2a22e1d57917b94.r2.dev/Wuthering-Heights.jpg',
      duration: '04:12',
      tier: AccessTier.PUBLIC,
      isMainFeatured: true,
      views: 1250400,
      likesCount: 45000,
      dislikesCount: 120,
    },
    {
      title: 'Dlaczego niezależność jest kluczowa w 2024?',
      slug: 'independency-2024',
      description: 'W tym odcinku analizuję, dlaczego twórcy muszą szukać alternatywnych dróg finansowania poza wielkimi korporacjami.',
      videoUrl: 'https://pub-309ebc4b2d654f78b2a22e1d57917b94.r2.dev/Wuthering-Heights.mp4', // Reusing asset for seed
      thumbnailUrl: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=2659&auto=format&fit=crop',
      duration: '15:30',
      tier: AccessTier.LOGGED_IN,
      isMainFeatured: false,
      views: 85000,
      likesCount: 12000,
      dislikesCount: 50,
    },
    {
      title: 'Mój setup do nagrywania śledztw',
      slug: 'setup-tour',
      description: 'Pokazuję sprzęt, którego używam do tworzenia moich materiałów. Od kamer po mikrofony i oświetlenie.',
      videoUrl: 'https://pub-309ebc4b2d654f78b2a22e1d57917b94.r2.dev/Wuthering-Heights.mp4',
      thumbnailUrl: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=2670&auto=format&fit=crop',
      duration: '22:15',
      tier: AccessTier.VIP1,
      isMainFeatured: false,
      views: 15000,
      likesCount: 3000,
      dislikesCount: 10,
    },
    {
      title: 'Niepublikowane materiały z ostatniego śledztwa',
      slug: 'unreleased-investigation',
      description: 'Tylko dla Patronów. Nagrania, które nie weszły do głównego materiału ze względu na ich kontrowersyjną naturę.',
      videoUrl: 'https://pub-309ebc4b2d654f78b2a22e1d57917b94.r2.dev/Wuthering-Heights.mp4',
      thumbnailUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2670&auto=format&fit=crop',
      duration: '45:00',
      tier: AccessTier.VIP2,
      isMainFeatured: false,
      views: 5000,
      likesCount: 1500,
      dislikesCount: 5,
    },
    {
      title: 'Q&A: Odpowiedzi na Wasze najtrudniejsze pytania',
      slug: 'qa-session-1',
      description: 'Odpowiadam na pytania przesłane przez moich wspierających. Nic nie jest poza granicami.',
      videoUrl: 'https://pub-309ebc4b2d654f78b2a22e1d57917b94.r2.dev/Wuthering-Heights.mp4',
      thumbnailUrl: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=2670&auto=format&fit=crop',
      duration: '32:10',
      tier: AccessTier.VIP1,
      isMainFeatured: false,
      views: 12000,
      likesCount: 2500,
      dislikesCount: 15,
    }
  ];

  for (const v of videosData) {
    await prisma.video.upsert({
      where: { slug: v.slug },
      update: {
        title: v.title,
        description: v.description,
        videoUrl: v.videoUrl,
        thumbnailUrl: v.thumbnailUrl,
        duration: v.duration,
        tier: v.tier,
        isMainFeatured: v.isMainFeatured,
        views: v.views,
        likesCount: v.likesCount,
        dislikesCount: v.dislikesCount,
        publishedAt: new Date(),
      },
      create: {
        creatorId: creator.id,
        title: v.title,
        slug: v.slug,
        description: v.description,
        videoUrl: v.videoUrl,
        thumbnailUrl: v.thumbnailUrl,
        duration: v.duration,
        tier: v.tier,
        isMainFeatured: v.isMainFeatured,
        views: v.views,
        likesCount: v.likesCount,
        dislikesCount: v.dislikesCount,
        publishedAt: new Date(),
      },
    });
  }

  console.log('Seeding finished successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
