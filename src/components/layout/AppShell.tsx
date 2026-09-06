"use client";

import { useState, useEffect } from "react";
import { Camera, Plus } from "lucide-react";
import Link from "next/link";
import { Navbar } from "./Navbar";
import { BottomNav } from "./BottomNav";
import { AIScannerModal } from "./AIScannerModal";
import { getCategoriesAction } from "@/actions/category.actions";

interface AppShellProps {
  children: React.ReactNode;
  categories?: { id: string; name: string }[];
  sessionUser?: {
    id: string;
    fullName: string;
    email: string;
    isAdmin: boolean;
    activeRole: "seller" | "buyer";
    avatarUrl?: string | null;
  } | null;
}

const EMPTY_CATEGORIES: { id: string; name: string }[] = [];

export function AppShell({ children, categories = EMPTY_CATEGORIES, sessionUser: serverSessionUser }: AppShellProps) {
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [dbCategories, setDbCategories] = useState<{ id: string; name: string }[]>(categories);

  useEffect(() => {
    if (categories.length === 0) {
      getCategoriesAction().then((res) => {
        if (res.success && res.categories) {
          setDbCategories(res.categories);
        }
      });
    }
  }, [categories]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans antialiased relative">
      {/* Top Clean Consumer Navbar */}
      <Navbar onOpenScanner={() => setIsScannerOpen(true)} initialSessionUser={serverSessionUser} />

      {/* Main Page Viewport */}
      <main className="flex-1 px-4 sm:px-6 md:px-8 py-6 max-w-7xl mx-auto w-full pb-24 md:pb-12">
        {children}
      </main>

      {/* Desktop Floating Action Button (FAB) Pojok Kanan Bawah */}
      <div className="hidden md:block fixed bottom-8 right-8 z-40">
        {serverSessionUser?.activeRole === "buyer" ? (
          <Link
            href="/requests/create"
            className="flex items-center gap-2.5 px-5 py-3 rounded-full bg-[#171717] hover:bg-[#2B2B26] text-white font-semibold text-xs shadow-md hover:shadow-lg transition-all cursor-pointer border border-black/10 hover:-translate-y-0.5"
          >
            <Plus className="w-4 h-4 text-[#86EFAC]" />
            <span>Buat Permintaan</span>
          </Link>
        ) : (
          <button
            onClick={() => setIsScannerOpen(true)}
            type="button"
            aria-label="Pindai & Jual Sampah"
            className="flex items-center gap-2.5 px-5 py-3 rounded-full bg-[#171717] hover:bg-[#2B2B26] text-white font-semibold text-xs shadow-md hover:shadow-lg transition-all cursor-pointer border border-black/10 hover:-translate-y-0.5"
          >
            <Camera className="w-4 h-4 text-[#86EFAC]" />
            <span>Foto &amp; Jual Sampah</span>
          </button>
        )}
      </div>

      {/* Mobile Bottom Navigation (<768px sticky 64px) */}
      <BottomNav onOpenScanner={() => setIsScannerOpen(true)} initialSessionUser={serverSessionUser} />

      {/* AI Computer Vision Scanner Modal */}
      <AIScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        categories={dbCategories}
      />
    </div>
  );
}
