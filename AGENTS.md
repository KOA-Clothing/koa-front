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
- Lint does **not** pass clean, and isn't meant to. The current baseline on this branch is **1 error / 18 warnings**. The error is `@typescript-eslint/no-empty-object-type` from the TanStack `ColumnMeta` module augmentation in `lib/configs/table-configs.ts`; the warnings are pre-existing `no-unused-vars`, `@next/next/no-img-element` on the deliberate plain-`<img>` usages, and one stale `eslint-disable`. Compare against the current count instead of expecting zero; a green run means you fixed something unrelated. Re-measure rather than trusting this number after touching tables or storefront pages.

For pure-logic checks (filter parsers, param serialization) there is no test runner — write a throwaway `__verify.ts` and run it with `node --experimental-transform-types`, plus a small `node:module` `register()` hook that resolves extensionless relative imports (and `@/` → repo root) since the repo has no such resolver. Delete both afterwards. This is how the filter system was verified; it's the only option here.

## Gotchas

- Next 16 renamed `middleware.ts` → `proxy.ts`. Clerk middleware lives in `proxy.ts` — do not create or edit `middleware.ts`.
- API base URL is `NEXT_PUBLIC_API_URL` in `.env.local` — a Visual Studio dev tunnel (`https://*.asse.devtunnels.ms`) that expires and changes. On API failures, the tunnel likely needs refreshing. Never log or commit `.env.local` (contains Clerk keys + tunnel token).
- .NET endpoints return the `ApiResponse` envelope (`{ isSuccess, error, errorCode }`) only on failure. On success the backend unwraps the payload (`ResultExtensions.ToActionResult()`), so hooks parse `response.data` directly — e.g. `all-active` endpoints return raw `DesignDto[]`/`CategoryDto[]`, parsed with `z.array(...).parse(response.data)`. Use `getErrorMessage`/`getSuccessMessage` in `lib/api/errors.ts` for envelope messages.
- `components/ui/` are shadcn components generated against `@base-ui/react@^1.8.0` — an older API than current shadcn docs (no `items` prop, no render-prop `ComboboxList`, etc.). Don't "fix" components against current shadcn output. Raw Base UI primitives are inert without wrapper parts: Slider needs `Slider.Control`, and `ComboboxInput` inside a Combobox popup needs `showTrigger={false}` or a stray nested trigger breaks the popup's positioning anchor.
- **`Select.Value` renders the selected item's `value`, not its label.** With `value="1"` / `<SelectItem value="1">Male</SelectItem>` the trigger shows `1`. Pass the label as `SelectValue` children (see `components/admin/koa-filter-select.tsx`), or use a render-function child that maps the value through the label map (see the size select in `components/admin/product-variant/modals/create-variant-modal.tsx`).
- `cn` is imported from **two different specifiers** across the repo: `import { cn } from "@/lib/utils"` (~41 files, now the dominant form) and `import { cn } from "cn"` (~21 files, the generated `components/ui/*` plus `components/general/koa-switch.tsx`). Both compile because the `cn` package is a real dependency. Use `@/lib/utils` in new hand-written code; leave the generated ones alone.
- `next/image` only optimizes hosts declared in `next.config.ts#images.remotePatterns` (currently two Neon storage hosts). Storage-hosted product covers therefore use a plain `<img>` plus `eslint-disable-next-line @next/next/no-img-element` in the shop components — that is deliberate, not lint debt to "fix" unless you also add the host to `remotePatterns`.
- Toasts run on `react-hot-toast`, but the app mounts a custom `StackedDeckToaster` through `components/providers/toaster-provider.tsx`, **not** react-hot-toast's `<Toaster />`. Cart confirmations use `toast.custom` via the `show*Toast` helpers in `components/toasts/`; plain `toast.success/error` calls also land in that deck. Don't mount a second toaster.
- The cart is a persisted Zustand store (`stores/cart-store.ts`) with `skipHydration: true`; `CartSheet` rehydrates it in a mount effect so the server HTML and first client render agree. Don't read `localStorage` during render — that is the classic Next hydration mismatch.
- Admin pages are Clerk-gated server-side, so you cannot visually verify admin UI yourself — no session. Say so instead of claiming a UI change is verified.

## Architecture conventions

- Path alias `@/*` maps to repo root. Route groups: `(shop)`, `(account)`, `(admin)`, `(auth)` (sign-in/up are `[[...rest]]` catch-alls under `(auth)`).
- API calls: axios via `useAxiosClient` (`hooks/use-api-client.ts`) — injects the Clerk bearer token.
- Endpoint paths in `lib/configs/api-routes.ts`, not inline. TanStack Query keys in `lib/api/query-keys.ts`, not inline. **Internal page links in `lib/configs/page-routes.ts`** — `PAGE_ROUTES` for the raw paths, `adminListHrefs.*` for filtered admin querystrings, `adminHrefs.*` for admin path-param drilldowns, and `shopHrefs.*` for storefront links. Never hand-build a querystring or path that already has a builder there. (`next.config.ts` also redirects `/search` → `/products/search` and `/auth` → `/auth/signin`.)
- New mutations should use `useAppMutation` (`lib/api/use-app-mutation.ts`): it invalidates keys, toasts success (server message when present) and errors. Supply `invalidateKeys` + `successMessage`.
- List pagination types live in `types/pagination.ts`: `ListParams<F>`, `toApiListParams`, `DEFAULT_PAGE_SIZE`/`PAGE_SIZE_OPTIONS` for admin tables, and `SHOP_DEFAULT_PAGE_SIZE`/`SHOP_PAGE_SIZE_OPTIONS` for storefront grids (12/24/36/48). The admin and shop sizes are deliberately separate — don't reuse one for the other.
- Feature modules (feature-scoped hooks/components) under `features/`; shared UI under `components/` (shadcn-style, lucide icons); `hooks/` for cross-cutting hooks; global client state under `stores/` (currently the persisted Zustand cart).
- Zod schemas for all API DTOs live in `types/<domain>.ts`; enum schemas in `types/enums.ts` with label maps in `types/enum-labels.ts`. Derive option lists from those maps (`toOptions`) — never restate an enum's members in a component.
- Storefront routes that read the URL are server components (`page.tsx` for metadata + async `searchParams`) handing off to a client `page-client.tsx` where the hooks live. Admin list pages are client components that read the URL through `useServerTableParams`.
- Cart lines are snapshots built by `types/cart.ts#toCartItem`; the drawer renders that snapshot and must not re-fetch a product to display it.
- Shared pricing/formatting lives in `lib/pricing/price-calculations.ts` and `components/shop-front/Product-details/product-info.tsx` (`calculatePriceBreakdown`, `formatPrice`). Reuse it instead of recomputing discounts per component. `lib/mock/` is storefront placeholder data (e.g. reviews), not an API fixture.
- Add shadcn components with `npx shadcn@latest add <name>` — `components.json` is `style: "base-nova"` with CSS vars in `app/globals.css` only. Don't use the legacy `shadcn-ui` CLI or create a `tailwind.config`.
- Admin area is server-gated in `app/(admin)/layout.tsx` via `auth.protect()` + `sessionClaims.metadata.role === "admin"`; keep that gating, don't trust client-side checks.
- File uploads are direct-to-presigned-URL (`lib/storage/direct-upload.ts`) — no auth header on the PUT, the signed URL is self-contained.
- Repo ships local OpenCode design/UI skills (banner-design, brand, design, design-system, slides, ui-styling, ui-ux-pro-max) under `.opencode/skills/` — reuse them for UI work before writing fresh styles.

## Data tables (admin)

`KoaTable` (`components/general/table/koa-table.tsx`) is the only table renderer. It takes `columns`, `data`, `rowCount` (the server's total, required for manual paging), 0-based `pagination` + `onPaginationChange`, `isLoading`, `emptyMessage`, and optional `pageSizeOptions`. It owns `manualPagination: true`, the bordered `rounded-xl` container, row skeletons, `emptyMessage`, and the pagination bar (`DataTablePagination`). Don't rebuild any of that per route.

- Per-route columns live in that route's `columns.tsx`, built with `createDataTableColumnHelper<T>()` from `lib/configs/table-configs.ts` and returned via `columnHelper.columns([...])`. Don't import `createColumnHelper` directly and don't hand `KoaTable` a bare array literal — the helper normalizes heterogeneous column value types into `DataTableColumnDef<T>[]`, which is what prevents the `TValue` assignability errors.
- `tableFeatureSet` (same file) registers `rowPaginationFeature`, `rowSortingFeature` + `createSortedRowModel`, and the built-in sort functions. Sorting is **client-side over the rows already fetched** (no `manualSorting`), so it reorders the current page only; if a route later moves sorting to the server, set `manualSorting: true` on that table.
- Sortable columns set `enableSorting: true`; `KoaTable` renders `DataTableSortButton` automatically (asc → desc → off, `ChevronsUpDown` when unsorted). Non-sortable columns render a plain flex header.
- Column alignment is declared on `columnDef.meta.headerClassName` / `meta.cellClassName` (typed by `AppColumnMeta` in `table-configs.ts`), not ad hoc on the page. The contract — text left, numbers/dates right, badges/status/actions centered, em dash for missing numerics — is in `docs/table-column-alignment.md`.
- `collections/[collectionId]` is the one client-paginated admin list (the items endpoint returns the whole array); it slices rows locally and still feeds `KoaTable` manual-pagination props.
- `collections` (card grid) and `product-configs/images` use `useServerTableParams()` for URL-backed pagination/search and intentionally have no filter bag.

## Table filters (URL-backed, typed)

Every server-paginated admin list keeps pagination and `search` in the **URL** as the single source of truth (`hooks/use-url-state.ts`, wrapped by `useServerTableParams`). The six filtered routes additionally keep a typed filter bag there, so filters are deep-linkable and survive reload/back. `useServerTableParams()` also works with no `filters` argument — that is how `collections` (card grid) and `product-configs/images` get URL-backed pagination/search without a filter bag. The one deliberate exception is `collections/[collectionId]`, which paginates its already-fetched items with local `useState`; it still feeds `KoaTable` the manual-pagination props.

### Vocabulary — `types/filters/table-filters.ts`

Do not re-implement any of this; import it.

- `FilterSpec<V>` — one filter's metadata: `label`, `parse(raw): V | null`, `format(v): string`, optional `options`.
- `FilterSpecs<F>` / `SpecsToBag<S>` / `FilterSpecsRecord` — the bag↔specs bridge. Pair a bag interface with its specs via `satisfies FilterSpecs<Bag>` so a missing/misspelled spec is a compile error, not a filter that silently never applies.
- Parsers: `guidParser`, `enumParser(SomeSchema)`, `booleanParser`. Plus `toOptions(labelMap)`, and the shared `BOOLEAN_OPTIONS` / `formatBoolean` (use these for any boolean filter — do not re-declare `True`/`False` per route).
- `isFilterUnset` / `serializeFilters` — omit-unset logic.

### Recipe — adding filters to a list route

**Every** filtered admin table is migrated — there is no legacy `useX(pagination, search)` hook left, and `toApiPageParams` has been deleted so there's only one way to build list params.

- `base-products` — productId, gender, ageGroup, status, isActive, isFeatured (**richest example**)
- `facets/category` (categoryId, isActive), `facets/design` (designId, isActive), `facets/color` (colorId, isActive) — **nearest example for a simple id + boolean route**
- `product-configs/variants` (productId, colorId, size) — rows are products with nested variants; see "semi-joins" below
- `inventory` (productId, variantId, colorId, size) — rows are single variants, so all four are plain equality checks; see its naming note below

Copy the nearest of those.

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
- **`spec.options` is a static list only.** It's for enums (`toOptions(labelMap)`) and the shared booleans. A filter whose options come from an API call (variants' `colorId`, from `useActiveColors`) must **omit** `options` from its spec and build the list in the controls component — a spec is a plain `.ts` data object and can't call a hook. Don't "fix" this by making `options` a loader.
- **Know what a row actually is before writing a filter.**
  - On `product-configs/variants` a row is a *product* with `variants[]` nested, so `colorId`/`size` are semi-joins. They are defined as **independent existence checks** (product has ≥1 variant in that color AND ≥1 in that size), not "one variant matches both" — the stricter reading would hide a product stocked Navy/M + Black/L when filtering Navy+L. `types/filters/product-variant-filters.ts` documents this at the top; the backend implements the same reading.
  - On `inventory` a row **is** a single variant, so every filter is a plain equality check on that row. `productId` keeps all rows of one product (a set), `variantId` keeps exactly one row (`variant.id`), and `colorId`/`size` match `variant.color.id` / `variant.size`. All four AND together. `types/filters/inventory-filters.ts` documents this.

### Backend contract (`../koa-api`)

All filter params are implemented in the sibling API — `ProductController`, `ProductVariantController`, `InventoryController`, `CategoryController`, `ColorController`, `DesignController`.

- Enums serialize as numbers and match `types/enums.ts` exactly: `Gender` 1-3, `AgeGroup` 1-5, `ProductStatus` 1-4 (`ProductStatus.OutOfStock = 3`, not 5).
- **`bool?`, not `bool`.** A non-nullable `bool` makes `?isActive=false` indistinguishable from "no filter", so the endpoint returns everything.
- An unrecognised query param is ignored by model binding. That means a spec key that drifts from the controller parameter doesn't error — it silently returns unfiltered rows. Keep spec keys equal to the controller's `[FromQuery]` names.
- Soft delete is a **global query filter** (`ApplicationDbContext.OnModelCreating`), so an id filter on a soft-deleted row correctly yields an empty page; no extra `DeletedAt` clause needed.
- Filtering belongs *before* `CountAsync` in the repository so `TotalCount` reflects the filters.
- The variants endpoint returns `ProductVariantsCollectionDto[]` (products with *nested* variants), so `colorId`/`size` are semi-joins and need `.Any(v => v.ColorId == colorId)`-style predicates in the repository. Read the semantics note in `types/filters/product-variant-filters.ts` before writing them.
- Only `/colors/all-active` exists — no "all colors" endpoint — so the variants and inventory color filters can only offer *active* colors. Filtering by a deactivated color isn't possible until the backend adds one.

### Open / known gaps

- `adminListHrefs.designs()` is the only builder with no caller, so the `designId` filter is only reachable by hand-editing the URL. The others are wired: `baseProducts` ← variants / inventory / images / collections-items "View Base Product", `productVariants` ← base-products actions, `categories` ← base-products actions, `colors` ← `koa-product-variant-item.tsx` and `koa-product-image-item.tsx`, `inventory` ← base-products actions and `koa-product-variant-item.tsx`.
- Admin filter bars have never been visually verified — `app/(admin)/layout.tsx` Clerk-gates server-side, so bar wrapping on narrow viewports is unconfirmed. The user has to eyeball it.

## UI Implementation Rules

`DESIGN.md` in the repo root is the visual source of truth — read it before changing, adding, or refactoring any user-facing component or route, and preserve the primitives it defines. It covers the admin system, the storefront shell and composition, and the shared interaction/accessibility rules.

- Match generated styles against `DESIGN.md` before inventing new ones. For anything table-shaped, `docs/table-column-alignment.md` is the authoritative alignment contract (text left, numerics/dates right, badges/status/actions centered).
- When the nearest example and the document disagree, the existing component wins only if the divergence is deliberate and repeated; otherwise fix the component toward the document.
- If a new visual or interaction decision becomes reusable, add it to `DESIGN.md` in the same change rather than leaving it implicit in one route.
- Admin pages are Clerk-gated server-side, so you cannot see them yourself. Do not claim an admin UI change was visually verified.
