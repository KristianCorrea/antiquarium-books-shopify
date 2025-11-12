'use client';

import { useState, useTransition } from 'react';
import { addToCartAction } from '@/app/(storefront)/cart/actions';

interface AddToCartButtonProps {
  variantId: string;
}

export const AddToCartButton = ({ variantId }: AddToCartButtonProps) => {
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<'idle' | 'added'>('idle');

  return (
    <button
      type="button"
      onClick={() => {
        startTransition(async () => {
          await addToCartAction({ merchandiseId: variantId, quantity: 1 });
          setStatus('added');
          setTimeout(() => setStatus('idle'), 2500);
        });
      }}
      className="button-glow inline-flex items-center justify-center rounded-full bg-ink px-8 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-white disabled:cursor-not-allowed disabled:opacity-60"
      disabled={isPending}
    >
      {isPending ? 'Adding...' : status === 'added' ? 'Added' : 'Add to cart'}
    </button>
  );
};
