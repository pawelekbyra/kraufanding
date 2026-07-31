/**
 * Tip channels for the patron-only "Bramka Napiwkowa" (tip gate).
 *
 * These are for tips that grant NOTHING — the viewer already holds an active
 * PatronGrant, so nothing here touches access, payments records or fulfilment.
 * BLIK and crypto are deliberately out-of-band, display-only instructions: the
 * app shows a number/address to copy and never records, verifies or reconciles
 * anything. Only the Stripe branch goes through the canonical
 * /api/checkout/create-intent -> fulfillPayment() path (CLAUDE.md 4.2, 4.10).
 */

/** Owner's BLIK / phone-transfer number, shown verbatim for manual transfers. */
export const BLIK_PHONE_NUMBER = "665967883";

export type CryptoWalletId = "bitcoin" | "ethereum";

export interface CryptoWallet {
  id: CryptoWalletId;
  /** Display name, e.g. "Bitcoin". */
  name: string;
  /** Ticker shown next to the name, e.g. "BTC". */
  symbol: string;
  /** Human-readable chain/network, so nobody sends on the wrong one. */
  network: string;
  /** Address string rendered as text and encoded into the QR code. */
  address: string;
  /**
   * True when `address` is a stand-in rather than a wallet the owner controls.
   *
   * This is the safety switch for the whole crypto branch. Crypto transfers are
   * irreversible and unaddressed-to-anyone: money sent to an address nobody
   * holds the keys for is destroyed, not refunded. While this flag is true the
   * UI must keep saying so and must not let the address be copied — see
   * CryptoAddressStep in TipJarModal.tsx. Set the env vars below to real
   * wallets and the warning disappears on its own.
   */
  isPlaceholder: boolean;
}

/**
 * Format-valid stand-ins used only until the owner configures real wallets.
 * They are shaped like genuine addresses on purpose (so the layout, character
 * wrapping and QR density match production), which is exactly why every screen
 * that renders them must respect `isPlaceholder`.
 */
const PLACEHOLDER_BTC_ADDRESS = "bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq";
const PLACEHOLDER_ETH_ADDRESS = "0x71C7656EC7ab88b098defB751B7401B5f6d8976F";

function resolveAddress(configured: string | undefined, placeholder: string) {
  const trimmed = configured?.trim();
  if (trimmed) return { address: trimmed, isPlaceholder: false };
  return { address: placeholder, isPlaceholder: true };
}

const bitcoin = resolveAddress(process.env.NEXT_PUBLIC_TIP_BTC_ADDRESS, PLACEHOLDER_BTC_ADDRESS);
const ethereum = resolveAddress(process.env.NEXT_PUBLIC_TIP_ETH_ADDRESS, PLACEHOLDER_ETH_ADDRESS);

export const CRYPTO_WALLETS: CryptoWallet[] = [
  {
    id: "bitcoin",
    name: "Bitcoin",
    symbol: "BTC",
    network: "Bitcoin (BTC)",
    address: bitcoin.address,
    isPlaceholder: bitcoin.isPlaceholder,
  },
  {
    id: "ethereum",
    name: "Ethereum",
    symbol: "ETH",
    network: "Ethereum (ERC-20)",
    address: ethereum.address,
    isPlaceholder: ethereum.isPlaceholder,
  },
];

export function getCryptoWallet(id: CryptoWalletId): CryptoWallet | undefined {
  return CRYPTO_WALLETS.find((wallet) => wallet.id === id);
}

/**
 * Payload encoded into the QR code. BIP-21 / EIP-681 URIs let wallet apps
 * prefill the recipient after a scan instead of treating it as plain text.
 */
export function buildCryptoQrPayload(wallet: CryptoWallet): string {
  if (wallet.id === "bitcoin") return `bitcoin:${wallet.address}`;
  return `ethereum:${wallet.address}`;
}
