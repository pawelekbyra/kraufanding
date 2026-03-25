import { currentUser } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const ADMIN_EMAIL = "pawel.perfect@gmail.com";

async function verifyAdmin() {
  const user = await currentUser();
  if (!user || user.primaryEmailAddress?.emailAddress !== ADMIN_EMAIL) {
    return false;
  }
  return true;
}

export async function GET() {
  if (!(await verifyAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const totalUsers = await prisma.user.count();
    const totalVideos = await prisma.video.count();
    const totalRevenueResult = await prisma.transaction.aggregate({
        where: { status: 'COMPLETED' },
        _sum: { amount: true }
    });
    const totalRevenue = totalRevenueResult._sum.amount || 0;

    const recentTransactions = await prisma.transaction.findMany({
        where: { status: 'COMPLETED' },
        orderBy: { createdAt: 'desc' },
        take: 10,
        include: { user: { select: { email: true } } }
    });

    return NextResponse.json({
        totalUsers,
        totalVideos,
        totalRevenue,
        recentTransactions
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
