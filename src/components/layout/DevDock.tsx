"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Wrench, ChevronUp, ChevronDown, Store, Compass, MessageSquare, User, ShieldCheck, FilePlus } from "lucide-react";
import { cn } from "@/lib/utils";

export function DevDock() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const routes = [
    { href: "/listings", label: "Marketplace Feed", icon: Store },
    { href: "/matches", label: "Pencocokan Lokasi", icon: Compass },
    { href: "/requests/create", label: "Buat Request", icon: FilePlus },
    { href: "/chat", label: "Chat & Negosiasi", icon: MessageSquare },
    { href: "/profile", label: "Profil & Analytics", icon: User },
    { href: "/admin", label: "Panel Admin", icon: ShieldCheck },
  ];

  return (
    <div className="fixed bottom-20 md:bottom-6 right-6 z-50 flex flex-col items-end">
      {isOpen && (
        <div className="mb-2 p-2 bg-slate-900/95 border border-slate-800 text-white rounded-2xl shadow-2xl backdrop-blur-md space-y-1 w-56 animate-in fade-in slide-in-from-bottom-2">
          <div className="px-3 py-1.5 border-b border-slate-800 text-[10px] font-bold uppercase tracking-wider text-emerald-400 flex items-center justify-between">
            <span>Dev Nav Dock</span>
            <span className="bg-emerald-950 text-emerald-300 px-1.5 py-0.5 rounded text-[9px]">No Auth</span>
          </div>

          {routes.map((r) => {
            const Icon = r.icon;
            const isActive = pathname === r.href || (r.href !== "/listings" && pathname.startsWith(r.href));

            return (
              <Link
                key={r.href}
                href={r.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors",
                  isActive
                    ? "bg-emerald-600 text-white font-bold"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                )}
              >
                <Icon className="w-4 h-4 text-emerald-400" />
                <span>{r.label}</span>
              </Link>
            );
          })}
        </div>
      )}

      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-3.5 py-2 rounded-full bg-slate-900 border border-slate-700 hover:border-emerald-500 text-white text-xs font-semibold shadow-xl flex items-center space-x-2 backdrop-blur-md transition-all transform active:scale-95 cursor-pointer"
      >
        <Wrench className="w-3.5 h-3.5 text-emerald-400" />
        <span>Menu Dev</span>
        {isOpen ? <ChevronDown className="w-3.5 h-3.5 text-slate-400" /> : <ChevronUp className="w-3.5 h-3.5 text-slate-400" />}
      </button>
    </div>
  );
}
