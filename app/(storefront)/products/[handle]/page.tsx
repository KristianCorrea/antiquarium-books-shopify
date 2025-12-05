import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { MoneyValue } from '@/components/money';
import { AddToCartButton } from '@/app/(storefront)/products/_components/add-to-cart-button';
import { ProductGallery } from '@/app/(storefront)/products/_components/product-gallery';
import { getProductByHandle } from '@/lib/shopify';

interface ProductPageProps {
  params: { handle: string };
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const product = await getProductByHandle(params.handle).catch(() => null);
  if (!product) return { title: 'Product not found' };
  return {
    title: product.seo?.title ?? product.title,
    description: product.seo?.description ?? product.description
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await getProductByHandle(params.handle).catch(() => null);

  if (!product) {
    notFound();
  }

  const primaryVariant = product.variants.nodes[0];
  const priceMoney = primaryVariant?.price ?? product.priceRange.minVariantPrice;

  // Extract images from media edges
  const images = product.media.edges
    .map(({ node }) => node.image)
    .filter((img): img is NonNullable<typeof img> => img != null);

  return (
    <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1.2fr_0.8fr]">
      <div>
        <ProductGallery images={images} productTitle={product.title} />
      </div>
      <div className="space-y-6">
        <div>
          <p className="text-xs uppercase tracking-[0.5em] text-black/50">Vintage find</p>
          <h1 className="font-display text-5xl text-ink">{product.title}</h1>
          <div className="mt-3 text-2xl font-medium text-ink">
            <MoneyValue money={priceMoney} />
          </div>
        </div>
        <div className="prose prose-neutral" dangerouslySetInnerHTML={{ __html: product.descriptionHtml }} />
        {primaryVariant && primaryVariant.availableForSale ? (
          <AddToCartButton variantId={primaryVariant.id} />
        ) : (
          <p className="text-sm uppercase tracking-[0.3em] text-red-700">Currently unavailable</p>
        )}
        {!!product.metafields?.length && (
          <dl className="grid grid-cols-2 gap-4 rounded-3xl bg-white/70 p-6 text-sm">
            {product.metafields.map((field) =>
              field?.value ? (
                <div key={field.key}>
                  <dt className="uppercase tracking-[0.3em] text-black/40">{field.key}</dt>
                  <dd className="text-ink">{field.value}</dd>
                </div>
              ) : null
            )}
          </dl>
        )}
      </div>
    </div>
  );
}
