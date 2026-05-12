"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";

function BlogFiltersInner({ categories }: { categories: string[] }) {
  const searchParams = useSearchParams();
  const [activeCategory, setActiveCategory] = useState(() => {
    const cat = searchParams.get("cat");
    return cat && categories.includes(cat) ? cat : "All";
  });
  const [search, setSearch] = useState("");

  useEffect(() => {
    const cat = searchParams.get("cat");
    setActiveCategory(cat && categories.includes(cat) ? cat : "All");
  }, [searchParams, categories]);

  useEffect(() => {
    const grid = document.getElementById("blog-grid");
    if (!grid) return;
    const cards = grid.querySelectorAll<HTMLAnchorElement>("a[href^='/blog/']");
    cards.forEach((card) => {
      const category = card.querySelector("[data-category]")?.getAttribute("data-category") ?? "";
      const title = card.querySelector("h2")?.textContent ?? "";
      const excerpt = card.querySelector("p")?.textContent ?? "";
      const q = search.toLowerCase();
      const matchCat = activeCategory === "All" || category === activeCategory;
      const matchSearch = !q || title.toLowerCase().includes(q) || excerpt.toLowerCase().includes(q);
      (card.parentElement as HTMLElement).style.display = matchCat && matchSearch ? "" : "none";
    });
  }, [activeCategory, search]);

  const visibleCount = (() => {
    if (typeof document === "undefined") return null;
    const grid = document.getElementById("blog-grid");
    if (!grid) return null;
    return grid.querySelectorAll<HTMLElement>("div[style='']").length;
  })();

  return (
    <div className="flex flex-col gap-3 mb-8">
      <input
        type="text"
        placeholder="Search articles…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full max-w-[600px] rounded-lg border border-[#e7e7e7] bg-white px-4 py-2.5 text-[14px] text-[#1f2328] outline-none focus:border-[#1a6fe8] focus:ring-2 focus:ring-[#1a6fe8]/20 placeholder:text-[#8b949e]"
      />
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
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
  );
}

export default function BlogFilters({ categories }: { categories: string[] }) {
  return (
    <Suspense>
      <BlogFiltersInner categories={categories} />
    </Suspense>
  );
}
