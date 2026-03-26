import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { ContentService } from '@/lib/services/content.service';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const { userId } = auth();
  const { searchParams } = new URL(req.url);
  const videoId = searchParams.get('videoId');

  if (!videoId) {
    return NextResponse.json({ error: 'Video ID is required' }, { status: 400 });
  }

  try {
    const access = await ContentService.getVideoAccess(userId, videoId);
    return NextResponse.json(access);
  } catch (error: any) {
    console.error("[ACCESS_API_ERROR]", error);
    return NextResponse.json({
        error: "Internal Error",
        message: error.message || "Unknown error during access check"
    }, { status: 500 });
  }
}
