import Link from "next/link";
import { BLOG_POSTS } from "@/lib/blog";
import { ChevronRight, Clock, Tag, Calendar } from "lucide-react";
import AdSlot from "@/components/AdSlot";
import { ScrollProgress } from "@/components/ScrollProgress";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteNav } from "@/components/SiteNav";
import BlogFilters from "./BlogFilters";

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

const SORTED_POSTS = [...BLOG_POSTS].sort((a, b) => {
  const dateDiff = new Date(b.date).getTime() - new Date(a.date).getTime();
  if (dateDiff !== 0) return dateDiff;
  return BLOG_POSTS.indexOf(b) - BLOG_POSTS.indexOf(a);
});

const ALL_CATEGORIES = ["All", ...Array.from(new Set(BLOG_POSTS.map((p) => p.category)))];

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-white font-sans text-[#1f2328] flex flex-col">
      <ScrollProgress />
      <SiteNav activePage="blog-index" />

      {/* Hero */}
      <section className="px-4 md:px-6 py-16 md:py-20">
        <div className="mx-auto max-w-[1280px]">
          <h1 className="text-[32px] md:text-[48px] font-extrabold tracking-tight text-[#1f2328] leading-[1.1] mb-4">
            Contractor &amp; Tax Guides
          </h1>
          <p className="text-[16px] text-[#343638] max-w-xl leading-relaxed">
            Plain-English guides for Australian contractors and sole traders. Tax planning, rate setting, super and more.
          </p>
        </div>
      </section>

      {/* Post grid — server rendered for SEO, filters hydrate client-side */}
      <section className="flex-1 px-4 md:px-6 pb-12">
        <div className="mx-auto max-w-[1280px]">
          <BlogFilters categories={ALL_CATEGORIES} />

          {/* Static post grid visible to crawlers */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5" id="blog-grid">
            {SORTED_POSTS.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group flex flex-col h-full rounded-xl border border-[#e7e7e7] bg-white hover:border-[#1a6fe8]/40 hover:shadow-md transition-all duration-200 overflow-hidden"
              >
                <div className="flex flex-col flex-1 p-5 gap-3">
                  <span className={`inline-flex self-start items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider ${CATEGORY_COLORS[post.category] ?? "bg-gray-50 text-gray-600"}`}>
                    <Tag className="w-3 h-3" />
                    {post.category}
                  </span>

                  <h2 className="text-[18px] font-bold text-[#1f2328] leading-[28px] group-hover:text-[#1a6fe8] transition-colors line-clamp-3">
                    {post.title}
                  </h2>

                  <p className="text-[16px] text-[#343638] leading-[28px] line-clamp-3 flex-1">
                    {post.excerpt}
                  </p>

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
            ))}
          </div>
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
