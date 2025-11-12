import Link from 'next/link';
import { siteConfig } from '@/lib/site-config';
import { ShopifyCartButton } from '@/components/site-header/shopify-cart-button';

export const SiteHeader = async () => {
  return (
    <header className="sticky top-0 z-30 border-b border-black/5 bg-parchment/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <Link href="/" className="font-display text-2xl tracking-tight">
          Atelier Scriptorium
        </Link>
        <nav className="hidden gap-6 text-sm uppercase tracking-widest text-black/70 sm:flex">
          {siteConfig.navigation.map((navItem) => (
            <Link key={navItem.href} href={navItem.href} className="hover:text-ink">
              {navItem.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <Link
            href="/search"
            className="rounded-full border border-black/10 px-4 py-2 text-sm text-black/70 transition hover:border-black hover:text-ink"
          >
            Search
          </Link>
          <ShopifyCartButton />
        </div>
      </div>
    </header>
  );
};
