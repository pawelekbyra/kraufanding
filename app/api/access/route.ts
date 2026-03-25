import { auth } from '@clerk/nextjs/server';
import { getVideoAccess } from '@/lib/access';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const videoId = searchParams.get('videoId');

    if (!videoId) {
      return NextResponse.json({ error: 'Missing videoId' }, { status: 400 });
    }

    const { userId } = auth();
    const access = await getVideoAccess(userId, videoId);

    return NextResponse.json(access);
  } catch (error: any) {
    console.error("[ACCESS_API_ERROR]", error);

    // Fallback if DB fails - try to at least provide mock access info if possible
    const { searchParams } = new URL(req.url);
    const videoId = searchParams.get('videoId');

    return NextResponse.json({
      hasAccess: false,
      error: "Internal Server Error",
      message: error.message
    }, { status: 500 });
  }
}
