"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Store, Compass, MessageSquare, User, Camera, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { getAuthUserAction } from "@/actions/auth.actions";

interface BottomNavProps {
  onOpenScanner?: () => void;
  initialSessionUser?: {
    id: string;
    fullName: string;
    email: string;
    isAdmin: boolean;
    activeRole: "seller" | "buyer";
    avatarUrl?: string | null;
  } | null;
}

export function BottomNav({
  onOpenScanner,
  initialSessionUser = null,
}: BottomNavProps) {
  const pathname = usePathname();
  const [sessionUser, setSessionUser] = useState<{
    id: string;
    fullName: string;
    email: string;
    isAdmin: boolean;
    activeRole: "seller" | "buyer";
    avatarUrl?: string | null;
  } | null>(initialSessionUser);

  useEffect(() => {
    if (initialSessionUser) {
      setSessionUser(initialSessionUser);
    }
  }, [initialSessionUser]);

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/80 h-16 px-2 flex items-center justify-around shadow-lg">
      {/* 1. Tab Beranda */}
      <Link
        href="/"
        className={cn(
          "flex flex-col items-center justify-center space-y-1 text-[10px] font-medium transition-colors flex-1 py-1",
          pathname === "/"
            ? "text-emerald-600 font-bold"
            : "text-slate-500 hover:text-slate-800",
        )}
      >
        <Store className="w-5 h-5" />
        <span>Beranda</span>
      </Link>

      {/* 2. Tab Permintaan Sampah */}
      <Link
        href="/requests"
        className={cn(
          "flex flex-col items-center justify-center space-y-1 text-[10px] font-medium transition-colors flex-1 py-1",
          pathname.startsWith("/requests")
            ? "text-emerald-600 font-bold"
            : "text-slate-500 hover:text-slate-800",
        )}
      >
        <Compass className="w-5 h-5" />
        <span>Permintaan</span>
      </Link>

      {/* 3. Center Floating Action Button (FAB): Foto & Jual Sampah / Buat Permintaan */}
      <div className="-mt-6 flex flex-col items-center shrink-0 px-2">
        {sessionUser?.activeRole === "buyer" ? (
          <Link
            href="/requests/create"
            aria-label="Buat Permintaan"
            className="w-14 h-14 rounded-full bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white shadow-lg ring-4 ring-white flex items-center justify-center transition-transform active:scale-95 cursor-pointer relative"
          >
            <Plus className="w-6 h-6 text-white" />
          </Link>
        ) : (
          <button
            onClick={onOpenScanner}
            type="button"
            aria-label="Foto & Jual Sampah"
            className="w-14 h-14 rounded-full bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white shadow-lg ring-4 ring-white flex items-center justify-center transition-transform active:scale-95 cursor-pointer relative"
          >
            <Camera className="w-6 h-6 text-white" />
          </button>
        )}
        <span className="text-[10px] font-bold text-emerald-700 mt-1">
          {sessionUser?.activeRole === "buyer" ? "Permintaan" : "Foto Sampah"}
        </span>
      </div>

      {/* 4. Tab Pesan */}
      <Link
        href="/chat"
        className={cn(
          "flex flex-col items-center justify-center space-y-1 text-[10px] font-medium transition-colors flex-1 py-1",
          pathname.startsWith("/chat")
            ? "text-emerald-600 font-bold"
            : "text-slate-500 hover:text-slate-800",
        )}
      >
        <div className="relative">
          <MessageSquare className="w-5 h-5" />
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
        </div>
        <span>Pesan</span>
      </Link>

      {/* 5. Tab Profil */}
      <Link
        href="/profile"
        className={cn(
          "flex flex-col items-center justify-center space-y-1 text-[10px] font-medium transition-colors flex-1 py-1",
          pathname.startsWith("/profile")
            ? "text-emerald-600 font-bold"
            : "text-slate-500 hover:text-slate-800",
        )}
      >
        <User className="w-5 h-5" />
        <span>Profil</span>
      </Link>
    </nav>
  );
}
