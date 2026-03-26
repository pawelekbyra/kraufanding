'use server';

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function getUserTips() {
  const { userId } = auth();
  if (!userId) return [];

  try {
    const transactions = await prisma.transaction.findMany({
      where: {
        userId: userId,
        status: 'COMPLETED'
      },
      orderBy: { createdAt: 'desc' }
    });

    return transactions;
  } catch (error) {
    console.error("[GET_USER_TIPS_ERROR]", error);
    return [];
  }
}
