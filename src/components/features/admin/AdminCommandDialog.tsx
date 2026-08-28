"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  X,
  ArrowRight,
  LayoutDashboard,
  CheckSquare,
  FileText,
  Package,
  Users,
  Sparkles,
  User,
  MessageSquare,
  ExternalLink,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { CommandItem } from "./types";

interface AdminCommandDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const COMMAND_ITEMS: CommandItem[] = [
  {
    id: "nav-dashboard",
    title: "Dashboard Overview",
    category: "Navigasi",
    href: "/admin",
    icon: LayoutDashboard,
    description: "Statistik metrik dan ringkasan platform",
  },
  {
    id: "nav-buyers",
    title: "Pengajuan Pengepul",
    category: "Navigasi",
    href: "/admin/buyer-applications",
    icon: CheckSquare,
    description: "Verifikasi dokumen KTP & izin gudang pengepul",
    badge: "Verifikasi",
  },
  {
    id: "nav-listings",
    title: "Katalog Listing Sampah",
    category: "Navigasi",
    href: "/admin/listings",
    icon: FileText,
    description: "Kelola seluruh limbah aktif dan terverifikasi",
  },
  {
    id: "nav-requests",
    title: "Katalog Permintaan Sampah",
    category: "Navigasi",
    href: "/admin/requests",
    icon: Package,
    description: "Kebutuhan pasokan material dari para pembeli",
  },
  {
    id: "nav-users",
    title: "Manajemen Pengguna",
    category: "Navigasi",
    href: "/admin/users",
    icon: Users,
    description: "Daftar penjual, pengepul, dan administrator",
  },
  {
    id: "action-add-listing",
    title: "Tambah Listing Sampah Baru",
    category: "Aksi Cepat",
    href: "/listings/create",
    icon: Sparkles,
    description: "Unggah dan klasifikasikan foto limbah via AI",
  },
  {
    id: "action-add-request",
    title: "Buat Permintaan Pasokan",
    category: "Aksi Cepat",
    href: "/requests/create",
    icon: Package,
    description: "Buka kebutuhan pengumpulan sampah baru",
  },
  {
    id: "action-profile",
    title: "Profil & Akun Saya",
    category: "Aksi Cepat",
    href: "/profile",
    icon: User,
    description: "Pengaturan akun dan beralih role",
  },
  {
    id: "action-chat",
    title: "Hub Pesan & Negosiasi",
    category: "Aksi Cepat",
    href: "/chat",
    icon: MessageSquare,
    description: "Pantau komunikasi transaksi COD",
  },
  {
    id: "action-public-home",
    title: "Buka Beranda Marketplace",
    category: "Aksi Cepat",
    href: "/",
    icon: ExternalLink,
    description: "Lihat tampilan publik DaurNusa",
  },
];

export function AdminCommandDialog({ isOpen, onOpenChange }: AdminCommandDialogProps) {
  const router = useRouter();
  const [rawSearchQuery, setRawSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(rawSearchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [rawSearchQuery]);

  const isSearching = rawSearchQuery !== debouncedSearchQuery;

  const filteredItems = useMemo(() => {
    const q = debouncedSearchQuery.toLowerCase().trim();
    if (!q) return COMMAND_ITEMS;

    return COMMAND_ITEMS.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.description?.toLowerCase().includes(q)
    );
  }, [debouncedSearchQuery]);

  const handleSelect = (href: string) => {
    onOpenChange(false);
    setRawSearchQuery("");
    router.push(href);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg p-0 rounded-3xl overflow-hidden bg-white border border-slate-200 shadow-2xl gap-0">
        <div className="flex items-center px-4 py-3.5 border-b border-slate-200 bg-sage/30">
          <Search className="w-4 h-4 text-slate-400 mr-3 shrink-0" />
          <input
            type="text"
            value={rawSearchQuery}
            onChange={(e) => setRawSearchQuery(e.target.value)}
            placeholder="Ketik untuk mencari menu, halaman, atau aksi..."
            className="w-full bg-transparent text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none font-medium"
            autoFocus
          />
          {isSearching ? (
            <div className="w-4 h-4 border-2 border-slate-300 border-t-slate-900 rounded-full animate-spin shrink-0" />
          ) : rawSearchQuery ? (
            <button
              type="button"
              onClick={() => setRawSearchQuery("")}
              className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          ) : (
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 rounded bg-white border border-slate-200 text-[10px] font-mono text-slate-400">
              ESC
            </kbd>
          )}
        </div>

        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          {filteredItems.length === 0 ? (
            <div className="p-8 text-center space-y-2">
              <div className="w-10 h-10 rounded-2xl bg-sage/50 flex items-center justify-center mx-auto text-slate-400">
                <Search className="w-5 h-5" />
              </div>
              <p className="text-xs font-bold text-slate-900">Hasil pencarian tidak ditemukan</p>
              <p className="text-[11px] text-slate-400">
                Tidak ada menu yang sesuai dengan kata kunci &quot;{debouncedSearchQuery}&quot;.
              </p>
            </div>
          ) : (
            filteredItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSelect(item.href)}
                  className="w-full flex items-center justify-between p-2.5 rounded-2xl hover:bg-sage/50 transition-all text-left cursor-pointer group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-600 group-hover:text-slate-900 group-hover:border-slate-300 shadow-2xs shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-900 group-hover:text-black truncate">
                        {item.title}
                      </p>
                      {item.description && (
                        <p className="text-[10.5px] text-slate-400 truncate">
                          {item.description}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {item.badge && (
                      <Badge variant="secondary" className="text-[9px] px-1.5 py-0 bg-sage text-emerald-primary font-bold">
                        {item.badge}
                      </Badge>
                    )}
                    <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-slate-900 group-hover:translate-x-0.5 transition-all" />
                  </div>
                </button>
              );
            })
          )}
        </div>

        <div className="p-3 border-t border-slate-100 bg-sage/20 flex items-center justify-between text-[11px] text-slate-400">
          <span>Gunakan tombol panah atau klik untuk memilih</span>
          <span className="font-mono text-[10px]">DaurNusa Quick Command</span>
        </div>
      </DialogContent>
    </Dialog>
  );
}
