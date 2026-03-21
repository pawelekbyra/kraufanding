import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import Stripe from 'stripe';
import { UserTier } from '@prisma/client';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripeKey || !webhookSecret) {
    return NextResponse.json({ error: 'Stripe keys not configured' }, { status: 500 });
  }

  const stripe = new Stripe(stripeKey, {
    apiVersion: '2025-01-27' as any,
  });

  const body = await req.text();
  const sig = headers().get('stripe-signature')!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err: any) {
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object as Stripe.Checkout.Session;
      const clerkUserId = session.metadata?.clerkUserId;
      const projectId = session.metadata?.projectId;
      const tierLevel = parseInt(session.metadata?.tierLevel || "0");
      const mode = session.mode;

      if (clerkUserId && projectId) {
        const user = await prisma.user.upsert({
          where: { clerkUserId },
          update: {
            stripeCustomerId: session.customer as string,
            tier: tierLevel >= 2 ? (tierLevel === 5 ? UserTier.ARCHITECT : (tierLevel === 4 ? UserTier.INSIDER : (tierLevel === 3 ? UserTier.WITNESS : UserTier.OBSERVER))) : UserTier.FREE
          },
          create: {
            clerkUserId,
            email: session.customer_details?.email || "",
            stripeCustomerId: session.customer as string,
            tier: tierLevel >= 2 ? (tierLevel === 5 ? UserTier.ARCHITECT : (tierLevel === 4 ? UserTier.INSIDER : (tierLevel === 3 ? UserTier.WITNESS : UserTier.OBSERVER))) : UserTier.FREE
          }
        });

        await prisma.userProjectAccess.upsert({
          where: { userId_projectId: { userId: user.id, projectId } },
          update: {
            tierLevel: tierLevel,
            accessType: mode === 'subscription' ? 'subscription' : 'one_time_payment',
            grantedAt: new Date(),
            expiresAt: mode === 'subscription' ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) : null
          },
          create: {
            userId: user.id,
            projectId,
            tierLevel: tierLevel,
            accessType: mode === 'subscription' ? 'subscription' : 'one_time_payment',
            expiresAt: mode === 'subscription' ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) : null
          }
        });

        if (mode === 'payment') {
          await prisma.donation.create({
            data: {
              userId: user.id,
              amount: session.amount_total || 0,
              currency: session.currency?.toUpperCase() || "EUR",
              stripePaymentId: session.payment_intent as string || session.id
            }
          });
        }
      }
      break;

    case 'customer.subscription.deleted':
      const subscription = event.data.object as Stripe.Subscription;
      await prisma.subscription.update({
        where: { stripeSubscriptionId: subscription.id },
        data: { status: 'canceled' }
      }).catch(() => null);
      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
