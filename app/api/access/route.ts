import { auth } from '@clerk/nextjs/server';
import { getProjectAccess } from '@/lib/access';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const projectId = searchParams.get('projectId');

  if (!projectId) {
    return NextResponse.json({ error: 'Missing projectId' }, { status: 400 });
  }

  const { userId } = auth();
  const tierLevel = await getProjectAccess(userId, projectId);

  return NextResponse.json({ tierLevel });
}
