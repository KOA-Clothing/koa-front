export interface PriceBreakdown {
  /** Customer-facing price after the discount is applied. */
  finalPrice: number;
  /** Absolute discount taken off the selling price. */
  discountAmount: number;
  /** Profit (positive) or loss (negative) based on the discounted price vs cost. */
  profitLoss: number;
  /** Profit/loss as a percentage of the cost price. */
  profitLossPercentage: number;
}

/**
 * Derives customer-facing and margin figures from a product's pricing.
 *
 * - Final price = sellingPrice * (1 - discountPercentage / 100)
 * - Discount amount = sellingPrice - finalPrice
 * - Profit/loss = finalPrice - costPrice
 * - Profit/loss % = (profitLoss / costPrice) * 100
 */
export function calculatePriceBreakdown(
  costPrice: number,
  sellingPrice: number,
  discountPercentage: number
): PriceBreakdown {
  const finalPrice = sellingPrice * (1 - discountPercentage / 100);
  const discountAmount = sellingPrice - finalPrice;
  const profitLoss = finalPrice - costPrice;
  // ponytail: cost price of 0 makes the % undefined; return 0 so the admin
  // table never renders Infinity/NaN. Provide a proper sentinel if real 0-cost
  // products are expected.
  const profitLossPercentage =
    costPrice !== 0 ? (profitLoss / costPrice) * 100 : 0;

  return {
    finalPrice,
    discountAmount,
    profitLoss,
    profitLossPercentage,
  };
}