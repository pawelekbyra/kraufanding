import { auth, currentUser } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const clerkUser = await currentUser();
  const adminEmail = "pawel.perfect@gmail.com";

  if (!clerkUser || clerkUser.primaryEmailAddress?.emailAddress !== adminEmail) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const videos = await prisma.video.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return NextResponse.json(videos);
}

export async function POST(req: Request) {
  const clerkUser = await currentUser();
  const adminEmail = "pawel.perfect@gmail.com";

  if (!clerkUser || clerkUser.primaryEmailAddress?.emailAddress !== adminEmail) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const { id, title, description, videoUrl, thumbnailUrl, tier, likesCount, views, isMain } = body;

  if (id) {
    // Update existing video
    const updated = await prisma.video.update({
      where: { id },
      data: { title, description, videoUrl, thumbnailUrl, tier, likesCount, views, isMain }
    });
    return NextResponse.json(updated);
  } else {
    // Create new video (logic needs creatorId)
    // For now, return error as creator setup is required
    return NextResponse.json({ error: 'Creator setup required' }, { status: 400 });
  }
}
