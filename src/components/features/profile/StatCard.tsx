import type { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  icon: LucideIcon;
  iconClassName?: string;
  value: React.ReactNode;
  footerIcon: LucideIcon;
  footerIconClassName?: string;
  footerText: string;
  footerClassName?: string;
}

export function StatCard({
  label,
  icon: Icon,
  iconClassName = "text-[#7A8F5C]",
  value,
  footerIcon: FooterIcon,
  footerIconClassName,
  footerText,
  footerClassName = "text-[#78766B]",
}: StatCardProps) {
  return (
    <Card className="flex flex-col justify-between rounded-[32px] border border-zinc-200 bg-white p-6 shadow-xs">
      <div>
        <div className="flex items-center justify-between text-[#78766B]">
          <span className="text-[11px] font-bold uppercase tracking-wider">{label}</span>
          <Icon className={cn("h-4 w-4", iconClassName)} />
        </div>
        <div className="mt-2 text-2xl font-extrabold tracking-tight text-[#171717] sm:text-3xl">
          {value}
        </div>
      </div>
      <div
        className={cn(
          "mt-4 flex items-center gap-1.5 border-t border-zinc-100 pt-3 text-[11.5px] font-semibold",
          footerClassName
        )}
      >
        <FooterIcon className={cn("h-3.5 w-3.5", footerIconClassName)} />
        <span>{footerText}</span>
      </div>
    </Card>
  );
}
