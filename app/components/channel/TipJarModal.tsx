"use client";

import { useCallback, useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, ArrowRight, Check, Copy, Loader2, ChevronDown } from "../icons";
import { useToast } from "@/app/hooks/useToast";
import { logger } from "@/lib/logger";
import {
  BLIK_PHONE_NUMBER,
  CRYPTO_WALLETS,
  buildCryptoQrPayload,
  getCryptoWallet,
  type CryptoWalletId,
} from "@/lib/tips/tip-channels";
import type { SupportedCurrency } from "@/lib/constants";
import CryptoQrCode from "./CryptoQrCode";

type TipStep = "intro" | "recipient" | "method" | "stripe-amount" | "blik" | "crypto-pick" | "crypto-address";

interface TipJarModalProps {
  isPl: boolean;
  onClose: () => void;
  /** Stripe branch — reuses DonationBox's canonical checkout state. */
  amount: number | "";
  setAmount: (value: number | "") => void;
  minAmount: number;
  selectedCurrency: string;
  availableCurrencies: SupportedCurrency[];
  onCurrencyChange: (currency: string) => void;
  isTermsAccepted: boolean;
  setIsTermsAccepted: (accepted: boolean) => void;
  onOpenTerms: () => void;
  onOpenPrivacy: () => void;
  /** Kicks off /api/checkout/create-intent with the amount chosen here. */
  onStripeSubmit: (amount: number) => void;
  isSubmitting: boolean;
}

export default function TipJarModal({
  isPl,
  onClose,
  amount,
  setAmount,
  minAmount,
  selectedCurrency,
  availableCurrencies,
  onCurrencyChange,
  isTermsAccepted,
  setIsTermsAccepted,
  onOpenTerms,
  onOpenPrivacy,
  onStripeSubmit,
  isSubmitting,
}: TipJarModalProps) {
  const toast = useToast();
  const [step, setStep] = useState<TipStep>("intro");
  const [walletId, setWalletId] = useState<CryptoWalletId | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [showTermsError, setShowTermsError] = useState(false);

  const wallet = walletId ? getCryptoWallet(walletId) : undefined;
  const amountTooLow = typeof amount === "number" && amount < minAmount;

  const copy = useCallback(
    async (value: string, key: string) => {
      try {
        await navigator.clipboard.writeText(value);
        setCopied(key);
        window.setTimeout(() => setCopied(null), 2000);
      } catch (error) {
        logger.warn("[TipJarModal] Clipboard write failed", error);
        toast(isPl ? "Nie udało się skopiować — zaznacz i skopiuj ręcznie." : "Copy failed — select and copy manually.", "error");
      }
    },
    [toast, isPl],
  );

  const back = useCallback((to: TipStep) => () => setStep(to), []);

  const handleStripeSubmit = () => {
    if (!isTermsAccepted) {
      setShowTermsError(true);
      return;
    }
    setShowTermsError(false);
    if (typeof amount !== "number" || amount < minAmount) return;
    onStripeSubmit(amount);
  };

  return (
    <Dialog open onOpenChange={(isOpen) => { if (!isOpen) onClose(); }}>
      <DialogContent className="max-h-[88vh] overflow-y-auto rounded-[22px] bg-[var(--chan-card)] p-0 sm:max-w-lg">
        {/* Festive ribbon, matching the tip gate card it was opened from. */}
        <div
          aria-hidden="true"
          className="h-[5px] w-full shrink-0 rounded-t-[22px] bg-[linear-gradient(90deg,var(--chan-amber-bright),var(--chan-amber),var(--chan-blue),var(--chan-amber),var(--chan-amber-bright))]"
        />

        <div className="px-6 pb-7 pt-5 sm:px-8">
          {step === "intro" && (
            <section>
              <span aria-hidden="true" className="mb-3 block text-[34px] leading-none">🐷</span>
              <DialogTitle className="font-brand text-[24px] font-extrabold leading-tight tracking-[-0.03em] text-[var(--chan-ink)]">
                {isPl ? "Zanim wrzucisz grosz — uczciwe ostrzeżenie" : "Before you drop a coin — an honest warning"}
              </DialogTitle>
              <div className="mt-4 space-y-3 font-sans text-[14px] leading-[1.65] text-[var(--chan-body)]">
                <p>
                  {isPl
                    ? "To nie jest zakup. Nie odblokujesz tym żadnego filmu, odznaki, rangi, tajnego kanału ani nawet ładniejszego avatara. Masz już absolutnie wszystko, co jest tu do wzięcia."
                    : "This is not a purchase. It unlocks no video, no badge, no rank, no secret channel, not even a nicer avatar. You already have absolutely everything there is to get here."}
                </p>
                <p>
                  {isPl
                    ? "To jest darowizna na rozwój projektu i zwykłe „dzięki, było warte”. Jedyne, co dostajesz w zamian, to moja szczera wdzięczność — a tej, niestety, nie da się wypłacić w bankomacie."
                    : "This is a donation toward the project and a plain “thanks, that was worth it”. The only thing you get back is my honest gratitude — which, sadly, no cash machine will pay out."}
                </p>
              </div>
              <div className="mt-6 flex flex-col gap-2.5 sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={back("recipient")}
                  className="font-sans h-[46px] flex-1 cursor-pointer rounded-[13px] bg-[linear-gradient(135deg,var(--chan-amber-bright),var(--chan-amber))] text-[15px] font-extrabold tracking-[-0.02em] text-[var(--chan-amber-ink)] shadow-[0_1px_0_var(--cm-amber-66-black),0_10px_22px_-10px_var(--cm-amber-62)] transition hover:brightness-[1.04] motion-reduce:transition-none"
                >
                  {isPl ? "Rozumiem, lecimy dalej" : "Understood, let's go"}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="font-sans h-[46px] cursor-pointer rounded-[13px] border border-[var(--chan-line)] px-5 text-[14px] font-bold text-[var(--chan-muted-2)] transition hover:bg-[var(--chan-surface)] sm:flex-none"
                >
                  {isPl ? "Wycofuję się" : "I'll pass"}
                </button>
              </div>
            </section>
          )}

          {step === "recipient" && (
            <StepShell
              isPl={isPl}
              onBack={back("intro")}
              stepLabel={isPl ? "Krok 2 z 3" : "Step 2 of 3"}
              title={isPl ? "Komu chcesz wysłać napiwek?" : "Who do you want to tip?"}
              lead={isPl ? "Pytanie kontrolne. Jedna z tych odpowiedzi jest właściwa." : "A control question. One of these answers is correct."}
            >
              <div className="grid gap-2.5">
                <button
                  type="button"
                  onClick={onClose}
                  className="group/opt flex cursor-pointer items-center gap-3 rounded-[14px] border border-[var(--chan-line)] p-4 text-left transition hover:bg-[var(--chan-surface)]"
                >
                  <span aria-hidden="true" className="text-[22px]">🙅</span>
                  <span className="min-w-0">
                    <span className="block font-sans text-[15px] font-bold text-[var(--chan-ink)]">
                      {isPl ? "Nikomu" : "Nobody"}
                    </span>
                    <span className="block font-sans text-[12.5px] text-[var(--chan-muted)]">
                      {isPl ? "Zamyka to okno. Bez urazy, serio." : "Closes this window. No hard feelings, seriously."}
                    </span>
                  </span>
                </button>
                <button
                  type="button"
                  onClick={back("method")}
                  className="group/opt flex cursor-pointer items-center gap-3 rounded-[14px] border-2 border-[var(--chan-amber)] bg-[var(--chan-amber-soft)] p-4 text-left transition hover:brightness-[0.98]"
                >
                  <span aria-hidden="true" className="text-[22px]">🕶️</span>
                  <span className="min-w-0">
                    <span className="block font-sans text-[15px] font-extrabold text-[var(--chan-ink)]">
                      {isPl ? "Pawłowi Perfectowi" : "Paweł Perfect"}
                    </span>
                    <span className="block font-sans text-[12.5px] text-[var(--chan-amber-ink)]/75">
                      {isPl ? "Dobra odpowiedź." : "Correct answer."}
                    </span>
                  </span>
                </button>
              </div>
            </StepShell>
          )}

          {step === "method" && (
            <StepShell
              isPl={isPl}
              onBack={back("recipient")}
              stepLabel={isPl ? "Krok 3 z 3" : "Step 3 of 3"}
              title={isPl ? "Jak chcesz to zrobić?" : "How do you want to do it?"}
              lead={isPl ? "Kwotę ustalasz sam — nie ma progu, nie ma sugestii." : "You set the amount — no threshold, no suggestions."}
            >
              <div className="grid gap-2.5">
                <MethodOption
                  emoji="💳"
                  title={isPl ? "Karta, Apple Pay, Google Pay" : "Card, Apple Pay, Google Pay"}
                  subtitle={isPl ? "Standardowo, przez Stripe" : "The standard route, via Stripe"}
                  onClick={back("stripe-amount")}
                />
                <MethodOption
                  emoji="📱"
                  title="BLIK"
                  subtitle={isPl ? "Przelew na telefon z Twojej aplikacji bankowej" : "Phone transfer from your banking app"}
                  onClick={back("blik")}
                />
                <MethodOption
                  emoji="₿"
                  title={isPl ? "Kryptowaluty" : "Crypto"}
                  subtitle={isPl ? "Bitcoin albo Ethereum" : "Bitcoin or Ethereum"}
                  onClick={back("crypto-pick")}
                />
              </div>
            </StepShell>
          )}

          {step === "stripe-amount" && (
            <StepShell
              isPl={isPl}
              onBack={back("method")}
              stepLabel={isPl ? "Karta / Apple Pay / Google Pay" : "Card / Apple Pay / Google Pay"}
              title={isPl ? "Ile wrzucasz?" : "How much are you dropping in?"}
              lead={isPl ? `Cokolwiek od ${minAmount} ${selectedCurrency} w górę. Serio, cokolwiek.` : `Anything from ${minAmount} ${selectedCurrency} up. Genuinely, anything.`}
            >
              <div className="rounded-[12px] bg-[var(--cm-surface-66-white)] p-[9px_14px] shadow-[inset_0_0_0_1px_var(--cm-line-86),inset_0_1px_0_rgba(255,255,255,0.5)]">
                <div className="relative flex items-center">
                  <input
                    id="tip-jar-amount"
                    type="number"
                    min={minAmount}
                    step="1"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value === "" ? "" : Number(e.target.value))}
                    aria-label={isPl ? "Kwota napiwku" : "Tip amount"}
                    aria-invalid={amountTooLow}
                    placeholder={String(minAmount)}
                    className="font-sans w-full bg-transparent px-16 text-left text-[18px] font-extrabold tabular-nums text-[var(--chan-ink)] outline-none placeholder:text-[var(--chan-line-soft)]"
                  />
                  <div className="absolute right-0 top-1/2 flex -translate-y-1/2 items-center">
                    <select
                      value={selectedCurrency}
                      onChange={(e) => onCurrencyChange(e.target.value)}
                      aria-label="Currency"
                      className="cursor-pointer appearance-none bg-transparent pr-5 font-sans text-[14px] font-bold text-[var(--chan-body)] outline-none"
                    >
                      {availableCurrencies.map((curr) => (
                        <option key={curr} value={curr}>{curr}</option>
                      ))}
                    </select>
                    <ChevronDown size={13} className="pointer-events-none absolute right-0 text-[var(--chan-muted)]" />
                  </div>
                </div>
              </div>
              {amountTooLow && (
                <p role="alert" className="mt-1.5 px-1 text-[10px] font-bold uppercase tracking-wide text-destructive">
                  {isPl ? `Minimum to ${minAmount} ${selectedCurrency}` : `Minimum is ${minAmount} ${selectedCurrency}`}
                </p>
              )}

              {showTermsError && (
                <p role="alert" className="mt-3 text-[11px] font-bold uppercase tracking-widest text-destructive">
                  {isPl ? "Zaakceptuj regulamin" : "Please accept the terms"}
                </p>
              )}

              <label className="mt-3 flex cursor-pointer items-start gap-2 px-1">
                <Checkbox
                  id="tip-jar-accept-terms"
                  checked={isTermsAccepted}
                  onCheckedChange={(checked) => {
                    setIsTermsAccepted(!!checked);
                    if (checked) setShowTermsError(false);
                  }}
                  aria-invalid={showTermsError}
                  className="mt-[2px] shrink-0"
                />
                <span className="font-sans text-[11px] leading-[1.4] text-[var(--chan-muted)]">
                  {isPl ? (
                    <>
                      Akceptuję{" "}
                      <button type="button" onClick={onOpenTerms} className="underline hover:text-[var(--chan-ink)]">Regulamin</button>
                      {" "}i{" "}
                      <button type="button" onClick={onOpenPrivacy} className="underline hover:text-[var(--chan-ink)]">Politykę Prywatności</button>
                    </>
                  ) : (
                    <>
                      I accept the{" "}
                      <button type="button" onClick={onOpenTerms} className="underline hover:text-[var(--chan-ink)]">Terms</button>
                      {" "}and{" "}
                      <button type="button" onClick={onOpenPrivacy} className="underline hover:text-[var(--chan-ink)]">Privacy Policy</button>
                    </>
                  )}
                </span>
              </label>

              <button
                type="button"
                onClick={handleStripeSubmit}
                disabled={isSubmitting || amount === "" || amountTooLow}
                aria-busy={isSubmitting}
                className="font-sans mt-4 flex h-[46px] w-full cursor-pointer items-center justify-center gap-2 rounded-[13px] bg-[linear-gradient(135deg,var(--chan-amber-bright),var(--chan-amber))] text-[15px] font-extrabold tracking-[-0.02em] text-[var(--chan-amber-ink)] shadow-[0_1px_0_var(--cm-amber-66-black),0_10px_22px_-10px_var(--cm-amber-62)] transition hover:brightness-[1.04] disabled:cursor-not-allowed disabled:opacity-60 motion-reduce:transition-none"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin motion-reduce:animate-none" aria-hidden="true" />
                    <span role="status" aria-live="polite">{isPl ? "Przetwarzanie..." : "Processing..."}</span>
                  </>
                ) : (
                  <span>{isPl ? "Przejdź do płatności" : "Continue to payment"}</span>
                )}
              </button>
            </StepShell>
          )}

          {step === "blik" && (
            <StepShell
              isPl={isPl}
              onBack={back("method")}
              stepLabel="BLIK"
              title={isPl ? "Przelew na telefon" : "Phone transfer"}
              lead={
                isPl
                  ? "W aplikacji bankowej wybierz „przelew na telefon (BLIK)” i wpisz ten numer. Kwotę ustalasz sam."
                  : "In your banking app pick “phone transfer (BLIK)” and enter this number. You set the amount."
              }
            >
              <CopyPanel
                label={isPl ? "Numer telefonu" : "Phone number"}
                value={BLIK_PHONE_NUMBER}
                display={BLIK_PHONE_NUMBER.replace(/(\d{3})(\d{3})(\d{3})/, "$1 $2 $3")}
                mono={false}
                copied={copied === "blik"}
                onCopy={() => copy(BLIK_PHONE_NUMBER, "blik")}
                isPl={isPl}
              />
              <p className="mt-4 font-sans text-[12px] leading-[1.6] text-[var(--chan-muted)]">
                {isPl
                  ? "Nic tu nie klikasz „dalej” — przelew robisz w swoim banku. Nie zobaczę Twojego nazwiska, chyba że sam je wpiszesz w tytule."
                  : "There is no “next” to click — you make the transfer in your own bank. I won't see your name unless you put it in the transfer title yourself."}
              </p>
            </StepShell>
          )}

          {step === "crypto-pick" && (
            <StepShell
              isPl={isPl}
              onBack={back("method")}
              stepLabel={isPl ? "Kryptowaluty" : "Crypto"}
              title={isPl ? "Czym płacisz?" : "Which coin?"}
              lead={isPl ? "Wybierz sieć — adresy nie są wymienne." : "Pick the network — the addresses are not interchangeable."}
            >
              <div className="grid gap-2.5">
                {CRYPTO_WALLETS.map((w) => (
                  <MethodOption
                    key={w.id}
                    emoji={w.id === "bitcoin" ? "₿" : "Ξ"}
                    title={`${w.name} (${w.symbol})`}
                    subtitle={w.network}
                    onClick={() => {
                      setWalletId(w.id);
                      setStep("crypto-address");
                    }}
                  />
                ))}
              </div>
            </StepShell>
          )}

          {step === "crypto-address" && wallet && (
            <StepShell
              isPl={isPl}
              onBack={back("crypto-pick")}
              stepLabel={`${wallet.name} (${wallet.symbol})`}
              title={isPl ? "Adres portfela" : "Wallet address"}
              lead={
                isPl
                  ? `Zeskanuj kod albo skopiuj adres. Wysyłasz wyłącznie w sieci ${wallet.network}.`
                  : `Scan the code or copy the address. Send only on the ${wallet.network} network.`
              }
            >
              {wallet.isPlaceholder && (
                <div
                  role="alert"
                  className="mb-4 rounded-[14px] border-2 border-destructive bg-destructive/5 p-4"
                >
                  <p className="font-sans text-[13px] font-black uppercase tracking-wide text-destructive">
                    {isPl ? "⚠ Adres przykładowy — nie wysyłaj tu środków" : "⚠ Example address — do not send funds here"}
                  </p>
                  <p className="mt-1.5 font-sans text-[12.5px] leading-[1.6] text-[var(--chan-body)]">
                    {isPl
                      ? "Ten portfel nie należy do twórcy — to podgląd wyglądu, dopóki prawdziwy adres nie zostanie skonfigurowany. Kryptowaluty wysłane na cudzy adres znikają bezpowrotnie, dlatego kopiowanie jest tu wyłączone."
                      : "This wallet does not belong to the creator — it is a layout preview until a real address is configured. Crypto sent to someone else's address is gone for good, so copying is disabled here."}
                  </p>
                </div>
              )}

              <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
                <CryptoQrCode
                  value={buildCryptoQrPayload(wallet)}
                  size={168}
                  isPl={isPl}
                  isPlaceholder={wallet.isPlaceholder}
                />
                <div className="w-full min-w-0">
                  <CopyPanel
                    label={isPl ? "Adres" : "Address"}
                    value={wallet.address}
                    display={wallet.address}
                    mono
                    copied={copied === "crypto"}
                    onCopy={() => copy(wallet.address, "crypto")}
                    disabled={wallet.isPlaceholder}
                    isPl={isPl}
                  />
                  <p className="mt-3 font-sans text-[11.5px] leading-[1.55] text-[var(--chan-muted)]">
                    {isPl
                      ? "Transakcje krypto są nieodwracalne. Sprawdź sieć i pierwsze oraz ostatnie znaki adresu, zanim wyślesz."
                      : "Crypto transfers are irreversible. Check the network and the first and last characters of the address before sending."}
                  </p>
                </div>
              </div>
            </StepShell>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function StepShell({
  isPl,
  onBack,
  stepLabel,
  title,
  lead,
  children,
}: {
  isPl: boolean;
  onBack: () => void;
  stepLabel: string;
  title: string;
  lead?: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <button
        type="button"
        onClick={onBack}
        className="mb-3 -ml-1 inline-flex cursor-pointer items-center gap-1.5 rounded-md px-1 py-0.5 font-sans text-[11px] font-bold uppercase tracking-wide text-[var(--chan-muted)] transition hover:text-[var(--chan-ink)]"
      >
        <ArrowLeft size={13} />
        {isPl ? "Wstecz" : "Back"}
      </button>
      <p className="font-sans text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--chan-amber-strong)]">{stepLabel}</p>
      <DialogTitle className="font-brand mt-1 text-[22px] font-extrabold leading-tight tracking-[-0.03em] text-[var(--chan-ink)]">
        {title}
      </DialogTitle>
      {lead && <p className="mt-2 font-sans text-[13.5px] leading-[1.6] text-[var(--chan-body)]">{lead}</p>}
      <div className="mt-5">{children}</div>
    </section>
  );
}

function MethodOption({
  emoji,
  title,
  subtitle,
  onClick,
}: {
  emoji: string;
  title: string;
  subtitle: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex cursor-pointer items-center gap-3 rounded-[14px] border border-[var(--chan-line)] p-4 text-left transition hover:border-[var(--chan-amber)] hover:bg-[var(--chan-amber-soft)]"
    >
      <span aria-hidden="true" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--chan-surface)] text-[18px]">
        {emoji}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block font-sans text-[14.5px] font-bold text-[var(--chan-ink)]">{title}</span>
        <span className="block font-sans text-[12.5px] text-[var(--chan-muted)]">{subtitle}</span>
      </span>
      <ArrowRight size={14} className="shrink-0 text-[var(--chan-muted)]" aria-hidden="true" />
    </button>
  );
}

function CopyPanel({
  label,
  value,
  display,
  mono,
  copied,
  onCopy,
  disabled = false,
  isPl,
}: {
  label: string;
  value: string;
  display: string;
  mono: boolean;
  copied: boolean;
  onCopy: () => void;
  disabled?: boolean;
  isPl: boolean;
}) {
  return (
    <div className="rounded-[14px] border border-[var(--chan-line)] bg-[var(--cm-surface-66-white)] p-4">
      <p className="font-sans text-[10.5px] font-bold uppercase tracking-[0.12em] text-[var(--chan-muted)]">{label}</p>
      <p
        className={`mt-1.5 break-all text-[var(--chan-ink)] ${mono ? "font-mono text-[13px] leading-[1.5]" : "font-sans text-[22px] font-extrabold tracking-[0.02em] tabular-nums"}`}
      >
        {display}
      </p>
      <button
        type="button"
        onClick={onCopy}
        disabled={disabled}
        title={disabled ? (isPl ? "Kopiowanie wyłączone dla adresu przykładowego" : "Copying is disabled for the example address") : undefined}
        className="font-sans mt-3 inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-[10px] border border-[var(--chan-line)] bg-[var(--chan-card)] px-3 text-[12.5px] font-bold text-[var(--chan-ink)] transition hover:bg-[var(--chan-surface)] disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:bg-[var(--chan-card)]"
      >
        {copied ? <Check size={14} /> : <Copy size={14} />}
        {copied ? (isPl ? "Skopiowano" : "Copied") : (isPl ? "Kopiuj" : "Copy")}
        <span className="sr-only">: {value}</span>
      </button>
    </div>
  );
}
