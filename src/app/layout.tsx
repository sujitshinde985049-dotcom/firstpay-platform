import type { Metadata } from "next";
import { ThemeProvider } from "@/components/providers/theme-provider";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  ),
  title: {
    default: "FirstPay — Enterprise payment infrastructure",
    template: "%s | FirstPay",
  },
  description:
    "Enterprise recurring payments, UPI AutoPay, e-NACH, and mandate infrastructure built for India.",
  applicationName: "FirstPay",
  category: "financial technology",
  keywords: [
    "payment infrastructure",
    "UPI AutoPay",
    "e-NACH",
    "recurring payments",
    "mandate management",
    "fintech API",
  ],
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "FirstPay",
    title: "FirstPay — Enterprise payment infrastructure",
    description:
      "One secure platform for recurring payments, digital mandates, and collections.",
    images: [
      {
        url: "/og.png",
        width: 1536,
        height: 1024,
        alt: "FirstPay enterprise payment infrastructure",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "FirstPay — Enterprise payment infrastructure",
    description:
      "One secure platform for recurring payments, digital mandates, and collections.",
    images: ["/og.png"],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <body className="flex min-h-full flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
