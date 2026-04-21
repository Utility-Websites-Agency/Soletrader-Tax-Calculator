"use client";

import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { motion } from "framer-motion";
import { BLOG_POSTS, getPostBySlug, getAdjacentPosts, BlogSection } from "@/lib/blog";
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  Tag,
  Info,
  AlertTriangle,
  BookOpen,
  Check,
  ArrowLeft,
} from "lucide-react";
import AdSlot from "@/components/AdSlot";
import { ScrollProgress } from "@/components/ScrollProgress";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteNav } from "@/components/SiteNav";

// ─── Small components ──────────────────────────────────────────────────────────

function Callout({ type, text }: { type: "info" | "tip" | "warning"; text: string }) {
  const styles = {
    info:    { border: "border-blue-200",  bg: "bg-blue-50",  icon: <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />,          text: "text-blue-900"  },
    tip:     { border: "border-blue-200",  bg: "bg-blue-50",  icon: <BookOpen className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />,      text: "text-blue-900"  },
    warning: { border: "border-amber-200", bg: "bg-amber-50", icon: <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />, text: "text-amber-900" },
  };
  const s = styles[type];
  return (
    <div className={`flex gap-3 rounded-lg ${s.bg} px-4 py-3 my-4`}>
      {s.icon}
      <p className={`text-[14px] leading-relaxed ${s.text}`}>{text}</p>
    </div>
  );
}

function PostSection({ section, index }: { section: BlogSection; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.05 + index * 0.04 }}
      className="mb-8"
    >
      {section.heading && (
        <h2 className="text-[20px] font-bold text-[#1f2328] mb-3 mt-8 first:mt-0 leading-snug border-l-4 border-[#1a6fe8] pl-4">
          {section.heading}
        </h2>
      )}
      {section.subheading && (
        <h3 className="text-[16px] font-semibold text-[#1f2328] mb-2 mt-4">
          {section.subheading}
        </h3>
      )}
      {section.body && (
        <p className="text-[16px] text-[#343638] leading-[28px] mb-3">
          {section.body}
        </p>
      )}
      {section.table && (
        <div className="rounded-xl border border-[#e7e7e7] overflow-hidden my-4">
          <div className="overflow-x-auto">
            <table className="w-full text-[14px]">
              <thead>
                <tr className="border-b border-[#e7e7e7] bg-[#f6f8fa]">
                  {section.table.headers.map((h) => (
                    <th key={h} className="text-left px-4 py-2.5 font-semibold text-[#343638]">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {section.table.rows.map((row, ri) => (
                  <tr key={ri} className={`border-b border-[#e7e7e7] last:border-0 ${ri % 2 === 0 ? "bg-white" : "bg-[#f6f8fa]"}`}>
                    {row.map((cell, ci) => (
                      <td key={ci} className="px-4 py-2.5 text-[#1f2328] font-medium">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {section.list && (
        <ul className="flex flex-col gap-2 my-3">
          {section.list.map((item, li) => (
            <li key={li} className="flex items-start gap-2.5 text-[16px] text-[#343638] leading-relaxed">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#1a6fe8]/10 mt-0.5">
                <Check className="w-3 h-3 text-[#1a6fe8]" />
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      )}
      {section.callout && (
        <Callout type={section.callout.type} text={section.callout.text} />
      )}
    </motion.div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function BlogPostPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const post = getPostBySlug(slug);
  if (!post) notFound();

  const { prev, next } = getAdjacentPosts(slug);
  const relatedPosts = BLOG_POSTS
    .filter((p) => p.slug !== slug && p.category === post.category)
    .slice(0, 2);

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": post.title,
    "description": post.excerpt,
    "datePublished": new Date(post.date).toISOString(),
    "publisher": {
      "@type": "Organization",
      "name": "SoleTraderTax",
      "url": "https://soletradertax.com.au",
    },
    "url": `https://soletradertax.com.au/blog/${post.slug}`,
    "keywords": post.tags.join(", "),
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://soletradertax.com.au",
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Blog",
        "item": "https://soletradertax.com.au/blog",
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": post.title,
        "item": `https://soletradertax.com.au/blog/${post.slug}`,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-white font-sans text-[#1f2328] flex flex-col">
      <ScrollProgress />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <SiteNav activePage="blog-post" />

      {/* Breadcrumb */}
      <div className="border-b border-[#e7e7e7] py-3">
        <div className="mx-auto max-w-[1240px] flex items-center gap-2 text-[14px] text-[#8b949e]">
          <Link href="/blog" className="flex items-center gap-1.5 hover:text-[#1a6fe8] transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" />
            All articles
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-[#343638] truncate max-w-[200px] sm:max-w-none">{post.title}</span>
        </div>
      </div>

      {/* Main layout: article + sidebar */}
      <div className="flex-1 mx-4 md:mx-6 lg:mx-auto lg:max-w-[1280px] lg:px-6 py-10 md:py-14 flex flex-col lg:flex-row gap-10 lg:gap-16">

        {/* Article */}
        <article className="flex-1 min-w-0">

          {/* Post header */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-10"
          >
            <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[12px] font-semibold uppercase tracking-wider mb-4 bg-blue-50 text-blue-700`}>
              <Tag className="w-3 h-3" />
              {post.category}
            </span>
            <h1 className="text-[26px] md:text-[36px] font-extrabold tracking-tight text-[#1f2328] leading-[1.15] mb-5">
              {post.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-[13px] text-[#8b949e]">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                {post.readTime}
              </span>
              <span>{post.date}</span>
            </div>
            <p className="mt-5 text-[16px] text-[#343638] leading-relaxed border-l-4 border-[#e7e7e7] pl-4 italic">
              {post.excerpt}
            </p>
          </motion.div>

          {/* Article body */}
          <div className="prose-content">
            {post.content.map((section, i) => (
              <PostSection key={i} section={section} index={i} />
            ))}
          </div>

          {/* Tags */}
          <div className="mt-10 pt-6 border-t border-[#e7e7e7] flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span key={tag} className="rounded-full border border-[#e7e7e7] bg-[#f6f8fa] px-3 py-1 text-[12px] font-medium text-[#343638]">
                {tag}
              </span>
            ))}
          </div>

          {/* End-of-post CTA */}
          <div className="mt-10 rounded-xl bg-[#1b1f24] px-6 py-7 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="text-[16px] font-bold text-white leading-snug mb-1">Know what you should charge?</p>
              <p className="text-[14px] text-[#c9d1d9] leading-relaxed">Use our free calculator to find your exact charge-out rate in 60 seconds.</p>
            </div>
            <Link
              href="/#calculator"
              className="shrink-0 inline-flex items-center justify-center rounded-full bg-[#1a6fe8] px-6 py-2.5 text-[14px] font-semibold text-white transition hover:bg-[#1560d0]"
            >
              Calculate my rate
            </Link>
          </div>

          {/* AD SLOT 1 — after article body */}
          <AdSlot slotId="8333140991" className="mt-10" />

          {/* Prev / Next navigation */}
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {prev ? (
              <Link
                href={`/blog/${prev.slug}`}
                className="group flex flex-col gap-1.5 rounded-xl border border-[#e7e7e7] bg-white p-4 hover:border-[#1a6fe8]/40 hover:shadow-sm transition-all"
              >
                <span className="flex items-center gap-1.5 text-[12px] font-semibold text-[#8b949e] uppercase tracking-wider">
                  <ChevronLeft className="w-3.5 h-3.5" /> Previous
                </span>
                <span className="text-[14px] font-semibold text-[#1f2328] group-hover:text-[#1a6fe8] transition-colors line-clamp-2 leading-snug">
                  {prev.title}
                </span>
                <span className="text-[12px] text-[#8b949e]">{prev.readTime}</span>
              </Link>
            ) : <div />}

            {next ? (
              <Link
                href={`/blog/${next.slug}`}
                className="group flex flex-col gap-1.5 rounded-xl border border-[#e7e7e7] bg-white p-4 hover:border-[#1a6fe8]/40 hover:shadow-sm transition-all sm:text-right"
              >
                <span className="flex items-center gap-1.5 sm:justify-end text-[12px] font-semibold text-[#8b949e] uppercase tracking-wider">
                  Next <ChevronRight className="w-3.5 h-3.5" />
                </span>
                <span className="text-[14px] font-semibold text-[#1f2328] group-hover:text-[#1a6fe8] transition-colors line-clamp-2 leading-snug">
                  {next.title}
                </span>
                <span className="text-[12px] text-[#8b949e]">{next.readTime}</span>
              </Link>
            ) : <div />}
          </div>

        </article>

        {/* Sidebar */}
        <aside className="lg:w-[280px] shrink-0 flex flex-col gap-6">

          {/* CTA card */}
          <div className="rounded-xl border border-[#e7e7e7] overflow-hidden sticky top-20">
            <div className="bg-[#1b1f24] px-5 py-4">
              <p className="text-[16px] font-bold text-white leading-snug mb-1">Try the Calculator</p>
              <p className="text-[13px] text-[#c9d1d9] leading-relaxed">Find your exact charge-out rate in 60 seconds.</p>
            </div>
            <div className="p-4 bg-white">
              <Link
                href="/#calculator"
                className="flex items-center justify-center w-full rounded-full bg-[#1a6fe8] px-5 py-2.5 text-[14px] font-semibold text-white transition hover:bg-[#1560d0]"
              >
                Calculate my rate
              </Link>
            </div>
          </div>

          {/* Related posts */}
          {relatedPosts.length > 0 && (
            <div className="rounded-xl border border-[#e7e7e7] bg-white overflow-hidden">
              <div className="border-b border-[#e7e7e7] bg-[#f6f8fa] px-4 py-3">
                <h3 className="text-[12px] font-semibold uppercase tracking-wider text-[#343638]">Related Articles</h3>
              </div>
              <div className="divide-y divide-[#e7e7e7]">
                {relatedPosts.map((p) => (
                  <Link
                    key={p.slug}
                    href={`/blog/${p.slug}`}
                    className="group flex flex-col gap-1 px-4 py-3.5 hover:bg-[#f6f8fa] transition-colors"
                  >
                    <span className="text-[14px] font-semibold text-[#1f2328] group-hover:text-[#1a6fe8] transition-colors line-clamp-2 leading-[22px]">
                      {p.title}
                    </span>
                    <span className="flex items-center gap-1 text-[12px] text-[#8b949e]">
                      <Clock className="w-3 h-3" /> {p.readTime}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* All articles link */}
          <Link
            href="/blog"
            className="flex items-center justify-center gap-2 rounded-xl border border-[#e7e7e7] bg-white px-4 py-3 text-[14px] leading-[22px] font-semibold text-[#343638] hover:text-[#1a6fe8] hover:border-[#1a6fe8]/40 transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Browse all articles
          </Link>

          <AdSlot slotId="8333140991" />

        </aside>
      </div>

      {/* AD SLOT 2 — above footer */}
      <div className="px-4 md:px-6 py-2">
        <div className="mx-auto max-w-[1280px]">
          <AdSlot slotId="8333140991" />
        </div>
      </div>

      {/* Footer */}
      <SiteFooter />
    </div>
  );
}
