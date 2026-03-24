import { auth } from '@clerk/nextjs/server';
import { getVideoAccess } from '@/lib/access';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const videoId = searchParams.get('videoId');

  if (!videoId) {
    return NextResponse.json({ error: 'Missing videoId' }, { status: 400 });
  }

  const { userId } = auth();
  const access = await getVideoAccess(userId, videoId);

  return NextResponse.json(access);
}
