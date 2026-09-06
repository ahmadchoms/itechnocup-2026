"use client";

import Link from "next/link";
import {
  ArrowUpRight,
  CheckSquare,
  Clock,
  ExternalLink,
  FileText,
  Package,
  Sparkles,
  Users,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AdminDashboardData } from "@/types";

interface AdminDashboardClientProps {
  data: AdminDashboardData;
}

export function AdminDashboardClient({ data }: AdminDashboardClientProps) {
  const {
    stats,
    recentTransactions,
    categoryStats,
    recentListings,
    pendingBuyers,
  } = data;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight font-sans">
            Ringkasan Operasional
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Data metrik platform, arus transaksi sirkular, dan antrean verifikasi DaurNusa.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link href="/admin/buyer-applications">
            <Button
              variant="outline"
              className="h-9 rounded-full text-xs font-semibold border-slate-200 bg-white hover:bg-slate-50 text-slate-700"
            >
              Verifikasi Pengepul
              {stats.pendingBuyerApplicationsCount > 0 && (
                <span className="ml-1.5 px-1.5 py-0.2 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
                  {stats.pendingBuyerApplicationsCount}
                </span>
              )}
            </Button>
          </Link>
          <Link href="/admin/listings">
            <Button className="h-9 rounded-full text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white shadow-xs">
              Kelola Listing
            </Button>
          </Link>
        </div>
      </div>

      {pendingBuyers.length > 0 && (
        <div className="bg-sage/40 border border-slate-200/90 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xs">
          <div className="space-y-1">
            <h2 className="text-sm font-bold text-slate-900">
              {pendingBuyers.length} Pengajuan Pengepul Membutuhkan Verifikasi
            </h2>
            <p className="text-xs text-slate-600">
              Dokumen identitas (KTP) dan foto gudang pengepul baru siap ditinjau untuk membuka akses pembelian limbah.
            </p>
          </div>
          <Link href="/admin/buyer-applications">
            <Button
              size="sm"
              className="h-8.5 px-4 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shrink-0 gap-1.5"
            >
              <span>Tinjau Sekarang</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Limbah Terkelola
            </span>
            <Package className="w-4 h-4 text-slate-400" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {stats.totalVolumeKg.toLocaleString("id-ID")} <span className="text-sm font-semibold text-slate-500">kg</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              {stats.activeListingsCount} listing aktif siap transaksi
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Perputaran Ekonomi
            </span>
            <span className="text-[11px] font-mono font-bold text-emerald-primary">COD</span>
          </div>
          <div>
            <div className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Rp {stats.totalTransactionValue.toLocaleString("id-ID")}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Dari {stats.completedTransactionsCount} transaksi COD selesai
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Pengguna Terdaftar
            </span>
            <Users className="w-4 h-4 text-slate-400" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {stats.totalUsers} <span className="text-sm font-semibold text-slate-500">Akun</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              {stats.totalBuyersApproved} pengepul • {stats.totalSellers} penjual
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Akurasi AI Vision
            </span>
            <Sparkles className="w-4 h-4 text-emerald-primary" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {stats.avgAiConfidence}%
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Model klasifikasi limbah otomatis
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Transaksi COD Terkini
                </h2>
                <p className="text-xs text-slate-500">
                  Riwayat kesepakatan jual beli sampah antara penjual dan pengepul
                </p>
              </div>
              <Link
                href="/admin/requests"
                className="text-xs font-semibold text-emerald-primary hover:underline flex items-center gap-1"
              >
                <span>Lihat Semua</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {recentTransactions.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">
                Belum ada transaksi COD yang tercatat.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 text-[10.5px] font-bold uppercase tracking-wider">
                      <th className="pb-3 font-semibold">Pihak Transaksi</th>
                      <th className="pb-3 font-semibold">Material</th>
                      <th className="pb-3 font-semibold">Nominal</th>
                      <th className="pb-3 font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {recentTransactions.map((tx) => (
                      <tr key={tx.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3.5 pr-3">
                          <div className="font-semibold text-slate-900">{tx.sellerName}</div>
                          <div className="text-[11px] text-slate-400">→ {tx.buyerName}</div>
                        </td>
                        <td className="py-3.5 pr-3">
                          <div className="text-slate-800 font-medium">
                            {tx.listingTitle || tx.categoryName || "Limbah Sirkular"}
                          </div>
                          {tx.finalQuantity && (
                            <div className="text-[10.5px] text-slate-400">
                              {tx.finalQuantity} {tx.unit || "kg"}
                            </div>
                          )}
                        </td>
                        <td className="py-3.5 pr-3 font-semibold text-slate-900">
                          Rp {tx.finalPrice.toLocaleString("id-ID")}
                        </td>
                        <td className="py-3.5">
                          {tx.status === "selesai" ? (
                            <Badge variant="outline" className="text-[10px] font-semibold bg-emerald-50 text-emerald-700 border-emerald-200">
                              Selesai
                            </Badge>
                          ) : tx.status === "dibatalkan" ? (
                            <Badge variant="outline" className="text-[10px] font-semibold bg-red-50 text-red-700 border-red-200">
                              Dibatalkan
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-[10px] font-semibold bg-amber-50 text-amber-700 border-amber-200">
                              Menunggu
                            </Badge>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Listing Sampah Baru
                </h2>
                <p className="text-xs text-slate-500">
                  Sampah yang baru dipublikasikan oleh penjual dan kafe
                </p>
              </div>
              <Link
                href="/admin/listings"
                className="text-xs font-semibold text-emerald-primary hover:underline flex items-center gap-1"
              >
                <span>Katalog Lengkap</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {recentListings.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">
                Belum ada listing sampah yang dipublikasikan.
              </div>
            ) : (
              <div className="space-y-3">
                {recentListings.map((listing) => (
                  <div
                    key={listing.id}
                    className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50/50 transition-all gap-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={listing.photoUrl}
                        alt={listing.title}
                        className="w-11 h-11 rounded-lg object-cover border border-slate-200 shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-900 truncate">
                          {listing.title}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-500">
                          <span>{listing.categoryName}</span>
                          <span>•</span>
                          <span>{listing.sellerName}</span>
                          {listing.estimatedWeightKg && (
                            <>
                              <span>•</span>
                              <span className="font-medium text-slate-700">
                                {listing.estimatedWeightKg} {listing.unit || "kg"}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-xs font-bold text-slate-900">
                        {listing.estimatedPrice
                          ? `Rp ${listing.estimatedPrice.toLocaleString("id-ID")}`
                          : "-"}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        {listing.status === "aktif" ? "Tersedia" : "Terjual"}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-2xs space-y-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Distribusi Kategori
              </h2>
              <p className="text-xs text-slate-500">
                Proporsi volume sampah terkelola berdasarkan kategori
              </p>
            </div>

            <div className="space-y-3.5">
              {categoryStats.map((cat) => (
                <div key={cat.id} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-800">{cat.name}</span>
                    <span className="text-slate-500 font-medium">
                      {cat.totalVolumeKg} kg ({cat.percentageOfVolume}%)
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full bg-emerald-primary rounded-full transition-all"
                      style={{ width: `${Math.min(cat.percentageOfVolume, 100)}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[10.5px] text-slate-400">
                    <span>{cat.listingsCount} listing</span>
                    <span>{cat.requestsCount} permintaan</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-2xs space-y-3">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Pintasan Navigasi
              </h2>
              <p className="text-xs text-slate-500">
                Akses cepat modul manajemen data admin
              </p>
            </div>

            <div className="space-y-2 pt-1">
              <Link
                href="/admin/buyer-applications"
                className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:bg-sage/40 hover:border-slate-200 transition-colors text-xs font-semibold text-slate-800"
              >
                <div className="flex items-center gap-2.5">
                  <CheckSquare className="w-4 h-4 text-emerald-primary" />
                  <span>Verifikasi Pengepul</span>
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
              </Link>

              <Link
                href="/admin/listings"
                className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:bg-sage/40 hover:border-slate-200 transition-colors text-xs font-semibold text-slate-800"
              >
                <div className="flex items-center gap-2.5">
                  <FileText className="w-4 h-4 text-slate-600" />
                  <span>Katalog Listing Sampah</span>
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
              </Link>

              <Link
                href="/admin/users"
                className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:bg-sage/40 hover:border-slate-200 transition-colors text-xs font-semibold text-slate-800"
              >
                <div className="flex items-center gap-2.5">
                  <Users className="w-4 h-4 text-slate-600" />
                  <span>Manajemen Pengguna</span>
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
              </Link>

              <Link
                href="/"
                target="_blank"
                className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:bg-sage/40 hover:border-slate-200 transition-colors text-xs font-semibold text-slate-800"
              >
                <div className="flex items-center gap-2.5">
                  <ExternalLink className="w-4 h-4 text-slate-400" />
                  <span>Lihat Marketplace Publik</span>
                </div>
                <span className="text-[10px] text-slate-400">Tab Baru</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
