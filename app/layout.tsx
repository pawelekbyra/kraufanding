import Providers from "@/app/components/Providers";
import ClerkLocalizationProvider from "@/app/components/ClerkLocalizationProvider";
import { Suspense } from 'react';
import { EB_Garamond, Space_Grotesk, IBM_Plex_Mono } from 'next/font/google';
import "./globals.css";

const ebGaramond = EB_Garamond({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-eb-garamond',
  display: 'swap',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-space-grotesk',
  display: 'swap',
});

const ibmPlexMono = IBM_Plex_Mono({
  weight: ['400', '700'],
  subsets: ['latin', 'latin-ext'],
  variable: '--font-ibm-plex-mono',
  display: 'swap',
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
    <html
      lang="pl"
      data-theme="polutek"
      className={`${ebGaramond.variable} ${spaceGrotesk.variable} ${ibmPlexMono.variable}`}
      suppressHydrationWarning
    >
      <body className="font-sans bg-linen text-ink min-h-screen relative selection:bg-ink/10 selection:text-ink" suppressHydrationWarning>
        <div className="fixed inset-0 pointer-events-none z-[9999] opacity-[0.04] mix-blend-overlay noise-bg"></div>
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
