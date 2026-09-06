"use client";

import { useRouter } from "next/navigation";
import { Search, User, MessageSquare, ExternalLink, LogOut, LucideIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { AdminNotificationsDropdown } from "./AdminNotificationsDropdown";
import { AdminSessionUser } from "@/types";

interface AdminTopbarProps {
  currentPage: {
    label: string;
    icon: LucideIcon;
  };
  sessionUser: AdminSessionUser;
  onOpenSearch: () => void;
  onOpenLogoutModal: () => void;
}

export function AdminTopbar({
  currentPage,
  sessionUser,
  onOpenSearch,
  onOpenLogoutModal,
}: AdminTopbarProps) {
  const router = useRouter();
  const CurrentIcon = currentPage.icon;

  const initials = sessionUser?.fullName
    ? sessionUser.fullName
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .substring(0, 2)
        .toUpperCase()
    : "AD";

  return (
    <header className="hidden md:flex h-16 bg-white border-b border-slate-200 items-center justify-between px-6 shrink-0 z-30 shadow-2xs">
      <div className="flex items-center gap-2.5">
        <CurrentIcon className="w-4 h-4 text-emerald-primary" />
        <span className="text-xs font-medium text-slate-400">Admin</span>
        <span className="text-xs font-semibold text-slate-300">/</span>
        <span className="text-xs font-bold text-slate-900">
          {currentPage.label}
        </span>
      </div>

      <div className="flex-1 max-w-md mx-6">
        <button
          type="button"
          onClick={onOpenSearch}
          className="w-full flex items-center justify-between px-4 py-2 rounded-full bg-sage/50 hover:bg-sage/80 border border-slate-200 text-xs text-slate-500 hover:text-slate-800 transition-all cursor-pointer shadow-2xs group"
        >
          <div className="flex items-center gap-2.5">
            <Search className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-800 transition-colors" />
            <span className="text-[11.5px] font-medium">Cari menu, data, atau aksi cepat...</span>
          </div>
          <kbd className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-white border border-slate-200 text-[10px] font-mono font-bold text-slate-500 shadow-2xs">
            <span className="text-[11px]">⌘</span>K
          </kbd>
        </button>
      </div>

      <div className="flex items-center gap-2.5">
        <AdminNotificationsDropdown />

        <DropdownMenu>
          <DropdownMenuTrigger
            className="flex items-center gap-2 p-1 pl-2.5 rounded-full border border-slate-200 bg-sage/40 hover:bg-sage transition-colors cursor-pointer shadow-2xs"
            aria-label="User menu"
          >
            <span className="text-xs font-bold text-slate-900 max-w-24 truncate">
              {sessionUser?.fullName?.split(" ")[0] || "Admin"}
            </span>
            <Avatar className="h-7 w-7 border border-slate-200">
              <AvatarImage src={sessionUser?.avatarUrl || undefined} alt={sessionUser?.fullName} />
              <AvatarFallback className="bg-slate-900 text-[10px] font-bold text-white">
                {initials}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-56 p-1.5 rounded-2xl bg-white border border-slate-200 shadow-xl">
            <DropdownMenuGroup>
              <DropdownMenuLabel className="px-3 py-2">
                <p className="text-xs font-bold text-slate-900 truncate">{sessionUser?.fullName}</p>
                <p className="text-[10px] font-normal text-slate-400 truncate">{sessionUser?.email}</p>
                <Badge variant="outline" className="mt-1 text-[9px] font-bold text-emerald-primary bg-sage border-emerald-primary/30">
                  Super Administrator
                </Badge>
              </DropdownMenuLabel>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            <DropdownMenuGroup>
              <DropdownMenuItem
                onClick={() => router.push("/profile")}
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium cursor-pointer"
              >
                <User className="w-3.5 h-3.5 text-slate-500" />
                <span>Profil Saya</span>
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => router.push("/chat")}
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium cursor-pointer"
              >
                <MessageSquare className="w-3.5 h-3.5 text-slate-500" />
                <span>Pesan &amp; Chat</span>
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => window.open("/", "_blank")}
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium cursor-pointer"
              >
                <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                <span>Lihat Website Utama</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            <DropdownMenuGroup>
              <DropdownMenuItem
                onClick={onOpenLogoutModal}
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 hover:text-red-700 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Keluar (Logout)</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
