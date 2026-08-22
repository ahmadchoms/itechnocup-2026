import { ReviewCard } from "./ReviewCard";
import type { ProfileReview } from "./types";

interface ReviewsCardProps {
  reviews: ProfileReview[];
}

export function ReviewsCard({ reviews }: ReviewsCardProps) {
  return (
    <div className="space-y-6 rounded-[32px] border border-zinc-200 bg-white p-6 shadow-xs sm:p-8">
      <div>
        <h2 className="font-[family-name:var(--font-display)] text-lg font-bold tracking-tight text-[#171717] sm:text-xl">
          Ulasan &amp; Penilaian Diterima
        </h2>
        <p className="mt-0.5 text-xs text-[#78766B]">
          Umpan balik asli dari transaksi jual-beli sampah yang telah selesai.
        </p>
      </div>

      {reviews.length === 0 ? (
        <div className="py-8 text-center text-xs text-[#78766B]">
          Belum ada ulasan yang diterima.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      )}
    </div>
  );
}
