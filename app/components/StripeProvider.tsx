'use client';

import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { ReactNode, useMemo } from 'react';

const stripePromise = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  ? loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
  : null;

export default function StripeProvider({ children }: { children: ReactNode }) {
  if (!stripePromise) return <>{children}</>;

  return (
    <Elements stripe={stripePromise} options={{
        appearance: {
            theme: 'stripe',
            variables: {
                colorPrimary: '#1e3a8a',
                colorBackground: '#FDFBF7',
                colorText: '#1a1a1a',
                borderRadius: '8px',
            }
        }
    }}>
      {children}
    </Elements>
  );
}
