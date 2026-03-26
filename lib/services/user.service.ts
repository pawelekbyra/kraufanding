import { prisma } from '@/lib/prisma';
import { currentUser } from '@clerk/nextjs/server';
import crypto from 'crypto';

export class UserService {
  static async getOrCreateUser(id: string) {
    try {
        console.log(`[UserService] Getting/Creating user for ID: ${id}`);
        const clerkUser = await currentUser();

        // If we can't get clerk user (e.g. session issue), try to find local user first
        if (!clerkUser) {
            const existing = await prisma.user.findUnique({ where: { id } });
            if (existing) return existing;
        }

        const email = clerkUser?.primaryEmailAddress?.emailAddress ||
                      clerkUser?.emailAddresses[0]?.emailAddress ||
                      `user_${id}@polutek.pl`;
        const imageUrl = clerkUser?.imageUrl || null;
        const name = clerkUser ? `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() || null : null;

        console.log(`[UserService] Upserting user record in database...`);
        return await prisma.user.upsert({
            where: { id },
            update: { email, imageUrl, name },
            create: { id, email, imageUrl, name }
        });
    } catch (e: any) {
        console.error("[GET_OR_CREATE_USER_ERROR]", e);
        // Table missing fallback
        if (e.code === 'P2021') {
            return { id, email: 'guest@polutek.pl', totalPaid: 0, isFallback: true } as any;
        }
        // Minimal fallback for UI not to crash
        return { id, email: 'guest@polutek.pl', totalPaid: 0, isFallback: true } as any;
    }
  }

  static async syncUser(id: string, email: string, imageUrl?: string | null) {
    try {
        return await prisma.user.upsert({
            where: { id },
            update: { email, imageUrl },
            create: { id, email, imageUrl }
        });
    } catch (e) {
        console.error("[SYNC_USER_ERROR]", e);
        return null;
    }
  }

  static async softDeleteUser(id: string) {
    try {
        const anonymousId = crypto.randomUUID();
        return await prisma.user.update({
            where: { id },
            data: {
                id: `deleted_${id}_${anonymousId}`,
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

  static async getUserTotalPaid(id: string) {
    try {
        const user = await prisma.user.findUnique({
            where: { id },
            select: { totalPaid: true }
        }).catch(e => {
            if (e.code === 'P2021') return null;
            throw e;
        });
        return user?.totalPaid || 0;
    } catch (e: any) {
        console.error("[GET_USER_TOTAL_PAID_ERROR]", e);
        // P2021: Table does not exist
        if (e.code === 'P2021') return 0;
        return 0;
    }
  }

  static async isSubscribed(id: string, creatorId: string) {
    try {
        // Now id IS the internal id
        const sub = await prisma.subscription.findUnique({
            where: {
                userId_creatorId: {
                    userId: id,
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

  static async toggleSubscription(id: string, creatorId: string) {
    try {
        const user = await this.getOrCreateUser(id);
        if (user.isFallback) throw new Error("Database table missing or unavailable. Run 'npx prisma db push'.");

        // We do NOT use a transaction here to be more resilient to missing columns (subscribersCount)
        // If the subscription creation fails, we throw.
        // If the count update fails, we log and continue.

        const existing = await prisma.subscription.findUnique({
            where: {
                userId_creatorId: {
                    userId: id,
                    creatorId
                }
            }
        }).catch(e => {
            console.error("[CHECK_EXISTING_SUB_ERROR]", e);
            if (e.code === 'P2021') return null; // Table missing
            return null;
        });

        if (existing) {
            try {
                await prisma.subscription.delete({
                    where: { id: existing.id }
                });

                // Attempt to update count, but don't fail the whole action if it crashes (e.g. missing column)
                await prisma.creator.update({
                    where: { id: creatorId },
                    data: { subscribersCount: { decrement: 1 } }
                }).catch(ce => {
                    console.error("Could not decrement subscribersCount", ce);
                });

                return { isSubscribed: false };
            } catch (de: any) {
                console.error("Could not delete subscription", de);
                if (de.code === 'P2021') throw new Error("Database error: Subscription table missing.");
                throw de;
            }
        } else {
            try {
                await prisma.subscription.create({
                    data: {
                        userId: id,
                        creatorId: creatorId
                    }
                });

                await prisma.creator.update({
                    where: { id: creatorId },
                    data: { subscribersCount: { increment: 1 } }
                }).catch(ce => {
                    console.error("Could not increment subscribersCount", ce);
                });

                return { isSubscribed: true };
            } catch (ce: any) {
                console.error("Could not create subscription", ce);
                if (ce.code === 'P2021') throw new Error("Database error: Subscription table missing.");
                throw ce;
            }
        }
    } catch (error: any) {
        console.error("[TOGGLE_SUBSCRIPTION_ERROR]", error);
        // Fallback for UI if tables are missing or database is down
        return { isSubscribed: false, error: error.message };
    }
  }
}
