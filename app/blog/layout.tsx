import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sole Trader Tax Guides & Tips | SoleTraderTax.com.au Blog",
  description: "Free guides for Australian sole traders and ABN contractors. Tax tips, GST, super, PAYG, invoicing and more — written in plain English.",
  alternates: { canonical: "https://soletradertax.com.au/blog" },
  openGraph: {
    title: "Sole Trader Tax Guides & Tips | SoleTraderTax.com.au",
    description: "Free guides for Australian sole traders and ABN contractors on tax, GST, super and invoicing.",
    url: "https://soletradertax.com.au/blog",
    siteName: "SoleTraderTax",
    locale: "en_AU",
    type: "website",
  },
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
