"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface SiteNavProps {
  activePage?: "blog-index" | "blog-post" | "tools";
}

export function SiteNav({ activePage }: SiteNavProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md">
        <div className="mx-4 md:mx-6 lg:mx-auto lg:max-w-[1280px] lg:px-6 flex items-center justify-between py-4">
          <Link href="/" className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-[6px] bg-[#1a6fe8] text-[11px] font-bold text-white tracking-tight shrink-0">ST</span>
            <span className="text-[15px] font-semibold text-[#1f2328] tracking-tight">SoleTraderTax</span>
          </Link>
          {/* Desktop center nav — same 4 links as homepage */}
          <nav className="hidden md:flex items-center gap-6 text-[14px] font-medium text-[#343638]">
            <Link href="/" className="hover:text-[#1f2328] transition-colors">Rate calculator</Link>
            <Link href="/#how-it-works" className="hover:text-[#1f2328] transition-colors">How it works</Link>
            <Link href="/#faq" className="hover:text-[#1f2328] transition-colors">FAQ</Link>
            <Link href="/tools/gst-calculator" className="hover:text-[#1f2328] transition-colors">GST Calculator</Link>
            <Link href="/blog" className="hover:text-[#1f2328] transition-colors">Blog</Link>
          </nav>

          {/* Right group: CTA + burger */}
          <div className="flex items-center gap-4">
            {/* Blue CTA — visible on all breakpoints */}
            <Link
              href="/"
              className="inline-flex rounded-full border border-[#1a6fe8] bg-[#1a6fe8] px-5 py-1.5 text-[14px] font-semibold text-white transition hover:bg-[#1560d0]"
            >
              Calculate rate
            </Link>
            {/* Mobile burger */}
            <button
              onClick={() => setDrawerOpen((v) => !v)}
              className="md:hidden flex flex-col items-center justify-center w-9 h-9 rounded-lg border border-[#e7e7e7] bg-white/80 gap-1.5 focus:outline-none"
              aria-label="Open menu"
            >
              <motion.span
                animate={drawerOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.25 }}
                className="block h-[1.5px] w-4 bg-[#1f2328] rounded-full origin-center"
              />
              <motion.span
                animate={drawerOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
                transition={{ duration: 0.2 }}
                className="block h-[1.5px] w-4 bg-[#1f2328] rounded-full"
              />
              <motion.span
                animate={drawerOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.25 }}
                className="block h-[1.5px] w-4 bg-[#1f2328] rounded-full origin-center"
              />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm md:hidden"
              onClick={() => setDrawerOpen(false)}
            />
            <motion.div
              key="drawer"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 32 }}
              className="fixed top-0 right-0 z-50 h-full w-[300px] bg-white shadow-2xl flex flex-col md:hidden"
            >
              {/* Close button row */}
              <div className="flex justify-end p-3">
                <button
                  onClick={() => setDrawerOpen(false)}
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-[#343638] hover:bg-[#f6f8fa] transition-colors"
                  aria-label="Close menu"
                >
                  <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4">
                    <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                  </svg>
                </button>
              </div>
              <nav className="flex flex-col gap-1 px-4 flex-1">
                {[
                  { label: "Rate calculator", href: "/" },
                  { label: "How it works", href: "/#how-it-works" },
                  { label: "FAQ", href: "/#faq" },
                  { label: "GST Calculator", href: "/tools/gst-calculator" },
                  { label: "Blog", href: "/blog" },
                ].map((item, i) => (
                  <motion.a
                    key={item.label}
                    href={item.href}
                    onClick={() => setDrawerOpen(false)}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 + i * 0.05, duration: 0.2 }}
                    className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-[20px] font-medium text-[#1f2328] hover:bg-[#f6f8fa] transition-colors"
                  >
                    {item.label}
                  </motion.a>
                ))}
              </nav>
              <div className="p-4 border-t border-[#e7e7e7]">
                <Link
                  href="/"
                  className="flex items-center justify-center w-full rounded-full bg-[#1a6fe8] px-5 py-3 text-[15px] font-semibold text-white transition hover:bg-[#1560d0]"
                >
                  Calculate rate
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
