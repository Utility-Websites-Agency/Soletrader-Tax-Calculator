import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "Australian Contractor Tax Calculator | Know How Much To Charge",
  description: "Free Australian contractor tax calculator. Calculate your charge-out rate, take-home pay, GST obligations and PAYG instalments. No login required.",
  metadataBase: new URL("https://soletradertax.com.au"),
  openGraph: {
    title: "Australian Contractor Tax Calculator | Know How Much To Charge",
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
    title: "Australian Contractor Tax Calculator | Know How Much To Charge",
    description: "Calculate your charge-out rate and take-home pay as an Australian ABN contractor. Free, no login.",
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
      <head>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3581257773539253"
          crossOrigin="anonymous"
        />
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-BFRX6S9RWT" />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config', 'G-BFRX6S9RWT');`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
