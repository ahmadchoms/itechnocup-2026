import { CheckCircle2, Package } from "lucide-react";

interface SpecificationCardProps {
    description?: string | null;
    unit: string;
}

export function SpecificationCard({ description, unit }: SpecificationCardProps) {
    return (
        <div className="rounded-[28px] border border-black/5 bg-white p-6 shadow-[0_2px_16px_-4px_rgba(23,23,23,0.06)]">
            <h3 className="flex items-center gap-2 border-b border-black/5 pb-3 text-[13px] font-bold uppercase tracking-[0.06em] text-[#171717]">
                <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-[#E8EEDD] text-[#6B7B4F]">
                    <Package className="h-3.5 w-3.5" aria-hidden="true" />
                </span>
                Spesifikasi &amp; Syarat Sampah
            </h3>

            <p className="mt-4 whitespace-pre-line text-[13.5px] leading-relaxed text-[#3F3D38]">
                {description ||
                    "Pengepul mencari sampah kategori ini dalam kondisi baik dan siap diolah/didaur ulang kembali."}
            </p>

            <div className="mt-4 grid grid-cols-1 gap-2.5 border-t border-black/5 pt-4 sm:grid-cols-2">
                <div className="flex items-center gap-2 text-[12.5px] text-[#3F3D38]">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-[#7A8F5C]" aria-hidden="true" />
                    <span>Kondisi: bersih, kering, bebas bahan berbahaya</span>
                </div>
                <div className="flex items-center gap-2 text-[12.5px] text-[#3F3D38]">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-[#7A8F5C]" aria-hidden="true" />
                    <span>Minimal penyerahan: 1 {unit}</span>
                </div>
            </div>
        </div>
    );
}