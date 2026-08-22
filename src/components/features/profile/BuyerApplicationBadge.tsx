import { Clock, Sparkles, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { BuyerApplication } from "./types";

interface BuyerApplicationBadgeProps {
  application?: BuyerApplication | null;
  onRegister: () => void;
}

export function BuyerApplicationBadge({ application, onRegister }: BuyerApplicationBadgeProps) {
  if (application?.status === "menunggu") {
    return (
      <Badge
        variant="outline"
        className="gap-1.5 rounded-full border-[#C98A0B]/30 bg-[#FEF3D6] px-3.5 py-1.5 text-xs font-semibold text-[#C98A0B]"
      >
        <Clock className="h-3.5 w-3.5" />
        <span>Pengajuan Ditinjau</span>
      </Badge>
    );
  }

  if (application?.status === "ditolak") {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={onRegister}
        className="h-9 cursor-pointer gap-1.5 rounded-full border-red-200 bg-red-50 text-xs font-bold text-red-700 hover:bg-red-100"
      >
        <XCircle className="h-3.5 w-3.5" />
        <span>Pengajuan Ditolak &bull; Daftar Ulang</span>
      </Button>
    );
  }

  return (
    <Button
      onClick={onRegister}
      className="h-9 cursor-pointer gap-1.5 rounded-full bg-[#171717] px-4 text-xs font-bold text-white shadow-xs hover:bg-[#2B2B26]"
    >
      <Sparkles className="h-3.5 w-3.5 text-amber-300" />
      <span>Daftar Jadi Pengepul</span>
    </Button>
  );
}
