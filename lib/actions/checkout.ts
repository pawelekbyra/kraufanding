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
  tierLevel: number;
  title: string;
}) {
  if (!stripe) {
    throw new Error("Stripe not configured");
  }

  const { userId: clerkUserId } = auth();
  if (!clerkUserId) {
    throw new Error("Proszę zaloguj się ponownie, aby dokonać wpłaty.");
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

  const { amount, projectId, tierLevel, title } = params;

  if (!amount || !projectId || !tierLevel) {
    throw new Error("Missing parameters");
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

  return { url: session.url };
}
