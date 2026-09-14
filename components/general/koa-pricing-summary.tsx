import { calculatePriceBreakdown } from "@/lib/pricing/price-calculations";
import KoaViewOnlyField from "@/components/general/koa-view-only-field";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const roundToTwo = (value: number) => Math.round(value * 100) / 100;

interface KoaPricingSummaryProps {
  costPrice: number;
  sellingPrice: number;
  discountPercentage: number;
}

export default function KoaPricingSummary({
  costPrice,
  sellingPrice,
  discountPercentage,
}: KoaPricingSummaryProps) {
  const breakdown = calculatePriceBreakdown(
    costPrice,
    sellingPrice,
    discountPercentage
  );
  const isProfit = breakdown.profitLoss >= 0;
  const pnlColor = isProfit ? "text-emerald-600" : "text-red-600";

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-emerald-600/20 bg-emerald-600/5 p-4">
      <h3 className="text-sm font-semibold text-foreground">Pricing Summary</h3>
      <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-x-6">
        <KoaViewOnlyField
          label="Final price"
          value={
            <span className="text-lg font-semibold text-emerald-600">
              {currencyFormatter.format(breakdown.finalPrice)}
            </span>
          }
        />
        <KoaViewOnlyField
          label="Discount amount"
          value={currencyFormatter.format(breakdown.discountAmount)}
        />
        <KoaViewOnlyField
          label="Profit / loss"
          value={
            <span className={pnlColor}>
              {currencyFormatter.format(breakdown.profitLoss)}
            </span>
          }
        />
        <KoaViewOnlyField
          label="Profit / loss %"
          value={
            <span className={pnlColor}>
              {roundToTwo(breakdown.profitLossPercentage)}%
            </span>
          }
        />
      </dl>
    </div>
  );
}