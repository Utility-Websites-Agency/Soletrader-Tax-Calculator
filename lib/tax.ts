// 2025-26 Australian individual income tax logic
// All functions are pure — no side effects, easy to test.

export interface TaxResult {
  grossIncome: number;
  taxableIncome: number; // after super reduction
  incomeTax: number;
  medicareLevy: number;
  lito: number;
  totalTax: number;
  netAnnual: number;
  netWeekly: number;
  netDaily: number;
  marginalRate: number;
  effectiveRate: number;
  superSaving: number; // tax saved from super contributions
}

export interface InvoiceSetAside {
  invoiceAmount: number;
  taxSetAside: number;
  gstSetAside: number;
  totalSetAside: number;
  takeHome: number;
  isGstRegistered: boolean;
}

export interface PaygInstallment {
  quarter: string;
  dueDate: string;
  amount: number;
  isNext: boolean;
  isPast: boolean;
}

// 2025-26 tax brackets
function calcIncomeTax(taxable: number): number {
  if (taxable <= 18200) return 0;
  if (taxable <= 45000) return (taxable - 18200) * 0.19;
  if (taxable <= 120000) return 5092 + (taxable - 45000) * 0.325;
  if (taxable <= 180000) return 29467 + (taxable - 120000) * 0.37;
  return 51667 + (taxable - 180000) * 0.45;
}

// Low Income Tax Offset — max $700, phases out $37,500–$66,667
function calcLITO(taxable: number): number {
  if (taxable <= 37500) return 700;
  if (taxable <= 66667) return Math.max(0, 700 - (taxable - 37500) * (700 / 29167));
  return 0;
}

// Medicare Levy — 2% above $26,000 (simplified, no phase-in)
function calcMedicare(taxable: number): number {
  if (taxable <= 26000) return 0;
  return taxable * 0.02;
}

// Marginal rate for a given taxable income
export function getMarginalRate(taxable: number): number {
  if (taxable <= 18200) return 0;
  if (taxable <= 45000) return 0.19;
  if (taxable <= 120000) return 0.325;
  if (taxable <= 180000) return 0.37;
  return 0.45;
}

export function calcTax(
  grossIncome: number,
  superContribution = 0
): TaxResult {
  const cappedSuper = Math.min(superContribution, 30000);
  const taxableIncome = Math.max(0, grossIncome - cappedSuper);

  const rawTax = calcIncomeTax(taxableIncome);
  const lito = calcLITO(taxableIncome);
  const incomeTax = Math.max(0, rawTax - lito);
  const medicareLevy = calcMedicare(taxableIncome);
  const totalTax = incomeTax + medicareLevy;
  const netAnnual = grossIncome - totalTax - cappedSuper;

  // Tax saving: compare tax with vs without super
  const taxWithoutSuper = Math.max(0, calcIncomeTax(grossIncome) - calcLITO(grossIncome)) + calcMedicare(grossIncome);
  const superSaving = Math.max(0, taxWithoutSuper - (incomeTax + medicareLevy));

  const effectiveRate = grossIncome > 0 ? totalTax / grossIncome : 0;
  const marginalRate = getMarginalRate(taxableIncome);

  return {
    grossIncome,
    taxableIncome,
    incomeTax,
    medicareLevy,
    lito,
    totalTax,
    netAnnual,
    netWeekly: netAnnual / 52,
    netDaily: netAnnual / 365,
    marginalRate,
    effectiveRate,
    superSaving,
  };
}

export function calcInvoiceSetAside(
  invoiceAmount: number,
  marginalRate: number,
  isGstRegistered: boolean
): InvoiceSetAside {
  const taxSetAside = invoiceAmount * marginalRate;
  const gstSetAside = isGstRegistered ? invoiceAmount / 11 : 0; // GST is 1/11 of GST-inclusive amount
  const totalSetAside = taxSetAside + gstSetAside;
  const takeHome = invoiceAmount - totalSetAside;

  return {
    invoiceAmount,
    taxSetAside,
    gstSetAside,
    totalSetAside,
    takeHome,
    isGstRegistered,
  };
}

// 2025-26 PAYG due dates
const PAYG_QUARTERS: { quarter: string; dueDate: string; dueMs: number }[] = [
  { quarter: "Q1 (Jul–Sep 2025)", dueDate: "28 Oct 2025", dueMs: new Date("2025-10-28").getTime() },
  { quarter: "Q2 (Oct–Dec 2025)", dueDate: "28 Feb 2026", dueMs: new Date("2026-02-28").getTime() },
  { quarter: "Q3 (Jan–Mar 2026)", dueDate: "28 Apr 2026", dueMs: new Date("2026-04-28").getTime() },
  { quarter: "Q4 (Apr–Jun 2026)", dueDate: "28 Jul 2026", dueMs: new Date("2026-07-28").getTime() },
];

export function calcPaygSchedule(annualTax: number): PaygInstallment[] {
  const installment = annualTax / 4;
  const now = Date.now();

  // Find next upcoming quarter
  const nextIdx = PAYG_QUARTERS.findIndex((q) => q.dueMs >= now);

  return PAYG_QUARTERS.map((q, i) => ({
    quarter: q.quarter,
    dueDate: q.dueDate,
    amount: installment,
    isNext: i === nextIdx,
    isPast: q.dueMs < now,
  }));
}

export function gstStatus(income: number): "safe" | "approaching" | "required" {
  if (income >= 75000) return "required";
  if (income >= 60000) return "approaching";
  return "safe";
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}
