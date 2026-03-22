import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const projectId = searchParams.get('projectId');
  const cursor = searchParams.get('cursor') || undefined;
  const limit = parseInt(searchParams.get('limit') || '20', 10);

  const { userId: clerkUserId } = auth();

  if (!projectId) {
    return NextResponse.json({ success: false, message: 'projectId is required' }, { status: 400 });
  }

  try {
    let internalUserId = null;
    if (clerkUserId) {
        const user = await prisma.user.findUnique({ where: { clerkUserId } });
        internalUserId = user?.id;
    }

    const comments = await prisma.comment.findMany({
      where: { projectId, parentId: null },
      take: limit,
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id: cursor } : undefined,
      orderBy: { createdAt: 'desc' },
      include: {
        author: {
          select: { id: true, email: true } // Adapt to our User model
        },
        _count: {
          select: { likes: true, replies: true }
        }
      }
    });

    const commentsWithLiked = await Promise.all(comments.map(async (c) => {
        const isLiked = internalUserId ? !!(await prisma.commentLike.findUnique({
            where: { userId_commentId: { userId: internalUserId, commentId: c.id } }
        })) : false;
        return {
            ...c,
            isLiked,
            authorName: c.author.email.split('@')[0], // Fallback name
        };
    }));

    const nextCursor = comments.length === limit ? comments[limit - 1].id : null;
    return NextResponse.json({ success: true, comments: commentsWithLiked, nextCursor });
  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const { userId: clerkUserId } = auth();

  if (!clerkUserId) {
    return NextResponse.json({ success: false, message: 'Authentication required to comment.' }, { status: 401 });
  }

  try {
    const user = await prisma.user.findUnique({ where: { clerkUserId } });
    if (!user) {
        return NextResponse.json({ success: false, message: 'User not found in database.' }, { status: 404 });
    }

    const { projectId, text, parentId, imageUrl } = await request.json();

    if (!projectId || (!text && !imageUrl)) {
      return NextResponse.json({ success: false, message: 'projectId and text or imageUrl are required' }, { status: 400 });
    }

    const newComment = await prisma.comment.create({
        data: {
            projectId,
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
            authorName: newComment.author.email.split('@')[0],
        }
    }, { status: 201 });
  } catch (error: any) {
    console.error('Error posting comment:', error);
    return NextResponse.json({ success: false, message: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
