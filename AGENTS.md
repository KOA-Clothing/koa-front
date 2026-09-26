<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# KOA frontend

Shop/admin storefront against a .NET API (`../koa-api`, sibling repo). App Router, Next.js 16 (see block above — APIs differ from older Next), React 19, strict TS, Tailwind v4 (CSS-first config in `app/globals.css`, no `tailwind.config`).

`CLAUDE.md` is just `@AGENTS.md` — this file is the single source of truth. `README.md` is unmodified create-next-app boilerplate; ignore it.

## Commands

- `npm run dev` — dev server. Also regenerates the Next docs/agent files referenced above.
- `npm run lint` / `npm run lint:fix` — ESLint (flat config, `eslint.config.mjs`; only `eslint-config-next`, no extra plugins).
- `npm run build` — production build; runs typecheck but **not** lint (Next 16 removed linting from `next build`).
- **No test framework and no CI** (no `.github/`, no `test` script, no runner in devDependencies). Verify with `npx tsc --noEmit` + `npm run lint`.
- Lint does **not** pass clean, and isn't meant to. Baseline is **15 errors / 46 warnings, all errors `@typescript-eslint/no-require-imports`**. Compare against that number instead of expecting zero; a green run means you fixed something unrelated. The warnings are mostly `no-unused-vars` on pre-existing unused imports in the facet pages.

For pure-logic checks (filter parsers, param serialization) there is no test runner — write a throwaway `__verify.ts` and run it with `node --experimental-transform-types`, plus a small `node:module` `register()` hook that resolves extensionless relative imports (and `@/` → repo root) since the repo has no such resolver. Delete both afterwards. This is how the filter system was verified; it's the only option here.

## Gotchas

- Next 16 renamed `middleware.ts` → `proxy.ts`. Clerk middleware lives in `proxy.ts` — do not create or edit `middleware.ts`.
- API base URL is `NEXT_PUBLIC_API_URL` in `.env.local` — a Visual Studio dev tunnel (`https://*.asse.devtunnels.ms`) that expires and changes. On API failures, the tunnel likely needs refreshing. Never log or commit `.env.local` (contains Clerk keys + tunnel token).
- .NET endpoints return the `ApiResponse` envelope (`{ isSuccess, error, errorCode }`) only on failure. On success the backend unwraps the payload (`ResultExtensions.ToActionResult()`), so hooks parse `response.data` directly — e.g. `all-active` endpoints return raw `DesignDto[]`/`CategoryDto[]`, parsed with `z.array(...).parse(response.data)`. Use `getErrorMessage`/`getSuccessMessage` in `lib/api/errors.ts` for envelope messages.
- `components/ui/` are shadcn components generated against `@base-ui/react@^1.8.0` — an older API than current shadcn docs (no `items` prop, no render-prop `ComboboxList`, etc.). Don't "fix" components against current shadcn output. Raw Base UI primitives are inert without wrapper parts: Slider needs `Slider.Control`, and `ComboboxInput` inside a Combobox popup needs `showTrigger={false}` or a stray nested trigger breaks the popup's positioning anchor.
- **`Select.Value` renders the selected item's `value`, not its label.** With `value="1"` / `<SelectItem value="1">Male</SelectItem>` the trigger shows `1`. Pass the label as `SelectValue` children (see `components/admin/koa-filter-select.tsx`); the repo's other workaround is a function child at `create-variant-modal.tsx:176`.
- `cn` is imported from **two different specifiers** across the repo: `import { cn } from "@/lib/utils"` (24 files) and `import { cn } from "cn"` (17 files, mostly generated `components/ui/*` plus a couple of `components/general/*`). Both compile. Use `@/lib/utils` in new hand-written code; leave the generated ones alone.
- Admin pages are Clerk-gated server-side, so you cannot visually verify admin UI yourself — no session. Say so instead of claiming a UI change is verified.

## Architecture conventions

- Path alias `@/*` maps to repo root. Route groups: `(shop)`, `(account)`, `(admin)`, `(auth)` (sign-in/up are `[[...rest]]` catch-alls under `(auth)`).
- API calls: axios via `useAxiosClient` (`hooks/use-api-client.ts`) — injects the Clerk bearer token.
- Endpoint paths in `lib/configs/api-routes.ts`, not inline. TanStack Query keys in `lib/api/query-keys.ts`, not inline. **Internal page links in `lib/configs/page-routes.ts`** (`adminListHrefs.*`) — never hand-build a querystring for a route that already has a builder there.
- New mutations should use `useAppMutation` (`lib/api/use-app-mutation.ts`): it invalidates keys, toasts success (server message when present) and errors. Supply `invalidateKeys` + `successMessage`.
- Feature modules (feature-scoped hooks/components) under `features/`; shared UI under `components/` (shadcn-style, lucide icons); `hooks/` for cross-cutting hooks.
- Zod schemas for all API DTOs live in `types/<domain>.ts`; enum schemas in `types/enums.ts` with label maps in `types/enum-labels.ts`. Derive option lists from those maps (`toOptions`) — never restate an enum's members in a component.
- Add shadcn components with `npx shadcn@latest add <name>` — `components.json` is `style: "base-nova"` with CSS vars in `app/globals.css` only. Don't use the legacy `shadcn-ui` CLI or create a `tailwind.config`.
- Admin area is server-gated in `app/(admin)/layout.tsx` via `auth.protect()` + `sessionClaims.metadata.role === "admin"`; keep that gating, don't trust client-side checks.
- File uploads are direct-to-presigned-URL (`lib/storage/direct-upload.ts`) — no auth header on the PUT, the signed URL is self-contained.
- Repo ships local OpenCode design/UI skills (banner-design, brand, design, design-system, slides, ui-styling, ui-ux-pro-max) under `.opencode/skills/` — reuse them for UI work before writing fresh styles.

## Table filters (URL-backed, typed)

Every server-paginated admin table keeps pagination, `search`, and its filter bag in the **URL** as the single source of truth (`hooks/use-url-state.ts`). Filters are therefore deep-linkable and survive reload/back.

### Vocabulary — `types/filters/table-filters.ts`

Do not re-implement any of this; import it.

- `FilterSpec<V>` — one filter's metadata: `label`, `parse(raw): V | null`, `format(v): string`, optional `options`.
- `FilterSpecs<F>` / `SpecsToBag<S>` / `FilterSpecsRecord` — the bag↔specs bridge. Pair a bag interface with its specs via `satisfies FilterSpecs<Bag>` so a missing/misspelled spec is a compile error, not a filter that silently never applies.
- Parsers: `guidParser`, `enumParser(SomeSchema)`, `booleanParser`. Plus `toOptions(labelMap)`, and the shared `BOOLEAN_OPTIONS` / `formatBoolean` (use these for any boolean filter — do not re-declare `True`/`False` per route).
- `isFilterUnset` / `serializeFilters` — omit-unset logic.

### Recipe — adding filters to a list route

Done for `base-products` (productId, gender, ageGroup, status, isActive, isFeatured), `facets/category` (categoryId, isActive) and `facets/design` (designId, isActive). Copy the nearest of those.

1. **`types/filters/<route>-filters.ts`** — export the bag interface (`<Route>Filters`, all members optional) and a **module-level** `<route>FilterSpecs` object. `as const satisfies FilterSpecs<Bag>`.
2. **`components/admin/<domain>/filters/<route>-filter-controls.tsx`** — the route's controls, rendered as the `children` of `KoaAdminFiltersBar`. Derive the prop types from the specs (`SpecsToBag<typeof specs>`) instead of restating them.
3. **List hook** — change to one object param: `useThings(params: ListParams<ThingFilters>)`. Use `toApiListParams(params)` for **both** the `queryKey` and the axios `params`, so two filter combinations can never share a cache entry.
4. **Page** — `useServerTableParams({ filters: specs })`, pass `filters`/`setFilter`/`clearFilters`/`hasActiveFilters` into `<KoaAdminFiltersBar>`, call the hook with `{ pagination, search, filters }`, and set a filtered `emptyMessage` on `<KoaTable>`.
5. **`lib/configs/page-routes.ts`** — if the route has an id filter, add `PAGE_ROUTES.ADMIN.*` + an `adminListHrefs.*({ <idKey> })` builder so producers link to it instead of hand-rolling a querystring.

Reusable pieces (never route-specific): `KoaAdminFiltersBar` (filter-blind shell: takes `ReactNode` + two plain values), `KoaFilterSelect` (tri-state select; exports `toSelectOptions`), `KoaIdFilterIndicator` (removable chip for an active id filter).

### Rules that are easy to get wrong

- **Spec key == API query param name.** There is deliberately no `param` override. Use DTO/param names as keys (`status`, `isActive`); put display wording in `spec.label` (`status` → "Product Status").
- **`parse`/`format` must be declared as method shorthand, not arrow-typed properties.** `V` appears in both return and parameter position, which makes the property form invariant; method syntax is bivariant and is what lets a heterogeneous `Record<string, FilterSpec<FilterValue>>` constraint accept real specs. Converting them to properties breaks the build — there's a comment in the file.
- **Specs must be a module-level stable reference.** An inline object literal rebuilds the derived URL schema on every render.
- **Booleans are tri-state, so they need a select, not a switch.** Unset means "don't filter"; `false` is a real value meaning "inactive only". Therefore `isFilterUnset` must never be a falsiness test — getting that wrong silently returns unfiltered rows, which is a wrong-results bug, not a crash.
- **`parse` returning `null` reads as unset**, so `?gender=9` or `?isActive=maybe` never reaches the API as garbage.
- **`useServerTableParams` is the only URL writer** (one `useUrlState` call; `setFilter` resets `pageIndex: 1` in the same write so results can't land on a page that no longer exists). Don't add a second `useUrlState`, and don't put filter state in React state. The two `as unknown as` casts in that hook are deliberate — they hide the dynamic filter keys from the inferred schema type; leave them.
- **The filter bar's Clear must not clear `search`.** They're independent controls that happen to feed one request.
- **Select option values are strings.** `toSelectOptions()` stringifies spec option values and the route stringifies the bag value, so the label lookup in `KoaFilterSelect` compares strings on both sides. Keep both sides stringified.
- **Id filters are navigation, not exploration** — set by a deep link from another page, so they get no control, only `KoaIdFilterIndicator` while active. Resolve their display label for free from the list response by **matching on id, not row index**, so a stale `placeholderData` page can't name the wrong record for a frame.

### Backend contract (`../koa-api`)

- Enums serialize as numbers and match `types/enums.ts` exactly: `Gender` 1-3, `AgeGroup` 1-5, `ProductStatus` 1-4 (`ProductStatus.OutOfStock = 3`, not 5).
- **`bool?`, not `bool`.** A non-nullable `bool` makes `?isActive=false` indistinguishable from "no filter", so the endpoint returns everything.
- Adding an unrecognised query param is ignored by model binding, so the page won't error before the backend lands — it just won't filter.
- Soft delete is a **global query filter** (`ApplicationDbContext.OnModelCreating`), so an id filter on a soft-deleted row correctly yields an empty page; no extra `DeletedAt` clause needed.
- Filtering belongs *before* `CountAsync` in the repository so `TotalCount` reflects the filters.

### Not done yet

- `facets/color` and `product-configs/variants` still use the legacy `useX(pagination, search)` + `toApiPageParams` signature (which stays until they're migrated). Variants will need `colorId` + `size`.
- **Open backend question for variants:** that endpoint returns `ProductVariantsCollectionDto[]` (products with *nested* variants), so `colorId`/`size` are semi-joins — unclear whether color+size must AND on a *single* variant or be intersected across the product's variants. Settle this before writing the filter.
- `adminListHrefs.categories()` / `.designs()` have no callers yet — those `categoryId`/`designId` filters are currently only reachable by hand-editing the URL. `adminListHrefs.baseProducts()` is used by the variants page's "View Base Product" button.

## UI Implementation Rules

`DESIGN.md` in the repo root is the visual source of truth — read it before changing, adding, or refactoring any user-facing component or route, preserve the primitives it defines, and match generated styles against its layout rules.

**It is currently a 0-byte file** (experimental branch, to be populated later). Until it has content, the real source of truth is the existing components — mirror the nearest one (`components/admin/koa-admin-searchbar.tsx` for bars, `koa-table.tsx` for tables) instead of inventing styles.
