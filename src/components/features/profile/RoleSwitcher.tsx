"use client";

import { motion } from "framer-motion";
import { Repeat } from "lucide-react";
import { cn } from "@/lib/utils";

interface RoleSwitcherProps {
  isSeller: boolean;
  isSwitching: boolean;
  onSelect: (role: "seller" | "buyer") => void;
}

export function RoleSwitcher({ isSeller, isSwitching, onSelect }: RoleSwitcherProps) {
  return (
    <div className="flex items-center gap-1.5 rounded-full border border-zinc-200 bg-[#F7F4EE] p-1 shadow-2xs">
      <button
        type="button"
        onClick={() => onSelect("seller")}
        disabled={isSwitching || isSeller}
        className={cn(
          "relative cursor-pointer rounded-full px-4 py-1.5 text-xs font-bold transition-colors",
          isSeller ? "text-[#171717]" : "text-[#78766B] hover:text-[#171717]"
        )}
      >
        {isSeller && (
          <motion.div
            layoutId="activeRoleIndicator"
            className="absolute inset-0 rounded-full bg-white shadow-xs"
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
          />
        )}
        <span className="relative z-10">Mode Penjual</span>
      </button>

      <button
        type="button"
        onClick={() => onSelect("buyer")}
        disabled={isSwitching || !isSeller}
        className={cn(
          "relative flex cursor-pointer items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-bold transition-colors",
          !isSeller ? "text-white" : "text-[#78766B] hover:text-[#171717]"
        )}
      >
        {!isSeller && (
          <motion.div
            layoutId="activeRoleIndicator"
            className="absolute inset-0 rounded-full bg-[#171717] shadow-xs"
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
          />
        )}
        <span className="relative z-10 flex items-center gap-1">
          {isSwitching && !isSeller ? <Repeat className="h-3 w-3 animate-spin" /> : null}
          Mode Pengepul
        </span>
      </button>
    </div>
  );
}
