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

  const videos = await prisma.video.findMany({
    orderBy: { createdAt: 'desc' },
    include: { creator: true }
  });

  return NextResponse.json(videos);
}

export async function POST(req: Request) {
  if (!(await verifyAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const { id, title, slug, description, videoUrl, thumbnailUrl, tier, likesCount, views, isMain } = body;

  try {
    // If we have an ID, we update. If not, we create.
    if (id) {
      const updated = await prisma.video.update({
        where: { id },
        data: {
          title,
          slug,
          description,
          videoUrl,
          thumbnailUrl,
          tier,
          likesCount: parseInt(likesCount) || 0,
          views: parseInt(views) || 0,
          isMain: !!isMain
        }
      });

      // If this video is marked as main, unset isMain for all other videos
      if (isMain) {
        await prisma.video.updateMany({
          where: { id: { not: id } },
          data: { isMain: false }
        });
      }

      return NextResponse.json(updated);
    } else {
      // Create logic requires a creator. Ensure at least one creator exists.
      let creator = await prisma.creator.findFirst();
      if (!creator) {
        // Create a default creator for Paweł if none exists
        const user = await prisma.user.findFirst({ where: { email: ADMIN_EMAIL } });
        if (!user) return NextResponse.json({ error: 'Admin user not found in DB. Please log in first.' }, { status: 400 });

        creator = await prisma.creator.create({
          data: {
            userId: user.id,
            name: "Paweł Polutek",
            slug: "polutek",
          }
        });
      }

      const created = await prisma.video.create({
        data: {
          creatorId: creator.id,
          title,
          slug,
          description,
          videoUrl,
          thumbnailUrl,
          tier: tier || 'PUBLIC',
          likesCount: parseInt(likesCount) || 0,
          views: parseInt(views) || 0,
          isMain: !!isMain
        }
      });

      if (isMain) {
        await prisma.video.updateMany({
          where: { id: { not: created.id } },
          data: { isMain: false }
        });
      }

      return NextResponse.json(created);
    }
  } catch (error: any) {
    console.error("[ADMIN_VIDEO_POST_ERROR]", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
