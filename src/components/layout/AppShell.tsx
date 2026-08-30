"use client";

import { useState, useEffect } from "react";
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

export function AppShell({ children, categories = [], sessionUser: serverSessionUser }: AppShellProps) {
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
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans antialiased">
      {/* Top Clean Consumer Navbar */}
      <Navbar onOpenScanner={() => setIsScannerOpen(true)} initialSessionUser={serverSessionUser} />

      {/* Main Page Viewport */}
      <main className="flex-1 px-4 sm:px-6 md:px-8 py-6 max-w-7xl mx-auto w-full pb-20 md:pb-8">
        {children}
      </main>

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
