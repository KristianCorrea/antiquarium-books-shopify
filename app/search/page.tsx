import { ProductCard } from '@/components/product-card';
import { searchProducts } from '@/lib/shopify';
import Sidebar from "@/components/nav-bar";
import Link from "next/link";

interface SearchPageProps {
  searchParams?: { q?: string; cursor?: string };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const query = searchParams?.q?.trim() ?? '';
  const cursor = searchParams?.cursor;
  const results = query ? await searchProducts(query, cursor) : null;

  return (
    <div className="mx-auto flex max-w-6xl gap-8">
      
      {/* --- SIDEBAR --- */}
      <aside className="hidden w-60 shrink-0 border-r border-black/10 pr-6 pt-6 md:block">
        <Sidebar />
      </aside>

      {/* --- MAIN CONTENT --- */}
      <div className="flex flex-1 flex-col gap-8">
        
        {/* HEADER */}
        <header className="space-y-4 text-center md:text-left">
          <p className="text-xs uppercase tracking-[0.5em] text-black/50">Search</p>

          {query ? (
            <h1 className="font-display text-5xl text-ink">
              Results for “{query}”
            </h1>
          ) : (
            <h1 className="font-display text-5xl text-ink">Search</h1>
          )}
        </header>

        {/* NO RESULTS */}
        {query && !results?.nodes.length && (
          <p className="text-black/60 text-lg">No items match “{query}”.</p>
        )}

        {/* RESULTS GRID */}
        {results?.nodes.length ? (
          <section className="grid gap-6 md:grid-cols-3">
            {results.nodes.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </section>
        ) : null}

        {/* LOAD MORE */}
        {results?.pageInfo.hasNextPage && results.pageInfo.endCursor && (
          <form className="mx-auto md:mx-0">
            <input type="hidden" name="q" value={query} />
            <input type="hidden" name="cursor" value={results.pageInfo.endCursor} />
            <button className="rounded-full border border-ink px-6 py-3 text-sm uppercase tracking-[0.3em]">
              Load more
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
