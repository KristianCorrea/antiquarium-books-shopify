import Link from "next/link";
import { getCollections } from "@/lib/shopify";

export default async function Sidebar() {
  const collections = await getCollections(12);

  return (
    <aside className="hidden w-60 shrink-0 space-y-6 border-r border-black/10 pr-6 pt-6 md:block">
      <h2 className="text-sm uppercase tracking-[0.3em] text-black/50">
        Categories
      </h2>

      <nav className="space-y-3 text-sm">
        {collections.map((collection) => {
          return (
            <Link
              key={collection.handle}
              href={`/collections/${collection.handle}`}
              className="block text-black/70 hover:text-ink"
            >
              {collection.title}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
