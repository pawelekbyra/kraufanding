'use server';

import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { UserService } from "@/lib/services/user.service";

export async function incrementVideoViews(videoId: string) {
  try {
    await prisma.video.update({
      where: { id: videoId },
      data: {
        views: {
          increment: 1
        }
      }
    });
  } catch (error) {
    console.error("Error incrementing views:", error);
  }
}

export async function toggleVideoLike(videoId: string) {
  try {
    const { userId } = auth();
    if (!userId) return { error: "AUTH_REQUIRED" };

    const user = await UserService.getOrCreateUser(userId);
    if (user.isFallback) return { error: "DATABASE_UNAVAILABLE" };

    return await prisma.$transaction(async (tx) => {
    const existingLike = await tx.videoLike.findUnique({
      where: {
        userId_videoId: {
          userId,
          videoId
        }
      }
    });

    if (existingLike) {
      await tx.videoLike.delete({
        where: { id: existingLike.id }
      });
      // Decrement video.likesCount
      await tx.video.update({
          where: { id: videoId },
          data: { likesCount: { decrement: 1 } }
      });
      return { liked: false };
    } else {
      await tx.videoLike.create({
        data: {
          userId,
          videoId
        }
      });
      // Increment video.likesCount
      await tx.video.update({
          where: { id: videoId },
          data: { likesCount: { increment: 1 } }
      });
      return { liked: true };
    });
  } catch (error: any) {
    console.error("[TOGGLE_VIDEO_LIKE_ERROR]", error);
    if (error.code === 'P2021') return { error: "DATABASE_UNAVAILABLE" };
    return { error: error.message || "INTERNAL_ERROR" };
  }
}
