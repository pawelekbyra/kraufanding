import "./globals.css";
import { Inter } from "next/font/google";
import type { Metadata, Viewport } from "next";

const inter = Inter({ subsets: ["latin", "latin-ext"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Odzyskaj Spadek - Zbiórka na Walkę o Sprawiedliwość",
  description: "Wspomóż walkę o odzyskanie rodzinnej nieruchomości. Twoja pomoc może zmienić wszystko.",
  keywords: ["zbiórka", "crowdfunding", "pomoc prawna", "nieruchomość", "spadek"],
};

export const viewport: Viewport = {
  themeColor: "#1a1a1a",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pl" className={inter.variable}>
      <body className="font-sans">{children}</body>
    </html>
  );
}
