---
version: alpha
name: KOA-design-system
description: >
  A quiet, athletic commerce system for KOA. KOA combines the editorial
  confidence of Nike, the conversion clarity of Shopify, the calm whitespace of
  Apple, and the radical subtraction of Tesla so that product photography and
  purposeful action lead every experience.
status: active
scope: storefront, account, and admin surfaces
colors:
  action: "#3E6AE1"
  action-pressed: "#2F55C7"
  action-on-dark: "#8FA8FF"
  ink: "#111111"
  ink-strong: "#1D1D1F"
  graphite: "#393C41"
  pewter: "#5C5E62"
  silver: "#8E8E90"
  canvas: "#FFFFFF"
  cloud: "#F5F5F5"
  parchment: "#F7F7F4"
  hairline: "#E5E5E5"
  carbon: "#171A20"
  success: "#007D48"
  sale: "#C62828"
  warning: "#9A6700"
typography:
  display-campaign:
    fontFamily: "Oswald, Inter, sans-serif"
    fontSize: 64px
    fontWeight: 700
    lineHeight: 0.92
    textTransform: uppercase
  display-section:
    fontFamily: "Oswald, Inter, sans-serif"
    fontSize: 40px
    fontWeight: 700
    lineHeight: 1
    textTransform: uppercase
  display-editorial:
    fontFamily: "Inter, sans-serif"
    fontSize: 56px
    fontWeight: 500
    lineHeight: 1.05
    textTransform: none
  ui:
    fontFamily: "Inter, sans-serif"
    fontSize: 14px
    fontWeight: 500
    lineHeight: 1.4
  body:
    fontFamily: "Inter, sans-serif"
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.55
  technical:
    fontFamily: "Geist Mono, monospace"
    fontSize: 12px
    fontWeight: 400
    lineHeight: 1.4
rounded:
  none: 0px
  control: 8px
  card: 12px
  pill: 9999px
spacing:
  base: 4px
  compact: 8px
  control: 12px
  standard: 16px
  section: 48px
  editorial: 64px
  campaign: 96px
motion:
  control: 180ms
  panel: 280ms
  easing: "ease-out"
inspiration:
  - "design-guides/DESIGN-apple.md"
  - "design-guides/DESIGN-nike.md"
  - "design-guides/DESIGN-shopify.md"
  - "design-guides/DESIGN-tesla.md"
---

# KOA Design Guide

> **KOA is quietly powerful.** Let the garment lead. Let whitespace frame it.
> Let every control make the next useful action obvious.

This is the living visual specification and current implementation contract for
the KOA storefront, account, and admin surfaces. `AGENTS.md` remains the source
of truth for repository architecture and engineering rules. A change that departs
from this guide must update the relevant token or documented decision here in the
same change.

## 1. Product intent

KOA is a modern clothing and activewear storefront for people who want to move,
dress, and decide with intention. The experience should feel like a well-lit
gallery that happens to be excellent at commerce:

- **Editorial when it tells a story:** campaign imagery, strong type, and
  generous negative space create confidence and desire.
- **Operational when a decision is being made:** product grids, filters,
  variants, prices, delivery details, and actions are quick to scan and hard to
  misunderstand.
- **Consistent across surfaces:** the same product, status, and action should
  look and behave consistently in the home page, listing, product detail, cart,
  account, and admin tools.

The current brand direction is **masculine-leaning, active, and disciplined**:
strength and performance should be felt in the structure of the experience, not
in aggressive copy or decoration. Keep the system welcoming to a broader range
of customers through inclusive imagery, accessible language, and product-led
presentation. KOA should never feel like a noisy promotional feed or a generic
technology template.

## 2. Reference synthesis

These references are sources of principles, not templates to copy. KOA should
combine the useful parts into an original system and must not reproduce the
references' proprietary fonts, logos, photography, or exact brand assets.

| Reference | What KOA adopts | How KOA adapts it |
| --- | --- | --- |
| `design-guides/DESIGN-nike.md` | High-contrast monochrome foundation, full-bleed campaign imagery, bold uppercase campaign type, flat product cards, and a clear editorial-to-catalog rhythm | Use uppercase type and full-bleed media for campaign moments, plus a smaller athletic display tier for storefront headings. Keep the product grid calmer and avoid constant motion or promotional noise. |
| `design-guides/DESIGN-shopify.md` | Ultra-light or oversized display moments paired with strong hierarchy, conversion-oriented product grids, obvious filters and sorting, clear size/color controls, and one primary action per decision point | Use a restrained editorial display tier and preserve the practical commerce grammar while giving product media and section transitions more air. Do not turn every surface into a pill-shaped control. |
| `design-guides/DESIGN-apple.md` | Generous whitespace and padding, quiet low-contrast containers, photography-first presentation, restrained elevation, and clear type hierarchy | Use a warm-neutral storefront canvas and a controlled rhythm of light, fog, and occasional carbon sections. Keep admin and transactional surfaces compact. |
| `design-guides/DESIGN-tesla.md` | Radical subtraction, geometric typography, flat neutral surfaces, high-contrast functional buttons, full-bleed hero photography, and restrained motion | Keep chrome almost invisible around the product, but retain borders, dividers, and state cues where commerce and accessibility need them. Do not force every page into a full-viewport gallery. |

### KOA's signature combination

KOA is recognizable by the combination of four behaviors:

1. **Gallery calm:** a product or campaign image receives enough space to be
   inspected rather than decorated.
2. **Athletic confidence:** strong, economical type and decisive actions create
   momentum without shouting.
3. **Commerce precision:** filters, variants, price, availability, and delivery
   information are never hidden in visual flourish.
4. **Radical subtraction:** every border, color, badge, and animation must earn
   its place. When in doubt, remove it.

## 3. Design principles

These principles apply across storefront, account, and admin surfaces.

1. **Product before interface.** Product photography, product identity, and
   price are the primary content. Navigation and controls support them.
2. **Whitespace is structure.** Space separates ideas, improves scanning, and
   makes premium products feel considered. It is not leftover room to fill.
3. **One decision, one emphasis.** Each section or purchase step should have
   one obvious primary action. Secondary actions are quieter but still clear.
4. **Contrast creates momentum.** Use scale, weight, surface change, and
   whitespace before adding color or decoration.
5. **Scan before delight.** Users must be able to identify a product, compare
   options, and find the next action quickly, even before they explore the
   visual details.
6. **Color carries meaning.** Neutral surfaces dominate. The action color,
   semantic status colors, and product colors each have a restricted job.
7. **No decorative states.** Every badge, border, icon, animation, and shadow
   must explain a relationship, status, or action.
8. **Responsive by intent.** Mobile is not a compressed desktop page; it changes
   the order, density, and interaction model where necessary.
9. **Accessible by default.** Every state remains understandable without
   color, hover, motion, or perfect eyesight.
10. **Consistency is a feature.** Reuse a primitive or pattern before inventing
    a route-specific one.

## 4. Visual language

### Mood

The visual language is **quiet strength**: clean enough to feel premium,
precise enough to feel technical, and energetic enough to feel athletic. Avoid
both sterile minimalism and loud sports-marketing maximalism.

The preferred reading order is:

1. Photography or the product itself.
2. A short, confident headline or product name.
3. A concise supporting sentence.
4. A single clear action or price.
5. Details and secondary navigation.

### Imagery

- Use real product photography and lifestyle imagery with a consistent art
  direction, light treatment, and crop language.
- Product images should preserve the garment's shape, color, texture, and
  proportions. Do not crop away important construction details.
- Prefer a quiet studio stage (`{colors.cloud}`) for catalog imagery and
  cinematic photography for campaign imagery.
- Use responsive `srcset`/Next Image sizing and explicit aspect-ratio boxes to
  prevent layout shift.
- Use meaningful alt text for product and lifestyle images. Use empty alt text
  for images that are purely decorative.
- Do not use a dark gradient over every image. If text must sit on a photo,
  choose an asset with enough contrast or use a restrained, accessible scrim.

### Surface modes

KOA may alternate between three broad surface modes to create rhythm:

- **Canvas:** pure or near-white for the primary shopping and product context.
- **Fog:** a quiet off-white/light neutral for alternating sections and product
  stages.
- **Carbon:** a near-black editorial section for campaign moments, contrast,
  or a deliberate visual reset.

Surface changes are structural. They are not a reason to add gradients,
patterns, ornamental borders, or excessive shadows.

### Illustration and data visualization

Use illustration only when it clarifies a concept that photography cannot. Keep
it geometric, restrained, and compatible with the type system. For charts, use
semantic chart tokens, direct labels where possible, and a neutral grid; color
should distinguish meaningful series or states rather than decorate the chart.

## 5. Color system

### Color philosophy

KOA is **neutral by default with one action color**. The action color is a
signal for the next meaningful step, not a general brand wash. Product colors
belong to product data and photography; they do not recolor the interface around
them.

Semantic status colors are functional exceptions:

- Green means available, confirmed, or successful.
- Red means destructive, invalid, sold out, or conflicting.
- Amber means attention is required, not merely that a label exists.
- Blue is reserved for the primary action and focus unless a page explicitly
  needs an informational link.

### Primitive palette

These are design-system values, not values to paste into page components. Add
them to the CSS token layer first, then consume semantic aliases.

| Primitive | Light reference | Use |
| --- | --- | --- |
| `ink` | `#111111` | Primary text, high-contrast black surfaces |
| `ink-strong` | `#1D1D1F` | Display text and near-black surfaces |
| `graphite` | `#393C41` | Body text and strong secondary copy |
| `pewter` | `#5C5E62` | Tertiary copy and utility links |
| `silver` | `#8E8E90` | Placeholder and low-emphasis metadata |
| `canvas` | `#FFFFFF` | Primary page and product surface |
| `cloud` | `#F5F5F5` | Product stages, quiet panels, alternating sections |
| `parchment` | `#F7F7F4` | Warm editorial surface and footer variation |
| `hairline` | `#E5E5E5` | Dividers, quiet borders, input outlines |
| `carbon` | `#171A20` | Dark editorial sections and dark surfaces |
| `action` | `#3E6AE1` | Primary storefront CTA and focus signal |
| `action-pressed` | `#2F55C7` | Pressed/action state |
| `action-on-dark` | `#8FA8FF` | Action text and controls on carbon surfaces |
| `success` | `#007D48` | Availability and confirmation |
| `sale` | `#C62828` | Discounted price and destructive emphasis |
| `warning` | `#9A6700` | Attention and recoverable warning |

### Semantic tokens

Use semantic names in components. The names describe purpose, not a particular
hex value.

| Semantic token | Light role | Dark role | Typical use |
| --- | --- | --- | --- |
| `--koa-canvas` | `canvas` | `carbon` or deep neutral | Page background |
| `--koa-surface` | `canvas` or slightly raised neutral | raised charcoal | Cards, panels, dialogs, popovers |
| `--koa-surface-muted` | `cloud` | lighter charcoal | Grouping, filters, quiet headers |
| `--koa-ink` | `ink` | near-white | Headings, body text, icons |
| `--koa-ink-secondary` | `graphite` | soft light gray | Supporting copy |
| `--koa-ink-muted` | `pewter`/`silver` | muted light gray | Metadata, placeholders, disabled text |
| `--koa-line` | `hairline` | low-contrast white alpha | Borders and dividers |
| `--koa-action` | `action` | `action-on-dark` | Primary storefront action |
| `--koa-action-hover` | `action-pressed` | accessible lighter/darker step | Hover and pressed action |
| `--koa-focus` | high-contrast action or neutral ring | high-contrast light ring | Keyboard focus |
| `--koa-success` | `success` | lighter green | Availability, success feedback |
| `--koa-danger` | `sale`/destructive red | lighter red | Errors, conflicts, destructive actions |
| `--koa-warning` | `warning` | lighter amber | Attention states |
| `--koa-overlay` | neutral black alpha | neutral black alpha | Dialog and sheet scrims |
| `--koa-product-stage` | `cloud` | slightly raised charcoal | Catalog image stage |

### Color rules

- Use semantic CSS variables and Tailwind utilities such as `bg-background`,
  `bg-card`, `text-foreground`, and `text-muted-foreground` in components.
- Do not add raw HEX, RGB, or OKLCH values to page or feature components. Product
  color data is the exception when it is genuinely user-supplied data.
- Use one action-colored primary CTA per section or decision point. Do not turn
  an entire page blue.
- Use `sale` for a meaningful price or destructive signal, not for a decorative
  badge or general emphasis.
- Never communicate status with color alone. Pair it with text, an icon, a
  shape, a label, or a native control state.
- Keep body text at least WCAG AA contrast against its surface. Check light and
  dark themes independently; do not assume a light-mode token works unchanged.
- Prefer surface contrast and hairlines to decorative shadows.
- The repository maps the shadcn `--primary` token to a near-black operational
  value. Storefront actions use the dedicated `action` token; admin actions keep
  the neutral primary treatment.

### Token architecture

Use three deliberate layers so that visual decisions remain portable across
light mode, dark mode, storefront, and admin:

1. **Primitive tokens:** raw palette, type, spacing, radius, and motion values.
   These describe what exists, not where it is used.
2. **Semantic tokens:** purpose aliases such as `--koa-action`,
   `--koa-ink-muted`, and `--koa-danger`. Components consume this layer.
3. **Component tokens or variants:** a small local layer for a reusable
   component's specific composition, such as a product-card image stage or a
   dialog footer spacing. Do not duplicate the entire palette here.

Dynamic product colors are data tokens, not UI tokens. Keep them separate from
the primitive and semantic layers so a customer's blue garment never changes
the meaning of the interface's blue action state.

### Current implementation

- `app/globals.css` owns the primitive palette, semantic aliases, role spacing,
  radii, motion values, light/dark values, and shadcn compatibility aliases.
- `app/layout.tsx` loads Inter for UI, Oswald for campaign display, and Geist
  Mono for technical values.
- The shared button exposes a dedicated `storefront` variant for blue action
  treatments. Existing neutral variants remain the admin/account contract.
- Account and admin surfaces consume the same semantic foundation while keeping
  their established compact, neutral, data-first hierarchy.

## 6. Typography

### Font strategy

KOA uses a deliberate split between expressive campaign type and dependable
interface type:

- **Inter** is the primary UI and body face. It is already part of the frontend
  stack and provides clear, neutral readability.
- **Oswald** is the approved geometric condensed display face for
  campaign/editorial display moments only. It must not become the default UI
  font.
- **Geist Mono** is reserved for SKUs, IDs, order numbers, and other technical
  values.
- Use Inter at a medium display weight for quieter editorial statements when
  the page needs premium calm rather than athletic emphasis.

If the display font fails to load, use Inter at a heavier display weight rather
than introducing a third visual language. Font loading is a deliberate
performance and branding decision, not a per-page embellishment. Oswald's
implemented campaign weights stop at `700`, its available maximum.

### Type scale

| Role | Treatment | Use |
| --- | --- | --- |
| Campaign display | `64px`, `0.92`, `700`, uppercase, tight tracking | Hero statements and major campaign moments |
| Editorial display | `56px`, `1.05`, `500`, sentence case | Premium editorial statements and quieter brand moments |
| Section display | `40px`, `1.0`, `700`, uppercase, tight tracking | Storefront section openers |
| Page title | `32px`, `1.1`, `700`, sentence case | Storefront, account, and app page titles |
| Heading | `24px`, `1.2`, `700` | Product and content section headings |
| Product title | `16px`, `1.4`, `600` | Product cards and product detail title |
| Body | `16px`, `1.55`, `400` | Descriptions, policies, and reading copy |
| UI/control | `14px`, `1.4`, `500` | Navigation, buttons, filters, and form controls |
| Caption | `12px`, `1.4`, `500` | Metadata, labels, and helper copy |
| Property label | `11px`, `1.2`, `600`, uppercase, wide tracking | Short category or property labels only |
| Technical value | `12px`, `1.4`, `400`, monospace | SKU, ID, and code-like values |

### Typography rules

- Reserve uppercase for short campaign statements and compact property labels.
  Product names, form labels, navigation, and admin headings remain readable
  sentence case.
- Section eyebrows and numerals are neutral property labels, not accents. Use a
  muted text token for the label text and the technical monospace treatment for
  numerals such as section numbers and timeline years; action blue stays on
  actions, focus signals, and active states.
- Use tight tracking only at large display sizes. Keep body and UI tracking
  neutral.
- Use weight and spacing to establish hierarchy before adding a new color.
- Keep a readable measure for long copy, approximately 60–75 characters per line.
- Never make a heading the only way to communicate a status or instruction.
- Do not use text baked into product photography when the same message can be
  rendered accessibly in the interface.
- Do not use a display font in tables, dense forms, or operational admin tools
  unless a specific, approved feature requires it.

## 7. Spacing, layout, and shape

### Spacing rhythm

Use a 4px base unit with an 8px structural rhythm.

| Token | Value | Typical use |
| --- | --- | --- |
| `space-1` | `4px` | Tight icon/label relationships |
| `space-2` | `8px` | Related controls and compact metadata |
| `space-3` | `12px` | Toolbar groups and small card gaps |
| `space-4` | `16px` | Standard card padding and field groups |
| `space-6` | `24px` | Section gaps and larger card padding |
| `space-8` | `32px` | Major content transitions |
| `space-12` | `48px` | Desktop section rhythm |
| `space-16` | `64px` | Editorial section separation |
| `space-24` | `96px` | Campaign breathing room |

Spacing is contextual:

- **Campaign:** `64–96px` between major messages, with generous image clearance.
- **Commerce listing:** `32–48px` between content bands and `16–24px` between
  grid items.
- **Product detail and checkout:** `16–24px` between decision groups.
- **Account and admin:** `16–24px` between groups; use the compact patterns in
  this guide for repeated operational work.

### Containers and grids

- Default content container: `max-width: 1280px` with responsive side gutters.
- Wide campaign/product grids may extend to `1440px` when the media benefits.
- Long-form reading content: approximately `680px` maximum measure.
- Product grids: four columns at large desktop, three at tablet, two at small
  phone/landscape widths, and one on narrow phones.
- Use CSS grid or a consistent flex arrangement. Do not use fixed card widths
  that force horizontal scrolling on common tablet sizes.
- Use `min-w-0` on flexible text regions so names, SKUs, and metadata can wrap
  or truncate without colliding with actions.

### Radius language

KOA uses shape according to context rather than one universal radius:

- **0px:** full-bleed campaign sections, navigation bands, and image-led tiles.
- **6–8px:** text inputs, selects, and precision utility controls.
- **12px:** product cards, panels, media frames, and dialog surfaces.
- **Pill:** primary storefront CTAs, filter chips, badges, and color swatches
  only. Do not make every control a pill.
- Keep the same radius grammar within a component family. A route should not
  mix arbitrary rounded shapes to imply importance.

Existing admin components retain their established compact radii until a token
or primitive migration is explicitly approved.

### Borders and elevation

The default storefront surface is flat. Use a visible hairline to establish
structure when spacing is not enough.

- Do not add drop shadows to ordinary product cards or information panels.
- Reserve meaningful shadow for dialogs, sheets, menus, and other true overlays.
- A subtle backdrop blur is allowed for a sticky navigation or mobile purchase
  bar when it serves layering; it is not a general glassmorphism treatment.
- Use surface changes, image crops, and whitespace before adding a shadow.
- Do not use decorative gradients, glows, or patterned backgrounds.

## 8. Information architecture by surface

### Global storefront navigation

Use a quiet, predictable header:

1. Optional utility strip for shipping, support, or account messaging.
2. Main navigation with the KOA wordmark, primary categories, search, account,
   and bag actions.
3. A mobile drawer or sheet that preserves category order and keeps the bag
   action easy to reach.
4. A category sub-navigation on listing pages with breadcrumb, filter, and sort
   controls.

Navigation should be sticky only when it helps orientation or checkout. Do not
let a large navigation stack consume the product viewport.

### Home page

Recommended content rhythm:

1. **Hero:** one product or campaign message, one primary CTA, and enough
   negative space for the image to read.
2. **Category or collection rail:** quick routes into the shop without turning
   every category into a large decorated card.
3. **Featured products:** a scannable product grid with a clear section heading.
4. **Editorial split:** one strong image and one concise story, with a single
   route onward.
5. **Service reassurance:** shipping, returns, fit, or membership information in
   a quiet horizontal band.
6. **Footer:** organized links, policy/legal information, and a restrained
   visual close.

Do not place several competing hero CTAs, promotional popups, and dense feature
cards above the first real product decision.

### Product listing (PLP)

Use a predictable decision hierarchy:

1. Breadcrumb or category context.
2. Page title and a short, useful description.
3. Filter, sort, and result count controls.
4. Product grid.
5. Pagination or load-more behavior with a stable scroll position.
6. Related categories or recently viewed products only when they do not compete
   with the primary result set.

On desktop, filters may use a compact sidebar. On narrow screens, move them
into a clearly labeled sheet with a persistent apply/reset path. Selected
filters should remain visible as removable chips or a concise summary.

### Product detail (PDP)

Use a two-column desktop composition and a stacked mobile composition:

- Gallery or primary media first.
- Product name, price, and a short benefit statement.
- Color and size selectors with visible selected state and accessible labels.
- Availability, delivery, returns, and care information close to the purchase
  decision.
- One primary add-to-bag action, with a clear pending and success state.
- Secondary actions such as wishlist or share remain quiet and never compete
  with purchase.

Keep variant selection in a stable order. Do not hide required size or color
information behind hover, a tooltip, or an unlabeled icon.

### Cart and checkout

Checkout is a focused, low-distraction surface:

- Keep the purchase summary, shipping address, payment, and review steps obvious.
- Use one primary action per step and place it where the next decision is made.
- Keep order total, discounts, taxes, and delivery costs visible and labeled.
- Validate inline, close to the field, and never clear a user's entered data on
  failure.
- On mobile, keep the primary action reachable without hiding the summary; use
  a deliberate expand/collapse pattern for the order breakdown.

### Account

Use calm, spacious navigation and predictable record rows. Account pages may be
more generous than admin pages, but they should remain scannable. Use headings,
status, dates, and actions in a consistent order.

### Admin

Admin is an operational surface, not a campaign page. Follow the current root
`DESIGN.md` rules for the admin shell, tables, dialogs, forms, and product
configuration:

- Keep the canvas quiet, neutral, compact, and data-first.
- Keep admin headings in sentence case and controls compact.
- Prefer borders and whitespace to card elevation.
- Use semantic status colors only for status, success, and errors.
- Reuse the existing `PageHeader`, `KoaTable`, form helpers, item rows, and
  modal patterns before creating a new visual treatment.

The campaign display face, large hero spacing, and storefront action color are
not automatically appropriate for admin. Introduce them only through an
explicit shared-token decision.

## 9. Component specifications

### Buttons

Use the existing `Button` primitive and adapt it at the feature boundary. Do
not fork a new button implementation for a single route.

| Variant | Storefront treatment | Use |
| --- | --- | --- |
| Primary action | `{colors.action}` background, white text, pill, 44–48px minimum height | Add to bag, shop, continue, submit |
| Secondary action | Canvas or transparent background, ink text, hairline border, pill or restrained radius | View details, compare, alternate route |
| Quiet action | Transparent background, ink text, minimal or no border | Wishlist, share, close, low-priority utility |
| Destructive action | Semantic danger treatment, not general emphasis | Remove, delete, cancel order |
| Disabled | Reduced emphasis, clear non-interactive state, readable label | Unavailable or invalid action |

States must be explicit:

- **Default:** the normal action grammar.
- **Hover:** subtle background or border change for pointer users; never a
  layout-changing effect.
- **Focus-visible:** a high-contrast 2–3px ring with sufficient offset.
- **Pressed:** a short color/opacity change; do not require a translate or scale
  that moves neighboring content.
- **Loading:** preserve the button's width, disable repeated submission, and
  show a spinner or specific progress label.
- **Success/error:** provide a nearby status message; do not rely on a brief
  color flash.

### Hero section

- Use a cinematic, edge-to-edge image or a clean neutral stage.
- Keep the message to one headline, one short supporting line, and one primary
  CTA unless the page has a genuine reason for two equal actions.
- Use `min-height: clamp(...)` or a content-driven layout rather than forcing
  every hero to exactly `100vh`; mobile browser chrome and short content must
  remain usable.
- Keep text in a deliberate safe area. Left-aligned editorial heroes and
  centered gallery heroes are both valid, but choose one per composition.
- Do not put a carousel in a hero without visible previous/next controls, a
  pause control when it auto-advances, and a non-carousel content alternative.

### Product card

A product card should answer four questions in a predictable order:

1. What is it?
2. What does it look like?
3. What are the available variants?
4. What does it cost, and what can I do next?

Recommended structure:

- Product image on a consistent `{colors.cloud}` stage, usually `4:5` or `1:1`
  depending on the garment category.
- Product name and category/descriptor.
- Color swatches and/or size information when useful.
- Current price, with original price and discount clearly labeled when on sale.
- One quiet product action such as view details or add to bag. The action must be
  reachable on touch devices without hover.

Keep cards flat. Do not make every card a floating rounded container with its
own shadow.

### Product grid

- Use consistent card widths, image ratios, and metadata baselines.
- Keep the grid keyboard and reading order aligned with visual order.
- Use a skeleton that preserves the final card dimensions while loading.
- Preserve the current scroll position when filters or sorting change results.
- Show a useful empty state with a clear reset-filters or browse-next action.

### Filter and category chips

- Use a compact pill with a text label; do not use color alone to indicate
  selection.
- Selected state may invert to action/ink or use a strong border plus check.
- Show counts when they help the decision, but do not hide a zero-result filter
  without explanation.
- On mobile, use a filter sheet with a clear selected-count summary.

### Color and size selectors

- Keep the selector's current value visible as text and shape, not only as a
  filled swatch.
- Pair every color swatch with an accessible name and visible selected ring.
- Keep size order consistent with the application's clothing-size order.
- Disable unavailable options semantically and explain why when practical.
- Keep selected, focus, hover, disabled, and out-of-stock states distinguishable
  without relying on color.

### Forms and inputs

- Use a visible label, a clear control boundary, helper text, and an error
  message associated with the field.
- Use 44px minimum height for storefront touch controls; compact admin
  primitives may follow the root guide's established sizes.
- Use a precise radius for text inputs and selects. Reserve pills for actions
  and option chips.
- Keep the submit action at the end of the logical form, not wherever it
  happens to fit visually.
- Preserve values and context on validation or network errors.

### Badges and status

Use badges for short, meaningful states such as `NEW`, `SALE`, `LIMITED`, or
`BACK IN STOCK`. Every badge needs readable text and a shape/border treatment;
never use an unlabelled colored dot as the only signal.

Known status mappings should be centralized rather than recreated in a feature.
For inventory and availability, prefer an icon plus a short sentence when the
state needs explanation.

### Dialogs, sheets, and toasts

- Dialogs use a concise title, one-sentence description, focused body, and clear
  footer actions.
- Use a strong scrim and a visible close action; preserve keyboard focus and
  return focus to the trigger on close.
- Toasts confirm completed actions but should not contain the only copy for an
  important error. Errors that block progress belong beside the relevant field
  or action.
- Do not stack multiple decorative overlays or use a toast for routine hover
  information.

## 10. Interaction and state model

| State | Visual treatment | Content and behavior |
| --- | --- | --- |
| Default | Neutral or action token according to hierarchy | Clear label and stable dimensions |
| Hover | Subtle background, border, or opacity change | Pointer-only enhancement; no required information appears only on hover |
| Focus-visible | High-contrast ring and offset | Keyboard users can see the current control |
| Pressed | Short color or opacity change | Feedback without moving neighboring layout |
| Selected | Action/ink inversion, border, check, or ring | State is exposed to assistive technology |
| Disabled | Reduced contrast and opacity | Control is semantically disabled and explains its condition nearby when useful |
| Loading | Spinner, progress label, or skeleton | Preserve dimensions and prevent duplicate submission |
| Empty | Plain icon, concise title, and next action | Explain what is absent and how to recover |
| Error | Semantic danger border/text and nearby message | State the problem and a way to correct it |
| Success | Semantic success border/text and icon | Confirm completion without demanding the user infer it from a flash |
| Out of stock | Muted treatment plus explicit text | Do not present an unavailable variant as selectable |
| Sale | Explicit current and original price | Include the meaning of the discount, not just red text |

### Motion

Motion is functional and restrained:

- Use approximately `150–250ms` for control feedback and `250–400ms` for
  meaningful panel or image transitions.
- Prefer opacity, color, and small non-layout-shifting transforms.
- Do not require a hover animation to reveal product information or actions.
- Avoid aggressive parallax, autoplay movement, looping decoration, and motion
  that competes with product photography.
- Respect `prefers-reduced-motion`; reduced motion should remove movement while
  preserving state changes and hierarchy.
- Any autoplay carousel must be pausable and must not move the reading order
  unexpectedly.

## 11. Responsive behavior

Use the application's standard Tailwind breakpoints as the starting point:
`sm` 640px, `md` 768px, `lg` 1024px, `xl` 1280px, and `2xl` 1536px.

| Range | Navigation | Product grid | PDP and forms | Editorial rhythm |
| --- | --- | --- | --- | --- |
| `<640px` | Drawer/sheet; keep logo, menu, bag reachable | One column | Stack all decision blocks; keep primary action reachable | Reduce section padding, preserve image focus |
| `640–767px` | Compact header or drawer | Two columns when images remain legible | Two-column fields only when labels and controls fit | 40–48px section gaps |
| `768–1023px` | Full or compact header; filter sheet as needed | Three columns | Split gallery/details where space allows | 48–64px section gaps |
| `1024–1279px` | Full navigation | Four columns with comfortable gutters | Two-column PDP with sticky purchase summary | 64px section gaps |
| `1280px+` | Full navigation and search | Four columns, wider stage/gutters | Full two-column PDP | 64–96px section gaps |

Additional rules:

- Maintain a minimum 44×44px touch target, even when the visible icon is
  smaller.
- Use explicit image aspect ratios to prevent content jumping as images load.
- Preserve horizontal reading order in the DOM when visual order changes.
- Never hide a critical price, availability state, filter result, or error
  behind a hover interaction.
- Test long product names, translated labels, zoomed text, landscape phones, and
  tablet widths—not only the default desktop viewport.

## 12. Accessibility and inclusive content

Target WCAG 2.2 AA for all KOA surfaces.

- Body text must meet at least 4.5:1 contrast; large text and essential UI
  graphics should meet at least 3:1, subject to the applicable criteria.
- All controls must be keyboard reachable and show a visible focus indicator.
- Use semantic headings, landmarks, labels, fieldsets, and native button/link
  behavior. A clickable `div` is not a button.
- Use `aria-live` or an equivalent status pattern for async results, search
  counts, and form submission feedback where the update is not otherwise
  announced.
- Every icon-only control needs an accessible name. A tooltip is not a
  replacement for a label.
- Pair status color with text, iconography, shape, or native state.
- Use descriptive alt text for meaningful product imagery and empty alt text
  for decorative imagery.
- Do not rely on color swatches alone; provide names and selected state.
- Keep focus order logical when a dialog, sheet, or mobile drawer opens, and
  return focus to the trigger when it closes.
- Support browser zoom and text enlargement without clipping controls or
  forcing horizontal scrolling.
- Use `prefers-reduced-motion` and avoid flashing or rapidly changing content.
- Do not use urgency, scarcity, or promotional language that the product data
  cannot substantiate.

## 13. Brand voice and content rules

KOA sounds **precise, confident, human, and economical**.

- Prefer short sentences and concrete details: material, fit, use, care,
  delivery, and returns.
- Use active voice: “Choose your size” rather than “Your size may be selected.”
- Use “Add to bag” or “Shop now” for clear actions; avoid “Buy now!!!” and
  unexplained urgency.
- Use athletic language without clichés. Prefer “Built for movement” over
  generic “unleash your potential” language when the product supports it.
- Do not make unsupported performance, sustainability, health, or authenticity
  claims.
- Keep navigation and UI labels short and scannable. Keep error messages
  specific and recoverable.
- Use sentence case for product and interface copy. Uppercase is a campaign
  typographic treatment, not a default voice.
- Write microcopy that tells the user what happens next, especially for
  variants, shipping, returns, authentication, and payment.

Examples:

| Avoid | Prefer |
| --- | --- |
| “The ultimate performance tee” | “A lightweight training tee with a relaxed fit.” |
| “Hurry—only 2 left!” | “Low stock. Choose a size to see availability.” |
| “Something went wrong.” | “We couldn't save your changes. Check your connection and try again.” |
| “BUY NOW!!!” | “Add to bag” |
| “Click here” | “View product details” |

## 14. Implementation handoff

### Mapping to the current repository

- Keep architecture, API, routing, and component ownership rules in `AGENTS.md`.
- Keep durable implemented styling decisions in this guide.
- Use `app/globals.css` for theme variables and Tailwind v4 `@theme inline`
  mappings; do not create a legacy `tailwind.config` file.
- Consume the existing shadcn-style primitives in `components/ui/`. They are
  built against the installed Base UI API; do not rewrite them to match a newer
  shadcn example without checking the local implementation.
- Reuse `PageHeader`, `KoaTable`, form helpers, item rows, and modal helpers for
  admin work.
- Use semantic Tailwind utilities instead of raw color classes such as
  `bg-gray-50` in new feature code. Dynamic product color data is the exception.
- Use `next/image` with meaningful `sizes`, explicit dimensions/aspect ratio,
  and responsive art direction for product media.
- Load Inter, Oswald, and Geist Mono in the root layout; consume Oswald only for
  storefront campaign/editorial surfaces and keep admin/account UI on Inter.
  Measure the font payload before adding any further display face.
- Update this guide in the same change when a new token, primitive,
  or cross-surface visual decision becomes implemented and durable.

### Suggested semantic alias direction

The following is a naming direction, not a request to paste raw values into JSX:

```css
:root {
  --koa-canvas: var(--koa-primitive-canvas);
  --koa-surface: var(--koa-primitive-canvas);
  --koa-surface-muted: var(--koa-primitive-cloud);
  --koa-ink: var(--koa-primitive-ink);
  --koa-ink-secondary: var(--koa-primitive-graphite);
  --koa-ink-muted: var(--koa-primitive-pewter);
  --koa-line: var(--koa-primitive-hairline);
  --koa-action: var(--koa-primitive-action);
  --koa-action-hover: var(--koa-primitive-action-pressed);
  --koa-focus: var(--koa-primitive-action);
  --koa-success: var(--koa-primitive-success);
  --koa-danger: var(--koa-primitive-sale);
  --koa-warning: var(--koa-primitive-warning);
}
```

Use the token layer for definitions and semantic utilities for components. Do
not create a parallel design system inside a feature directory.

## 15. Do and do not

### Do

- Let product photography occupy the visual center of gravity.
- Alternate generous editorial spacing with compact, highly scannable commerce
  sections.
- Use bold uppercase type for a small number of campaign moments and strong,
  readable UI type everywhere else.
- Use one high-contrast action color and reserve it for meaningful next steps.
- Make the selected variant, current price, availability, and primary action
  visible without opening a menu.
- Use flat cards, hairlines, and surface changes before adding elevation.
- Give loading, empty, error, disabled, success, and destructive states an
  intentional design.
- Test every significant surface at 375px, 768px, 1024px, and wide desktop
  widths, plus dark mode and reduced motion.

### Do not

- Do not copy Nike, Apple, Shopify, Tesla, or any other brand's exact assets,
  proprietary fonts, copy, or visual identity.
- Do not use gradients, glassmorphism, glows, or excessive shadows as a default
  way to make a surface feel premium.
- Do not make every element uppercase, pill-shaped, bordered, or shadowed.
- Do not place multiple competing primary CTAs in one viewport or purchase step.
- Do not hide essential product information, filters, or actions behind hover.
- Do not use product colors as a substitute for semantic UI states.
- Do not introduce raw colors, arbitrary spacing, or one-off typography into a
  single route.
- Do not redesign the admin shell to look like a marketing landing page.
- Do not claim a product benefit, scarcity signal, discount, or delivery promise
  that the underlying data does not support.

## 16. Agent implementation checklist

Before completing a KOA user-facing change, verify that:

- [ ] This guide was read before implementation.
- [ ] The change fits one of the reference principles without copying a
      reference brand.
- [ ] Product photography and product identity remain the visual priority.
- [ ] Existing semantic tokens, primitives, and established component patterns
      were reused.
- [ ] Raw color, spacing, radius, and typography values were added only to the
      token layer when a deliberate new decision is being made.
- [ ] There is one clear primary action per decision point.
- [ ] The layout works at narrow phone, tablet, desktop, and wide desktop sizes.
- [ ] Light and dark themes, focus-visible, hover, pressed, disabled, loading,
      empty, error, success, and destructive states were considered.
- [ ] Keyboard navigation, accessible names, contrast, reduced motion, and
      non-color status cues were checked.
- [ ] Product imagery has stable dimensions, useful alt text, and no layout
      shift.
- [ ] No essential interaction depends on hover, a tooltip, or a carousel.
- [ ] Any new reusable visual decision is documented in this guide
      when it becomes part of the implemented system.

## 17. Open decisions

The following decisions remain open and must be resolved with evidence from the
API contract or rendered prototypes:

- The final product-image ratios and art direction by garment category.
- The public product, media, inventory, variant-price, bag, and checkout
  contracts required before commerce routes can be implemented honestly.
- The exact treatment of the mobile filter sheet and sticky purchase bar.
- The storefront currency and the display semantics of list, selling, discount,
  and tax-inclusive prices.
- Rendered light/dark contrast validation across every semantic state and
  product/data-color combination.

Resolve these through small, documented token or contract changes and
user-facing prototypes. Do not resolve them by creating a parallel component
style.