"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const FAQS = [
  {
    q: "Why is my charge-out rate much higher than my desired income?",
    a: "Because your hourly rate must cover more than just your take-home pay. It needs to cover: income tax (which is reverse-calculated from your target), all your business overheads (vehicle, tools, insurance, etc.), and it's spread only across your realistic billable hours, not 40 hours a week. Sole traders typically bill 20–25 hours out of every 38-hour week once admin, travel, quoting, and quiet periods are accounted for.",
  },
  {
    q: "How does the reverse tax calculation work?",
    a: "Most calculators ask for your gross income and show tax. This one works backwards: you tell us how much you want to take home, and the engine finds the pre-tax income that, after applying ATO's progressive brackets and Medicare levy, leaves you with exactly that amount. It uses an iterative binary search accurate to within $1.",
  },
  {
    q: "What does the market benchmark show?",
    a: "The benchmark shows what other contractors in your profession and location are typically charging, based on our dataset. It's informational only. Your required rate is driven solely by your take-home target, tax, overheads, and billable hours. You may need to charge above or below market rates depending on your personal situation.",
  },
  {
    q: "Why use 25 billable hours as the default?",
    a: "Sole traders lose significant time to quoting, travel, admin, invoicing, chasing payments, and quiet periods. 38 hours of employment work ≠ 38 billable hours. Industry data suggests 20–30 billable hours per week is realistic for most trades and freelancers. You can adjust this to match your actual billing pattern.",
  },
];

export function FaqAccordion() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <section id="faq" className="relative z-10 border-b border-[#e7e7e7] py-20 px-6">
      <div className="mx-auto max-w-[860px]">
        <h2 className="text-[28px] font-extrabold tracking-tight text-[#1f2328] mb-2">Frequently asked questions</h2>
        <p className="text-[15px] text-[#343638] mb-10 font-medium">
          Everything you need to understand the model and trust the output.
        </p>
        <div className="flex flex-col gap-2">
          {FAQS.map((item, i) => (
            <div key={i} className="rounded-xl border border-[#e7e7e7] bg-white overflow-hidden">
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-[#f6f8fa] transition-colors"
              >
                <span className="text-[14px] font-semibold text-[#1f2328]">{item.q}</span>
                <ChevronDown className={`w-4 h-4 text-[#5f676f] shrink-0 ml-4 transition-transform ${openFaq === i ? "rotate-180" : ""}`} />
              </button>
              <AnimatePresence>
                {openFaq === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-4 border-t border-[#e7e7e7] pt-4 text-[14px] text-[#343638] leading-relaxed bg-[#f6f8fa]">
                      {item.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
