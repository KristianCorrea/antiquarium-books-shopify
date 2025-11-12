# Atelier Scriptorium Storefront

A headless Shopify storefront for a vintage book and antiques boutique. Built with Next.js (App Router), TypeScript, and Tailwind CSS, deployed on Vercel. Shopify Storefront API powers product, collection, and cart flows.

## Getting Started

```bash
npm install
npm run dev
```

Set environment variables in `.env.local` (see `.env.example`). The Storefront access token must never run in the browser-keep all Shopify calls on the server.

## Key Paths

- `app/` - App Router pages. Server Components consume Shopify data; Client Components handle interactivity (cart quantity, add-to-cart button).
- `lib/shopify.ts` - strongly typed GraphQL queries/mutations plus cart helpers in `lib/cart.ts`.
- `components/` - UI primitives like `ProductCard`, `CollectionCard`, and cart/search widgets.
- `tests/` - Vitest + Testing Library suites for UI primitives and helper logic.

## Shopify Requirements

Define these secrets in your Vercel project or `.env.local`:

```
SHOPIFY_STORE_DOMAIN=atelier-scriptorium.myshopify.com
SHOPIFY_STOREFRONT_API_VERSION=2024-04
SHOPIFY_STOREFRONT_ACCESS_TOKEN=xxx
```

## Scripts

- `npm run dev` - local development
- `npm run build` - production build
- `npm run test` - Vitest suite
- `npm run lint` - Next.js lint rules
- `npm run test:coverage` - coverage report for CI gates

## Deployment

Deploy via Vercel for automatic Next.js optimizations. Set environment variables per environment and enable the Edge Network cache tags (`cart`, `collections`, `products`) if using Incremental Cache revalidation.
