import { Bot, Code2, Globe2, Link2, Route, Share2 } from "lucide-react";
import { OperationsPage } from "@/components/admin/operations-page";
export default function Page() {
  return (
    <OperationsPage
      title="SEO manager"
      description="Control page discovery and social presentation from one governed workspace."
      cards={[
        {
          title: "Page metadata",
          description:
            "Title, description, canonical URL, and keywords for every managed page.",
          icon: Globe2,
        },
        {
          title: "Social cards",
          description:
            "Open Graph and Twitter metadata with media-library assets.",
          icon: Share2,
        },
        {
          title: "Structured data",
          description: "Validated JSON-LD blocks stored per page.",
          icon: Code2,
        },
        {
          title: "Robots",
          description:
            "Index and follow directives with safe platform defaults.",
          icon: Bot,
        },
        {
          title: "Sitemap",
          description: "Published dynamic pages are included automatically.",
          icon: Link2,
        },
        {
          title: "Redirects",
          description: "Manage audited 301, 302, 307, and 308 redirects.",
          icon: Route,
        },
      ]}
    />
  );
}
