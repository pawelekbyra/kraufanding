'use server';

import { auth } from '@clerk/nextjs/server';
import { UserService } from '@/lib/services/user.service';
import { revalidatePath } from 'next/cache';

export async function toggleSubscriptionAction(creatorId: string) {
  let userId: string | null = null;
  try {
      const authData = auth();
      userId = authData.userId;
  } catch (e: any) {
      console.error("[Subscription] Clerk Auth Handshake Failed:", e.message);
      return { error: "CLERK_ERROR", message: "Problem z autoryzacją (handshake). Sprawdź klucze API w Vercel." };
  }

  if (!userId) {
    return { error: 'AUTH_REQUIRED' };
  }

  try {
    const result = await UserService.toggleSubscription(userId, creatorId);

    revalidatePath('/', 'layout');

    return { success: true, isSubscribed: result.isSubscribed };
  } catch (error: any) {
    console.error("[TOGGLE_SUBSCRIPTION_ACTION_ERROR]", error);
    if (error.message?.includes("DATABASE_TABLES_MISSING")) {
        return { error: 'DATABASE_ERROR', message: "Baza danych nie jest gotowa (npx prisma db push)." };
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
