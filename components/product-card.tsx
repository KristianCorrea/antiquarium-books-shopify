import Image from 'next/image';
import Link from 'next/link';
import { MoneyValue } from '@/components/money';
import type { ProductCard as ProductCardType } from '@/types/shopify';

export const ProductCard = ({ product }: { product: ProductCardType }) => {
  const author = product.metafields?.find((field) => field?.key === 'author')?.value;
  const year = product.metafields?.find((field) => field?.key === 'year')?.value;
  const condition = product.metafields?.find((field) => field?.key === 'condition')?.value;

  return (
    <Link
      href={`/products/${product.handle}`}
      className="group flex flex-col gap-3 rounded-3xl border border-black/5 bg-white/80 p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
    >
      {product.featuredImage ? (
        <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-parchment">
          <Image
            src={product.featuredImage.url}
            alt={product.featuredImage.altText ?? product.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition duration-500 group-hover:scale-105"
          />
        </div>
      ) : (
        <div className="aspect-[4/5] rounded-2xl bg-parchment" />
      )}
      <div className="flex flex-col gap-2">
        <div className="text-xs uppercase tracking-[0.25em] text-black/50">
          {year ? `Circa ${year}` : 'Vintage'} - {condition ?? 'Fine'}
        </div>
        <h3 className="font-display text-2xl leading-tight text-ink line-clamp-2">{product.title}</h3>
        {author && <p className="text-sm text-black/70">by {author}</p>}
        <div className="mt-2 text-lg font-semibold text-ink">
          <MoneyValue money={product.priceRange.minVariantPrice} />
          {product.priceRange.maxVariantPrice.amount !== product.priceRange.minVariantPrice.amount && (
            <>
              {' '}
              - <MoneyValue money={product.priceRange.maxVariantPrice} />
            </>
          )}
        </div>
      </div>
    </Link>
  );
};
