import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getGatedBlobResponse } from '@/lib/blob';
import { prisma } from '@/lib/prisma';

export async function GET(
  req: NextRequest,
  { params }: { params: { path: string[] } }
) {
  const { userId } = auth();
  const { searchParams } = new URL(req.url);

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const videoId = searchParams.get('videoId');

  if (!videoId) {
    return NextResponse.json({ error: 'Bad Request: videoId is required' }, { status: 400 });
  }

  const video = await prisma.video.findUnique({
    where: { id: videoId },
  });

  if (!video) {
    return NextResponse.json({ error: 'Video not found' }, { status: 404 });
  }

  // Securely stream the gated content from Vercel Blob
  return getGatedBlobResponse(userId, videoId, video.videoUrl);
}
