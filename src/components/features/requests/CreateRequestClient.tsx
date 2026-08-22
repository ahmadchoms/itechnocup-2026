"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ShoppingBag, CheckCircle2, MapPin, Scale, RefreshCw, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface CreateRequestClientProps {
  categories: { id: string; name: string }[];
}

export function CreateRequestClient({ categories: initialCategories = [] }: CreateRequestClientProps) {
  const router = useRouter();
  const [categories, setCategories] = useState<{ id: string; name: string }[]>(initialCategories);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: "Butuh Ampas Kopi Rutin Mingguan 100kg",
    categoryId: initialCategories[0]?.id || "",
    quantityWanted: "100",
    unit: "kg",
    offeredPrice: "2000",
    address: "Jl. Raya Ungaran No. 88, Semarang",
    description: "Mencari ampas kopi basah/kering murni dari kedai kopi Semarang untuk bahan pupuk organik perkebunan Ungaran.",
  });

  useEffect(() => {
    if (categories.length === 0) {
      fetch("/api/categories")
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data) && data.length > 0) {
            setCategories(data);
            setFormData((prev) => ({ ...prev, categoryId: data[0].id }));
          }
        });
    }
  }, [categories]);

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
            Pasang Kebutuhan Sampah (Pengepul)
          </h1>
          <p className="text-xs text-slate-500">
            Pasang kebutuhan sampah yang Anda cari agar sistem memberikan rekomendasi Penjual sampah terdekat.
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
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Jumlah & Satuan */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Jumlah Dibutuhkan *
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
              Satuan
            </label>
            <input
              type="text"
              value={formData.unit}
              onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
              className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl focus:bg-white focus:outline-none transition-colors"
            />
          </div>
        </div>

        {/* Harga Penawaran */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Harga Penawaran Beli per Satuan (Rp) *
          </label>
          <input
            type="number"
            required
            value={formData.offeredPrice}
            onChange={(e) => setFormData({ ...formData, offeredPrice: e.target.value })}
            className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl focus:bg-white focus:outline-none transition-colors"
          />
        </div>

        {/* Alamat Gudang / Tempat Penampungan */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Alamat Gudang / Drop Point *
          </label>
          <input
            type="text"
            required
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl focus:bg-white focus:outline-none transition-colors"
          />
        </div>

        {/* Deskripsi */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Deskripsi Kebutuhan &amp; Spesifikasi
          </label>
          <textarea
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl focus:bg-white focus:outline-none transition-colors resize-none"
          />
        </div>

        {/* Tombol Submit */}
        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm transition-colors flex items-center space-x-2 disabled:opacity-60 cursor-pointer"
          >
            {isSubmitting ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <span>Publikasikan Kebutuhan Sampah</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
