import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import Stripe from 'stripe';
import { prisma } from '@/lib/prisma';
import { Resend } from 'resend';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const resendApiKey = process.env.RESEND_API_KEY;

  if (!stripeKey || !webhookSecret) {
    return NextResponse.json({ error: 'Missing stripe secret or webhook secret' }, { status: 400 });
  }

  const stripe = new Stripe(stripeKey, {
    apiVersion: '2024-12-18.acacia' as any,
  });

  const body = await req.text();
  const sig = headers().get('stripe-signature');

  if (!sig) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err: any) {
    console.error(`Webhook Error: ${err.message}`);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const clerkUserId = session.metadata?.clerkUserId;
    const amountPaid = (session.amount_total || 0) / 100; // in EUR

    if (clerkUserId) {
      const user = await prisma.user.update({
        where: { clerkUserId },
        data: {
          totalPaid: {
            increment: amountPaid,
          },
          stripeCustomerId: session.customer as string,
        },
      });

      // Send thank you email via Resend
      if (user.email && resendApiKey) {
        try {
          const resend = new Resend(resendApiKey);
          await resend.emails.send({
            from: 'polutek.pl <no-reply@polutek.pl>',
            to: user.email,
            subject: 'Thank you for your support!',
            html: `
              <div style="font-family: serif; color: #1a1a1a; background-color: #FDFBF7; padding: 40px; line-height: 1.6;">
                <h1 style="text-transform: uppercase; letter-spacing: -0.05em;">Thank you for your patronage</h1>
                <p>Hello,</p>
                <p>We've successfully processed your contribution of <strong>€${amountPaid.toFixed(2)}</strong>.</p>
                <p>Your total support is now <strong>€${user.totalPaid.toFixed(2)}</strong>.</p>
                <p>Depending on your total support level, you've unlocked permanent access to our premium materials.</p>
                <p>Visit <a href="https://polutek.pl" style="color: #1a1a1a; font-weight: bold;">polutek.pl</a> to see your unlocked content.</p>
                <br />
                <p style="font-style: italic;">Best regards,<br />Paweł Polutek</p>
              </div>
            `,
          });
        } catch (emailErr) {
          console.error('[WEBHOOK_EMAIL_ERROR]', emailErr);
        }
      }
    }
  }

  return NextResponse.json({ received: true });
}
