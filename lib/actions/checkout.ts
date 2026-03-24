'use server';

import { auth, currentUser } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import Stripe from 'stripe';

const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2024-12-18.acacia' as any,
    })
  : null;

export async function createCheckoutSession(params: {
  amount: number;
  title: string;
}) {
  try {
    if (!stripe) {
      return { error: "Stripe not configured" };
    }

    const { userId: clerkUserId } = auth();
    if (!clerkUserId) {
      return { error: "AUTH_REQUIRED: Proszę zaloguj się ponownie, aby dokonać wpłaty." };
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

    const { amount, title } = params;

    if (!amount || amount < 3) {
      return { error: "Minimum support amount is 3 EUR" };
    }

    const appUrl = (process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000').replace(/\/$/, '');

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: `Patronage: ${title || "Creator Support"}`,
              description: `Lifetime VIP Access based on total support`,
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

    return { url: session.url };
  } catch (error: any) {
    console.error("[STRIPE_CHECKOUT_ACTION_ERROR]", error);
    return { error: error.message || "Wystąpił nieoczekiwany błąd podczas tworzenia płatności." };
  }
}
