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
        <h2 className="text-[20px] font-bold text-[#1f2328] mb-3 mt-8 first:mt-0 leading-snug border-l-4 border-[#2b7fff] pl-4">
          {section.heading}
        </h2>
      )}
      {section.subheading && (
        <h3 className="text-[16px] font-semibold text-[#1f2328] mb-2 mt-4">
          {section.subheading}
        </h3>
      )}
      {section.body && (
        <p className="text-[15px] text-[#57606a] leading-relaxed mb-3">
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
                    <th key={h} className="text-left px-4 py-2.5 font-semibold text-[#57606a]">
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
            <li key={li} className="flex items-start gap-2.5 text-[14px] text-[#57606a] leading-relaxed">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#2b7fff]/10 mt-0.5">
                <Check className="w-3 h-3 text-[#2b7fff]" />
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

      {/* Breadcrumb */}
      <div className="border-b border-[#e7e7e7] px-4 md:px-6 py-3">
        <div className="mx-auto max-w-[1280px] flex items-center gap-2 text-[13px] text-[#8b949e]">
          <Link href="/blog" className="flex items-center gap-1.5 hover:text-[#2b7fff] transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" />
            All articles
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-[#57606a] truncate max-w-[200px] sm:max-w-none">{post.title}</span>
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
            <p className="mt-5 text-[16px] text-[#57606a] leading-relaxed border-l-4 border-[#e7e7e7] pl-4 italic">
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
              <span key={tag} className="rounded-full border border-[#e7e7e7] bg-[#f6f8fa] px-3 py-1 text-[12px] font-medium text-[#57606a]">
                {tag}
              </span>
            ))}
          </div>

          {/* Prev / Next navigation */}
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {prev ? (
              <Link
                href={`/blog/${prev.slug}`}
                className="group flex flex-col gap-1.5 rounded-xl border border-[#e7e7e7] bg-white p-4 hover:border-[#2b7fff]/40 hover:shadow-sm transition-all"
              >
                <span className="flex items-center gap-1.5 text-[12px] font-semibold text-[#8b949e] uppercase tracking-wider">
                  <ChevronLeft className="w-3.5 h-3.5" /> Previous
                </span>
                <span className="text-[14px] font-semibold text-[#1f2328] group-hover:text-[#2b7fff] transition-colors line-clamp-2 leading-snug">
                  {prev.title}
                </span>
                <span className="text-[12px] text-[#8b949e]">{prev.readTime}</span>
              </Link>
            ) : <div />}

            {next ? (
              <Link
                href={`/blog/${next.slug}`}
                className="group flex flex-col gap-1.5 rounded-xl border border-[#e7e7e7] bg-white p-4 hover:border-[#2b7fff]/40 hover:shadow-sm transition-all sm:text-right"
              >
                <span className="flex items-center gap-1.5 sm:justify-end text-[12px] font-semibold text-[#8b949e] uppercase tracking-wider">
                  Next <ChevronRight className="w-3.5 h-3.5" />
                </span>
                <span className="text-[14px] font-semibold text-[#1f2328] group-hover:text-[#2b7fff] transition-colors line-clamp-2 leading-snug">
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
              <p className="text-[13px] font-bold uppercase tracking-widest text-[#c9d1d9] mb-1">Try the Calculator</p>
              <p className="text-[13px] text-[#8b949e] leading-relaxed">Find your exact charge-out rate in 60 seconds.</p>
            </div>
            <div className="p-4 bg-white">
              <Link
                href="/#calculator"
                className="flex items-center justify-center w-full rounded-full bg-[#2b7fff] px-5 py-2.5 text-[14px] font-semibold text-white transition hover:bg-[#1a6fe8]"
              >
                Calculate my rate →
              </Link>
            </div>
          </div>

          {/* Related posts */}
          {relatedPosts.length > 0 && (
            <div className="rounded-xl border border-[#e7e7e7] bg-white overflow-hidden">
              <div className="border-b border-[#e7e7e7] bg-[#f6f8fa] px-4 py-3">
                <h3 className="text-[12px] font-semibold uppercase tracking-wider text-[#57606a]">Related Articles</h3>
              </div>
              <div className="divide-y divide-[#e7e7e7]">
                {relatedPosts.map((p) => (
                  <Link
                    key={p.slug}
                    href={`/blog/${p.slug}`}
                    className="group flex flex-col gap-1 px-4 py-3.5 hover:bg-[#f6f8fa] transition-colors"
                  >
                    <span className="text-[13px] font-semibold text-[#1f2328] group-hover:text-[#2b7fff] transition-colors line-clamp-2 leading-snug">
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
            className="flex items-center justify-center gap-2 rounded-xl border border-[#e7e7e7] bg-white px-4 py-3 text-[13px] font-semibold text-[#57606a] hover:text-[#2b7fff] hover:border-[#2b7fff]/40 transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Browse all articles
          </Link>

        </aside>
      </div>

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
                  <Link href="/blog" className="text-[13px] text-[#8b949e] hover:text-white transition-colors">Tax</Link>
                  <Link href="/blog" className="text-[13px] text-[#8b949e] hover:text-white transition-colors">Contractor Pay</Link>
                  <Link href="/blog" className="text-[13px] text-[#8b949e] hover:text-white transition-colors">Superannuation</Link>
                  <Link href="/blog" className="text-[13px] text-[#8b949e] hover:text-white transition-colors">Mortgage</Link>
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
