"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ArrowRight, Info } from "lucide-react";
import AdSlot from "@/components/AdSlot";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";

// ─── GST Logic ────────────────────────────────────────────────────────────────

function calcGST(amount: number, mode: "add" | "remove") {
  if (mode === "add") {
    const gst = amount * 0.1;
    return { original: amount, gst, total: amount + gst };
  } else {
    const original = amount / 1.1;
    const gst = amount - original;
    return { original, gst, total: amount };
  }
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function fmt(n: number) {
  return n.toLocaleString("en-AU", { style: "currency", currency: "AUD", maximumFractionDigits: 2 });
}

function parseInput(val: string): number {
  return parseFloat(val.replace(/[^0-9.]/g, "")) || 0;
}

// ─── Components ──────────────────────────────────────────────────────────────

function ResultRow({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className={`flex items-center justify-between py-3.5 border-b border-[#e7e7e7] last:border-0 ${highlight ? "bg-[#f0f6ff] -mx-5 px-5 rounded-lg" : ""}`}>
      <span className="text-[15px] text-[#343638]">{label}</span>
      <span className={`text-[16px] font-bold ${highlight ? "text-[#2b7fff]" : "text-[#1f2328]"}`}>{value}</span>
    </div>
  );
}

function FAQ({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-[#e7e7e7] last:border-0">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-4 py-4 text-left"
      >
        <span className="text-[15px] font-semibold text-[#1f2328]">{q}</span>
        <motion.span animate={{ rotate: open ? 90 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronRight className="w-4 h-4 text-[#8b949e] shrink-0" />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <p className="text-[14px] text-[#343638] leading-relaxed pb-4">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function GSTCalculatorPage() {
  const [amount, setAmount] = useState("");
  const [mode, setMode] = useState<"add" | "remove">("add");

  const numAmount = parseInput(amount);
  const result = numAmount > 0 ? calcGST(numAmount, mode) : null;

  const handleAmount = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9.]/g, "");
    setAmount(raw);
  }, []);

  const gstThreshold = 75000;
  const showThresholdNote = numAmount > 0 && numAmount < gstThreshold && mode === "add";

  return (
    <div className="min-h-screen bg-white font-sans text-[#1f2328] flex flex-col">
      <SiteNav activePage="tools" />

      {/* Breadcrumb */}
      <div className="border-b border-[#e7e7e7] px-4 md:px-6 py-3">
        <div className="mx-auto max-w-[1280px] flex items-center gap-2 text-[14px] text-[#8b949e]">
          <Link href="/" className="hover:text-[#2b7fff] transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/tools" className="hover:text-[#2b7fff] transition-colors">Tools</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-[#343638]">GST Calculator</span>
        </div>
      </div>

      <main className="flex-1 mx-4 md:mx-6 lg:mx-auto lg:max-w-[1280px] lg:px-6 py-10 md:py-14">
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-16">

          {/* Left — calculator */}
          <div className="flex-1 min-w-0">

            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="mb-8"
            >
              <h1 className="text-[28px] md:text-[38px] font-extrabold tracking-tight text-[#1f2328] leading-[1.15] mb-3">
                GST Calculator Australia 2025-26
              </h1>
              <p className="text-[16px] text-[#343638] leading-relaxed max-w-xl">
                Add or remove 10% GST from any amount. Instant results — no login required.
              </p>
            </motion.div>

            {/* Calculator card */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.08 }}
              className="rounded-2xl border border-[#e7e7e7] bg-white p-5 md:p-7 shadow-sm mb-6"
            >
              {/* Mode toggle */}
              <div className="flex rounded-xl bg-[#f6f8fa] p-1 mb-6 gap-1">
                {(["add", "remove"] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => setMode(m)}
                    className={`flex-1 rounded-lg py-2.5 text-[14px] font-semibold transition-all ${
                      mode === m
                        ? "bg-white text-[#1f2328] shadow-sm"
                        : "text-[#343638] hover:text-[#1f2328]"
                    }`}
                  >
                    {m === "add" ? "Add GST (ex-GST → inc-GST)" : "Remove GST (inc-GST → ex-GST)"}
                  </button>
                ))}
              </div>

              {/* Amount input */}
              <div className="mb-6">
                <label className="block text-[13px] font-semibold text-[#343638] uppercase tracking-wider mb-2 pb-2">
                  {mode === "add" ? "Amount before GST" : "Amount including GST"}
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[18px] font-semibold text-[#8b949e]">$</span>
                  <input
                    type="text"
                    inputMode="decimal"
                    value={amount}
                    onChange={handleAmount}
                    placeholder="0.00"
                    className="w-full rounded-xl border border-[#e7e7e7] bg-[#f6f8fa] pl-9 pr-4 py-4 text-[24px] font-bold text-[#1f2328] placeholder:text-[#c9d1d9] focus:outline-none focus:border-[#2b7fff] focus:bg-white transition-colors"
                  />
                </div>
              </div>

              {/* GST threshold note */}
              {showThresholdNote && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="flex gap-3 rounded-lg bg-blue-50 px-4 py-3 mb-5"
                >
                  <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                  <p className="text-[13px] text-blue-900 leading-relaxed">
                    If your annual turnover is under $75,000 you are not required to register for GST. Check your eligibility with the{" "}
                    <a href="https://www.ato.gov.au/businesses-and-organisations/gst-excise-and-indirect-taxes/gst/registering-for-gst" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-700">ATO</a>.
                  </p>
                </motion.div>
              )}

              {/* Results */}
              <AnimatePresence mode="wait">
                {result ? (
                  <motion.div
                    key="result"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="rounded-xl bg-[#f6f8fa] border border-[#e7e7e7] px-5 py-1"
                  >
                    <ResultRow
                      label={mode === "add" ? "Amount (ex-GST)" : "Amount (ex-GST)"}
                      value={fmt(result.original)}
                    />
                    <ResultRow label="GST (10%)" value={fmt(result.gst)} />
                    <ResultRow
                      label={mode === "add" ? "Total (inc-GST)" : "Total (inc-GST)"}
                      value={fmt(result.total)}
                      highlight
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="rounded-xl bg-[#f6f8fa] border border-[#e7e7e7] px-5 py-8 text-center text-[14px] text-[#8b949e]"
                  >
                    Enter an amount above to see the GST breakdown
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Ad slot */}
            <AdSlot label="Ad slot 1, Google AdSense" className="mb-8" />

            {/* How GST works */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.15 }}
              className="mb-8"
            >
              <h2 className="text-[20px] font-bold text-[#1f2328] mb-4 border-l-4 border-[#2b7fff] pl-4">
                How GST works in Australia
              </h2>
              <div className="flex flex-col gap-3 text-[15px] text-[#343638] leading-relaxed">
                <p>
                  GST (Goods and Services Tax) is a 10% tax on most goods and services sold in Australia. It was introduced on 1 July 2000 and is administered by the ATO.
                </p>
                <p>
                  If your business has a GST turnover of $75,000 or more, you must register for GST, collect it from customers, and remit it to the ATO via a Business Activity Statement (BAS).
                </p>
                <p>
                  As a sole trader or contractor, the GST you collect is not your income — it belongs to the ATO. Always keep GST funds separate so they are available when your BAS is due.
                </p>
              </div>
            </motion.div>

            {/* Formula table */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.2 }}
              className="mb-8"
            >
              <h2 className="text-[20px] font-bold text-[#1f2328] mb-4 border-l-4 border-[#2b7fff] pl-4">
                GST formulas
              </h2>
              <div className="rounded-xl border border-[#e7e7e7] overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-[14px]">
                    <thead>
                      <tr className="border-b border-[#e7e7e7] bg-[#f6f8fa]">
                        <th className="text-left px-4 py-2.5 font-semibold text-[#343638]">What you want</th>
                        <th className="text-left px-4 py-2.5 font-semibold text-[#343638]">Formula</th>
                        <th className="text-left px-4 py-2.5 font-semibold text-[#343638]">Example ($100)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        ["Add GST to a price", "Price × 1.1", "$100 × 1.1 = $110"],
                        ["GST amount to add", "Price × 0.1", "$100 × 0.1 = $10"],
                        ["Remove GST from price", "Price ÷ 1.1", "$110 ÷ 1.1 = $100"],
                        ["GST component in price", "Price ÷ 11", "$110 ÷ 11 = $10"],
                      ].map(([label, formula, example], i) => (
                        <tr key={i} className={`border-b border-[#e7e7e7] last:border-0 ${i % 2 === 0 ? "bg-white" : "bg-[#f6f8fa]"}`}>
                          <td className="px-4 py-2.5 text-[#1f2328] font-medium">{label}</td>
                          <td className="px-4 py-2.5 text-[#343638] font-mono">{formula}</td>
                          <td className="px-4 py-2.5 text-[#343638]">{example}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>

            {/* FAQ */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.25 }}
              className="mb-8"
            >
              <h2 className="text-[20px] font-bold text-[#1f2328] mb-4 border-l-4 border-[#2b7fff] pl-4">
                Frequently asked questions
              </h2>
              <div className="rounded-xl border border-[#e7e7e7] bg-white px-5">
                <FAQ
                  q="Do I have to register for GST as a sole trader?"
                  a="You must register for GST if your annual GST turnover is $75,000 or more. If you earn less, registration is optional but can be beneficial if your clients are businesses that can claim input tax credits."
                />
                <FAQ
                  q="When do I need to lodge a BAS?"
                  a="Most small businesses lodge quarterly. Your BAS due dates are 28 October, 28 February, 28 April, and 28 July. Monthly lodgement is available if you prefer. The ATO may also allow annual lodgement if your turnover is under $75,000 and you choose to register voluntarily."
                />
                <FAQ
                  q="Can I claim GST credits on my business expenses?"
                  a="Yes. If you are registered for GST, you can claim input tax credits for the GST included in the price of business purchases. This means you only remit the net GST — what you collected minus what you paid."
                />
                <FAQ
                  q="Is GST charged on all goods and services?"
                  a="No. Some items are GST-free, including most basic foods, some medical services, some educational courses, and exports. Others are input-taxed (such as financial supplies and residential rent). When in doubt, check with your accountant or the ATO."
                />
                <FAQ
                  q="What is the difference between ex-GST and inc-GST prices?"
                  a="Ex-GST (exclusive of GST) is the base price before tax is added. Inc-GST (inclusive of GST) is the final price your customer pays. When invoicing, always make it clear which price you are quoting."
                />
              </div>
            </motion.div>

            {/* CTA block */}
            <div className="rounded-xl bg-[#1b1f24] px-6 py-7 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <p className="text-[16px] font-bold text-white leading-snug mb-1">Know what to charge as a contractor?</p>
                <p className="text-[14px] text-[#c9d1d9] leading-relaxed">Calculate your exact take-home pay and charge-out rate in 60 seconds.</p>
              </div>
              <Link
                href="/#calculator"
                className="shrink-0 inline-flex items-center justify-center gap-2 rounded-full bg-[#2b7fff] px-6 py-2.5 text-[14px] font-semibold text-white transition hover:bg-[#1a6fe8]"
              >
                Try the calculator <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

          </div>

          {/* Right — sidebar */}
          <aside className="lg:w-[280px] shrink-0 flex flex-col gap-6">

            {/* Sticky CTA card */}
            <div className="rounded-xl border border-[#e7e7e7] overflow-hidden sticky top-20">
              <div className="bg-[#1b1f24] px-5 py-4">
                <p className="text-[13px] font-bold uppercase tracking-widest text-[#c9d1d9] mb-1">Contractor Calculator</p>
                <p className="text-[13px] text-[#c9d1d9] leading-relaxed">Find your take-home pay and exact charge-out rate.</p>
              </div>
              <div className="p-4 bg-white">
                <Link
                  href="/#calculator"
                  className="flex items-center justify-center w-full rounded-full bg-[#2b7fff] px-5 py-2.5 text-[14px] font-semibold text-white transition hover:bg-[#1a6fe8]"
                >
                  Calculate my rate
                </Link>
              </div>
            </div>

            {/* GST quick ref */}
            <div className="rounded-xl border border-[#e7e7e7] bg-white overflow-hidden">
              <div className="border-b border-[#e7e7e7] bg-[#f6f8fa] px-4 py-3">
                <h3 className="text-[12px] font-semibold uppercase tracking-wider text-[#343638]">GST Quick Reference</h3>
              </div>
              <div className="divide-y divide-[#e7e7e7] px-4">
                {[
                  ["GST rate", "10%"],
                  ["Registration threshold", "$75,000/yr"],
                  ["Quarterly BAS Q1", "28 Oct 2025"],
                  ["Quarterly BAS Q2", "28 Feb 2026"],
                  ["Quarterly BAS Q3", "28 Apr 2026"],
                  ["Quarterly BAS Q4", "28 Jul 2026"],
                ].map(([label, value]) => (
                  <div key={label} className="flex items-center justify-between py-2.5">
                    <span className="text-[13px] text-[#343638]">{label}</span>
                    <span className="text-[13px] font-semibold text-[#1f2328]">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Related tools */}
            <div className="rounded-xl border border-[#e7e7e7] bg-white overflow-hidden">
              <div className="border-b border-[#e7e7e7] bg-[#f6f8fa] px-4 py-3">
                <h3 className="text-[12px] font-semibold uppercase tracking-wider text-[#343638]">Related Tools</h3>
              </div>
              <div className="divide-y divide-[#e7e7e7]">
                <Link href="/#calculator" className="group flex flex-col gap-0.5 px-4 py-3.5 hover:bg-[#f6f8fa] transition-colors">
                  <span className="text-[14px] font-semibold text-[#1f2328] group-hover:text-[#2b7fff] transition-colors">Contractor Rate Calculator</span>
                  <span className="text-[12px] text-[#8b949e]">Take-home pay & charge-out rate</span>
                </Link>
                <Link href="/blog/quarterly-bas-lodgement-guide-for-sole-traders" className="group flex flex-col gap-0.5 px-4 py-3.5 hover:bg-[#f6f8fa] transition-colors">
                  <span className="text-[14px] font-semibold text-[#1f2328] group-hover:text-[#2b7fff] transition-colors">BAS Lodgement Guide</span>
                  <span className="text-[12px] text-[#8b949e]">How to lodge your quarterly BAS</span>
                </Link>
                <Link href="/blog/contractor-tax-planning-guide" className="group flex flex-col gap-0.5 px-4 py-3.5 hover:bg-[#f6f8fa] transition-colors">
                  <span className="text-[14px] font-semibold text-[#1f2328] group-hover:text-[#2b7fff] transition-colors">Contractor Tax Guide</span>
                  <span className="text-[12px] text-[#8b949e]">Tax planning for contractors</span>
                </Link>
              </div>
            </div>

          </aside>
        </div>
      </main>

      {/* Ad slot 2 */}
      <div className="px-4 md:px-6 py-2">
        <div className="mx-auto max-w-[1280px]">
          <AdSlot label="Ad slot 2, Google AdSense" />
        </div>
      </div>

      <SiteFooter />
    </div>
  );
}
