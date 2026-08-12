"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Recycle,
  Store,
  Compass,
  MessageSquare,
  User,
  ShieldCheck,
  Camera,
  PlusCircle,
  BarChart3,
  FilePlus,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  onOpenScanner: () => void;
}

export function Sidebar({ onOpenScanner }: SidebarProps) {
  const pathname = usePathname();

  const navLinks = [
    { href: "/listings", label: "Marketplace Feed", icon: Store },
    { href: "/matches", label: "Pencocokan Lokasi", icon: Compass },
    { href: "/requests/create", label: "Posting Permintaan", icon: FilePlus },
    { href: "/chat", label: "Pesan & Negosiasi", icon: MessageSquare },
    { href: "/profile", label: "Profil & Analytics", icon: User },
    { href: "/admin", label: "Panel Admin", icon: ShieldCheck },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 border-r border-slate-200 bg-white min-h-screen sticky top-0 h-screen z-30 shrink-0">
      {/* Brand Logo Header */}
      <div className="h-16 px-6 border-b border-slate-100 flex items-center justify-between">
        <Link href="/listings" className="flex items-center space-x-2.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-700 to-emerald-500 flex items-center justify-center text-white shadow-md shadow-emerald-600/20">
            <Recycle className="w-6 h-6 animate-spin-slow" />
          </div>
          <div>
            <span className="font-bold text-lg text-slate-900 tracking-tight block leading-none">
              Daur<span className="text-emerald-600">Nusa</span>
            </span>
            <span className="text-[10px] font-medium text-slate-400 block mt-0.5">
              Marketplace Sampah Sirkular
            </span>
          </div>
        </Link>
      </div>

      {/* Main Navigation Links */}
      <div className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        <div className="px-3 mb-2 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
          Menu Utama
        </div>

        {navLinks.map((link) => {
          const Icon = link.icon;
          const isActive =
            pathname === link.href ||
            (link.href !== "/listings" && pathname.startsWith(link.href));

          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150",
                isActive
                  ? "bg-emerald-50 text-emerald-700 font-semibold shadow-xs"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              <Icon
                className={cn(
                  "w-5 h-5 transition-colors",
                  isActive ? "text-emerald-600" : "text-slate-400"
                )}
              />
              <span>{link.label}</span>
            </Link>
          );
        })}
      </div>

      {/* Primary Action Button (Scan & Jual Sampah) */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/50 space-y-3">
        <button
          onClick={onOpenScanner}
          type="button"
          className="w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-semibold text-sm shadow-md shadow-emerald-600/20 transition-all transform active:scale-98 cursor-pointer"
        >
          <Camera className="w-4 h-4" />
          <span>Jual Sampah (AI)</span>
          <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
        </button>

        <Link
          href="/requests/create"
          className="w-full flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-medium text-xs transition-colors"
        >
          <PlusCircle className="w-4 h-4 text-emerald-600" />
          <span>Cari/Minta Sampah</span>
        </Link>
      </div>

      {/* Footer Info */}
      <div className="px-6 py-3 border-t border-slate-100 text-[11px] text-slate-400 flex items-center justify-between">
        <span>ITechnoCup 2026</span>
        <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] font-semibold bg-emerald-100 text-emerald-800">
          SDGs 7,8,9,11
        </span>
      </div>
    </aside>
  );
}
