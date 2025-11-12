import Image from 'next/image';
import Link from 'next/link';
import type { CollectionCard as ShopifyCollection } from '@/types/shopify';

export const CollectionCard = ({ collection }: { collection: ShopifyCollection }) => {
  return (
    <Link
      href={`/collections/${collection.handle}`}
      className="group flex flex-col gap-4 rounded-3xl border border-black/5 bg-white/70 p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
    >
      {collection.image ? (
        <div className="relative aspect-[3/2] overflow-hidden rounded-2xl bg-parchment">
          <Image
            src={collection.image.url}
            alt={collection.image.altText ?? collection.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition duration-500 group-hover:scale-105"
          />
        </div>
      ) : (
        <div className="aspect-[3/2] rounded-2xl bg-parchment" />
      )}
      <div>
        <p className="text-xs uppercase tracking-[0.25em] text-black/50">Collection</p>
        <h3 className="mt-2 font-display text-2xl text-ink">{collection.title}</h3>
        <p className="mt-1 line-clamp-2 text-sm text-black/70">{collection.description}</p>
      </div>
    </Link>
  );
};
