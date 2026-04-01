import Providers from "@/app/components/Providers";
import ClerkLocalizationProvider from "@/app/components/ClerkLocalizationProvider";
import { Suspense } from 'react';
import { Inter, EB_Garamond, Space_Grotesk, Gluten } from 'next/font/google';
import "./globals.css";

// Vidstack Player Styles
import '@vidstack/react/player/styles/default/theme.css';
import '@vidstack/react/player/styles/default/layouts/video.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const ebGaramond = EB_Garamond({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-eb-garamond',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-space-grotesk',
});

const gluten = Gluten({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-gluten',
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
    <html lang="en" data-theme="polutek" className={`${inter.variable} ${ebGaramond.variable} ${spaceGrotesk.variable} ${gluten.variable}`} suppressHydrationWarning>
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
