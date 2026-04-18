"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { BLOG_POSTS } from "@/lib/blog";
import { ChevronRight, Clock, Tag, Calendar } from "lucide-react";

const ALL_CATEGORIES = ["All", ...Array.from(new Set(BLOG_POSTS.map((p) => p.category)))];

const CATEGORY_COLORS: Record<string, string> = {
  "Tax":             "bg-blue-50 text-blue-700",
  "Contractor Pay":  "bg-purple-50 text-purple-700",
  "Personal Finance":"bg-green-50 text-green-700",
  "Tax Refund":      "bg-orange-50 text-orange-700",
  "Tax Savings":     "bg-teal-50 text-teal-700",
  "Superannuation":  "bg-indigo-50 text-indigo-700",
  "Mortgage":        "bg-rose-50 text-rose-700",
  "Work Planning":   "bg-amber-50 text-amber-700",
};

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    return [...BLOG_POSTS].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).filter((p) => {
      const matchCat = activeCategory === "All" || p.category === activeCategory;
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.excerpt.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q));
      return matchCat && matchSearch;
    });
  }, [activeCategory, search]);

  return (
    <div className="min-h-screen bg-white font-sans text-[#1f2328] flex flex-col">
      {/* Nav */}
      <header className="sticky top-0 z-50 border-b border-[#e7e7e7] bg-white/80 backdrop-blur-md">
        <div className="mx-4 md:mx-6 lg:mx-auto lg:max-w-[1280px] lg:px-6 flex h-14 items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[#2b7fff] text-white">
              <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4">
                <path d="M3 4h10M3 8h7M3 12h5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
            </div>
            <span className="text-[15px] font-semibold text-[#1f2328] tracking-tight">RateIQ</span>
            <span className="hidden sm:inline ml-1 rounded-full border border-[#2b7fff]/30 bg-[#2b7fff]/8 px-2 py-0.5 text-[12px] font-semibold uppercase tracking-wider text-[#2b7fff]">
              AU
            </span>
          </Link>
          <nav className="flex items-center gap-4 text-[14px] font-medium text-[#57606a]">
            <Link href="/" className="hover:text-[#1f2328] transition-colors">Calculator</Link>
            <Link href="/blog" className="text-[#1f2328] font-semibold">Blog</Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="px-4 md:px-6 py-16 md:py-20">
        <div className="mx-auto max-w-[1280px]">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#e7e7e7] bg-white px-3 py-1.5 text-[13px] font-medium text-[#57606a]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#2b7fff]" />
              ATO 2025-26 · Australian Tax Guides
            </div>
            <h1 className="text-[32px] md:text-[48px] font-extrabold tracking-tight text-[#1f2328] leading-[1.1] mb-4">
              Contractor &amp; Tax Guides
            </h1>
            <p className="text-[16px] text-[#57606a] max-w-xl leading-relaxed">
              Plain-English guides for Australian contractors and sole traders. Tax planning, rate setting, super and more.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters + Grid */}
      <section className="flex-1 px-4 md:px-6 pb-12">
        <div className="mx-auto max-w-[1280px]">

          {/* Search + filter bar */}
          <div className="flex flex-col sm:flex-row gap-3 mb-8">
            <input
              type="text"
              placeholder="Search articles…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 rounded-lg border border-[#e7e7e7] bg-white px-4 py-2.5 text-[14px] text-[#1f2328] outline-none focus:border-[#2b7fff] focus:ring-2 focus:ring-[#2b7fff]/20 placeholder:text-[#8b949e]"
            />
            <div className="flex flex-wrap gap-2">
              {ALL_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`rounded-full px-4 py-2 text-[13px] font-semibold transition-colors border ${
                    activeCategory === cat
                      ? "bg-[#2b7fff] text-white border-[#2b7fff]"
                      : "bg-white text-[#57606a] border-[#e7e7e7] hover:border-[#2b7fff] hover:text-[#2b7fff]"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Results count */}
          <p className="text-[13px] text-[#8b949e] mb-6">
            {filtered.length} article{filtered.length !== 1 ? "s" : ""}
            {activeCategory !== "All" ? ` in ${activeCategory}` : ""}
            {search ? ` matching "${search}"` : ""}
          </p>

          {/* Grid */}
          {filtered.length === 0 ? (
            <div className="text-center py-20 text-[#8b949e] text-[14px]">No articles found.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((post, i) => (
                <motion.div
                  key={post.slug}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.04 }}
                >
                  <Link
                    href={`/blog/${post.slug}`}
                    className="group flex flex-col h-full rounded-xl border border-[#e7e7e7] bg-white hover:border-[#2b7fff]/40 hover:shadow-md transition-all duration-200 overflow-hidden"
                  >
                    {/* Card color bar */}
                    <div className="h-1 w-full bg-gradient-to-r from-[#2b7fff] to-[#60a5fa]" />

                    <div className="flex flex-col flex-1 p-5 gap-3">
                      {/* Category */}
                      <span className={`inline-flex self-start items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider ${CATEGORY_COLORS[post.category] ?? "bg-gray-50 text-gray-600"}`}>
                        <Tag className="w-3 h-3" />
                        {post.category}
                      </span>

                      {/* Title */}
                      <h2 className="text-[15px] font-bold text-[#1f2328] leading-snug group-hover:text-[#2b7fff] transition-colors line-clamp-3">
                        {post.title}
                      </h2>

                      {/* Excerpt */}
                      <p className="text-[13px] text-[#57606a] leading-relaxed line-clamp-3 flex-1">
                        {post.excerpt}
                      </p>

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-3 border-t border-[#e7e7e7] mt-auto">
                        <div className="flex items-center gap-3 text-[12px] text-[#8b949e]">
                          <span className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5" />
                            {post.readTime}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5" />
                            {post.date}
                          </span>
                        </div>
                        <span className="flex items-center gap-1 text-[12px] font-semibold text-[#2b7fff] group-hover:gap-2 transition-all">
                          Read <ChevronRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1b1f24] px-6 py-12">
        <div className="mx-auto max-w-[1280px]">
          <div className="flex flex-col md:flex-row justify-between gap-10 mb-10">
            {/* Brand */}
            <div className="flex flex-col gap-3 max-w-xs">
              <div className="flex items-center gap-3">
                <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[#2b7fff]">
                  <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4">
                    <path d="M3 4h10M3 8h7M3 12h5" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
                  </svg>
                </div>
                <span className="text-[15px] font-semibold text-white">RateIQ</span>
              </div>
              <p className="text-[13px] text-[#8b949e] leading-relaxed">
                Free tools for Australian contractors and sole traders. Calculate your charge-out rate, tax and take-home pay.
              </p>
            </div>
            {/* Links */}
            <div className="flex flex-wrap gap-10">
              <div className="flex flex-col gap-3">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-[#57606a]">Calculator</p>
                <div className="flex flex-col gap-2">
                  <Link href="/#calculator" className="text-[13px] text-[#8b949e] hover:text-white transition-colors">Rate Calculator</Link>
                  <Link href="/#how-it-works" className="text-[13px] text-[#8b949e] hover:text-white transition-colors">How it works</Link>
                  <Link href="/#faq" className="text-[13px] text-[#8b949e] hover:text-white transition-colors">FAQ</Link>
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-[#57606a]">Guides</p>
                <div className="flex flex-col gap-2">
                  <Link href="/blog" className="text-[13px] text-[#8b949e] hover:text-white transition-colors">All articles</Link>
                  <Link href="/blog/contractor-tax-planning-guide" className="text-[13px] text-[#8b949e] hover:text-white transition-colors">Contractor Tax Guide</Link>
                  <Link href="/blog/contractor-pay-hourly-vs-daily" className="text-[13px] text-[#8b949e] hover:text-white transition-colors">Hourly vs Daily Rate</Link>
                  <Link href="/blog/maximizing-tax-refund-australia" className="text-[13px] text-[#8b949e] hover:text-white transition-colors">Tax Refund Checklist</Link>
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-[#57606a]">Topics</p>
                <div className="flex flex-col gap-2">
                  <Link href="/blog?cat=Tax" className="text-[13px] text-[#8b949e] hover:text-white transition-colors">Tax</Link>
                  <Link href="/blog?cat=Contractor Pay" className="text-[13px] text-[#8b949e] hover:text-white transition-colors">Contractor Pay</Link>
                  <Link href="/blog?cat=Superannuation" className="text-[13px] text-[#8b949e] hover:text-white transition-colors">Superannuation</Link>
                  <Link href="/blog?cat=Mortgage" className="text-[13px] text-[#8b949e] hover:text-white transition-colors">Mortgage</Link>
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-[#30363d] pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-[12px] text-[#8b949e]">© {new Date().getFullYear()} RateIQ. Australian Contractor Rate Calculator.</p>
            <p className="text-[12px] text-[#8b949e]">General guidance only — not financial or tax advice.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
