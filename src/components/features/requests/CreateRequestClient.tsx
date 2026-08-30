"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createRequestSchema, CreateRequestInput } from "@/validations/request.schema";
import { createRequestAction } from "@/actions/request.actions";
import { getCategoriesAction } from "@/actions/category.actions";

interface CreateRequestClientProps {
  categories: { id: string; name: string }[];
}

export function CreateRequestClient({ categories: initialCategories = [] }: CreateRequestClientProps) {
  const router = useRouter();
  const [categories, setCategories] = useState<{ id: string; name: string }[]>(initialCategories);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<any>({
    resolver: zodResolver(createRequestSchema),
    defaultValues: {
      title: "Butuh Ampas Kopi Rutin Mingguan 100kg",
      categoryId: initialCategories[0]?.id || "",
      quantityWanted: 100,
      unit: "kg",
      offeredPrice: 2000,
      address: "Jl. Raya Ungaran No. 88, Semarang",
      description: "Mencari ampas kopi basah/kering murni dari kedai kopi Semarang untuk bahan pupuk organik perkebunan Ungaran.",
    },
  });

  useEffect(() => {
    if (categories.length === 0) {
      getCategoriesAction().then((res) => {
        if (res.success && res.categories && res.categories.length > 0) {
          setCategories(res.categories);
          setValue("categoryId", res.categories[0].id);
        }
      });
    }
  }, [categories, setValue]);

  const onSubmit = async (data: CreateRequestInput) => {
    setServerError(null);
    try {
      const res = await createRequestAction(data);

      if (res.success && res.wasteRequest) {
        router.push("/requests");
        router.refresh();
      } else {
        setServerError(res.error || "Gagal membuat permintaan");
      }
    } catch (err) {
      console.error(err);
      setServerError("Terjadi kesalahan sistem");
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

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5 shadow-xs">
        {serverError && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-medium">
            {serverError}
          </div>
        )}

        {/* Judul Permintaan */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Judul Kebutuhan / Permintaan *
          </label>
          <input
            type="text"
            {...register("title")}
            placeholder="Contoh: Butuh Kardus Bekas 200kg untuk Pengepul"
            className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl focus:bg-white focus:outline-none transition-colors"
          />
          {errors.title && (
            <p className="text-xs text-rose-600 mt-1 font-medium">{errors.title.message as string}</p>
          )}
        </div>

        {/* Kategori Sampah */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Kategori Sampah yang Dicari *
          </label>
          <select
            {...register("categoryId")}
            className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl focus:bg-white focus:outline-none transition-colors"
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          {errors.categoryId && (
            <p className="text-xs text-rose-600 mt-1 font-medium">{errors.categoryId.message as string}</p>
          )}
        </div>

        {/* Jumlah & Satuan */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Jumlah Dibutuhkan *
            </label>
            <input
              type="number"
              {...register("quantityWanted")}
              className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl focus:bg-white focus:outline-none transition-colors"
            />
            {errors.quantityWanted && (
              <p className="text-xs text-rose-600 mt-1 font-medium">{errors.quantityWanted.message as string}</p>
            )}
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Satuan
            </label>
            <input
              type="text"
              {...register("unit")}
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
            {...register("offeredPrice")}
            className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl focus:bg-white focus:outline-none transition-colors"
          />
          {errors.offeredPrice && (
            <p className="text-xs text-rose-600 mt-1 font-medium">{errors.offeredPrice.message as string}</p>
          )}
        </div>

        {/* Alamat Gudang / Tempat Penampungan */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Alamat Gudang / Drop Point *
          </label>
          <input
            type="text"
            {...register("address")}
            className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl focus:bg-white focus:outline-none transition-colors"
          />
          {errors.address && (
            <p className="text-xs text-rose-600 mt-1 font-medium">{errors.address.message as string}</p>
          )}
        </div>

        {/* Deskripsi */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Deskripsi Kebutuhan &amp; Spesifikasi
          </label>
          <textarea
            rows={3}
            {...register("description")}
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
