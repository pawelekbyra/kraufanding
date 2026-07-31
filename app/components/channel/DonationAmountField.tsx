"use client";

import { ChevronDown } from "../icons";
import type { SupportedCurrency } from "@/lib/constants";

interface DonationAmountFieldProps {
  isPl: boolean;
  amount: number | "";
  setAmount: (value: number | "") => void;
  minAmount: number;
  selectedCurrency: string;
  availableCurrencies: SupportedCurrency[];
  onCurrencyChange: (currency: string) => void;
  amountTooLow: boolean;
}

const inputId = "donation-amount";
const labelId = "donation-amount-label";
const errorId = "donation-amount-error";

// Only ever rendered for the tip-gate (patron) variant — the fixed, non-editable
// gate price for guests is shown as its own price badge in DonationBox instead.
export default function DonationAmountField({
  isPl,
  amount,
  setAmount,
  minAmount,
  selectedCurrency,
  availableCurrencies,
  onCurrencyChange,
  amountTooLow,
}: DonationAmountFieldProps) {
  return (
    <div className="mb-3">
      <p id={labelId} className="mb-1.5 px-1 font-sans text-[11px] font-bold uppercase tracking-wide text-[var(--chan-muted)]">
        {isPl ? "Wpisz kwotę napiwku" : "Enter your tip amount"}
      </p>
      <div className="rounded-[12px] bg-[var(--cm-surface-66-white)] p-[9px_14px] shadow-[inset_0_0_0_1px_var(--cm-line-86),inset_0_1px_0_rgba(255,255,255,0.5)]">
        <div className="relative flex items-center">
          <input
            id={inputId}
            type="number"
            min={minAmount}
            step="1"
            value={amount}
            onChange={(e) => setAmount(e.target.value === "" ? "" : Number(e.target.value))}
            aria-labelledby={labelId}
            aria-invalid={amountTooLow}
            aria-describedby={amountTooLow ? errorId : undefined}
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
                <option key={curr} value={curr}>
                  {curr}
                </option>
              ))}
            </select>
            <ChevronDown size={13} className="pointer-events-none absolute right-0 text-[var(--chan-muted)]" />
          </div>
        </div>
      </div>

      {amountTooLow && (
        <p id={errorId} role="alert" className="mt-1 px-1 text-[10px] font-bold uppercase tracking-wide text-destructive">
          {isPl ? `Minimum to ${minAmount} ${selectedCurrency}` : `Minimum is ${minAmount} ${selectedCurrency}`}
        </p>
      )}
    </div>
  );
}
