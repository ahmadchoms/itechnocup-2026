"use client";

import { useState, useMemo } from "react";
import {
  Search,
  Users,
  Building2,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Loader2,
  Package,
  ShieldCheck,
  Edit2,
  Trash2,
  Check,
  AlertTriangle,
  Info,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { AdminUserItem } from "./types";

interface UsersClientProps {
  initialUsers: AdminUserItem[];
}

export function UsersClient({ initialUsers }: UsersClientProps) {
  const [users, setUsers] = useState<AdminUserItem[]>(initialUsers || []);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | "seller" | "buyer" | "admin">("all");

  const [inspectingUser, setInspectingUser] = useState<AdminUserItem | null>(null);
  const [editingUser, setEditingUser] = useState<AdminUserItem | null>(null);
  const [editFormData, setEditFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    isAdmin: false,
    isBuyerApproved: false,
  });

  const [userToDelete, setUserToDelete] = useState<AdminUserItem | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const stats = useMemo(() => {
    const total = users.length;
    const buyers = users.filter((u) => u.isBuyerApproved);
    const sellers = users.filter((u) => !u.isBuyerApproved);
    const admins = users.filter((u) => u.isAdmin);

    return {
      total,
      buyersCount: buyers.length,
      sellersCount: sellers.length,
      adminsCount: admins.length,
    };
  }, [users]);

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      let matchesRole = true;
      if (roleFilter === "admin") matchesRole = u.isAdmin;
      else if (roleFilter === "buyer") matchesRole = u.isBuyerApproved;
      else if (roleFilter === "seller") matchesRole = !u.isBuyerApproved;

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        u.fullName.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        (u.phone && u.phone.toLowerCase().includes(q)) ||
        (u.address && u.address.toLowerCase().includes(q));

      return matchesRole && matchesSearch;
    });
  }, [users, roleFilter, searchQuery]);

  const openEditModal = (user: AdminUserItem) => {
    setEditingUser(user);
    setEditFormData({
      fullName: user.fullName,
      email: user.email,
      phone: user.phone || "",
      address: user.address || "",
      isAdmin: user.isAdmin,
      isBuyerApproved: user.isBuyerApproved,
    });
  };

  const handleSaveEditUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    setProcessingId(editingUser.id);
    try {
      const res = await fetch("/api/admin", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "updateUser",
          id: editingUser.id,
          data: {
            fullName: editFormData.fullName,
            email: editFormData.email,
            phone: editFormData.phone || null,
            address: editFormData.address || null,
            isAdmin: editFormData.isAdmin,
            isBuyerApproved: editFormData.isBuyerApproved,
          },
        }),
      });

      if (res.ok) {
        setUsers((prev) =>
          prev.map((u) =>
            u.id === editingUser.id
              ? {
                  ...u,
                  fullName: editFormData.fullName,
                  email: editFormData.email,
                  phone: editFormData.phone || null,
                  address: editFormData.address || null,
                  isAdmin: editFormData.isAdmin,
                  isBuyerApproved: editFormData.isBuyerApproved,
                }
              : u
          )
        );
        if (inspectingUser?.id === editingUser.id) {
          setInspectingUser((prev) =>
            prev
              ? {
                  ...prev,
                  fullName: editFormData.fullName,
                  email: editFormData.email,
                  phone: editFormData.phone || null,
                  address: editFormData.address || null,
                  isAdmin: editFormData.isAdmin,
                  isBuyerApproved: editFormData.isBuyerApproved,
                }
              : null
          );
        }
        setEditingUser(null);
      } else {
        const errorData = await res.json();
        alert(errorData.error || "Gagal memperbarui profil pengguna.");
      }
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan saat menyimpan perubahan pengguna.");
    } finally {
      setProcessingId(null);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    setProcessingId(userId);
    try {
      const res = await fetch("/api/admin", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "deleteUser",
          id: userId,
        }),
      });

      if (res.ok) {
        setUsers((prev) => prev.filter((u) => u.id !== userId));
        if (inspectingUser?.id === userId) {
          setInspectingUser(null);
        }
        setUserToDelete(null);
      } else {
        const errorData = await res.json();
        alert(errorData.error || "Gagal menghapus pengguna.");
      }
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan saat menghapus pengguna.");
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight font-sans">
            Manajemen Pengguna
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Kelola data akun, modifikasi profil, hak akses administrator, dan moderasi akun pengguna DaurNusa.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4.5 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Total Pengguna
            </span>
            <Users className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">
            {stats.total}{" "}
            <span className="text-xs font-semibold text-slate-500">Akun</span>
          </div>
          <p className="text-[11px] text-slate-500">
            Ekosistem terdaftar di DaurNusa
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-4.5 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Pengepul Terverifikasi
            </span>
            <Building2 className="w-4 h-4 text-emerald-primary" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">
            {stats.buyersCount}{" "}
            <span className="text-xs font-semibold text-emerald-primary">Pengepul</span>
          </div>
          <p className="text-[11px] text-slate-500">
            Lolos verifikasi KTP &amp; outlet
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-4.5 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Penjual &amp; UMKM
            </span>
            <Package className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">
            {stats.sellersCount}{" "}
            <span className="text-xs font-semibold text-slate-500">Penjual</span>
          </div>
          <p className="text-[11px] text-slate-500">
            Penyuplai sampah &amp; ampas organik
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-4.5 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Administrator
            </span>
            <ShieldCheck className="w-4 h-4 text-slate-900" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">
            {stats.adminsCount}{" "}
            <span className="text-xs font-semibold text-slate-500">Super Admin</span>
          </div>
          <p className="text-[11px] text-slate-500">
            Akses penuh kontrol platform
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-2xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-slate-100/80 border border-slate-200/60 w-fit">
            <button
              type="button"
              onClick={() => setRoleFilter("all")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                roleFilter === "all"
                  ? "bg-white text-slate-900 shadow-2xs"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              Semua ({stats.total})
            </button>
            <button
              type="button"
              onClick={() => setRoleFilter("buyer")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                roleFilter === "buyer"
                  ? "bg-white text-emerald-700 shadow-2xs"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              Pengepul ({stats.buyersCount})
            </button>
            <button
              type="button"
              onClick={() => setRoleFilter("seller")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                roleFilter === "seller"
                  ? "bg-white text-slate-900 shadow-2xs"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              Penjual ({stats.sellersCount})
            </button>
            <button
              type="button"
              onClick={() => setRoleFilter("admin")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                roleFilter === "admin"
                  ? "bg-white text-slate-900 shadow-2xs"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              Admin ({stats.adminsCount})
            </button>
          </div>

          <div className="relative w-full md:w-72">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama, email, atau telepon..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-slate-400 transition-colors"
            />
          </div>
        </div>

        {filteredUsers.length === 0 ? (
          <div className="py-12 text-center space-y-2">
            <div className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
              <Users className="w-5 h-5" />
            </div>
            <p className="text-xs font-bold text-slate-900">
              Tidak ada pengguna yang sesuai
            </p>
            <p className="text-[11px] text-slate-400">
              {searchQuery
                ? `Tidak ditemukan akun dengan kata kunci "${searchQuery}".`
                : "Belum ada akun pada kategori ini."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 text-[10.5px] font-bold uppercase tracking-wider">
                  <th className="pb-3 pr-4 font-semibold">Profil Pengguna</th>
                  <th className="pb-3 pr-4 font-semibold">Kontak &amp; Email</th>
                  <th className="pb-3 pr-4 font-semibold">Alamat Domisili</th>
                  <th className="pb-3 pr-4 font-semibold">Aktivitas Sirkular</th>
                  <th className="pb-3 pr-4 font-semibold">Hak Akses &amp; Status</th>
                  <th className="pb-3 text-right font-semibold">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.map((u) => {
                  const initials = u.fullName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .substring(0, 2)
                    .toUpperCase();

                  return (
                    <tr key={u.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 pr-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9 border border-slate-200">
                            <AvatarImage src={u.avatarUrl || undefined} alt={u.fullName} />
                            <AvatarFallback className="bg-sage text-[11px] font-bold text-emerald-primary">
                              {initials}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-bold text-slate-900 text-xs">
                              {u.fullName}
                            </div>
                            <div className="flex items-center gap-1 text-[10.5px] text-slate-400 mt-0.5">
                              <Calendar className="w-3 h-3" />
                              <span>
                                {new Date(u.createdAt).toLocaleDateString("id-ID", {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                })}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 pr-4">
                        <div className="text-slate-800 font-medium">{u.email}</div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          {u.phone || "Tidak ada telepon"}
                        </div>
                      </td>

                      <td className="py-3.5 pr-4 max-w-xs">
                        {u.address ? (
                          <div className="flex items-start gap-1.5 text-slate-700">
                            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                            <span className="line-clamp-2 leading-relaxed text-[11.5px]">{u.address}</span>
                          </div>
                        ) : (
                          <span className="text-slate-400 text-[11px]">-</span>
                        )}
                      </td>

                      <td className="py-3.5 pr-4">
                        <div className="flex items-center gap-2 text-[11px]">
                          <span className="font-semibold text-slate-700">
                            {u._count.listings} Listing
                          </span>
                          <span className="text-slate-300">•</span>
                          <span className="text-slate-500">
                            {u._count.sellerTransactions + u._count.buyerTransactions} Transaksi
                          </span>
                        </div>
                      </td>

                      <td className="py-3.5 pr-4">
                        <div className="flex flex-wrap items-center gap-1.5">
                          {u.isAdmin && (
                            <Badge variant="outline" className="text-[10px] font-bold bg-slate-900 text-white border-slate-900">
                              Admin
                            </Badge>
                          )}
                          {u.isBuyerApproved ? (
                            <Badge variant="outline" className="text-[10px] font-semibold bg-emerald-50 text-emerald-700 border-emerald-200">
                              Pengepul
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-[10px] font-semibold bg-sage/60 text-slate-700 border-slate-200">
                              Penjual
                            </Badge>
                          )}
                        </div>
                      </td>

                      <td className="py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setInspectingUser(u)}
                            className="h-8 px-2.5 rounded-full text-xs font-semibold border-slate-200 hover:bg-slate-100 text-slate-800"
                            title="Lihat Detail Pengguna"
                          >
                            <Info className="w-3.5 h-3.5 mr-1 text-slate-500" />
                            <span>Detail</span>
                          </Button>

                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => openEditModal(u)}
                            className="h-8 px-2.5 rounded-full text-xs font-semibold border-slate-200 hover:bg-sage/40 text-slate-800"
                            title="Edit Data Pengguna"
                          >
                            <Edit2 className="w-3.5 h-3.5 mr-1 text-emerald-primary" />
                            <span>Edit</span>
                          </Button>

                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setUserToDelete(u)}
                            className="h-8 px-2.5 rounded-full text-xs font-semibold border-red-200 bg-red-50/60 hover:bg-red-100 text-red-700"
                            title="Hapus Pengguna"
                          >
                            <Trash2 className="w-3.5 h-3.5 mr-1 text-red-600" />
                            <span>Delete</span>
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Dialog open={!!inspectingUser} onOpenChange={(open) => !open && setInspectingUser(null)}>
        <DialogContent className="sm:max-w-xl p-6 rounded-3xl bg-white border border-slate-200 shadow-2xl">
          {inspectingUser && (
            <div className="space-y-5">
              <DialogHeader>
                <div className="flex items-center justify-between">
                  <DialogTitle className="text-lg font-bold text-slate-900">
                    Profil Pengguna
                  </DialogTitle>
                  <div className="flex items-center gap-1.5">
                    {inspectingUser.isAdmin && (
                      <Badge variant="outline" className="text-[10.5px] font-bold bg-slate-900 text-white border-slate-900">
                        Admin
                      </Badge>
                    )}
                    <Badge
                      variant="outline"
                      className={`text-[10.5px] font-bold ${
                        inspectingUser.isBuyerApproved
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : "bg-sage/70 text-slate-700 border-slate-200"
                      }`}
                    >
                      {inspectingUser.isBuyerApproved ? "Pengepul Resmi" : "Penjual / Warga"}
                    </Badge>
                  </div>
                </div>
                <DialogDescription className="text-xs text-slate-500 mt-1">
                  Terdaftar sejak {new Date(inspectingUser.createdAt).toLocaleDateString("id-ID", { dateStyle: "full" })}
                </DialogDescription>
              </DialogHeader>

              <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-sage/30 border border-slate-200">
                <Avatar className="h-12 w-12 border border-slate-200">
                  <AvatarImage src={inspectingUser.avatarUrl || undefined} alt={inspectingUser.fullName} />
                  <AvatarFallback className="bg-slate-900 text-sm font-bold text-white">
                    {inspectingUser.fullName.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <h3 className="text-sm font-bold text-slate-900 truncate">
                    {inspectingUser.fullName}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                    <span>{inspectingUser.email}</span>
                    <span>•</span>
                    <span>{inspectingUser.phone || "Tanpa No. HP"}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-center">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Listing
                  </span>
                  <span className="text-lg font-extrabold text-slate-900 mt-0.5 block">
                    {inspectingUser._count.listings}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-center">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Permintaan
                  </span>
                  <span className="text-lg font-extrabold text-slate-900 mt-0.5 block">
                    {inspectingUser._count.wasteRequests}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-center">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Jual Selesai
                  </span>
                  <span className="text-lg font-extrabold text-slate-900 mt-0.5 block">
                    {inspectingUser._count.sellerTransactions}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-center">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Beli Selesai
                  </span>
                  <span className="text-lg font-extrabold text-slate-900 mt-0.5 block">
                    {inspectingUser._count.buyerTransactions}
                  </span>
                </div>
              </div>

              {inspectingUser.address && (
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Alamat Lengkap
                  </span>
                  <p className="font-medium text-slate-800 mt-1 leading-relaxed">
                    {inspectingUser.address}
                  </p>
                </div>
              )}

              <DialogFooter className="flex flex-row gap-2.5 justify-end pt-3 border-t border-slate-100">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setInspectingUser(null)}
                  className="h-9 px-4 rounded-full text-xs font-semibold"
                >
                  Tutup
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    const u = inspectingUser;
                    setInspectingUser(null);
                    openEditModal(u);
                  }}
                  className="h-9 px-4 rounded-full text-xs font-bold border-slate-200 bg-sage/50 hover:bg-sage text-slate-800 gap-1.5"
                >
                  <Edit2 className="w-3.5 h-3.5 text-emerald-primary" />
                  <span>Edit Profil</span>
                </Button>
                <Button
                  type="button"
                  onClick={() => {
                    const u = inspectingUser;
                    setInspectingUser(null);
                    setUserToDelete(u);
                  }}
                  className="h-9 px-4 rounded-full bg-red-600 hover:bg-red-700 text-white text-xs font-bold gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Hapus User</span>
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={!!editingUser} onOpenChange={(open) => !open && setEditingUser(null)}>
        <DialogContent className="sm:max-w-xl p-6 rounded-3xl bg-white border border-slate-200 shadow-2xl">
          {editingUser && (
            <form onSubmit={handleSaveEditUser} className="space-y-4">
              <DialogHeader>
                <DialogTitle className="text-lg font-bold text-slate-900">
                  Edit Data Pengguna
                </DialogTitle>
                <DialogDescription className="text-xs text-slate-500 mt-1">
                  Perbarui informasi profil dan hak akses pengguna secara langsung.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-3.5 py-1 text-xs">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1">
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    required
                    value={editFormData.fullName}
                    onChange={(e) => setEditFormData({ ...editFormData, fullName: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-slate-400"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      required
                      value={editFormData.email}
                      onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-slate-400"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1">
                      No. Telepon / WhatsApp
                    </label>
                    <input
                      type="text"
                      value={editFormData.phone}
                      onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                      placeholder="08xxxxxxxxxx"
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-slate-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1">
                    Alamat Domisili / Gudang
                  </label>
                  <textarea
                    rows={2}
                    value={editFormData.address}
                    onChange={(e) => setEditFormData({ ...editFormData, address: e.target.value })}
                    placeholder="Alamat lengkap pengguna..."
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-slate-400 resize-none"
                  />
                </div>

                <div className="p-3.5 rounded-2xl bg-sage/30 border border-slate-200 space-y-2.5">
                  <span className="text-[10.5px] font-bold text-slate-500 uppercase tracking-wider block">
                    Hak Akses &amp; Status Peran
                  </span>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <label className="flex items-center gap-2.5 cursor-pointer text-xs font-semibold text-slate-800">
                      <input
                        type="checkbox"
                        checked={editFormData.isAdmin}
                        onChange={(e) => setEditFormData({ ...editFormData, isAdmin: e.target.checked })}
                        className="w-4 h-4 rounded-md border-slate-300 text-emerald-primary focus:ring-emerald-primary"
                      />
                      <span>Hak Super Administrator</span>
                    </label>

                    <label className="flex items-center gap-2.5 cursor-pointer text-xs font-semibold text-slate-800">
                      <input
                        type="checkbox"
                        checked={editFormData.isBuyerApproved}
                        onChange={(e) => setEditFormData({ ...editFormData, isBuyerApproved: e.target.checked })}
                        className="w-4 h-4 rounded-md border-slate-300 text-emerald-primary focus:ring-emerald-primary"
                      />
                      <span>Verifikasi Pengepul (Buyer)</span>
                    </label>
                  </div>
                </div>
              </div>

              <DialogFooter className="flex flex-row gap-2.5 justify-end pt-3 border-t border-slate-100">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditingUser(null)}
                  className="h-9 px-4 rounded-full text-xs font-semibold"
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  disabled={processingId === editingUser.id}
                  className="h-9 px-5 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold gap-1.5"
                >
                  {processingId === editingUser.id ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Simpan Perubahan</span>
                    </>
                  )}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={!!userToDelete} onOpenChange={(open) => !open && setUserToDelete(null)}>
        <DialogContent className="sm:max-w-md p-6 rounded-3xl bg-white border border-slate-200 shadow-2xl">
          {userToDelete && (
            <div className="space-y-4">
              <DialogHeader>
                <div className="flex items-center gap-2.5 text-red-600">
                  <AlertTriangle className="w-5 h-5" />
                  <DialogTitle className="text-base font-bold text-slate-900">
                    Hapus Akun Pengguna?
                  </DialogTitle>
                </div>
                <DialogDescription className="text-xs text-slate-500 mt-1">
                  Akun <strong className="text-slate-800">{userToDelete.fullName}</strong> ({userToDelete.email}) akan dihapus permanen dari database DaurNusa.
                </DialogDescription>
              </DialogHeader>

              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 space-y-1">
                <p className="font-bold">Perhatian:</p>
                <p>
                  Seluruh data terkait termasuk listing sampah, permintaan, riwayat pesan, dan transaksi pengguna ini akan ikut terhapus.
                </p>
              </div>

              <DialogFooter className="flex flex-row gap-2.5 justify-end pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setUserToDelete(null)}
                  className="h-9 px-4 rounded-full text-xs font-semibold"
                >
                  Batal
                </Button>
                <Button
                  type="button"
                  disabled={processingId === userToDelete.id}
                  onClick={() => handleDeleteUser(userToDelete.id)}
                  className="h-9 px-5 rounded-full bg-red-600 hover:bg-red-700 text-white text-xs font-bold gap-1.5"
                >
                  {processingId === userToDelete.id ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <>
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Hapus Permanen</span>
                    </>
                  )}
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
