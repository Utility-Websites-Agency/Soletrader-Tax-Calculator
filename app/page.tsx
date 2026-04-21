import { HomeNav } from "@/components/HomeNav";
import { BackgroundEffects, CalculatorSection, FaqAccordion, ScrollProgress } from "@/components/DeferredSections";
import { SiteFooter } from "@/components/SiteFooter";
import AdSlot from "@/components/AdSlot";

const AU_BRACKETS = [
  { label: "$0 – $18,200",        rate: 0    },
  { label: "$18,201 – $45,000",   rate: 0.16 },
  { label: "$45,001 – $135,000",  rate: 0.30 },
  { label: "$135,001 – $190,000", rate: 0.37 },
  { label: "$190,001+",           rate: 0.45 },
];

const webAppJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "Australian Contractor Tax Calculator",
  "url": "https://soletradertax.com.au",
  "description": "Free calculator for Australian contractors and sole traders. Calculate your charge-out rate, take-home pay, GST obligations and PAYG instalments for 2025-26.",
  "applicationCategory": "FinanceApplication",
  "operatingSystem": "Web",
  "offers": { "@type": "Offer", "price": "0", "priceCurrency": "AUD" },
  "publisher": { "@type": "Organization", "name": "SoleTraderTax", "url": "https://soletradertax.com.au" },
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    { "@type": "Question", "name": "Why is my charge-out rate much higher than my desired income?", "acceptedAnswer": { "@type": "Answer", "text": "Because your hourly rate must cover income tax, all business overheads, and is spread only across your realistic billable hours. Sole traders typically bill 20–25 hours per week once admin, travel, and quiet periods are accounted for." } },
    { "@type": "Question", "name": "How does the reverse tax calculation work?", "acceptedAnswer": { "@type": "Answer", "text": "You tell us how much you want to take home, and the engine finds the pre-tax income that, after ATO progressive brackets and Medicare levy, leaves you with exactly that amount. It uses binary search accurate to within $1." } },
    { "@type": "Question", "name": "What does the market benchmark show?", "acceptedAnswer": { "@type": "Answer", "text": "The benchmark shows what other contractors in your profession and location typically charge, based on Hipages and ABS 2024 data. It is informational only and does not affect your required rate." } },
    { "@type": "Question", "name": "Why use 25 billable hours as the default?", "acceptedAnswer": { "@type": "Answer", "text": "Sole traders lose time to quoting, travel, admin, invoicing, and quiet periods. Industry data suggests 20–30 billable hours per week is realistic for most trades and freelancers." } },
  ],
};

export default function Home() {
  return (
    <div className="min-h-screen bg-transparent font-sans text-[#1f2328] selection:bg-[#1a6fe8]/15 relative">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <ScrollProgress />
      <BackgroundEffects />
      <HomeNav />

      {/* ── HERO — server-rendered, LCP element in initial HTML ── */}
      <section className="relative z-10 px-4 md:px-6 py-20 text-center">
        <div className="mx-auto max-w-2xl">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#e7e7e7] bg-white px-3 py-1.5 text-[14px] font-medium text-[#343638]">
            <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
            Free · No sign-up · ATO 2025-26 tax rates
          </div>
          <h1 className="text-[38px] md:text-[54px] font-extrabold tracking-tight text-[#1f2328] leading-[1.1]">
            How much should you{" "}
            <span className="text-[#1a6fe8]">actually charge?</span>
          </h1>
          <p className="mt-5 text-[16px] text-[#1f2328] leading-relaxed font-medium">
            Enter your desired take-home pay and we reverse-calculate the exact charge-out rate you need, after ATO tax, Medicare levy, and all your business overheads.
          </p>
          <a
            href="#calculator"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#1a6fe8] px-8 py-3 text-[16px] font-semibold text-white transition hover:bg-[#1560d0] active:scale-95"
          >
            Calculate my rate →
          </a>
        </div>
      </section>

      {/* ── CALCULATOR — client component ── */}
      <CalculatorSection />

      {/* ── AD SLOT 1 ── */}
      <div className="relative z-10 px-6 py-2">
        <div className="mx-auto max-w-[1280px]">
          <AdSlot slotId="7926794347" />
        </div>
      </div>

      {/* ── HOW IT WORKS — server-rendered ── */}
      <section id="how-it-works" className="relative z-10 border-b border-[#e7e7e7] py-20 px-6">
        <div className="mx-auto max-w-[860px]">
          <h2 className="text-[28px] font-extrabold tracking-tight text-[#1f2328] mb-2">How the engine works</h2>
          <p className="text-[15px] text-[#343638] mb-10 font-medium">
            SoleTraderTax uses a 4-step sole trader pricing engine. Here&apos;s exactly how your charge-out rate is calculated.
          </p>
          <div className="flex flex-col gap-6">
            {[
              { step: "Step 1", title: "Reverse ATO Tax Calculation", desc: "Most tools calculate tax on a gross income. SoleTraderTax works backwards: given your desired take-home, it solves for the pre-tax income that, after ATO progressive brackets and Medicare levy, produces exactly what you want. This is done via binary search accurate to within $1." },
              { step: "Step 2", title: "Add Business Overheads", desc: "Your charge-out rate must recover all business costs: vehicle, tools, insurance, software, marketing, and miscellaneous. These are annualised and added to your required taxable income to get total required revenue." },
              { step: "Step 3", title: "Realistic Sole Trader Billable Hours", desc: "Sole traders don't bill 38 hours a week. Quoting, admin, travel, chasing payments, and quiet periods typically reduce billable hours to 20–25 per week. The default of 25 hrs × 46 weeks = 1,150 billable hours per year reflects this reality." },
              { step: "Step 4", title: "Required Charge-Out Rate", desc: "Required revenue ÷ annual billable hours = your minimum charge-out rate. The calculator also shows a Minimum Safe rate (−10%) and a Premium rate (+15%) to give you a negotiating range." },
            ].map((item, i) => (
              <div key={i} className="flex gap-5 rounded-xl border border-[#e7e7e7] bg-white p-5">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#1a6fe8]/10 text-[14px] font-bold text-[#1a6fe8] uppercase tracking-wide">{i + 1}</div>
                <div>
                  <p className="text-[14px] font-semibold uppercase tracking-wider text-[#5f676f] mb-0.5">{item.step}</p>
                  <h3 className="text-[15px] font-bold text-[#1f2328] mb-1">{item.title}</h3>
                  <p className="text-[14px] text-[#343638] leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 rounded-xl border border-[#e7e7e7] overflow-hidden">
            <div className="border-b border-[#e7e7e7] bg-[#f6f8fa] px-5 py-3">
              <h3 className="text-[12px] font-semibold uppercase tracking-wider text-[#343638]">Australian resident income tax brackets, 2025-26</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-[14px]">
                <thead>
                  <tr className="border-b border-[#e7e7e7] bg-[#f6f8fa]">
                    <th className="text-left px-5 py-2.5 font-semibold text-[#343638]">Income range</th>
                    <th className="text-right px-5 py-2.5 font-semibold text-[#343638]">Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {AU_BRACKETS.map((b, i) => (
                    <tr key={b.label} className={`border-b border-[#e7e7e7] last:border-0 ${i % 2 === 0 ? "bg-white" : "bg-[#f6f8fa]"}`}>
                      <td className="px-5 py-2.5 font-medium text-[#1f2328]">{b.label}</td>
                      <td className="px-5 py-2.5 text-right font-semibold text-[#1f2328]">{(b.rate * 100).toFixed(0)}%</td>
                    </tr>
                  ))}
                  <tr className="bg-[#f6f8fa] border-t border-[#e7e7e7]">
                    <td className="px-5 py-2.5 font-medium text-[#343638]">Medicare levy (all income)</td>
                    <td className="px-5 py-2.5 text-right font-semibold text-[#343638]">2%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* ── AD SLOT 2 ── */}
      <div className="relative z-10 px-6 py-2">
        <div className="mx-auto max-w-[1280px]">
          <AdSlot slotId="6282540183" />
        </div>
      </div>

      {/* ── FAQ — client component ── */}
      <FaqAccordion />

      <SiteFooter />
    </div>
  );
}
