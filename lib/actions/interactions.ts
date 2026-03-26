'use server';

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { UserService } from "@/lib/services/user.service";
import { revalidatePath } from "next/cache";

/**
 * Increments the view count for a video.
 */
export async function incrementVideoViews(videoId: string) {
  try {
    await prisma.video.update({
      where: { id: videoId },
      data: { views: { increment: 1 } }
    });
  } catch (error) {
    console.error("[INCREMENT_VIEWS_ERROR]", error);
  }
}

/**
 * Toggles a 'Like' on a video.
 * Mutually exclusive with 'Dislike': liking a video removes any existing dislike.
 */
export async function toggleVideoLike(videoId: string) {
  try {
    const { userId } = auth();
    if (!userId) return { error: "AUTH_REQUIRED" };

    // Sync user record
    await UserService.getOrCreateUser(userId);

    return await prisma.$transaction(async (tx) => {
      // 1. Check for existing dislike and remove it
      const existingDislike = await tx.videoDislike.findUnique({
        where: { userId_videoId: { userId, videoId } }
      });

      if (existingDislike) {
        await tx.videoDislike.delete({ where: { id: existingDislike.id } });
        await tx.video.update({
          where: { id: videoId },
          data: { dislikesCount: { decrement: 1 } }
        });
      }

      // 2. Toggle the Like
      const existingLike = await tx.videoLike.findUnique({
        where: { userId_videoId: { userId, videoId } }
      });

      if (existingLike) {
        await tx.videoLike.delete({ where: { id: existingLike.id } });
        await tx.video.update({
          where: { id: videoId },
          data: { likesCount: { decrement: 1 } }
        });
        revalidatePath('/');
        return { liked: false, disliked: false };
      } else {
        await tx.videoLike.create({ data: { userId, videoId } });
        await tx.video.update({
          where: { id: videoId },
          data: { likesCount: { increment: 1 } }
        });
        revalidatePath('/');
        return { liked: true, disliked: false };
      }
    });
  } catch (error: any) {
    console.error("[TOGGLE_LIKE_ERROR]", error);
    return { error: error.message || "INTERNAL_ERROR" };
  }
}

/**
 * Toggles a 'Dislike' on a video.
 * Mutually exclusive with 'Like': disliking a video removes any existing like.
 */
export async function toggleVideoDislike(videoId: string) {
  try {
    const { userId } = auth();
    if (!userId) return { error: "AUTH_REQUIRED" };

    // Sync user record
    await UserService.getOrCreateUser(userId);

    return await prisma.$transaction(async (tx) => {
      // 1. Check for existing like and remove it
      const existingLike = await tx.videoLike.findUnique({
        where: { userId_videoId: { userId, videoId } }
      });

      if (existingLike) {
        await tx.videoLike.delete({ where: { id: existingLike.id } });
        await tx.video.update({
          where: { id: videoId },
          data: { likesCount: { decrement: 1 } }
        });
      }

      // 2. Toggle the Dislike
      const existingDislike = await tx.videoDislike.findUnique({
        where: { userId_videoId: { userId, videoId } }
      });

      if (existingDislike) {
        await tx.videoDislike.delete({ where: { id: existingDislike.id } });
        await tx.video.update({
          where: { id: videoId },
          data: { dislikesCount: { decrement: 1 } }
        });
        revalidatePath('/');
        return { liked: false, disliked: false };
      } else {
        await tx.videoDislike.create({ data: { userId, videoId } });
        await tx.video.update({
          where: { id: videoId },
          data: { dislikesCount: { increment: 1 } }
        });
        revalidatePath('/');
        return { liked: false, disliked: true };
      }
    });
  } catch (error: any) {
    console.error("[TOGGLE_DISLIKE_ERROR]", error);
    return { error: error.message || "INTERNAL_ERROR" };
  }
}
