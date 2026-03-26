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
 */
export async function toggleVideoLike(videoId: string) {
  const { userId } = auth();
  console.log(`[Interaction] User ${userId} toggling LIKE on video ${videoId}`);

  try {
    if (!userId) {
        console.warn("[Interaction] Attempted LIKE without session.");
        return { error: "AUTH_REQUIRED" };
    }

    await UserService.getOrCreateUser(userId);

    const result = await prisma.$transaction(async (tx) => {
      // 1. Remove existing dislike if any
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

      // 2. Toggle Like
      const existingLike = await tx.videoLike.findUnique({
        where: { userId_videoId: { userId, videoId } }
      });

      if (existingLike) {
        await tx.videoLike.delete({ where: { id: existingLike.id } });
        await tx.video.update({
          where: { id: videoId },
          data: { likesCount: { decrement: 1 } }
        });
        return { liked: false, disliked: false };
      } else {
        await tx.videoLike.create({ data: { userId, videoId } });
        await tx.video.update({
          where: { id: videoId },
          data: { likesCount: { increment: 1 } }
        });
        return { liked: true, disliked: false };
      }
    });

    // Global revalidation to ensure all components see the new counts
    revalidatePath('/', 'layout');
    console.log(`[Interaction] LIKE toggle success for user ${userId}:`, result);
    return result;
  } catch (error: any) {
    console.error("[TOGGLE_LIKE_ERROR]", error);
    return { error: error.message || "INTERNAL_ERROR" };
  }
}

/**
 * Toggles a 'Dislike' on a video.
 */
export async function toggleVideoDislike(videoId: string) {
  const { userId } = auth();
  console.log(`[Interaction] User ${userId} toggling DISLIKE on video ${videoId}`);

  try {
    if (!userId) {
        console.warn("[Interaction] Attempted DISLIKE without session.");
        return { error: "AUTH_REQUIRED" };
    }

    await UserService.getOrCreateUser(userId);

    const result = await prisma.$transaction(async (tx) => {
      // 1. Remove existing like if any
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

      // 2. Toggle Dislike
      const existingDislike = await tx.videoDislike.findUnique({
        where: { userId_videoId: { userId, videoId } }
      });

      if (existingDislike) {
        await tx.videoDislike.delete({ where: { id: existingDislike.id } });
        await tx.video.update({
          where: { id: videoId },
          data: { dislikesCount: { decrement: 1 } }
        });
        return { liked: false, disliked: false };
      } else {
        await tx.videoDislike.create({ data: { userId, videoId } });
        await tx.video.update({
          where: { id: videoId },
          data: { dislikesCount: { increment: 1 } }
        });
        return { liked: false, disliked: true };
      }
    });

    revalidatePath('/', 'layout');
    console.log(`[Interaction] DISLIKE toggle success for user ${userId}:`, result);
    return result;
  } catch (error: any) {
    console.error("[TOGGLE_DISLIKE_ERROR]", error);
    return { error: error.message || "INTERNAL_ERROR" };
  }
}
