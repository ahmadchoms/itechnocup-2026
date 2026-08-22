import { CheckCircle, Clock, XCircle, type LucideIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { TransactionStatus } from "./types";

const STATUS_CONFIG: Record<string, { label: string; className: string; icon: LucideIcon }> = {
  selesai: { label: "Selesai", className: "bg-[#E8EEDD] text-[#6B7B4F]", icon: CheckCircle },
  menunggu_konfirmasi: {
    label: "Menunggu COD",
    className: "bg-[#FEF3D6] text-[#C98A0B]",
    icon: Clock,
  },
  dibatalkan: { label: "Dibatalkan", className: "bg-red-50 text-red-700", icon: XCircle },
};

interface TransactionStatusBadgeProps {
  status: TransactionStatus;
}

export function TransactionStatusBadge({ status }: TransactionStatusBadgeProps) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.menunggu_konfirmasi;
  const Icon = config.icon;

  return (
    <Badge
      variant="secondary"
      className={cn(
        "gap-1 rounded-full border-none px-2.5 py-0.5 text-[10.5px] font-bold",
        config.className
      )}
    >
      <Icon className="h-3 w-3" />
      <span>{config.label}</span>
    </Badge>
  );
}
