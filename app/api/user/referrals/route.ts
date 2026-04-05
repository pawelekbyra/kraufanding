import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const { userId } = auth();

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { referralCount: true, referralPoints: true, referralCode: true }
    });

    return NextResponse.json({
      referralCount: user?.referralCount || 0,
      referralPoints: user?.referralPoints || 0,
      referralCode: user?.referralCode || userId
    });
  } catch (error) {
    console.error("[REFERRALS_API_ERROR]", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
