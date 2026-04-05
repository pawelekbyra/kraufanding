import Stripe from 'stripe';
import { prisma } from '@/lib/prisma';

export class PaymentService {
  // Używamy any dla stripe, aby uniknąć problemów z wersjami API w typach
  private static stripe: any = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2023-10-16' as any,
  });

  static async createCheckoutSession({
    userId,
    amount,
    currency = 'pln',
    userEmail,
    title,
    creatorId,
    successUrl,
    cancelUrl,
  }: {
    userId: string;
    amount: number;
    currency?: string;
    userEmail?: string;
    title?: string;
    creatorId?: string;
    successUrl: string;
    cancelUrl: string;
  }) {
    try {
      const sessionParams: any = {
        automatic_payment_methods: {
          enabled: true,
        },
        customer_email: userEmail,
        line_items: [
          {
            price_data: {
              currency: currency.toLowerCase(),
              product_data: {
                name: title || 'Dostęp Premium - Napiwek',
                description: 'Pełny dostęp do materiałów na stronie',
              },
              unit_amount: Math.round(Number(amount) * 100),
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: successUrl,
        cancel_url: cancelUrl,
        metadata: {
          userId: userId,
          creatorId: creatorId || '',
        },
      };

      const session = await this.stripe.checkout.sessions.create(sessionParams);
      return session;
    } catch (error) {
      console.error('Stripe session creation error:', error);
      throw error;
    }
  }

  static async handleWebhook(signature: string, payload: string | Buffer) {
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;
    let event: any;

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
      const session = event.data.object;
      const userId = session.metadata?.userId;

      if (userId) {
        // ZAMIANA update NA updateMany (to rozwiązuje Twój ostatni błąd)
        await prisma.user.updateMany({
          where: { 
            clerkId: userId 
          },
          data: { 
            isPremium: true 
          },
        });
      }
    }

    return { received: true };
  }
}
