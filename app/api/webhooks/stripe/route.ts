import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import Stripe from 'stripe';
import { UserTier } from '@prisma/client';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripeKey || !webhookSecret) {
    console.error('Stripe keys not configured');
    return NextResponse.json({ error: 'Stripe keys not configured' }, { status: 500 });
  }

  const stripe = new Stripe(stripeKey, {
    apiVersion: '2025-01-27' as any,
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

  if (process.env.DATABASE_URL) {
      const { prisma } = await import('@/lib/prisma');

      // Handle the event
      switch (event.type) {
        case 'checkout.session.completed': {
          const session = event.data.object as Stripe.Checkout.Session;
          const clerkUserId = session.metadata?.clerkUserId;
          const projectId = session.metadata?.projectId;
          const tierLevel = parseInt(session.metadata?.tierLevel || "0");
          const mode = session.mode;

          if (clerkUserId && projectId) {
            console.log(`Updating access for user ${clerkUserId} in project ${projectId} to tier ${tierLevel}`);

            // Map tierLevel to UserTier enum for global status (optional, but good for consistency)
            let userTier: UserTier = UserTier.FREE;
            if (tierLevel === 2) userTier = UserTier.OBSERVER;
            else if (tierLevel === 3) userTier = UserTier.WITNESS;
            else if (tierLevel === 4) userTier = UserTier.INSIDER;
            else if (tierLevel === 5) userTier = UserTier.ARCHITECT;

            const user = await prisma.user.upsert({
              where: { clerkUserId },
              update: {
                stripeCustomerId: session.customer as string,
              },
              create: {
                clerkUserId,
                email: session.customer_details?.email || "",
                stripeCustomerId: session.customer as string,
                tier: userTier
              }
            });

            // Update Project Access
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

            // Record donation/payment
            if (mode === 'payment') {
              await prisma.donation.create({
                data: {
                  userId: user.id,
                  amount: session.amount_total || 0,
                  currency: session.currency?.toUpperCase() || "EUR",
                  stripePaymentId: session.payment_intent as string || session.id
                }
              });

              // Update project collected amount
              await prisma.project.update({
                where: { id: projectId },
                data: {
                  collectedAmount: {
                    increment: session.amount_total || 0
                  }
                }
              }).catch(() => null);
            }
          }
          break;
        }

        case 'customer.subscription.deleted': {
          const stripeSubscription = event.data.object as Stripe.Subscription;
          await prisma.subscription.update({
            where: { stripeSubscriptionId: stripeSubscription.id },
            data: { status: 'canceled' }
          }).catch(() => null);
          break;
        }

        default:
          console.log(`Unhandled event type ${event.type}`);
      }
  } else {
    console.log("DATABASE_URL not set, skipping DB updates");
  }

  return NextResponse.json({ received: true });
}
