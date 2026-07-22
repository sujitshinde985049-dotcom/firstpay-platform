import {
  BookOpen,
  CalendarClock,
  FolderTree,
  Image,
  Search,
  Tags,
} from "lucide-react";
import { OperationsPage } from "@/components/admin/operations-page";
export default function Page() {
  return (
    <OperationsPage
      title="Blog engine"
      description="Author, schedule, optimise, and relate enterprise fintech content."
      cards={[
        {
          title: "Rich editor",
          description:
            "Structured article body, preview, autosafe drafts, author attribution, and featured media.",
          icon: BookOpen,
        },
        {
          title: "Publishing",
          description:
            "Draft, schedule, publish, archive, preview, and related-post workflows.",
          icon: CalendarClock,
        },
        {
          title: "Categories",
          description: "Manage category hierarchy and SEO-friendly slugs.",
          icon: FolderTree,
        },
        {
          title: "Tags",
          description: "Reusable topic tags for discovery and related content.",
          icon: Tags,
        },
        {
          title: "Featured media",
          description: "Choose validated images from Supabase Storage.",
          icon: Image,
        },
        {
          title: "Search",
          description:
            "Search title, slug, author, category, tag, and publishing status.",
          icon: Search,
        },
      ]}
    />
  );
}
