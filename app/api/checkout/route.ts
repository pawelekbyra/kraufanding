import { auth, currentUser } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import Stripe from 'stripe';

export const dynamic = 'force-dynamic';

const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2024-12-18.acacia' as any,
    })
  : null;

export async function POST(req: NextRequest) {
  if (!stripe) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 500 });
  }

  try {
    const { userId: clerkUserId } = auth();
    if (!clerkUserId) {
      return NextResponse.json({ error: "Unauthorized", message: "Proszę zaloguj się ponownie, aby dokonać wpłaty." }, { status: 401 });
    }

    // Ensure user exists in local database
    const localUser = await prisma.user.findUnique({
      where: { clerkUserId },
      select: { id: true }
    });

    if (!localUser) {
      return NextResponse.json({ error: "Sync in progress", message: "Proszę chwilę odczekać na synchronizację konta." }, { status: 403 });
    }

    const body = await req.json();
    const { amount, title } = body;

    if (!amount || amount < 5) {
      return NextResponse.json({ error: "Minimum parameters (min. 5 EUR)" }, { status: 400 });
    }

    const appUrl = (process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000').replace(/\/$/, '');

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: `Support: ${title || "Creator Support"}`,
              description: `Lifetime VIP Access`,
            },
            unit_amount: Math.round(amount * 100), // convert to cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${appUrl}/?success=true`,
      cancel_url: `${appUrl}/?canceled=true`,
      metadata: {
        clerkUserId,
        type: 'TIP_DONATION'
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error("[STRIPE_CHECKOUT_ERROR]", error);
    return NextResponse.json({
      error: "Internal Error",
      message: error.message || "Unknown error"
    }, { status: 500 });
  }
}
