import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';
import { UserService } from '@/lib/services/user.service';

export const dynamic = 'force-dynamic';

/**
 * API Route for fetching comments for a video.
 * RESILIENCE: Returns empty state if DB tables are missing.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const videoId = searchParams.get('videoId');
  const cursor = searchParams.get('cursor') || undefined;
  const limit = parseInt(searchParams.get('limit') || '20', 10);

  if (!videoId) {
    return NextResponse.json({ success: false, message: 'videoId is required' }, { status: 400 });
  }

  if (!process.env.DATABASE_URL) {
    console.error("[GET_COMMENTS] DATABASE_URL is missing.");
    return NextResponse.json({ success: true, comments: [], nextCursor: null, warning: "System offline." });
  }

  let userId: string | null = null;
  try {
      const authData = auth();
      userId = authData.userId;
  } catch (e) {}

  try {
    let internalUserId = null;
    if (userId) {
        try {
            const user = await UserService.getOrCreateUser(userId);
            internalUserId = user?.id;
        } catch (e) {
            console.error("User sync failed during GET comments:", e);
        }
    }

    const comments = await prisma.comment.findMany({
        where: { videoId, parentId: null },
        take: limit,
        skip: cursor ? 1 : 0,
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: { createdAt: 'desc' },
        include: {
            author: {
                select: { id: true, email: true, name: true, username: true, imageUrl: true }
            },
            replies: {
                include: {
                    author: { select: { id: true, email: true, name: true, username: true, imageUrl: true } },
                    _count: { select: { likes: true, dislikes: true } }
                },
                orderBy: { createdAt: 'asc' }
            },
            _count: {
                select: { likes: true, dislikes: true, replies: true }
            }
        }
    });

    const mapComment = async (c: any) => {
        let isLiked = false;
        let isDisliked = false;
        if (internalUserId) {
            const [like, dislike] = await Promise.all([
                prisma.commentLike.findUnique({
                    where: { userId_commentId: { userId: internalUserId, commentId: c.id } }
                }).catch(() => null),
                prisma.commentDislike.findUnique({
                    where: { userId_commentId: { userId: internalUserId, commentId: c.id } }
                }).catch(() => null)
            ]);
            isLiked = !!like;
            isDisliked = !!dislike;
        }

        const replies = c.replies ? await Promise.all(c.replies.map(async (r: any) => {
            let rLiked = false;
            let rDisliked = false;
            if (internalUserId) {
                const [like, dislike] = await Promise.all([
                    prisma.commentLike.findUnique({
                        where: { userId_commentId: { userId: internalUserId, commentId: r.id } }
                    }).catch(() => null),
                    prisma.commentDislike.findUnique({
                        where: { userId_commentId: { userId: internalUserId, commentId: r.id } }
                    }).catch(() => null)
                ]);
                rLiked = !!like;
                rDisliked = !!dislike;
            }

            return {
                ...r,
                isLiked: rLiked,
                isDisliked: rDisliked,
                authorName: r.author?.username || r.author?.name || r.author?.email?.split('@')[0] || "Użytkownik",
            };
        })) : [];

        return {
            ...c,
            isLiked,
            isDisliked,
            authorName: c.author?.username || c.author?.name || c.author?.email?.split('@')[0] || "Użytkownik",
            replies,
        };
    };

    const commentsWithStatus = await Promise.all(comments.map(mapComment));

    const nextCursor = comments.length === limit ? comments[limit - 1].id : null;
    return NextResponse.json({ success: true, comments: commentsWithStatus, nextCursor });
  } catch (error: any) {
    console.error('[GET_COMMENTS_API_ERROR]', error);
    // P2021: Table missing - return success but empty state to avoid frontend crash
    if (error.code === 'P2021' || error.message?.includes("P2021")) {
        return NextResponse.json({ success: true, comments: [], nextCursor: null, warning: "Database not initialized. Run 'npx prisma db push'." });
    }
    return NextResponse.json({ success: false, message: 'Błąd podczas pobierania komentarzy.' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  let userId: string | null = null;
  try {
      const authData = auth();
      userId = authData.userId;
  } catch (e) {
      return NextResponse.json({
          success: false,
          error: "CLERK_ERROR",
          message: 'Błąd weryfikacji sesji (Clerk Handshake). Sprawdź klucze API CLERK_SECRET_KEY i NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY w panelu Vercel.'
      }, { status: 500 });
  }

  if (!userId) {
    return NextResponse.json({ success: false, message: 'Musisz być zalogowany.' }, { status: 401 });
  }

  try {
    await UserService.getOrCreateUser(userId);

    const body = await request.json();
    const { videoId, text, parentId, imageUrl } = body;

    if (!videoId || (!text && !imageUrl)) {
      return NextResponse.json({ success: false, message: 'Brak treści.' }, { status: 400 });
    }

    const newComment = await prisma.comment.create({
        data: {
            videoId,
            text: text?.trim() || '',
            authorId: userId,
            parentId: parentId || null,
            imageUrl: imageUrl || null,
        },
        include: {
            author: { select: { id: true, email: true, name: true, username: true, imageUrl: true } },
            _count: { select: { likes: true, dislikes: true, replies: true } }
        }
    });

    return NextResponse.json({
        success: true,
        comment: {
            ...newComment,
            isLiked: false,
            isDisliked: false,
            authorName: newComment.author?.username || newComment.author?.name || newComment.author?.email?.split('@')[0] || "Użytkownik",
            replies: [],
        }
    }, { status: 201 });
  } catch (error: any) {
    console.error('[POST_COMMENT_API_ERROR]', error);
    if (error.code === 'P2021') {
        return NextResponse.json({ success: false, message: "Baza danych nie jest gotowa (P2021)." }, { status: 503 });
    }
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
    let userId: string | null = null;
    try {
        const authData = auth();
        userId = authData.userId;
    } catch (e) {
        return NextResponse.json({ error: "Handshake Error" }, { status: 401 });
    }

    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const { searchParams } = new URL(request.url);
        const commentId = searchParams.get('id');

        if (!commentId) return NextResponse.json({ error: "Bad request" }, { status: 400 });

        const comment = await prisma.comment.findUnique({ where: { id: commentId } });
        if (!comment) return NextResponse.json({ error: "Not found" }, { status: 404 });
        if (comment.authorId !== userId) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

        await prisma.comment.delete({ where: { id: commentId } });
        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
