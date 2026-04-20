"use client";

import { useState } from "react";

export function HomeNav() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  function scrollTo(id: string) {
    return (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      setDrawerOpen(false);
      const el = document.getElementById(id);
      if (!el) return;
      const top = el.getBoundingClientRect().top + window.scrollY - 56 - 16;
      window.scrollTo({ top, behavior: "smooth" });
    };
  }

  return (
    <>
      <header className="sticky top-0 z-50 bg-transparent backdrop-blur-md">
        <div className="mx-4 md:mx-6 lg:mx-auto lg:max-w-[1280px] lg:px-6 flex items-center justify-between py-4">
          <a href="/" className="flex items-center">
            <span className="text-[15px] font-semibold text-[#1f2328] tracking-tight">SoleTraderTax</span>
          </a>
          <nav className="hidden md:flex items-center gap-6 text-[14px] font-medium text-[#343638]">
            <a href="#calculator" onClick={scrollTo("calculator")} className="hover:text-[#1f2328] transition-colors">Rate calculator</a>
            <a href="#how-it-works" onClick={scrollTo("how-it-works")} className="hover:text-[#1f2328] transition-colors">How it works</a>
            <a href="#faq" onClick={scrollTo("faq")} className="hover:text-[#1f2328] transition-colors">FAQ</a>
            <a href="/tools/gst-calculator" className="hover:text-[#1f2328] transition-colors">GST Calculator</a>
            <a href="/blog" className="hover:text-[#1f2328] transition-colors">Blog</a>
          </nav>
          <div className="flex items-center gap-4">
            <a
              href="#calculator"
              onClick={scrollTo("calculator")}
              className="inline-flex rounded-full border border-[#1a6fe8] bg-[#1a6fe8] px-5 py-1.5 text-[14px] font-semibold text-white transition hover:bg-[#1560d0]"
            >
              Calculate rate
            </a>
            <button
              onClick={() => setDrawerOpen((v) => !v)}
              className="md:hidden flex flex-col items-center justify-center w-9 h-9 rounded-lg border border-[#e7e7e7] bg-white/80 gap-1.5 focus:outline-none"
              aria-label="Open menu"
            >
              <span
                className="block h-[1.5px] w-4 bg-[#1f2328] rounded-full origin-center transition-transform duration-200"
                style={{ transform: drawerOpen ? "rotate(45deg) translateY(4px)" : "none" }}
              />
              <span
                className="block h-[1.5px] w-4 bg-[#1f2328] rounded-full transition-opacity duration-150"
                style={{ opacity: drawerOpen ? 0 : 1 }}
              />
              <span
                className="block h-[1.5px] w-4 bg-[#1f2328] rounded-full origin-center transition-transform duration-200"
                style={{ transform: drawerOpen ? "rotate(-45deg) translateY(-4px)" : "none" }}
              />
            </button>
          </div>
        </div>
      </header>

      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm md:hidden transition-opacity duration-250"
        style={{ opacity: drawerOpen ? 1 : 0, pointerEvents: drawerOpen ? "auto" : "none" }}
        onClick={() => setDrawerOpen(false)}
      />

      {/* Drawer */}
      <div
        className="fixed top-0 right-0 z-50 h-full w-[300px] bg-white shadow-2xl flex flex-col md:hidden transition-transform duration-300"
        style={{ transform: drawerOpen ? "translateX(0)" : "translateX(100%)" }}
      >
        <div className="flex justify-end p-3">
          <button
            onClick={() => setDrawerOpen(false)}
            className="w-10 h-10 rounded-lg flex items-center justify-center text-[#343638] hover:bg-[#f6f8fa] transition-colors"
            aria-label="Close menu"
          >
            <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4">
              <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        <nav className="flex flex-col gap-1 px-4 flex-1">
          {[
            { label: "Rate calculator", id: "calculator", href: "#calculator" },
            { label: "How it works", id: "how-it-works", href: "#how-it-works" },
            { label: "FAQ", id: "faq", href: "#faq" },
            { label: "GST Calculator", id: "gst", href: "/tools/gst-calculator" },
            { label: "Blog", id: "blog", href: "/blog" },
          ].map((item) => (
            <a
              key={item.id}
              href={item.href}
              onClick={item.href.startsWith("#") ? scrollTo(item.id) : () => setDrawerOpen(false)}
              className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-[20px] font-medium text-[#1f2328] hover:bg-[#f6f8fa] transition-colors"
            >
              {item.label}
            </a>
          ))}
        </nav>
        <div className="p-4 border-t border-[#e7e7e7]">
          <a
            href="#calculator"
            onClick={scrollTo("calculator")}
            className="flex items-center justify-center w-full rounded-full bg-[#1a6fe8] px-5 py-3 text-[15px] font-semibold text-white transition hover:bg-[#1560d0]"
          >
            Calculate rate
          </a>
        </div>
      </div>
    </>
  );
}
