interface PriceHighlightCardProps {
    price: number;
    unit: string;
    quantityWanted?: number | null;
}

export function PriceHighlightCard({ price, unit, quantityWanted }: PriceHighlightCardProps) {
    return (
        <div className="rounded-[28px] border border-black/5 bg-white p-6 shadow-[0_2px_16px_-4px_rgba(23,23,23,0.06)]">
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-sage p-5">
                <div>
                    <span className="block text-[11px] font-semibold uppercase tracking-[0.08em] text-[#6B7B4F]">
                        Penawaran Harga Pengepul
                    </span>
                    <div className="mt-1 flex items-baseline gap-1.5">
                        <span className="text-3xl font-extrabold tracking-tight text-[#171717]">
                            Rp {price.toLocaleString("id-ID")}
                        </span>
                        <span className="text-[12px] font-semibold text-[#6B7B4F]">/ {unit}</span>
                    </div>
                </div>

                <div className="text-right">
                    <span className="block text-[11px] font-semibold uppercase tracking-[0.08em] text-[#78766B]">
                        Total Dibutuhkan
                    </span>
                    <span className="mt-1 block text-lg font-bold text-[#171717]">
                        {quantityWanted ? `${quantityWanted} ${unit}` : "Tidak Terbatas"}
                    </span>
                </div>
            </div>

        </div>
    );
}