import { prisma } from '@/lib/prisma';
import { currentUser } from '@clerk/nextjs/server';
import crypto from 'crypto';

export class UserService {
  static async getOrCreateUser(clerkUserId: string) {
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
  }

  static async syncUser(clerkUserId: string, email: string, imageUrl?: string | null) {
    return await prisma.user.upsert({
      where: { clerkUserId },
      update: { email, imageUrl },
      create: { clerkUserId, email, imageUrl }
    });
  }

  static async softDeleteUser(clerkUserId: string) {
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
  }

  static async getUserTotalPaid(clerkUserId: string) {
    const user = await prisma.user.findUnique({
      where: { clerkUserId },
      select: { totalPaid: true }
    });
    return user?.totalPaid || 0;
  }

  static async subscribeToCreator(userId: string, creatorId: string) {
    return await prisma.subscription.upsert({
      where: {
        userId_creatorId: { userId, creatorId }
      },
      update: {},
      create: { userId, creatorId }
    });
  }
}
