"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence, useMotionValue, useMotionTemplate, useAnimationFrame } from "framer-motion";
import {
  ChevronDown,
  Check,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Info,
  BookOpen,
} from "lucide-react";

// ─── DATA ───────────────────────────────────────────────────────────────────

// Base rates = typical AU charge-out rate midpoint (excl. GST), sourced from
// Hipages, ServiceSeeking & ABS 2024 labour force data. Range shown is ±20%.
const PROFESSIONS = [
  { id: "electrician",  name: "Electrician",                base: 105 },
  { id: "plumber",      name: "Plumber",                    base: 105 },
  { id: "builder",      name: "Builder / Carpenter",        base: 90  },
  { id: "painter",      name: "Painter",                    base: 65  },
  { id: "hvac",         name: "HVAC Technician",            base: 115 },
  { id: "handyman",     name: "Handyman",                   base: 70  },
  { id: "cleaner",      name: "Cleaner",                    base: 45  },
  { id: "landscaper",   name: "Landscaper",                 base: 70  },
  { id: "truck",        name: "Truck / Contractor Labour",  base: 85  },
  { id: "freelancer",   name: "Freelancer / Consultant",    base: 155 },
  { id: "it",           name: "IT / Digital Freelancer",    base: 175 },
  { id: "other",        name: "Other",                      base: 95  },
];


const AU_STATES = [
  { id: "NSW", name: "New South Wales (NSW)", mult: 1.08 },
  { id: "VIC", name: "Victoria (VIC)",        mult: 1.05 },
  { id: "QLD", name: "Queensland (QLD)",      mult: 1.03 },
  { id: "WA",  name: "Western Australia (WA)",mult: 1.03 },
  { id: "SA",  name: "South Australia (SA)",  mult: 1.00 },
  { id: "TAS", name: "Tasmania (TAS)",        mult: 0.90 },
  { id: "ACT", name: "ACT",                  mult: 1.05 },
];

const LOCATION_TYPES = [
  { id: "METRO",    name: "Metro / High Demand",  flag: "🏙️", mult: 1.08 },
  { id: "REGIONAL", name: "Regional / Rural",     flag: "🌄", mult: 0.88 },
];

// ─── AU PROGRESSIVE TAX ──────────────────────────────────────────────────────

const AU_BRACKETS = [
  { label: "$0 – $18,200",       min: 0,       max: 18200,  rate: 0    },
  { label: "$18,201 – $45,000",  min: 18200,   max: 45000,  rate: 0.16 },
  { label: "$45,001 – $135,000", min: 45000,   max: 135000, rate: 0.30 },
  { label: "$135,001 – $190,000",min: 135000,  max: 190000, rate: 0.37 },
  { label: "$190,001+",          min: 190000,  max: Infinity,rate: 0.45 },
];

interface AUTaxResult {
  incomeTax: number;
  medicareLevy: number;
  totalTax: number;
  effectiveRate: number;
  marginalRate: number;
  slices: { label: string; rate: number; taxable: number; amount: number }[];
}

function calcAUTax(income: number): AUTaxResult {
  let incomeTax = 0;
  const slices: AUTaxResult["slices"] = [];

  for (const b of AU_BRACKETS) {
    if (income <= b.min) break;
    const taxable = Math.min(income, b.max) - b.min;
    const amount  = taxable * b.rate;
    incomeTax += amount;
    slices.push({ label: b.label, rate: b.rate, taxable, amount });
  }

  const medicareLevy  = income * 0.02;
  const totalTax      = incomeTax + medicareLevy;
  const effectiveRate = income > 0 ? totalTax / income : 0;
  const marginalRate  =
    income > 190000 ? 0.45 :
    income > 135000 ? 0.37 :
    income > 45000  ? 0.30 :
    income > 18200  ? 0.16 : 0;

  return { incomeTax, medicareLevy, totalTax, effectiveRate, marginalRate, slices };
}

// Binary search: find pre-tax income that produces exactly `takeHome` after ATO tax
function reverseAUTax(takeHome: number): { requiredIncome: number; taxResult: AUTaxResult } {
  if (takeHome <= 0) return { requiredIncome: 0, taxResult: calcAUTax(0) };

  let lo = takeHome;
  let hi = takeHome * 2.5; // generous upper bound covers any bracket

  for (let i = 0; i < 80; i++) {
    const mid    = (lo + hi) / 2;
    const tax    = calcAUTax(mid);
    const net    = mid - tax.totalTax;
    if (Math.abs(net - takeHome) < 1) break;
    if (net < takeHome) lo = mid;
    else hi = mid;
  }

  const requiredIncome = (lo + hi) / 2;
  return { requiredIncome, taxResult: calcAUTax(requiredIncome) };
}

// ─── SMALL COMPONENTS ────────────────────────────────────────────────────────

function GitBookCallout({
  type,
  children,
}: {
  type: "info" | "warning" | "success" | "tip";
  children: React.ReactNode;
}) {
  const styles = {
    info:    { border: "border-blue-200",   bg: "bg-blue-50",   icon: <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />,           text: "text-blue-900"  },
    warning: { border: "border-amber-200",  bg: "bg-amber-50",  icon: <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />, text: "text-amber-900" },
    success: { border: "border-green-200",  bg: "bg-green-50",  icon: <Check className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />,         text: "text-green-900" },
    tip:     { border: "border-blue-200",   bg: "bg-blue-50",   icon: <BookOpen className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />,       text: "text-blue-900"  },
  };
  const s = styles[type];
  return (
    <div className={`flex gap-3 rounded-lg ${s.bg} px-4 py-3`}>
      {s.icon}
      <p className={`text-[14px] leading-relaxed ${s.text}`}>{children}</p>
    </div>
  );
}

function Select({
  label,
  options,
  selected,
  onSelect,
}: {
  label: string;
  options: { id: string; name: string; flag?: string }[];
  selected: { id: string; name: string; flag?: string };
  onSelect: (o: any) => void;
}) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0, width: 0 });
  const btnRef = React.useRef<HTMLButtonElement>(null);

  const handleToggle = () => {
    if (!open && btnRef.current) {
      const r = btnRef.current.getBoundingClientRect();
      setPos({ top: r.bottom + 4, left: r.left, width: r.width });
    }
    setOpen((v) => !v);
  };

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[12px] font-semibold uppercase tracking-wider text-[#6e7781]">
        {label}
      </label>
      <button
        ref={btnRef}
        onClick={handleToggle}
        className="flex items-center justify-between rounded-lg border border-[#e7e7e7] bg-white px-3 py-2.5 text-[14px] font-medium text-[#1f2328] transition hover:border-[#5f676f] focus:outline-none focus:ring-2 focus:ring-[#2b7fff]/20"
      >
        <span className="flex items-center gap-2">
          {selected.flag && <span>{selected.flag}</span>}
          {selected.name}
        </span>
        <ChevronDown className={`w-4 h-4 text-[#5f676f] transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            <motion.ul
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              transition={{ duration: 0.15 }}
              style={{ position: "fixed", top: pos.top, left: pos.left, width: pos.width }}
              className="z-50 overflow-y-auto rounded-lg border border-[#e7e7e7] bg-white py-1 max-h-60"
            >
              {options.map((opt) => (
                <li key={opt.id}>
                  <button
                    onClick={() => { onSelect(opt); setOpen(false); }}
                    className="flex w-full items-center justify-between px-3 py-2 text-[14px] hover:bg-[#f6f8fa] transition-colors"
                  >
                    <span className="flex items-center gap-2 font-medium text-[#1f2328]">
                      {opt.flag && <span>{opt.flag}</span>}
                      {opt.name}
                    </span>
                    {selected.id === opt.id && (
                      <Check className="w-3.5 h-3.5 text-[#2b7fff]" />
                    )}
                  </button>
                </li>
              ))}
            </motion.ul>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}


function NumberInput({
  label,
  value,
  onChange,
  prefix,
  suffix,
  helper,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  prefix?: string;
  suffix?: string;
  helper?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[12px] font-semibold uppercase tracking-wider text-[#6e7781]">
        {label}
      </label>
      <div className="relative flex items-center">
        {prefix && (
          <span className="absolute left-3 text-[#6e7781] text-[14px] font-medium pointer-events-none">
            {prefix}
          </span>
        )}
        <input
          type="number"
          value={value || ""}
          onChange={(e) => onChange(Number(e.target.value) || 0)}
          inputMode="numeric"
          className={`w-full rounded-lg border border-[#e7e7e7] bg-white py-2.5 text-[14px] font-medium text-[#1f2328] outline-none transition focus:border-[#2b7fff] focus:ring-2 focus:ring-[#2b7fff]/20 ${prefix ? "pl-8" : "pl-3"} ${suffix ? "pr-10" : "pr-3"}`}
          placeholder="0"
        />
        {suffix && (
          <span className="absolute right-3 text-[#6e7781] text-[14px] font-medium pointer-events-none">
            {suffix}
          </span>
        )}
      </div>
      {helper && <p className="text-[14px] text-[#5f676f]">{helper}</p>}
    </div>
  );
}

function AnimatedNumber({ value, prefix = "" }: { value: number; prefix?: string }) {
  const [display, setDisplay] = useState(value);
  useEffect(() => {
    let start = display;
    const end = value;
    if (Math.abs(end - start) < 0.5) return;
    const duration = 350;
    const startTime = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - startTime) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setDisplay(start + (end - start) * ease);
      if (p < 1) requestAnimationFrame(tick);
      else setDisplay(end);
    };
    requestAnimationFrame(tick);
  }, [value]); // eslint-disable-line react-hooks/exhaustive-deps
  return <>{prefix}{Math.round(display).toLocaleString("en-AU")}</>;
}

function ConfidenceBadge({ level, note }: { level: string; note: string }) {
  const color =
    level === "HIGH"      ? "bg-green-50 text-green-700" :
    level === "MEDIUM"    ? "bg-amber-50 text-amber-700" :
                            "bg-gray-50 text-gray-500";
  const dot =
    level === "HIGH"   ? "bg-green-500" :
    level === "MEDIUM" ? "bg-amber-500" : "bg-gray-400";
  return (
    <div className={`flex items-center gap-2 rounded-lg px-3 py-2.5 text-[14px] font-semibold ${color}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
      <span>Confidence: {level} — <span className="font-medium">{note}</span></span>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-[#e7e7e7] bg-white">
      <div className="border-b border-[#e7e7e7] bg-[#f6f8fa] px-5 py-3 rounded-t-xl">
        <h2 className="text-[14px] font-semibold text-[#1f2328] uppercase tracking-wider">
          {title}
        </h2>
      </div>
      <div className="p-5 flex flex-col gap-4">{children}</div>
    </div>
  );
}

// ─── ANIMATED GRID ────────────────────────────────────────────────────────────

function GridPattern({ id, offsetX, offsetY }: { id: string; offsetX: any; offsetY: any }) {
  return (
    <svg className="w-full h-full">
      <defs>
        <motion.pattern
          id={id}
          width="40"
          height="40"
          patternUnits="userSpaceOnUse"
          x={offsetX}
          y={offsetY}
        >
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
        </motion.pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────

export default function Home() {
  const [profession, setProfession]   = useState(PROFESSIONS[0]);
  const [state, setState]             = useState(AU_STATES[0]);
  const [locType, setLocType]         = useState(LOCATION_TYPES[0]);
  const [desiredIncome, setDesiredIncome] = useState(100000);
  const [hoursPerWeek, setHoursPerWeek]   = useState(25);
  const [weeksPerYear, setWeeksPerYear]   = useState(46);
  const [overheads, setOverheads] = useState({
    vehicle: 400, tools: 150, insurance: 100, software: 150, marketing: 200, misc: 200,
  });
  const [includeGst, setIncludeGst]     = useState(false);
  const [manualTaxOverride, setManualTaxOverride] = useState(false);
  const [taxPct, setTaxPct]             = useState(30);
  const [taxBreakdownOpen, setTaxBreakdownOpen]   = useState(false);
  const [openFaq, setOpenFaq]           = useState<number | null>(null);
  const [drawerOpen, setDrawerOpen]     = useState(false);

  // AU only — ATO 2025-26
  const sym = "$";

  // ── CORE CALCULATION ENGINE ────────────────────────────────────────────────
  // Step 1: Reverse ATO tax → required pre-tax income
  // Step 2: Add business overheads → required revenue
  // Step 3: Divide by realistic billable hours → required charge-out rate
  // Benchmarks are display-only and do NOT influence the rate.
  const calc = useMemo(() => {
    // Step 1 — Reverse ATO tax (or manual flat rate override)
    let requiredTaxableIncome: number;
    let taxAmt: number;
    let auTaxResult: AUTaxResult | null = null;

    if (!manualTaxOverride) {
      const rev = reverseAUTax(desiredIncome);
      requiredTaxableIncome = rev.requiredIncome;
      taxAmt                = rev.taxResult.totalTax;
      auTaxResult           = rev.taxResult;
    } else {
      taxAmt                = desiredIncome * (taxPct / 100);
      requiredTaxableIncome = desiredIncome + taxAmt;
    }

    // Step 2 — Business overheads
    const annualCosts     = Object.values(overheads).reduce((a, b) => a + b, 0) * 12;
    const requiredRevenue = requiredTaxableIncome + annualCosts;

    // Step 3 — Billable hours → charge-out rate
    const billableHours = (hoursPerWeek * weeksPerYear) || 1;
    const requiredRate  = requiredRevenue / billableHours;
    const minRate       = requiredRate * 0.9;
    const premiumRate   = requiredRate * 1.15;

    // Benchmark — guide only, zero influence on rate
    const benchMult = (state.mult + locType.mult) / 2;
    const benchMid  = profession.base * benchMult;
    const benchLow  = benchMid * 0.80;
    const benchHigh = benchMid * 1.20;
    const comparison =
      requiredRate < benchLow  ? "BELOW"  :
      requiredRate > benchHigh ? "ABOVE"  : "WITHIN";

    const gstDisplay = includeGst;

    return {
      recRate:  gstDisplay ? requiredRate * 1.10 : requiredRate,
      minRate:  gstDisplay ? minRate      * 1.10 : minRate,
      preRate:  gstDisplay ? premiumRate  * 1.10 : premiumRate,
      benchLow, benchHigh, comparison,
      netTakeHome: desiredIncome,
      taxAmt,
      requiredTaxableIncome,
      annualCosts,
      requiredRevenue,
      billableHours,
      auTaxResult,
    };
  }, [profession, state, locType, desiredIncome, hoursPerWeek, weeksPerYear, overheads, taxPct, manualTaxOverride, includeGst]);

  const locationLabel = `${state.id} · ${locType.name}`;

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

  // ── FULL-PAGE GRID ANIMATION ───────────────────────────────────────────────
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const gridOffsetX = useMotionValue(0);
  const gridOffsetY = useMotionValue(0);

  useAnimationFrame(() => {
    gridOffsetX.set((gridOffsetX.get() + 0.5) % 40);
    gridOffsetY.set((gridOffsetY.get() + 0.5) % 40);
  });

  const maskImage = useMotionTemplate`radial-gradient(300px circle at ${mouseX}px ${mouseY}px, black, transparent)`;

  const faqs = [
    {
      q: "Why is my charge-out rate much higher than my desired income?",
      a: "Because your hourly rate must cover more than just your take-home pay. It needs to cover: income tax (which is reverse-calculated from your target), all your business overheads (vehicle, tools, insurance, etc.), and it's spread only across your realistic billable hours — not 40 hours a week. Sole traders typically bill 20–25 hours out of every 38-hour week once admin, travel, quoting, and quiet periods are accounted for.",
    },
    {
      q: "How does the reverse tax calculation work?",
      a: "Most calculators ask for your gross income and show tax. This one works backwards: you tell us how much you want to take home, and the engine finds the pre-tax income that — after applying ATO's progressive brackets and Medicare levy — leaves you with exactly that amount. It uses an iterative binary search accurate to within $1.",
    },
    {
      q: "What does the market benchmark show?",
      a: "The benchmark shows what other contractors in your profession and location are typically charging, based on our dataset. It's informational only — your required rate is driven solely by your take-home target, tax, overheads, and billable hours. You may need to charge above or below market rates depending on your personal situation.",
    },
    {
      q: "Why use 25 billable hours as the default?",
      a: "Sole traders lose significant time to quoting, travel, admin, invoicing, chasing payments, and quiet periods. 38 hours of employment work ≠ 38 billable hours. Industry data suggests 20–30 billable hours per week is realistic for most trades and freelancers. You can adjust this to match your actual billing pattern.",
    },
  ];

  return (
    <div
      className="min-h-screen bg-transparent font-sans text-[#1f2328] selection:bg-[#2b7fff]/15 relative"
      onMouseMove={(e) => { mouseX.set(e.clientX); mouseY.set(e.clientY); }}
    >
      {/* ── FULL-PAGE GRID (fixed, behind all content) ── */}
      <div className="fixed inset-0 z-0 pointer-events-none text-gray-400 opacity-[0.05]">
        <GridPattern id="grid-static" offsetX={gridOffsetX} offsetY={gridOffsetY} />
      </div>
      <motion.div
        className="fixed inset-0 z-0 pointer-events-none text-gray-400 opacity-40"
        style={{ maskImage, WebkitMaskImage: maskImage }}
      >
        <GridPattern id="grid-reveal" offsetX={gridOffsetX} offsetY={gridOffsetY} />
      </motion.div>

      {/* ── COLOUR BLOBS (fixed, behind all content) ── */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute right-[-20%] top-[-20%] w-[40%] h-[40%] rounded-full bg-orange-500/20 blur-[120px]" />
        <div className="absolute right-[10%] top-[-10%] w-[20%] h-[20%] rounded-full bg-blue-500/15 blur-[100px]" />
        <div className="absolute left-[-10%] bottom-[-20%] w-[40%] h-[40%] rounded-full bg-blue-500/20 blur-[120px]" />
      </div>

      {/* ── NAV ── */}
      <header className="sticky top-0 z-50 bg-transparent backdrop-blur-md">
        <div className="mx-4 md:mx-6 lg:mx-auto lg:max-w-[1280px] lg:px-6 flex h-14 items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[#2b7fff] text-white">
              <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4">
                <path d="M3 4h10M3 8h7M3 12h5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
            </div>
            <span className="text-[15px] font-semibold text-[#1f2328] tracking-tight">RateIQ</span>
            <span className="hidden sm:inline ml-1 rounded-full border border-[#2b7fff]/30 bg-[#2b7fff]/8 px-2 py-0.5 text-[14px] font-semibold uppercase tracking-wider text-[#2b7fff]">
              AU
            </span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-[14px] font-medium text-[#57606a]">
            <a href="#calculator" onClick={scrollTo("calculator")} className="hover:text-[#1f2328] transition-colors">Calculator</a>
            <a href="#how-it-works" onClick={scrollTo("how-it-works")} className="hover:text-[#1f2328] transition-colors">How it works</a>
            <a href="#faq" onClick={scrollTo("faq")} className="hover:text-[#1f2328] transition-colors">FAQ</a>
            <a href="/blog" className="hover:text-[#1f2328] transition-colors">Blog</a>
          </nav>
          <div className="flex items-center gap-3">
            <a
              href="#calculator"
              onClick={scrollTo("calculator")}
              className="hidden md:inline-flex rounded-full border border-[#2b7fff] bg-[#2b7fff] px-5 py-1.5 text-[14px] font-semibold text-white transition hover:bg-[#1a6fe8]"
            >
              Get started
            </a>
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

      {/* ── MOBILE DRAWER ── */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm md:hidden"
              onClick={() => setDrawerOpen(false)}
            />
            {/* Drawer */}
            <motion.div
              key="drawer"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 32 }}
              className="fixed top-0 right-0 z-50 h-full w-[280px] bg-white shadow-2xl flex flex-col md:hidden"
            >
              {/* Drawer header */}
              <div className="flex items-center justify-between px-5 h-14 border-b border-[#e7e7e7]">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-6 w-6 items-center justify-center rounded-md bg-[#2b7fff]">
                    <svg viewBox="0 0 16 16" fill="none" className="w-3.5 h-3.5">
                      <path d="M3 4h10M3 8h7M3 12h5" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <span className="text-[14px] font-semibold text-[#1f2328]">RateIQ</span>
                </div>
                <button
                  onClick={() => setDrawerOpen(false)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-[#57606a] hover:bg-[#f6f8fa] transition-colors"
                  aria-label="Close menu"
                >
                  <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4">
                    <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                  </svg>
                </button>
              </div>
              {/* Drawer links */}
              <nav className="flex flex-col gap-1 p-4 flex-1">
                {[
                  { label: "Calculator", id: "calculator", href: "#calculator" },
                  { label: "How it works", id: "how-it-works", href: "#how-it-works" },
                  { label: "FAQ", id: "faq", href: "#faq" },
                  { label: "Blog", id: "blog", href: "/blog" },
                ].map((item, i) => (
                  <motion.a
                    key={item.id}
                    href={item.href}
                    onClick={item.href.startsWith("#") ? scrollTo(item.id) : () => setDrawerOpen(false)}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 + i * 0.05, duration: 0.2 }}
                    className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-[15px] font-medium text-[#1f2328] hover:bg-[#f6f8fa] transition-colors"
                  >
                    {item.label}
                  </motion.a>
                ))}
              </nav>
              {/* Drawer CTA */}
              <div className="p-4 border-t border-[#e7e7e7]">
                <a
                  href="#calculator"
                  onClick={scrollTo("calculator")}
                  className="flex items-center justify-center w-full rounded-full bg-[#2b7fff] px-5 py-3 text-[15px] font-semibold text-white transition hover:bg-[#1a6fe8]"
                >
                  Get started →
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── HERO ── */}
      <section className="relative z-10 px-4 md:px-6 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-2xl"
        >
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#e7e7e7] bg-white px-3 py-1.5 text-[14px] font-medium text-[#57606a]">
            <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
            Free · No sign-up · ATO 2025-26 tax rates
          </div>
          <h1 className="text-[38px] md:text-[54px] font-extrabold tracking-tight text-[#1f2328] leading-[1.1]">
            What should you{" "}
            <span className="text-[#2b7fff]">actually charge?</span>
          </h1>
          <p className="mt-5 text-[16px] text-[#1f2328] leading-relaxed font-medium">
            Enter your desired take-home pay and we reverse-calculate the exact charge-out rate you need — after ATO tax, Medicare levy, and all your business overheads.
          </p>
          <a
            href="#calculator"
            onClick={scrollTo("calculator")}
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#2b7fff] px-8 py-3 text-[16px] font-semibold text-white transition hover:bg-[#1a6fe8] active:scale-95"
          >
            Calculate my rate →
          </a>
        </motion.div>
      </section>

      {/* ── CALCULATOR ── */}
      <section id="calculator" className="relative z-10 border-b border-[#e7e7e7] pb-16 md:py-16 px-4 md:px-6">
        <div className="mx-auto max-w-[1280px] grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">

          {/* LEFT: Inputs */}
          <div className="lg:col-span-7 flex flex-col gap-5">

            {/* Context */}
            <Section title="About You">
              <Select label="I am a..." options={PROFESSIONS} selected={profession} onSelect={setProfession} />
              <div className="grid sm:grid-cols-2 gap-4">
                <Select label="State / Territory" options={AU_STATES} selected={state} onSelect={setState} />
                <Select label="Location Type" options={LOCATION_TYPES} selected={locType} onSelect={setLocType} />
              </div>
            </Section>

            {/* Income & Workload */}
            <Section title="Income & Workload">
              <div className="grid sm:grid-cols-3 gap-4">
                <NumberInput
                  label="Desired annual take-home"
                  value={desiredIncome}
                  onChange={setDesiredIncome}
                  prefix={sym}
                  helper="After tax, what do you want to earn?"
                />
                <NumberInput
                  label="Billable hours per week"
                  value={hoursPerWeek}
                  onChange={setHoursPerWeek}
                  suffix="hrs"
                  helper="Excludes admin, travel and quoting time"
                />
                <NumberInput
                  label="Weeks worked per year"
                  value={weeksPerYear}
                  onChange={setWeeksPerYear}
                  suffix="wks"
                  helper="Exclude holidays & quiet periods"
                />
              </div>
              <GitBookCallout type="tip">
                Sole traders typically bill <strong>20–25 hours</strong> out of every 38-hour week. Admin, travel, quoting, and quiet periods eat the rest. Adjust to match your actual billing pattern.
              </GitBookCallout>
            </Section>

            {/* Overheads */}
            <Section title="Monthly Business Overheads">
              <GitBookCallout type="tip">
                All business costs are added to your revenue requirement before calculating your rate.
              </GitBookCallout>
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                {(Object.keys(overheads) as (keyof typeof overheads)[]).map((key) => (
                  <NumberInput
                    key={key}
                    label={key.charAt(0).toUpperCase() + key.slice(1)}
                    value={overheads[key]}
                    onChange={(v) => setOverheads((prev) => ({ ...prev, [key]: v }))}
                    prefix={sym}
                    suffix="/mo"
                  />
                ))}
              </div>
              <div className="rounded-lg bg-[#f6f8fa] px-4 py-3 flex justify-between items-center text-[14px]">
                <span className="text-[#57606a] font-medium">Total annual overheads</span>
                <span className="font-bold text-[#1f2328]">
                  {sym}{(Object.values(overheads).reduce((a, b) => a + b, 0) * 12).toLocaleString()}
                </span>
              </div>
            </Section>

            {/* Tax Section */}
            {!manualTaxOverride ? (
              <div className="rounded-xl border border-[#e7e7e7] bg-white overflow-hidden">
                <div className="border-b border-[#e7e7e7] bg-[#f6f8fa] px-5 py-3 flex items-center justify-between">
                  <div>
                    <h2 className="text-[14px] font-semibold text-[#1f2328] uppercase tracking-wider">Tax Estimate (Auto)</h2>
                    <p className="text-[14px] text-[#5f676f] mt-0.5">Reverse-calculated from your take-home target using ATO 2025-26 progressive brackets</p>
                  </div>
                  <button
                    onClick={() => setManualTaxOverride(true)}
                    className="text-[14px] font-semibold text-[#2b7fff] hover:underline shrink-0 ml-4"
                  >
                    Manual override
                  </button>
                </div>
                <div className="p-5 flex flex-col gap-4">

                  {/* Reverse calc result callout */}
                  {calc.auTaxResult && (
                    <div className="rounded-lg bg-[#f6f8fa] px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <div>
                        <p className="text-[14px] font-bold uppercase tracking-wider text-[#5f676f] mb-0.5">Required pre-tax income</p>
                        <p className="text-[22px] font-extrabold text-[#1f2328]">
                          {sym}{Math.round(calc.requiredTaxableIncome).toLocaleString()}
                        </p>
                      </div>
                      <div className="text-[12px] text-[#57606a] sm:text-right">
                        <p>To take home</p>
                        <p className="font-bold text-green-600 text-[15px]">{sym}{Math.round(desiredIncome).toLocaleString()}</p>
                      </div>
                    </div>
                  )}

                  {/* 4 stat cards */}
                  {calc.auTaxResult && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      <div className="rounded-lg bg-[#f6f8fa] px-3 py-3">
                        <p className="text-[14px] font-bold uppercase tracking-wider text-[#5f676f] mb-1">Marginal bracket</p>
                        <p className="text-[16px] font-extrabold text-[#1f2328]">{(calc.auTaxResult.marginalRate * 100).toFixed(0)}%</p>
                      </div>
                      <div className="rounded-lg bg-[#f6f8fa] px-3 py-3">
                        <p className="text-[14px] font-bold uppercase tracking-wider text-[#5f676f] mb-1">Medicare levy</p>
                        <p className="text-[16px] font-extrabold text-[#1f2328]">2%</p>
                      </div>
                      <div className="rounded-lg bg-[#f6f8fa] px-3 py-3">
                        <p className="text-[14px] font-bold uppercase tracking-wider text-[#5f676f] mb-1">Est. annual tax</p>
                        <p className="text-[16px] font-extrabold text-[#1f2328]">{sym}{Math.round(calc.taxAmt).toLocaleString()}</p>
                      </div>
                    </div>
                  )}

                  {/* Accordion */}
                  {calc.auTaxResult && (
                    <div className="flex flex-col">
                      <button
                        onClick={() => setTaxBreakdownOpen((v) => !v)}
                        className="flex items-center justify-between rounded-lg border border-[#e7e7e7] bg-white px-3 py-2.5 text-[14px] font-medium text-[#1f2328] transition hover:border-[#5f676f] focus:outline-none focus:ring-2 focus:ring-[#2b7fff]/20"
                      >
                        <span>See tax breakdown by bracket</span>
                        <ChevronDown className={`w-4 h-4 text-[#5f676f] transition-transform ${taxBreakdownOpen ? "rotate-180" : ""}`} />
                      </button>
                      <AnimatePresence>
                        {taxBreakdownOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <div className="mt-2 rounded-lg border border-[#e7e7e7] overflow-hidden">
                            <div className="divide-y divide-[#e7e7e7]">
                              {AU_BRACKETS.map((b) => {
                                const slice = calc.auTaxResult!.slices.find(s => s.label === b.label);
                                const isActive = !!slice && slice.taxable > 0;
                                return (
                                  <div key={b.label} className={`px-4 py-2.5 flex items-center justify-between text-[12px] ${isActive ? "bg-white" : "bg-[#f6f8fa] opacity-50"}`}>
                                    <div className="flex items-center gap-2">
                                      {isActive
                                        ? <span className="h-1.5 w-1.5 rounded-full bg-[#2b7fff] shrink-0" />
                                        : <span className="h-1.5 w-1.5 rounded-full bg-[#e7e7e7] shrink-0" />}
                                      <span className="font-medium text-[#57606a]">{b.label}</span>
                                      <span className="font-bold text-[#1f2328]">→ {(b.rate * 100).toFixed(0)}%</span>
                                    </div>
                                    {isActive && slice ? (
                                      <span className="font-semibold text-[#1f2328]">
                                        {sym}{Math.round(slice.taxable).toLocaleString()} × {(b.rate * 100).toFixed(0)}% = <span className="text-[#2b7fff]">{sym}{Math.round(slice.amount).toLocaleString()}</span>
                                      </span>
                                    ) : (
                                      <span className="text-[#5f676f]">—</span>
                                    )}
                                  </div>
                                );
                              })}
                              {/* Medicare row */}
                              <div className="px-4 py-2.5 flex items-center justify-between text-[12px] bg-white">
                                <div className="flex items-center gap-2">
                                  <span className="h-1.5 w-1.5 rounded-full bg-blue-400 shrink-0" />
                                  <span className="font-medium text-[#57606a]">Medicare levy</span>
                                  <span className="font-bold text-[#1f2328]">→ 2%</span>
                                </div>
                                <span className="font-semibold text-[#1f2328]">
                                  {sym}{Math.round(calc.requiredTaxableIncome).toLocaleString()} × 2% = <span className="text-blue-600">{sym}{Math.round(calc.auTaxResult.medicareLevy).toLocaleString()}</span>
                                </span>
                              </div>
                              {/* Total row */}
                              <div className="px-4 py-3 flex items-center justify-between text-[14px] bg-[#f6f8fa]">
                                <span className="font-bold text-[#1f2328]">Total estimated tax</span>
                                <span className="font-extrabold text-[#1f2328]">{sym}{Math.round(calc.taxAmt).toLocaleString()}</span>
                              </div>
                            </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )}

                  <GitBookCallout type="info">
                    Effective rate is lower than marginal rate because only income <em>above</em> each threshold is taxed at the higher rate. The calculator reverse-solves: it finds the gross income that leaves you with exactly your target after all brackets and Medicare levy.
                  </GitBookCallout>
                </div>
              </div>
            ) : (
              <Section title="Tax Settings (Manual Override)">
                <div className="flex items-center justify-between gap-4">
                  <GitBookCallout type="warning">
                    Manual override active. Switch back to use accurate ATO progressive brackets.
                  </GitBookCallout>
                  <button
                    onClick={() => setManualTaxOverride(false)}
                    className="shrink-0 text-[14px] font-semibold text-[#2b7fff] hover:underline"
                  >
                    Use auto
                  </button>
                </div>
                <NumberInput label="Flat Tax Rate" value={taxPct} onChange={setTaxPct} suffix="%" helper="Applied as a flat rate on top of your desired income" />

                {/* Flat-rate summary — mirrors the AU breakdown cards */}
                <div className="rounded-lg bg-[#f6f8fa] px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div>
                    <p className="text-[14px] font-bold uppercase tracking-wider text-[#5f676f] mb-0.5">Required pre-tax income</p>
                    <p className="text-[22px] font-extrabold text-[#1f2328]">
                      {sym}{Math.round(calc.requiredTaxableIncome).toLocaleString()}
                    </p>
                  </div>
                  <div className="text-[12px] text-[#57606a] sm:text-right">
                    <p>To take home</p>
                    <p className="font-bold text-green-600 text-[15px]">{sym}{Math.round(desiredIncome).toLocaleString()}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg bg-[#f6f8fa] px-3 py-3">
                    <p className="text-[14px] font-bold uppercase tracking-wider text-[#5f676f] mb-1">Flat rate applied</p>
                    <p className="text-[16px] font-extrabold text-[#1f2328]">{taxPct}%</p>
                  </div>
                  <div className="rounded-lg bg-[#f6f8fa] px-3 py-3">
                    <p className="text-[14px] font-bold uppercase tracking-wider text-[#5f676f] mb-1">Est. annual tax</p>
                    <p className="text-[16px] font-extrabold text-[#1f2328]">{sym}{Math.round(calc.taxAmt).toLocaleString()}</p>
                  </div>
                </div>

                <GitBookCallout type="info">
                  Manual override uses a flat rate. Real ATO tax uses progressive brackets — your actual bill may differ. Adjust the rate above to match your accountant&apos;s advice.
                </GitBookCallout>
              </Section>
            )}

            {/* GST toggle */}
            <Section title="Invoice Display">
              <div className="flex items-center justify-between rounded-lg bg-[#f6f8fa] px-4 py-3">
                <div>
                  <p className="text-[14px] font-semibold text-[#1f2328]">
                    Show GST-inclusive rate (10%)
                  </p>
                    <p className="text-[14px] text-[#5f676f] mt-0.5">Toggle to see what clients pay on invoices</p>
                  </div>
                  <button
                    onClick={() => setIncludeGst((v) => !v)}
                    className={`relative h-6 w-11 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#2b7fff]/30 ${includeGst ? "bg-[#2b7fff]" : "bg-[#e7e7e7]"}`}
                  >
                    <span className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow transition-all ${includeGst ? "left-[26px]" : "left-[2px]"}`} />
                  </button>
                </div>
              </Section>

          </div>

          {/* RIGHT: Results */}
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-[56px] flex flex-col gap-4">

              {/* Rate Output */}
              <div className="rounded-xl border border-[#e7e7e7] bg-white overflow-hidden">
                <div className="border-b border-[#e7e7e7] bg-[#1b1f24] px-5 py-4 text-center">
                  <p className="text-[14px] font-bold uppercase tracking-widest text-[#c9d1d9] mb-1">
                    Your Required Charge-Out Rate
                  </p>
                  <div className="flex items-end justify-center gap-1">
                    <span className="text-[22px] font-bold text-[#c9d1d9] leading-none mb-1">{sym}</span>
                    <span className="text-[52px] font-extrabold text-white leading-none tracking-tighter">
                      <AnimatedNumber value={calc.recRate} />
                    </span>
                    <span className="text-[16px] font-medium text-[#c9d1d9] leading-none mb-2">/hr</span>
                  </div>
                  <p className="mt-2 text-[14px] text-[#c9d1d9] leading-relaxed">
                    Calculated from your take-home target, ATO tax & business overheads
                    {includeGst ? " · inc. GST" : ""}
                  </p>
                </div>

                <div className="p-5 flex flex-col gap-4">
                  {/* Min / Premium */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-lg bg-[#f6f8fa] px-3 py-3 text-center">
                      <p className="text-[14px] font-bold uppercase tracking-wider text-[#5f676f] mb-1">Minimum safe</p>
                      <p className="text-[17px] font-bold text-[#1f2328]">{sym}<AnimatedNumber value={calc.minRate} /><span className="text-[12px] font-medium text-[#5f676f]">/hr</span></p>
                    </div>
                    <div className="rounded-lg bg-[#f6f8fa] px-3 py-3 text-center">
                      <p className="text-[14px] font-bold uppercase tracking-wider text-[#5f676f] mb-1">Premium</p>
                      <p className="text-[17px] font-bold text-[#1f2328]">{sym}<AnimatedNumber value={calc.preRate} /><span className="text-[12px] font-medium text-[#5f676f]">/hr</span></p>
                    </div>
                  </div>

                  {/* Calculation breakdown */}
                  <div className="border-t border-[#e7e7e7] pt-4 flex flex-col gap-2.5">
                    <div className="flex justify-between text-[14px]">
                      <span className="text-[#57606a] font-medium">Take-home target</span>
                      <span className="font-semibold text-green-600">{sym}<AnimatedNumber value={calc.netTakeHome} /></span>
                    </div>
                    <div className="flex justify-between text-[14px]">
                      <span className="text-[#57606a] font-medium">Required pre-tax income</span>
                      <span className="font-semibold text-[#1f2328]">{sym}<AnimatedNumber value={calc.requiredTaxableIncome} /></span>
                    </div>
                    <div className="flex justify-between text-[14px]">
                      <span className="text-[#57606a] font-medium">Est. income tax + Medicare</span>
                      <span className="font-semibold text-red-500">+{sym}<AnimatedNumber value={calc.taxAmt} /></span>
                    </div>
                    <div className="flex justify-between text-[14px]">
                      <span className="text-[#57606a] font-medium">Annual overheads</span>
                      <span className="font-semibold text-red-500">+{sym}<AnimatedNumber value={calc.annualCosts} /></span>
                    </div>
                    <div className="flex justify-between text-[14px] border-t border-[#e7e7e7] pt-2.5 mt-1">
                      <span className="font-bold text-[#1f2328]">Required revenue / yr</span>
                      <span className="font-bold text-[#1f2328]">{sym}<AnimatedNumber value={calc.requiredRevenue} /></span>
                    </div>
                    <div className="flex justify-between text-[14px] border-t border-[#e7e7e7] pt-2.5">
                      <span className="text-[#57606a] font-medium">Annual billable hours</span>
                      <span className="font-semibold text-[#1f2328]"><AnimatedNumber value={calc.billableHours} /> hrs</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Market Benchmark — guide only */}
              <div className="rounded-xl border border-[#e7e7e7] bg-white overflow-hidden">
                <div className="border-b border-[#e7e7e7] bg-[#f6f8fa] px-5 py-3 flex items-center justify-between">
                  <div>
                    <h3 className="text-[14px] font-semibold text-[#1f2328] uppercase tracking-wider">Market Benchmark</h3>
                    <p className="text-[14px] text-[#5f676f] mt-0.5 font-medium">Guide only — does not affect your required rate</p>
                  </div>
                  <TrendingUp className="w-4 h-4 text-[#5f676f]" />
                </div>
                <div className="p-5 flex flex-col gap-4">
                  <p className="text-[12px] text-[#57606a]">
                    Typical market range for <strong className="text-[#1f2328]">{profession.name}</strong> in <strong className="text-[#1f2328]">{locationLabel}</strong>:
                  </p>

                  <div className="text-[22px] font-extrabold text-[#1f2328] tracking-tight">
                    {sym}{Math.round(calc.benchLow)} – {sym}{Math.round(calc.benchHigh)}
                    <span className="text-[14px] font-medium text-[#5f676f] ml-1">/hr</span>
                  </div>

                  <div className={`flex items-center gap-2 rounded-lg px-3 py-2.5 text-[14px] font-semibold ${
                    calc.comparison === "BELOW"  ? "bg-red-50 text-red-700"     :
                    calc.comparison === "ABOVE"  ? "bg-blue-50 text-blue-700"     :
                                                   "bg-green-50 text-green-700"
                  }`}>
                    {calc.comparison === "BELOW"  && <TrendingDown className="w-4 h-4 shrink-0" />}
                    {calc.comparison === "ABOVE"  && <TrendingUp className="w-4 h-4 shrink-0" />}
                    {calc.comparison === "BELOW"  ? "Your required rate is below typical market — you may have room to charge more" :
                     calc.comparison === "ABOVE"  ? "Your required rate is above typical market — consider adjusting overheads or hours" :
                                                    "Your required rate is aligned with typical market pricing"}
                  </div>

                  <ConfidenceBadge level="HIGH" note="Hipages & ABS 2024 data" />
                </div>
              </div>

              {/* Disclaimer */}
              <GitBookCallout type="info">
                Benchmark ranges are derived from Hipages, ServiceSeeking &amp; ABS 2024 labour data. They are indicative midpoints — actual market rates vary widely. Your required rate is calculated independently from these figures. Not financial or tax advice.
              </GitBookCallout>

            </div>
          </div>
        </div>
      </section>

      {/* AD SLOT 1 */}
      <div className="relative z-10 border-b border-[#e7e7e7] px-6 py-4">
        <div className="mx-auto max-w-[1280px] flex items-center justify-center rounded-lg border-2 border-dashed border-[#e7e7e7] bg-[#f6f8fa] py-6">
          <span className="text-[12px] font-medium text-[#5f676f] uppercase tracking-wide">Ad Slot 1 — Google AdSense</span>
        </div>
      </div>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" className="relative z-10 border-b border-[#e7e7e7] py-20 px-6">
        <div className="mx-auto max-w-[860px]">
          <h2 className="text-[28px] font-extrabold tracking-tight text-[#1f2328] mb-2">How the engine works</h2>
          <p className="text-[15px] text-[#57606a] mb-10 font-medium">
            RateIQ uses a 4-step sole trader pricing engine. Here&apos;s exactly how your charge-out rate is calculated.
          </p>

          <div className="flex flex-col gap-6">
            {[
              {
                step: "Step 1",
                title: "Reverse ATO Tax Calculation",
                desc: "Most tools calculate tax on a gross income. RateIQ works backwards: given your desired take-home, it solves for the pre-tax income that — after ATO progressive brackets and Medicare levy — produces exactly what you want. This is done via binary search accurate to within $1.",
              },
              {
                step: "Step 2",
                title: "Add Business Overheads",
                desc: "Your charge-out rate must recover all business costs: vehicle, tools, insurance, software, marketing, and miscellaneous. These are annualised and added to your required taxable income to get total required revenue.",
              },
              {
                step: "Step 3",
                title: "Realistic Sole Trader Billable Hours",
                desc: "Sole traders don't bill 38 hours a week. Quoting, admin, travel, chasing payments, and quiet periods typically reduce billable hours to 20–25 per week. The default of 25 hrs × 46 weeks = 1,150 billable hours per year reflects this reality.",
              },
              {
                step: "Step 4",
                title: "Required Charge-Out Rate",
                desc: "Required revenue ÷ annual billable hours = your minimum charge-out rate. The calculator also shows a Minimum Safe rate (−10%) and a Premium rate (+15%) to give you a negotiating range.",
              },
            ].map((item, i) => (
              <div key={i} className="flex gap-5 rounded-xl border border-[#e7e7e7] bg-white p-5">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#2b7fff]/10 text-[14px] font-bold text-[#2b7fff] uppercase tracking-wide">
                  {i + 1}
                </div>
                <div>
                  <p className="text-[14px] font-semibold uppercase tracking-wider text-[#5f676f] mb-0.5">{item.step}</p>
                  <h3 className="text-[15px] font-bold text-[#1f2328] mb-1">{item.title}</h3>
                  <p className="text-[14px] text-[#57606a] leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* ATO brackets table */}
          <div className="mt-10 rounded-xl border border-[#e7e7e7] overflow-hidden">
            <div className="border-b border-[#e7e7e7] bg-[#f6f8fa] px-5 py-3">
              <h3 className="text-[12px] font-semibold uppercase tracking-wider text-[#57606a]">
                Australian resident income tax brackets — 2025-26
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-[14px]">
                <thead>
                  <tr className="border-b border-[#e7e7e7] bg-[#f6f8fa]">
                    <th className="text-left px-5 py-2.5 font-semibold text-[#57606a]">Income range</th>
                    <th className="text-right px-5 py-2.5 font-semibold text-[#57606a]">Rate</th>
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
                    <td className="px-5 py-2.5 font-medium text-[#57606a]">Medicare levy (all income)</td>
                    <td className="px-5 py-2.5 text-right font-semibold text-[#57606a]">2%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* AD SLOT 2 */}
      <div className="relative z-10 border-b border-[#e7e7e7] px-6 py-4">
        <div className="mx-auto max-w-[1280px] flex items-center justify-center rounded-lg border-2 border-dashed border-[#e7e7e7] py-6">
          <span className="text-[12px] font-medium text-[#5f676f] uppercase tracking-wide">Ad Slot 2 — Google AdSense</span>
        </div>
      </div>

      {/* ── FAQ ── */}
      <section id="faq" className="relative z-10 border-b border-[#e7e7e7] py-20 px-6">
        <div className="mx-auto max-w-[860px]">
          <h2 className="text-[28px] font-extrabold tracking-tight text-[#1f2328] mb-2">Frequently asked questions</h2>
          <p className="text-[15px] text-[#57606a] mb-10 font-medium">
            Everything you need to understand the model and trust the output.
          </p>
          <div className="flex flex-col gap-2">
            {faqs.map((item, i) => (
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
                      <div className="px-5 pb-4 border-t border-[#e7e7e7] pt-4 text-[14px] text-[#57606a] leading-relaxed bg-[#f6f8fa]">
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

      {/* ── FOOTER ── */}
      <footer className="relative z-10 bg-[#1b1f24] px-6 py-12">
        <div className="mx-auto max-w-[1280px] flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[#2b7fff]">
              <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4">
                <path d="M3 4h10M3 8h7M3 12h5" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
            </div>
            <span className="text-[14px] font-semibold text-white">RateIQ</span>
            <span className="text-[14px] text-[#8b949e]">— Australian Contractor Rate Calculator</span>
          </div>
          <div className="flex flex-col items-center md:items-end gap-1">
            <p className="text-[12px] text-[#8b949e]">
              ATO 2025-26 tax brackets. For general guidance only — not financial or tax advice.
            </p>
            <p className="text-[12px] text-[#8b949e]">
              © {new Date().getFullYear()} RateIQ. Built for contractors, by contractors.
            </p>
          </div>
        </div>
      </footer>

    </div>
  );
}
