"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Recycle, Camera, MessageSquare, Menu, X, LogIn } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavbarProps {
  onOpenScanner: () => void;
}

export function Navbar({ onOpenScanner }: NavbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [sessionUser, setSessionUser] = useState<{
    id: string; fullName: string; email: string; isAdmin: boolean; avatarUrl?: string | null;
  } | null>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => { if (d.user) setSessionUser(d.user); })
      .catch(() => {});
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setSessionUser(null);
    router.push("/login");
    router.refresh();
  };

  const initials = sessionUser
    ? sessionUser.fullName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : "";

  const navLinks = [
    { href: "/listings", label: "Pasar Sampah" },
    { href: "/requests", label: "Permintaan Sampah" },
    { href: "/matches", label: "Pencocokan" },
    { href: "/about", label: "Tentang Kami" },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center space-x-2.5 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-sm">
            <Recycle className="w-5 h-5" />
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

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center space-x-1">
          {navLinks.map((link) => {
            const isActive =
              pathname === link.href ||
              (link.href !== "/" && pathname.startsWith(link.href));

            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors",
                  isActive
                    ? "bg-slate-100 text-emerald-700 font-bold"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Action Bar */}
        <div className="flex items-center space-x-3">
          {/* Chat Icon Link */}
          <Link
            href="/chat"
            className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors relative"
            title="Pesan & Negosiasi"
          >
            <MessageSquare className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-600" />
          </Link>

          {/* AI Scan Primary Button */}
          <button
            onClick={onOpenScanner}
            type="button"
            className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs font-semibold shadow-sm transition-colors cursor-pointer"
          >
            <Camera className="w-4 h-4" />
            <span className="hidden sm:inline">Jual Sampah (AI)</span>
          </button>

          {/* Profile Link / Auth */}
          {sessionUser ? (
            <div className="relative group">
              <Link
                href="/profile"
                className="w-8 h-8 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center border border-emerald-700 hover:border-emerald-400 transition-colors shrink-0"
                title={sessionUser.fullName}
              >
                {sessionUser.avatarUrl ? (
                  <img src={sessionUser.avatarUrl} alt={sessionUser.fullName} className="w-full h-full object-cover rounded-full" />
                ) : (
                  initials
                )}
              </Link>
            </div>
          ) : (
            <Link
              href="/login"
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Masuk</span>
            </Link>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 py-3 space-y-1 animate-in slide-in-from-top-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100"
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-2 border-t border-slate-100 space-y-1">
            {sessionUser?.isAdmin && (
              <Link
                href="/admin"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:bg-slate-100"
              >
                Panel Admin
              </Link>
            )}
            {sessionUser ? (
              <button
                onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }}
                className="w-full text-left block px-3 py-2 rounded-xl text-xs font-semibold text-red-500 hover:bg-red-50"
              >
                Keluar
              </button>
            ) : (
              <Link
                href="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-xl text-xs font-semibold text-emerald-700 hover:bg-emerald-50"
              >
                Masuk / Daftar
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
