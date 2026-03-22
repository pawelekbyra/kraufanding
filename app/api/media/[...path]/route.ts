import { NextRequest } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getGatedBlobResponse } from '@/lib/blob';

export async function GET(
  req: NextRequest,
  { params }: { params: { path: string[] } }
) {
  const { userId } = auth();

  if (!userId) {
    return new Response('Unauthorized', { status: 401 });
  }

  const blobUrl = params.path.join('/');

  // Here we would typically map a virtual path to a real Vercel Blob URL
  // For this demonstration, we'll assume the client sends the path they want to access.
  // In a production app, you'd look up the actual blob URL in a DB based on a slug or ID.

  // For now, let's assume 'params.path' is the intended Vercel Blob URL (after https:// prefixing if needed)
  // or a key we look up.

  const fullUrl = `https://${blobUrl}`;

  // We can't easily verify the project/tier without more metadata in the request,
  // but we can at least demonstrate the gated response utility.
  // In a real scenario, you'd pass the actual project ID and required tier level here.
  return getGatedBlobResponse(fullUrl, userId, 'project_1', 1);
}
