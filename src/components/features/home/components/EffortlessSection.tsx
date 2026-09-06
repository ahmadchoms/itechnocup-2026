import Image from "next/image";
import { leftFeatures, rightFeatures } from "../data/home.data";
import type { FeatureItem } from "../types/home.types";

function FeatureCard({ icon: Icon, iconBg, iconColor, title, description }: FeatureItem) {
  return (
    <div className="flex flex-col items-center text-center md:items-start md:text-left gap-3 max-w-xs mx-auto md:mx-0">
      <span
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${iconBg} ${iconColor} shadow-xs`}
        aria-hidden="true"
      >
        <Icon className="h-5 w-5" strokeWidth={2} />
      </span>
      <h3 className="text-base font-bold text-slate-900">{title}</h3>
      <p className="text-sm leading-relaxed text-slate-500">{description}</p>
    </div>
  );
}

export function EffortlessSection() {
  return (
    <section aria-labelledby="effortless-heading" className="w-full bg-white px-6 pt-8 pb-16 sm:pt-12 sm:pb-24 rounded-4xl border border-slate-100 shadow-2xs">
      <div className="mx-auto max-w-6xl text-center">
        <h2 id="effortless-heading" className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
          Mudah tanpa ribet
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-sm text-slate-500 sm:text-base">
          Dengan teknologi AI pengenal limbah dan sistem lokasi terpadu, DaurNusa membuat proses
          menjual limbah daur ulang jadi praktis dan transparan.
        </p>
      </div>

      <div className="mx-auto mt-16 grid max-w-6xl grid-cols-1 items-center gap-12 md:grid-cols-[1fr_minmax(260px,340px)_1fr] md:gap-8">
        <div className="order-2 grid grid-cols-1 gap-10 sm:grid-cols-2 md:order-1 md:grid-cols-1 md:gap-16">
          {leftFeatures.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </div>

        <div className="relative order-1 mx-auto aspect-square w-full max-w-[340px] md:order-2">
          <Image
            src="https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=800&q=80"
            alt="Tumpukan botol plastik dan kertas siap didaur ulang"
            fill
            sizes="(max-width: 768px) 90vw, 340px"
            className="rounded-[32px] object-cover shadow-xl"
            priority
          />
        </div>

        <div className="order-3 grid grid-cols-1 gap-10 sm:grid-cols-2 md:grid-cols-1 md:gap-16">
          {rightFeatures.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
}
