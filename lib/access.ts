import { prisma } from './prisma';
import { AccessTier } from '@prisma/client';
import { mockVideos } from '@/app/data/mock-videos';

/**
 * Checks the user's access level for a specific video based on their total amount paid.
 */
export async function getVideoAccess(clerkUserId: string | null, videoId: string) {
  let video = await prisma.video.findUnique({
    where: { id: videoId },
    select: { tier: true, isMainFeatured: true }
  });

  if (!video) {
    const mock = mockVideos.find(v => v.id === videoId);
    if (mock) {
        video = { tier: mock.tier, isMainFeatured: mock.isMainFeatured } as any;
    }
  }

  if (!video) return { hasAccess: false, userTotalPaid: 0, requiredTier: AccessTier.PUBLIC, videoUrl: null };

  const dbVideo = await prisma.video.findUnique({
    where: { id: videoId },
    select: { videoUrl: true }
  });
  const videoUrl = dbVideo?.videoUrl || mockVideos.find(v => v.id === videoId)?.videoUrl || null;

  // 1. The main hero video on homepage is ALWAYS public
  if (video.isMainFeatured) {
    return { hasAccess: true, userTotalPaid: 0, requiredTier: AccessTier.PUBLIC, videoUrl };
  }

  // 2. Public tier - everyone has access
  if (video.tier === AccessTier.PUBLIC) {
    return { hasAccess: true, userTotalPaid: 0, requiredTier: video.tier, videoUrl };
  }

  // 3. Not logged in - only public tier available
  if (!clerkUserId) {
    return { hasAccess: false, userTotalPaid: 0, requiredTier: video.tier, videoUrl: null };
  }

  // 4. LOGGED_IN tier - any registered user has access immediately
  if (video.tier === AccessTier.LOGGED_IN) {
    return { hasAccess: true, userTotalPaid: 0, requiredTier: video.tier, videoUrl };
  }

  const user = await prisma.user.findUnique({
    where: { clerkUserId },
    select: { totalPaid: true, role: true, email: true }
  });

  // If logged in but not in DB yet (sync lag), they still have LOGGED_IN access (handled above)
  // but for VIP tiers we need the DB record.
  if (!user) return { hasAccess: false, userTotalPaid: 0, requiredTier: video.tier };

  // 5. Admin access
  if (user.role === 'ADMIN' || user.email === 'pawel.perfect@gmail.com') {
    return { hasAccess: true, userTotalPaid: user.totalPaid, requiredTier: video.tier, videoUrl };
  }

  // 6. VIP1 tier - required totalPaid >= 5 EUR
  if (video.tier === AccessTier.VIP1) {
    const hasAccess = user.totalPaid >= 5;
    return { hasAccess, userTotalPaid: user.totalPaid, requiredTier: video.tier, videoUrl: hasAccess ? videoUrl : null };
  }

  // 7. VIP2 tier - required totalPaid >= 10 EUR
  if (video.tier === AccessTier.VIP2) {
    const hasAccess = user.totalPaid >= 10;
    return { hasAccess, userTotalPaid: user.totalPaid, requiredTier: video.tier, videoUrl: hasAccess ? videoUrl : null };
  }

  return { hasAccess: false, userTotalPaid: user.totalPaid, requiredTier: video.tier, videoUrl: null };
}
