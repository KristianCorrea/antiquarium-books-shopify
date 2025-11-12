import Link from 'next/link';
import { getCart } from '@/lib/cart';

export const ShopifyCartButton = async () => {
  const cart = await getCart();
  const quantity = cart?.totalQuantity ?? 0;

  return (
    <Link
      href="/cart"
      className="relative rounded-full bg-ink px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-ink/30 transition hover:-translate-y-0.5"
    >
      Cart
      <span className="absolute -right-2 -top-2 inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-patina text-xs text-white">
        {quantity}
      </span>
    </Link>
  );
};
