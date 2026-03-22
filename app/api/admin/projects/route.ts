import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

async function isAuthorized(clerkUserId: string | null) {
  if (!clerkUserId) return false;
  const user = await prisma.user.findUnique({
    where: { clerkUserId },
    select: { role: true, email: true }
  });
  return user?.role === 'ADMIN' || user?.role === 'CREATOR' || user?.email === 'pawel.perfect@protonmail.com' || user?.email === 'pawel.perfect@gmail.com';
}

export async function GET() {
  const { userId } = auth();
  if (!(await isAuthorized(userId))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const projects = await prisma.project.findMany({
    include: { creator: true },
    orderBy: { createdAt: 'desc' }
  });

  return NextResponse.json(projects);
}

export async function POST(req: Request) {
  const { userId } = auth();
  if (!(await isAuthorized(userId))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { title, slug, goalAmount, status, creatorId } = await req.json();

    if (!title || !slug || !goalAmount || !creatorId) {
      return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
    }

    const project = await prisma.project.create({
      data: {
        title,
        slug,
        goalAmount: Math.round(goalAmount * 100), // convert to cents
        status: status || 'draft',
        creatorId
      }
    });

    return NextResponse.json(project, { status: 201 });
  } catch (error: any) {
    console.error("[ADMIN_PROJECT_CREATE_ERROR]", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  const { userId } = auth();
  if (!(await isAuthorized(userId))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id, title, slug, goalAmount, collectedAmount, status, creatorId } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "Project ID is required" }, { status: 400 });
    }

    const project = await prisma.project.update({
      where: { id },
      data: {
        title,
        slug,
        goalAmount: goalAmount !== undefined ? Math.round(Number(goalAmount) * 100) : undefined,
        collectedAmount: collectedAmount !== undefined ? Math.round(Number(collectedAmount) * 100) : undefined,
        status,
        creatorId
      }
    });

    return NextResponse.json(project);
  } catch (error: any) {
    console.error("[ADMIN_PROJECT_UPDATE_ERROR]", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const { userId } = auth();
  if (!(await isAuthorized(userId))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "Project ID is required" }, { status: 400 });
    }

    await prisma.project.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("[ADMIN_PROJECT_DELETE_ERROR]", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
