import { clothingSizeLabels } from "./enum-labels";
import type { ClothingSize } from "./enums";
import type {
  ProductDetailsDto,
  ProductDetailsImageDto,
  ProductDetailsVariantDto,
} from "./product";

/**
 * One line in the cart: a snapshot of the inventory item the customer picked.
 *
 * The cart is a purely client-side concern, so everything the drawer renders is
 * copied in at add time instead of being looked up again. A price or name
 * change in the back office must not silently mutate a cart the customer has
 * already filled, and the drawer must render without another request.
 */
export interface CartItem {
  /** Stock row id — the cart's identity for a line (one inventory row per variant). */
  inventoryId: string;
  productId: string;
  productName: string;
  variantId: string;
  colorId: string;
  colorName: string | null;
  size: ClothingSize;
  sku: string;
  /** Resolved at add time: the variant's colour image, else the primary image. */
  imageUrl: string | null;
  imageAlt: string;
  /** Pre-discount unit price. */
  sellingPrice: number;
  discountPercentage: number;
  quantity: number;
  /** Stock ceiling captured when added; merged quantities are clamped to it. */
  maxQuantity: number;
}

/**
 * Picks the image a cart line should show: the one linked to the selected
 * variant's colour, falling back to the product's primary image, then to any
 * image at all. `null` means the product has no images, which the cart item
 * renders as the shared "no image" placeholder.
 */
export function resolveCartItemImage(
  images: ProductDetailsImageDto[],
  colorId: string
): ProductDetailsImageDto | null {
  return (
    images.find((image) => image.colorId === colorId) ??
    images.find((image) => image.isPrimary) ??
    images[0] ??
    null
  );
}

/**
 * "Blue · S" — the variant portion of a cart line, shared by the row and the
 * add/remove toasts so one item is always described the same way.
 */
export function describeCartVariant(
  item: Pick<CartItem, "colorName" | "size">
): string {
  return [item.colorName, clothingSizeLabels[item.size]]
    .filter(Boolean)
    .join(" · ");
}

/** Builds the cart line for the variant and quantity the customer selected. */
export function toCartItem(
  product: ProductDetailsDto,
  variant: ProductDetailsVariantDto,
  quantity: number
): CartItem {
  const image = resolveCartItemImage(product.images, variant.colorId);
  const color = product.colors.find((entry) => entry.id === variant.colorId);

  return {
    inventoryId: variant.inventoryId,
    productId: product.id,
    productName: product.name,
    variantId: variant.id,
    colorId: variant.colorId,
    colorName: color?.name ?? null,
    size: variant.size,
    sku: variant.sku,
    imageUrl: image?.imageUrl ?? null,
    imageAlt: image?.altText || product.name,
    sellingPrice: product.sellingPrice,
    discountPercentage: product.discountPercentage,
    quantity,
    maxQuantity: variant.availableQuantity,
  };
}
