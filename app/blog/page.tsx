"use client";

import Link from "next/link";
import { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { BLOG_POSTS } from "@/lib/blog";
import { ChevronRight, Clock, Tag, Calendar } from "lucide-react";
import AdSlot from "@/components/AdSlot";
import { ScrollProgress } from "@/components/ScrollProgress";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteNav } from "@/components/SiteNav";

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
  return (
    <Suspense>
      <BlogPageInner />
    </Suspense>
  );
}

function BlogPageInner() {
  const searchParams = useSearchParams();
  const [activeCategory, setActiveCategory] = useState(() => {
    const cat = searchParams.get("cat");
    return cat && ALL_CATEGORIES.includes(cat) ? cat : "All";
  });
  const [search, setSearch] = useState("");

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
      <SiteNav activePage="blog-index" />

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
            <p className="text-[16px] text-[#343638] max-w-xl leading-relaxed">
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
              className="w-full max-w-[600px] rounded-lg border border-[#e7e7e7] bg-white px-4 py-2.5 text-[14px] text-[#1f2328] outline-none focus:border-[#1a6fe8] focus:ring-2 focus:ring-[#1a6fe8]/20 placeholder:text-[#8b949e]"
            />
            <div className="flex flex-wrap gap-2">
              {ALL_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`rounded-full px-4 py-2 text-[13px] font-semibold transition-colors border ${
                    activeCategory === cat
                      ? "bg-[#1a6fe8] text-white border-[#1a6fe8]"
                      : "bg-white text-[#343638] border-[#e7e7e7] hover:border-[#1a6fe8] hover:text-[#1a6fe8]"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Results count */}
          <p className="text-[13px] text-[#5f6266] mb-4">
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
                    className="group flex flex-col h-full rounded-xl border border-[#e7e7e7] bg-white hover:border-[#1a6fe8]/40 hover:shadow-md transition-all duration-200 overflow-hidden"
                  >
                    <div className="flex flex-col flex-1 p-5 gap-3">
                      {/* Category */}
                      <span className={`inline-flex self-start items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider ${CATEGORY_COLORS[post.category] ?? "bg-gray-50 text-gray-600"}`}>
                        <Tag className="w-3 h-3" />
                        {post.category}
                      </span>

                      {/* Title */}
                      <h2 className="text-[18px] font-bold text-[#1f2328] leading-[28px] group-hover:text-[#1a6fe8] transition-colors line-clamp-3">
                        {post.title}
                      </h2>

                      {/* Excerpt */}
                      <p className="text-[16px] text-[#343638] leading-[28px] line-clamp-3 flex-1">
                        {post.excerpt}
                      </p>

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-3 border-t border-[#e7e7e7] mt-auto">
                        <div className="flex items-center gap-3 text-[12px] text-[#5f6266]">
                          <span className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5" />
                            {post.readTime}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5" />
                            {post.date}
                          </span>
                        </div>
                        <span className="flex items-center gap-1 text-[12px] font-semibold text-[#1a6fe8] group-hover:gap-2 transition-all">
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
          <AdSlot slotId="8772972152" />
        </div>
      </div>

      {/* AD SLOT 2 — above footer */}
      <div className="px-4 md:px-6 py-2">
        <div className="mx-auto max-w-[1280px]">
          <AdSlot slotId="8772972152" />
        </div>
      </div>

      <SiteFooter />
    </div>
  );
}
