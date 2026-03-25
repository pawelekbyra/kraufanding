'use server';

import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

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
  const { userId: clerkUserId } = auth();
  if (!clerkUserId) throw new Error("Unauthorized");

  const user = await prisma.user.findUnique({
    where: { clerkUserId },
    select: { id: true }
  });

  if (!user) {
    throw new Error("User not found in database. Please wait for synchronization or try again later.");
  }

  return await prisma.$transaction(async (tx) => {
    const existingLike = await tx.videoLike.findUnique({
      where: {
        userId_videoId: {
          userId: user.id,
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
          userId: user.id,
          videoId
        }
      });
      // Increment video.likesCount
      await tx.video.update({
          where: { id: videoId },
          data: { likesCount: { increment: 1 } }
      });
      return { liked: true };
    }
  });
}
