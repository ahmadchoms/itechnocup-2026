"use client";

import { useState } from "react";
import { CheckSquare } from "lucide-react";
import { cn } from "@/lib/utils";

interface BuyerAppsClientProps {
  initialBuyerApplications: any[];
}

export function BuyerAppsClient({ initialBuyerApplications }: BuyerAppsClientProps) {
  const [buyerApps, setBuyerApps] = useState(initialBuyerApplications || []);

  const handleApproveBuyer = async (appId: string) => {
    if (!confirm("Apakah Anda yakin menyetujui pengguna ini sebagai Pengepul (Buyer)?")) return;
    try {
      const res = await fetch(`/api/admin/buyer-applications/${appId}/approve`, { method: "POST" });
      if (res.ok) {
        setBuyerApps(prev => prev.map(app => app.id === appId ? { ...app, status: "disetujui" } : app));
        alert("Pengepul disetujui!");
      } else {
        alert("Gagal menyetujui pengepul");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleRejectBuyer = async (appId: string) => {
    if (!confirm("Tolak pengajuan Pengepul ini?")) return;
    try {
      const res = await fetch(`/api/admin/buyer-applications/${appId}/reject`, { method: "POST" });
      if (res.ok) {
        setBuyerApps(prev => prev.map(app => app.id === appId ? { ...app, status: "ditolak" } : app));
      } else {
        alert("Gagal menolak pengepul");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 mb-1">
            <CheckSquare className="w-3.5 h-3.5" />
            <span>Verifikasi Pengajuan</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Pengajuan Pengepul (Buyer)
          </h1>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider">
                <th className="py-3 px-4 rounded-tl-xl">Pengguna</th>
                <th className="py-3 px-4">Alamat Operasional</th>
                <th className="py-3 px-4">NPWP</th>
                <th className="py-3 px-4">Dokumen</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right rounded-tr-xl">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {buyerApps.map((a: any) => (
                <tr key={a.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-slate-900">{a.user.fullName}</td>
                  <td className="py-3.5 px-4 text-slate-500 truncate max-w-xs">{a.address}</td>
                  <td className="py-3.5 px-4 text-slate-600">{a.npwp || "-"}</td>
                  <td className="py-3.5 px-4">
                    <div className="flex gap-2">
                      <a href={a.ktpPhotoUrl} target="_blank" rel="noreferrer" className="text-emerald-600 hover:underline">KTP</a>
                      <a href={a.outletPhotoUrl} target="_blank" rel="noreferrer" className="text-emerald-600 hover:underline">Outlet</a>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={cn(
                      "px-2.5 py-0.5 rounded-full text-[11px] font-semibold capitalize",
                      a.status === "disetujui" ? "bg-emerald-100 text-emerald-800" :
                      a.status === "ditolak" ? "bg-red-100 text-red-800" :
                      "bg-amber-100 text-amber-800"
                    )}>
                      {a.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right space-x-2">
                    {a.status === "menunggu" && (
                      <>
                        <button
                          onClick={() => handleApproveBuyer(a.id)}
                          className="px-3 py-1 rounded-lg bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200 hover:bg-emerald-100 transition-colors"
                        >
                          Setujui
                        </button>
                        <button
                          onClick={() => handleRejectBuyer(a.id)}
                          className="px-3 py-1 rounded-lg bg-red-50 text-red-700 font-semibold border border-red-200 hover:bg-red-100 transition-colors"
                        >
                          Tolak
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
              {buyerApps.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">
                    Belum ada data pengajuan pengepul.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
