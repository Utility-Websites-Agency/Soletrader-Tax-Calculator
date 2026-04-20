"use client";

import dynamic from "next/dynamic";

// Defer purely decorative — not needed for LCP
export const BackgroundEffects = dynamic(
  () => import("./BackgroundEffects").then((m) => ({ default: m.BackgroundEffects })),
  { ssr: false }
);

export const ScrollProgress = dynamic(
  () => import("./ScrollProgress").then((m) => ({ default: m.ScrollProgress })),
  { ssr: false }
);

// Defer large calculator bundle — show empty placeholder until hydrated
export const CalculatorSection = dynamic(
  () => import("./CalculatorSection").then((m) => ({ default: m.CalculatorSection })),
  {
    ssr: false,
    loading: () => (
      <div
        id="calculator"
        className="relative z-10 border-b border-[#e7e7e7] py-16 px-6"
        style={{ minHeight: 640 }}
      />
    ),
  }
);

// FAQ accordion — small, still client-only
export const FaqAccordion = dynamic(
  () => import("./FaqAccordion").then((m) => ({ default: m.FaqAccordion })),
  { ssr: false }
);
