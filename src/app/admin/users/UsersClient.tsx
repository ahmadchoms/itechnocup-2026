"use client";

import { useState } from "react";
import { Users, UserCheck, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface UsersClientProps {
  initialUsers: any[];
}

export function UsersClient({ initialUsers }: UsersClientProps) {
  const [users, setUsers] = useState(initialUsers || []);

  const handleToggleAdmin = async (userId: string, currentAdmin: boolean) => {
    if (!confirm(`Apakah Anda yakin ingin menjadikan pengguna ini ${currentAdmin ? "User Biasa" : "Admin"}?`)) return;
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
      } else {
        alert("Gagal merubah status admin pengguna.");
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
            <Users className="w-3.5 h-3.5" />
            <span>Manajemen Pengguna</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Daftar Pengguna DaurNusa
          </h1>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider">
                <th className="py-3 px-4 rounded-tl-xl">Pengguna</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Telepon</th>
                <th className="py-3 px-4">Alamat</th>
                <th className="py-3 px-4">Peran (Role)</th>
                <th className="py-3 px-4 text-right rounded-tr-xl">Aksi Admin</th>
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
                      className="px-3 py-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-[11px] font-semibold text-slate-700 transition-colors cursor-pointer"
                    >
                      {u.isAdmin ? "Jadikan User Biasa" : "Jadikan Admin"}
                    </button>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">
                    Belum ada data pengguna.
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
