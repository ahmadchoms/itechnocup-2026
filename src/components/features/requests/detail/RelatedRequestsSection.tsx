import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { RequestCard } from "@/components/features/requests/RequestCard";
import type { WasteRequest } from "@/types/waste-request";

interface RelatedRequestsSectionProps {
    requests: WasteRequest[];
}

export function RelatedRequestsSection({ requests }: RelatedRequestsSectionProps) {
    if (requests.length === 0) return null;

    return (
        <div className="space-y-4 border-t border-black/5 pt-8">
            <div className="flex items-center justify-between">
                <h3 className="text-[17px] font-bold tracking-tight text-[#171717]">
                    Permintaan Sampah Serupa Lainnya
                </h3>
                <Link
                    href="/requests"
                    className="flex items-center gap-1 text-[12.5px] font-semibold text-[#6B7B4F] hover:text-[#556140]"
                >
                    Lihat Semua
                    <ChevronRight className="h-4 w-4" aria-hidden="true" />
                </Link>
            </div>

            <ul className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {requests.map((req) => (
                    <RequestCard key={req.id} request={req} />
                ))}
            </ul>
        </div>
    );
}