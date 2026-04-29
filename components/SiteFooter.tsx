import Link from "next/link";
import { BLOG_POSTS } from "@/lib/blog";

const BLOG_CATEGORIES = ["All", ...Array.from(new Set(BLOG_POSTS.map((p) => p.category)))];

export function SiteFooter() {
  return (
    <footer className="bg-[#1b1f24] px-6 py-12">
      <div className="mx-auto max-w-[1280px]">
        <div className="flex flex-col md:flex-row justify-between gap-10 mb-10">
          {/* Brand */}
          <div className="flex flex-col gap-3 max-w-xs">
            <Link href="/" className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-[7px] bg-[#1a6fe8] text-[13px] font-bold text-white tracking-tight shrink-0">ST</span>
              <span className="text-[28px] font-semibold text-white">SoleTraderTax</span>
            </Link>
            <p className="text-[14px] text-[#c9d1d9] leading-relaxed">
              Free tools for Australian contractors and sole traders. Calculate your charge-out rate, tax and take-home pay.
            </p>
          </div>
          {/* Links */}
          <div className="flex flex-wrap gap-10">
            <div className="flex flex-col gap-3">
              <p className="text-[12px] font-semibold uppercase tracking-wider text-white">CALCULATOR</p>
              <div className="flex flex-col gap-2">
                <Link href="/#calculator" className="text-[14px] text-[#c9d1d9] hover:text-white transition-colors">Rate calculator</Link>
                <Link href="/tools/gst-calculator" className="text-[14px] text-[#c9d1d9] hover:text-white transition-colors">GST calculator</Link>
                <Link href="/#how-it-works" className="text-[14px] text-[#c9d1d9] hover:text-white transition-colors">How it works</Link>
                <Link href="/#faq" className="text-[14px] text-[#c9d1d9] hover:text-white transition-colors">FAQ</Link>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <p className="text-[12px] font-semibold uppercase tracking-wider text-white">GUIDES</p>
              <div className="flex flex-col gap-2">
                <Link href="/blog" className="text-[14px] text-[#c9d1d9] hover:text-white transition-colors">All articles</Link>
                <Link href="/blog/contractor-tax-planning-guide" className="text-[14px] text-[#c9d1d9] hover:text-white transition-colors">Contractor tax guide</Link>
                <Link href="/blog/contractor-pay-hourly-vs-daily" className="text-[14px] text-[#c9d1d9] hover:text-white transition-colors">Hourly vs daily rate</Link>
                <Link href="/blog/maximizing-tax-refund-australia" className="text-[14px] text-[#c9d1d9] hover:text-white transition-colors">Tax refund checklist</Link>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <p className="text-[12px] font-semibold uppercase tracking-wider text-white">BLOG</p>
              <div className="grid grid-cols-2 gap-x-8 gap-y-2">
                {BLOG_CATEGORIES.map((cat) => (
                  <Link
                    key={cat}
                    href={cat === "All" ? "/blog" : `/blog?cat=${encodeURIComponent(cat)}`}
                    className="text-[14px] text-[#c9d1d9] hover:text-white transition-colors"
                  >
                    {cat === "All" ? "All topics" : cat}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-[#30363d] pt-6 flex flex-col gap-2">
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            <Link href="/about" className="text-[12px] text-[#c9d1d9] hover:text-white transition-colors">About</Link>
            <Link href="/contact" className="text-[12px] text-[#c9d1d9] hover:text-white transition-colors">Contact</Link>
            <Link href="/privacy-policy" className="text-[12px] text-[#c9d1d9] hover:text-white transition-colors">Privacy policy</Link>
          </div>
          <p className="text-[12px] text-[#c9d1d9]">© {new Date().getFullYear()} SoleTraderTax.com.au · Free Australian sole trader tax calculator.</p>
          <p className="text-[12px] text-[#c9d1d9]">General guidance only, not financial or tax advice.</p>
        </div>
      </div>
    </footer>
  );
}
