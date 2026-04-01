import Providers from "@/app/components/Providers";
import ClerkLocalizationProvider from "@/app/components/ClerkLocalizationProvider";
import { Suspense } from 'react';
import { Inter, Outfit, Plus_Jakarta_Sans, Gluten } from 'next/font/google';
import "./globals.css";


const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const outfit = Outfit({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-outfit',
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-jakarta',
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
    <html lang="en" data-theme="polutek" className={`${inter.variable} ${outfit.variable} ${jakarta.variable} ${gluten.variable}`} suppressHydrationWarning>
      <body className="font-sans bg-base-100 text-neutral min-h-screen relative" suppressHydrationWarning>
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
