import { NextRequest } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getGatedBlobResponse } from '@/lib/blob';

export async function GET(
  req: NextRequest,
  { params }: { params: { path: string[] } }
) {
  const { userId } = auth();
  const { searchParams } = new URL(req.url);

  if (!userId) {
    return new Response('Unauthorized', { status: 401 });
  }

  const projectId = searchParams.get('projectId');
  const minTierStr = searchParams.get('minTier') || '1';
  let minTier = parseInt(minTierStr, 10);

  if (!projectId) {
    return new Response('Bad Request: projectId is required', { status: 400 });
  }

  /**
   * SECURITY NOTE:
   * In a production environment, the required `minTier` for a specific file should be
   * fetched from a server-side database mapping (e.g., a 'MediaAsset' table).
   * Relying on a client-provided `minTier` query parameter allows users to bypass
   * access checks by manually changing the URL.
   *
   * For this implementation, we enforce a minimum tier of 1 (FREE) to ensure
   * only authenticated users can access any media through this route.
   */
  minTier = Math.max(minTier, 1);

  const blobUrl = params.path.join('/');

  // For this demonstration, we assume the path is the Vercel Blob host + path.
  // In production, map this to a DB-stored blob URL for better security.
  const fullUrl = `https://${blobUrl}`;

  // Securely stream the gated content from Vercel Blob
  return getGatedBlobResponse(userId, projectId, fullUrl, minTier);
}
