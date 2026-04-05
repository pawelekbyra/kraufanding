'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { LanguageProvider } from './LanguageContext';
import StripeProvider from './StripeProvider';

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <StripeProvider>
          {children}
        </StripeProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}
