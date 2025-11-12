# Repository Guidelines

## Project Structure & Module Organization
- `app/` is the App Router surface; organize by route groups (`app/(storefront)/cart`, `products`, `collections`) and keep loading/error states beside each segment.
- `components/` houses shared UI such as cards, layout chrome, and cart/search widgets. Stash feature-specific bits under subfolders (`components/cart`).
- `lib/` hosts server-only helpers. `lib/shopify.ts` centralizes Storefront GraphQL work, `lib/cart.ts` manages cookies/carts, and shared config/types live beside them.
- `tests/` mirrors the modules you verify (`tests/components/money.test.tsx`, `tests/lib/shopify.test.ts`). Keep MSW handlers under `tests/mocks/` when you need to stub Shopify; place static assets in `public/`.

## Build, Test, and Development Commands
- `npm run dev` - Next.js dev server on `localhost:3000`.
- `npm run build` / `npm start` - production bundle + preview (CI + Vercel).
- `npm run lint` / `npm run type-check` - ESLint (`next/core-web-vitals`) plus `tsc --noEmit` for server actions.
- `npm run test`, `npm run test:watch`, `npm run test:coverage` - Vitest + Testing Library suites; keep coverage >=80%.

## Coding Style & Naming Conventions
- TypeScript strict mode, 2-space indent, single quotes, and path alias `@/*`. Prefer Server Components for Shopify data and move interactivity into Client Components under `_components/` folders.
- Components/files use PascalCase (`ProductGallery.tsx`), hooks/utilities use camelCase exports and kebab-case filenames (`use-cart.ts`).
- Run `npm run lint -- --fix` before pushing so formatting noise ships with its originating change.

## Testing Guidelines
- Specs live in `tests/` and mirror the structure they cover. Use Vitest + Testing Library with `vitest.setup.ts` for `jest-dom`.
- Favor behavior-led names ("renders USD price"), keep Arrange/Act/Assert comment fences on longer specs, and gate refactors with `npm run test:coverage`.

## Commit & Pull Request Guidelines
- Follow Conventional Commits (`feat: add cart server actions`, `chore: tune tailwind palette`) with <=72-character subjects.
- Every PR links an issue (`Closes #123`), shows screenshots or CLI output for UX changes, and confirms `lint`, `test`, and `type-check` all passed locally.
- Squash-merge by default; if multiple commits remain, group by concern (implementation, tests, docs) for easier review.

## Security & Collaboration Notes
- Keep Shopify secrets in `.env.local`/Vercel env vars and only reference them on the server (`lib/shopify.ts`, server actions, Route Handlers). Never expose the Storefront token client-side.
- Redact cart IDs or customer details before logging, capture notable decisions in `docs/decisions/<issue-id>.md`, and leave TODOs with owner handles (`// TODO(@agent-b): predictive search filters`). Coordinate work by directory to keep PRs under ~400 lines.
