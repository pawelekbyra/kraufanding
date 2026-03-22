import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

export const dynamic = 'force-dynamic';

const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2024-12-18.acacia' as any,
    })
  : null;

export async function POST(req: Request) {
  if (!stripe) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 500 });
  }
  try {
    const { userId: clerkUserId } = auth();
    if (!clerkUserId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { amount, projectId, tierLevel, title } = await req.json();

    if (!amount || !projectId || !tierLevel) {
      return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card', 'blik'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: `Support Project: ${title || "Nowoczesny plecak smart"}`,
              description: `Access Level ${tierLevel}`,
            },
            unit_amount: Math.round(amount * 100), // convert to cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/projects?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/projects?canceled=true`,
      metadata: {
        clerkUserId,
        projectId,
        tierLevel: tierLevel.toString(),
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("[STRIPE_CHECKOUT_ERROR]", error);
    return NextResponse.json({
      error: "Internal Error",
      message: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}
