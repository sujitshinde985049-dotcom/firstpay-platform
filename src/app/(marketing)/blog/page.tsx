import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { PageHero } from "@/components/marketing/page-hero";
import { posts } from "@/content/blog";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata(
  "Blog",
  "Ideas and practical guidance on recurring payments, mandates, fintech engineering, and payment operations.",
  "/blog",
);
export default function BlogPage() {
  return (
    <main>
      <PageHero
        eyebrow="FirstPay journal"
        title="Ideas for modern payment teams"
        description="Practical thinking on payment infrastructure, mandate operations, developer experience, and enterprise scale."
        primary="Subscribe by email"
        primaryHref="mailto:updates@firstpay.in"
      />
      <section className="mx-auto grid max-w-7xl gap-6 px-5 py-20 sm:px-6 md:grid-cols-2 lg:grid-cols-3 lg:px-8 lg:py-28">
        {posts.map((post, index) => (
          <article
            key={post.slug}
            className={`group bg-surface overflow-hidden rounded-2xl border ${index === 0 ? "md:col-span-2 lg:col-span-2" : ""}`}
          >
            <div className="marketing-grid h-44 bg-gradient-to-br from-blue-100 to-cyan-50 dark:from-blue-950 dark:to-cyan-950" />
            <div className="p-7">
              <div className="text-muted flex gap-3 text-xs font-semibold">
                <span className="text-brand">{post.category}</span>
                <span>{post.date}</span>
                <span>{post.readTime}</span>
              </div>
              <h2 className="mt-4 text-2xl font-semibold tracking-tight">
                {post.title}
              </h2>
              <p className="text-muted mt-3 leading-7">{post.excerpt}</p>
              <Link
                href={`/blog/${post.slug}`}
                className="text-brand mt-6 inline-flex items-center gap-2 text-sm font-semibold"
              >
                Read article{" "}
                <ArrowRight className="size-4 transition group-hover:translate-x-1" />
              </Link>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
