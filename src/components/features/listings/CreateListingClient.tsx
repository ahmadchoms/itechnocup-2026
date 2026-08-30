"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Upload, MapPin, RefreshCw, Sparkles, CheckCircle2 } from "lucide-react";
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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [aiResult, setAiResult] = useState<{
    categoryName: string;
    categoryId: string;
    confidence: number;
  } | null>(null);

  const [formData, setFormData] = useState({
    title: "Ampas Kopi Basah Espresso Premium 25kg",
    categoryId: categories[0]?.id || "",
    estimatedWeightKg: "25",
    quantity: "25",
    unit: "kg",
    condition: "Segar harian",
    description: "Ampas kopi murni 100% Arabika dari ekstraksi espresso. Sangat cocok untuk bahan kompos pupuk organik.",
    estimatedPrice: "1500",
    address: sessionUser.address || "Jl. Siranda No. 5, Semarang",
    latitude: "-7.0490",
    longitude: "110.4350",
  });

  const samplePhotos = [
    {
      name: "Ampas Kopi",
      url: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600",
      catName: "Ampas Kopi",
      confidence: 94.5,
      title: "Ampas Kopi Basah Espresso 25kg",
      price: "1500",
    },
    {
      name: "Kardus Bekas",
      url: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=600",
      catName: "Anorganik",
      confidence: 91.2,
      title: "Kardus Bekas Pengepul 50kg",
      price: "1800",
    },
    {
      name: "Botol Plastik PET",
      url: "https://images.unsplash.com/photo-1605600659873-d808a13e4d2a?w=600",
      catName: "Anorganik",
      confidence: 98.0,
      title: "Botol Plastik PET Bersih 15kg",
      price: "3500",
    },
    {
      name: "Kaleng Minuman",
      url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600",
      catName: "Logam",
      confidence: 96.1,
      title: "Kaleng Aluminium Press 10kg",
      price: "12000",
    },
  ];

  const handleSelectPhoto = async (sample: typeof samplePhotos[0]) => {
    setPhotoUrl(sample.url);
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
      setFormData((prev) => ({
        ...prev,
        title: sample.title,
        categoryId: catId,
        estimatedPrice: sample.price,
      }));
      setStep("form");
    } catch {
      setStep("form");
    } finally {
      setIsClassifying(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await createListingAction({
        title: formData.title,
        categoryId: formData.categoryId,
        estimatedWeightKg: formData.estimatedWeightKg ? Number(formData.estimatedWeightKg) : null,
        quantity: formData.quantity ? Number(formData.quantity) : null,
        unit: formData.unit,
        condition: formData.condition,
        description: formData.description,
        estimatedPrice: formData.estimatedPrice ? Number(formData.estimatedPrice) : null,
        address: formData.address,
        latitude: formData.latitude ? Number(formData.latitude) : null,
        longitude: formData.longitude ? Number(formData.longitude) : null,
        photoUrl,
        cvConfidence: aiResult?.confidence || 90.0,
        isCvCorrected: false,
        sellerId: sessionUser.id,
      });

      if (res.success && res.listing) {
        router.push(`/listings/match/${res.listing.id}`);
        router.refresh();
      } else {
        alert(res.error || "Gagal membuat listing");
      }
    } catch {
      alert("Terjadi kesalahan sistem. Coba lagi.");
    } finally {
      setIsSubmitting(false);
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
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Tambah Listing Sampah Baru</h1>
          <p className="text-xs text-slate-500">Unggah foto &amp; klasifikasi otomatis berbasis AI Computer Vision</p>
        </div>
      </div>

      {step === "upload" ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6">
          <div className="border-2 border-dashed border-slate-300 bg-slate-50 rounded-xl p-8 text-center space-y-3">
            <Upload className="w-8 h-8 text-slate-400 mx-auto" />
            <p className="text-sm font-medium text-slate-700">Pilih sampel foto di bawah untuk klasifikasi AI otomatis:</p>
          </div>

          {/* Sample chooser */}
          <div className="grid grid-cols-2 gap-3">
            {samplePhotos.map((s, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectPhoto(s)}
                disabled={isClassifying}
                className="p-3 bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-500 rounded-xl text-left flex items-center space-x-3 transition-colors cursor-pointer disabled:opacity-50"
              >
                <img src={s.url} alt={s.name} className="w-12 h-12 rounded-lg object-cover border border-slate-200" />
                <div>
                  <span className="text-xs font-bold text-slate-900 block">{s.name}</span>
                  <span className="text-[10px] text-emerald-700 font-semibold">{s.catName}</span>
                </div>
              </button>
            ))}
          </div>

          {isClassifying && (
            <div className="text-center py-4 space-y-2">
              <RefreshCw className="w-6 h-6 animate-spin text-emerald-600 mx-auto" />
              <p className="text-xs text-slate-600">Model Computer Vision sedang menganalisis foto...</p>
            </div>
          )}
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
          {/* AI Result Banner */}
          {aiResult && (
            <div className="p-4 rounded-xl bg-slate-900 text-white space-y-1">
              <span className="text-[10px] font-semibold text-purple-300 uppercase tracking-wider block">
                Hasil Deteksi Computer Vision
              </span>
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-white">{aiResult.categoryName}</span>
                <span className="text-xs font-semibold text-emerald-400">Akurasi {aiResult.confidence}%</span>
              </div>
            </div>
          )}

          {/* Judul */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Judul Listing *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl focus:bg-white focus:outline-none transition-colors"
            />
          </div>

          {/* Kategori */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Kategori Sampah *</label>
            <select
              value={formData.categoryId}
              onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
              className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl focus:bg-white focus:outline-none transition-colors"
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          {/* Quantity & Weight */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Berat (kg)</label>
              <input
                type="number"
                step="0.1"
                value={formData.estimatedWeightKg}
                onChange={(e) => setFormData({ ...formData, estimatedWeightKg: e.target.value })}
                className="w-full px-3 py-2.5 text-sm bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl focus:bg-white focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Jumlah</label>
              <input
                type="number"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                className="w-full px-3 py-2.5 text-sm bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl focus:bg-white focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Satuan</label>
              <input
                type="text"
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
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
                value={formData.condition}
                onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl focus:bg-white focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Harga Estimasi (Rp)</label>
              <input
                type="number"
                value={formData.estimatedPrice}
                onChange={(e) => setFormData({ ...formData, estimatedPrice: e.target.value })}
                className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl focus:bg-white focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* Deskripsi */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Deskripsi Sampah</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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
                required
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                onBlur={async (e) => {
                  const addr = e.target.value.trim();
                  if (addr.length < 3) return;
                  try {
                    const geo = await geocodeAddressAction({ address: addr });
                    if (geo.success) {
                      setFormData((prev) => ({
                        ...prev,
                        latitude: String(geo.lat),
                        longitude: String(geo.lng),
                      }));
                    }
                  } catch {}
                }}
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl focus:bg-white focus:outline-none transition-colors"
              />
            </div>
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
