import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ProductCard } from '@/components/product-card';
import Sidebar from '@/components/nav-bar';
import { getCollectionByHandle } from '@/lib/shopify';

interface CollectionPageProps {
  params: { handle: string };
  searchParams?: { cursor?: string };
}

export async function generateMetadata({ params }: CollectionPageProps): Promise<Metadata> {
  const collection = await getCollectionByHandle(params.handle).catch(() => null);
  if (!collection) {
    return { title: 'Collection not found' };
  }
  return {
    title: `${collection.title} - Collection`,
    description: collection.description
  };
}

export default async function CollectionPage({ params, searchParams }: CollectionPageProps) {
  const data = await getCollectionByHandle(params.handle, searchParams?.cursor);

  if (!data) {
    notFound();
  }

  const { products } = data;
  const { endCursor, hasNextPage } = products.pageInfo;

  return (
    <div className="mx-auto flex max-w-6xl gap-10"> 
      {/* SIDEBAR ON LEFT */}
      <aside className="hidden w-60 shrink-0 border-r border-black/10 pr-6 pt-6 md:block">
        <Sidebar />
      </aside>

      {/* MAIN CONTENT */}
      <div className="flex flex-col flex-1 gap-10">
        <header className="space-y-4">
          <h1 className="font-display text-5xl text-ink">{data.title}</h1>
          {data.description && <p className="text-lg text-black/70">{data.description}</p>}
        </header>

        <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {products.edges.map(({ node }) => (
            <ProductCard key={node.id} product={node} />
          ))}
        </section>

        {hasNextPage && endCursor && (
          <div className="text-center">
            <Link
              href={`/collections/${params.handle}?cursor=${encodeURIComponent(endCursor)}`}
              className="inline-flex items-center rounded-full border border-ink px-6 py-3 text-sm uppercase tracking-[0.3em]"
            >
              Load more
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
