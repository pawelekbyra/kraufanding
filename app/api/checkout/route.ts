import { auth, currentUser } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import Stripe from 'stripe';

// BEZWZGLEDNE ZABICIE CACHE
export const dynamic = 'force-dynamic';
export const revalidate = 0;

const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2024-12-18.acacia' as any,
    })
  : null;

/**
 * KATEGORYCZNIE ZABRONIONE UZYWANIE GET
 */
export async function GET() {
  return NextResponse.json(
    { error: "Method Not Allowed", message: "Stripe Checkout session must be initiated via POST request." },
    { status: 405 }
  );
}

export async function POST(req: NextRequest) {
  if (!stripe) {
    console.error("[STRIPE_ERROR] Secret key is missing");
    return NextResponse.json({ error: "Stripe not configured" }, { status: 500 });
  }

  try {
    const { userId: clerkUserId } = auth();

    if (!clerkUserId) {
      return NextResponse.json({
        error: "Unauthorized",
        message: "Twoja sesja wygasła lub nie jesteś zalogowany. Proszę zaloguj się ponownie."
      }, { status: 401 });
    }

    // Ultra-Robust Lazy Sync Fallback - Ensure DB user exists before Stripe call
    try {
        let localUser = await prisma.user.findUnique({ where: { clerkUserId } });

        if (!localUser) {
            console.log(`[LAZY_SYNC] User ${clerkUserId} not found in DB, attempting sync...`);
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
        // We continue even if sync fails, as long as we have clerkUserId we might be able to recover later
        // but typically we want the user in DB for the webhook to work correctly.
    }

    const body = await req.json();
    const { amount, title } = body;

    if (!amount || amount < 5) {
      return NextResponse.json({
        error: "Bad Request",
        message: "Minimalna kwota wsparcia to 5 EUR."
      }, { status: 400 });
    }

    const appUrl = (process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000').replace(/\/$/, '');

    // Generate fresh session ON-DEMAND
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: `Wsparcie: ${title || "Creator Support"}`,
              description: `Lifetime VIP Access / Patronage`,
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

    if (!session.url) {
        throw new Error("Failed to generate Stripe session URL");
    }

    // Return fresh URL for immediate window.location.href redirect
    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error("[STRIPE_CHECKOUT_ERROR]", error);
    return NextResponse.json({
      error: "Internal Server Error",
      message: error.message || "Wystąpił nieoczekiwany błąd podczas generowania sesji płatności."
    }, { status: 500 });
  }
}
