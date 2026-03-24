import { prisma } from './prisma';
import { AccessTier } from '@prisma/client';

/**
 * Checks the user's access level for a specific video based on their total amount paid.
 *
 * @param clerkUserId The Clerk user ID
 * @param videoId The video ID to check access for
 * @returns Object containing the user's total paid and their access status
 */
export async function getVideoAccess(clerkUserId: string | null, videoId: string) {
  const video = await prisma.video.findUnique({
    where: { id: videoId },
    select: { tier: true, creatorId: true }
  });

  if (!video) return { hasAccess: false, userTotalPaid: 0, requiredTier: AccessTier.PUBLIC };

  // Public tier - everyone has access
  if (video.tier === AccessTier.PUBLIC) {
    return { hasAccess: true, userTotalPaid: 0, requiredTier: video.tier };
  }

  // Not logged in - only public tier available
  if (!clerkUserId) {
    return { hasAccess: false, userTotalPaid: 0, requiredTier: video.tier };
  }

  const user = await prisma.user.findUnique({
    where: { clerkUserId },
    select: { totalPaid: true, role: true, email: true }
  });

  if (!user) return { hasAccess: false, userTotalPaid: 0, requiredTier: video.tier };

  // Admin access
  if (user.role === 'ADMIN' || user.email === 'pawel.perfect@gmail.com') {
    return { hasAccess: true, userTotalPaid: user.totalPaid, requiredTier: video.tier };
  }

  // LOGGED_IN tier - any registered user has access
  if (video.tier === AccessTier.LOGGED_IN) {
    return { hasAccess: true, userTotalPaid: user.totalPaid, requiredTier: video.tier };
  }

  // VIP1 tier - required totalPaid >= 3 EUR
  if (video.tier === AccessTier.VIP1) {
    return { hasAccess: user.totalPaid >= 3, userTotalPaid: user.totalPaid, requiredTier: video.tier };
  }

  // VIP2 tier - required totalPaid >= 10 EUR
  if (video.tier === AccessTier.VIP2) {
    return { hasAccess: user.totalPaid >= 10, userTotalPaid: user.totalPaid, requiredTier: video.tier };
  }

  return { hasAccess: false, userTotalPaid: user.totalPaid, requiredTier: video.tier };
}
