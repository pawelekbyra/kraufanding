import { ClerkProvider } from '@clerk/nextjs'
import Providers from "@/app/components/Providers";
import ClerkLocalizationProvider from "@/app/components/ClerkLocalizationProvider";
import "./globals.css";

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
    <html lang="en" data-theme="polutek" suppressHydrationWarning>
      <body className="font-serif bg-base-100 text-neutral min-h-screen relative" suppressHydrationWarning>
        <Providers>
          <ClerkLocalizationProvider>
            {children}
          </ClerkLocalizationProvider>
        </Providers>
      </body>
    </html>
  );
}
