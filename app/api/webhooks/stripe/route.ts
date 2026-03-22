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
    console.error('Stripe keys not configured');
    return NextResponse.json({ error: 'Stripe keys not configured' }, { status: 500 });
  }

  const stripe = new Stripe(stripeKey, {
    apiVersion: '2024-12-18.acacia' as any,
  });

  const body = await req.text();
  const sig = headers().get('stripe-signature');

  if (!sig) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err: any) {
    console.error(`Webhook Error: ${err.message}`);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  console.log(`Processing event: ${event.type}`);

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      const clerkUserId = session.metadata?.clerkUserId;
      const projectId = session.metadata?.projectId;
      // Stripe metadata is always strings; ensure robust parsing
      const tierLevelStr = session.metadata?.tierLevel || "0";
      const tierLevel = parseInt(tierLevelStr, 10);
      const mode = session.mode;

      if (clerkUserId && projectId) {
        console.log(`Updating access for user ${clerkUserId} in project ${projectId} to tier ${tierLevel}`);

        // Map tierLevel to UserTier enum
        let userTier: UserTier = UserTier.FREE;
        if (tierLevel === 2) userTier = UserTier.OBSERVER;
        else if (tierLevel === 3) userTier = UserTier.WITNESS;
        else if (tierLevel === 4) userTier = UserTier.INSIDER;
        else if (tierLevel === 5) userTier = UserTier.ARCHITECT;

        const user = await prisma.user.upsert({
          where: { clerkUserId },
          update: {
            stripeCustomerId: session.customer as string,
            tier: userTier
          },
          create: {
            clerkUserId,
            email: session.customer_details?.email || "",
            stripeCustomerId: session.customer as string,
            tier: userTier
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
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription;

      const sub = await prisma.subscription.update({
        where: { stripeSubscriptionId: subscription.id },
        data: { status: 'canceled' },
        include: { user: true }
      }).catch(() => null);

      if (sub && sub.user) {
        // Find if this user had active project access via subscription
        // and downgrade them to FREE tier for that project.
        await prisma.userProjectAccess.updateMany({
          where: {
            userId: sub.user.id,
            accessType: 'subscription'
          },
          data: {
            tierLevel: 1, // Reset to FREE
            expiresAt: new Date() // Expire now
          }
        });

        // Also reset user global tier if it was tied to this sub
        await prisma.user.update({
          where: { id: sub.user.id },
          data: { tier: UserTier.FREE }
        });
      }
      break;
    }

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
