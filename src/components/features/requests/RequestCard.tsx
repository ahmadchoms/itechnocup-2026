import Link from "next/link";
import { ArrowUpRight, MapPin } from "lucide-react";
import { getCategoryAccent } from "@/lib/category-accent";
import type { WasteRequest } from "@/types/waste-request";

interface RequestCardProps {
    request: WasteRequest;
}

export function RequestCard({ request }: RequestCardProps) {
    const accent = getCategoryAccent(request.categoryId);
    const createdAt = new Date(request.createdAt);
    const formattedDate = createdAt.toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "short",
    });

    return (
        <li className="list-none h-full">
            <div className="group relative flex h-full flex-col justify-between rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#171717]/20 hover:shadow-xl">

                <div className="flex flex-1 flex-col">
                    <div className="flex items-center justify-between gap-3">
                        <span
                            className="block max-w-[65%] truncate rounded-full px-3 py-1 text-[11px] font-semibold tracking-wide"
                            style={{ backgroundColor: accent.bg, color: accent.fg }}
                            title={request.category?.name ?? "Lainnya"}
                        >
                            {request.category?.name ?? "Lainnya"}
                        </span>
                        <time
                            dateTime={createdAt.toISOString()}
                            className="shrink-0 text-[11px] font-medium text-[#8A8778]"
                        >
                            {formattedDate}
                        </time>
                    </div>

                    <div className="mt-4">
                        <h3
                            className="text-lg font-bold leading-snug tracking-tight text-[#171717] transition-colors group-hover:text-[#2B2B26] line-clamp-2"
                            title={request.title}
                        >
                            {request.title}
                        </h3>
                        <p className="mt-2 text-[13px] leading-relaxed text-[#78766B] line-clamp-2">
                            {request.description || "Tidak ada deskripsi."}
                        </p>
                    </div>

                    <div className="flex-1" />

                    <div className="mt-5 rounded-2xl border border-zinc-200 bg-white p-4">
                        <div className="flex items-center justify-between gap-4">
                            <div>
                                <span className="text-[10px] font-semibold uppercase tracking-wider text-[#8A8778]">
                                    Harga Tawaran
                                </span>
                                <div className="mt-0.5 flex items-baseline gap-1">
                                    <span className="text-xl font-extrabold tracking-tight text-[#171717]">
                                        Rp {request.offeredPrice.toLocaleString("id-ID")}
                                    </span>
                                    <span className="text-xs font-medium text-[#8A8778]">
                                        /{request.unit}
                                    </span>
                                </div>
                            </div>

                            <div className="h-8 w-px bg-zinc-200" />

                            <div className="text-right">
                                <span className="text-[10px] font-semibold uppercase tracking-wider text-[#8A8778]">
                                    Kebutuhan
                                </span>
                                <p className="mt-0.5 text-[14px] font-bold text-[#171717]">
                                    {request.quantityWanted
                                        ? `${request.quantityWanted} ${request.unit}`
                                        : "—"}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-3.5 min-h-[20px]">
                        {request.address && (
                            <div className="flex items-center gap-1.5 px-1 text-[12px] text-[#78766B]">
                                <MapPin className="h-3.5 w-3.5 shrink-0 text-[#7A8F5C]" aria-hidden="true" />
                                <span className="truncate">{request.address}</span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="mt-6 border-t border-zinc-200 pt-4">
                    <Link
                        href={`/requests/${request.id}`}
                        aria-label={`Lihat detail permintaan ${request.title}`}
                        className="flex w-full items-center justify-between rounded-full bg-[#171717] p-1.5 pl-5 text-white transition-all duration-300 hover:bg-[#2B2B26] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#171717]"
                    >
                        <span className="text-xs font-semibold tracking-wide">
                            Lihat Detail
                        </span>
                        <span
                            aria-hidden="true"
                            className="flex h-8 w-8 items-center justify-center rounded-full bg-[#7A8F5C] text-white transition-transform duration-300 group-hover:rotate-45"
                        >
                            <ArrowUpRight className="h-4 w-4" />
                        </span>
                    </Link>
                </div>
            </div>
        </li>
    );
}