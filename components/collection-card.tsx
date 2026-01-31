'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { CollectionCard as ShopifyCollection } from '@/types/shopify';

export const CollectionCard = ({ collection }: { collection: ShopifyCollection }) => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <Link
      href={`/collections/${collection.handle}`}
      className="group flex flex-col gap-4 rounded-3xl border border-black/5 bg-white/70 p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
    >
      {collection.image ? (
        <div className="relative aspect-[3/2] overflow-hidden rounded-2xl bg-parchment">
          {/* Shimmer placeholder */}
          {isLoading && (
            <div className="absolute inset-0 bg-gradient-to-r from-parchment via-parchment/80 to-parchment">
              <div className="h-full w-full bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
            </div>
          )}
          <Image
            src={collection.image.url}
            alt={collection.image.altText ?? collection.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className={`object-cover transition-all duration-500 group-hover:scale-105 ${
              isLoading ? 'opacity-0' : 'opacity-100'
            }`}
            onLoad={() => setIsLoading(false)}
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
