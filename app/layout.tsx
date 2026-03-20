import "./globals.css";
import { Inter } from "next/font/google";
import type { Metadata, Viewport } from "next";

const inter = Inter({ subsets: ["latin", "latin-ext"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "FundujMY - Platforma Crowdfundingowa",
  description: "Wspieraj projekty, ktore zmieniaja swiat. FundujMY to platforma crowdfundingowa laczaca tworcow z osobami, ktore chca wspierac innowacyjne projekty.",
  keywords: ["crowdfunding", "zbiorka", "finansowanie", "projekty", "wsparcie", "kampania"],
};

export const viewport: Viewport = {
  themeColor: "#16a34a",
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
