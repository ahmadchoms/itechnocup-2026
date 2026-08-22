"use client";

import { useState } from "react";
import { FileText, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ListingsClientProps {
  initialListings: any[];
}

export function ListingsClient({ initialListings }: ListingsClientProps) {
  const [listings, setListings] = useState(initialListings || []);

  const handleDeleteListing = async (listingId: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus (moderasi) listing ini?")) return;
    try {
      const res = await fetch("/api/admin", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "deleteListing", id: listingId }),
      });      if (res.ok) {
        setListings(prev => prev.map(l => l.id === listingId ? { ...l, status: "dihapus" } : l));
        alert("Listing telah dihapus oleh Admin.");
      } else {
        alert("Gagal menghapus listing.");
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
            Daftar Listing Sampah
          </h1>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider">
                <th className="py-3 px-4 rounded-tl-xl">Foto & Judul Listing</th>
                <th className="py-3 px-4">Kategori</th>
                <th className="py-3 px-4">Penjual (Seller)</th>
                <th className="py-3 px-4">Harga / Berat</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right rounded-tr-xl">Moderasi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {listings.map((l) => (
                <tr key={l.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 flex items-center space-x-3">
                    <img
                      src={l.photoUrl}
                      alt={l.title}
                      className="w-10 h-10 rounded-lg object-cover border border-slate-200"
                    />
                    <div>
                      <span className="font-semibold text-slate-900 block">{l.title}</span>
                      <span className="text-[10px] text-slate-400 truncate max-w-xs block">{l.address}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-emerald-700 font-semibold">{l.category.name}</td>
                  <td className="py-3.5 px-4 text-slate-700">{l.seller.fullName}</td>
                  <td className="py-3.5 px-4 text-slate-900 font-bold">
                    Rp {Number(l.estimatedPrice || 0).toLocaleString("id-ID")} ({l.estimatedWeightKg || 0}kg)
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={cn(
                        "px-2.5 py-0.5 rounded-full text-[11px] font-semibold capitalize",
                        l.status === "aktif"
                          ? "bg-emerald-100 text-emerald-800"
                          : l.status === "terjual"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-red-100 text-red-800"
                      )}
                    >
                      {l.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    {l.status !== "dihapus" && (
                      <button
                        onClick={() => handleDeleteListing(l.id)}
                        className="px-2.5 py-1 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 font-semibold border border-red-200 transition-colors flex items-center space-x-1 ml-auto cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Hapus</span>
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {listings.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">
                    Belum ada data listing.
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
