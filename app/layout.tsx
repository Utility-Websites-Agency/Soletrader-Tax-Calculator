import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sole Trader Tax Calculator 2025-26 | ABN Take-Home Pay | SoleTraderTax.com.au",
  description: "Calculate your take-home pay as an Australian sole trader or ABN contractor. Includes GST threshold warning, PAYG installment schedule, super contributions, and per-invoice tax set-aside. Free, no login.",
  metadataBase: new URL("https://soletradertax.com.au"),
  openGraph: {
    title: "Sole Trader Tax Calculator 2025-26 | SoleTraderTax.com.au",
    description: "Free Australian sole trader tax calculator. Know exactly what to set aside for tax, when your PAYG installments are due, and what charge-out rate to charge.",
    url: "https://soletradertax.com.au",
    siteName: "SoleTraderTax",
    locale: "en_AU",
    type: "website",
    images: [
      {
        url: "/soletradertax.jpg",
        width: 1200,
        height: 630,
        alt: "SoleTraderTax — Free Australian contractor tax calculator",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sole Trader Tax Calculator 2025-26",
    description: "Free Australian sole trader and ABN contractor tax calculator. 2025-26 ATO rates.",
    images: ["/soletradertax.jpg"],
  },
  alternates: {
    canonical: "https://soletradertax.com.au",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <Script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3581257773539253"
        crossOrigin="anonymous"
        strategy="beforeInteractive"
      />
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
