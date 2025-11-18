import { CollectionCard } from '@/components/collection-card';
import { getCollections } from '@/lib/shopify';
import Link from "next/link";

export default async function CollectionsPage() {
  const collections = await getCollections(24);

  return (
    <div className="mx-auto flex max-w-6xl gap-8">
      {/* --- SIDEBAR --- */}
      <aside className="hidden w-60 shrink-0 space-y-6 border-r border-black/10 pr-6 pt-6 md:block">
        <h2 className="text-sm uppercase tracking-[0.3em] text-black/50">Categories</h2>

        <nav className="space-y-3 text-sm">

  <Link href="/collections/antiquarian-books" className="block w-full text-left text-black/70 hover:text-ink">
    Antiquarian Books
  </Link>

  <Link href="/collections/antiquarian-music" className="block w-full text-left text-black/70 hover:text-ink">
    Antiquarian Music
  </Link>

  <Link href="/collections/other-autographs" className="block w-full text-left text-black/70 hover:text-ink">
    Other Autographs
  </Link>

  <Link href="/collections/art-and-prints" className="block w-full text-left text-black/70 hover:text-ink">
    Art and Prints
  </Link>

  <Link href="/collections/animation-and-manga" className="block w-full text-left text-black/70 hover:text-ink">
    Animation and Manga
  </Link>

  <Link href="/collections/other-collections" className="block w-full text-left text-black/70 hover:text-ink">
    Other Collections
  </Link>

</nav>

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
