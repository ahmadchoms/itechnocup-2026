"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Upload,
  MapPin,
  RefreshCw,
  Sparkles,
  Navigation,
  Info,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createListingSchema,
  CreateListingInput,
} from "@/validations/listing.schema";
import { createListingAction } from "@/actions/listing.actions";
import {
  geocodeAddressAction,
  reverseGeocodeAction,
} from "@/actions/geo.actions";
import * as tf from "@tensorflow/tfjs";
import { getHumanReadableName, getBasePrice } from "@/lib/model";
import { toast } from "@/components/ui/sonner";
import { supabase } from "@/lib/supabase";

interface CreateListingClientProps {
  categories: { id: string; name: string; averagePrice?: number }[];
  sessionUser: any;
}

export function CreateListingClient({
  categories,
  sessionUser,
}: CreateListingClientProps) {
  const router = useRouter();
  const [step, setStep] = useState<"upload" | "form">("upload");
  const [photoUrl, setPhotoUrl] = useState("");
  const [isClassifying, setIsClassifying] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
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
      title: "",
      categoryId: categories[0]?.id || "",
      estimatedWeightKg: "",
      quantity: "",
      unit: "kg",
      condition: "Segar harian",
      description: "",
      estimatedPrice: "",
      address: sessionUser?.address || "Jl. Siranda No. 5, Semarang",
      latitude: -7.049,
      longitude: 110.435,
      photoUrl: "",
      cvConfidence: 94.5,
      isCvCorrected: false,
      sellerId: sessionUser?.id,
    },
  });

  const processImagePrediction = async (imageUrl: string, file?: File) => {
    if (file) setSelectedFile(file);
    setPhotoUrl(imageUrl);
    setValue("photoUrl", imageUrl);
    setStep("upload");
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
        let img = tf.browser
          .fromPixels(imgElement)
          .resizeBilinear([224, 224])
          .toFloat();
        img = img.reverse(-1);
        const meanTensor = tf.tensor1d([103.939, 116.779, 123.68]);
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
        (c) => c.name.toLowerCase() === humanName.toLowerCase(),
      );
      const catId = targetCat?.id || categories[0]?.id || "";

      setAiResult({ categoryName: humanName, categoryId: catId, confidence });
      const isSisaMakanan =
        targetCat?.name === "Sisa Makanan" || humanName === "Sisa Makanan";
      setValue("title", isSisaMakanan ? "" : humanName);
      setValue("categoryId", catId);
      setValue(
        "estimatedPrice",
        targetCat?.averagePrice || getBasePrice(predictedLabel),
      );
      setValue("cvConfidence", confidence);
      setStep("form");
    } catch (e) {
      console.error(e);
      setStep("form");
    } finally {
      setIsClassifying(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      processImagePrediction(url, file);
    }
  };

  const handleGetLocation = () => {
    if (typeof window === "undefined" || !navigator.geolocation) {
      toast.error("Browser Anda tidak mendukung deteksi lokasi Geolocation.");
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setValue("latitude", lat);
        setValue("longitude", lng);

        try {
          const rev = await reverseGeocodeAction({ lat, lng });
          if (rev.success && rev.displayName) {
            setValue("address", rev.displayName);
            toast.success("Lokasi GPS berhasil didapatkan");
          } else {
            toast.error("Gagal mendeteksi nama alamat dari GPS.");
          }
        } catch {
          toast.error("Gagal menghubungi layanan peta.");
        } finally {
          setIsLocating(false);
        }
      },
      (err) => {
        console.error("GPS error:", err);
        setIsLocating(false);
        toast.error(
          "Gagal membaca GPS: Pastikan izin lokasi telah diaktifkan.",
        );
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  };

  const onSubmit = async (data: CreateListingInput) => {
    setServerError(null);
    if (!selectedFile && !photoUrl) {
      setServerError("Foto sampah wajib diunggah atau dipilih.");
      return;
    }

    try {
      setIsUploading(true);
      let finalPhotoUrl = photoUrl;

      if (selectedFile) {
        const fileExt = selectedFile.name.split(".").pop();
        const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
        const filePath = `${sessionUser?.id || "guest"}/${fileName}`;

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("listing-image")
          .upload(filePath, selectedFile, {
            cacheControl: "3600",
            upsert: false,
          });

        if (uploadError) {
          throw new Error("Gagal mengunggah foto: " + uploadError.message);
        }

        const { data: publicUrlData } = supabase.storage
          .from("listing-image")
          .getPublicUrl(uploadData.path);

        finalPhotoUrl = publicUrlData.publicUrl;
      }

      const res = await createListingAction({
        ...data,
        photoUrl: finalPhotoUrl,
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
    } catch (err: any) {
      console.error(err);
      setServerError(err.message || "Terjadi kesalahan sistem. Coba lagi.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
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
            Unggah foto sampah Anda dan AI kami akan mengklasifikasikan
            kategorinya secara otomatis.
          </p>
        </div>
      </div>

      {serverError && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-medium">
          {serverError}
        </div>
      )}

      {step === "upload" && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6 shadow-xs">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              1. Pilih atau Unggah Foto Sampah
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Atau Anda dapat memilih untuk mengisi form secara manual:
            </p>
          </div>

          <div className="space-y-4">
            <input
              type="file"
              accept="image/*"
              id="file-upload"
              className="hidden"
              onChange={handleFileUpload}
            />
            <label
              htmlFor="file-upload"
              className="border-2 border-dashed border-slate-300 bg-slate-50 hover:bg-emerald-50 hover:border-emerald-500 rounded-xl p-8 text-center space-y-3 cursor-pointer transition-colors block"
            >
              <Upload className="w-8 h-8 text-slate-400 mx-auto" />
              <p className="text-sm font-medium text-slate-700">
                Klik untuk unggah foto sampah atau ambil via kamera
              </p>
              <p className="text-xs text-slate-500">
                Format JPG, PNG, WEBP hingga 10MB
              </p>
            </label>

            <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 mt-4 flex items-start gap-2.5">
              <Info className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
              <div className="text-[11px] text-blue-800 leading-relaxed">
                <strong>Info:</strong> Model AI Scanner mendukung deteksi 10
                jenis sampah:
                <span className="font-semibold text-blue-900">
                  {" "}
                  Kardus, Kertas, Plastik, Kaca (Bening/Hijau/Cokelat),
                  Logam/Besi, Baterai, Sampah Organik, dan Residu.
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setStep("form")}
              className="w-full mt-4 py-3 border border-slate-300 bg-white rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm cursor-pointer"
            >
              Input Data Manual (Tanpa Foto)
            </button>
          </div>

          {isClassifying && (
            <div className="flex items-center justify-center space-x-2 py-4 text-emerald-600 text-sm font-medium">
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>
                AI sedang memindai dan mengenali jenis material sampah...
              </span>
            </div>
          )}
        </div>
      )}

      {step === "form" && (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5 shadow-xs"
        >
          <div className="flex items-center space-x-4 p-4 rounded-xl border border-slate-200 bg-slate-50">
            {photoUrl ? (
              <img
                src={photoUrl}
                alt="Preview Sampah"
                className="w-16 h-16 rounded-lg object-cover border border-slate-300 shadow-sm"
              />
            ) : (
              <div className="w-16 h-16 rounded-lg bg-slate-200 border border-slate-300 shadow-sm flex items-center justify-center">
                <span className="text-[10px] text-slate-500 font-medium">
                  Tanpa Foto
                </span>
              </div>
            )}
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-slate-800">
                Foto Sampah Anda
              </h3>
              {photoUrl ? (
                <p className="text-xs text-slate-500 mt-0.5">
                  Foto asli berhasil dimuat.
                </p>
              ) : (
                <p className="text-xs text-amber-600 font-medium mt-0.5">
                  Listing dibuat tanpa foto. Disarankan memakai foto.
                </p>
              )}
            </div>
            {!aiResult && (
              <>
                <input
                  type="file"
                  accept="image/*"
                  id="replace-photo"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const url = URL.createObjectURL(file);
                      setPhotoUrl(url);
                      setValue("photoUrl", url);
                      setSelectedFile(file);
                    }
                  }}
                />
                <label
                  htmlFor="replace-photo"
                  className="text-xs px-3 py-1.5 rounded-lg font-semibold bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer shrink-0"
                >
                  Ubah Foto
                </label>
              </>
            )}
          </div>

          {aiResult && (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-emerald-500 text-white">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-semibold text-emerald-900">
                      Terdeteksi AI:
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-200 text-emerald-800">
                      {aiResult.categoryName}
                    </span>
                  </div>
                  <p className="text-[11px] text-emerald-700 mt-0.5">
                    Tingkat keyakinan: {aiResult.confidence.toFixed(1)}%
                  </p>
                </div>
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Judul Listing Sampah *
            </label>
            <input
              type="text"
              {...register("title")}
              className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl focus:bg-white focus:outline-none transition-colors"
            />
            {errors.title && (
              <p className="text-xs text-rose-600 mt-1 font-medium">
                {errors.title.message as string}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Kategori Sampah *
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
              <p className="text-xs text-rose-600 mt-1 font-medium">
                {errors.categoryId.message as string}
              </p>
            )}
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Berat (kg)
              </label>
              <input
                type="number"
                step="0.1"
                {...register("estimatedWeightKg")}
                className="w-full px-3 py-2.5 text-sm bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl focus:bg-white focus:outline-none transition-colors"
              />
              {errors.estimatedWeightKg && (
                <p className="text-xs text-rose-600 mt-1 font-medium">
                  {errors.estimatedWeightKg.message as string}
                </p>
              )}
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Jumlah
              </label>
              <input
                type="number"
                {...register("quantity")}
                className="w-full px-3 py-2.5 text-sm bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl focus:bg-white focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Satuan
              </label>
              <input
                type="text"
                {...register("unit")}
                className="w-full px-3 py-2.5 text-sm bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl focus:bg-white focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Kondisi
              </label>
              <input
                type="text"
                {...register("condition")}
                className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl focus:bg-white focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Harga Estimasi (Rp)
              </label>
              <input
                type="number"
                {...register("estimatedPrice")}
                className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl focus:bg-white focus:outline-none transition-colors"
              />
              {errors.estimatedPrice && (
                <p className="text-xs text-rose-600 mt-1 font-medium">
                  {errors.estimatedPrice.message as string}
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Deskripsi Sampah
            </label>
            <textarea
              rows={3}
              {...register("description")}
              className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl focus:bg-white focus:outline-none transition-colors resize-none"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                Alamat Lokasi Penjemputan *
              </label>
              <button
                type="button"
                onClick={handleGetLocation}
                disabled={isLocating}
                className="inline-flex items-center gap-1 text-[11px] text-emerald-700 hover:text-emerald-800 font-semibold cursor-pointer disabled:opacity-50 transition-colors"
              >
                <Navigation
                  className={`w-3 h-3 text-emerald-600 ${isLocating ? "animate-spin" : ""}`}
                />
                <span>
                  {isLocating ? "Membaca GPS..." : "📍 Ambil Lokasi GPS Saya"}
                </span>
              </button>
            </div>
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
              <p className="text-xs text-rose-600 mt-1 font-medium">
                {errors.address.message as string}
              </p>
            )}
          </div>

          <div className="pt-2 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => {
                setStep("upload");
                setPhotoUrl("");
                setSelectedFile(null);
              }}
              className="px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm transition-colors cursor-pointer"
            >
              Kembali
            </button>
            <button
              type="submit"
              disabled={isSubmitting || isUploading}
              className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-semibold text-sm transition-colors flex items-center space-x-2 disabled:opacity-60 cursor-pointer"
            >
              {isSubmitting || isUploading ? (
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
