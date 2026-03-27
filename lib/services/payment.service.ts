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
    userId: string,
    amount: number,
    title?: string,
    creatorId?: string,
    successUrl: string,
    cancelUrl: string
  }) {
    if (!stripe) throw new Error("Stripe not configured");

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['blik', 'p24', 'card'],
      line_items: [
        {
          price_data: {
            currency: 'pln',
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

    const user = await prisma.$transaction(async (tx) => {
      const localUser = await tx.user.findUnique({
        where: { id: userId },
        select: { id: true, email: true, totalPaid: true }
      });

      if (!localUser) throw new Error(`User with ID ${userId} not found.`);

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
        subject: 'Dziękujemy za wsparcie POLUTEK.PL!',
        html: `
          <div style="font-family: serif; color: #1a1a1a; background-color: #FDFBF7; padding: 40px; line-height: 1.6; border: 1px solid #1a1a1a;">
            <h1 style="text-transform: uppercase; letter-spacing: -0.05em; border-bottom: 2px solid #1a1a1a; pb-4;">Dziękujemy za Twoje wsparcie</h1>
            <p>Witaj!</p>
            <p>Pomyślnie przetworzyliśmy Twoją wpłatę w wysokości <strong>${amountPaid.toFixed(2)} zł</strong>.</p>
            <p>Twoja łączna suma wsparcia wynosi teraz <strong>${totalPaid.toFixed(2)} zł</strong>.</p>
            <p>Na podstawie Twojej sumy wpłat odblokowujesz dożywotni dostęp do materiałów premium w Strefie Patrona.</p>
            <p>Odwiedź <a href="https://polutek.pl" style="color: #1a1a1a; font-weight: bold;">polutek.pl</a>, aby zobaczyć swoje odblokowane treści.</p>
            <br />
            <p style="font-style: italic; border-top: 1px solid #1a1a1a; pt-4;">Z wyrazami szacunku,<br />Paweł Polutek</p>
          </div>
        `,
      });
    } catch (err) {
      console.error('[EMAIL_ERROR]', err);
    }
  }
}
