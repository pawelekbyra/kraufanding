'use server';

import { auth } from '@clerk/nextjs/server';
import { getProjectAccess } from './access';
import { head } from '@vercel/blob';

/**
 * Server Action to retrieve a blob URL only if the user has access.
 * Note: Since Vercel Blob URLs are public by default once known,
 * this utility acts as the gated source of truth for the signed URL
 * (if configured) or the direct URL after access validation.
 *
 * @param path - The blob identifier/URL
 * @param projectId - The project the content belongs to
 * @param minTier - The required tier for this specific file
 * @returns Object with the validated URL or an error
 */
export async function getGatedBlobUrl(path: string, projectId: string, minTier: number = 2) {
  const { userId } = auth();

  const hasAccess = await getProjectAccess(userId, projectId, minTier);

  if (!hasAccess) {
    throw new Error('Unauthorized access to premium content');
  }

  try {
    const blobHead = await head(path);
    return { url: blobHead.url };
  } catch (error) {
    console.error('Blob metadata error:', error);
    throw new Error('Failed to retrieve file metadata');
  }
}
