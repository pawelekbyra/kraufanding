import Stripe from 'stripe';
import { prisma } from '@/lib/prisma';
import { Resend } from 'resend';

const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2024-12-18.acacia' as any,
    })
  : null;

export class PaymentService {
  static async createCheckoutSession(params: {
    clerkUserId: string,
    amount: number,
    title?: string,
    creatorId?: string,
    successUrl: string,
    cancelUrl: string
  }) {
    if (!stripe) throw new Error("Stripe not configured");

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: `Support: ${params.title || "Creator Support"}`,
              description: `Lifetime VIP Access`,
            },
            unit_amount: Math.round(params.amount * 100),
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: params.successUrl,
      cancel_url: params.cancelUrl,
      metadata: {
        clerkUserId: params.clerkUserId,
        creatorId: params.creatorId || "",
        type: 'TIP_DONATION'
      },
    });

    return session;
  }

  static async handleWebhook(body: string, sig: string) {
    if (!stripe || !process.env.STRIPE_WEBHOOK_SECRET) {
      throw new Error('Missing stripe secret or webhook secret');
    }

    const event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      await this.processCompletedSession(session);
    }

    return event;
  }

  private static async processCompletedSession(session: Stripe.Checkout.Session) {
    const clerkUserId = session.metadata?.clerkUserId;
    const creatorIdRaw = session.metadata?.creatorId;
    const creatorId = (creatorIdRaw && creatorIdRaw !== "") ? creatorIdRaw : null;
    const amountPaid = (session.amount_total || 0) / 100;
    const currency = session.currency?.toUpperCase() || 'EUR';

    if (!clerkUserId) return;

    const user = await prisma.$transaction(async (tx) => {
      const localUser = await tx.user.findUnique({
        where: { clerkUserId },
        select: { id: true, email: true, totalPaid: true }
      });

      if (!localUser) throw new Error(`User with clerkUserId ${clerkUserId} not found.`);

      const existingTx = await tx.transaction.findUnique({
        where: { stripeSessionId: session.id }
      });

      if (existingTx) return localUser;

      await tx.transaction.create({
        data: {
          userId: localUser.id,
          creatorId: creatorId,
          amount: amountPaid,
          currency: currency,
          stripeSessionId: session.id,
          status: 'COMPLETED'
        }
      });

      return await tx.user.update({
        where: { id: localUser.id },
        data: {
          totalPaid: { increment: amountPaid },
          stripeCustomerId: session.customer as string,
        },
      });
    });

    if (user.email && process.env.RESEND_API_KEY) {
      await this.sendThankYouEmail(user.email, amountPaid, user.totalPaid);
    }
  }

  private static async sendThankYouEmail(email: string, amountPaid: number, totalPaid: number) {
    const resend = new Resend(process.env.RESEND_API_KEY);
    try {
      await resend.emails.send({
        from: 'polutek.pl <no-reply@polutek.pl>',
        to: email,
        subject: 'Thank you for your support!',
        html: `
          <div style="font-family: serif; color: #1a1a1a; background-color: #FDFBF7; padding: 40px; line-height: 1.6;">
            <h1 style="text-transform: uppercase; letter-spacing: -0.05em;">Thank you for your patronage</h1>
            <p>Hello,</p>
            <p>We've successfully processed your contribution of <strong>€${amountPaid.toFixed(2)}</strong>.</p>
            <p>Your total support is now <strong>€${totalPaid.toFixed(2)}</strong>.</p>
            <p>Depending on your total support level, you've unlocked permanent access to our premium materials.</p>
            <p>Visit <a href="https://polutek.pl" style="color: #1a1a1a; font-weight: bold;">polutek.pl</a> to see your unlocked content.</p>
            <br />
            <p style="font-style: italic;">Best regards,<br />Paweł Polutek</p>
          </div>
        `,
      });
    } catch (err) {
      console.error('[EMAIL_ERROR]', err);
    }
  }
}
