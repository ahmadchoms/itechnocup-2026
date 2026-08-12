"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Store, Compass, MessageSquare, User, Camera, PlusCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface BottomNavProps {
  onOpenScanner: () => void;
}

export function BottomNav({ onOpenScanner }: BottomNavProps) {
  const pathname = usePathname();

  const navItems = [
    { href: "/listings", label: "Beranda", icon: Store },
    { href: "/matches", label: "Pencocokan", icon: Compass },
    { href: "/chat", label: "Pesan", icon: MessageSquare },
    { href: "/profile", label: "Profil", icon: User },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 h-16 px-4 flex items-center justify-around shadow-lg">
      {/* Tab 1: Beranda */}
      <Link
        href="/listings"
        className={cn(
          "flex flex-col items-center justify-center space-y-1 text-xs font-medium transition-colors",
          pathname === "/listings" || pathname === "/"
            ? "text-emerald-600"
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
          "flex flex-col items-center justify-center space-y-1 text-xs font-medium transition-colors",
          pathname === "/matches"
            ? "text-emerald-600"
            : "text-slate-500 hover:text-slate-800"
        )}
      >
        <Compass className="w-5 h-5" />
        <span>Pencocokan</span>
      </Link>

      {/* Floating Action Button (FAB) AI Camera */}
      <div className="-mt-6 flex flex-col items-center">
        <button
          onClick={onOpenScanner}
          type="button"
          aria-label="Scan AI Sampah"
          className="w-14 h-14 rounded-full bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white shadow-md flex items-center justify-center transition-colors cursor-pointer"
        >
          <Camera className="w-6 h-6" />
        </button>
        <span className="text-[10px] font-semibold text-emerald-700 mt-1">Scan AI</span>
      </div>

      {/* Tab 3: Pesan */}
      <Link
        href="/chat"
        className={cn(
          "flex flex-col items-center justify-center space-y-1 text-xs font-medium transition-colors",
          pathname.startsWith("/chat")
            ? "text-emerald-600"
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
          "flex flex-col items-center justify-center space-y-1 text-xs font-medium transition-colors",
          pathname.startsWith("/profile")
            ? "text-emerald-600"
            : "text-slate-500 hover:text-slate-800"
        )}
      >
        <User className="w-5 h-5" />
        <span>Profil</span>
      </Link>
    </div>
  );
}
