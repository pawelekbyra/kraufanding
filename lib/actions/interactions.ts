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
  let userId: string | null = null;
  try {
      const authData = auth();
      userId = authData.userId;
  } catch (e: any) {
      console.error("[Interaction] Clerk Auth Handshake Failed:", e.message);
      return { error: "CLERK_ERROR", message: "Problem z autoryzacją (handshake). Sprawdź klucze API w Vercel." };
  }

  console.log(`[Interaction] User ${userId} toggling LIKE on video ${videoId}`);

  try {
    if (!userId) {
        return { error: "AUTH_REQUIRED" };
    }

    // Try to sync/fetch user record.
    await UserService.getOrCreateUser(userId).catch(err => {
        console.warn("[Interaction] UserService sync issue during LIKE:", err.message);
    });

    const result = await prisma.$transaction(async (tx) => {
      // 1. Remove existing dislike
      const existingDislike = await tx.videoDislike.findUnique({
        where: { userId_videoId: { userId: userId!, videoId } }
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
        where: { userId_videoId: { userId: userId!, videoId } }
      });

      if (existingLike) {
        await tx.videoLike.delete({ where: { id: existingLike.id } });
        await tx.video.update({
          where: { id: videoId },
          data: { likesCount: { decrement: 1 } }
        });
        return { liked: false, disliked: false };
      } else {
        await tx.videoLike.create({ data: { userId: userId!, videoId } });
        await tx.video.update({
          where: { id: videoId },
          data: { likesCount: { increment: 1 } }
        });
        return { liked: true, disliked: false };
      }
    });

    revalidatePath('/', 'layout');
    return result;
  } catch (error: any) {
    console.error("[TOGGLE_LIKE_ERROR]", error);
    if (error.code === 'P2021' || error.message?.includes("DATABASE_TABLES_MISSING")) {
        return { error: "DATABASE_ERROR", message: "Baza danych nie jest gotowa. Uruchom 'npx prisma db push'." };
    }
    return { error: "INTERNAL_ERROR", message: error.message };
  }
}

/**
 * Toggles a 'Dislike' on a video.
 */
export async function toggleVideoDislike(videoId: string) {
  let userId: string | null = null;
  try {
      const authData = auth();
      userId = authData.userId;
  } catch (e: any) {
      console.error("[Interaction] Clerk Auth Handshake Failed:", e.message);
      return { error: "CLERK_ERROR", message: "Problem z autoryzacją (handshake). Sprawdź klucze API w Vercel." };
  }

  console.log(`[Interaction] User ${userId} toggling DISLIKE on video ${videoId}`);

  try {
    if (!userId) {
        return { error: "AUTH_REQUIRED" };
    }

    await UserService.getOrCreateUser(userId).catch(err => {
        console.warn("[Interaction] UserService sync issue during DISLIKE:", err.message);
    });

    const result = await prisma.$transaction(async (tx) => {
      const existingLike = await tx.videoLike.findUnique({
        where: { userId_videoId: { userId: userId!, videoId } }
      });

      if (existingLike) {
        await tx.videoLike.delete({ where: { id: existingLike.id } });
        await tx.video.update({
          where: { id: videoId },
          data: { likesCount: { decrement: 1 } }
        });
      }

      const existingDislike = await tx.videoDislike.findUnique({
        where: { userId_videoId: { userId: userId!, videoId } }
      });

      if (existingDislike) {
        await tx.videoDislike.delete({ where: { id: existingDislike.id } });
        await tx.video.update({
          where: { id: videoId },
          data: { dislikesCount: { decrement: 1 } }
        });
        return { liked: false, disliked: false };
      } else {
        await tx.videoDislike.create({ data: { userId: userId!, videoId } });
        await tx.video.update({
          where: { id: videoId },
          data: { dislikesCount: { increment: 1 } }
        });
        return { liked: false, disliked: true };
      }
    });

    revalidatePath('/', 'layout');
    return result;
  } catch (error: any) {
    console.error("[TOGGLE_DISLIKE_ERROR]", error);
    if (error.code === 'P2021' || error.message?.includes("DATABASE_TABLES_MISSING")) {
        return { error: "DATABASE_ERROR", message: "Baza danych nie jest gotowa. Uruchom 'npx prisma db push'." };
    }
    return { error: "INTERNAL_ERROR", message: error.message };
  }
}
