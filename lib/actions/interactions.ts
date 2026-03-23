'use server';

import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function incrementProjectViews(projectId: string) {
  try {
    await prisma.project.update({
      where: { id: projectId },
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

export async function toggleProjectLike(projectId: string) {
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

  const existingLike = await prisma.projectLike.findUnique({
    where: {
      userId_projectId: {
        userId: user.id,
        projectId
      }
    }
  });

  if (existingLike) {
    await prisma.projectLike.delete({
      where: { id: existingLike.id }
    });
    return { liked: false };
  } else {
    await prisma.projectLike.create({
      data: {
        userId: user.id,
        projectId
      }
    });
    return { liked: true };
  }
}

export async function toggleSubscription() {
  const { userId: clerkUserId } = auth();
  if (!clerkUserId) throw new Error("Unauthorized");

  let user = await prisma.user.findUnique({
    where: { clerkUserId },
    select: { id: true, isSubscribed: true }
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

  const updatedUser = await prisma.user.update({
    where: { id: user.id },
    data: {
      isSubscribed: !user.isSubscribed
    }
  });

  return { isSubscribed: updatedUser.isSubscribed };
}
