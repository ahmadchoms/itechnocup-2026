import Image from "next/image";
import { Quote, Star } from "lucide-react";
import { reviews } from "../data/home.data";
import type { ReviewItem } from "../types/home.types";

function ReviewCard({ name, role, avatar, quote }: ReviewItem) {
  return (
    <div className="p-6 rounded-[24px] bg-[#F6F8F6] border border-slate-200/80 space-y-3 shadow-xs">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="relative w-9 h-9 rounded-full overflow-hidden border border-slate-200 bg-slate-100 shrink-0">
            <Image
              src={avatar}
              alt={name}
              fill
              sizes="36px"
              className="object-cover"
            />
          </div>
          <div>
            <span className="font-bold text-xs text-slate-900 block">{name}</span>
            <span className="text-[10px] text-slate-500 font-medium">{role}</span>
          </div>
        </div>
        <div className="flex text-amber-400" aria-label="Rating 5 dari 5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
          ))}
        </div>
      </div>
      <p className="text-xs text-slate-700 italic leading-relaxed">{quote}</p>
    </div>
  );
}

export function TestimonialsSection() {
  return (
    <section aria-labelledby="testimonials-heading" className="bg-white rounded-[36px] border border-slate-200/80 p-8 sm:p-12 shadow-2xs space-y-10">
      <div className="text-center space-y-2 max-w-md mx-auto">
        <h2 id="testimonials-heading" className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Dipercaya Warga &amp; Pelaku Usaha
        </h2>
        <p className="text-xs sm:text-sm text-slate-500">
          Cerita nyata dari penjual dan pembeli sampah sirkular di platform DaurNusa
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch">
        <div className="md:col-span-5 relative overflow-hidden rounded-[28px] border border-slate-200/80 shadow-xs aspect-4/5">
          <Image
            src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=700"
            alt="Pak Tani Ungaran"
            fill
            sizes="(max-width: 768px) 100vw, 40vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/25 to-transparent" />

          <Quote className="absolute right-6 top-6 h-10 w-10 text-white/15" strokeWidth={2.5} aria-hidden="true" />

          <div className="absolute inset-x-6 bottom-6 space-y-1.5 text-white">
            <p className="text-sm italic leading-snug text-slate-100">
              &quot;Sangat terbantu mendapatkan ampas kopi segar dari cafe Semarang untuk bahan pupuk kompos perkebunan organik.&quot;
            </p>
            <div className="flex items-center justify-between border-t border-white/20 pt-3">
              <div>
                <span className="block text-sm font-extrabold">Pak Tani Ungaran</span>
                <span className="text-xs font-medium text-emerald-300">Pembeli Rutin Ampas Kopi</span>
              </div>
              <span className="flex items-center gap-1 text-xs font-bold text-amber-300">
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                5.0
              </span>
            </div>
          </div>
        </div>

        <div className="md:col-span-7 flex flex-col justify-center gap-6">
          {reviews.map((review) => (
            <ReviewCard key={review.name} {...review} />
          ))}
        </div>
      </div>
    </section>
  );
}
