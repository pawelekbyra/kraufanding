import { prisma } from './prisma';

/**
 * Checks if a user has access to a specific project tier.
 * Higher levels have cumulative access to all lower levels.
 *
 * @param clerkUserId The Clerk user ID
 * @param projectId The project ID to check access for
 * @returns The user's highest tier level for the project (0: Guest, 1: FREE, 2: OBSERVER, 3: WITNESS, 4: INSIDER, 5: ARCHITECT)
 */
export async function getProjectAccess(clerkUserId: string | null, projectId: string) {
  if (!clerkUserId) {
    return 0; // Guest / Unauthenticated
  }

  try {
    const user = await prisma.user.findUnique({
      where: { clerkUserId },
      select: { id: true, tier: true, role: true }
    });

    if (!user) {
      return 1; // Authenticated but not in our DB yet
    }

    // Admins have full access (tier 5)
    if (user.role === 'ADMIN') {
      return 5;
    }

    // Global tier check (if they have a global status)
    const tierMap: Record<string, number> = {
      'FREE': 1,
      'OBSERVER': 2,
      'WITNESS': 3,
      'INSIDER': 4,
      'ARCHITECT': 5
    };
    const globalTierLevel = tierMap[user.tier] || 1;

    // Project-specific access check
    const projectAccess = await prisma.userProjectAccess.findUnique({
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

    if (!projectAccess) {
      return globalTierLevel;
    }

    // Check if access has expired (only for subscriptions)
    if (projectAccess.expiresAt && projectAccess.expiresAt < new Date()) {
      return globalTierLevel; // Expired sub, fallback to global tier
    }

    // Return the highest of global tier or project-specific tier
    return Math.max(globalTierLevel, projectAccess.tierLevel);
  } catch (error) {
    console.error('Error checking project access:', error);
    return 1; // Fallback to FREE if logged in but error
  }
}
