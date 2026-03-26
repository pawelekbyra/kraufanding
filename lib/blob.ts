import { get } from "@vercel/blob";
import { ContentService } from "./services/content.service";
import { NextResponse } from 'next/server';

/**
 * Serves a private Vercel Blob file as a stream.
 * Access is restricted based on the user's totalPaid amount.
 */
export async function getGatedBlobResponse(
  userId: string | null,
  videoId: string,
  blobUrl: string
) {
  const { hasAccess } = await ContentService.getVideoAccess(userId, videoId);

  if (!hasAccess) {
    return new NextResponse('Forbidden', { status: 403 });
  }

  try {
    const result = await get(blobUrl, { access: 'private' });

    if (!result) {
      return new NextResponse('Not found', { status: 404 });
    }

    const response = await fetch(result.blob.url);

    if (!response.ok) {
      return new NextResponse('Error fetching content', { status: response.status });
    }

    return new NextResponse(response.body, {
      headers: {
        'Content-Type': response.headers.get('Content-Type') || 'application/octet-stream',
        'Content-Disposition': response.headers.get('Content-Disposition') || 'attachment',
      },
    });
  } catch (error) {
    console.error('Error accessing gated Blob:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
