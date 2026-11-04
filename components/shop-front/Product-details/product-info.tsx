import type { ProductDetailsDto } from "@/types/product";
import DesignBadge from "@/components/shop-front/design-badge";
import ProductMetaBadges from "@/components/shop-front/product-meta-badges";
import ProductAudience from "@/components/shop-front/product-audience";
import ProductCareInfo from "@/components/shop-front/product-care-info";

export function calculatePriceBreakdown(sellingPrice: number, discountPercentage: number) {
  const hasDiscount = discountPercentage > 0;
  const finalPrice = sellingPrice * (1 - discountPercentage / 100);
  return { hasDiscount, finalPrice };
}

export function formatPrice(price: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
}

interface ProductInfoProps {
  product: ProductDetailsDto;
}

export default function ProductInfo({ product }: ProductInfoProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <ProductMetaBadges
          categoryName={product.category.name}
          isFeatured={product.isFeatured}
          status={product.status}
        />
        <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl lg:text-5xl">
          {product.name}
        </h1>
        <ProductAudience gender={product.gender} ageGroup={product.ageGroup} />
      </div>

      {product.description && (
        <div className="prose prose-sm max-w-none text-muted-foreground">
          <p className="whitespace-pre-wrap">{product.description}</p>
        </div>
      )}

      {product.designs && product.designs.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {product.designs.map((design) => (
            <DesignBadge key={design.id} design={design} />
          ))}
        </div>
      )}

      <ProductCareInfo
        material={product.material}
        careInstructions={product.careInstructions}
      />
    </div>
  );
}
