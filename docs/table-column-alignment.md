# Table Column Alignment Rules

Use these rules consistently across all admin tables.

## General Rules
- **Actions column**: Header and cell MUST be centered.
- **Text content**: Header and cell MUST be left aligned (e.g., product name, category name, variant labels that are descriptive text).
- **Numeric values**: Header and cell MUST be right aligned (e.g., quantity, reserved quantity, price, counts). For "not configured" numeric fields use an em dash (`—`) and keep it right aligned.
- **Enum/badge/status values**: Header and cell MUST be centered (e.g., statuses, sizes/colors displayed as badges/enums).
- **Dates**: Header and cell MUST be right aligned unless there's a strong reason to center (follow numeric/date convention).

## Implementation
- Use TanStack Table `columnDef.meta.headerClassName` and `columnDef.meta.cellClassName` with utility classes (e.g., `text-left`, `text-right`, `text-center`, `w-full`, `justify-end`).
- For sortable headers, pass alignment via `DataTableSortButton` className (supported). For non-sortable, wrap in a flex div with alignment.
- Keep cell content wrapping minimal; prefer aligning the cell/header container rather than only inner divs.
- When a numeric cell can be `null` (e.g., "not configured"), render `—` in a right-aligned container.
- Actions cells use centered flex with icon buttons.

## Examples
- Collections items: product/category text → left/center as appropriate; prices/dates → right; actions → center.
- Inventory: product name left, variant left, quantity/reserved right, low stock threshold left per current requirement, actions center.
