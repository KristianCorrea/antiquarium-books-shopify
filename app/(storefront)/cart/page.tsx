import Link from 'next/link';
import { CartLineItem } from '@/components/cart/cart-line-item';
import { MoneyValue } from '@/components/money';
import { getCart } from '@/lib/cart';

export default async function CartPage() {
  const cart = await getCart();

  if (!cart || cart.totalQuantity === 0) {
    return (
      <div className="mx-auto flex max-w-4xl flex-col items-center gap-6 text-center">
        <h1 className="font-display text-5xl text-ink">
          Your cart is empty — let’s find something special.
        </h1>

        <Link
          href="/collections"
          className="button-glow rounded-full bg-ink px-8 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-white"
        >
          Browse collections
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[3fr_1fr]">
      {/* CART ITEMS */}
      <div className="space-y-4">
        <p className="text-xs uppercase tracking-[0.5em] text-black/50">
          Cart
        </p>

        <div className="space-y-4">
          {cart.lines.edges.map(({ node }) => (
            <CartLineItem key={node.id} line={node} />
          ))}
        </div>
      </div>

      {/* ORDER SUMMARY */}
      <aside className="sticky top-24 self-start space-y-4 rounded-3xl border border-black/10 bg-white/70 p-6">
        <h2 className="text-sm uppercase tracking-[0.4em] text-black/50">
          Order summary
        </h2>

        <div className="flex items-center justify-between text-lg">
          <span>Subtotal</span>
          <MoneyValue money={cart.cost.subtotalAmount} />
        </div>

        <p className="text-xs text-black/60">
          Taxes and insured shipping are calculated during Shopify checkout.
        </p>

        <a
          href={cart.checkoutUrl}
          className="button-glow block rounded-full bg-ink px-6 py-3 text-center text-sm font-semibold uppercase tracking-[0.3em] text-white"
        >
          Proceed to checkout
        </a>
      </aside>
    </div>
  );
}
