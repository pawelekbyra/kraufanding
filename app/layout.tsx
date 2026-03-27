import Providers from "@/app/components/Providers";
import ClerkLocalizationProvider from "@/app/components/ClerkLocalizationProvider";
import { Suspense } from 'react';
import "./globals.css";

export const metadata = {
  title: "POLUTEK.PL | ARCHIVE",
  description: "A cinematic archival experience.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pl" data-theme="polutek" suppressHydrationWarning className="dark">
      <body className="font-sans bg-base-100 text-base-content min-h-screen relative selection:bg-amber selection:text-black" suppressHydrationWarning>
        <div className="bg-mesh" />
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
