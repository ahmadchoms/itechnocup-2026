"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Leaf, X, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AdminNavItem, AdminSessionUser } from "./types";

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  navItems: AdminNavItem[];
  sessionUser: AdminSessionUser;
}

export function AdminSidebar({
  isOpen,
  onClose,
  navItems,
  sessionUser,
}: AdminSidebarProps) {
  const pathname = usePathname();

  const initials = sessionUser?.fullName
    ? sessionUser.fullName
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .substring(0, 2)
        .toUpperCase()
    : "AD";

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          "fixed md:sticky top-0 left-0 h-screen w-64 bg-white border-r border-slate-200 z-50 transform transition-transform duration-200 ease-in-out md:translate-x-0 flex flex-col shrink-0 shadow-2xs",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="p-4 md:p-5 flex items-center justify-between border-b border-slate-100 bg-sage/20">
          <Link href="/admin" className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-slate-900 flex items-center justify-center shadow-xs">
              <Leaf className="w-4 h-4 text-emerald-primary" />
            </div>
            <div>
              <span className="font-extrabold text-base tracking-tight text-slate-900 block leading-tight">
                DaurNusa
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-primary">
                Admin Workspace
              </span>
            </div>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="md:hidden h-8 w-8 text-slate-500 hover:bg-slate-100 rounded-lg"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Menu Utama
          </div>
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group",
                  isActive
                    ? "bg-slate-900 text-white shadow-xs"
                    : "text-slate-600 hover:bg-sage/70 hover:text-slate-900"
                )}
              >
                <Icon
                  className={cn(
                    "w-4 h-4 transition-colors",
                    isActive ? "text-emerald-primary" : "text-slate-400 group-hover:text-slate-900"
                  )}
                />
                <span>{item.label}</span>
              </Link>
            );
          })}

          <div className="pt-4 px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Shortcut Cepat
          </div>
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-sage/70 hover:text-slate-900 transition-colors"
          >
            <span className="flex items-center gap-2.5">
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              <span>Lihat Web Publik</span>
            </span>
            <Badge variant="outline" className="text-[9px] px-1.5 py-0 h-4 border-slate-200 text-slate-400">
              Tab Baru
            </Badge>
          </Link>
        </nav>

        <div className="p-3 border-t border-slate-100 bg-sage/30">
          <div className="flex items-center gap-3 p-2 rounded-xl bg-white border border-slate-200 shadow-2xs">
            <Avatar className="h-8 w-8 border border-slate-200">
              <AvatarImage src={sessionUser?.avatarUrl || undefined} alt={sessionUser?.fullName} />
              <AvatarFallback className="bg-sage text-[11px] font-bold text-emerald-primary">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-slate-900 truncate leading-tight">
                {sessionUser?.fullName || "Admin"}
              </p>
              <p className="text-[10px] text-slate-400 truncate">
                {sessionUser?.email || "admin@daurnusa.id"}
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
