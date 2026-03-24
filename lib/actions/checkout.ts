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
  projectId: string;
  projectSlug?: string;
  tierLevel: number;
  title: string;
}) {
  try {
    if (!stripe) {
      return { error: "Stripe not configured" };
    }

    const { userId: clerkUserId } = auth();
    if (!clerkUserId) {
      return { error: "Proszę zaloguj się ponownie, aby dokonać wpłaty." };
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

    const { amount, projectId, projectSlug, tierLevel, title } = params;

    if (!amount || !projectId || !tierLevel) {
      return { error: "Missing parameters" };
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const redirectPath = projectSlug ? `/projects/${projectSlug}` : '/';

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: `Support Project: ${title || "Project Support"}`,
              description: `Lifetime Patron Access`,
            },
            unit_amount: Math.round(amount * 100), // convert to cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${appUrl}${redirectPath}?success=true`,
      cancel_url: `${appUrl}${redirectPath}?canceled=true`,
      metadata: {
        clerkUserId,
        projectId,
        tierLevel: tierLevel.toString(),
      },
    });

    return { url: session.url };
  } catch (error: any) {
    console.error("[STRIPE_CHECKOUT_ACTION_ERROR]", error);
    return { error: error.message || "Wystąpił nieoczekiwany błąd podczas tworzenia płatności." };
  }
}
