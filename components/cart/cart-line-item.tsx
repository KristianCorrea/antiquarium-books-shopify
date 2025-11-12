'use client';

import Image from 'next/image';
import { useTransition } from 'react';
import { removeCartLineAction, updateCartLineAction } from '@/app/(storefront)/cart/actions';
import { MoneyValue } from '@/components/money';
import type { CartLine } from '@/types/shopify';

export const CartLineItem = ({ line }: { line: CartLine }) => {
  const [isPending, startTransition] = useTransition();
  const quantity = line.quantity;

  return (
    <div className="flex items-center gap-4 rounded-2xl border border-black/5 bg-white/80 p-4">
      {line.merchandise.image && (
        <div className="relative h-24 w-20 overflow-hidden rounded-xl bg-parchment">
          <Image
            src={line.merchandise.image.url}
            alt={line.merchandise.image.altText ?? line.merchandise.title}
            fill
            sizes="96px"
            className="object-cover"
          />
        </div>
      )}
      <div className="flex flex-1 flex-col gap-2">
        <div className="flex items-start justify-between">
          <div>
            <p className="font-display text-xl">{line.merchandise.product.title}</p>
            <p className="text-sm text-black/60">{line.merchandise.title}</p>
          </div>
          <button
            type="button"
            onClick={() => startTransition(() => removeCartLineAction([line.id]))}
            className="text-xs uppercase tracking-[0.3em] text-black/50"
            disabled={isPending}
          >
            Remove
          </button>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-black/20"
            onClick={() =>
              startTransition(() => updateCartLineAction([{ id: line.id, quantity: Math.max(1, quantity - 1) }]))
            }
            disabled={isPending || quantity <= 1}
          >
            -
          </button>
          <span className="text-sm uppercase tracking-[0.3em]">{quantity}</span>
          <button
            type="button"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-black/20"
            onClick={() => startTransition(() => updateCartLineAction([{ id: line.id, quantity: quantity + 1 }]))}
            disabled={isPending}
          >
            +
          </button>
        </div>
      </div>
      <div className="text-right text-lg font-semibold">
        <MoneyValue money={line.merchandise.priceV2 ?? line.cost.subtotalAmount} />
      </div>
    </div>
  );
};
