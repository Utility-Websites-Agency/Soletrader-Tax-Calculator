import type { Metadata } from "next";
import Link from "next/link";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "Contact | SoleTraderTax",
  description: "Get in touch with the SoleTraderTax team. Questions, corrections, or feedback about our Australian contractor tax calculators.",
  alternates: { canonical: "https://soletradertax.com.au/contact" },
};

export default function ContactPage() {
  return (
    <div className="flex flex-col min-h-full bg-[#0d1117]">
      <SiteNav />
      <main className="flex-1 px-6 py-16">
        <div className="mx-auto max-w-[720px]">
          <h1 className="text-[32px] font-bold text-white mb-4">Contact us</h1>
          <p className="text-[#c9d1d9] text-[17px] leading-[28px] mb-10">
            Have a question about our calculators, found an error, or want to suggest a new tool?
            We welcome all feedback.
          </p>

          <section className="mb-10">
            <h2 className="text-[22px] font-semibold text-white mb-3">Email</h2>
            <p className="text-[#c9d1d9] text-[16px] leading-[28px]">
              The best way to reach us is by email:{" "}
              <a href="mailto:hello@soletradertax.com.au" className="text-[#1a6fe8] hover:underline">
                hello@soletradertax.com.au
              </a>
            </p>
            <p className="text-[#c9d1d9] text-[16px] leading-[28px] mt-3">
              We aim to respond within 2-3 business days.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-[22px] font-semibold text-white mb-3">What to include</h2>
            <p className="text-[#c9d1d9] text-[16px] leading-[28px] mb-3">
              To help us respond quickly, include:
            </p>
            <ul className="flex flex-col gap-2 text-[#c9d1d9] text-[16px] leading-[28px] list-disc list-inside">
              <li>Which calculator or page you are referring to</li>
              <li>What you expected to see vs what you saw</li>
              <li>Any specific numbers or inputs if you found a calculation error</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-[22px] font-semibold text-white mb-3">Common questions</h2>
            <div className="flex flex-col gap-4">
              {[
                {
                  q: "Are the tax rates up to date?",
                  a: "Yes. Our calculators use 2025-26 ATO tax brackets, the 12% superannuation guarantee, and the current $75,000 GST threshold. We update figures at the start of each financial year.",
                },
                {
                  q: "Can I rely on these numbers for my tax return?",
                  a: "Our tools are for planning and estimation. They do not account for your personal deductions, offsets, or business structure. For your actual return, consult a registered tax agent.",
                },
                {
                  q: "Do you offer personalised tax advice?",
                  a: "No. SoleTraderTax provides general educational tools and articles only. We are not a registered tax agent and cannot provide advice specific to your circumstances.",
                },
              ].map(({ q, a }) => (
                <div key={q} className="rounded-xl border border-[#30363d] bg-[#161b22] px-6 py-4">
                  <p className="text-[15px] font-semibold text-white mb-1">{q}</p>
                  <p className="text-[14px] text-[#c9d1d9] leading-[24px]">{a}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-[22px] font-semibold text-white mb-3">Other pages</h2>
            <div className="flex gap-4 flex-wrap">
              <Link href="/about" className="text-[14px] text-[#1a6fe8] hover:underline">About us</Link>
              <Link href="/privacy-policy" className="text-[14px] text-[#1a6fe8] hover:underline">Privacy policy</Link>
              <Link href="/blog" className="text-[14px] text-[#1a6fe8] hover:underline">Tax guides</Link>
            </div>
          </section>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
