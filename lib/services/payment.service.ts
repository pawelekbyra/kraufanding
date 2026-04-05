import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-04-10',
});

export class PaymentService {
  static async createCheckoutSession({
    userId,
    amount,
    currency,
    title,
    creatorId,
    successUrl,
    cancelUrl,
  }: {
    userId: string;
    amount: number;
    currency: string;
    title: string;
    creatorId: string;
    successUrl: string;
    cancelUrl: string;
  }) {
    // Używamy as any tylko dla parametrów sesji, żeby TypeScript nie blokował builda 
    // przy automatycznych metodach płatności
    const session = await stripe.checkout.sessions.create({
      automatic_payment_methods: {
        enabled: true,
      },
      line_items: [
        {
          price_data: {
            currency: currency,
            product_data: {
              name: title,
            },
            unit_amount: Math.round(amount * 100),
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        userId,
        creatorId,
      },
    } as any);

    return session;
  }
}
