import { ProductCard } from '@/components/product-card';
import { searchProducts } from '@/lib/shopify';

interface SearchPageProps {
  searchParams?: { q?: string; cursor?: string };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const query = searchParams?.q?.trim() ?? '';
  const cursor = searchParams?.cursor;
  const results = query ? await searchProducts(query, cursor) : null;

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8">
      <header className="space-y-4 text-center">
      </header>
      {query && !results?.nodes.length && <p className="text-center text-black/60">No items match "{query}".</p>}
      {results?.nodes.length ? (
        <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {results.nodes.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </section>
      ) : null}
      {results?.pageInfo.hasNextPage && results.pageInfo.endCursor && (
        <form className="mx-auto">
          <input type="hidden" name="q" value={query} />
          <input type="hidden" name="cursor" value={results.pageInfo.endCursor} />
          <button className="rounded-full border border-ink px-6 py-3 text-sm uppercase tracking-[0.3em]">Load more</button>
        </form>
      )}
    </div>
  );
}
