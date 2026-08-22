"use client";

import { ShieldCheck } from "lucide-react";

interface AdminDashboardClientProps {
  stats: {
    totalUsers: number;
    totalListings: number;
    totalRequests: number;
    totalTransactions: number;
    totalVolumeKg: number;
    totalTransactionValue: number;
  };
}

export function AdminDashboardClient({ stats }: AdminDashboardClientProps) {
  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 mb-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Dashboard Admin DaurNusa</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Ringkasan Statistik
          </h1>
          <p className="text-xs text-slate-500">
            Pantau pertumbuhan pengguna dan dampak sirkular platform Anda.
          </p>
        </div>
      </div>

      {/* STAT CARDS OVERVIEW */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
            Total Pengguna
          </span>
          <span className="text-2xl font-bold text-slate-900 mt-1 block">
            {stats.totalUsers} Acc
          </span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
            Total Listing Sampah
          </span>
          <span className="text-2xl font-bold text-emerald-600 mt-1 block">
            {stats.totalListings} Listing
          </span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
            Total Limbah Terkelola
          </span>
          <span className="text-2xl font-bold text-amber-600 mt-1 block">
            {stats.totalVolumeKg} kg
          </span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
            Nilai Ekonomi Tercipta
          </span>
          <span className="text-2xl font-bold text-purple-600 mt-1 block">
            Rp {stats.totalTransactionValue.toLocaleString("id-ID")}
          </span>
        </div>
      </div>
      
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col items-center justify-center text-center">
        <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=300" alt="Dashboard Illustration" className="w-48 rounded-2xl mb-4 grayscale opacity-80" />
        <h3 className="font-semibold text-slate-800">Selamat datang di Panel Admin!</h3>
        <p className="text-sm text-slate-500 max-w-md mx-auto mt-2">Gunakan menu di navigasi sebelah kiri untuk mengelola pengguna, memantau pengajuan pengepul, serta memoderasi listing dan permintaan sampah.</p>
      </div>
    </div>
  );
}
