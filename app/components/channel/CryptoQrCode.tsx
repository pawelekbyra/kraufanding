"use client";

import { useEffect, useState } from "react";
import { logger } from "@/lib/logger";

interface CryptoQrCodeProps {
  /** Payload to encode — a BIP-21/EIP-681 URI, not the bare address. */
  value: string;
  /** Rendered edge length in px. */
  size?: number;
  isPl: boolean;
  /**
   * When true the encoded address is a stand-in, so the code is stamped
   * unmistakably as an example. Scanning it must never look like a live target.
   */
  isPlaceholder?: boolean;
}

/**
 * Renders a QR code as a data URL. The `qrcode` package is imported lazily so
 * it is code-split out of the main bundle and only fetched once a viewer
 * actually reaches the crypto step of the tip jar.
 */
export default function CryptoQrCode({ value, size = 180, isPl, isPlaceholder = false }: CryptoQrCodeProps) {
  // Result is stored together with the value it was generated from, so a changed `value`
  // invalidates the previous code by comparison rather than by a synchronous reset in the
  // effect body (which would trigger an extra render pass on every input change).
  const [result, setResult] = useState<{ value: string; dataUrl: string | null } | null>(null);
  const current = result?.value === value ? result : null;
  const dataUrl = current?.dataUrl ?? null;
  const failed = current != null && current.dataUrl === null;

  useEffect(() => {
    let cancelled = false;

    import("qrcode")
      .then((mod) => mod.default.toDataURL(value, {
        errorCorrectionLevel: "M",
        margin: 1,
        width: size * 2, // render at 2x for crisp display on retina screens
        color: { dark: "#111827", light: "#ffffff" },
      }))
      .then((url) => {
        if (!cancelled) setResult({ value, dataUrl: url });
      })
      .catch((error) => {
        logger.error("[CryptoQrCode] Failed to render QR code", error);
        if (!cancelled) setResult({ value, dataUrl: null });
      });

    return () => {
      cancelled = true;
    };
  }, [value, size]);

  if (failed) {
    return (
      <div
        className="flex items-center justify-center rounded-[14px] border border-dashed border-[var(--chan-line)] p-4 text-center text-[11px] text-[var(--chan-muted)]"
        style={{ width: size, height: size }}
      >
        {isPl ? "Nie udało się wygenerować kodu QR — skopiuj adres poniżej." : "Could not render the QR code — copy the address below."}
      </div>
    );
  }

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      {dataUrl ? (
        // next/image cannot optimize a client-generated data: URL — it would need `unoptimized`
        // and add a wrapper for zero benefit, so a plain <img> is the right call here.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={dataUrl}
          width={size}
          height={size}
          alt={isPl ? "Kod QR z adresem portfela" : "QR code containing the wallet address"}
          className="rounded-[14px] border border-[var(--chan-line)] bg-white"
        />
      ) : (
        <div
          className="animate-pulse rounded-[14px] border border-[var(--chan-line)] bg-[var(--chan-surface)] motion-reduce:animate-none"
          style={{ width: size, height: size }}
        />
      )}

      {isPlaceholder && dataUrl && (
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden rounded-[14px]">
          <span className="-rotate-12 whitespace-nowrap rounded-md bg-destructive px-2.5 py-1 text-[11px] font-black uppercase tracking-widest text-white shadow-lg">
            {isPl ? "Przykład" : "Example"}
          </span>
        </div>
      )}
    </div>
  );
}
