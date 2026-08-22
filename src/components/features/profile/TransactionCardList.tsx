import { Calendar } from "lucide-react";
import { Card } from "@/components/ui/card";
import { TransactionStatusBadge } from "./TransactionStatusBadge";
import { formatIdDate, formatRupiah } from "@/lib/format";
import type { ProfileTransaction } from "./types";

interface TransactionCardListProps {
  transactions: ProfileTransaction[];
  isSeller: boolean;
}

export function TransactionCardList({ transactions, isSeller }: TransactionCardListProps) {
  return (
    <div className="space-y-3 md:hidden">
      {transactions.map((tx) => (
        <Card key={tx.id} className="space-y-3 rounded-2xl border-zinc-200 bg-white p-4 shadow-2xs">
          <div className="flex items-center justify-between gap-2">
            <span className="text-sm font-bold text-[#171717]">
              {isSeller
                ? tx.buyer?.fullName || "Pengepul DaurNusa"
                : tx.seller?.fullName || "Penjual DaurNusa"}
            </span>
            <TransactionStatusBadge status={tx.status} />
          </div>

          <div className="flex items-center justify-between border-t border-zinc-100 pt-2 text-xs text-[#78766B]">
            <span>{tx.category?.name || "Limbah Sirkular"}</span>
            <span className="font-semibold text-[#171717]">
              {tx.finalQuantity || 25} {tx.unit || "kg"}
            </span>
          </div>

          <div className="flex items-center justify-between border-t border-zinc-100 pt-2">
            <div className="flex items-center gap-1 font-mono text-[11px] text-[#8A8778]">
              <Calendar className="h-3 w-3" />
              <span>{formatIdDate(tx.createdAt, { day: "2-digit", month: "short" })}</span>
            </div>
            <span className="text-sm font-extrabold text-[#171717]">
              {formatRupiah(Number(tx.finalPrice))}
            </span>
          </div>
        </Card>
      ))}
    </div>
  );
}
