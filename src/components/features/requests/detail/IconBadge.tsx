import type { LucideIcon } from "lucide-react";

interface IconBadgeProps {
    icon: LucideIcon;
    label: string;
    value: string;
    tint: { bg: string; fg: string };
}

export function IconBadge({ icon: Icon, label, value, tint }: IconBadgeProps) {
    return (
        <div className="h-full rounded-2xl bg-[#F7F4EE] p-3">
            <div className="flex items-center gap-2">
                <span
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl"
                    style={{ backgroundColor: tint.bg, color: tint.fg }}
                >
                    <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                </span>
                <span className="text-[11px] font-semibold text-[#171717]">{label}</span>
            </div>
            <p className="mt-2 text-[12.5px] font-semibold text-[#3F3D38]">{value}</p>
        </div>
    );
}