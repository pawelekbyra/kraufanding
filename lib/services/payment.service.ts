import Stripe from 'stripe';
import { prisma } from '@/lib/prisma';
import { EmailService } from './email.service';

const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2024-12-18.acacia' as any,
    })
  : null;

export class PaymentService {
  static async createCheckoutSession(params: {
    userId: string,
    amount: number,
    currency?: string,
    title?: string,
    creatorId?: string,
    successUrl: string,
    cancelUrl: string
  }) {
    if (!stripe) throw new Error("Stripe not configured");

    const paymentMethodTypes: Stripe.Checkout.SessionCreateParams.PaymentMethodType[] = ['card'];
    if (params.currency?.toLowerCase() === 'pln') {
      paymentMethodTypes.push('blik', 'p24');
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: paymentMethodTypes,
      line_items: [
        {
          price_data: {
            currency: params.currency?.toLowerCase() || 'pln',
            product_data: {
              name: `Wsparcie: ${params.title || "Patronat POLUTEK.PL"}`,
              description: `Dożywotni dostęp do Strefy Patrona`,
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
        userId: params.userId,
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
    const userId = session.metadata?.userId || session.metadata?.clerkUserId;
    const creatorIdRaw = session.metadata?.creatorId;
    const creatorId = (creatorIdRaw && creatorIdRaw !== "") ? creatorIdRaw : null;
    const amountPaid = (session.amount_total || 0) / 100;
    const currency = session.currency?.toUpperCase() || 'PLN';

    if (!userId) return;

    const result = await prisma.$transaction(async (tx) => {
      const localUser = await tx.user.findUnique({
        where: { id: userId },
        select: { id: true, email: true, totalPaid: true, language: true }
      });

      if (!localUser) throw new Error(`User with ID ${userId} not found.`);

      const existingTx = await tx.transaction.findUnique({
        where: { stripeSessionId: session.id }
      });

      if (existingTx) return { user: localUser, isNewPatron: false };

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

      const updatedUser = await tx.user.update({
        where: { id: localUser.id },
        data: {
          totalPaid: { increment: amountPaid },
          stripeCustomerId: session.customer as string,
        },
      });

      // Threshold for becoming a patron is 5 EUR/PLN/GBP/CHF
      const PATRON_THRESHOLD = 5;
      const wasPatron = localUser.totalPaid >= PATRON_THRESHOLD;
      const isNowPatron = updatedUser.totalPaid >= PATRON_THRESHOLD;
      const isNewPatron = !wasPatron && isNowPatron;

      return { user: updatedUser, isNewPatron };
    });

    const { user, isNewPatron } = result;

    if (user.email) {
      const language = user.language as 'pl' | 'en' || 'pl';
      // Always send thank you for donation
      await EmailService.sendDonationThankYouEmail(user.email, amountPaid, currency, language);

      // If they just became a patron, send the congrats email
      if (isNewPatron) {
          await EmailService.sendBecomePatronEmail(user.email, language);
      }
    }
  }
}
