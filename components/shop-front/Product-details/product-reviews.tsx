import { Star } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const mockReviews = [
  {
    id: "1",
    name: "Sarah Johnson",
    rating: 5,
    date: "2 weeks ago",
    comment: "Great quality fabric and perfect fit! The colors are exactly as shown.",
  },
  {
    id: "2",
    name: "Mike Chen",
    rating: 4,
    date: "1 month ago",
    comment: "Comfortable to wear all day. Sizing runs true to size.",
  },
  {
    id: "3",
    name: "Emily Davis",
    rating: 5,
    date: "2 months ago",
    comment: "Love this piece! Will definitely buy more colors.",
  },
];

export default function ProductReviews() {
  const averageRating = mockReviews.reduce((sum, r) => sum + r.rating, 0) / mockReviews.length;

  return (
    <div className="flex flex-col gap-8 border-t border-border pt-12">
      <div className="flex flex-col gap-4">
        <h2 className="text-2xl font-bold tracking-tight">Customer Reviews</h2>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`size-5 ${
                  i < Math.floor(averageRating)
                    ? "fill-foreground text-foreground"
                    : "text-muted-foreground"
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-muted-foreground">
            {averageRating.toFixed(1)} out of 5 ({mockReviews.length} reviews)
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        {mockReviews.map((review) => (
          <div key={review.id} className="flex flex-col gap-3 border-b border-border pb-6 last:border-0">
            <div className="flex items-start gap-3">
              <Avatar>
                <AvatarFallback>
                  {review.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-1 flex-col gap-1">
                <div className="flex items-center justify-between">
                  <p className="font-semibold">{review.name}</p>
                  <p className="text-sm text-muted-foreground">{review.date}</p>
                </div>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`size-4 ${
                        i < review.rating
                          ? "fill-foreground text-foreground"
                          : "text-muted-foreground"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {review.comment}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
