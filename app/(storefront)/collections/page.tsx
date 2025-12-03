import { CollectionCard } from '@/components/collection-card';
import { getCollections } from '@/lib/shopify';
import { getFeaturedContent } from '@/lib/shopify';
import { ProductCard } from '@/components/product-card';
import Sidebar from "@/components/nav-bar";
import Link from "next/link";

export default async function CollectionsPage() {
  const {products } = await getFeaturedContent();

  return (
    <div className="mx-auto flex max-w-6xl gap-8">
      {/* --- SIDEBAR COMPONENT --- */}
      <aside className="hidden w-60 shrink-0 border-r border-black/10 pr-6 pt-6 md:block">
        <Sidebar />
      </aside>

      {/* --- MAIN CONTENT --- */}
      <div className="flex flex-1 flex-col gap-8">
        <header className="space-y-4 text-center md:text-left">
          <h1 className="font-display text-5xl text-ink">Newest Products</h1>
        </header>

        <section className="grid gap-6 md:grid-cols-3">
          {products.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
        </section>
      </div>
    </div>
  );
}
