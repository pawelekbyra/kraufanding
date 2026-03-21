import { prisma } from './prisma';

/**
 * Checks if a user has access to a specific project tier.
 * Higher levels have cumulative access to all lower levels.
 *
 * @param clerkUserId The Clerk user ID
 * @param projectId The project ID to check access for
 * @returns The user's highest tier level for the project (0 if no access/guest)
 */
export async function getProjectAccess(clerkUserId: string | null, projectId: string) {
  if (!clerkUserId) {
    return 0; // Guest / Unauthenticated
  }

  try {
    const user = await prisma.user.findUnique({
      where: { clerkUserId },
      select: { id: true }
    });

    if (!user) {
      return 0;
    }

    const access = await prisma.userProjectAccess.findUnique({
      where: {
        userId_projectId: {
          userId: user.id,
          projectId: projectId,
        },
      },
      select: {
        tierLevel: true,
        expiresAt: true,
      },
    });

    if (!access) {
      return 1; // Registered but no paid tier (FREE)
    }

    // Check if access has expired (only for subscriptions)
    if (access.expiresAt && access.expiresAt < new Date()) {
      return 1; // Expired sub, back to FREE level
    }

    return access.tierLevel;
  } catch (error) {
    console.error('Error checking project access:', error);
    return 0;
  }
}
