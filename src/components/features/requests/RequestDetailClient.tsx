"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { displayFont, bodyFont } from "@/lib/fonts";
import { getCategoryAccent } from "@/lib/category-accent";
import { PriceHighlightCard } from "@/components/features/requests/detail/PriceHighlightCard";
import { SpecificationCard } from "@/components/features/requests/detail/SpecificationCard";
import { LocationMapCard } from "@/components/features/requests/detail/LocationMapCard";
import { MatchingListingsCard } from "@/components/features/requests/detail/MatchingListingsCard";
import { RevenueCalculatorCard } from "@/components/features/requests/detail/RevenueCalculatorCard";
import { BuyerProfileCard } from "@/components/features/requests/detail/BuyerProfileCard";
import { RelatedRequestsSection } from "@/components/features/requests/detail/RelatedRequestsSection";
import type {
  RequestDetail,
  SellerListing,
  UserRole,
  WasteRequest,
} from "@/types/waste-request";

interface RequestDetailClientProps {
  request: RequestDetail;
  currentUserId: string | null;
  currentRole?: UserRole;
  sellerListings?: SellerListing[];
  relatedRequests?: WasteRequest[];
}

export function RequestDetailClient({
  request,
  currentUserId,
  currentRole = "seller",
  sellerListings = [],
  relatedRequests = [],
}: RequestDetailClientProps) {
  const router = useRouter();
  const [isStartingChat, setIsStartingChat] = useState(false);
  const [customQty, setCustomQty] = useState<number>(
    request.quantityWanted ? Math.min(Number(request.quantityWanted), 10) : 10
  );

  const handleStartChat = async (customMessage?: string) => {
    if (!currentUserId) {
      router.push("/login");
      return;
    }
    setIsStartingChat(true);
    try {
      const res = await fetch("/api/matches/start-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          buyerId: request.buyerId,
          requestId: request.id,
          initialMessage: customMessage,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        router.push(`/chat/${data.conversationId}`);
      } else if (res.status === 401) {
        router.push("/login");
      } else {
        const errData = await res.json();
        alert(errData.error || "Gagal memulai obrolan");
      }
    } catch {
      alert("Terjadi kesalahan. Coba lagi.");
    } finally {
      setIsStartingChat(false);
    }
  };

  const isOwner = currentUserId === request.buyerId;
  const isActive = request.status === "aktif";
  const pricePerUnit = Number(request.offeredPrice || 0);
  const unit = request.unit || "kg";
  const accent = getCategoryAccent(request.categoryId);

  const defaultCenter = {
    lat: request.latitude || -7.0051,
    lng: request.longitude || 110.4381,
  };

  const mapMarkers = [
    {
      id: `request-${request.id}`,
      type: "buyer" as const,
      title: request.title,
      category: request.category?.name || "Limbah",
      price: `Rp ${pricePerUnit.toLocaleString("id-ID")}/${unit}`,
      distance: "Lokasi Pengepul",
      address: request.address || undefined,
      lat: defaultCenter.lat,
      lng: defaultCenter.lng,
    },
  ];

  const matchingSellerListings = sellerListings.filter(
    (l) => l.categoryId === request.categoryId
  );

  const showAction = !isOwner && isActive && currentRole === "seller";

  return (
    <div
      className={cn(
        displayFont.variable,
        bodyFont.variable,
        "mx-auto max-w-6xl space-y-6 sm:space-y-8 p-4 sm:p-6 lg:p-8"
      )}
    >
      <div className="flex items-center justify-between gap-4 border-b border-black/5 pb-4">
        <div className="flex items-center gap-3">
          <Link
            href="/requests"
            aria-label="Kembali ke katalog permintaan"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-black/5 bg-white text-[#171717] transition-colors hover:border-black/15"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          </Link>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11.5px] font-semibold text-[#78766B]">
                Kebutuhan Sampah Pengepul
              </span>
              <span
                className="rounded-full px-2.5 py-0.5 text-[10.5px] font-semibold"
                style={{ backgroundColor: accent.bg, color: accent.fg }}
              >
                {request.category?.name}
              </span>
            </div>
            <h1 className="mt-0.5 font-[family-name:var(--font-display)] text-[20px] font-extrabold tracking-tight text-[#171717] sm:text-[24px]">
              {request.title}
            </h1>
          </div>
        </div>

        <span
          className={cn(
            "shrink-0 rounded-full px-3 py-1 text-[11px] font-bold",
            isActive ? "bg-[#E8EEDD] text-[#6B7B4F]" : "bg-black/5 text-[#78766B]"
          )}
        >
          {isActive ? "● Sedang Dicari" : "● Selesai"}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <PriceHighlightCard
            price={pricePerUnit}
            unit={unit}
            quantityWanted={request.quantityWanted}
          />

          <SpecificationCard description={request.description} unit={unit} />

          <LocationMapCard
            address={request.address}
            latitude={request.latitude}
            longitude={request.longitude}
            markers={mapMarkers}
            center={defaultCenter}
          />

          {!isOwner && (
            <MatchingListingsCard
              listings={matchingSellerListings}
              buyerName={request.buyer.fullName}
              isStartingChat={isStartingChat}
              onOffer={handleStartChat}
            />
          )}
        </div>

        <div className="space-y-6">
          <RevenueCalculatorCard
            unit={unit}
            pricePerUnit={pricePerUnit}
            customQty={customQty}
            onQtyChange={setCustomQty}
            showAction={showAction}
            isStartingChat={isStartingChat}
            onStartChat={() =>
              handleStartChat(
                `Halo ${request.buyer.fullName}, saya berminat menyetor sekitar ${customQty} ${unit} sampah "${request.title}". Apakah bisa dijadwalkan penjemputan?`
              )
            }
          />

          <BuyerProfileCard buyer={request.buyer} />
        </div>
      </div>

      <RelatedRequestsSection requests={relatedRequests} />
    </div>
  );
}