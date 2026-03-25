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

  let user = await prisma.user.findUnique({
    where: { clerkUserId },
    select: { id: true }
  });

  if (!user) {
    const clerkUser = await currentUser();
    if (!clerkUser) throw new Error("Clerk User not found");
    const email = clerkUser.primaryEmailAddress?.emailAddress || clerkUser.emailAddresses[0]?.emailAddress || `user_${clerkUserId}@polutek.pl`;
    const imageUrl = clerkUser.imageUrl || null;
    user = await prisma.user.upsert({
      where: { clerkUserId },
      update: { email, imageUrl },
      create: { clerkUserId, email, imageUrl }
    });
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
