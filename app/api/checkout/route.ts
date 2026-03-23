import { auth, currentUser } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
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
      console.error("[STRIPE_CHECKOUT] No clerkUserId found in auth().");
      return NextResponse.json({ error: "Unauthorized", message: "Proszę zaloguj się ponownie, aby dokonać wpłaty." }, { status: 401 });
    }

    // Sync user to DB if not exists
    try {
        let user = await prisma.user.findUnique({ where: { clerkUserId } });
        if (!user) {
            const clerkUser = await currentUser();
            if (clerkUser) {
                const email = clerkUser.primaryEmailAddress?.emailAddress || clerkUser.emailAddresses[0]?.emailAddress || `user_${clerkUserId}@polutek.pl`;
                const imageUrl = clerkUser.imageUrl || null;
                await prisma.user.upsert({
                    where: { clerkUserId },
                    update: { email, imageUrl },
                    create: { clerkUserId, email, imageUrl }
                });
            }
        }
    } catch (e) {
        console.error("[STRIPE_CHECKOUT_USER_SYNC_ERROR]", e);
    }

    const { amount, projectId, tierLevel, title } = await req.json();

    if (!amount || !projectId || !tierLevel) {
      return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
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
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/?canceled=true`,
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
