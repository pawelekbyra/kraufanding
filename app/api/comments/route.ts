import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth, currentUser } from '@clerk/nextjs/server';
import { UserService } from '@/lib/services/user.service';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const videoId = searchParams.get('videoId');
  const cursor = searchParams.get('cursor') || undefined;
  const limit = parseInt(searchParams.get('limit') || '20', 10);

  if (!videoId) {
    return NextResponse.json({ success: false, message: 'videoId is required' }, { status: 400 });
  }

  const { userId: clerkUserId } = auth();

  try {
    let internalUserId = null;
    if (clerkUserId) {
        try {
            const user = await UserService.getOrCreateUser(clerkUserId);
            internalUserId = user?.id;
        } catch (e) {
            console.error("Error syncing user during GET comments:", e);
        }
    }

    let comments: any[] = [];
    try {
        comments = await prisma.comment.findMany({
            where: { videoId, parentId: null },
            take: limit,
            skip: cursor ? 1 : 0,
            cursor: cursor ? { id: cursor } : undefined,
            orderBy: { createdAt: 'desc' },
            include: {
                author: {
                    select: { id: true, email: true, imageUrl: true }
                },
                replies: {
                    include: {
                        author: { select: { id: true, email: true, imageUrl: true } },
                        _count: { select: { likes: true } }
                    },
                    orderBy: { createdAt: 'asc' }
                },
                _count: {
                    select: { likes: true, replies: true }
                }
            }
        });
    } catch (e: any) {
        console.error("Database error fetching comments:", e);
        // P2021: Table does not exist (database not migrated yet)
        if (e.code === 'P2021') {
           return NextResponse.json({ success: true, comments: [], nextCursor: null, dbMissing: true });
        }
        return NextResponse.json({ success: true, comments: [], nextCursor: null });
    }

    const mapComment = async (c: any) => {
        let isLiked = false;
        try {
            if (internalUserId) {
                const like = await prisma.commentLike.findUnique({
                    where: { userId_commentId: { userId: internalUserId, commentId: c.id } }
        }).catch(e => {
            if (e.code === 'P2021') return null;
            throw e;
                });
                isLiked = !!like;
            }
        } catch (e) {}

        const replies = c.replies ? await Promise.all(c.replies.map(async (r: any) => {
            let rLiked = false;
            try {
                if (internalUserId) {
                    const rLike = await prisma.commentLike.findUnique({
                        where: { userId_commentId: { userId: internalUserId, commentId: r.id } }
            }).catch(e => {
                if (e.code === 'P2021') return null;
                throw e;
                    });
                    rLiked = !!rLike;
                }
            } catch (e) {}

            return {
                ...r,
                isLiked: rLiked,
                authorName: r.author?.email?.split('@')[0] || "Użytkownik",
            };
        })) : [];

        return {
            ...c,
            isLiked,
            authorName: c.author?.email?.split('@')[0] || "Użytkownik",
            replies,
        };
    };

    const commentsWithLiked = await Promise.all(comments.map(mapComment));

    const nextCursor = comments.length === limit ? comments[limit - 1].id : null;
    return NextResponse.json({ success: true, comments: commentsWithLiked, nextCursor });
  } catch (error: any) {
    console.error('General error fetching comments:', error);
    return NextResponse.json({ success: true, comments: [], nextCursor: null });
  }
}

export async function POST(request: NextRequest) {
  const { userId: clerkUserId } = auth();

  if (!clerkUserId) {
    return NextResponse.json({ success: false, message: 'Authentication required.' }, { status: 401 });
  }

  try {
    let user = await UserService.getOrCreateUser(clerkUserId);

    if (user.id === 'temp-id') {
         return NextResponse.json({ success: false, message: 'Database is currently unavailable. Please try again later.' }, { status: 503 });
    }

    let body;
    try {
        body = await request.json();
    } catch (e) {
        return NextResponse.json({ success: false, message: 'Invalid JSON body' }, { status: 400 });
    }

    const { videoId, text, parentId, imageUrl } = body;

    if (!videoId || (!text && !imageUrl)) {
      return NextResponse.json({ success: false, message: 'Missing content: videoId and (text or imageUrl) required.' }, { status: 400 });
    }

    let newComment;
    try {
        newComment = await prisma.comment.create({
            data: {
                videoId,
                text: text?.trim() || '',
                authorId: user.id,
                parentId: parentId || null,
                imageUrl: imageUrl || null,
            },
            include: {
                author: { select: { id: true, email: true, imageUrl: true } },
                _count: { select: { likes: true, replies: true } }
            }
        });
    } catch (e: any) {
        console.error("[COMMENT_POST_CREATE_ERROR]", e);
        return NextResponse.json({ success: false, message: 'Database error creating comment: ' + e.message }, { status: 500 });
    }

    return NextResponse.json({
        success: true,
        comment: {
            ...newComment,
            isLiked: false,
            authorName: newComment.author?.email?.split('@')[0] || "Użytkownik",
            replies: [],
        }
    }, { status: 201 });
  } catch (error: any) {
    console.error('Error posting comment:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
    const { userId: clerkUserId } = auth();
    if (!clerkUserId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const user = await prisma.user.findUnique({ where: { clerkUserId } });
        const { searchParams } = new URL(request.url);
        const commentId = searchParams.get('id');

        if (!commentId || !user) return NextResponse.json({ error: "Bad request" }, { status: 400 });

        const comment = await prisma.comment.findUnique({ where: { id: commentId } });
        if (!comment) return NextResponse.json({ error: "Not found" }, { status: 404 });
        if (comment.authorId !== user.id) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

        await prisma.comment.delete({ where: { id: commentId } });
        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
