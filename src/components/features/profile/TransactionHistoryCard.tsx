"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Inbox } from "lucide-react";
import { cn } from "@/lib/utils";
import { TransactionTable } from "./TransactionTable";
import { TransactionCardList } from "./TransactionCardList";
import type { ProfileTransaction, TransactionStatus } from "./types";

const FILTER_TABS: Array<TransactionStatus | "semua"> = [
  "semua",
  "selesai",
  "menunggu_konfirmasi",
  "dibatalkan",
];

interface TransactionHistoryCardProps {
  transactions: ProfileTransaction[];
  isSeller: boolean;
}

export function TransactionHistoryCard({ transactions, isSeller }: TransactionHistoryCardProps) {
  const [filterTab, setFilterTab] = useState<TransactionStatus | "semua">("semua");

  const filteredTransactions = transactions.filter(
    (t) => filterTab === "semua" || t.status === filterTab
  );

  return (
    <div className="space-y-6 rounded-[32px] border border-zinc-200 bg-white p-6 shadow-xs sm:p-8">
      <div className="flex flex-col gap-4 border-b border-zinc-100 pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-[family-name:var(--font-display)] text-lg font-bold tracking-tight text-[#171717] sm:text-xl">
            Riwayat Transaksi
          </h2>
          <p className="mt-0.5 text-xs text-[#78766B]">
            Pencatatan real-time hasil kesepakatan &amp; serah terima di lokasi.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 rounded-full border border-zinc-200 bg-[#F7F4EE] p-1 text-xs font-semibold">
          {FILTER_TABS.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setFilterTab(tab)}
              className={cn(
                "relative cursor-pointer rounded-full px-3.5 py-1.5 capitalize transition-colors",
                filterTab === tab ? "font-bold text-[#171717]" : "text-[#78766B] hover:text-[#171717]"
              )}
            >
              {filterTab === tab && (
                <motion.div
                  layoutId="activeFilterPill"
                  className="absolute inset-0 rounded-full bg-white shadow-xs"
                  transition={{ type: "spring", stiffness: 450, damping: 35 }}
                />
              )}
              <span className="relative z-10">
                {tab === "menunggu_konfirmasi" ? "Menunggu COD" : tab}
              </span>
            </button>
          ))}
        </div>
      </div>

      {filteredTransactions.length === 0 ? (
        <div className="space-y-2.5 py-14 text-center">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#F7F4EE] text-[#8A8778]">
            <Inbox className="h-6 w-6" />
          </div>
          <p className="text-sm font-semibold text-[#171717]">Tidak Ada Riwayat Transaksi</p>
          <p className="mx-auto max-w-sm text-xs text-[#78766B]">
            Belum ada transaksi dengan status &ldquo;{filterTab.replace("_", " ")}&rdquo; yang
            tercatat pada akun ini.
          </p>
        </div>
      ) : (
        <>
          <TransactionTable transactions={filteredTransactions} isSeller={isSeller} />
          <TransactionCardList transactions={filteredTransactions} isSeller={isSeller} />
        </>
      )}
    </div>
  );
}
