/** @vitest-environment jsdom */
import '@testing-library/jest-dom/vitest';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, cleanup, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import DonationBox from '@/app/components/channel/DonationBox';

class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}
global.ResizeObserver = ResizeObserverStub as unknown as typeof ResizeObserver;

vi.mock('@clerk/nextjs', () => ({
  useAuth: () => ({ userId: 'user_123' }),
  useUser: () => ({ user: { primaryEmailAddress: { emailAddress: 'user@example.com' } } }),
  useClerk: () => ({ openSignIn: vi.fn() }),
}));

vi.mock('@/app/components/auth/AuthModalProvider', () => ({
  useAuthModal: () => ({ open: vi.fn(), close: vi.fn(), isOpen: false }),
}));

vi.mock('next/navigation', () => ({
  useSearchParams: () => new URLSearchParams(),
  useRouter: () => ({ refresh: vi.fn(), replace: vi.fn() }),
}));

vi.mock('@/app/hooks/useToast', () => ({
  useToast: () => vi.fn(),
}));

vi.mock('@/lib/logger', () => ({
  logger: { warn: vi.fn(), error: vi.fn(), info: vi.fn() },
}));

vi.mock('@/app/components/LanguageContext', () => ({
  useLanguage: () => ({
    language: 'pl',
    t: {
      currency: 'PLN',
      pleaseAcceptTerms: 'Zaakceptuj regulamin, aby otrzymać dostęp do Strefy Fenkju',
      tipTheGuy: 'Wspieram',
    },
  }),
}));

function renderDonationBox(props: Partial<React.ComponentProps<typeof DonationBox>> = {}) {
  const queryClient = new QueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      <DonationBox {...props} />
    </QueryClientProvider>,
  );
}

describe('DonationBox', () => {
  beforeEach(() => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        limits: { PLN: { minAmount: 10 }, USD: { minAmount: 10 }, EUR: { minAmount: 10 }, CHF: { minAmount: 10 }, GBP: { minAmount: 10 } },
        patronThresholds: { PLN: { threshold: 20 }, USD: { threshold: 20 }, EUR: { threshold: 20 }, CHF: { threshold: 20 }, GBP: { threshold: 20 } },
      }),
    }) as unknown as typeof fetch;
  });

  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it('renders the access-granting copy and a fixed, non-editable amount for a non-patron viewer', async () => {
    const { container } = renderDonationBox({ viewerIsPatron: false });

    expect(container.textContent).toContain('Jednorazowe wsparcie pomaga rozwijać kanał i odblokowuje dożywotni dostęp');
    expect(screen.getByText('Wspieraj tworzenie wartościowych treści')).toBeInTheDocument();
    expect(
      screen.getByText(/Twoje wsparcie pomaga w rozwoju kanału/),
    ).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('20')).toBeInTheDocument();
    });
    expect(screen.queryByRole('spinbutton')).not.toBeInTheDocument();
  });

  it('renders the tip-gate variant with no amount field and a modal-opening CTA for a patron', async () => {
    const { container } = renderDonationBox({ viewerIsPatron: true });

    expect(screen.getByText('Bramka Napiwkowa')).toBeInTheDocument();
    expect(screen.getByText('Nic tu nie kupujesz. Tu się tylko dziękuje.')).toBeInTheDocument();
    expect(container.textContent).toContain('niczego nie odblokowuje');
    // Channel badges advertise that this is not a card-only surface.
    expect(screen.getByText('BLIK')).toBeInTheDocument();
    expect(screen.getByText('Krypto')).toBeInTheDocument();
    // The gate's sales bullets must not leak into the tip jar.
    expect(container.textContent).not.toContain('Dostęp do specjalnych materiałów');
    // The amount is collected inside the modal now, never on the card itself.
    expect(screen.queryByRole('spinbutton')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Napiwkuj' })).toBeInTheDocument();
  });

  it('walks the tip-jar modal from the disclaimer through to the BLIK number', async () => {
    const user = userEvent.setup();
    renderDonationBox({ viewerIsPatron: true });

    await user.click(screen.getByRole('button', { name: 'Napiwkuj' }));

    // Step 1 — must state plainly that the tip buys nothing.
    expect(await screen.findByText(/uczciwe ostrzeżenie/)).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Rozumiem, lecimy dalej' }));

    // Step 2 — recipient picker.
    expect(await screen.findByText('Komu chcesz wysłać napiwek?')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /Pawłowi Perfectowi/ }));

    // Step 3 — payment channels, including the out-of-band ones.
    expect(await screen.findByText('Jak chcesz to zrobić?')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /BLIK/ }));

    expect(await screen.findByText('665 967 883')).toBeInTheDocument();
  });

  it('closes the tip-jar modal when the viewer picks "Nikomu"', async () => {
    const user = userEvent.setup();
    renderDonationBox({ viewerIsPatron: true });

    await user.click(screen.getByRole('button', { name: 'Napiwkuj' }));
    await user.click(await screen.findByRole('button', { name: 'Rozumiem, lecimy dalej' }));
    await user.click(await screen.findByRole('button', { name: /Nikomu/ }));

    await waitFor(() => {
      expect(screen.queryByText('Komu chcesz wysłać napiwek?')).not.toBeInTheDocument();
    });
  });

  it('never offers a copyable crypto address while the wallet is still a placeholder', async () => {
    const user = userEvent.setup();
    renderDonationBox({ viewerIsPatron: true });

    await user.click(screen.getByRole('button', { name: 'Napiwkuj' }));
    await user.click(await screen.findByRole('button', { name: 'Rozumiem, lecimy dalej' }));
    await user.click(await screen.findByRole('button', { name: /Pawłowi Perfectowi/ }));
    await user.click(await screen.findByRole('button', { name: /Kryptowaluty/ }));
    await user.click(await screen.findByRole('button', { name: /Bitcoin/ }));

    // No real wallet is configured in tests, so the address is a stand-in: the UI must say so
    // and must not let it be copied — crypto sent to a wrong address is unrecoverable.
    expect(await screen.findByRole('alert')).toHaveTextContent(/nie wysyłaj tu środków/i);
    expect(screen.getByRole('button', { name: /Kopiuj/ })).toBeDisabled();
  });
});
