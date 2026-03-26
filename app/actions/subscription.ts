'use server';

import { auth } from '@clerk/nextjs/server';
import { UserService } from '@/lib/services/user.service';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { DEFAULT_CREATOR } from '@/lib/data/initial-content';

/**
 * Ensures a creator exists in the DB before subscribing.
 */
async function ensureCreatorExists(creatorId: string) {
    try {
        const creator = await prisma.creator.findUnique({ where: { id: creatorId } });
        if (!creator && creatorId === DEFAULT_CREATOR.id) {
            console.log(`[Subscription] Auto-healing: Creator ${creatorId} missing. Creating from fallback.`);
            const adminUser = await UserService.getOrCreateUser("user_admin_001").catch(() => null);
            if (!adminUser) return;

            await prisma.creator.create({
                data: {
                    id: DEFAULT_CREATOR.id,
                    userId: adminUser.id,
                    slug: DEFAULT_CREATOR.slug,
                    name: DEFAULT_CREATOR.name,
                    bio: DEFAULT_CREATOR.bio,
                    isApproved: true
                }
            });
        }
    } catch (e) {
        console.error("[Subscription] Auto-healing failed:", e);
    }
}

export async function toggleSubscriptionAction(creatorId: string) {
  let userId: string | null = null;
  try {
      const authData = auth();
      userId = authData.userId;
  } catch (e: any) {
      console.error("[Subscription] Clerk Handshake Failed:", e.message);
      return { error: "CLERK_ERROR", message: "Clerk handshake failed. Check your API keys in Vercel." };
  }

  if (!userId) return { error: 'AUTH_REQUIRED' };

  try {
    await ensureCreatorExists(creatorId);
    const result = await UserService.toggleSubscription(userId, creatorId);

    revalidatePath('/', 'layout');
    return { success: true, isSubscribed: result.isSubscribed };
  } catch (error: any) {
    console.error("[TOGGLE_SUBSCRIPTION_ACTION_ERROR]", error);
    if (error.message?.includes("DATABASE_TABLES_MISSING")) {
        return { error: 'DATABASE_ERROR', message: "Baza danych nie jest gotowa (P2021)." };
    }
    return { error: error.message || 'INTERNAL_ERROR' };
  }
}

export async function getSubscriptionStatusAction(creatorId: string) {
    let userId: string | null = null;
    try {
        const authData = auth();
        userId = authData.userId;
    } catch (e) {
        return { isSubscribed: false };
    }

    if (!userId) return { isSubscribed: false };

    try {
        const isSubscribed = await UserService.isSubscribed(userId, creatorId);
        return { isSubscribed };
    } catch (error) {
        console.error("[GET_SUBSCRIPTION_STATUS_ERROR]", error);
        return { isSubscribed: false };
    }
}
