# KOA Design Guidelines

This file is the visual source of truth for the KOA frontend. Read it before changing any user-facing component or route.

It covers two surfaces:

- **Admin** — a restrained, neutral, data-first operational system. Most of the detailed rules below were established there.
- **Storefront** — a deliberately more editorial commerce experience (hero, product grids, product detail, cart). It uses the same semantic tokens but is allowed the exceptions documented in §1, §2 and §7.

`AGENTS.md` contains architectural and engineering rules. This file contains visual and interaction rules. When the two overlap (for example, table alignment), `docs/table-column-alignment.md` is the authoritative contract.

## How to use these guidelines

- Treat **must**, **do not**, and **only** as firm constraints.
- Treat **should** as the default unless the surrounding component has a documented reason to differ.
- Reuse the existing component and token before creating a new one.
- Keep route-specific variation minimal. Shared patterns should look and behave consistently.
- When a new decision becomes reusable across the application, document it here in the same change.

## 1. Current design direction

The admin interface is a restrained, neutral, data-first system.

1. **Clarity before decoration.** Information hierarchy comes from layout, spacing, typography, borders, and alignment—not ornamental effects.
2. **Compact but breathable.** Controls are compact for repeated operational work, while sections retain enough whitespace to remain scannable.
3. **Neutral foundation, semantic color.** Surfaces are primarily monochrome. Color is reserved for product data, status, success, and destructive feedback.
4. **Predictable structure.** Similar pages, tables, dialogs, forms, and list items should use the same spacing and component patterns.
5. **Progressive detail.** Show supporting information when it helps the current task, without turning routine views into dense summaries.
6. **Accessible by default.** Every state and action must remain understandable without relying on color alone.

For admin, avoid one-off gradients, oversized headings, excessive shadows, and highly saturated surfaces. An admin page is an operational interface, not a marketing page.

**Storefront is the documented exception.** It is intentionally editorial and may use large display type, full-bleed imagery, motion, and image overlays where they serve the shopping experience. It must still use the shared semantic tokens, keep the same accessibility contract, and reuse the storefront primitives in §7 rather than inventing per-page art direction. The restraint rules above apply to admin, not to the storefront hero or landing sections.

## 2. Foundations

### 2.1 Color and tokens

The palette is defined with semantic CSS variables in `app/globals.css` and exposed through Tailwind v4's `@theme inline` mapping. Use semantic utilities such as `bg-background`, `bg-card`, `text-foreground`, `text-muted-foreground`, and `border-border` in components.

Do not add raw OKLCH, HEX, or RGB UI colors in page or feature components. Dynamic product data colors, such as a user-defined color swatch, are the exception; the fixed storefront footer accent documented below is the other.

Current light and dark foundations follow these roles:

| Role | Current direction | Usage |
| --- | --- | --- |
| `background` | White in light mode; near-black in dark mode | Page and shell background |
| `foreground` | Near-black in light mode; near-white in dark mode | Primary text and icons |
| `card` / `popover` | High-contrast neutral surface | Dialogs, grouped information, elevated content |
| `primary` | Monochrome, high contrast | Primary action, active emphasis |
| `secondary` / `muted` / `accent` | Low-contrast neutral | Secondary controls, inactive/hover states, quiet grouping |
| `border` / `input` | Low-contrast neutral | Separation and control outlines |
| `destructive` | Red | Errors, conflicts, delete actions, invalid input |
| `ring` | Neutral focus ring | Keyboard focus visibility |

Additional rules:

- Keep the admin canvas visually quieter than its white or near-white content surfaces.
- Use `destructive` for destructive actions and error/conflict messaging only.
- Use emerald only for confirmed success or availability, with muted dark-mode variants where needed.
- Use product color as data, not as general UI chrome.
- Reuse the status mappings in `lib/configs/enum-badge-styles.ts`; do not create ad hoc colors for known enums.
- Status badge colors use a restrained pattern: approximately 10% tinted background, 20% tinted border, and a readable foreground.
- Never use color as the only indicator. Pair it with text, an icon, a switch state, or another semantic cue.
- New reusable colors must be added as semantic tokens in `app/globals.css` and must work in both light and dark themes.

Admin shell note: the current shell canvas is `bg-gray-50`. That is a deliberate neutral canvas but uses a raw Tailwind palette class rather than a semantic token; if you touch the shell, prefer migrating it to a semantic surface token rather than spreading `gray-*` into feature components.

Documented storefront color exceptions (fixed brand decisions, not general UI chrome):

- **Footer** — `bg-neutral-900` surface with white text, `text-gray-400` secondary text, `border-gray-700` rules, and `hover:text-[#3D79BE]` on links. Treat those as the footer's palette; do not substitute other accents.
- **Toast deck** — cart toasts are a dark `zinc` card (`bg-zinc-900`, `border-zinc-800`, `text-zinc-100`/`zinc-300`/`zinc-400`). They live above every route including admin, so the zinc palette is intentional, not a stray admin color.
- **Product status badge** — `OutOfStock` uses amber (`bg-amber-400` / `text-amber-950`) on storefront cards. Status is data, not chrome; keep it consistent with the storefront card, not the admin enum badge styles.
- **Product card overlays** — badges stamped on imagery use high-contrast solids (`bg-foreground`, `bg-white`, `bg-destructive`) with shadows so they stay readable over photography.

### 2.2 Typography

The current UI uses:

- **Inter** for interface text and headings through `--font-sans` / `--font-heading`.
- **Geist Mono** through `--font-geist-mono` for SKUs, IDs, code-like values, and other technical identifiers.

Use the existing type scale:

| Context | Treatment |
| --- | --- |
| Page title | `text-2xl`, bold, tight tracking |
| Dialog title | `text-lg`, medium weight |
| Section title | `text-sm`, medium or semibold |
| Body and table content | `text-sm` |
| Supporting metadata | `text-xs`, usually `text-muted-foreground` |
| Short property label | `text-xs`, medium weight, uppercase, wide tracking |
| Code, SKU, ID | `font-mono text-xs` |

Typography rules:

- Keep headings concise and sentence case. Do not use all-uppercase headings.
- Use uppercase only for short property or group labels.
- Use `muted-foreground` for supporting copy, metadata, placeholders, and empty values.
- Use normal foreground color for editable or decision-critical values.
- Do not add a display font or arbitrary font size without a documented design decision.
- Do not use color alone to create a text hierarchy.

Storefront typography rhythm (editorial exception):

- Hero display type is intentionally large: `text-5xl` → `text-9xl` across breakpoints, always `font-bold` with tight tracking and white text over the darkened hero image.
- Landing section titles use `text-3xl md:text-4xl lg:text-5xl`, `font-bold`, `tracking-tight`, with a muted second line for a two-part statement.
- Eyebrows/overlines use `text-xs font-mono uppercase tracking-[0.18em]` (or `[0.25em]` in the hero) in `text-muted-foreground`; they introduce a section, they are not headings.
- Product card text is compact and scannable: `text-[0.65rem]` uppercase category, `text-sm font-medium` two-line product name, `text-sm font-semibold tabular-nums` price.
- Prices are always `tabular-nums`; discount amounts use `line-through` on the original price and a solid pill for the percentage.
- Prose on long-form storefront pages stays `text-base leading-relaxed text-muted-foreground`, as described in §7.5.

### 2.3 Spacing, radii, borders, and elevation

Use Tailwind's spacing scale consistently. The main rhythm is:

- `gap-1.5` for tightly related chips or metadata.
- `gap-2` between a label and its control or closely related inline items.
- `gap-3` for compact toolbar grouping.
- `gap-4` between page sections, form groups, and list items.
- `p-4` inside standard grouped content and `p-5` inside dialog sections.
- `p-6` around the main admin content area.

Radius rules:

- `--radius` is `0.625rem`; use the existing Tailwind radius tokens derived from it.
- Use `rounded-lg` for controls and compact grouped content.
- Use `rounded-xl` for tables, dialogs, outlined information panels, and prominent item cards.
- Use a fully rounded shape for badges and color swatches.
- Avoid unrelated radius changes on a single child or route.

Storefront spacing and radius additions:

- Full editorial sections (brand story) use `py-16 md:py-24`; product showcases and the category strip use the compact `py-8 md:py-12`, and the newsletter band uses `py-8 md:py-16`.
- Product grids are `grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 md:gap-x-6 lg:grid-cols-4`; do not switch to fixed card widths.
- Product cards use `rounded-xl` media plus `aspect-4/5`, a transparent border that becomes `border-border` on hover, and a `1.03` image scale on hover.
- Editorial feature panels may use `rounded-2xl` for a single large visual frame (see the brand-story panel); ordinary product cards stay `rounded-xl`.
- Section content is always inside `mx-auto max-w-7xl px-4 md:px-8`.

Borders and elevation:

- Prefer a visible neutral border over a shadow for structure.
- Use `bg-muted/30` to `/50` for quiet headers and grouping.
- Reserve meaningful shadow for overlays such as dialogs.
- Do not add layered shadows or floating-card treatments to ordinary page content.

### 2.4 Controls and icons

Use the generated primitives in `components/ui/` and preserve their variants and sizes.

- Default controls are compact: approximately 32 px high.
- `sm` controls are approximately 28 px high.
- `xs` controls are approximately 24 px high and reserved for dense, secondary contexts.
- Use `icon-sm` for table row actions and other compact icon actions.
- Use Lucide icons from `lucide-react`.
- Typical table-action icons are `size-3.5`; standard empty-state and feedback icons are `size-4`.
- Every icon-only control must have an accessible name. Provide both `title` and screen-reader text where appropriate.
- Keep icon buttons visually neutral until hover, except destructive actions.

Button hierarchy:

- Use the default variant for one clear primary action.
- Use outline or ghost variants for secondary and row-level actions.
- Use destructive styling only for delete/remove confirmation and destructive hover feedback.
- Keep modal actions right-aligned on larger screens and reverse them on small screens through the dialog primitive.
- While a mutation is pending, show the shared spinner treatment, replace the action with a specific loading label, and disable repeated submission.

## 3. Layout

### 3.1 Admin shell

The admin shell is deliberately restrained:

- A collapsible sidebar provides persistent navigation.
- A slim top header is separated by a bottom border and contains the sidebar trigger and account controls.
- The main admin content has approximately `p-6` outer padding.
- The content canvas is a quiet neutral tone; cards, tables, and dialogs use clearer surface contrast.
- Navigation icons support scanning but do not overpower labels.

Do not redesign the shell for an individual feature. New global navigation or shell behavior requires a documented design-system change.

### 3.2 Page composition

Admin list pages follow this order:

1. `PageHeader`
2. Search and page-level action controls
3. Main content, normally `KoaTable`
4. Related dialogs mounted with the page

Use a vertical page container with `gap-4`. Keep the primary page action easy to find, normally aligned to the end of the search/toolbar row.

### 3.3 Page headers

Use `PageHeader` rather than recreating a title block.

Current page-header treatment:

- Optional icon in a `size-12`, `rounded-lg`, bordered, muted square.
- Title at `text-2xl font-bold tracking-tight`.
- One concise `text-sm` muted description.
- On `sm` and larger screens, the header uses a horizontal layout; page actions sit at the end.
- On small screens, content stacks vertically.

Descriptions should explain scope or grouping, not repeat the title.

### 3.4 Responsive behavior

- Start with a single-column layout and introduce columns at the `sm` breakpoint when content benefits from comparison.
- Use responsive grids for paired fields and detail sections.
- Keep flexible content containers `min-w-0` so text can truncate or wrap instead of forcing overflow.
- Let long metadata wrap rather than expanding a card indefinitely.
- Preserve readable table overflow rather than hiding critical columns.
- Do not introduce fixed desktop-only widths for dialogs or content sections.
- Check that actions remain reachable and that dialog footers behave correctly on small screens.

### 3.5 Storefront shell

The shop layout (`app/(shop)/layout.tsx`) is a full-height column: `Header`, page content, `Footer`. Do not add page-specific headers or footers.

Header (`components/shop-front/header.tsx`):

- Full-width, `z-50`, with an inner `max-w-7xl px-4` row at `h-20`.
- On the homepage it is `fixed` and starts transparent; after `scrollY > 20` or on hover it becomes solid: `bg-background/95 backdrop-blur-sm border-b border-border shadow-sm`. On every other route it is `sticky` and always solid.
- The logo is absolutely centered at all widths. On the transparent state it is inverted to white; on the solid state it returns to its normal treatment.
- Desktop nav sits left (`Home`, `Shop`, `Collections`, `About`), search/cart/account sit right. Keep the nav hidden below `md` and the logo centered.
- Cart controls read live counts from the cart store. The badge caps the displayed count at `99+`.
- `CartSheet` is mounted once by the header, not by pages.

Footer (`components/shop-front/footer.tsx`):

- Dark `bg-neutral-900` band, `max-w-7xl px-4`, `pt-16 pb-40`.
- Brand card on the left; three link groups (`Shop`, `Company`, `Support`) on the right; bottom bar separated by `border-gray-700`.
- Oversized decorative "KOA" wordmark is `aria-hidden`, absolutely positioned, `opacity-[0.035]` — never make it meaningful content.
- Use the documented footer palette from §2.1; do not add gradients or new accent colors.

Storefront page containers use `mx-auto max-w-7xl px-4 py-8 md:px-8 md:py-12` for detail pages and `... px-4 py-10 md:px-8 md:py-14` for the search/catalogue grid. Sections that can be deep-linked carry an `id` and `scroll-mt-24` to clear the sticky `h-20` header.

## 4. Component patterns

### 4.1 Surfaces and grouped content

Use bordered, low-elevation surfaces for related information.

- Standard grouped form sections: `rounded-xl border p-4`, vertical `gap-4`.
- View-only detail sections: `rounded-xl border bg-card p-4`, vertical `gap-3`.
- View-only field labels use the short uppercase treatment; values use normal `text-sm` foreground text.
- Missing values render as a muted em dash (`—`), not an empty string.
- Avoid adding a background tint to every nested group. Use plain borders unless a muted surface is needed for hierarchy.

### 4.2 Tables

Use `KoaTable` for server-paginated data and `KoaAdminSearchBar` for search.

Current table treatment:

- The table is wrapped in `overflow-hidden rounded-xl border`.
- The header uses `bg-muted/50`.
- Loading uses row skeletons that preserve the table structure.
- Empty states are centered, vertically spacious, and `text-sm text-muted-foreground`.
- Pagination follows the table and remains outside the bordered table container.
- Column alignment follows `docs/table-column-alignment.md` exactly: **text left, numerics and dates right, badges/status/actions centered.** Declare it on `columnDef.meta.headerClassName` / `meta.cellClassName`, not ad hoc on the page.
- Absent numeric values render as a muted em dash (`—`) inside the same right-aligned cell. Do not leave the cell empty.
- Sorting is client-side over the currently loaded page (there is no server sorting). Mark only meaningful columns `enableSorting: true`; `KoaTable` renders the asc → desc → off header control and the indicator icon automatically. Do not build a custom sort header.
- Cells that wrap (size/color chip groups) stay centered and keep a small `gap`; do not left-align them just because the content wraps.

Row actions:

- Place actions at the end in a compact horizontal group with `gap-2`.
- Use ghost `icon-sm` buttons for view, edit, link/manage, create, and similar actions.
- Use a destructive foreground or hover tint for delete/remove.
- Do not replace every row action with text buttons when the established icon action is clear and accessible.

Inline editing:

- Boolean state uses `KoaSwitch`.
- Known enum state uses `KoaEnumChanger`, which presents the current value as a badge with a compact chevron.
- Inline controls should remain visually compact and centered in their table cell.

### 4.3 Dialogs

Use the dialog primitives and retain the standard title, description, body, and footer hierarchy.

Standard form dialogs:

- Limit height to approximately `90vh` and allow the content to scroll.
- Header and footer may use subtle top/bottom borders.
- Use a concise title and one-sentence description.
- Use a vertical `gap-4` form body.
- Keep form fields full width unless comparison requires a responsive grid.
- Put cancel before submit visually, with submit as the emphasized final action.
- Disable submit until required selections and valid input are present.

Sectioned view dialogs:

- Use `max-w-2xl` or `max-w-3xl` when content is a list or detail view.
- Use `gap-0 p-0` on the dialog shell when composing explicit sections.
- Header: `border-b p-5`.
- Body: `flex flex-col gap-3` or `gap-4` with `p-5`.
- Footer: `border-t p-5`.
- Use concise muted empty states when no records exist.

Confirmation dialogs must name the affected record and state that the action cannot be undone when that is true.

### 4.4 Forms and field groups

- Use existing helpers such as `KoaFormField`, `KoaTextArea`, `KoaImageInput`, `KoaSearchableSelect`, and modal button components.
- Labels sit above controls with `gap-2` inside each field.
- Related fields may share a `sm:grid-cols-2` or intentional asymmetric grid.
- Use `text-xs text-destructive` for field errors and preserve the input semantics provided by the primitive.
- Use bordered, rounded groups for coherent sections such as pricing, metadata, and existing records.
- Group related calculations and summaries together rather than scattering them across the form.
- Reveal dependent inputs only after their prerequisites are valid when this reduces noise, as with the variant SKU field.

### 4.5 Item rows and compact records

Use `Item` primitives for record-like rows.

Detailed item rows:

- Use `variant="outline"`, `rounded-xl`, and `p-4`.
- Place media at the start, flexible content in the middle, and compact actions at the end.
- Give the content area `min-w-0` so long names can clamp safely.
- Keep supporting metadata in one wrapped row where possible.
- Keep actions in one compact row; use a thin divider when visually separating non-destructive and destructive controls.

Compact linked-record rows may use `size="xs"` with a name and one remove action. Do not inflate them into full cards.

### 4.6 Badges, statuses, and feedback

- Badges are pill-shaped, compact, and use `text-xs font-medium`.
- Use outline badges for categorized enum values and secondary badges for neutral unlabeled values.
- Reuse known enum styles from `lib/configs/enum-badge-styles.ts`.
- Do not assign a new meaning to an existing status color.
- Use switches for immediate boolean changes and badges for current enum summaries.
- Checking/in-progress copy is neutral and muted.
- A confirmed available state uses a restrained emerald border/background and an icon plus text.
- A conflict uses destructive border/background and an icon plus text.
- Errors use the destructive token and should appear next to the relevant field or action.

## 5. Product and variant styling

These patterns are established for base-product and product-variant administration.

### 5.1 Product table

- Product identity and category remain readable as text.
- Price, discount, status, switches, and actions are centered and compact.
- Status, gender, and age group use their mapped enum badges through `KoaEnumChanger`.
- Boolean columns use unlabeled compact switches unless the column header already provides sufficient context.
- Delete is the only destructive row action.

### 5.2 Product variant table

- Group variants by their base product.
- Show available sizes as centered, wrapping pill badges with a small gap.
- Show available colors as compact outline chips containing a circular swatch and color name.
- Use a centered four-column grid for the color chips in the current table.
- Render an em dash when a product has no sizes or colors.
- Keep view and create actions as compact ghost icon buttons.

### 5.3 Variant record row

The established detailed variant row contains:

1. A bordered circular color swatch, approximately `size-9`, vertically centered.
2. The color name as the item title.
3. A wrapped metadata line containing:
   - a size badge,
   - the SKU in monospace,
   - a subtle separator,
   - the created date in muted small text.
4. A compact action group containing:
   - the `Active` label and switch,
   - a thin divider,
   - a destructive-on-hover remove action.

Do not move the active switch into a second stacked block. Do not omit the SKU's monospace treatment.

### 5.4 Create-variant dialog

The established order is:

1. Existing available-variant summary.
2. Color and size selectors on one row at `sm` and above.
3. Availability feedback after both selections are made.
4. SKU input only when the combination is confirmed available.
5. Footer actions.

Additional decisions:

- Use `sm:grid-cols-[3fr_1fr]`: color receives more width because its searchable control and label are longer.
- Place a compact selected-color preview beside the color selector. Show the swatch plus hex code, `Image swatch`, or `No swatch` fallback.
- Render size order according to the clothing-size order used by the application, smallest to largest.
- Disable creation until the combination is available and the SKU is non-empty.

### 5.5 Available-variant summary and availability feedback

Available-variant summary:

- Use a rounded bordered panel with `p-4`.
- Use an uppercase muted label.
- Group color names by size and order size groups smallest first.
- Keep the size label aligned in a narrow fixed-width column and let color names wrap naturally.
- Use `No variants yet.` as the concise empty state.

Availability feedback:

- Before a check has run, show nothing.
- While checking, show one muted line of copy.
- If the combination exists, show a destructive-tinted bordered banner with alert icon, color swatch when available, and existing SKU when known.
- If the combination is free, show an emerald-tinted bordered banner with success icon and color swatch.
- Use a `rounded-lg` border with approximately 5% tint and `p-3` padding.

### 5.6 Color swatches

`ColorSwatch` from `components/general/koa-color-badge.tsx` is the shared swatch primitive.

- Default swatches are `size-5`, circular, shrink-safe, and bordered.
- Context may override size, such as `size-9` in a detailed variant row.
- Prefer the supplied swatch image when present, otherwise use the product hex color.
- Fall back to `muted-foreground` when no valid color source exists.
- Never place text directly on a swatch; keep the swatch paired with a label or accessible context.

## 6. Interaction and accessibility

- Every interactive element must be keyboard reachable with a visible focus state from the primitive.
- Icon-only controls need an accessible name; use screen-reader text even when a tooltip exists.
- Use clear pending, disabled, empty, error, and success states rather than leaving controls ambiguous.
- Preserve context while an async action runs; do not collapse or clear the surrounding record prematurely.
- Pair destructive confirmation with explicit record identity and consequence.
- Ensure long names, metadata, dates, and IDs wrap or truncate without overlapping actions.
- Do not communicate state with badge color alone.
- Keep hover treatments subtle and preserve the same hierarchy at touch and keyboard widths.
- Do not disable browser zoom, reduce focus visibility, or introduce content that requires hover to understand.

## 7. Storefront composition

Storefront surfaces are editorial, but they are assembled from a small set of shared primitives. Reuse the section/shell components below instead of writing a new one-off layout.

### 7.1 Landing page sections

`app/(shop)/page.tsx` mounts sections in this order:

1. `Hero` — full `h-screen` Embla image carousel, `bg-black/55` overlay, animated display copy, two pill CTAs, and a scroll cue that scrolls to `#shop-sections`.
2. `CategoryGrid` — "Shop By Category" carousel, four tiles per page, paging through side arrows rather than a pager.
3. `FeaturedProductsFeed` — paginated product showcase.
4. `DiscountedProductsFeed` — the same showcase shell with `tone="muted"` (`border-y border-border bg-muted/30`) so adjacent showcases read as separate bands.
5. `BrandStoryBanner` — two-column narrative with a large framed logo panel.
6. `NewsletterSection` — centered gradient card with an email form and an emerald success state.

Rules:

- Product showcases reuse `ProductShowcaseSection` + `HomeSectionHeader` + `ProductShowcaseGrid` + `SectionPager`; a new showcase only supplies its copy (`ShowcaseSectionContent`) and tone.
- Feeds hide themselves when the backend returns zero records — never render an empty "Featured Products" heading. Keep that decision in the feed container, not the presentational section.
- Sections that can be paged or deep-linked carry `id` and `scroll-mt-24`; the pager scrolls back to that id.
- `ValueTicker`, `FeaturesBreakdown` and `CommunitySection` exist in `components/shop-front/home/` but are **not mounted** on the current landing page. Do not assume they render, and do not re-enable one without a design decision.
- Hero copy and CTAs are the only place to use the largest type scale; keep the rest of the page at §2.2 sizes.
- Newsletter/validation uses `toast.success` / `toast.error`, which land in the shared deck described in §7.4.

### 7.2 Product grids and cards

`ProductCard` is the shared tile for the catalogue and search results.

- Media is `aspect-4/5`, `rounded-xl`, `bg-muted`; the cover is a plain `<img>` (storage hosts are not in `images.remotePatterns`) with `object-cover` and a `1.03` hover scale.
- A failed image becomes an explicit `ImageOff` + "Image unavailable" state. Never ship a broken-image icon.
- Overlay stack: status and `Featured` badges top-left, discount pill top-right. `Available` intentionally shows no badge — a badge on every card is noise.
- Copy block: uppercase category (`text-[0.65rem]`, `text-muted-foreground`), two-line product name (`text-sm font-medium`, underline on hover), then price. Discounted cards show the final price in semibold with the original struck through.
- The whole card is one link; use `shopHrefs.product(id)` rather than composing the URL.
- Grids: `grid-cols-2` → `md:grid-cols-3` → `lg:grid-cols-4`, `gap-x-4 gap-y-10` (`md:gap-x-6`).
- Storefront grids page with `SHOP_PAGE_SIZE_OPTIONS` (12/24/36/48), never the admin sizes.

### 7.3 Product detail

`ProductDetailsClient` composes the page:

- Container `mx-auto max-w-7xl px-4 py-8 md:px-8 md:py-12`; two columns at `lg` with `gap-12`.
- Left: `ProductGallery`, keyed by the selected color so switching color resets the gallery.
- Right, in order: `ProductInfo`, `ProductPricing`, then the purchase block (variant selector → quantity → actions), then `SizeGuide`.
- `ProductPricing` shows the final price at `text-3xl font-bold tabular-nums`, the struck original at `text-lg`, and the discount as a rounded foreground pill.
- `VariantSelector` offers only `isActive && inStock` variants and disables colors/sizes that have no matching variant. Selecting a color clears a size that is no longer available.
- `QuantitySelector` appears only once a variant is selected, defaults to `min(1, availableQuantity)`, and is capped by that variant's stock.
- `ProductActions` order is "Buy Now" (primary) then "Add to Cart" (outline). Both stay disabled until there is a purchasable variant and quantity.
- Adding to cart confirms with a toast and deliberately does **not** open the drawer, so the customer stays on the page.
- Availability copy is plain `text-sm text-muted-foreground`; true out-of-stock uses `text-destructive`.
- Pricing and formatting must come from `calculatePriceBreakdown` / `formatPrice` in `product-info.tsx` — do not recompute discounts locally.

### 7.4 Cart drawer and toasts

Cart drawer (`components/shop-front/cart/cart-sheet.tsx`):

- Right-side `SheetContent`, `w-full sm:max-w-md`, `gap-0 p-0`.
- Header `border-b border-border p-4 pr-12` with "Your Cart" and a tabular item count; description changes between empty and filled states.
- Empty state is centered: muted circle with `ShoppingBag`, a short title, and one guiding sentence.
- Items are a `divide-y divide-border` list; each row shows its stored snapshot (product, color, size, quantity, price). Never re-fetch a product to render a line.
- Footer `border-t border-border p-4`: subtotal, optional discount, then a bold total separated by a rule. Actions are a full-width `Checkout` (primary) and `Clear All` (outline), both disabled when empty.
- Remove and clear actions fire the matching toast. Read the line before removing it so the toast can name it.

Toasts:

- The app mounts one `StackedDeckToaster` via `ToasterProvider` — a centered, top-anchored deck showing up to three cards, newest in front, scaled and offset behind.
- Cart confirmations use `toast.custom` through the `show*Toast` helpers and the dark zinc `CartToast` card from §2.1. `toast.custom` does not inherit the default toast styling, so the card owns its surface and its enter/exit keyframes.
- Never mount a second toaster, and never style a one-off toast outside `components/toasts/`.
- Duration is 3–3.5 s for cart confirmations (add 3.5 s, remove/clear 3 s); `removeDelay` must sit just past the exit animation so the next toast doesn't feel laggy.

### 7.5 Long-form storefront pages

The storefront legal pages (`/privacy-policy`, `/terms-of-service`) and the About page share one long-form composition. Reuse it for any new prose-heavy storefront route instead of inventing a new one.

- Container: `max-w-7xl mx-auto px-4 md:px-8`.
- Hero: a short uppercase eyebrow, a large `font-bold tracking-tight` title with a `text-primary` accent line, an intro paragraph capped near `max-w-2xl`, then an uppercase last-updated line.
- Optional contents nav sits in the hero under a `border-t border-border pt-6` rule as an accessible `<nav>`/`<ol>` of anchor links, each prefixed with a zero-padded `tabular-nums` index in `text-primary`.
- Body sections use `LegalSection` (`components/shop-front/legal-section.tsx`): `border-b border-border`, `py-16 md:py-24`, a `md:grid-cols-[1fr_2fr]` split with a sticky (`md:top-24`) number + uppercase label column on the left, and an `h2` plus prose on the right.
- Prose uses `text-base leading-relaxed text-muted-foreground`; inline emphasis such as list-lead terms uses `font-medium text-foreground`. Lists are `list-disc space-y-3 pl-5`.
- Contact blocks are a quiet `rounded-xl border border-border bg-muted/30 p-4` panel with an uppercase label — no shadow, no new color.
- Sections carry `id` + `scroll-mt-24` so contents links land below the sticky `h-20` header; smooth scrolling uses `motion-safe:scroll-smooth` on `<main>`.

## 8. Agent implementation checklist

Before completing a user-facing UI change, verify that:

- [ ] `DESIGN.md` was read before implementation.
- [ ] Existing primitives and feature components were reused.
- [ ] Semantic color tokens were used instead of new raw UI colors.
- [ ] Typography, spacing, radius, and control sizes match nearby established patterns.
- [ ] Light and dark themes remain readable.
- [ ] Mobile, tablet, and desktop layouts were considered.
- [ ] Loading, empty, success, error, disabled, and destructive states are intentional.
- [ ] Icon-only controls have accessible names and keyboard focus remains visible.
- [ ] The change did not introduce a route-specific design system.
- [ ] Table alignment matches `docs/table-column-alignment.md`, and sortable columns are explicitly opted in rather than hand-built.
- [ ] Storefront pages reuse the existing shell, section, card, and cart primitives instead of new one-off layouts.
- [ ] Cart/route confirmations use the existing toast helpers and the single stacked-deck toaster.
- [ ] Cart surfaces render the stored line snapshot and never re-fetch a product to display it.
- [ ] Any new reusable styling decision was added to this file.
