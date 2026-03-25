import { auth, currentUser } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import Stripe from 'stripe';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

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

    // Ultra-Robust Lazy Sync Fallback - Ensure DB user exists before Stripe call
    try {
        let localUser = await prisma.user.findUnique({ where: { clerkUserId } });

        if (!localUser) {
            const clerkUser = await currentUser();
            const email = clerkUser?.primaryEmailAddress?.emailAddress || clerkUser?.emailAddresses[0]?.emailAddress || `user_${clerkUserId}@polutek.pl`;
            const imageUrl = clerkUser?.imageUrl || null;

            await prisma.user.upsert({
                where: { clerkUserId },
                update: { email, imageUrl },
                create: { clerkUserId, email, imageUrl }
            });
        }
    } catch (e) {
        console.error("[STRIPE_CHECKOUT_USER_SYNC_ERROR]", e);
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
