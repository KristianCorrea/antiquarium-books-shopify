import { CollectionCard } from '@/components/collection-card';
import { getCollections } from '@/lib/shopify';

export default async function CollectionsPage() {
  const collections = await getCollections(24);

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8">
      <header className="space-y-4 text-center">
        <p className="text-xs uppercase tracking-[0.5em] text-black/50">Collections</p>
        <h1 className="font-display text-5xl text-ink">Shop by narrative</h1>
        <p className="text-lg text-black/70">Browse cataloged sets arranged by provenance, movement, or medium.</p>
      </header>
      <section className="grid gap-6 md:grid-cols-2">
        {collections.map((collection) => (
          <CollectionCard key={collection.id} collection={collection} />
        ))}
      </section>
    </div>
  );
}
