"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Check, TrendingUp, TrendingDown, AlertTriangle, Info, BookOpen } from "lucide-react";
import AdSlot from "@/components/AdSlot";

// ─── DATA ────────────────────────────────────────────────────────────────────

const PROFESSIONS = [
  { id: "electrician",  name: "Electrician",               base: 105 },
  { id: "plumber",      name: "Plumber",                   base: 105 },
  { id: "builder",      name: "Builder / Carpenter",       base: 90  },
  { id: "painter",      name: "Painter",                   base: 65  },
  { id: "hvac",         name: "HVAC Technician",           base: 115 },
  { id: "handyman",     name: "Handyman",                  base: 70  },
  { id: "cleaner",      name: "Cleaner",                   base: 45  },
  { id: "landscaper",   name: "Landscaper",                base: 70  },
  { id: "truck",        name: "Truck / Contractor Labour", base: 85  },
  { id: "freelancer",   name: "Freelancer / Consultant",   base: 155 },
  { id: "it",           name: "IT / Digital Freelancer",   base: 175 },
  { id: "other",        name: "Other",                     base: 95  },
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
  { id: "METRO",    name: "Metro / High Demand", mult: 1.08 },
  { id: "REGIONAL", name: "Regional / Rural",    mult: 0.88 },
];

const AU_BRACKETS = [
  { label: "$0 – $18,200",        min: 0,      max: 18200,   rate: 0    },
  { label: "$18,201 – $45,000",   min: 18200,  max: 45000,   rate: 0.16 },
  { label: "$45,001 – $135,000",  min: 45000,  max: 135000,  rate: 0.30 },
  { label: "$135,001 – $190,000", min: 135000, max: 190000,  rate: 0.37 },
  { label: "$190,001+",           min: 190000, max: Infinity, rate: 0.45 },
];

// ─── TAX FUNCTIONS ───────────────────────────────────────────────────────────

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

function reverseAUTax(takeHome: number): { requiredIncome: number; taxResult: AUTaxResult } {
  if (takeHome <= 0) return { requiredIncome: 0, taxResult: calcAUTax(0) };
  let lo = takeHome;
  let hi = takeHome * 2.5;
  for (let i = 0; i < 80; i++) {
    const mid = (lo + hi) / 2;
    const tax = calcAUTax(mid);
    const net = mid - tax.totalTax;
    if (Math.abs(net - takeHome) < 1) break;
    if (net < takeHome) lo = mid;
    else hi = mid;
  }
  const requiredIncome = (lo + hi) / 2;
  return { requiredIncome, taxResult: calcAUTax(requiredIncome) };
}

// ─── SUB-COMPONENTS ──────────────────────────────────────────────────────────

function GitBookCallout({ type, children }: { type: "info" | "warning" | "success" | "tip"; children: React.ReactNode }) {
  const styles = {
    info:    { bg: "bg-blue-50",   icon: <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />,           text: "text-blue-900"  },
    warning: { bg: "bg-amber-50",  icon: <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />, text: "text-amber-900" },
    success: { bg: "bg-green-50",  icon: <Check className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />,         text: "text-green-900" },
    tip:     { bg: "bg-blue-50",   icon: <BookOpen className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />,       text: "text-blue-900"  },
  };
  const s = styles[type];
  return (
    <div className={`flex gap-3 rounded-lg ${s.bg} px-4 py-3`}>
      {s.icon}
      <p className={`text-[14px] leading-relaxed ${s.text}`}>{children}</p>
    </div>
  );
}

function Select({ label, options, selected, onSelect }: {
  label: string;
  options: { id: string; name: string }[];
  selected: { id: string; name: string };
  onSelect: (o: any) => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[12px] font-semibold uppercase tracking-wider text-[#4b5563]">{label}</label>
      <div className="relative">
        <button onClick={() => setOpen((v) => !v)} className="flex w-full items-center justify-between rounded-lg border border-[#e7e7e7] bg-white px-3 py-2.5 text-[16px] font-medium text-[#1f2328] transition hover:border-[#5f676f] focus:outline-none focus:ring-2 focus:ring-[#1a6fe8]/20">
          <span>{selected.name}</span>
          <ChevronDown className={`w-4 h-4 text-[#5f676f] transition-transform ${open ? "rotate-180" : ""}`} />
        </button>
        <AnimatePresence>
          {open && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
              <motion.ul initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 4 }} transition={{ duration: 0.15 }} className="absolute top-full left-0 z-50 mt-1 w-full overflow-y-auto rounded-lg border border-[#e7e7e7] bg-white py-1 max-h-60">
                {options.map((opt) => (
                  <li key={opt.id}>
                    <button onClick={() => { onSelect(opt); setOpen(false); }} className="flex w-full items-center justify-between px-3 py-2 text-[14px] hover:bg-[#f6f8fa] transition-colors">
                      <span className="font-medium text-[#1f2328]">{opt.name}</span>
                      {selected.id === opt.id && <Check className="w-3.5 h-3.5 text-[#1a6fe8]" />}
                    </button>
                  </li>
                ))}
              </motion.ul>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function NumberInput({ label, value, onChange, prefix, suffix, helper }: {
  label: string; value: number; onChange: (v: number) => void;
  prefix?: string; suffix?: string; helper?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[12px] font-semibold uppercase tracking-wider text-[#4b5563]">{label}</label>
      <div className="relative flex items-center">
        {prefix && <span className="absolute left-3 text-[#4b5563] text-[14px] font-medium pointer-events-none">{prefix}</span>}
        <input
          type="number"
          value={value || ""}
          onChange={(e) => onChange(Number(e.target.value) || 0)}
          inputMode="numeric"
          className={`w-full rounded-lg border border-[#e7e7e7] bg-white py-2.5 text-[16px] font-medium text-[#1f2328] outline-none transition focus:border-[#1a6fe8] focus:ring-2 focus:ring-[#1a6fe8]/20 ${prefix ? "pl-8" : "pl-3"} ${suffix ? "pr-10" : "pr-3"}`}
          placeholder="0"
        />
        {suffix && <span className="absolute right-3 text-[#4b5563] text-[14px] font-medium pointer-events-none">{suffix}</span>}
      </div>
      {helper && <p className="text-[14px] text-[#5f676f]">{helper}</p>}
    </div>
  );
}

function AnimatedNumber({ value }: { value: number }) {
  const [display, setDisplay] = useState(value);
  useEffect(() => {
    const end = value;
    if (Math.abs(end - display) < 0.5) return;
    const duration = 350;
    const startVal = display;
    const startTime = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - startTime) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setDisplay(startVal + (end - startVal) * ease);
      if (p < 1) requestAnimationFrame(tick);
      else setDisplay(end);
    };
    requestAnimationFrame(tick);
  }, [value]); // eslint-disable-line react-hooks/exhaustive-deps
  return <>{Math.round(display).toLocaleString("en-AU")}</>;
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-[#e7e7e7] bg-white">
      <div className="border-b border-[#e7e7e7] bg-[#f6f8fa] px-5 h-11 flex items-center rounded-t-xl">
        <h2 className="text-[14px] font-semibold text-[#1f2328] uppercase tracking-wider">{title}</h2>
      </div>
      <div className="p-5 flex flex-col gap-4">{children}</div>
    </div>
  );
}

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────

export function CalculatorSection() {
  const [profession, setProfession]   = useState(PROFESSIONS[0]);
  const [state, setState]             = useState(AU_STATES[0]);
  const [locType, setLocType]         = useState(LOCATION_TYPES[0]);
  const [desiredIncome, setDesiredIncome] = useState(100000);
  const [hoursPerWeek, setHoursPerWeek]   = useState(25);
  const [weeksPerYear, setWeeksPerYear]   = useState(46);
  const [overheads, setOverheads] = useState({ vehicle: 400, tools: 150, insurance: 100, software: 150, marketing: 200, misc: 200 });
  const [includeGst, setIncludeGst]         = useState(false);
  const [manualTaxOverride, setManualTaxOverride] = useState(false);
  const [taxPct, setTaxPct]                 = useState(30);
  const [taxBreakdownOpen, setTaxBreakdownOpen]   = useState(false);

  const sym = "$";

  const calc = useMemo(() => {
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

    const annualCosts     = Object.values(overheads).reduce((a, b) => a + b, 0) * 12;
    const requiredRevenue = requiredTaxableIncome + annualCosts;
    const billableHours   = (hoursPerWeek * weeksPerYear) || 1;
    const requiredRate    = requiredRevenue / billableHours;
    const minRate         = requiredRate * 0.9;
    const premiumRate     = requiredRate * 1.15;

    const benchMult  = (state.mult + locType.mult) / 2;
    const benchMid   = profession.base * benchMult;
    const benchLow   = benchMid * 0.80;
    const benchHigh  = benchMid * 1.20;
    const comparison =
      requiredRate < benchLow  ? "BELOW" :
      requiredRate > benchHigh ? "ABOVE" : "WITHIN";

    return {
      recRate:  includeGst ? requiredRate * 1.10 : requiredRate,
      minRate:  includeGst ? minRate      * 1.10 : minRate,
      preRate:  includeGst ? premiumRate  * 1.10 : premiumRate,
      benchLow, benchHigh, comparison,
      netTakeHome: desiredIncome,
      taxAmt, requiredTaxableIncome, annualCosts, requiredRevenue, billableHours, auTaxResult,
    };
  }, [profession, state, locType, desiredIncome, hoursPerWeek, weeksPerYear, overheads, taxPct, manualTaxOverride, includeGst]);

  const locationLabel = `${state.id} · ${locType.name}`;

  return (
    <section id="calculator" className="relative z-10 pb-16 md:py-16 px-4 md:px-6">
      <div className="mx-auto max-w-[1280px] grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">

        {/* LEFT: Inputs */}
        <div className="lg:col-span-7 flex flex-col gap-5">

          <Section title="About You">
            <Select label="I am a..." options={PROFESSIONS} selected={profession} onSelect={setProfession} />
            <div className="grid sm:grid-cols-2 gap-4">
              <Select label="State / Territory" options={AU_STATES} selected={state} onSelect={setState} />
              <Select label="Location Type" options={LOCATION_TYPES} selected={locType} onSelect={setLocType} />
            </div>
          </Section>

          <Section title="Income & Workload">
            <div className="grid sm:grid-cols-3 gap-4">
              <NumberInput label="Desired annual take-home" value={desiredIncome} onChange={setDesiredIncome} prefix={sym} suffix="AUD" helper="After tax, what do you want to earn?" />
              <NumberInput label="Billable hours per week" value={hoursPerWeek} onChange={setHoursPerWeek} suffix="hrs" helper="Excludes admin, travel and quoting time" />
              <NumberInput label="Weeks worked per year" value={weeksPerYear} onChange={setWeeksPerYear} suffix="wks" helper="Exclude holidays & quiet periods" />
            </div>
            <GitBookCallout type="tip">
              Sole traders typically bill <strong>20–25 hours</strong> out of every 38-hour week. Admin, travel, quoting, and quiet periods eat the rest.
            </GitBookCallout>
          </Section>

          <Section title="Monthly Business Overheads">
            <GitBookCallout type="tip">
              All business costs are added to your revenue requirement before calculating your rate.
            </GitBookCallout>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
              {(Object.keys(overheads) as (keyof typeof overheads)[]).map((key) => (
                <NumberInput key={key} label={key.charAt(0).toUpperCase() + key.slice(1)} value={overheads[key]} onChange={(v) => setOverheads((prev) => ({ ...prev, [key]: v }))} prefix={sym} suffix="/mo" />
              ))}
            </div>
            <div className="rounded-lg bg-[#f6f8fa] px-4 py-3 flex justify-between items-center text-[14px]">
              <span className="text-[#343638] font-medium">Total annual overheads</span>
              <span className="font-bold text-[#1f2328]">{sym}{(Object.values(overheads).reduce((a, b) => a + b, 0) * 12).toLocaleString()}</span>
            </div>
          </Section>

          {/* Tax section */}
          {!manualTaxOverride ? (
            <div className="rounded-xl border border-[#e7e7e7] bg-white overflow-hidden">
              <div className="border-b border-[#e7e7e7] bg-[#f6f8fa] px-5 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <h2 className="text-[14px] font-semibold text-[#1f2328] uppercase tracking-wider">Tax Estimate (Auto)</h2>
                  <p className="text-[14px] text-[#5f676f] mt-0.5">Reverse-calculated from your take-home target using ATO 2025-26 progressive brackets</p>
                </div>
                <button onClick={() => setManualTaxOverride(true)} className="text-[14px] font-semibold text-[#1a6fe8] hover:underline self-start sm:self-auto sm:shrink-0 sm:ml-4">Manual override</button>
              </div>
              <div className="p-5 flex flex-col gap-4">
                {calc.auTaxResult && (
                  <div>
                    <p className="text-[12px] font-semibold uppercase tracking-wider text-[#4b5563] pb-2">Required pre-tax income</p>
                    <p className="text-[30px] leading-[38px] font-extrabold text-[#1f2328]">{sym}{Math.round(calc.requiredTaxableIncome).toLocaleString()}</p>
                    <p className="text-[16px] text-[#343638] mt-1.5">To take home <span className="font-semibold text-green-700">{sym}{Math.round(desiredIncome).toLocaleString()}</span></p>
                  </div>
                )}
                {calc.auTaxResult && (
                  <div className="border-t border-b border-[#e7e7e7] py-4 flex flex-col gap-4 sm:gap-0 sm:flex-row sm:items-start sm:divide-x sm:divide-[#e7e7e7]">
                    <div className="flex divide-x divide-[#e7e7e7] sm:contents">
                      <div className="flex-1 pr-4">
                        <p className="text-[12px] font-semibold uppercase tracking-wider text-[#4b5563] mb-1">Marginal bracket</p>
                        <p className="text-[20px] font-extrabold text-[#1f2328]">{(calc.auTaxResult.marginalRate * 100).toFixed(0)}%</p>
                      </div>
                      <div className="flex-1 px-4">
                        <p className="text-[12px] font-semibold uppercase tracking-wider text-[#4b5563] mb-1">Medicare levy</p>
                        <p className="text-[20px] font-extrabold text-[#1f2328]">2%</p>
                      </div>
                    </div>
                    <div className="border-t border-[#e7e7e7] pt-4 sm:border-t-0 sm:pt-0 sm:flex-1 sm:pl-4">
                      <p className="text-[12px] font-semibold uppercase tracking-wider text-[#4b5563] mb-1">Est. annual tax</p>
                      <p className="text-[20px] font-extrabold text-[#1f2328]">{sym}{Math.round(calc.taxAmt).toLocaleString()}</p>
                    </div>
                  </div>
                )}
                {calc.auTaxResult && (
                  <div className="flex flex-col">
                    <button onClick={() => setTaxBreakdownOpen((v) => !v)} className="flex items-center justify-between rounded-lg border border-[#e7e7e7] bg-white px-3 py-2.5 text-[14px] font-medium text-[#1f2328] transition hover:border-[#5f676f] focus:outline-none focus:ring-2 focus:ring-[#1a6fe8]/20">
                      <span>See tax breakdown by bracket</span>
                      <ChevronDown className={`w-4 h-4 text-[#5f676f] transition-transform ${taxBreakdownOpen ? "rotate-180" : ""}`} />
                    </button>
                    <AnimatePresence>
                      {taxBreakdownOpen && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                          <div className="mt-2 rounded-lg border border-[#e7e7e7] overflow-hidden">
                            <div className="divide-y divide-[#e7e7e7]">
                              {AU_BRACKETS.map((b) => {
                                const slice = calc.auTaxResult!.slices.find(s => s.label === b.label);
                                const isActive = !!slice && slice.taxable > 0;
                                return (
                                  <div key={b.label} className={`px-4 py-2.5 flex items-center justify-between text-[12px] ${isActive ? "bg-white" : "bg-[#f6f8fa] opacity-50"}`}>
                                    <div className="flex items-center gap-2">
                                      <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${isActive ? "bg-[#1a6fe8]" : "bg-[#e7e7e7]"}`} />
                                      <span className="font-medium text-[#343638]">{b.label}</span>
                                      <span className="font-bold text-[#1f2328]">→ {(b.rate * 100).toFixed(0)}%</span>
                                    </div>
                                    {isActive && slice ? (
                                      <span className="font-semibold text-[#1f2328]">
                                        {sym}{Math.round(slice.taxable).toLocaleString()} × {(b.rate * 100).toFixed(0)}% = <span className="text-[#1a6fe8]">{sym}{Math.round(slice.amount).toLocaleString()}</span>
                                      </span>
                                    ) : <span className="text-[#5f676f]">—</span>}
                                  </div>
                                );
                              })}
                              <div className="px-4 py-2.5 flex items-center justify-between text-[12px] bg-white">
                                <div className="flex items-center gap-2">
                                  <span className="h-1.5 w-1.5 rounded-full bg-blue-400 shrink-0" />
                                  <span className="font-medium text-[#343638]">Medicare levy</span>
                                  <span className="font-bold text-[#1f2328]">→ 2%</span>
                                </div>
                                <span className="font-semibold text-[#1f2328]">
                                  {sym}{Math.round(calc.requiredTaxableIncome).toLocaleString()} × 2% = <span className="text-blue-600">{sym}{Math.round(calc.auTaxResult.medicareLevy).toLocaleString()}</span>
                                </span>
                              </div>
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
                  Effective rate is lower than marginal rate because only income <em>above</em> each threshold is taxed at the higher rate.
                </GitBookCallout>
              </div>
            </div>
          ) : (
            <Section title="Tax Settings (Manual Override)">
              <div className="flex items-center justify-between gap-4">
                <GitBookCallout type="warning">Manual override active. Switch back to use accurate ATO progressive brackets.</GitBookCallout>
                <button onClick={() => setManualTaxOverride(false)} className="shrink-0 text-[14px] font-semibold text-[#1a6fe8] hover:underline">Use auto</button>
              </div>
              <NumberInput label="Flat Tax Rate" value={taxPct} onChange={setTaxPct} suffix="%" helper="Applied as a flat rate on top of your desired income" />
              <div className="rounded-lg bg-[#f6f8fa] px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <p className="text-[12px] font-semibold uppercase tracking-wider text-[#4b5563] mb-0.5">Required pre-tax income</p>
                  <p className="text-[22px] font-extrabold text-[#1f2328]">{sym}{Math.round(calc.requiredTaxableIncome).toLocaleString()}</p>
                </div>
                <div className="text-[12px] text-[#343638] sm:text-right">
                  <p>To take home</p>
                  <p className="font-bold text-green-700 text-[15px]">{sym}{Math.round(desiredIncome).toLocaleString()}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg bg-[#f6f8fa] px-3 py-3">
                  <p className="text-[12px] font-semibold uppercase tracking-wider text-[#4b5563] mb-1">Flat rate applied</p>
                  <p className="text-[16px] font-extrabold text-[#1f2328]">{taxPct}%</p>
                </div>
                <div className="rounded-lg bg-[#f6f8fa] px-3 py-3">
                  <p className="text-[12px] font-semibold uppercase tracking-wider text-[#4b5563] mb-1">Est. annual tax</p>
                  <p className="text-[16px] font-extrabold text-[#1f2328]">{sym}{Math.round(calc.taxAmt).toLocaleString()}</p>
                </div>
              </div>
              <GitBookCallout type="info">
                Manual override uses a flat rate. Real ATO tax uses progressive brackets, so your actual bill may differ.
              </GitBookCallout>
            </Section>
          )}

          {/* GST toggle */}
          <Section title="Invoice Display">
            <div className="flex items-center justify-between rounded-lg bg-[#f6f8fa] px-4 py-3">
              <div>
                <p className="text-[14px] font-semibold text-[#1f2328]">Show GST-inclusive rate (10%)</p>
                <p className="text-[14px] text-[#5f676f] mt-0.5">Toggle to see what clients pay on invoices</p>
              </div>
              <button
                onClick={() => setIncludeGst((v) => !v)}
                aria-label={includeGst ? "Disable GST" : "Enable GST"}
                className={`relative flex-shrink-0 h-6 w-11 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-green-400/30 ${includeGst ? "bg-green-500" : "bg-[#e7e7e7]"}`}
              >
                <span className={`absolute top-[4px] h-4 w-4 rounded-full bg-white shadow transition-all duration-200 ${includeGst ? "left-[23px]" : "left-[4px]"}`} />
              </button>
            </div>
          </Section>

        </div>

        {/* RIGHT: Results */}
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-[84px] flex flex-col gap-4">

            <div className="rounded-xl border border-[#e7e7e7] bg-white overflow-hidden">
              <div className="border-b border-[#e7e7e7] bg-[#1b1f24] px-5 py-4 text-center flex flex-col gap-3">
                <p className="text-[12px] font-semibold uppercase tracking-wider text-[#c9d1d9]">Your Required Charge-Out Rate</p>
                <div className="flex items-end justify-center gap-1">
                  <span className="text-[22px] font-bold text-[#c9d1d9] leading-none mb-1">{sym}</span>
                  <span className="text-[52px] font-extrabold text-white leading-none tracking-tighter"><AnimatedNumber value={calc.recRate} /></span>
                  <span className="text-[16px] font-medium text-[#c9d1d9] leading-none mb-2">/hr</span>
                </div>
                <p className="text-[14px] text-[#c9d1d9] leading-relaxed">
                  Calculated from your take-home target, ATO tax & business overheads{includeGst ? " · inc. GST" : ""}
                </p>
              </div>
              <div className="p-5 flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg bg-[#f6f8fa] px-3 py-3 text-center">
                    <p className="text-[12px] font-semibold uppercase tracking-wider text-[#4b5563] mb-1">Minimum safe</p>
                    <p className="text-[17px] font-bold text-[#1f2328]">{sym}<AnimatedNumber value={calc.minRate} /><span className="text-[12px] font-medium text-[#5f676f]">/hr</span></p>
                  </div>
                  <div className="rounded-lg bg-[#f6f8fa] px-3 py-3 text-center">
                    <p className="text-[12px] font-semibold uppercase tracking-wider text-[#4b5563] mb-1">Premium</p>
                    <p className="text-[17px] font-bold text-[#1f2328]">{sym}<AnimatedNumber value={calc.preRate} /><span className="text-[12px] font-medium text-[#5f676f]">/hr</span></p>
                  </div>
                </div>
                <div className="border-t border-[#e7e7e7] pt-4 flex flex-col gap-2.5">
                  <div className="flex justify-between text-[14px]">
                    <span className="text-[#343638] font-medium">Take-home target</span>
                    <span className="font-semibold text-green-700">{sym}<AnimatedNumber value={calc.netTakeHome} /></span>
                  </div>
                  <div className="flex justify-between text-[14px]">
                    <span className="text-[#343638] font-medium">Required pre-tax income</span>
                    <span className="font-semibold text-[#1f2328]">{sym}<AnimatedNumber value={calc.requiredTaxableIncome} /></span>
                  </div>
                  <div className="flex justify-between text-[14px]">
                    <span className="text-[#343638] font-medium">Est. income tax + Medicare</span>
                    <span className="font-semibold text-red-600">+{sym}<AnimatedNumber value={calc.taxAmt} /></span>
                  </div>
                  <div className="flex justify-between text-[14px]">
                    <span className="text-[#343638] font-medium">Annual overheads</span>
                    <span className="font-semibold text-red-600">+{sym}<AnimatedNumber value={calc.annualCosts} /></span>
                  </div>
                  <div className="flex justify-between text-[14px] border-t border-[#e7e7e7] pt-2.5 mt-1">
                    <span className="font-bold text-[#1f2328]">Required revenue / yr</span>
                    <span className="font-bold text-[#1f2328]">{sym}<AnimatedNumber value={calc.requiredRevenue} /></span>
                  </div>
                  <div className="flex justify-between text-[14px] border-t border-[#e7e7e7] pt-2.5">
                    <span className="text-[#343638] font-medium">Annual billable hours</span>
                    <span className="font-semibold text-[#1f2328]"><AnimatedNumber value={calc.billableHours} /> hrs</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-[#e7e7e7] bg-white overflow-hidden">
              <div className="border-b border-[#e7e7e7] bg-[#f6f8fa] px-5 py-3 flex items-center justify-between">
                <div>
                  <h3 className="text-[14px] font-semibold text-[#1f2328] uppercase tracking-wider">Market Benchmark</h3>
                  <p className="text-[14px] text-[#5f676f] mt-0.5 font-medium">Guide only, does not affect your required rate</p>
                </div>
                <TrendingUp className="w-4 h-4 text-[#5f676f]" />
              </div>
              <div className="p-5 flex flex-col gap-4">
                <p className="text-[12px] text-[#343638]">
                  Typical market range for <strong className="text-[#1f2328]">{profession.name}</strong> in <strong className="text-[#1f2328]">{locationLabel}</strong>:
                </p>
                <div className="text-[22px] font-extrabold text-[#1f2328] tracking-tight">
                  {sym}{Math.round(calc.benchLow)} – {sym}{Math.round(calc.benchHigh)}
                  <span className="text-[14px] font-medium text-[#5f676f] ml-1">/hr</span>
                </div>
                <div className={`flex items-center gap-2 rounded-lg px-3 py-2.5 text-[14px] font-semibold ${
                  calc.comparison === "BELOW" ? "bg-red-50 text-red-700" :
                  calc.comparison === "ABOVE" ? "bg-blue-50 text-blue-700" :
                                                "bg-green-50 text-green-700"
                }`}>
                  {calc.comparison === "BELOW" && <TrendingDown className="w-4 h-4 shrink-0" />}
                  {calc.comparison === "ABOVE" && <TrendingUp className="w-4 h-4 shrink-0" />}
                  {calc.comparison === "BELOW" ? "Your required rate is below typical market. You may have room to charge more." :
                   calc.comparison === "ABOVE" ? "Your required rate is above typical market. Consider adjusting overheads or hours." :
                                                 "Your required rate is aligned with typical market pricing"}
                </div>
                <div className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-[14px] font-semibold bg-green-50 text-green-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                  <span>Confidence: HIGH, <span className="font-medium">Hipages & ABS 2024 data</span></span>
                </div>
              </div>
            </div>

            <GitBookCallout type="info">
              Benchmark ranges are derived from Hipages, ServiceSeeking and ABS 2024 labour data. They are indicative midpoints; actual market rates vary widely. Not financial or tax advice.
            </GitBookCallout>

            <AdSlot slotId="7926794347" />

          </div>
        </div>
      </div>
    </section>
  );
}
