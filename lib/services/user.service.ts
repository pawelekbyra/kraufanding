import { prisma } from '@/lib/prisma';
import { currentUser } from '@clerk/nextjs/server';
import crypto from 'crypto';

const ADMIN_EMAIL = "pawel.perfect@gmail.com";

export class UserService {
  /**
   * Retrieves or creates a user record in the database using the Clerk ID.
   * This method centralizes user session identification and synchronization.
   */
  static async getOrCreateUser(id: string) {
    try {
      console.log(`[UserService] Syncing user for ID: ${id}`);
      const clerkUser = await currentUser();

      // Ensure we have at least an email to identify the user
      const email = clerkUser?.primaryEmailAddress?.emailAddress ||
                    clerkUser?.emailAddresses[0]?.emailAddress ||
                    `user_${id}@polutek.pl`;
      const imageUrl = clerkUser?.imageUrl || null;
      const name = clerkUser ? `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() || null : null;

      const role = email === ADMIN_EMAIL ? 'ADMIN' : 'USER';

      // Atomic upsert ensures the user record exists and is up-to-date
      return await prisma.user.upsert({
        where: { id },
        update: { email, imageUrl, name, role },
        create: { id, email, imageUrl, name, role }
      });
    } catch (e: any) {
      console.error("[GET_OR_CREATE_USER_ERROR]", e);
      throw new Error(`Failed to sync user: ${e.message}`);
    }
  }

  /**
   * Synchronizes user data directly from a webhook or manual call.
   */
  static async syncUser(id: string, email: string, imageUrl?: string | null) {
    try {
      const role = email === ADMIN_EMAIL ? 'ADMIN' : 'USER';
      return await prisma.user.upsert({
        where: { id },
        update: { email, imageUrl, role },
        create: { id, email, imageUrl, role }
      });
    } catch (e: any) {
      console.error("[SYNC_USER_ERROR]", e);
      throw new Error(`Failed to sync user data: ${e.message}`);
    }
  }

  /**
   * Soft-deletes a user by anonymizing their personal data while preserving their ID.
   */
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
      throw new Error(`Failed to soft-delete user: ${e.message}`);
    }
  }

  /**
   * Returns the total historical donation amount for a user.
   */
  static async getUserTotalPaid(id: string) {
    try {
      const user = await prisma.user.findUnique({
        where: { id },
        select: { totalPaid: true }
      });
      return user?.totalPaid || 0;
    } catch (e: any) {
      console.error("[GET_USER_TOTAL_PAID_ERROR]", e);
      return 0; // Safe default for access checks
    }
  }

  /**
   * Checks if a user is subscribed to a specific creator.
   */
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

  /**
   * Retrieves the user's interaction status (like/dislike) for a video.
   */
  static async getVideoInteraction(userId: string, videoId: string) {
    try {
        const [like, dislike] = await Promise.all([
            prisma.videoLike.findUnique({
                where: { userId_videoId: { userId, videoId } }
            }),
            prisma.videoDislike.findUnique({
                where: { userId_videoId: { userId, videoId } }
            })
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

  /**
   * Toggles the subscription status for a user and a creator.
   * Atomically increments/decrements the creator's subscriber count.
   */
  static async toggleSubscription(id: string, creatorId: string) {
    try {
      // Ensure the user exists before toggling
      await this.getOrCreateUser(id);

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
      throw new Error(`Failed to toggle subscription: ${e.message}`);
    }
  }
}
