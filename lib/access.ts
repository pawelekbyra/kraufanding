import { prisma } from './prisma';

/**
 * Checks if a user has access to a specific project and tier level.
 * Handles cumulative tier levels (higher level sees everything below).
 *
 * @param clerkUserId - The Clerk user ID
 * @param projectId - The project ID
 * @param minTier - The minimum tier level required (1-5)
 * @returns boolean indicating access
 */
export async function getProjectAccess(clerkUserId: string | null, projectId: string, minTier: number = 2) {
  // Tier 0 and 1 are handled differently (public and registered)
  if (minTier <= 0) return true;

  if (!clerkUserId) return false;

  const user = await prisma.user.findUnique({
    where: { clerkUserId },
    include: {
      projectAccess: {
        where: {
          projectId,
          tierLevel: { gte: minTier },
        },
      },
    },
  });

  if (!user) return false;

  // Level 1: Registered/FREE - always true if user exists
  if (minTier === 1) return true;

  // Check for active access in UserProjectAccess
  const access = user.projectAccess.find(a =>
    a.projectId === projectId &&
    a.tierLevel >= minTier &&
    (a.expiresAt === null || a.expiresAt > new Date())
  );

  return !!access;
}
