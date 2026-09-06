import Image from "next/image";
import { useCases } from "../data/home.data";

export function SecondLifeSection() {
  return (
    <section aria-labelledby="second-life-heading" className="w-full bg-white px-6 pt-8 pb-16 sm:pt-12 sm:pb-24 rounded-4xl border border-slate-100 shadow-2xs">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-xl">
          <h2 id="second-life-heading" className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-5xl leading-tight">
            Memberi limbah
            <br />
            kehidupan kedua
          </h2>
          <p className="mt-4 text-sm text-slate-500 sm:text-base leading-relaxed">
            Ubah sampah rumah tangga &amp; komersial menjadi sumber daya bernilai yang
            mendukung ekonomi sirkular dan komunitas hijau yang berkelanjutan.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2">
          {useCases.map((item) => (
            <figure key={item.title} className={`flex flex-col gap-4 ${item.spanClass}`}>
              <div className={`relative w-full overflow-hidden rounded-[28px] bg-slate-100 ${item.aspectClass} shadow-xs`}>
                <Image
                  src={item.image}
                  alt={item.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover hover:scale-103 transition-transform duration-500"
                />
              </div>
              <figcaption>
                <h3 className="text-lg font-bold text-slate-900">{item.title}</h3>
                <p className="mt-1 text-sm text-slate-500 leading-relaxed">{item.description}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
