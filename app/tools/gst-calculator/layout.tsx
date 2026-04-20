import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "GST Calculator Australia 2025-26 | Add or Remove GST Instantly",
  description: "Free Australian GST calculator. Add or remove 10% GST from any amount instantly. Includes GST registration threshold, BAS due dates, and formulas.",
  alternates: {
    canonical: "https://soletradertax.com.au/tools/gst-calculator",
  },
  openGraph: {
    title: "GST Calculator Australia 2025-26 | SoleTraderTax",
    description: "Add or remove GST from any amount instantly. Free, no login.",
    url: "https://soletradertax.com.au/tools/gst-calculator",
    siteName: "SoleTraderTax",
    locale: "en_AU",
    type: "website",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
