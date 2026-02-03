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

  // Extract valid metafields for display
  const validMetafields = product.metafields?.filter(
    (field): field is NonNullable<typeof field> => 
      field != null && field.value != null && field.value.trim() !== ''
  ) ?? [];

  return (
    <div className="mx-auto max-w-7xl">
      {/* Main product section */}
      <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
        {/* Left: Image Gallery */}
        <div className="min-w-0">
          <ProductGallery images={images} productTitle={product.title} />
        </div>

        {/* Right: Product Info Sidebar */}
        <div className="space-y-6">
          

          {/* Product Info Card */}
          <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
            {/* Title */}
            <div className="pb-5">
              <h1 className="font-display text-3xl leading-tight 1 text-ink lg:text-3xl">
                {product.title}
              </h1>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-ink">
                <MoneyValue money={priceMoney} />
              </span>
            </div>

            {/* Availability */}
            <div className="mt-4">
              {primaryVariant && primaryVariant.availableForSale ? (
                <div className="flex items-center gap-2 text-sm text-green-700">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="font-medium">Available</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-sm text-red-700">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <span className="font-medium">Currently unavailable</span>
                </div>
              )}
            </div>

            {/* Add to Cart Button */}
            {primaryVariant && primaryVariant.availableForSale && (
              <div className="mt-6">
                <AddToCartButton variantId={primaryVariant.id} />
              </div>
            )}
          </div>

          {/* Item Details Card */}
          {validMetafields.length > 0 && (
            <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-black/60">
                Item Details
              </h2>
              <dl className="space-y-3">
                {validMetafields.map((field) => (
                  <div key={field.key} className="flex justify-between border-b border-black/5 pb-3 last:border-0 last:pb-0">
                    <dt className="text-sm text-black/60">
                      {field.key.charAt(0).toUpperCase() + field.key.slice(1).replace(/_/g, ' ')}
                    </dt>
                    <dd className="text-sm font-medium text-ink">{field.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}

        
          
        </div>
      </div>

      {/* Description Section - Full Width at Bottom */}
      <div className="mt-12 rounded-2xl border border-black/10 bg-white p-8 shadow-sm">
        <h2 className="mb-6 text-2xl font-display font-semibold text-ink">
          Description
        </h2>
        <div 
          className="prose prose-neutral max-w-none prose-headings:font-display prose-headings:text-ink prose-p:text-black/80 prose-a:text-patina prose-strong:text-ink"
          dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
        />
      </div>
    </div>
  );
}
