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
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
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
    });

    return session;
  }
}
