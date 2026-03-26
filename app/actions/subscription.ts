'use server';

import { auth } from '@clerk/nextjs/server';
import { UserService } from '@/lib/services/user.service';
import { revalidatePath } from 'next/cache';

export async function toggleSubscriptionAction(creatorId: string) {
  const { userId } = auth();

  if (!userId) {
    return { error: 'UNAUTHORIZED' };
  }

  try {
    const result = await UserService.toggleSubscription(userId, creatorId);

    // Optional: revalidate any paths that show subscription status
    revalidatePath('/');
    revalidatePath(`/channel/[slug]`, 'page');

    return { success: true, isSubscribed: result.isSubscribed };
  } catch (error: any) {
    console.error("[TOGGLE_SUBSCRIPTION_ACTION_ERROR]", error);
    return { error: error.message || 'INTERNAL_ERROR' };
  }
}

export async function getSubscriptionStatusAction(creatorId: string) {
    const { userId } = auth();
    if (!userId) return { isSubscribed: false };

    try {
        const isSubscribed = await UserService.isSubscribed(userId, creatorId);
        return { isSubscribed };
    } catch (error) {
        return { isSubscribed: false };
    }
}
