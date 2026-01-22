import Link from "next/link";
import { CollectionCard } from "@/components/collection-card";
import { ProductCard } from "@/components/product-card";
import CollectionCarousel from "@/components/CollectionCarousel";
import { getFeaturedContent } from "@/lib/shopify";

export default async function HomePage() {
  const { collections, products, featured } = await getFeaturedContent();

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-16">
      <section className="grid gap-10 lg:grid-cols-2 lg:items-center">
        <div className="space-y-6">
          <p className="text-xs uppercase tracking-[0.5em] text-black/50">Curated for bibliophiles</p>
          <h1 className="font-display text-5xl leading-tight text-ink">
            Museum-grade rarities, elegantly merchandised for modern collectors.
          </h1>
          <p className="text-lg text-black/70">
            Every folio, map, and objet d'art is authenticated, restored by conservators, and documented with
            provenance notes ready for appraisal.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/collections"
              className="button-glow inline-flex items-center rounded-full bg-ink px-6 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-white"
            >
              Browse Collections
            </Link>
          </div>
        </div>
      </section>

       {/* COLLECTIONS CAROUSEL */}
      <section className="space-y-6">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="font-display text-4xl text-ink">Collections</h2>
          </div>
          <Link
            href="/collections"
            className="text-sm uppercase tracking-[0.3em] text-ink"
          >
            View all
          </Link>
        </div>

        <CollectionCarousel collections={collections} />
      </section>

       {/* Features */}
      <section className="space-y-6">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="font-display text-4xl text-ink">Featured Items</h2>
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Recent Arrivals */}
      <section className="space-y-6">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="font-display text-4xl text-ink">Recent arrivals</h2>
          </div>
          <Link href="/search" className="text-sm uppercase tracking-[0.3em] text-ink">
            Search catalog
          </Link>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}
