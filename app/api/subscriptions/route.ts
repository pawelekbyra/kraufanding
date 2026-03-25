import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { UserService } from '@/lib/services/user.service';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const { userId: clerkUserId } = auth();
  const { searchParams } = new URL(req.url);
  const creatorId = searchParams.get('creatorId');

  if (!clerkUserId || !creatorId) {
    return NextResponse.json({ isSubscribed: false });
  }

  try {
    const isSubscribed = await UserService.isSubscribed(clerkUserId, creatorId);
    return NextResponse.json({ isSubscribed });
  } catch (error: any) {
    console.error("[SUBSCRIPTION_GET_ERROR]", error);
    return NextResponse.json({ isSubscribed: false }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const { userId: clerkUserId } = auth();

  if (!clerkUserId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { creatorId } = body;

    if (!creatorId) {
      return NextResponse.json({ error: "Creator ID is required" }, { status: 400 });
    }

    const result = await UserService.toggleSubscription(clerkUserId, creatorId);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error("[SUBSCRIPTION_POST_ERROR]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
