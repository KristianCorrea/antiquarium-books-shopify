import { CollectionCard } from '@/components/collection-card';
import { getCollections } from '@/lib/shopify';
import Sidebar from "@/components/nav-bar";
import Link from "next/link";

export default async function CollectionsPage() {
  const collections = await getCollections(24);

  return (
    <div className="mx-auto flex max-w-6xl gap-8">
      {/* --- SIDEBAR COMPONENT --- */}
      <aside className="hidden w-60 shrink-0 border-r border-black/10 pr-6 pt-6 md:block">
        <Sidebar />
      </aside>

      {/* --- MAIN CONTENT --- */}
      <div className="flex flex-1 flex-col gap-8">
        <header className="space-y-4 text-center md:text-left">
          <p className="text-xs uppercase tracking-[0.5em] text-black/50">Products</p>
          <h1 className="font-display text-5xl text-ink">Shop by Categories</h1>
        </header>

        <section className="grid gap-6 md:grid-cols-2">
          {collections.map((collection) => (
            <CollectionCard key={collection.id} collection={collection} />
          ))}
        </section>
      </div>
    </div>
  );
}
