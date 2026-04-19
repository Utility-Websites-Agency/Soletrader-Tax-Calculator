"use client";

import Link from "next/link";
import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { BLOG_POSTS } from "@/lib/blog";
import { ChevronRight, Clock, Tag, Calendar } from "lucide-react";
import AdSlot from "@/components/AdSlot";
import { ScrollProgress } from "@/components/ScrollProgress";
import { SiteFooter } from "@/components/SiteFooter";

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
  const searchParams = useSearchParams();
  const [activeCategory, setActiveCategory] = useState(() => {
    const cat = searchParams.get("cat");
    return cat && ALL_CATEGORIES.includes(cat) ? cat : "All";
  });
  const [search, setSearch] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const cat = searchParams.get("cat");
    setActiveCategory(cat && ALL_CATEGORIES.includes(cat) ? cat : "All");
  }, [searchParams]);

const filtered = useMemo(() => {
    return [...BLOG_POSTS].sort((a, b) => {
      const dateDiff = new Date(b.date).getTime() - new Date(a.date).getTime();
      if (dateDiff !== 0) return dateDiff;
      return BLOG_POSTS.indexOf(b) - BLOG_POSTS.indexOf(a);
    }).filter((p) => {
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
      <ScrollProgress />
      {/* Nav */}
      <header className="sticky top-0 z-50 border-b border-[#e7e7e7] bg-white/80 backdrop-blur-md">
        <div className="mx-4 md:mx-6 lg:mx-auto lg:max-w-[1280px] lg:px-6 flex h-14 items-center justify-between pt-[5px]">
          <Link href="/" className="flex items-center">
            <span className="text-[15px] font-semibold text-[#1f2328] tracking-tight">SoleTraderTax</span>
          </Link>
          <div className="flex items-center gap-4">
            {/* Blog link always visible */}
            <Link href="/blog" className="text-[14px] font-semibold text-[#1f2328]">Blog</Link>
            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-4 text-[14px] font-medium text-[#57606a]">
              <Link href="/" className="hover:text-[#1f2328] transition-colors">Calculator</Link>
            </nav>
            {/* Mobile burger */}
            <button
              onClick={() => setDrawerOpen((v) => !v)}
              className="md:hidden flex flex-col items-center justify-center w-9 h-9 rounded-lg border border-[#e7e7e7] bg-white/80 gap-1.5 focus:outline-none"
              aria-label="Open menu"
            >
              <motion.span animate={drawerOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }} transition={{ duration: 0.25 }} className="block h-[1.5px] w-4 bg-[#1f2328] rounded-full origin-center" />
              <motion.span animate={drawerOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }} transition={{ duration: 0.2 }} className="block h-[1.5px] w-4 bg-[#1f2328] rounded-full" />
              <motion.span animate={drawerOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }} transition={{ duration: 0.25 }} className="block h-[1.5px] w-4 bg-[#1f2328] rounded-full origin-center" />
            </button>
          </div>
        </div>
      </header>

      {/* ── MOBILE DRAWER ── */}
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
              className="fixed top-0 right-0 z-50 h-full w-[280px] bg-white shadow-2xl flex flex-col md:hidden"
            >
              <div className="flex items-center justify-between px-5 h-14 border-b border-[#e7e7e7]">
                <div className="flex items-center">
                  <span className="text-[14px] font-semibold text-[#1f2328]">SoleTraderTax</span>
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
              <nav className="flex flex-col gap-1 p-4 flex-1">
                {[
                  { label: "Calculator", href: "/" },
                  { label: "How it works", href: "/#how-it-works" },
                  { label: "FAQ", href: "/#faq" },
                ].map((item, i) => (
                  <motion.a
                    key={item.label}
                    href={item.href}
                    onClick={() => setDrawerOpen(false)}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 + i * 0.05, duration: 0.2 }}
                    className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-[15px] font-medium text-[#1f2328] hover:bg-[#f6f8fa] transition-colors"
                  >
                    {item.label}
                  </motion.a>
                ))}
              </nav>
              <div className="p-4 border-t border-[#e7e7e7]">
                <Link
                  href="/"
                  className="flex items-center justify-center w-full rounded-full bg-[#2b7fff] px-5 py-3 text-[15px] font-semibold text-white transition hover:bg-[#1a6fe8]"
                >
                  Try the calculator →
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Hero */}
      <section className="px-4 md:px-6 py-16 md:py-20">
        <div className="mx-auto max-w-[1280px]">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
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
          <div className="flex flex-col gap-3 mb-8">
            <input
              type="text"
              placeholder="Search articles…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full max-w-[600px] rounded-lg border border-[#e7e7e7] bg-white px-4 py-2.5 text-[14px] text-[#1f2328] outline-none focus:border-[#2b7fff] focus:ring-2 focus:ring-[#2b7fff]/20 placeholder:text-[#8b949e]"
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
                    <div className="flex flex-col flex-1 p-5 gap-3">
                      {/* Category */}
                      <span className={`inline-flex self-start items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider ${CATEGORY_COLORS[post.category] ?? "bg-gray-50 text-gray-600"}`}>
                        <Tag className="w-3 h-3" />
                        {post.category}
                      </span>

                      {/* Title */}
                      <h2 className="text-[18px] font-bold text-[#1f2328] leading-[28px] group-hover:text-[#2b7fff] transition-colors line-clamp-3">
                        {post.title}
                      </h2>

                      {/* Excerpt */}
                      <p className="text-[16px] text-[#57606a] leading-[24px] line-clamp-3 flex-1">
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

      {/* AD SLOT 1 — after article grid */}
      <div className="px-4 md:px-6 py-2">
        <div className="mx-auto max-w-[1280px]">
          <AdSlot label="Ad slot 1, Google AdSense" />
        </div>
      </div>

      {/* AD SLOT 2 — above footer */}
      <div className="px-4 md:px-6 py-2">
        <div className="mx-auto max-w-[1280px]">
          <AdSlot label="Ad slot 2, Google AdSense" />
        </div>
      </div>

      <SiteFooter />
    </div>
  );
}
