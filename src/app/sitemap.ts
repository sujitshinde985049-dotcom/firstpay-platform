import type { MetadataRoute } from "next";
import { posts } from "@/content/blog";
import { siteConfig } from "@/config/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/solutions",
    "/upi-autopay",
    "/e-nach",
    "/recurring-payments",
    "/mandate-management",
    "/developers",
    "/api-docs",
    "/industries",
    "/about",
    "/contact",
    "/faq",
    "/blog",
    "/privacy",
    "/terms",
    "/legal-policies",
    "/refund-policy",
    "/data-security",
    "/status",
  ];
  return [
    ...routes.map((route) => ({
      url: `${siteConfig.url}${route}`,
      lastModified: new Date(),
      changeFrequency:
        route === "" ? ("weekly" as const) : ("monthly" as const),
      priority: route === "" ? 1 : 0.7,
    })),
    ...posts.map((post) => ({
      url: `${siteConfig.url}/blog/${post.slug}`,
      lastModified: new Date(post.date),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
