'use server';

import { revalidateTag } from 'next/cache';
import { addLines, removeLines, updateLines } from '@/lib/cart';

export async function addToCartAction(input: { merchandiseId: string; quantity?: number }) {
  await addLines({ merchandiseId: input.merchandiseId, quantity: input.quantity ?? 1 });
  revalidateTag('cart');
}

export async function updateCartLineAction(lines: Array<{ id: string; quantity: number }>) {
  await updateLines(lines);
  revalidateTag('cart');
}

export async function removeCartLineAction(lineIds: string[]) {
  await removeLines(lineIds);
  revalidateTag('cart');
}
