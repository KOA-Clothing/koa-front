# KOA Design Guidelines

This file is the visual source of truth for the KOA frontend. Read it before changing any user-facing component or route.

The current guidelines capture the styling decisions established in the admin product-configuration experience. Apply them to analogous admin surfaces. Storefront-specific art direction and more detailed design rules may be added later; when they are, they supersede this document.

`AGENTS.md` contains architectural and engineering rules. This file contains visual and interaction rules.

## How to use these guidelines

- Treat **must**, **do not**, and **only** as firm constraints.
- Treat **should** as the default unless the surrounding component has a documented reason to differ.
- Reuse the existing component and token before creating a new one.
- Keep route-specific variation minimal. Shared patterns should look and behave consistently.
- When a new decision becomes reusable across the application, document it here in the same change.

## 1. Current design direction

The current interface is a restrained, neutral, data-first admin system.

1. **Clarity before decoration.** Information hierarchy comes from layout, spacing, typography, borders, and alignment—not ornamental effects.
2. **Compact but breathable.** Controls are compact for repeated operational work, while sections retain enough whitespace to remain scannable.
3. **Neutral foundation, semantic color.** Surfaces are primarily monochrome. Color is reserved for product data, status, success, and destructive feedback.
4. **Predictable structure.** Similar pages, tables, dialogs, forms, and list items should use the same spacing and component patterns.
5. **Progressive detail.** Show supporting information when it helps the current task, without turning routine views into dense summaries.
6. **Accessible by default.** Every state and action must remain understandable without relying on color alone.

Avoid one-off gradients, oversized headings, excessive shadows, and highly saturated surfaces. This is an operational interface, not a marketing page.

## 2. Foundations

### 2.1 Color and tokens

The palette is defined with semantic CSS variables in `app/globals.css` and exposed through Tailwind v4's `@theme inline` mapping. Use semantic utilities such as `bg-background`, `bg-card`, `text-foreground`, `text-muted-foreground`, and `border-border` in components.

Do not add raw OKLCH, HEX, or RGB UI colors in page or feature components. Dynamic product data colors, such as a user-defined color swatch, are the exception.

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
- Table columns should have clear alignment: center compact values, badges, switches, and actions; use left alignment for prose-like fields.
- Use a muted em dash for absent scalar values.

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

## 7. Agent implementation checklist

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
- [ ] Any new reusable styling decision was added to this file.
