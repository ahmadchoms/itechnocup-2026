"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Upload, MapPin, RefreshCw, Sparkles, CheckCircle2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createListingSchema, CreateListingInput } from "@/validations/listing.schema";
import { createListingAction } from "@/actions/listing.actions";
import { classifyWasteAction } from "@/actions/ai.actions";
import { geocodeAddressAction } from "@/actions/geo.actions";

interface CreateListingClientProps {
  categories: { id: string; name: string }[];
  sessionUser: any;
}

export function CreateListingClient({ categories, sessionUser }: CreateListingClientProps) {
  const router = useRouter();
  const [step, setStep] = useState<"upload" | "form">("upload");
  const [photoUrl, setPhotoUrl] = useState(
    "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600"
  );
  const [isClassifying, setIsClassifying] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const [aiResult, setAiResult] = useState<{
    categoryName: string;
    categoryId: string;
    confidence: number;
  } | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<any>({
    resolver: zodResolver(createListingSchema),
    defaultValues: {
      title: "Ampas Kopi Basah Espresso Premium 25kg",
      categoryId: categories[0]?.id || "",
      estimatedWeightKg: 25,
      quantity: 25,
      unit: "kg",
      condition: "Segar harian",
      description: "Ampas kopi murni 100% Arabika dari ekstraksi espresso. Sangat cocok untuk bahan kompos pupuk organik.",
      estimatedPrice: 1500,
      address: sessionUser?.address || "Jl. Siranda No. 5, Semarang",
      latitude: -7.0490,
      longitude: 110.4350,
      photoUrl: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600",
      cvConfidence: 94.5,
      isCvCorrected: false,
      sellerId: sessionUser?.id,
    },
  });

  const samplePhotos = [
    {
      name: "Ampas Kopi",
      url: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600",
      catName: "Ampas Kopi",
      confidence: 94.5,
      title: "Ampas Kopi Basah Espresso 25kg",
      price: 1500,
    },
    {
      name: "Kardus Bekas",
      url: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=600",
      catName: "Anorganik",
      confidence: 91.2,
      title: "Kardus Bekas Pengepul 50kg",
      price: 1800,
    },
    {
      name: "Botol Plastik PET",
      url: "https://images.unsplash.com/photo-1605600659873-d808a13e4d2a?w=600",
      catName: "Anorganik",
      confidence: 98.0,
      title: "Botol Plastik PET Bersih 15kg",
      price: 3500,
    },
    {
      name: "Kaleng Minuman",
      url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600",
      catName: "Logam",
      confidence: 96.1,
      title: "Kaleng Aluminium Press 10kg",
      price: 12000,
    },
  ];

  const handleSelectPhoto = async (sample: typeof samplePhotos[0]) => {
    setPhotoUrl(sample.url);
    setValue("photoUrl", sample.url);
    setIsClassifying(true);

    try {
      const classifyRes = await classifyWasteAction({ photoUrl: sample.url });

      let catName = sample.catName;
      let conf = sample.confidence;
      let catId = categories.find((c) => c.name.toLowerCase() === catName.toLowerCase())?.id || categories[0]?.id || "";

      if (classifyRes.success) {
        catName = classifyRes.categoryName || catName;
        conf = classifyRes.confidence || conf;
        catId = classifyRes.categoryId || catId;
      }

      setAiResult({ categoryName: catName, categoryId: catId, confidence: conf });
      setValue("title", sample.title);
      setValue("categoryId", catId);
      setValue("estimatedPrice", sample.price);
      setValue("cvConfidence", conf);
      setStep("form");
    } catch {
      setStep("form");
    } finally {
      setIsClassifying(false);
    }
  };

  const onSubmit = async (data: CreateListingInput) => {
    setServerError(null);
    try {
      const res = await createListingAction({
        ...data,
        photoUrl,
        cvConfidence: aiResult?.confidence || 90.0,
        isCvCorrected: false,
        sellerId: sessionUser?.id,
      });

      if (res.success && res.listing) {
        router.push(`/listings/match/${res.listing.id}`);
        router.refresh();
      } else {
        setServerError(res.error || "Gagal membuat listing");
      }
    } catch {
      setServerError("Terjadi kesalahan sistem. Coba lagi.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <Link
          href="/profile"
          className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Jual Sampah / Limbah Daur Ulang
          </h1>
          <p className="text-xs text-slate-500">
            Unggah foto sampah Anda dan AI kami akan mengklasifikasikan kategorinya secara otomatis.
          </p>
        </div>
      </div>

      {serverError && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-medium">
          {serverError}
        </div>
      )}

      {/* Step 1: Upload Photo / Scanner */}
      {step === "upload" && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6 shadow-xs">
          <div>
            <h2 className="text-base font-bold text-slate-900">1. Pilih atau Unggah Foto Sampah</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Pilih salah satu sampel foto di bawah ini untuk menguji deteksi AI secara instan:
            </p>
          </div>

          {/* Sample Photos Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {samplePhotos.map((sample) => (
              <button
                key={sample.name}
                type="button"
                onClick={() => handleSelectPhoto(sample)}
                disabled={isClassifying}
                className="group relative flex flex-col items-center p-2.5 rounded-xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/50 transition-all text-left cursor-pointer overflow-hidden"
              >
                <img
                  src={sample.url}
                  alt={sample.name}
                  className="w-full h-24 object-cover rounded-lg mb-2 group-hover:scale-105 transition-transform duration-300"
                />
                <span className="text-xs font-semibold text-slate-800 line-clamp-1">{sample.name}</span>
                <span className="text-[10px] text-emerald-600 font-medium">{sample.catName}</span>
              </button>
            ))}
          </div>

          {isClassifying && (
            <div className="flex items-center justify-center space-x-2 py-4 text-emerald-600 text-sm font-medium">
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>AI sedang memindai dan mengenali jenis material sampah...</span>
            </div>
          )}
        </div>
      )}

      {/* Step 2: Form Input */}
      {step === "form" && (
        <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5 shadow-xs">
          {aiResult && (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-emerald-500 text-white">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-semibold text-emerald-900">Terdeteksi AI:</span>
                    <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-200 text-emerald-800">
                      {aiResult.categoryName}
                    </span>
                  </div>
                  <p className="text-[11px] text-emerald-700 mt-0.5">
                    Tingkat keyakinan: {aiResult.confidence.toFixed(1)}%
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setStep("upload")}
                className="text-xs text-emerald-700 font-semibold hover:underline cursor-pointer"
              >
                Ganti Foto
              </button>
            </div>
          )}

          {/* Judul Listing */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Judul Listing Sampah *</label>
            <input
              type="text"
              {...register("title")}
              className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl focus:bg-white focus:outline-none transition-colors"
            />
            {errors.title && (
              <p className="text-xs text-rose-600 mt-1 font-medium">{errors.title.message as string}</p>
            )}
          </div>

          {/* Kategori Sampah */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Kategori Sampah *</label>
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

          {/* Estimasi Berat & Kuantitas */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Berat (kg)</label>
              <input
                type="number"
                step="0.1"
                {...register("estimatedWeightKg")}
                className="w-full px-3 py-2.5 text-sm bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl focus:bg-white focus:outline-none transition-colors"
              />
              {errors.estimatedWeightKg && (
                <p className="text-xs text-rose-600 mt-1 font-medium">{errors.estimatedWeightKg.message as string}</p>
              )}
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Jumlah</label>
              <input
                type="number"
                {...register("quantity")}
                className="w-full px-3 py-2.5 text-sm bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl focus:bg-white focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Satuan</label>
              <input
                type="text"
                {...register("unit")}
                className="w-full px-3 py-2.5 text-sm bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl focus:bg-white focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* Kondisi & Harga */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Kondisi</label>
              <input
                type="text"
                {...register("condition")}
                className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl focus:bg-white focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Harga Estimasi (Rp)</label>
              <input
                type="number"
                {...register("estimatedPrice")}
                className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl focus:bg-white focus:outline-none transition-colors"
              />
              {errors.estimatedPrice && (
                <p className="text-xs text-rose-600 mt-1 font-medium">{errors.estimatedPrice.message as string}</p>
              )}
            </div>
          </div>

          {/* Deskripsi */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Deskripsi Sampah</label>
            <textarea
              rows={3}
              {...register("description")}
              className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl focus:bg-white focus:outline-none transition-colors resize-none"
            />
          </div>

          {/* Alamat dengan Auto Geocoding */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Alamat Lokasi Penjemputan *</label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                {...register("address")}
                onBlur={async (e) => {
                  const addr = e.target.value.trim();
                  if (addr.length < 3) return;
                  try {
                    const geo = await geocodeAddressAction({ address: addr });
                    if (geo.success) {
                      setValue("latitude", geo.lat);
                      setValue("longitude", geo.lng);
                    }
                  } catch {}
                }}
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl focus:bg-white focus:outline-none transition-colors"
              />
            </div>
            {errors.address && (
              <p className="text-xs text-rose-600 mt-1 font-medium">{errors.address.message as string}</p>
            )}
          </div>

          {/* Submit */}
          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-semibold text-sm transition-colors flex items-center space-x-2 disabled:opacity-60 cursor-pointer"
            >
              {isSubmitting ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <span>Publikasikan Listing Sampah</span>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
