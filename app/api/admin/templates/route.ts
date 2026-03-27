import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { currentUser } from '@clerk/nextjs/server';

export const dynamic = 'force-dynamic';

const ADMIN_EMAIL = "pawel.perfect@gmail.com";

export async function GET() {
  const user = await currentUser();
  if (user?.primaryEmailAddress?.emailAddress !== ADMIN_EMAIL) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const template = await prisma.emailTemplate.findUnique({
        where: { name: 'WELCOME' }
    });

    return NextResponse.json(template || {
        name: 'WELCOME',
        subjectPl: 'Witaj w POLUTEK.PL!',
        bodyPl: '<p>Cześć! Cieszymy się, że jesteś z nami.</p>',
        subjectEn: 'Welcome to POLUTEK.PL!',
        bodyEn: '<p>Hi! We are happy to have you here.</p>'
    });
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch template" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const user = await currentUser();
  if (user?.primaryEmailAddress?.emailAddress !== ADMIN_EMAIL) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await req.json();
    const { subjectPl, bodyPl, subjectEn, bodyEn } = data;

    const updated = await prisma.emailTemplate.upsert({
      where: { name: 'WELCOME' },
      update: { subjectPl, bodyPl, subjectEn, bodyEn },
      create: { name: 'WELCOME', subjectPl, bodyPl, subjectEn, bodyEn }
    });

    return NextResponse.json(updated);
  } catch (err) {
    return NextResponse.json({ error: "Failed to update template" }, { status: 500 });
  }
}
