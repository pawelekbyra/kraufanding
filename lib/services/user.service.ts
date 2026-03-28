import { prisma } from '@/lib/prisma';
import { currentUser } from '@clerk/nextjs/server';
import crypto from 'crypto';

const ADMIN_EMAIL = "pawel.perfect@gmail.com";

export class UserService {
  /**
   * Retrieves or creates a user record in the database using the Clerk ID.
   * RESILIENCE: If Clerk API fails (e.g. handshake mismatch), it tries to find the user locally first.
   */
  static async getOrCreateUser(id: string) {
    try {
      console.log(`[UserService] Syncing user for ID: ${id}`);

      let clerkUser = null;
      try {
          clerkUser = await currentUser();
      } catch (ce) {
          console.error("[UserService] Clerk Handshake Failed. Attempting local lookup only.", ce);
      }

      // If Clerk is down or misconfigured, try finding existing user by ID
      if (!clerkUser) {
          const existing = await prisma.user.findUnique({ where: { id } });
          if (existing) {
              console.log(`[UserService] Recovered user ${id} from local DB after auth provider issue.`);
              return existing;
          }
          // If no local user and no provider data, we can't create a real record.
          throw new Error("AUTH_HANDSHAKE_FAILED_NO_LOCAL_DATA");
      }

      const email = clerkUser.primaryEmailAddress?.emailAddress ||
                    clerkUser.emailAddresses[0]?.emailAddress ||
                    `user_${id}@polutek.pl`;
      const imageUrl = clerkUser.imageUrl || null;
      const name = `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() || null;
      const role = email === ADMIN_EMAIL ? 'ADMIN' : 'USER';

      // Atomic upsert ensures the user record exists and is up-to-date
      return await prisma.$transaction(async (tx) => {
        const user = await tx.user.upsert({
          where: { id },
          update: { email, imageUrl, name, role },
          create: { id, email, imageUrl, name, role, preferredLanguage: "en" }
        });

        // Sync image to any associated creators
        if (imageUrl) {
            await tx.creator.updateMany({
                where: { userId: id },
                data: { imageUrl }
            });
        }

        return user;
      });
    } catch (e: any) {
      console.error("[GET_OR_CREATE_USER_ERROR]", e);
      // P2021: Table missing - this is the error the user is seeing!
      if (e.code === 'P2021') {
          throw new Error("DATABASE_TABLES_MISSING: Run 'npx prisma db push' in your environment.");
      }
      throw e;
    }
  }

  static async syncUser(id: string, email: string, name?: string | null, imageUrl?: string | null, referrerId?: string) {
    try {
      const role = email === ADMIN_EMAIL ? 'ADMIN' : 'USER';

      return await prisma.$transaction(async (tx) => {
        // Handle case where a user with this email exists but with a different ID (e.g. from seed)
        const emailUser = await tx.user.findUnique({ where: { email } });
        if (emailUser && emailUser.id !== id) {
          // Check if this user had any creators and reassign them
          await tx.creator.updateMany({
              where: { userId: emailUser.id },
              data: { userId: id }
          });
          // Delete the old seed user record to allow creating the new Clerk-synced one
          await tx.user.delete({ where: { id: emailUser.id } });
        }

        const existing = await tx.user.findUnique({ where: { id } });

        const user = await tx.user.upsert({
          where: { id },
          update: { email, name, imageUrl, role },
          create: {
            id,
            email,
            name,
            imageUrl,
            role,
            preferredLanguage: "en",
            referredById: referrerId || null
          }
        });

        // Sync image to any associated creators
        if (imageUrl) {
            await tx.creator.updateMany({
                where: { userId: id },
                data: { imageUrl }
            });
        }

        // Only increment referralCount if this is a new user and there's a referrer
        if (!existing && referrerId) {
          try {
            await tx.user.update({
              where: { id: referrerId },
              data: { referralCount: { increment: 1 } }
            });
            console.log(`[UserService] Incremented referralCount for ${referrerId}`);
          } catch (err) {
            console.warn(`[UserService] Failed to increment referralCount for ${referrerId}. Referrer might not exist in DB yet.`);
          }
        }

        return user;
      });
    } catch (e: any) {
      console.error("[SYNC_USER_ERROR]", e);
      throw e;
    }
  }

  static async softDeleteUser(id: string) {
    try {
      const anonymousId = crypto.randomUUID();
      return await prisma.user.update({
        where: { id },
        data: {
          email: `deleted_${anonymousId}@deleted.com`,
          name: "Usunięty Użytkownik",
          imageUrl: null,
          stripeCustomerId: null,
          isDeleted: true
        }
      });
    } catch (e: any) {
      console.error("[SOFT_DELETE_USER_ERROR]", e);
      throw e;
    }
  }

  static async getUserTotalPaid(id: string) {
    try {
      const user = await prisma.user.findUnique({
        where: { id },
        select: { totalPaid: true }
      });
      return user?.totalPaid || 0;
    } catch (e: any) {
      console.error("[GET_USER_TOTAL_PAID_ERROR]", e);
      return 0;
    }
  }

  static async isSubscribed(id: string, creatorId: string) {
    try {
      const sub = await prisma.subscription.findUnique({
        where: {
          userId_creatorId: {
            userId: id,
            creatorId
          }
        }
      });
      return !!sub;
    } catch (e: any) {
      console.error("[IS_SUBSCRIBED_ERROR]", e);
      return false;
    }
  }

  static async getVideoInteraction(userId: string, videoId: string) {
    try {
        const [like, dislike] = await Promise.all([
            prisma.videoLike.findUnique({
                where: { userId_videoId: { userId, videoId } }
            }).catch(() => null),
            prisma.videoDislike.findUnique({
                where: { userId_videoId: { userId, videoId } }
            }).catch(() => null)
        ]);
        return {
            liked: !!like,
            disliked: !!dislike
        };
    } catch (e) {
        console.error("[GET_VIDEO_INTERACTION_ERROR]", e);
        return { liked: false, disliked: false };
    }
  }

  static async toggleSubscription(id: string, creatorId: string) {
    try {
      // Lazy sync
      await this.getOrCreateUser(id).catch(err => {
          console.warn("[UserService] ToggleSub could not sync user provider data, continuing with DB lookup.", err.message);
      });

      return await prisma.$transaction(async (tx) => {
        const existing = await tx.subscription.findUnique({
          where: {
            userId_creatorId: {
              userId: id,
              creatorId
            }
          }
        });

        if (existing) {
          await tx.subscription.delete({
            where: { id: existing.id }
          });

          await tx.creator.update({
            where: { id: creatorId },
            data: { subscribersCount: { decrement: 1 } }
          });

          return { isSubscribed: false };
        } else {
          await tx.subscription.create({
            data: {
              userId: id,
              creatorId: creatorId
            }
          });

          await tx.creator.update({
            where: { id: creatorId },
            data: { subscribersCount: { increment: 1 } }
          });

          return { isSubscribed: true };
        }
      });
    } catch (e: any) {
      console.error("[TOGGLE_SUBSCRIPTION_ERROR]", e);
      if (e.code === 'P2021') throw new Error("DATABASE_TABLES_MISSING");
      throw e;
    }
  }
}
