import Stripe from 'stripe';
import { prisma } from '@/lib/prisma';

export class PaymentService {
  private stripe: Stripe;

  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2023-10-16', // lub Twoja aktualna wersja
    });
  }

  async createCheckoutSession(userId: string, userEmail: string) {
    try {
      const session = await this.stripe.checkout.sessions.create({
        // ZAMIANA NA AUTOMATYCZNE METODY PŁATNOŚCI (OPCJA B)
        automatic_payment_methods: {
          enabled: true,
        },
        customer_email: userEmail,
        line_items: [
          {
            price_data: {
              currency: 'pln',
              product_data: {
                name: 'Dostęp Premium - Napiwek',
                description: 'Pełny dostęp do materiałów na stronie',
              },
              unit_amount: 5000, // Kwota w groszach (50.00 PLN)
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

      return session.url;
    } catch (error) {
      console.error('Stripe session creation error:', error);
      throw new Error('Błąd podczas inicjowania płatności');
    }
  }

  async handleWebhook(signature: string, payload: Buffer) {
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;
    let event: Stripe.Event;

    try {
      event = this.stripe.webhooks.constructEvent(payload, signature, endpointSecret);
    } catch (err: any) {
      throw new Error(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.userId;

      if (userId) {
        // Aktualizacja statusu użytkownika w bazie danych
        await prisma.user.update({
          where: { clerkId: userId },
          data: { isPremium: true },
        });
      }
    }

    return { received: true };
  }
}

export const paymentService = new PaymentService();
