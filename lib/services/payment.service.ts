import Stripe from 'stripe';
import { prisma } from '@/lib/prisma';

export class PaymentService {
  private static stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2023-10-16' as any,
  });

  // Metoda statyczna, aby pasowała do Twojego API route
  static async createCheckoutSession({
    userId,
    amount,
    currency = 'pln',
    userEmail,
  }: {
    userId: string;
    amount: number;
    currency?: string;
    userEmail?: string;
  }) {
    try {
      const session = await this.stripe.checkout.sessions.create({
        // OPCJA B: Automatyczne metody płatności (rozwiązuje błąd P24)
        automatic_payment_methods: {
          enabled: true,
        },
        customer_email: userEmail,
        line_items: [
          {
            price_data: {
              currency: currency.toLowerCase(),
              product_data: {
                name: 'Dostęp Premium - Napiwek',
                description: 'Pełny dostęp do materiałów na stronie',
              },
              unit_amount: Math.round(amount * 100), // Przeliczenie na grosze
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${process.env.NEXT_PUBLIC_APP_URL}/?success=true`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/?canceled=true`,
        metadata: {
          userId: userId,
        },
      });

      return session;
    } catch (error) {
      console.error('Stripe session creation error:', error);
      throw error;
    }
  }

  static async handleWebhook(signature: string, payload: string | Buffer) {
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;
    let event: Stripe.Event;

    try {
      event = this.stripe.webhooks.constructEvent(
        payload,
        signature,
        endpointSecret
      );
    } catch (err: any) {
      throw new Error(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.userId;

      if (userId) {
        await prisma.user.update({
          where: { clerkId: userId },
          data: { isPremium: true },
        });
      }
    }

    return { received: true };
  }
}
