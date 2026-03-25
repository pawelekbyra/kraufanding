import { prisma } from './prisma';
import { AccessTier } from '@prisma/client';
import { mockVideos } from '@/app/data/mock-videos';

/**
 * Checks the user's access level for a specific video based on their total amount paid.
 *
 * @param clerkUserId The Clerk user ID
 * @param videoId The video ID to check access for
 * @returns Object containing the user's total paid and their access status
 */
export async function getVideoAccess(clerkUserId: string | null, videoId: string) {
  let video = await prisma.video.findUnique({
    where: { id: videoId },
    select: { tier: true, isMainFeatured: true }
  });

  // Fallback to mock data if not in DB
  if (!video) {
    const mock = mockVideos.find(v => v.id === videoId);
    if (mock) {
        video = { tier: mock.tier, isMainFeatured: mock.isMain } as any;
    }
  }

  if (!video) return { hasAccess: false, userTotalPaid: 0, requiredTier: AccessTier.PUBLIC };

  // 1. The main hero video on homepage is ALWAYS public
  if (video.isMainFeatured) {
    return { hasAccess: true, userTotalPaid: 0, requiredTier: AccessTier.PUBLIC };
  }

  // 2. Public tier - everyone has access
  if (video.tier === AccessTier.PUBLIC) {
    return { hasAccess: true, userTotalPaid: 0, requiredTier: video.tier };
  }

  // 3. Not logged in - only public tier available
  if (!clerkUserId) {
    return { hasAccess: false, userTotalPaid: 0, requiredTier: video.tier };
  }

  const user = await prisma.user.findUnique({
    where: { clerkUserId },
    select: { totalPaid: true, role: true, email: true }
  });

  if (!user) return { hasAccess: false, userTotalPaid: 0, requiredTier: video.tier };

  // 4. Admin access
  if (user.role === 'ADMIN' || user.email === 'pawel.perfect@gmail.com') {
    return { hasAccess: true, userTotalPaid: user.totalPaid, requiredTier: video.tier };
  }

  // 5. LOGGED_IN tier - any registered user has access
  if (video.tier === AccessTier.LOGGED_IN) {
    return { hasAccess: true, userTotalPaid: user.totalPaid, requiredTier: video.tier };
  }

  // 6. VIP1 tier - required totalPaid >= 3 EUR
  if (video.tier === AccessTier.VIP1) {
    return { hasAccess: user.totalPaid >= 3, userTotalPaid: user.totalPaid, requiredTier: video.tier };
  }

  // 7. VIP2 tier - required totalPaid >= 10 EUR
  if (video.tier === AccessTier.VIP2) {
    return { hasAccess: user.totalPaid >= 10, userTotalPaid: user.totalPaid, requiredTier: video.tier };
  }

  return { hasAccess: false, userTotalPaid: user.totalPaid, requiredTier: video.tier };
}
