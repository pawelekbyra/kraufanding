import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pl" data-theme="cupcake">
      <body className="bg-base-200 min-h-screen text-base-content">{children}</body>
    </html>
  );
}
