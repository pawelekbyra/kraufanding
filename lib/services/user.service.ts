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
    } catch (e: any) {
        console.error("[GET_USER_TOTAL_PAID_ERROR]", e);
        // P2021: Table does not exist
        if (e.code === 'P2021') return 0;
        return 0;
    }
  }

  static async isSubscribed(clerkUserId: string, creatorId: string) {
    try {
        const user = await prisma.user.findUnique({
            where: { clerkUserId },
            select: { id: true }
        }).catch((e) => {
            if (e.code === 'P2021') return null;
            throw e;
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
        }).catch((e) => {
            if (e.code === 'P2021') return null;
            throw e;
        });

        return !!sub;
    } catch (e: any) {
        console.error("[IS_SUBSCRIBED_ERROR]", e);
        return false;
    }
  }

  static async toggleSubscription(clerkUserId: string, creatorId: string) {
    try {
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
            if (e.code === 'P2021') return null; // Table missing
            return null;
        });

        if (existing) {
            await prisma.subscription.delete({
                where: { id: existing.id }
            }).catch(de => {
                console.error("Could not delete subscription", de);
                if (de.code === 'P2021') throw new Error("Tabela subskrypcji nie istnieje.");
                throw de;
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
            }).catch(ce => {
                console.error("Could not create subscription", ce);
                if (ce.code === 'P2021') throw new Error("Tabela subskrypcji nie istnieje.");
                throw ce;
            });

            await prisma.creator.update({
                where: { id: creatorId },
                data: { subscribersCount: { increment: 1 } }
            }).catch(ce => console.error("Could not increment subscribersCount", ce));

            return { isSubscribed: true };
        }
    } catch (error: any) {
        console.error("[TOGGLE_SUBSCRIPTION_ERROR]", error);
        // Fallback for UI if tables are missing or database is down
        return { isSubscribed: false, error: error.message };
    }
  }
}
