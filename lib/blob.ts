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
    // 1. Get the metadata/signed URL for the private blob
    const result = await get(blobUrl, { access: 'private' });

    if (!result) {
      return new NextResponse('Not found', { status: 404 });
    }

    // 2. Fetch the actual content from the Vercel Blob storage
    const response = await fetch(result.blob.url);

    if (!response.ok) {
      return new NextResponse('Error fetching content', { status: response.status });
    }

    // 3. Return the response stream with proper headers
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

/**
 * Generates a temporary, signed URL for a Vercel Blob file.
 * This is a placeholder since Vercel Blob doesn't have a direct 'sign' method yet.
 * For true security, use `getGatedBlobResponse` via an API route.
 */
export async function getPremiumBlobUrl(
  clerkUserId: string | null,
  projectId: string,
  blobUrl: string,
  minTier: number
) {
  const userTierLevel = await getProjectAccess(clerkUserId, projectId);

  if (userTierLevel >= minTier) {
    try {
      const blobResult = await get(blobUrl, {
        access: 'private'
      });

      return blobResult?.blob?.url || null;
    } catch (error) {
      console.error('Error accessing Blob:', error);
      return null;
    }
  }

  return null;
}
