import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { language } = await req.json();
    if (language !== 'pl' && language !== 'en') {
      return NextResponse.json({ error: "Invalid language" }, { status: 400 });
    }

    await prisma.user.update({
      where: { id: userId },
      data: { preferredLanguage: language }
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[LANGUAGE_UPDATE_ERROR]', err);
    return NextResponse.json({ error: "Failed to update language" }, { status: 500 });
  }
}
