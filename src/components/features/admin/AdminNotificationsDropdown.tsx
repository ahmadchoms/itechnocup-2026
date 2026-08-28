"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Bell, CheckCheck, AlertCircle, Package, Truck } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { AdminNotification } from "./types";

const INITIAL_NOTIFICATIONS: AdminNotification[] = [
  {
    id: "notif-1",
    title: "Pengajuan Pengepul Baru",
    description: "CV Barokah Abadi mengajukan verifikasi izin gudang & SIUP pengepul.",
    time: "5 menit lalu",
    unread: true,
    type: "buyer",
    href: "/admin/buyer-applications",
  },
  {
    id: "notif-2",
    title: "Listing Sampah Baru",
    description: "Budi Santoso mengunggah Kardus Bekas 25kg di Semarang Barat.",
    time: "18 menit lalu",
    unread: true,
    type: "listing",
    href: "/admin/listings",
  },
  {
    id: "notif-3",
    title: "Transaksi COD Selesai",
    description: "Transaksi pasokan Ampas Kopi senilai Rp 50.000 telah selesai.",
    time: "1 jam lalu",
    unread: false,
    type: "transaction",
    href: "/admin/requests",
  },
];

export function AdminNotificationsDropdown() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<AdminNotification[]>(INITIAL_NOTIFICATIONS);

  const unreadCount = notifications.filter((n) => n.unread).length;

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="relative inline-flex items-center justify-center h-9 w-9 rounded-full border border-slate-200 bg-sage/40 hover:bg-sage text-slate-700 hover:text-slate-900 transition-colors cursor-pointer"
        aria-label="Pemberitahuan Sistem"
        title="Pemberitahuan Sistem"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white" />
        )}
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-84 p-2 rounded-2xl bg-white border border-slate-200 shadow-xl">
        <DropdownMenuGroup>
          <div className="flex items-center justify-between px-3 py-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-900">Pemberitahuan Admin</span>
              {unreadCount > 0 && (
                <Badge variant="secondary" className="text-[9.5px] px-1.5 bg-sage text-emerald-primary font-bold">
                  {unreadCount} Baru
                </Badge>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllAsRead}
                className="text-[10px] font-semibold text-emerald-primary hover:underline flex items-center gap-1 cursor-pointer"
              >
                <CheckCheck className="w-3 h-3" />
                <span>Tandai dibaca</span>
              </button>
            )}
          </div>
        </DropdownMenuGroup>

        <div className="space-y-1 py-1 max-h-72 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="py-6 text-center text-xs text-slate-400">
              Tidak ada notifikasi baru
            </div>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => router.push(notif.href)}
                className={cn(
                  "p-2.5 rounded-xl transition-colors cursor-pointer text-xs space-y-1 block border",
                  notif.unread
                    ? "bg-sage/40 hover:bg-sage border-slate-200/80"
                    : "bg-white hover:bg-slate-50 border-transparent"
                )}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    {notif.type === "buyer" && <AlertCircle className="w-3.5 h-3.5 text-amber-500" />}
                    {notif.type === "listing" && <Package className="w-3.5 h-3.5 text-emerald-primary" />}
                    {notif.type === "transaction" && <Truck className="w-3.5 h-3.5 text-blue-500" />}
                    <span className="font-bold text-slate-900">{notif.title}</span>
                  </div>
                  <span className="text-[9.5px] font-mono text-slate-400">{notif.time}</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed pl-5">
                  {notif.description}
                </p>
              </div>
            ))
          )}
        </div>

        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem
            onClick={() => router.push("/admin/buyer-applications")}
            className="w-full text-center justify-center text-[11px] font-bold text-slate-700 hover:text-slate-900 cursor-pointer py-1.5"
          >
            Buka Antrean Pengajuan Pengepul
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
