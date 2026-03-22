import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  const { userId: clerkUserId } = auth();

  if (!clerkUserId) {
    return NextResponse.json({ success: false, message: 'Authentication required.' }, { status: 401 });
  }

  try {
    const user = await prisma.user.findUnique({ where: { clerkUserId } });
    if (!user) {
        return NextResponse.json({ success: false, message: 'User not found.' }, { status: 404 });
    }

    const { commentId } = await request.json();

    if (!commentId) {
      return NextResponse.json({ success: false, message: 'commentId is required' }, { status: 400 });
    }

    // Check if like exists
    const existingLike = await prisma.commentLike.findUnique({
        where: {
            userId_commentId: {
                userId: user.id,
                commentId
            }
        }
    });

    if (existingLike) {
        // Remove like
        await prisma.commentLike.delete({
            where: {
                id: existingLike.id
            }
        });
        return NextResponse.json({ success: true, liked: false });
    } else {
        // Add like
        await prisma.commentLike.create({
            data: {
                userId: user.id,
                commentId
            }
        });
        return NextResponse.json({ success: true, liked: true });
    }
  } catch (error: any) {
    console.error('Error toggling like:', error);
    return NextResponse.json({ success: false, message: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
