import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="bg-[#1b1f24] px-6 py-12">
      <div className="mx-auto max-w-[1280px]">
        <div className="flex flex-col md:flex-row justify-between gap-10 mb-10">
          {/* Brand */}
          <div className="flex flex-col gap-3 max-w-xs">
            <Link href="/" className="flex items-center">
              <span className="text-[28px] font-semibold text-white">SoleTraderTax</span>
            </Link>
            <p className="text-[14px] text-[#8b949e] leading-relaxed">
              Free tools for Australian contractors and sole traders. Calculate your charge-out rate, tax and take-home pay.
            </p>
          </div>
          {/* Links */}
          <div className="flex flex-wrap gap-10">
            <div className="flex flex-col gap-3">
              <p className="text-[12px] font-semibold uppercase tracking-wider text-[#d1d1d1]">Calculator</p>
              <div className="flex flex-col gap-2">
                <Link href="/#calculator" className="text-[14px] text-[#8b949e] hover:text-white transition-colors">Rate Calculator</Link>
                <Link href="/#how-it-works" className="text-[14px] text-[#8b949e] hover:text-white transition-colors">How it works</Link>
                <Link href="/#faq" className="text-[14px] text-[#8b949e] hover:text-white transition-colors">FAQ</Link>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <p className="text-[12px] font-semibold uppercase tracking-wider text-[#d1d1d1]">Guides</p>
              <div className="flex flex-col gap-2">
                <Link href="/blog" className="text-[14px] text-[#8b949e] hover:text-white transition-colors">All articles</Link>
                <Link href="/blog/contractor-tax-planning-guide" className="text-[14px] text-[#8b949e] hover:text-white transition-colors">Contractor Tax Guide</Link>
                <Link href="/blog/contractor-pay-hourly-vs-daily" className="text-[14px] text-[#8b949e] hover:text-white transition-colors">Hourly vs Daily Rate</Link>
                <Link href="/blog/maximizing-tax-refund-australia" className="text-[14px] text-[#8b949e] hover:text-white transition-colors">Tax Refund Checklist</Link>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <p className="text-[12px] font-semibold uppercase tracking-wider text-[#d1d1d1]">Topics</p>
              <div className="flex flex-col gap-2">
                <Link href="/blog?cat=Tax" className="text-[14px] text-[#8b949e] hover:text-white transition-colors">Tax</Link>
                <Link href="/blog?cat=Contractor Pay" className="text-[14px] text-[#8b949e] hover:text-white transition-colors">Contractor Pay</Link>
                <Link href="/blog?cat=Superannuation" className="text-[14px] text-[#8b949e] hover:text-white transition-colors">Superannuation</Link>
                <Link href="/blog?cat=Mortgage" className="text-[14px] text-[#8b949e] hover:text-white transition-colors">Mortgage</Link>
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-[#30363d] pt-6 flex flex-col gap-1">
          <p className="text-[12px] text-[#8b949e]">© {new Date().getFullYear()} SoleTraderTax.com.au · Free Australian sole trader tax calculator.</p>
          <p className="text-[12px] text-[#8b949e]">General guidance only — not financial or tax advice.</p>
        </div>
      </div>
    </footer>
  );
}
