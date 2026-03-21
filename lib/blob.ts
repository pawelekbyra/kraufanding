import { get } from "@vercel/blob";
import { getProjectAccess } from "./access";
import { NextResponse } from 'next/server';

/**
 * Serves a private Vercel Blob file as a stream.
 * Access is restricted based on the user's project tier.
 *
 * @param clerkUserId The Clerk user ID
 * @param projectId The project ID
 * @param blobUrl The original Vercel Blob URL
 * @param minTier The minimum tier required to access this file
 * @returns A NextResponse streaming the file, or a 403/404 response
 */
export async function getGatedBlobResponse(
  clerkUserId: string | null,
  projectId: string,
  blobUrl: string,
  minTier: number
) {
  const userTierLevel = await getProjectAccess(clerkUserId, projectId);

  if (userTierLevel < minTier) {
    return new NextResponse('Forbidden', { status: 403 });
  }

  try {
    const result = await get(blobUrl, { access: 'private' });

    if (!result || result.statusCode !== 200) {
      return new NextResponse('Not found', { status: 404 });
    }

    return new NextResponse(result.stream, {
      headers: {
        'Content-Type': result.blob.contentType || 'application/octet-stream',
        'Content-Disposition': result.blob.contentDisposition,
      },
    });
  } catch (error) {
    console.error('Error accessing gated Blob:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
