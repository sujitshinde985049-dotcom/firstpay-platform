import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPost, posts } from "@/content/blog";

export function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const post = getPost((await params).slug);
  return post
    ? {
        title: post.title,
        description: post.excerpt,
        alternates: { canonical: `/blog/${post.slug}` },
        openGraph: {
          type: "article",
          title: post.title,
          description: post.excerpt,
        },
      }
    : {};
}
export default async function BlogDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const post = getPost((await params).slug);
  if (!post) notFound();
  return (
    <main>
      <article className="mx-auto max-w-4xl px-5 py-18 sm:px-6 sm:py-24">
        <Link href="/blog" className="text-brand text-sm font-semibold">
          ← Back to journal
        </Link>
        <div className="text-muted mt-12 flex flex-wrap gap-3 text-xs font-semibold">
          <span className="text-brand">{post.category}</span>
          <span>{post.date}</span>
          <span>{post.readTime}</span>
        </div>
        <h1 className="mt-5 text-4xl font-bold tracking-[-0.04em] text-balance sm:text-6xl">
          {post.title}
        </h1>
        <p className="text-muted mt-6 text-xl leading-9">{post.excerpt}</p>
        <div className="marketing-grid my-12 h-72 rounded-3xl border bg-gradient-to-br from-blue-100 via-white to-cyan-100 dark:from-blue-950 dark:via-slate-950 dark:to-cyan-950" />
        <div className="text-muted space-y-7 text-lg leading-9">
          {post.content.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
        <aside className="bg-surface-muted mt-14 rounded-2xl border p-7">
          <h2 className="text-foreground text-xl font-semibold">
            Build resilient payment operations
          </h2>
          <p className="mt-2 text-sm leading-6">
            Talk to FirstPay about your recurring payment and mandate
            architecture.
          </p>
          <Link
            href="/contact"
            className="text-brand mt-5 inline-block text-sm font-semibold"
          >
            Start a conversation →
          </Link>
        </aside>
      </article>
    </main>
  );
}
