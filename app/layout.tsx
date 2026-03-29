import Providers from "@/app/components/Providers";
import ClerkLocalizationProvider from "@/app/components/ClerkLocalizationProvider";
import { Suspense } from 'react';
import { Inter, Gloria_Hallelujah } from 'next/font/google';
import "./globals.css";

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const gloriaHallelujah = Gloria_Hallelujah({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-gloria-hallelujah',
});

export const metadata = {
  title: "POLUTEK.PL",
  description: "A secret project that aims to change something big.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="polutek" className={`${inter.variable} ${gloriaHallelujah.variable}`} suppressHydrationWarning>
      <body className="font-serif bg-base-100 text-neutral min-h-screen relative" suppressHydrationWarning>
        <Suspense>
          <Providers>
            <ClerkLocalizationProvider>
              {children}
            </ClerkLocalizationProvider>
          </Providers>
        </Suspense>
      </body>
    </html>
  );
}
