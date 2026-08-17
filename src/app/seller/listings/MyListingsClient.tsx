"use client";

import { useState } from "react";
import { Pencil, Trash2, CheckCircle2, AlertCircle, Store, PlusCircle } from "lucide-react";
import { cn } from "@/lib/utils";

import Link from "next/link";

interface MyListingsClientProps {
  initialListings: any[];
  categories: { id: string; name: string }[];
  currentUser: { id: string; fullName: string };
}

export function MyListingsClient({ initialListings, categories, currentUser }: MyListingsClientProps) {
  const [listings, setListings] = useState(initialListings);
  const [editTarget, setEditTarget] = useState<any | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDeleteListing = async (listingId: string) => {
    if (!confirm("Hapus listing ini? Status akan berubah menjadi 'dihapus'.")) return;
    setDeletingId(listingId);
    try {
      const res = await fetch(`/api/listings/${listingId}`, { method: "DELETE" });
      if (res.ok) {
        setListings((prev) =>
          prev.map((l) => l.id === listingId ? { ...l, status: "dihapus" } : l)
        );
      } else {
        const d = await res.json();
        alert(d.error || "Gagal menghapus listing");
      }
    } catch {
      alert("Terjadi kesalahan. Coba lagi.");
    } finally {
      setDeletingId(null);
    }
  };

  const statusColors: Record<string, string> = {
    aktif: "bg-emerald-100 text-emerald-800",
    terjual: "bg-blue-100 text-blue-800",
    dihapus: "bg-red-100 text-red-800",
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <Store className="w-5 h-5 text-emerald-600" />
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Listing Saya</h1>
          </div>
          <p className="text-xs text-slate-500">
            Kelola semua listing sampah yang kamu buat — edit atau hapus kapan saja.
          </p>
        </div>
        {/* Tombol tambah listing */}
        <button
          id="open-ai-scanner"
          className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold flex items-center space-x-2 shadow-md shadow-emerald-600/20 transition-all"
          onClick={() => {
            // Trigger AI scanner dari AppShell (via custom event)
            window.dispatchEvent(new CustomEvent("open-ai-scanner"));
          }}
        >
          <PlusCircle className="w-4 h-4" />
          <span>Tambah Listing Baru</span>
        </button>
      </div>

      {/* Listing Table / Cards */}
      {listings.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3 shadow-xs">
          <Store className="w-12 h-12 text-slate-300 mx-auto" />
          <p className="font-semibold text-slate-600">Belum ada listing</p>
          <p className="text-xs text-slate-400">Buat listing pertama kamu via tombol AI Scanner di atas</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider">
                  <th className="py-3 px-4 text-left">Foto & Judul</th>
                  <th className="py-3 px-4 text-left">Kategori</th>
                  <th className="py-3 px-4 text-left">Berat / Harga</th>
                  <th className="py-3 px-4 text-left">Status</th>
                  <th className="py-3 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {listings.map((listing) => (
                  <tr key={listing.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center space-x-3">
                        <img
                          src={listing.photoUrl}
                          alt={listing.title}
                          className="w-10 h-10 rounded-lg object-cover border border-slate-200 shrink-0"
                        />
                        <div>
                          <span className="font-semibold text-slate-900 block leading-tight">{listing.title}</span>
                          <span className="text-[10px] text-slate-400 truncate max-w-[200px] block">{listing.address}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-emerald-700">{listing.category?.name}</span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-700">
                      <span className="font-bold text-slate-900 block">
                        {listing.estimatedWeightKg ? `${listing.estimatedWeightKg} kg` : "-"}
                      </span>
                      {listing.estimatedPrice && (
                        <span className="text-emerald-600 font-medium">
                          Rp {listing.estimatedPrice.toLocaleString("id-ID")}
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={cn(
                          "px-2.5 py-1 rounded-full text-[11px] font-semibold capitalize",
                          statusColors[listing.status] || "bg-slate-100 text-slate-700"
                        )}
                      >
                        {listing.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        {listing.status !== "dihapus" && (
                          <>
                            <button
                              id={`edit-listing-${listing.id}`}
                              onClick={() => setEditTarget(listing)}
                              className="p-1.5 rounded-lg bg-slate-100 hover:bg-emerald-100 text-slate-600 hover:text-emerald-700 transition-colors"
                              title="Edit listing"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                            <button
                              id={`delete-listing-${listing.id}`}
                              onClick={() => handleDeleteListing(listing.id)}
                              disabled={deletingId === listing.id}
                              className="p-1.5 rounded-lg bg-slate-100 hover:bg-red-100 text-slate-600 hover:text-red-600 transition-colors disabled:opacity-50"
                              title="Hapus listing"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {editTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
           <div className="bg-white rounded-2xl p-6 shadow-xl w-full max-w-sm">
             <h3 className="text-lg font-bold mb-2">Edit tidak tersedia</h3>
             <p className="text-sm text-slate-600 mb-4">Fitur edit telah dinonaktifkan.</p>
             <button onClick={() => setEditTarget(null)} className="w-full py-2 bg-slate-900 text-white rounded-xl">Tutup</button>
           </div>
        </div>
      )}
    </div>
  );
}
