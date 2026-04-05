import Stripe from 'stripe';
import { prisma } from '@/lib/prisma';

export class PaymentService {
  private static stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
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
      const session = await this.stripe.checkout.sessions.create({
        // ROZWIĄZANIE PROBLEMU P24: Automatyczne metody płatności
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
              unit_amount: Math.round(amount * 100), // Stripe oczekuje groszy
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        // Używamy adresów URL przekazanych z API route
        success_url: successUrl,
        cancel_url: cancelUrl,
        metadata: {
          userId: userId,
          creatorId: creatorId || '',
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
        // Aktualizacja statusu Premium dla użytkownika
        await prisma.user.update({
          where: { clerkId: userId },
          data: { isPremium: true },
        });
        
        // Tutaj możesz dodać dodatkową logikę zapisu transakcji/napiwku 
        // jeśli Twój model bazy danych na to pozwala.
      }
    }

    return { received: true };
  }
}
