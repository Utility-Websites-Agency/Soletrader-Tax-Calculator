import { MetadataRoute } from "next";
import { BLOG_POSTS } from "@/lib/blog";

const BASE = "https://soletradertax.com.au";

export default function sitemap(): MetadataRoute.Sitemap {
  const blogEntries = BLOG_POSTS.map((post) => ({
    url: `${BASE}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [
    {
      url: BASE,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${BASE}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${BASE}/tools/gst-calculator`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.9,
    },
    ...blogEntries,
  ];
}
