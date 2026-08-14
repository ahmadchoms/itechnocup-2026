"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Store, Compass, MessageSquare, User, Camera } from "lucide-react";
import { cn } from "@/lib/utils";

interface BottomNavProps {
  onOpenScanner: () => void;
}

export function BottomNav({ onOpenScanner }: BottomNavProps) {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200/80 h-16 px-3 flex items-center justify-around shadow-xs">
      {/* Tab 1: Beranda */}
      <Link
        href="/listings"
        className={cn(
          "flex flex-col items-center justify-center space-y-1 text-[11px] font-medium transition-colors",
          pathname === "/listings" || pathname === "/"
            ? "text-emerald-600 font-bold"
            : "text-slate-500 hover:text-slate-800"
        )}
      >
        <Store className="w-5 h-5" />
        <span>Beranda</span>
      </Link>

      {/* Tab 2: Pencocokan */}
      <Link
        href="/matches"
        className={cn(
          "flex flex-col items-center justify-center space-y-1 text-[11px] font-medium transition-colors",
          pathname === "/matches"
            ? "text-emerald-600 font-bold"
            : "text-slate-500 hover:text-slate-800"
        )}
      >
        <Compass className="w-5 h-5" />
        <span>Pencocokan</span>
      </Link>

      {/* Center Floating Action Button (FAB): Foto Sampah */}
      <div className="-mt-5 flex flex-col items-center">
        <button
          onClick={onOpenScanner}
          type="button"
          aria-label="Foto & Jual Sampah"
          className="w-13 h-13 rounded-full bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white shadow-sm flex items-center justify-center transition-colors cursor-pointer"
        >
          <Camera className="w-6 h-6" />
        </button>
        <span className="text-[10px] font-semibold text-emerald-700 mt-1">Foto Sampah</span>
      </div>

      {/* Tab 3: Pesan */}
      <Link
        href="/chat"
        className={cn(
          "flex flex-col items-center justify-center space-y-1 text-[11px] font-medium transition-colors",
          pathname.startsWith("/chat")
            ? "text-emerald-600 font-bold"
            : "text-slate-500 hover:text-slate-800"
        )}
      >
        <MessageSquare className="w-5 h-5" />
        <span>Pesan</span>
      </Link>

      {/* Tab 4: Profil */}
      <Link
        href="/profile"
        className={cn(
          "flex flex-col items-center justify-center space-y-1 text-[11px] font-medium transition-colors",
          pathname.startsWith("/profile")
            ? "text-emerald-600 font-bold"
            : "text-slate-500 hover:text-slate-800"
        )}
      >
        <User className="w-5 h-5" />
        <span>Profil</span>
      </Link>
    </nav>
  );
}
