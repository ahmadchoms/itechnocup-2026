"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { ShoppingBag, CheckCircle2, MapPin, Scale, RefreshCw, ArrowLeft } from "lucide-react";
import Link from "next/link";

export function CreateRequestClient() {
  const router = useRouter();
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: "Butuh Ampas Kopi Rutin Mingguan 100kg",
    categoryId: "",
    quantityWanted: "100",
    unit: "kg",
    offeredPrice: "2000",
    address: "Jl. Raya Ungaran No. 88, Semarang",
    description: "Mencari ampas kopi basah/kering murni dari kedai kopi Semarang untuk bahan pupuk organik perkebunan Ungaran.",
  });

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setCategories(data);
          setFormData((prev) => ({ ...prev, categoryId: data[0].id }));
        }
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/requests/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        router.push("/requests");
        router.refresh();
      } else {
        const data = await res.json();
        alert(data.error || "Gagal membuat permintaan");
      }
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan sistem");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AppShell categories={categories}>
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center space-x-3">
          <Link
            href="/requests"
            className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Posting Permintaan Sampah (Buyer)
            </h1>
            <p className="text-xs text-slate-500">
              Posting limbah/sampah yang Anda cari agar pencocokan lokasi otomatis memberi rekomendasi Seller terdekat.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5 shadow-xs">
          {/* Judul Permintaan */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Judul Kebutuhan / Permintaan *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Contoh: Butuh Kardus Bekas 200kg untuk Pengepul"
              className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl focus:bg-white focus:outline-none transition-colors"
            />
          </div>

          {/* Kategori Sampah */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Kategori Sampah yang Dicari *
            </label>
            <select
              value={formData.categoryId}
              onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
              className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl focus:bg-white focus:outline-none transition-colors"
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Quantity & Unit */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Jumlah Diinginkan *
              </label>
              <input
                type="number"
                required
                value={formData.quantityWanted}
                onChange={(e) => setFormData({ ...formData, quantityWanted: e.target.value })}
                className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl focus:bg-white focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Satuan *
              </label>
              <input
                type="text"
                required
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                placeholder="kg, L, karung"
                className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl focus:bg-white focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* Penawaran Harga Awal */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Penawaran Harga Awal (Rp / Satuan) *
            </label>
            <input
              type="number"
              required
              value={formData.offeredPrice}
              onChange={(e) => setFormData({ ...formData, offeredPrice: e.target.value })}
              className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl focus:bg-white focus:outline-none transition-colors"
            />
          </div>

          {/* Deskripsi */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Deskripsi & Spesifikasi Limbah
            </label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl focus:bg-white focus:outline-none transition-colors"
            />
          </div>

          {/* Alamat Pengambilan / Lokasi Buyer */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Alamat Lengkap Lokasi Pengambilan *
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl focus:bg-white focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-3 flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-semibold text-sm shadow-md shadow-emerald-600/20 transition-all flex items-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Memproses...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Publikasikan Permintaan Buyer</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </AppShell>
  );
}
