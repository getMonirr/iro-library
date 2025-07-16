import { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "IRO Library Admin - Management Dashboard",
  description:
    "Administrative dashboard for IRO Library. Manage books, users, categories, and library operations.",
  keywords: [
    "library admin",
    "book management",
    "user management",
    "IRO admin",
    "library dashboard",
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
      <body className="min-h-screen bg-gray-50 dark:bg-gray-900 font-sans antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
