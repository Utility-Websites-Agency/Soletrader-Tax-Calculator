import type { Metadata } from "next";
import Link from "next/link";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "About SoleTraderTax | Free Australian Contractor Tax Tools",
  description: "SoleTraderTax builds free, accurate tax calculators for Australian contractors and sole traders. Learn about our tools and why we built them.",
  alternates: { canonical: "https://soletradertax.com.au/about" },
};

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-full bg-[#0d1117]">
      <SiteNav />
      <main className="flex-1 px-6 py-16">
        <div className="mx-auto max-w-[720px]">
          <h1 className="text-[32px] font-bold text-white mb-4">About SoleTraderTax</h1>
          <p className="text-[#c9d1d9] text-[17px] leading-[28px] mb-10">
            SoleTraderTax is a free toolkit for Australian contractors, freelancers, and sole traders
            who want to understand their numbers without needing an accountant for every calculation.
          </p>

          <section className="mb-10">
            <h2 className="text-[22px] font-semibold text-white mb-3">Why we built this</h2>
            <p className="text-[#c9d1d9] text-[16px] leading-[28px] mb-4">
              Most tax calculators are built for PAYG employees. They assume a single employer, a fixed salary,
              and no GST. Australian contractors have a different reality: ABN invoicing, quarterly BAS,
              PAYG instalments, and no employer withholding anything on their behalf.
            </p>
            <p className="text-[#c9d1d9] text-[16px] leading-[28px]">
              SoleTraderTax was built specifically for that gap. Every tool here accounts for GST thresholds,
              super contributions, PAYG instalment schedules, and the tax on ABN income — not salary.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-[22px] font-semibold text-white mb-3">What we offer</h2>
            <ul className="flex flex-col gap-3">
              {[
                ["Contractor rate calculator", "Work out your charge-out rate based on your income goal, super, leave, and tax obligations.", "/#calculator"],
                ["GST calculator", "Check whether an invoice amount includes or excludes GST, and calculate your BAS obligation.", "/tools/gst-calculator"],
                ["Tax guides", "Plain-English articles on contractor tax, deductions, PAYG instalments, and rate negotiation.", "/blog"],
              ].map(([title, desc, href]) => (
                <li key={title} className="rounded-xl border border-[#30363d] bg-[#161b22] px-6 py-4">
                  <Link href={href} className="text-[15px] font-semibold text-[#1a6fe8] hover:underline">{title}</Link>
                  <p className="text-[14px] text-[#c9d1d9] mt-1">{desc}</p>
                </li>
              ))}
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-[22px] font-semibold text-white mb-3">Accuracy and limitations</h2>
            <p className="text-[#c9d1d9] text-[16px] leading-[28px] mb-4">
              Our calculators use the current 2025-26 Australian income tax rates, the 12% superannuation
              guarantee, and the $75,000 GST registration threshold. We update the tools at the start of
              each financial year when the ATO publishes new rates.
            </p>
            <p className="text-[#c9d1d9] text-[16px] leading-[28px]">
              Results are estimates for planning purposes. They do not account for your individual
              deductions, offsets, HELP/HECS debt, or business structure. For advice specific to your
              situation, consult a registered tax agent or accountant.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-[22px] font-semibold text-white mb-3">Who is behind this</h2>
            <p className="text-[#c9d1d9] text-[16px] leading-[28px]">
              SoleTraderTax is an independent Australian website. We are not a financial services company,
              and we do not sell financial products. The site is funded by advertising. We have no affiliation
              with the ATO, any accounting firm, or any tax software provider.
            </p>
          </section>

          <section>
            <h2 className="text-[22px] font-semibold text-white mb-3">Get in touch</h2>
            <p className="text-[#c9d1d9] text-[16px] leading-[28px]">
              Questions, corrections, or feedback?{" "}
              <Link href="/contact" className="text-[#1a6fe8] hover:underline">Send us a message</Link>.
              We read everything and aim to respond within a few business days.
            </p>
          </section>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
