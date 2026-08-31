"use client";

import { useState, useRef } from "react";
import { Camera, Sparkles, X, CheckCircle, RefreshCw, Upload, MapPin } from "lucide-react";
import { useRouter } from "next/navigation";
import { createListingAction } from "@/actions/listing.actions";
import { geocodeAddressAction } from "@/actions/geo.actions";
import * as tf from "@tensorflow/tfjs";
import { getCategoryMapping, getHumanReadableName, getBasePrice, samplePhotos } from "@/lib/model";

interface AIScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: { id: string; name: string; averagePrice?: number }[];
  sellerId?: string;
}

export function AIScannerModal({ isOpen, onClose, categories, sellerId }: AIScannerModalProps) {
  const router = useRouter();

  // Step state: 1: Upload/Camera, 2: Scanning AI, 3: AI Result & Form Input
  const [step, setStep] = useState<"upload" | "scanning" | "form">("upload");
  const [photoUrl, setPhotoUrl] = useState<string>("");

  // AI Scan Result State
  const [aiResult, setAiResult] = useState<{
    categoryName: string;
    categoryId: string;
    confidence: number;
  }>({ categoryName: "", categoryId: "", confidence: 0 });

  const [isManualOverride, setIsManualOverride] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isClassifying, setIsClassifying] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form Fields State
  const [formData, setFormData] = useState({
    title: "",
    categoryId: "",
    estimatedWeightKg: "",
    quantity: "",
    unit: "kg",
    condition: "Baik & Kering",
    description: "",
    estimatedPrice: "",
    address: "",
    latitude: "",
    longitude: "",
  });

  if (!isOpen) return null;

  const processImagePrediction = async (imageUrl: string) => {
    setPhotoUrl(imageUrl);
    setStep("scanning");
    setIsClassifying(true);

    try {
      const imgElement = document.createElement("img");
      imgElement.crossOrigin = "anonymous";
      imgElement.src = imageUrl;
      await new Promise((resolve, reject) => {
        imgElement.onload = resolve;
        imgElement.onerror = reject;
      });

      const tensor = tf.tidy(() => {
        let img = tf.browser.fromPixels(imgElement).resizeBilinear([224, 224]).toFloat();
        // Convert RGB to BGR
        img = img.reverse(-1);
        // Subtract ImageNet Mean
        const meanTensor = tf.tensor1d([103.939, 116.779, 123.680]);
        img = img.sub(meanTensor);
        return img.expandDims(0);
      });

      const modelUrl = "/model_ai_class/model.json";
      const model = await tf.loadGraphModel(modelUrl);
      const prediction = model.predict(tensor) as tf.Tensor;
      const scores = prediction.dataSync();
      tensor.dispose();
      prediction.dispose();

      const classesList = [
        "battery",
        "biological",
        "brown-glass",
        "cardboard",
        "green-glass",
        "metal",
        "paper",
        "plastic",
        "trash",
        "white-glass",
      ];
      const maxScore = Math.max(...Array.from(scores));
      const maxIdx = scores.indexOf(maxScore);
      const predictedLabel = classesList[maxIdx];
      const confidence = Number((maxScore * 100).toFixed(1));

      const humanName = getHumanReadableName(predictedLabel);
      const targetCat = categories.find(
        (c) => c.name.toLowerCase() === humanName.toLowerCase()
      );
      const catId = targetCat?.id || categories[0]?.id || "";

      setAiResult({ categoryName: humanName, categoryId: catId, confidence });
      setFormData((prev) => ({
        ...prev,
        title:
          targetCat?.name === "Sisa Makanan" || humanName === "Sisa Makanan"
            ? ""
            : humanName,
        categoryId: catId,
        estimatedPrice: String(
          targetCat?.averagePrice || getBasePrice(predictedLabel)
        ),
      }));
      setStep("form");
    } catch (e) {
      console.error(e);
      setStep("form");
    } finally {
      setIsClassifying(false);
    }
  };

  const handleSelectSample = (sample: typeof samplePhotos[0]) => {
    setPhotoUrl(sample.url);
    const humanName = getHumanReadableName(sample.targetLabel);
    const targetCat = categories.find(
      (c) => c.name.toLowerCase() === humanName.toLowerCase()
    );
    const catId = targetCat?.id || categories[0]?.id || "";

    setAiResult({
      categoryName: humanName,
      categoryId: catId,
      confidence: 98.5,
    });

    setFormData((prev) => ({
      ...prev,
      title:
        targetCat?.name === "Sisa Makanan" || humanName === "Sisa Makanan"
          ? ""
          : humanName,
      categoryId: catId,
      estimatedPrice: String(
        targetCat?.averagePrice || getBasePrice(sample.targetLabel)
      ),
    }));

    setStep("form");
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      processImagePrediction(url);
    }
  };

  const handleSubmitListing = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await createListingAction({
        title: formData.title,
        categoryId: formData.categoryId,
        estimatedWeightKg: formData.estimatedWeightKg
          ? Number(formData.estimatedWeightKg)
          : null,
        quantity: formData.quantity ? Number(formData.quantity) : null,
        unit: formData.unit,
        condition: formData.condition,
        description: formData.description,
        estimatedPrice: formData.estimatedPrice
          ? Number(formData.estimatedPrice)
          : null,
        address: formData.address,
        photoUrl,
        cvPredictedCategoryId: aiResult.categoryId,
        cvConfidence: aiResult.confidence,
        isCvCorrected: isManualOverride,
        sellerId: sellerId || undefined,
      });

      if (res.success && res.listing) {
        onClose();
        router.push(`/listings/match/${res.listing.id}`);
        router.refresh();
      } else {
        alert("Gagal membuat listing: " + (res.error || "Unknown error"));
      }
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan sistem");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-xl bg-white border border-zinc-200/80 rounded-3xl sm:rounded-[32px] text-[#171717] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-zinc-100 flex items-center justify-between bg-white">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-2xl bg-[#E8EEDD] text-[#6B7B4F] flex items-center justify-center shrink-0">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-display text-base sm:text-lg font-bold text-[#171717] tracking-tight">
                Foto &amp; Deteksi Sampah
              </h2>
              <p className="text-xs text-[#78766B]">
                Pindai foto sampah Anda untuk mengenali kategori secara otomatis
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-[#F7F4EE] text-[#78766B] hover:text-[#171717] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 bg-white">
          {/* STEP 1: UPLOAD / CAMERA PREVIEW */}
          {step === "upload" && (
            <div className="space-y-5">
              <input
                type="file"
                accept="image/*"
                capture="environment"
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileUpload}
              />
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-zinc-200 hover:border-[#6B7B4F] bg-[#FAF8F5] hover:bg-[#F7F4EE] rounded-2xl p-8 text-center space-y-3 transition-colors cursor-pointer group"
              >
                <div className="w-12 h-12 mx-auto rounded-2xl bg-white group-hover:bg-[#E8EEDD] text-[#78766B] group-hover:text-[#6B7B4F] shadow-xs flex items-center justify-center transition-colors">
                  <Upload className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-semibold text-[#171717]">
                    Klik untuk unggah foto sampah atau ambil via kamera
                  </p>
                  <p className="text-[11px] text-[#78766B] mt-0.5">
                    Mendukung format JPG, PNG, WEBP hingga 10MB
                  </p>
                </div>
              </div>

              {/* Sample Photo Chooser */}
              <div>
                <span className="text-[11px] font-bold text-[#78766B] block mb-2.5 uppercase tracking-wider">
                  Atau coba sampel foto pengujian:
                </span>
                <div className="grid grid-cols-2 gap-2.5">
                  {samplePhotos.map((s, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSelectSample(s)}
                      className="p-2.5 bg-[#FAF8F5] hover:bg-[#F7F4EE] border border-zinc-200/80 hover:border-[#6B7B4F]/40 rounded-2xl text-left flex items-center space-x-3 transition-all group cursor-pointer"
                    >
                      <img
                        src={s.url}
                        alt={s.name}
                        className="w-10 h-10 rounded-xl object-cover border border-zinc-200/60"
                      />
                      <div className="min-w-0 flex-1">
                        <span className="text-xs font-bold text-[#171717] block truncate">
                          {s.name}
                        </span>
                        <span className="text-[10px] font-semibold text-[#6B7B4F] bg-[#E8EEDD] px-2 py-0.5 rounded-full inline-block mt-0.5">
                          {getCategoryMapping(s.targetLabel)}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: SCANNING ANIMATION */}
          {step === "scanning" && (
            <div className="py-8 text-center space-y-5">
              <div className="relative w-44 h-44 mx-auto rounded-2xl overflow-hidden border border-zinc-200 shadow-sm bg-[#FAF8F5]">
                <img
                  src={photoUrl}
                  alt="Scanning"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/10" />
              </div>

              <div className="space-y-1">
                <p className="text-xs sm:text-sm font-bold text-[#171717] flex items-center justify-center gap-2">
                  <RefreshCw className="w-4 h-4 animate-spin text-[#6B7B4F]" />
                  Sedang menganalisis jenis material sampah...
                </p>
                <p className="text-[11px] text-[#78766B]">
                  Mencocokkan karakteristik visual dan tekstur limbah
                </p>
              </div>
            </div>
          )}

          {/* STEP 3: AI RESULT & FORM INPUT */}
          {step === "form" && (
            <form onSubmit={handleSubmitListing} className="space-y-4">
              {/* Photo Preview & AI Result Badge Card */}
              <div className="p-3.5 bg-[#FAF8F5] border border-zinc-200/80 rounded-2xl flex items-center space-x-3.5">
                <img
                  src={photoUrl}
                  alt="Preview"
                  className="w-14 h-14 rounded-xl object-cover border border-zinc-200 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#E8EEDD] text-[#2B3A1C] border border-[#6B7B4F]/20 mb-0.5">
                    <Sparkles className="w-3 h-3 text-[#6B7B4F]" />
                    <span>
                      Terdeteksi: {aiResult.categoryName} ({aiResult.confidence}%)
                    </span>
                  </div>

                  {!isManualOverride ? (
                    <button
                      type="button"
                      onClick={() => setIsManualOverride(true)}
                      className="text-[11px] text-[#6B7B4F] hover:underline block font-semibold mt-0.5 cursor-pointer"
                    >
                      Bukan {aiResult.categoryName.toLowerCase()}? Ubah manual
                    </button>
                  ) : (
                    <span className="text-[11px] text-amber-700 font-semibold block mt-0.5">
                      Mode Koreksi Manual Aktif
                    </span>
                  )}
                </div>
              </div>

              {/* Form Input Fields */}
              <div className="space-y-3">
                {/* Title */}
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-[#171717]">
                    Judul Barang Sampah *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 text-xs bg-[#F7F4EE] border border-zinc-200 focus:border-[#171717] focus:bg-white rounded-xl text-[#171717] focus:outline-none transition-colors"
                  />
                </div>

                {/* Category Select */}
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-[#171717]">
                    Kategori Sampah *
                  </label>
                  <select
                    value={formData.categoryId || aiResult.categoryId}
                    onChange={(e) => {
                      setFormData({ ...formData, categoryId: e.target.value });
                      setIsManualOverride(true);
                    }}
                    className="w-full px-3.5 py-2.5 text-xs bg-[#F7F4EE] border border-zinc-200 focus:border-[#171717] focus:bg-white rounded-xl text-[#171717] focus:outline-none transition-colors cursor-pointer"
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
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-[#171717]">
                      Berat (kg)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      placeholder="25"
                      value={formData.estimatedWeightKg}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          estimatedWeightKg: e.target.value,
                        })
                      }
                      className="w-full px-3.5 py-2.5 text-xs bg-[#F7F4EE] border border-zinc-200 focus:border-[#171717] focus:bg-white rounded-xl text-[#171717] focus:outline-none transition-colors"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-[#171717]">
                      Jumlah
                    </label>
                    <input
                      type="number"
                      placeholder="1"
                      value={formData.quantity}
                      onChange={(e) =>
                        setFormData({ ...formData, quantity: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 text-xs bg-[#F7F4EE] border border-zinc-200 focus:border-[#171717] focus:bg-white rounded-xl text-[#171717] focus:outline-none transition-colors"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-[#171717]">
                      Satuan
                    </label>
                    <input
                      type="text"
                      placeholder="kg"
                      value={formData.unit}
                      onChange={(e) =>
                        setFormData({ ...formData, unit: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 text-xs bg-[#F7F4EE] border border-zinc-200 focus:border-[#171717] focus:bg-white rounded-xl text-[#171717] focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                {/* Condition & Price */}
                <div className="grid grid-cols-2 gap-2.5">
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-[#171717]">
                      Kondisi
                    </label>
                    <input
                      type="text"
                      placeholder="contoh: Bersih & Kering"
                      value={formData.condition}
                      onChange={(e) =>
                        setFormData({ ...formData, condition: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 text-xs bg-[#F7F4EE] border border-zinc-200 focus:border-[#171717] focus:bg-white rounded-xl text-[#171717] focus:outline-none transition-colors"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-[#171717]">
                      Harga (Rp)
                    </label>
                    <input
                      type="number"
                      placeholder="45000"
                      value={formData.estimatedPrice}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          estimatedPrice: e.target.value,
                        })
                      }
                      className="w-full px-3.5 py-2.5 text-xs bg-[#F7F4EE] border border-zinc-200 focus:border-[#171717] focus:bg-white rounded-xl text-[#171717] focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-[#171717]">
                    Deskripsi Tambahan
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Keterangan singkat sampah..."
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 text-xs bg-[#F7F4EE] border border-zinc-200 focus:border-[#171717] focus:bg-white rounded-xl text-[#171717] focus:outline-none transition-colors resize-none"
                  />
                </div>

                {/* Address */}
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-[#171717]">
                    Alamat Penjemputan *
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      placeholder="Jl. Simpang Lima No. 1, Semarang"
                      value={formData.address}
                      onChange={(e) =>
                        setFormData({ ...formData, address: e.target.value })
                      }
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
                      className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-[#F7F4EE] border border-zinc-200 focus:border-[#171717] focus:bg-white rounded-xl text-[#171717] focus:outline-none transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Submit CTA Button */}
              <div className="pt-3 flex items-center justify-end space-x-2.5 border-t border-zinc-100">
                <button
                  type="button"
                  onClick={() => setStep("upload")}
                  className="px-4 py-2.5 rounded-full text-xs font-semibold text-[#78766B] hover:text-[#171717] hover:bg-[#F7F4EE] transition-colors cursor-pointer"
                >
                  Ulangi Scan
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-full text-xs font-bold bg-[#171717] hover:bg-[#2B2B26] text-white transition-all flex items-center space-x-2 cursor-pointer shadow-xs disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Menyimpan...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Publikasikan Listing</span>
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
