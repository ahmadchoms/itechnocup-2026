import { Coins, Package, Scale, ShoppingBag, Star, TrendingUp, Layers } from "lucide-react";
import { StatCard } from "./StatCard";
import { formatRupiah } from "@/lib/format";
import type { ProfileStats } from "./types";

interface StatsGridProps {
  stats: ProfileStats;
  reviewCount: number;
  isSeller: boolean;
}

export function StatsGrid({ stats, reviewCount, isSeller }: StatsGridProps) {
  const activeListings = stats.activeListingsCount ?? 0;

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        label={isSeller ? "Listing Aktif" : "Permintaan Pasokan"}
        icon={Layers}
        value={
          <span className="flex items-baseline gap-1.5">
            {activeListings}
            <span className="text-sm font-semibold text-[#78766B]">item</span>
          </span>
        }
        footerIcon={Package}
        footerIconClassName="text-[#7A8F5C]"
        footerText={isSeller ? "Siap ditawarkan ke pembeli" : "Kebutuhan material terbuka"}
      />

      <StatCard
        label={isSeller ? "Total Pendapatan" : "Total Pembelian"}
        icon={isSeller ? Coins : ShoppingBag}
        value={formatRupiah(stats.totalRevenue)}
        footerIcon={TrendingUp}
        footerClassName="text-[#6B7B4F]"
        footerText={`Dari ${stats.totalTransactionsCount} transaksi COD`}
      />

      <StatCard
        label={isSeller ? "Volume Terjual" : "Material Diterima"}
        icon={Scale}
        value={
          <span className="flex items-baseline gap-1.5">
            {stats.totalKgSold.toLocaleString("id-ID")}{" "}
            <span className="text-sm font-semibold text-[#78766B]">kg</span>
          </span>
        }
        footerIcon={Package}
        footerIconClassName="text-[#7A8F5C]"
        footerText={isSeller ? "Terselamatkan dari TPA" : "Siap didaur ulang"}
      />

      <StatCard
        label={isSeller ? "Reputasi Penjual" : "Rating Pengepul"}
        icon={Star}
        iconClassName="fill-amber-400 text-amber-400"
        value={
          <span className="flex items-baseline gap-1.5">
            {stats.avgRating.toFixed(1)}
            <span className="text-sm font-semibold text-[#78766B]">/ 5.0</span>
          </span>
        }
        footerIcon={Star}
        footerIconClassName="fill-[#C98A0B] text-[#C98A0B]"
        footerText={`Dari ${reviewCount} ulasan mitra`}
      />
    </div>
  );
}
