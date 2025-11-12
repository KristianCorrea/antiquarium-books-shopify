import 'server-only';

import { cookies } from 'next/headers';
import { cartCreate, cartLinesAdd, cartLinesRemove, cartLinesUpdate, cartQuery } from '@/lib/shopify';

const CART_COOKIE = 'atelier_cart_id';
const CART_MAX_AGE_SECONDS = 60 * 60 * 24 * 30; // 30 days

function getCartIdFromCookie() {
  return cookies().get(CART_COOKIE)?.value;
}

function persistCartId(cartId: string) {
  cookies().set(CART_COOKIE, cartId, {
    httpOnly: true,
    sameSite: 'lax',
    secure: true,
    path: '/',
    maxAge: CART_MAX_AGE_SECONDS
  });
}

function clearCartCookie() {
  cookies().delete(CART_COOKIE);
}

export async function getCart() {
  const cartId = getCartIdFromCookie();
  if (!cartId) return null;

  try {
    return await cartQuery(cartId);
  } catch (error) {
    clearCartCookie();
    console.error('Failed to load cart, clearing cookie', error);
    return null;
  }
}

async function getOrCreateCartId() {
  const existing = getCartIdFromCookie();
  if (existing) return existing;

  const cart = await cartCreate();
  persistCartId(cart.id);
  return cart.id;
}

export async function addLines({
  merchandiseId,
  quantity
}: {
  merchandiseId: string;
  quantity: number;
}) {
  const cartId = await getOrCreateCartId();
  const cart = await cartLinesAdd(cartId, [{ merchandiseId, quantity }]);
  persistCartId(cart.id);
  return cart;
}

export async function updateLines(lines: Array<{ id: string; quantity: number }>) {
  const cartId = getCartIdFromCookie();
  if (!cartId) return null;
  const cart = await cartLinesUpdate(cartId, lines);
  persistCartId(cart.id);
  return cart;
}

export async function removeLines(lineIds: string[]) {
  const cartId = getCartIdFromCookie();
  if (!cartId) return null;
  const cart = await cartLinesRemove(cartId, lineIds);
  persistCartId(cart.id);
  return cart;
}
