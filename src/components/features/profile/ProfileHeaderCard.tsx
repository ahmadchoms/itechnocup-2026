"use client";

import { Mail, MapPin, Pencil, Phone, ShieldCheck } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { buttonVariants } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { RoleSwitcher } from "./RoleSwitcher";
import { BuyerApplicationBadge } from "./BuyerApplicationBadge";
import type { BuyerApplication, ProfileUser } from "./types";

interface ProfileHeaderCardProps {
  user: ProfileUser;
  buyerApplication?: BuyerApplication | null;
  isSwitching: boolean;
  onSwitchRole: (role: "seller" | "buyer") => void;
  onEditProfile: () => void;
  onRegisterBuyer: () => void;
}

export function ProfileHeaderCard({
  user,
  buyerApplication,
  isSwitching,
  onSwitchRole,
  onEditProfile,
  onRegisterBuyer,
}: ProfileHeaderCardProps) {
  const isSeller = user.activeRole === "seller";
  const isPendingBuyerApproval = user.activeRole === "seller" && !user.isBuyerApproved;

  return (
    <div className="rounded-[32px] border border-zinc-200 bg-white p-6 shadow-xs sm:p-8">
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-5">
          <div className="relative shrink-0">
            <Avatar className="h-20 w-20 border-2 border-[#7A8F5C] shadow-xs">
              <AvatarImage
                src={
                  user.avatarUrl ||
                  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160"
                }
                alt={user.fullName}
                className="object-cover"
              />
              <AvatarFallback className="bg-[#EFF3E7] text-lg font-bold text-[#6B7B4F]">
                {user.fullName?.slice(0, 2).toUpperCase() || "DN"}
              </AvatarFallback>
            </Avatar>
            <span className="absolute bottom-0 right-0 flex h-6 w-6 items-center justify-center rounded-full bg-[#7A8F5C] text-white shadow-2xs ring-2 ring-white">
              <ShieldCheck className="h-3.5 w-3.5" />
            </span>
          </div>

          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="font-[family-name:var(--font-display)] text-xl font-extrabold tracking-tight text-[#171717] sm:text-2xl">
                {user.fullName}
              </h1>
              <Tooltip>
                <TooltipTrigger
                  className={buttonVariants({
                    variant: "ghost",
                    size: "icon",
                    className:
                      "h-7 w-7 rounded-full border text-[#78766B] hover:bg-[#F7F4EE] hover:text-[#171717]",
                  })}
                  onClick={onEditProfile}
                >
                  <Pencil className="h-3.5 w-3.5" />
                </TooltipTrigger>
                <TooltipContent className="text-xs font-semibold">Edit Profil</TooltipContent>
              </Tooltip>
            </div>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#78766B]">
              <span className="flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5 text-[#8A8778]" />
                {user.email}
              </span>
              {user.phone && (
                <span className="flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5 text-[#8A8778]" />
                  {user.phone}
                </span>
              )}
              {user.address && (
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-[#7A8F5C]" />
                  <span className="max-w-[280px] truncate">{user.address}</span>
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex shrink-0 flex-col items-start gap-3 border-t border-zinc-100 pt-4 sm:flex-row sm:items-center md:flex-col md:items-end md:border-t-0 md:pt-0">
          {!isPendingBuyerApproval && (
            <RoleSwitcher isSeller={isSeller} isSwitching={isSwitching} onSelect={onSwitchRole} />
          )}

          {isPendingBuyerApproval && (
            <BuyerApplicationBadge application={buyerApplication} onRegister={onRegisterBuyer} />
          )}
        </div>
      </div>
    </div>
  );
}
