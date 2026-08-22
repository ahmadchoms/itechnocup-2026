import { Star } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { formatIdDate } from "@/lib/format";
import type { ProfileReview } from "./types";

interface ReviewCardProps {
  review: ProfileReview;
}

export function ReviewCard({ review }: ReviewCardProps) {
  return (
    <Card className="space-y-3 rounded-2xl border border-zinc-200 bg-[#F7F4EE]/60 p-4 shadow-none sm:p-5">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <Avatar className="h-9 w-9 border border-zinc-200">
            <AvatarImage
              src={
                review.reviewer?.avatarUrl ||
                "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120"
              }
              alt={review.reviewer?.fullName || "Reviewer"}
              className="object-cover"
            />
            <AvatarFallback className="bg-zinc-200 text-xs font-bold text-[#171717]">
              {review.reviewer?.fullName?.slice(0, 2).toUpperCase() || "DN"}
            </AvatarFallback>
          </Avatar>

          <div>
            <span className="block text-xs font-bold text-[#171717]">
              {review.reviewer?.fullName || "Pengguna DaurNusa"}
            </span>
            <span className="block font-mono text-[10.5px] text-[#8A8778]">
              {formatIdDate(review.createdAt)}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1 rounded-full bg-[#FEF3D6] px-2.5 py-0.5 text-xs font-bold text-[#C98A0B]">
          <Star className="h-3.5 w-3.5 fill-[#C98A0B] text-[#C98A0B]" />
          <span>{review.rating}.0</span>
        </div>
      </div>

      <p className="text-xs italic leading-relaxed text-[#3F3D38] sm:text-[12.5px]">
        &ldquo;{review.comment}&rdquo;
      </p>
    </Card>
  );
}
