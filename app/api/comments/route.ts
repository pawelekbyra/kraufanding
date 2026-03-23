import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth, currentUser } from '@clerk/nextjs/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const entityId = searchParams.get('entityId');
  const entityType = searchParams.get('entityType') || 'PROJECT';
  const cursor = searchParams.get('cursor') || undefined;
  const limit = parseInt(searchParams.get('limit') || '20', 10);

  if (!entityId) {
    return NextResponse.json({ success: false, message: 'entityId is required' }, { status: 400 });
  }

  const { userId: clerkUserId } = auth();

  try {
    let internalUserId = null;
    if (clerkUserId) {
        const user = await prisma.user.findUnique({ where: { clerkUserId } }).catch(() => null);
        internalUserId = user?.id;
    }

    const comments = await prisma.comment.findMany({
      where: { entityId, entityType, parentId: null },
      take: limit,
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id: cursor } : undefined,
      orderBy: { createdAt: 'desc' },
      include: {
        author: {
          select: { id: true, email: true }
        },
        replies: {
          include: {
            author: { select: { id: true, email: true } },
            _count: { select: { likes: true } }
          },
          orderBy: { createdAt: 'asc' }
        },
        _count: {
          select: { likes: true, replies: true }
        }
      }
    });

    const mapComment = async (c: any) => {
        let isLiked = false;
        try {
            if (internalUserId) {
                const like = await prisma.commentLike.findUnique({
                    where: { userId_commentId: { userId: internalUserId, commentId: c.id } }
                });
                isLiked = !!like;
            }
        } catch (e) {
            console.error("Error checking like status:", e);
        }

        const replies = c.replies ? await Promise.all(c.replies.map(async (r: any) => {
            let rLiked = false;
            try {
                if (internalUserId) {
                    const rLike = await prisma.commentLike.findUnique({
                        where: { userId_commentId: { userId: internalUserId, commentId: r.id } }
                    });
                    rLiked = !!rLike;
                }
            } catch (e) {
                console.error("Error checking reply like status:", e);
            }
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
    console.error('Error fetching comments:', error);
    return NextResponse.json({ success: false, message: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const { userId: clerkUserId } = auth();

  if (!clerkUserId) {
    return NextResponse.json({ success: false, message: 'Authentication required to comment.' }, { status: 401 });
  }

  try {
    let user = await prisma.user.findUnique({ where: { clerkUserId } });

    if (!user) {
        const clerkUser = await currentUser();
        if (!clerkUser) {
            return NextResponse.json({ success: false, message: 'Clerk user not found.' }, { status: 404 });
        }

        user = await prisma.user.create({
            data: {
                clerkUserId,
                email: clerkUser.primaryEmailAddress?.emailAddress || "",
            }
        });
    }

    const { entityId, entityType, text, parentId, imageUrl } = await request.json();

    if (!entityId || (!text && !imageUrl)) {
      return NextResponse.json({ success: false, message: 'entityId and text or imageUrl are required' }, { status: 400 });
    }

    const newComment = await prisma.comment.create({
        data: {
            entityId,
            entityType: entityType || 'PROJECT',
            text: text?.trim() || '',
            authorId: user.id,
            parentId: parentId || null,
            imageUrl: imageUrl || null,
        },
        include: {
            author: {
                select: { id: true, email: true }
            },
            _count: {
                select: { likes: true, replies: true }
            }
        }
    });

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
    return NextResponse.json({ success: false, message: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
    const { userId: clerkUserId } = auth();
    if (!clerkUserId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const user = await prisma.user.findUnique({ where: { clerkUserId } });
        const { searchParams } = new URL(request.url);
        const commentId = searchParams.get('id');

        if (!commentId || !user) {
            return NextResponse.json({ error: "Missing ID or user" }, { status: 400 });
        }

        const comment = await prisma.comment.findUnique({
            where: { id: commentId }
        });

        if (!comment) {
            return NextResponse.json({ error: "Comment not found" }, { status: 404 });
        }

        if (comment.authorId !== user.id) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        await prisma.comment.delete({
            where: { id: commentId }
        });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
