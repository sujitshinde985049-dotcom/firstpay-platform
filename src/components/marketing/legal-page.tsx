import { PageHero } from "@/components/marketing/page-hero";

export function LegalPage({
  title,
  description,
  sections,
}: {
  title: string;
  description: string;
  sections: Array<[string, string[]]>;
}) {
  return (
    <main>
      <PageHero
        eyebrow="Legal"
        title={title}
        description={description}
        primary="Contact legal"
        secondary="Data security"
        secondaryHref="/data-security"
      />
      <article className="mx-auto max-w-4xl px-5 py-16 sm:px-6 sm:py-24">
        <p className="text-muted mb-10 text-sm">Last updated: 22 July 2026</p>
        {sections.map(([heading, paragraphs]) => (
          <section key={heading} className="mb-10">
            <h2 className="text-2xl font-semibold tracking-tight">{heading}</h2>
            {paragraphs.map((paragraph) => (
              <p key={paragraph} className="text-muted mt-4 leading-8">
                {paragraph}
              </p>
            ))}
          </section>
        ))}
      </article>
    </main>
  );
}
