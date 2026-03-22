'use server';

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function getUserTips() {
  const { userId: clerkUserId } = auth();

  if (!clerkUserId) {
    throw new Error("Unauthorized");
  }

  const user = await prisma.user.findUnique({
    where: { clerkUserId },
    select: { id: true }
  });

  if (!user) {
    return [];
  }

  const tips = await prisma.tip.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' }
  });

  return tips;
}
