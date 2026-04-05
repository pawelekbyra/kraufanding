'use client';

import React, { useState } from 'react';
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useLanguage } from './LanguageContext';

export default function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const { t, language } = useLanguage();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) return;

    setIsLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/?success=true`,
      },
    });

    if (error) {
      setErrorMessage(error.message || 'An unexpected error occurred.');
    }

    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement options={{ layout: 'tabs' }} />
      {errorMessage && <div className="text-red-500 font-mono text-xs">{errorMessage}</div>}
      <button
        type="submit"
        disabled={isLoading || !stripe || !elements}
        className="w-full bg-[#1e3a8a] text-white py-4 rounded-lg font-mono font-bold text-sm tracking-[0.2em] uppercase transition-all shadow-brutalist-sm hover:translate-x-[2px] hover:translate-y-[2px] disabled:opacity-50"
      >
        {isLoading ? (
          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin inline-block mr-2" />
        ) : null}
        {language === 'pl' ? 'OPŁAĆ' : 'PAY NOW'}
      </button>
    </form>
  );
}
