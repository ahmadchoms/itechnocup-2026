"use client";

import { useState } from "react";
import { ShieldCheck, Users, Store, Scale, Coins, Trash2, CheckCircle2, AlertTriangle, RefreshCw, UserCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface AdminClientProps {
  stats: {
    totalUsers: number;
    totalListings: number;
    totalRequests: number;
    totalTransactions: number;
    totalVolumeKg: number;
    totalTransactionValue: number;
  };
  initialUsers: any[];
  initialListings: any[];
  initialRequests: any[];
}

export function AdminClient({ stats, initialUsers, initialListings, initialRequests }: AdminClientProps) {
  const [users, setUsers] = useState(initialUsers);
  const [listings, setListings] = useState(initialListings);
  const [activeTab, setActiveTab] = useState<"users" | "listings" | "requests">("users");

  const handleToggleAdmin = async (userId: string, currentAdmin: boolean) => {
    try {
      const res = await fetch("/api/admin", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "toggleUserAdmin",
          id: userId,
          data: { isAdmin: !currentAdmin },
        }),
      });

      if (res.ok) {
        setUsers((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, isAdmin: !currentAdmin } : u))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteListing = async (listingId: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus listing ini?")) return;

    try {
      const res = await fetch("/api/admin", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "deleteListing",
          id: listingId,
        }),
      });

      if (res.ok) {
        setListings((prev) =>
          prev.map((l) => (l.id === listingId ? { ...l, status: "dihapus" } : l))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-800 mb-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Panel Moderasi Platform DaurNusa</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Dashboard Admin & Moderasi Pengguna
          </h1>
          <p className="text-xs text-slate-500">
            Kelola data pengguna terdaftar, moderasi listing/permintaan yang melanggar, dan pantau dampak sirkular platform.
          </p>
        </div>
      </div>

      {/* STAT CARDS OVERVIEW (4 Cards) */}
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

      {/* ADMIN TABS & MANAGEMENT TABLES */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-5">
        <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
          <button
            onClick={() => setActiveTab("users")}
            className={cn(
              "px-4 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer",
              activeTab === "users" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            )}
          >
            Manajemen Pengguna ({users.length})
          </button>
          <button
            onClick={() => setActiveTab("listings")}
            className={cn(
              "px-4 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer",
              activeTab === "listings" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            )}
          >
            Moderasi Listing ({listings.length})
          </button>
          <button
            onClick={() => setActiveTab("requests")}
            className={cn(
              "px-4 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer",
              activeTab === "requests" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            )}
          >
            Moderasi Requests ({initialRequests.length})
          </button>
        </div>

        {/* TAB 1: USERS TABLE */}
        {activeTab === "users" && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider">
                  <th className="py-3 px-4">Pengguna</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Telepon</th>
                  <th className="py-3 px-4">Alamat</th>
                  <th className="py-3 px-4">Peran (Role)</th>
                  <th className="py-3 px-4 text-right">Aksi Admin</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 flex items-center space-x-3">
                      <img
                        src={u.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"}
                        alt={u.fullName}
                        className="w-8 h-8 rounded-full object-cover border border-slate-200"
                      />
                      <span className="font-semibold text-slate-900">{u.fullName}</span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">{u.email}</td>
                    <td className="py-3.5 px-4 text-slate-600">{u.phone || "-"}</td>
                    <td className="py-3.5 px-4 text-slate-500 truncate max-w-xs">{u.address || "-"}</td>
                    <td className="py-3.5 px-4">
                      <span
                        className={cn(
                          "px-2.5 py-0.5 rounded-full text-[11px] font-semibold border",
                          u.isAdmin
                            ? "bg-purple-100 text-purple-800 border-purple-300"
                            : "bg-emerald-50 text-emerald-700 border-emerald-200"
                        )}
                      >
                        {u.isAdmin ? "ADMIN PLATFORM" : "Masyarakat / UMKM"}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleToggleAdmin(u.id, u.isAdmin)}
                        className="px-3 py-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-[11px] font-semibold text-slate-700 transition-colors"
                      >
                        {u.isAdmin ? "Jadikan User Biasa" : "Jadikan Admin"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 2: LISTINGS MODERATION TABLE */}
        {activeTab === "listings" && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider">
                  <th className="py-3 px-4">Foto & Judul Listing</th>
                  <th className="py-3 px-4">Kategori</th>
                  <th className="py-3 px-4">Penjual (Seller)</th>
                  <th className="py-3 px-4">Harga / Berat</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Moderasi</th>
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
                          className="px-2.5 py-1 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 font-semibold border border-red-200 transition-colors flex items-center space-x-1 ml-auto"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Hapus</span>
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 3: REQUESTS MODERATION TABLE */}
        {activeTab === "requests" && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider">
                  <th className="py-3 px-4">Judul Request</th>
                  <th className="py-3 px-4">Kategori</th>
                  <th className="py-3 px-4">Pembeli (Buyer)</th>
                  <th className="py-3 px-4">Penawaran</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {initialRequests.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-slate-900">{r.title}</td>
                    <td className="py-3.5 px-4 text-emerald-700 font-semibold">{r.category.name}</td>
                    <td className="py-3.5 px-4 text-slate-700">{r.buyer.fullName}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      Rp {Number(r.offeredPrice).toLocaleString("id-ID")} /{r.unit || "kg"}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800 capitalize">
                        {r.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
