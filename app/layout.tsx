import { ClerkProvider } from '@clerk/nextjs'
import { Playfair_Display, Inter } from 'next/font/google'
import Providers from "@/app/components/Providers";
import "./globals.css";

const playfair = Playfair_Display({ 
  subsets: ['latin', 'latin-ext'],
  variable: '--font-playfair',
  display: 'swap',
})

const inter = Inter({ 
  subsets: ['latin', 'latin-ext'],
  variable: '--font-inter',
  display: 'swap',
})

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
    <html lang="pl" data-theme="polutek" suppressHydrationWarning className={`${playfair.variable} ${inter.variable}`}>
      <body className="font-serif bg-background text-foreground min-h-screen antialiased">
        <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}>
          <Providers>
            {children}
          </Providers>
        </ClerkProvider>
      </body>
    </html>
  );
}
