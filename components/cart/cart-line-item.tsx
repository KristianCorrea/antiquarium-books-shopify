'use client';

import Image from 'next/image';
import { useTransition } from 'react';
import {
  removeCartLineAction,
  updateCartLineAction,
} from '@/app/(storefront)/cart/actions';
import { MoneyValue } from '@/components/money';
import type { CartLine } from '@/types/shopify';

export const CartLineItem = ({ line }: { line: CartLine }) => {
  const [isPending, startTransition] = useTransition();
  const quantity = line.quantity;

  const handleDecrement = () => {
    startTransition(() => {
      if (quantity <= 1) {
        removeCartLineAction([line.id]);
      } else {
        updateCartLineAction([
          { id: line.id, quantity: quantity - 1 },
        ]);
      }
    });
  };

  const handleIncrement = () => {
    startTransition(() =>
      updateCartLineAction([
        { id: line.id, quantity: quantity + 1 },
      ])
    );
  };

  return (
    <div className="group flex items-center gap-5 rounded-2xl border border-black/5 bg-white/70 p-5 shadow-sm backdrop-blur transition hover:shadow-md">
      {/* IMAGE */}
      {line.merchandise.image && (
        <div className="relative h-24 w-20 shrink-0 overflow-hidden rounded-xl bg-parchment">
          <Image
            src={line.merchandise.image.url}
            alt={line.merchandise.image.altText ?? line.merchandise.title}
            fill
            sizes="96px"
            className="object-cover transition group-hover:scale-105"
          />
        </div>
      )}

      {/* DETAILS */}
      <div className="flex flex-1 flex-col gap-3">
        <div className="flex items-start justify-between gap-4">
          <p className="font-display text-lg leading-tight">
            {line.merchandise.product.title}
          </p>
        </div>

        {/* QUANTITY */}
        <div className="flex items-center gap-4">
          <div className="flex items-center rounded-full border border-black/10 bg-white">
            <button
              type="button"
              onClick={handleDecrement}
              disabled={isPending}
              className="flex h-8 w-8 items-center justify-center rounded-full text-lg transition hover:bg-black/5 disabled:opacity-30"
            >
              –
            </button>

            <span className="min-w-[2ch] text-center text-xs uppercase tracking-[0.35em]">
              {quantity}
            </span>

            <button
              type="button"
              onClick={handleIncrement}
              disabled={isPending}
              className="flex h-8 w-8 items-center justify-center rounded-full text-lg transition hover:bg-black/5 disabled:opacity-30"
            >
              +
            </button>
          </div>
        </div>
      </div>

      {/* PRICE */}
      <div className="text-right">
        <div className="font-display text-xl">
          <MoneyValue
            money={line.merchandise.priceV2 ?? line.cost.subtotalAmount}
          />
        </div>
      </div>
    </div>
  );
};
