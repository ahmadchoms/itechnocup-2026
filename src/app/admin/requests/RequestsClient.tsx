"use client";

import { useState } from "react";
import { FileText, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface RequestsClientProps {
  initialRequests: any[];
}

export function RequestsClient({ initialRequests }: RequestsClientProps) {
  const [requests, setRequests] = useState(initialRequests || []);

  const handleDeleteRequest = async (requestId: string) => {
    if (!confirm("Apakah Anda yakin ingin membatalkan (moderasi) permintaan ini?")) return;
    try {
      const res = await fetch("/api/admin", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "deleteRequest", id: requestId }),
      });
      if (res.ok) {
        setRequests(prev => prev.map(r => r.id === requestId ? { ...r, status: "dibatalkan" } : r));
        alert("Permintaan telah dibatalkan oleh Admin.");
      } else {
        alert("Gagal membatalkan permintaan.");
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
            <FileText className="w-3.5 h-3.5" />
            <span>Moderasi Sampah</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Daftar Permintaan Sampah (Waste Requests)
          </h1>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider">
                <th className="py-3 px-4 rounded-tl-xl">Judul Permintaan</th>
                <th className="py-3 px-4">Kategori</th>
                <th className="py-3 px-4">Pengepul (Buyer)</th>
                <th className="py-3 px-4">Harga Tawaran</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right rounded-tr-xl">Moderasi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {requests.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-slate-900">{r.title}</td>
                  <td className="py-3.5 px-4 text-emerald-700 font-semibold">{r.category.name}</td>
                  <td className="py-3.5 px-4 text-slate-700">{r.buyer.fullName}</td>
                  <td className="py-3.5 px-4 font-bold text-slate-900">
                    Rp {Number(r.offeredPrice).toLocaleString("id-ID")} /{r.unit || "kg"}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={cn(
                      "px-2.5 py-0.5 rounded-full text-[11px] font-semibold capitalize",
                      r.status === "aktif" ? "bg-emerald-100 text-emerald-800" :
                      r.status === "terpenuhi" ? "bg-blue-100 text-blue-800" :
                      "bg-red-100 text-red-800"
                    )}>
                      {r.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    {r.status !== "dibatalkan" && (
                      <button
                        onClick={() => handleDeleteRequest(r.id)}
                        className="px-2.5 py-1 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 font-semibold border border-red-200 transition-colors flex items-center space-x-1 ml-auto cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Hapus</span>
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {requests.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">
                    Belum ada data permintaan sampah.
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
