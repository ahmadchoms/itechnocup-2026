"use client";

import { useState } from "react";
import { Camera, Sparkles, X, CheckCircle, RefreshCw, Upload, AlertCircle, MapPin } from "lucide-react";
import { useRouter } from "next/navigation";

interface AIScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: { id: string; name: string }[];
  sellerId?: string;
}

export function AIScannerModal({ isOpen, onClose, categories, sellerId }: AIScannerModalProps) {
  const router = useRouter();

  // Step state: 1: Upload/Camera, 2: Scanning AI, 3: AI Result & Form Input
  const [step, setStep] = useState<"upload" | "scanning" | "form">("upload");
  const [photoUrl, setPhotoUrl] = useState<string>(
    "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600"
  );
  
  // AI Scan Result State
  const [aiResult, setAiResult] = useState<{
    categoryName: string;
    categoryId: string;
    confidence: number;
  }>({
    categoryName: "Ampas Kopi",
    categoryId: categories.find((c) => c.name.toLowerCase().includes("kopi"))?.id || categories[0]?.id || "",
    confidence: 94.5,
  });

  const [isManualOverride, setIsManualOverride] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form Fields State
  const [formData, setFormData] = useState({
    title: "Ampas Kopi Basah Espresso Premium 25kg",
    categoryId: "",
    estimatedWeightKg: "25",
    quantity: "25",
    unit: "kg",
    condition: "Segar harian",
    description: "Ampas kopi murni 100% Arabika dari ekstraksi espresso cafe. Sangat cocok untuk bahan kompos pupuk organik atau media budidaya jamur.",
    estimatedPrice: "1500",
    address: "Jl. Siranda No. 5, Semarang",
    latitude: "-7.0490",
    longitude: "110.4350",
  });

  if (!isOpen) return null;

  // Preset Sample Photos for Fast Interactive Testing
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
      title: "Kardus Bekas Pack Tebal 50kg",
      price: "2000",
    },
    {
      name: "Botol Plastik PET",
      url: "https://images.unsplash.com/photo-1605600659873-d808a13e4d2a?w=600",
      catName: "Anorganik",
      confidence: 98.0,
      title: "Botol Plastik PET Bening 10kg",
      price: "3500",
    },
    {
      name: "Kaleng Alumunium",
      url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600",
      catName: "Logam",
      confidence: 96.1,
      title: "Kaleng Alumunium Minuman 5kg",
      price: "12000",
    },
  ];

  const handleSelectSample = async (sample: typeof samplePhotos[0]) => {
    setPhotoUrl(sample.url);
    setStep("scanning");

    try {
      // Panggil /api/classify (proxy CV provider)
      const classifyRes = await fetch("/api/classify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ photoUrl: sample.url }),
      });

      let categoryName = sample.catName;
      let confidence = sample.confidence;
      let catId = categories.find((c) => c.name.toLowerCase() === categoryName.toLowerCase())?.id || categories[0]?.id || "";

      if (classifyRes.ok) {
        const cvData = await classifyRes.json();
        categoryName = cvData.categoryName || categoryName;
        confidence = cvData.confidence || confidence;
        catId = cvData.categoryId || catId;
      }

      setAiResult({ categoryName, categoryId: catId, confidence });
      setFormData((prev) => ({
        ...prev,
        title: sample.title,
        categoryId: catId,
        estimatedPrice: sample.price,
      }));
      setStep("form");
    } catch {
      // Fallback ke mock data jika API gagal
      const targetCat = categories.find((c) => c.name.toLowerCase() === sample.catName.toLowerCase());
      const catId = targetCat?.id || categories[0]?.id || "";
      setAiResult({ categoryName: sample.catName, categoryId: catId, confidence: sample.confidence });
      setFormData((prev) => ({ ...prev, title: sample.title, categoryId: catId, estimatedPrice: sample.price }));
      setStep("form");
    }
  };

  const handleSubmitListing = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/listings/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          photoUrl,
          cvPredictedCategoryId: aiResult.categoryId,
          cvConfidence: aiResult.confidence,
          isCvCorrected: isManualOverride,
          sellerId: sellerId || undefined,
        }),
      });

      if (res.ok) {
        onClose();
        router.push("/listings");
        router.refresh();
      } else {
        const data = await res.json();
        alert(data.error || "Gagal membuat listing");
      }
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan koneksi");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 animate-in fade-in">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl text-slate-100 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white tracking-tight">
                Foto &amp; Deteksi Sampah Otomatis
              </h2>
              <p className="text-xs text-slate-400">Foto sampahmu, sistem akan mendeteksi kategorinya secara otomatis</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* STEP 1: UPLOAD / CAMERA PREVIEW */}
          {step === "upload" && (
            <div className="space-y-4">
              <div className="border-2 border-dashed border-slate-700 hover:border-emerald-500/50 bg-slate-950/40 rounded-xl p-8 text-center space-y-3 transition-colors cursor-pointer group">
                <div className="w-14 h-14 mx-auto rounded-full bg-slate-800 group-hover:bg-emerald-950/50 text-slate-400 group-hover:text-emerald-400 flex items-center justify-center transition-colors">
                  <Upload className="w-7 h-7" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-200">
                    Klik untuk unggah foto sampah atau ambil via kamera
                  </p>
                  <p className="text-xs text-slate-400 mt-1">Format JPG, PNG, WEBP hingga 10MB</p>
                </div>
              </div>

              {/* Sample Photo Chooser for Fast Demo */}
              <div>
                <span className="text-xs font-semibold text-slate-400 block mb-2">
                  Atau pilih contoh sampel foto di bawah untuk pengujian cepat:
                </span>
                <div className="grid grid-cols-2 gap-2.5">
                  {samplePhotos.map((s, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSelectSample(s)}
                      className="p-2.5 bg-slate-800/80 hover:bg-emerald-950/40 border border-slate-700 hover:border-emerald-500/40 rounded-xl text-left flex items-center space-x-3 transition-all group"
                    >
                      <img
                        src={s.url}
                        alt={s.name}
                        className="w-10 h-10 rounded-lg object-cover border border-slate-700"
                      />
                      <div>
                        <span className="text-xs font-semibold text-slate-200 block group-hover:text-emerald-400">
                          {s.name}
                        </span>
                        <span className="text-[10px] text-slate-400">{s.catName}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: SCANNING LASER ANIMATION */}
          {step === "scanning" && (
            <div className="py-8 text-center space-y-6">
              <div className="relative w-48 h-48 mx-auto rounded-2xl overflow-hidden border-2 border-emerald-500/40">
                <img src={photoUrl} alt="Scanning" className="w-full h-full object-cover" />
                {/* Laser Scanning Overlay Line */}
                <div className="absolute left-0 right-0 h-1 bg-emerald-500 animate-laser" />
                <div className="absolute inset-0 bg-emerald-950/20" />
              </div>

              <div className="space-y-1">
                <p className="text-sm font-semibold text-emerald-400 flex items-center justify-center gap-2">
                  <RefreshCw className="w-4 h-4 animate-spin text-emerald-400" />
                  Model Computer Vision sedang menganalisis foto...
                </p>
                <p className="text-xs text-slate-400">Mencocokkan fitur visual & tekstur permukaan limbah</p>
              </div>
            </div>
          )}

          {/* STEP 3: AI RESULT & FORM INPUT */}
          {step === "form" && (
            <form onSubmit={handleSubmitListing} className="space-y-5">
              {/* Photo Preview & AI Result Badge Card */}
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl flex items-center space-x-4">
                <img
                  src={photoUrl}
                  alt="Preview"
                  className="w-16 h-16 rounded-lg object-cover border border-slate-700 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-950/80 text-purple-300 border border-purple-700/50 mb-1">
                    <Sparkles className="w-3 h-3 text-purple-400" />
                    <span>🤖 Terdeteksi: {aiResult.categoryName} ({aiResult.confidence}% Keyakinan)</span>
                  </div>

                  {!isManualOverride ? (
                    <button
                      type="button"
                      onClick={() => setIsManualOverride(true)}
                      className="text-xs text-amber-400 hover:underline block font-medium mt-0.5"
                    >
                      Bukan {aiResult.categoryName.toLowerCase()}? Ubah manual
                    </button>
                  ) : (
                    <span className="text-[11px] text-amber-400 font-medium block mt-0.5">
                      ⚠️ Mode Koreksi Manual Aktif
                    </span>
                  )}
                </div>
              </div>

              {/* Form Input Fields */}
              <div className="space-y-3">
                {/* Title */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Judul Listing Sampah *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-slate-800 border border-slate-700 focus:border-emerald-500 rounded-xl text-slate-100 focus:outline-none"
                  />
                </div>

                {/* Category Select */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Kategori Sampah *
                  </label>
                  <select
                    value={formData.categoryId || aiResult.categoryId}
                    onChange={(e) => {
                      setFormData({ ...formData, categoryId: e.target.value });
                      setIsManualOverride(true);
                    }}
                    className="w-full px-3 py-2 text-sm bg-slate-800 border border-slate-700 focus:border-emerald-500 rounded-xl text-slate-100 focus:outline-none"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Weight, Quantity & Unit */}
                <div className="grid grid-cols-3 gap-2.5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Berat Estimasi (kg)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.estimatedWeightKg}
                      onChange={(e) => setFormData({ ...formData, estimatedWeightKg: e.target.value })}
                      className="w-full px-3 py-2 text-sm bg-slate-800 border border-slate-700 focus:border-emerald-500 rounded-xl text-slate-100 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Jumlah Unit
                    </label>
                    <input
                      type="number"
                      value={formData.quantity}
                      onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                      className="w-full px-3 py-2 text-sm bg-slate-800 border border-slate-700 focus:border-emerald-500 rounded-xl text-slate-100 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Satuan
                    </label>
                    <input
                      type="text"
                      placeholder="kg, L, karung"
                      value={formData.unit}
                      onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                      className="w-full px-3 py-2 text-sm bg-slate-800 border border-slate-700 focus:border-emerald-500 rounded-xl text-slate-100 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Condition & Price */}
                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Kondisi Sampah
                    </label>
                    <input
                      type="text"
                      placeholder="contoh: Kering, Segar harian"
                      value={formData.condition}
                      onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                      className="w-full px-3 py-2 text-sm bg-slate-800 border border-slate-700 focus:border-emerald-500 rounded-xl text-slate-100 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Harga Estimasi (Rp / Satuan)
                    </label>
                    <input
                      type="number"
                      value={formData.estimatedPrice}
                      onChange={(e) => setFormData({ ...formData, estimatedPrice: e.target.value })}
                      className="w-full px-3 py-2 text-sm bg-slate-800 border border-slate-700 focus:border-emerald-500 rounded-xl text-slate-100 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Deskripsi Detail
                  </label>
                  <textarea
                    rows={2}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-slate-800 border border-slate-700 focus:border-emerald-500 rounded-xl text-slate-100 focus:outline-none"
                  />
                </div>

                  {/* Address with Auto-Geocode */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Alamat Lokasi Penjemputan *
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      onBlur={async (e) => {
                        const addr = e.target.value.trim();
                        if (addr.length < 5) return;
                        try {
                          const geoRes = await fetch(`/api/geocode?address=${encodeURIComponent(addr)}`);
                          if (geoRes.ok) {
                            const geo = await geoRes.json();
                            setFormData((prev) => ({
                              ...prev,
                              latitude: String(geo.lat),
                              longitude: String(geo.lng),
                            }));
                          }
                        } catch { /* Geocoding gagal, tetap gunakan nilai manual */ }
                      }}
                      className="w-full pl-9 pr-3 py-2 text-sm bg-slate-800 border border-slate-700 focus:border-emerald-500 rounded-xl text-slate-100 focus:outline-none"
                    />
                  </div>
                  {formData.latitude && formData.longitude && (
                    <span className="text-[10px] text-emerald-400 mt-0.5 block pl-1">
                      📍 Koordinat: {Number(formData.latitude).toFixed(4)}, {Number(formData.longitude).toFixed(4)}
                    </span>
                  )}
                </div>
              </div>

              {/* Submit CTA Button */}
              <div className="pt-2 flex items-center justify-end space-x-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setStep("upload")}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white transition-colors"
                >
                  Ulangi Scan
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white shadow-lg shadow-emerald-950 transition-all flex items-center space-x-2"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Menyimpan...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      <span>Publikasikan Listing Sampah</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
