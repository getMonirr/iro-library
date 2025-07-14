import { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "IRO Library - Islamic Research Organization",
  description:
    "Digital library management system for Islamic Research Organization. Browse, borrow, and interact with our collection of Islamic books and resources.",
  keywords: [
    "Islamic library",
    "Islamic books",
    "research",
    "IRO",
    "digital library",
  ],
  authors: [{ name: "IRO Development Team" }],
  viewport: "width=device-width, initial-scale=1",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
