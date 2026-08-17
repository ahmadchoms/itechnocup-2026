"use client";

import { useState } from "react";
import { Coins, Scale, Star, TrendingUp, CheckCircle, Clock, XCircle, User, MapPin, Phone, Mail, Award, MessageSquare, Repeat } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface ProfileClientProps {
  user: any;
  stats: {
    totalRevenue: number;
    totalKgSold: number;
    avgRating: number;
    totalTransactionsCount: number;
  };
  transactions: any[];
  reviews: any[];
  buyerApplication?: any;
}

export function ProfileClient({ user, stats, transactions, reviews, buyerApplication }: ProfileClientProps) {
  const router = useRouter();
  const [filterTab, setFilterTab] = useState<"semua" | "selesai" | "menunggu_konfirmasi" | "dibatalkan">("semua");
  const [isSwitching, setIsSwitching] = useState(false);
  
  // State for Buyer Application Modal
  const [showBuyerModal, setShowBuyerModal] = useState(false);
  const [buyerForm, setBuyerForm] = useState({
    ktpPhotoUrl: "",
    outletPhotoUrl: "",
    npwp: "",
    address: user.address || "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const handleSwitchRole = async () => {
    if (user.activeRole === "seller" && !user.isBuyerApproved) {
      alert("Anda belum disetujui untuk menjadi Pengepul (Buyer). Silakan daftar terlebih dahulu.");
      return;
    }

    setIsSwitching(true);
    try {
      const newRole = user.activeRole === "seller" ? "buyer" : "seller";
      const res = await fetch("/api/auth/role", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });
      
      const data = await res.json();
      if (res.ok) {
        router.refresh();
      } else {
        alert(data.error || "Gagal mengganti role");
      }
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan pada server");
    } finally {
      setIsSwitching(false);
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, field: "ktpPhotoUrl" | "outletPhotoUrl") => {
    if (e.target.files && e.target.files[0]) {
      try {
        const base64 = await fileToBase64(e.target.files[0]);
        setBuyerForm((prev) => ({ ...prev, [field]: base64 }));
      } catch (err) {
        console.error("Error converting file to base64", err);
      }
    }
  };

  const handleBuyerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError("");
    
    try {
      const res = await fetch("/api/buyer-applications/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(buyerForm),
      });
      
      const data = await res.json();
      if (res.ok) {
        setShowBuyerModal(false);
        router.refresh();
      } else {
        setSubmitError(data.error || "Gagal mengajukan pendaftaran");
      }
    } catch (err) {
      console.error(err);
      setSubmitError("Terjadi kesalahan pada server");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredTransactions = transactions.filter((t) => {
    if (filterTab === "semua") return true;
    return t.status === filterTab;
  });

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* User Profile Header Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center space-x-4">
          <img
            src={user.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"}
            alt={user.fullName}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-500 shadow-md shrink-0"
          />

          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-bold text-slate-900">{user.fullName}</h1>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
                {user.activeRole === 'seller' ? 'Mode: Seller' : 'Mode: Buyer'}
              </span>
            </div>

            <p className="text-xs text-slate-500 flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                {user.email}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                {user.phone}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                {user.address}
              </span>
            </p>
          </div>
        </div>

        <div className="flex flex-col items-end space-y-3 shrink-0">
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl px-4 py-2.5 text-center w-full">
            <span className="text-[10px] uppercase font-semibold text-emerald-700 block">Rating Reputasi</span>
            <span className="text-lg font-extrabold text-emerald-700 flex items-center justify-center gap-1">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              {stats.avgRating} / 5.0
            </span>
          </div>
          
          <div className="flex flex-col gap-2 w-full">
            {(! (user.activeRole === 'seller' && !user.isBuyerApproved)) && (
              <button
                onClick={handleSwitchRole}
                disabled={isSwitching}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-all disabled:opacity-50"
              >
                <Repeat className="w-4 h-4" />
                {isSwitching ? "Loading..." : `Beralih ke ${user.activeRole === 'seller' ? 'Buyer' : 'Seller'}`}
              </button>
            )}
            
            {user.activeRole === 'seller' && !user.isBuyerApproved && (
              <div className="w-full">
                {buyerApplication?.status === "menunggu" ? (
                   <div className="text-[10px] text-amber-700 bg-amber-50 border border-amber-200 px-3 py-2 rounded-xl text-center font-medium">
                     Pengajuan Pengepul sedang ditinjau.
                   </div>
                ) : buyerApplication?.status === "ditolak" ? (
                   <button
                     onClick={() => setShowBuyerModal(true)}
                     className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-100 text-red-700 border border-red-200 rounded-xl text-xs font-bold hover:bg-red-200 transition-all"
                   >
                     Pengajuan Ditolak - Daftar Ulang
                   </button>
                ) : (
                   <button
                     onClick={() => setShowBuyerModal(true)}
                     className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-bold hover:bg-emerald-200 transition-all"
                   >
                     Daftar Menjadi Pengepul
                   </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {showBuyerModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-xl">
            <h2 className="text-xl font-bold text-slate-900 mb-2">Daftar Menjadi Pengepul</h2>
            <p className="text-sm text-slate-500 mb-6">Lengkapi data berikut untuk menjadi buyer. Tim admin akan memverifikasi data Anda.</p>
            
            {submitError && (
              <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-xl text-sm font-medium border border-red-200">
                {submitError}
              </div>
            )}
            
            <form onSubmit={handleBuyerSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Foto KTP <span className="text-red-500">*</span></label>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, "ktpPhotoUrl")}
                  required
                  className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
                />
                {buyerForm.ktpPhotoUrl && <div className="mt-2 text-[10px] text-emerald-600 font-medium flex items-center gap-1"><CheckCircle className="w-3 h-3"/> File terlampir</div>}
              </div>
              
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Foto Outlet / Lokasi <span className="text-red-500">*</span></label>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, "outletPhotoUrl")}
                  required
                  className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
                />
                {buyerForm.outletPhotoUrl && <div className="mt-2 text-[10px] text-emerald-600 font-medium flex items-center gap-1"><CheckCircle className="w-3 h-3"/> File terlampir</div>}
              </div>
              
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nomor NPWP (Opsional)</label>
                <input 
                  type="text" 
                  placeholder="Masukkan NPWP jika ada"
                  value={buyerForm.npwp}
                  onChange={(e) => setBuyerForm({...buyerForm, npwp: e.target.value})}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Alamat Lengkap <span className="text-red-500">*</span></label>
                <textarea 
                  placeholder="Alamat operasional pengepul"
                  value={buyerForm.address}
                  onChange={(e) => setBuyerForm({...buyerForm, address: e.target.value})}
                  required
                  rows={3}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              
              <div className="pt-4 flex gap-3">
                <button 
                  type="button" 
                  onClick={() => setShowBuyerModal(false)}
                  className="flex-1 px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-sm font-bold hover:bg-slate-200 transition-colors"
                >
                  Batal
                </button>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-700 transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? "Mengirim..." : "Kirim Pengajuan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SUPABASE STYLE DASHBOARD STAT CARDS (3 Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Stat Card 1: Total Pendapatan */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
            <Coins className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400 block uppercase tracking-wider">
              Total Pendapatan (Rp)
            </span>
            <span className="text-2xl font-bold text-slate-900 tracking-tight block mt-0.5">
              Rp {stats.totalRevenue.toLocaleString("id-ID")}
            </span>
            <span className="text-[11px] text-emerald-600 font-medium flex items-center gap-1 mt-0.5">
              <TrendingUp className="w-3 h-3" />
              Dari {stats.totalTransactionsCount} transaksi sirkular
            </span>
          </div>
        </div>

        {/* Stat Card 2: Total Kg Terjual */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
            <Scale className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400 block uppercase tracking-wider">
              Total Volume Terjual
            </span>
            <span className="text-2xl font-bold text-slate-900 tracking-tight block mt-0.5">
              {stats.totalKgSold} kg
            </span>
            <span className="text-[11px] text-amber-600 font-medium flex items-center gap-1 mt-0.5">
              <Award className="w-3 h-3" />
              Terselamatkan dari TPA
            </span>
          </div>
        </div>

        {/* Stat Card 3: Rating Rata-rata */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
            <Star className="w-6 h-6 fill-purple-400 text-purple-500" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400 block uppercase tracking-wider">
              Rating Rata-Rata
            </span>
            <span className="text-2xl font-bold text-slate-900 tracking-tight block mt-0.5">
              {stats.avgRating} ★
            </span>
            <span className="text-[11px] text-purple-600 font-medium flex items-center gap-1 mt-0.5">
              <MessageSquare className="w-3 h-3" />
              Berdasarkan {reviews.length} ulasan terverifikasi
            </span>
          </div>
        </div>
      </div>

      {/* TABEL RIWAYAT TRANSAKSI DENGAN TAB FILTER */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Tabel Riwayat Transaksi (COD)</h2>
            <p className="text-xs text-slate-500">Pencatatan real-time hasil kesepakatan & transaksi COD.</p>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setFilterTab("semua")}
              className={cn(
                "px-3 py-1.5 rounded-lg transition-colors cursor-pointer",
                filterTab === "semua" ? "bg-white text-emerald-700 shadow-xs" : "text-slate-600"
              )}
            >
              Semua
            </button>
            <button
              onClick={() => setFilterTab("selesai")}
              className={cn(
                "px-3 py-1.5 rounded-lg transition-colors cursor-pointer",
                filterTab === "selesai" ? "bg-white text-emerald-700 shadow-xs" : "text-slate-600"
              )}
            >
              Selesai
            </button>
            <button
              onClick={() => setFilterTab("menunggu_konfirmasi")}
              className={cn(
                "px-3 py-1.5 rounded-lg transition-colors cursor-pointer",
                filterTab === "menunggu_konfirmasi" ? "bg-white text-amber-700 shadow-xs" : "text-slate-600"
              )}
            >
              Menunggu COD
            </button>
            <button
              onClick={() => setFilterTab("dibatalkan")}
              className={cn(
                "px-3 py-1.5 rounded-lg transition-colors cursor-pointer",
                filterTab === "dibatalkan" ? "bg-white text-red-700 shadow-xs" : "text-slate-600"
              )}
            >
              Dibatalkan
            </button>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-500 font-semibold uppercase tracking-wider">
                <th className="py-3 px-4">Pembeli (Buyer)</th>
                <th className="py-3 px-4">Kategori / Item</th>
                <th className="py-3 px-4">Jumlah & Satuan</th>
                <th className="py-3 px-4">Total Harga Akhir</th>
                <th className="py-3 px-4">Status Transaksi</th>
                <th className="py-3 px-4">Tanggal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredTransactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-slate-900">
                    {tx.buyer?.fullName || "Buyer"}
                  </td>
                  <td className="py-3.5 px-4 text-emerald-700 font-semibold">
                    {tx.category?.name || "Limbah"}
                  </td>
                  <td className="py-3.5 px-4 text-slate-700">
                    {tx.finalQuantity || 25} {tx.unit || "kg"}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-900">
                    Rp {tx.finalPrice.toLocaleString("id-ID")}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={cn(
                        "px-2.5 py-1 rounded-full text-[11px] font-semibold inline-flex items-center space-x-1",
                        tx.status === "selesai"
                          ? "bg-emerald-100 text-emerald-800"
                          : tx.status === "menunggu_konfirmasi"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-red-100 text-red-800"
                      )}
                    >
                      {tx.status === "selesai" && <CheckCircle className="w-3 h-3" />}
                      {tx.status === "menunggu_konfirmasi" && <Clock className="w-3 h-3" />}
                      {tx.status === "dibatalkan" && <XCircle className="w-3 h-3" />}
                      <span className="capitalize">{tx.status.replace("_", " ")}</span>
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-400">
                    {new Date(tx.createdAt).toLocaleDateString("id-ID")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* WIDGET DAFTAR ULASAN & RATING */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
        <h2 className="text-lg font-bold text-slate-900">Ulasan & Rating Diterima</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reviews.map((rev) => (
            <div key={rev.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <img
                    src={rev.reviewer.avatarUrl || "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150"}
                    alt={rev.reviewer.fullName}
                    className="w-8 h-8 rounded-full object-cover border border-slate-200"
                  />
                  <span className="font-semibold text-xs text-slate-900">{rev.reviewer.fullName}</span>
                </div>
                <div className="flex items-center text-amber-400 space-x-0.5">
                  {Array.from({ length: rev.rating }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                  ))}
                </div>
              </div>

              <p className="text-xs text-slate-600 italic">"{rev.comment}"</p>
              <span className="text-[10px] text-slate-400 block">{new Date(rev.createdAt).toLocaleDateString("id-ID")}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
