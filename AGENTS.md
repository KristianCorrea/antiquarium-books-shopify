# Repository Guidelines

## Project Overview

**Atelier Scriptorium Storefront** - A headless Shopify storefront for a vintage book and antiques boutique. Built with Next.js 14 (App Router), TypeScript, Tailwind CSS, and deployed on Vercel. The Shopify Storefront API powers product, collection, and cart flows.

**Key Technologies:**
- Next.js 14.2.5 (App Router)
- React 18.3.1
- TypeScript 5.4.5 (strict mode)
- Tailwind CSS 3.4.4
- Vitest + Testing Library
- Shopify Storefront API (GraphQL)

## Project Structure & Module Organization

### App Router (`app/`)
- `app/(storefront)/` - Route group for public-facing pages:
  - `page.tsx` - Homepage with featured collections and products
  - `about/page.tsx` - About page
  - `cart/page.tsx` - Shopping cart page (server component)
  - `cart/actions.ts` - Server actions for cart operations (`addToCartAction`, `updateCartLineAction`, `removeCartLineAction`)
  - `collections/page.tsx` - Collections listing page
  - `collections/[handle]/page.tsx` - Dynamic collection detail page (uses Shopify collection handles, not generated slugs)
  - `products/[handle]/page.tsx` - Dynamic product detail page
  - `products/_components/` - Client components for product pages:
    - `add-to-cart-button.tsx` - Add to cart button component
    - `product-gallery.tsx` - Product image gallery
  - `search/page.tsx` - Search results page with pagination
- `app/api/search/route.ts` - API route for search (alternative to `predictiveSearch` in lib)
- `app/layout.tsx` - Root layout with SiteHeader and SiteFooter
- `app/globals.css` - Global styles and Tailwind directives

### Components (`components/`)
- **Layout Components:**
  - `site-header.tsx` - Main site header
  - `site-header/shopify-cart-button.tsx` - Cart button component
  - `site-footer.tsx` - Site footer
  - `nav-bar.tsx` - Sidebar navigation (uses `getCollections()` and `collection.handle` for URLs)
- **Product Components:**
  - `product-card.tsx` - Product card component (uses `product.handle` for URLs)
  - `CollectionCarousel.tsx` - Carousel for displaying collections
- **Collection Components:**
  - `collection-card.tsx` - Collection card component (uses `collection.handle` for URLs)
- **Cart Components:**
  - `cart/cart-line-item.tsx` - Individual cart line item
- **Utility Components:**
  - `money.tsx` - Money formatting component (`MoneyValue`)
  - `HeaderSearch.tsx` - Search input component

### Library (`lib/`)
- `shopify.ts` - **Core Shopify integration** (server-only):
  - `shopifyFetch<T>()` - Base GraphQL fetch function with error handling
  - GraphQL fragments: `PRODUCT_CARD`, `COLLECTION_CARD`, `CART_FRAGMENT`
  - **Product Functions:**
    - `getFeaturedContent()` - Featured collections and products for homepage
    - `getProductByHandle(handle: string)` - Get single product by handle
    - `searchProducts(query: string, cursor?: string)` - Search products with pagination
  - **Collection Functions:**
    - `getCollections(limit = 12)` - Get all collections (returns full `CollectionCard` objects with handles)
    - `getCollectionsNames(limit = 12)` - Get collection titles only (legacy, prefer `getCollections()`)
    - `getCollectionByHandle(handle: string, cursor?: string)` - Get collection by handle with paginated products
  - **Search Functions:**
    - `predictiveSearch(query: string)` - Predictive search for products and collections
  - **Cart Functions (GraphQL mutations):**
    - `cartCreate()` - Create new cart
    - `cartQuery(cartId: string)` - Query cart by ID
    - `cartLinesAdd(cartId, lines)` - Add items to cart
    - `cartLinesUpdate(cartId, lines)` - Update cart line quantities
    - `cartLinesRemove(cartId, lineIds)` - Remove items from cart
- `cart.ts` - **Cart management** (server-only):
  - Cookie-based cart persistence (`atelier_cart_id`, 30-day expiry)
  - `getCart()` - Get current cart from cookie
  - `addLines({ merchandiseId, quantity })` - Add items to cart
  - `updateLines(lines)` - Update cart line quantities
  - `removeLines(lineIds)` - Remove items from cart
- `site-config.ts` - Site configuration (name, description, navigation, metadata)

### Types (`types/`)
- `shopify.ts` - TypeScript types for Shopify data:
  - `Money`, `Image`, `ProductCard`, `ProductVariant`
  - `CollectionCard`, `CartLine`, `Cart`
  - `ShopifyResponse<T>`

### Tests (`tests/`)
- `components/money.test.tsx` - Money component tests
- `mocks/` - MSW handlers for Shopify API mocking (currently empty)
- `contracts/`, `e2e/`, `features/` - Test directories (structure in place)

## Critical Implementation Details

### ⚠️ Shopify Handles vs Generated Slugs

**IMPORTANT:** Always use Shopify collection/product handles directly, never generate slugs from titles.

- ✅ **Correct:** Use `collection.handle` or `product.handle` for URLs
- ❌ **Incorrect:** Generating slugs from titles (e.g., "Home page" → "home-page" when handle is "frontpage")

**Why:** Shopify handles are set in Shopify admin and may differ from titles. The route handler `getCollectionByHandle()` expects the actual Shopify handle, not a generated slug. Using generated slugs causes 404 errors.

**Example:**
```tsx
// ✅ Correct (nav-bar.tsx, collection-card.tsx)
href={`/collections/${collection.handle}`}

// ❌ Incorrect (old implementation)
const slug = title.toLowerCase().replace(/\s+/g, "-");
href={`/collections/${slug}`}
```

### Route Parameters

- Collection routes: `/collections/[handle]` - `handle` is the Shopify collection handle
- Product routes: `/products/[handle]` - `handle` is the Shopify product handle
- Search routes: `/search?q=query&cursor=...` - Query string with optional cursor for pagination

### Server Components vs Client Components

- **Server Components (default):** All pages, most components. Fetch Shopify data directly.
- **Client Components:** Interactive components in `_components/` folders (e.g., `products/_components/add-to-cart-button.tsx`)
- Mark Client Components with `'use client'` directive

### Cart Management

- Cart ID stored in HTTP-only cookie: `atelier_cart_id` (30-day expiry)
- Server actions in `app/(storefront)/cart/actions.ts` use `revalidateTag('cart')` for cache invalidation
- Cart operations are server-only (via `lib/cart.ts`)

### GraphQL Fragments

Reusable fragments defined in `lib/shopify.ts`:
- `PRODUCT_CARD` - Product fields for cards
- `COLLECTION_CARD` - Collection fields for cards
- `CART_FRAGMENT` - Complete cart structure

### Caching Strategy

- Collections: `revalidate: 300, tags: ['collections']` (5-minute cache)
- Products: `cache: 'no-store'` (always fresh)
- Cart: `cache: 'no-store'` (always fresh)
- Search: `cache: 'no-store'` (always fresh)

## Build, Test, and Development Commands

- `npm run dev` - Next.js dev server on `localhost:3000`
- `npm run build` - Production build
- `npm run start` - Start production server (after build)
- `npm run lint` - ESLint with Next.js config (`next/core-web-vitals`)
- `npm run type-check` - TypeScript type checking (`tsc --noEmit`)
- `npm run test` - Run Vitest test suite
- `npm run test:watch` - Run Vitest in watch mode
- `npm run test:coverage` - Generate test coverage report (target: >=80%)

## Environment Variables

Required environment variables (set in `.env.local` for local dev, Vercel env vars for production):

```bash
SHOPIFY_STORE_DOMAIN=atelier-scriptorium.myshopify.com
SHOPIFY_STOREFRONT_API_VERSION=2024-04
SHOPIFY_STOREFRONT_ACCESS_TOKEN=xxx
```

**Security:** Never expose `SHOPIFY_STOREFRONT_ACCESS_TOKEN` client-side. All Shopify calls must be server-only (files marked with `'server-only'`).

## Coding Style & Naming Conventions

- **TypeScript:** Strict mode enabled, 2-space indent, single quotes
- **Path Alias:** Use `@/*` for imports (e.g., `@/components/product-card`)
- **Components:** PascalCase filenames (`ProductCard.tsx`)
- **Hooks/Utilities:** camelCase exports, kebab-case filenames (`use-cart.ts`)
- **Server Components:** Default - fetch Shopify data directly
- **Client Components:** Place in `_components/` folders, mark with `'use client'`
- **Formatting:** Run `npm run lint -- --fix` before committing

## Testing Guidelines

- **Test Location:** `tests/` mirrors the structure it covers
- **Framework:** Vitest + Testing Library
- **Setup:** `vitest.setup.ts` configures `jest-dom` matchers
- **Naming:** Favor behavior-led test names (e.g., "renders USD price")
- **Structure:** Use Arrange/Act/Assert comment fences for longer specs
- **Coverage:** Gate refactors with `npm run test:coverage` (target >=80%)
- **Mocking:** Use MSW handlers in `tests/mocks/` for Shopify API stubs

## Commit & Pull Request Guidelines

- **Format:** Follow Conventional Commits (`feat:`, `fix:`, `chore:`, etc.) with <=72-character subjects
- **PR Requirements:**
  - Link to issue (`Closes #123`)
  - Include screenshots/CLI output for UX changes
  - Confirm `lint`, `test`, and `type-check` all pass locally
- **Merging:** Squash-merge by default; group commits by concern (implementation, tests, docs) if multiple remain
- **Size:** Keep PRs under ~400 lines; coordinate work by directory

## Security & Collaboration Notes

- **Secrets:** Keep Shopify secrets in `.env.local`/Vercel env vars
- **Server-Only:** All Shopify calls must be server-only (`lib/shopify.ts`, `lib/cart.ts`, server actions, Route Handlers)
- **Logging:** Redact cart IDs or customer details before logging
- **Documentation:** Capture notable decisions in `docs/decisions/<issue-id>.md`
- **TODOs:** Leave TODOs with owner handles (`// TODO(@agent-b): predictive search filters`)

## Deployment

- **Platform:** Vercel (automatic Next.js optimizations)
- **Environment Variables:** Set per environment in Vercel dashboard
- **Cache Tags:** Enable Edge Network cache tags (`cart`, `collections`, `products`) for Incremental Cache revalidation
- **Image Optimization:** Next.js Image component configured for `*.cdn.shopify.com` domains

## Common Issues & Solutions

### 404 Errors on Collection Pages
- **Cause:** Using generated slugs instead of Shopify handles
- **Solution:** Always use `collection.handle` from `getCollections()` or `CollectionCard` objects

### Cart Not Persisting
- **Cause:** Cookie settings or cart ID not being saved
- **Solution:** Check `lib/cart.ts` cookie configuration (httpOnly, sameSite, secure, maxAge)

### Type Errors with Shopify Data
- **Cause:** Type definitions in `types/shopify.ts` may be incomplete
- **Solution:** Update types to match actual Shopify Storefront API response structure

### Search Not Working
- **Cause:** Multiple search implementations (`/api/search/route.ts` vs `lib/shopify.ts` functions)
- **Solution:** Use `searchProducts()` from `lib/shopify.ts` for consistency, or `predictiveSearch()` for autocomplete

## Additional Context

### Shopify Metafields
Products include metafields for:
- `details.author` - Book author
- `details.year` - Publication year
- `details.condition` - Item condition
- `details.signed` - Whether item is signed

These are queried in the `PRODUCT_CARD` fragment and available on `ProductCard` type.

### Tailwind Theme
Custom colors defined in `tailwind.config.ts`:
- `parchment: #F2E8CF` - Background color
- `ink: #241C15` - Text color
- `patina: #3E6259` - Accent color

Custom fonts:
- `display: "Cormorant Garamond"` - Serif for headings
- `body: "Inter"` - Sans-serif for body text

### Next.js Configuration
- Server actions body size limit: 2mb
- Image optimization: Configured for Shopify CDN domains
- TypeScript: Strict mode, incremental compilation enabled
