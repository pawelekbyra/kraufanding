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
    const creator = await prisma.creator.findFirst({
        include: { user: true }
    });
    return NextResponse.json(creator);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  if (!(await verifyAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const { id, name, bio, slug } = body;

  try {
    if (id) {
      const updated = await prisma.creator.update({
        where: { id },
        data: { name, bio, slug }
      });
      return NextResponse.json(updated);
    } else {
        const adminUser = await prisma.user.findFirst({
            where: { email: ADMIN_EMAIL }
        });

        if (!adminUser) {
            return NextResponse.json({ error: 'Admin user not found in DB.' }, { status: 400 });
        }

        const created = await prisma.creator.create({
            data: {
                userId: adminUser.id,
                name,
                bio,
                slug,
            }
        });
        return NextResponse.json(created);
    }
  } catch (error: any) {
    console.error("[ADMIN_CREATOR_POST_ERROR]", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
