import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';
import { UserService } from '@/lib/services/user.service';

export const dynamic = 'force-dynamic';

/**
 * API Route for toggling a 'Dislike' on a comment.
 * Mutually exclusive with 'Like'.
 */
export async function POST(request: NextRequest) {
  const { userId } = auth();

  if (!userId) {
    return NextResponse.json({ success: false, message: 'Musisz być zalogowany.' }, { status: 401 });
  }

  try {
    await UserService.getOrCreateUser(userId);

    const { commentId } = await request.json();

    if (!commentId) {
      return NextResponse.json({ success: false, message: 'Brak ID komentarza.' }, { status: 400 });
    }

    return await prisma.$transaction(async (tx) => {
        // 1. Remove existing like if any
        await tx.commentLike.deleteMany({
            where: { userId, commentId }
        });

        // 2. Toggle Dislike
        const existingDislike = await tx.commentDislike.findUnique({
            where: { userId_commentId: { userId, commentId } }
        });

        if (existingDislike) {
            await tx.commentDislike.delete({ where: { id: existingDislike.id } });
            return NextResponse.json({ success: true, liked: false, disliked: false });
        } else {
            await tx.commentDislike.create({ data: { userId, commentId } });
            return NextResponse.json({ success: true, liked: false, disliked: true });
        }
    });
  } catch (error: any) {
    console.error('[COMMENT_DISLIKE_ERROR]', error);
    return NextResponse.json({ success: false, message: 'Wystąpił błąd podczas oceniania komentarza.' }, { status: 500 });
  }
}
