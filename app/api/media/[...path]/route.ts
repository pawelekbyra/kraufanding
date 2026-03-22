import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getGatedBlobResponse } from '@/lib/blob';
import { prisma } from '@/lib/prisma';

export async function GET(
  req: NextRequest,
  { params }: { params: { path: string[] } }
) {
  const { userId } = auth();
  const { searchParams } = new URL(req.url);

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const projectId = searchParams.get('projectId');

  if (!projectId) {
    return NextResponse.json({ error: 'Bad Request: projectId is required' }, { status: 400 });
  }

  const filePath = params.path.join('/');

  // Fetch the file configuration from the database to get the true minTier
  const projectFile = await prisma.projectFile.findUnique({
    where: { path: filePath },
  });

  if (!projectFile) {
    // If not found in DB, default to at least level 1 (FREE)
    // and assume the user is trying to access a generic file.
    // In a strict environment, you might return 404 here.
    const minTier = 1;
    const fullUrl = `https://${filePath}`;
    return getGatedBlobResponse(userId, projectId, fullUrl, minTier);
  }

  // Use the verified minTier from the database
  const fullUrl = projectFile.url;

  // Securely stream the gated content from Vercel Blob
  return getGatedBlobResponse(userId, projectId, fullUrl, projectFile.minTier);
}
