import { prisma } from '@/lib/prisma';
import { currentUser } from '@clerk/nextjs/server';
import crypto from 'crypto';

export class UserService {
  static async getOrCreateUser(clerkUserId: string) {
    try {
        let localUser = await prisma.user.findUnique({ where: { clerkUserId } });

        if (!localUser) {
            const clerkUser = await currentUser();
            const email = clerkUser?.primaryEmailAddress?.emailAddress || clerkUser?.emailAddresses[0]?.emailAddress || `user_${clerkUserId}@polutek.pl`;
            const imageUrl = clerkUser?.imageUrl || null;

            localUser = await prisma.user.upsert({
                where: { clerkUserId },
                update: { email, imageUrl },
                create: { clerkUserId, email, imageUrl }
            });
        }

        return localUser;
    } catch (e) {
        console.error("[GET_OR_CREATE_USER_ERROR]", e);
        // Minimal fallback for UI not to crash
        return { id: 'temp-id', email: 'guest@polutek.pl', totalPaid: 0 } as any;
    }
  }

  static async syncUser(clerkUserId: string, email: string, imageUrl?: string | null) {
    try {
        return await prisma.user.upsert({
            where: { clerkUserId },
            update: { email, imageUrl },
            create: { clerkUserId, email, imageUrl }
        });
    } catch (e) {
        console.error("[SYNC_USER_ERROR]", e);
        return null;
    }
  }

  static async softDeleteUser(clerkUserId: string) {
    try {
        const anonymousId = crypto.randomUUID();
        return await prisma.user.update({
            where: { clerkUserId },
            data: {
                clerkUserId: `deleted_${clerkUserId}_${anonymousId}`,
                email: `deleted_${anonymousId}@deleted.com`,
                name: "Usunięty Użytkownik",
                imageUrl: null,
                stripeCustomerId: null,
                isDeleted: true
            }
        });
    } catch (e) {
        console.error("[SOFT_DELETE_USER_ERROR]", e);
        return null;
    }
  }

  static async getUserTotalPaid(clerkUserId: string) {
    try {
        const user = await prisma.user.findUnique({
            where: { clerkUserId },
            select: { totalPaid: true }
        });
        return user?.totalPaid || 0;
    } catch (e) {
        console.error("[GET_USER_TOTAL_PAID_ERROR]", e);
        return 0;
    }
  }

  static async isSubscribed(clerkUserId: string, creatorId: string) {
    try {
        const user = await prisma.user.findUnique({
            where: { clerkUserId },
            select: { id: true }
        });
        if (!user) return false;

        // Defensive check for Subscription table existence
        const sub = await prisma.subscription.findUnique({
            where: {
                userId_creatorId: {
                    userId: user.id,
                    creatorId
                }
            }
        }).catch(() => null);

        return !!sub;
    } catch (e) {
        console.error("[IS_SUBSCRIBED_ERROR]", e);
        return false;
    }
  }

  static async toggleSubscription(clerkUserId: string, creatorId: string) {
    const user = await this.getOrCreateUser(clerkUserId);
    if (user.id === 'temp-id') throw new Error("Database unavailable");

    // We do NOT use a transaction here to be more resilient to missing columns (subscribersCount)
    // If the subscription creation fails, we throw.
    // If the count update fails, we log and continue.

    const existing = await prisma.subscription.findUnique({
        where: {
            userId_creatorId: {
                userId: user.id,
                creatorId
            }
        }
    }).catch(e => {
        console.error("[CHECK_EXISTING_SUB_ERROR]", e);
        return null;
    });

    if (existing) {
        await prisma.subscription.delete({
            where: { id: existing.id }
        });

        // Attempt to update count, but don't fail the whole action if it crashes (e.g. missing column)
        await prisma.creator.update({
            where: { id: creatorId },
            data: { subscribersCount: { decrement: 1 } }
        }).catch(ce => console.error("Could not decrement subscribersCount", ce));

        return { isSubscribed: false };
    } else {
        await prisma.subscription.create({
            data: {
                userId: user.id,
                creatorId: creatorId
            }
        });

        await prisma.creator.update({
            where: { id: creatorId },
            data: { subscribersCount: { increment: 1 } }
        }).catch(ce => console.error("Could not increment subscribersCount", ce));

        return { isSubscribed: true };
    }
  }
}
