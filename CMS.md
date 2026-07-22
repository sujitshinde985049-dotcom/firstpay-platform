# CMS

The Super Admin CMS manages home, hero, solutions, about, contact, developers, industries, footer, navigation, FAQs, testimonials, logos, blog, legal, dynamic pages, statistics, and SEO.

Entries support draft, scheduled, published, and archived states, preview-token hashes, ordering, featured media, page-level SEO, author attribution, categories, tags, and related entries. Scheduling requires a trusted background worker to publish due entries.

Media lives in the `platform-media` Supabase Storage bucket. Upload actions validate MIME type and size; database metadata supports folders, preview, search, rename, and soft deletion.
