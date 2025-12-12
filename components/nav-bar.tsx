import Link from "next/link";
import { getCollectionsNames } from "@/lib/shopify"; // adjust the import path

export default async function Sidebar() {
  const collections = await getCollectionsNames(12);

  return (
    <aside className="hidden w-60 shrink-0 space-y-6 border-r border-black/10 pr-6 pt-6 md:block">
      <h2 className="text-sm uppercase tracking-[0.3em] text-black/50">
        Categories
      </h2>

      <nav className="space-y-3 text-sm">
        {collections.map((title) => {
          // create a URL-friendly slug for the href
          const slug = title
            .toLowerCase()
            .replace(/\s+/g, "-")            // spaces → hyphens
            .replace(/[^a-z0-9\-]/g, "");    // remove unsafe chars

          return (
            <Link
              key={slug}
              href={`/collections/${slug}`}
              className="block text-black/70 hover:text-ink"
            >
              {title}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
