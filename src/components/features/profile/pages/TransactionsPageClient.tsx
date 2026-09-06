"use client";

import Link from "next/link";
import { ArrowLeft, ReceiptText, MessageSquare } from "lucide-react";
import { displayFont, bodyFont } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import { TransactionHistoryCard } from "@/components/features/profile/TransactionHistoryCard";
import type { ProfileTransaction } from "@/types";

interface TransactionsPageClientProps {
  transactions: ProfileTransaction[];
  isSeller: boolean;
}

export function TransactionsPageClient({
  transactions,
  isSeller,
}: TransactionsPageClientProps) {
  return (
    <div
      className={cn(
        bodyFont.variable,
        displayFont.variable,
        "font-sans",
        "mx-auto max-w-5xl space-y-6 pb-12 pt-2"
      )}
    >
      {/* Top Breadcrumb / Back Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-200/80 pb-4">
        <div className="flex items-center gap-3">
          <Link
            href="/profile"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-zinc-200 bg-white text-[#171717] hover:bg-[#F7F4EE] transition-colors shadow-2xs"
            title="Kembali ke Dashboard Profil"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
                <ReceiptText className="h-3.5 w-3.5" />
              </div>
              <h1 className="font-display text-lg font-bold text-[#171717] sm:text-xl">
                {isSeller ? "Riwayat Penjualan Sampah" : "Riwayat Pembelian Pasokan"}
              </h1>
            </div>
            <p className="text-xs text-[#78766B] mt-0.5">
              {isSeller
                ? "Pantau uang masuk hasil penjualan sampah dan status kesepakatan serah terima COD."
                : "Pantau pengeluaran pembelian material sampah dan konfirmasi penerimaan COD."}
            </p>
          </div>
        </div>

        <Link
          href="/chat"
          className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-4 py-2 text-xs font-semibold text-[#171717] hover:bg-[#F7F4EE] transition-colors shadow-2xs"
        >
          <MessageSquare className="h-3.5 w-3.5 text-[#6B7B4F]" />
          <span>Buka Chat &amp; Negosiasi</span>
        </Link>
      </div>

      {/* Main Transactions Card */}
      <TransactionHistoryCard
        transactions={transactions}
        isSeller={isSeller}
      />
    </div>
  );
}
