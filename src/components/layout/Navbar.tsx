"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Recycle, Camera, MessageSquare, Search, LogIn, LogOut, Store } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavbarProps {
  onOpenScanner?: () => void;
  initialSessionUser?: {
    id: string;
    fullName: string;
    email: string;
    isAdmin: boolean;
    activeRole: "seller" | "buyer";
    avatarUrl?: string | null;
  } | null;
}

export function Navbar({ onOpenScanner, initialSessionUser = null }: NavbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [sessionUser, setSessionUser] = useState<{
    id: string;
    fullName: string;
    email: string;
    isAdmin: boolean;
    activeRole: "seller" | "buyer";
    avatarUrl?: string | null;
  } | null>(initialSessionUser);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => {
        if (d.user) setSessionUser(d.user);
      })
      .catch(() => {});
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // router.push(`/listings?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const initials = sessionUser
    ? sessionUser.fullName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "";

  const roleBase = sessionUser?.activeRole || "seller";

  const navLinks = [
    { href: "/requests", label: "Permintaan Sampah" },
    { href: "/about", label: "Tentang Kami" },
  ].filter(Boolean) as { href: string; label: string }[];

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const res = await fetch("/api/auth/logout", { method: "POST" });
      if (res.ok) {
        window.location.href = "/";
      } else {
        alert("Gagal logout.");
        setIsLoggingOut(false);
      }
    } catch {
      alert("Terjadi kesalahan.");
      setIsLoggingOut(false);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Brand Logo (Visible on both Mobile & Desktop) */}
          <Link href="/" className="flex items-center space-x-2.5 shrink-0">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white">
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

          {/* Global Search Bar (Desktop Only >= 768px) */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden md:flex flex-1 max-w-sm relative mx-2"
          >
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari jenis sampah/limbah..."
              className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl focus:bg-white focus:outline-none transition-colors"
            />
          </form>

          {/* Navigation Links (Desktop Only >= 768px) */}
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
                    "px-3 py-2 rounded-xl text-xs font-semibold transition-colors",
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

          {/* Right Actions Container */}
          <div className="flex items-center space-x-3">
            {/* Chat Icon Link (Desktop Only >= 768px) */}
            {sessionUser && (
              <Link
                href={`/${roleBase}/chat`}
                className="hidden md:flex p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors relative"
                title="Pesan & Negosiasi"
              >
                <MessageSquare className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-600" />
              </Link>
            )}

            {/* Primary Action Button: "Foto & Jual Sampah" (Desktop Only >= 768px) */}
            {sessionUser?.activeRole === "seller" && (
              <button
                onClick={onOpenScanner}
                type="button"
                className="hidden md:flex items-center space-x-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs font-semibold transition-colors cursor-pointer"
              >
                <Camera className="w-4 h-4" />
                <span>Foto &amp; Jual Sampah</span>
              </button>
            )}

            {/* Profile Dropdown */}
            {sessionUser ? (
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-9 h-9 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center border border-emerald-700 hover:border-emerald-400 transition-colors shrink-0 overflow-hidden cursor-pointer"
                  title={sessionUser.fullName}
                >
                  {sessionUser.avatarUrl ? (
                    <img
                      src={sessionUser.avatarUrl}
                      alt={sessionUser.fullName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    initials
                  )}
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-lg py-1 z-50">
                    <Link
                      href="/profile"
                      onClick={() => setIsDropdownOpen(false)}
                      className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                    >
                      Profil Saya
                    </Link>
                    <button
                      onClick={() => {
                        setIsDropdownOpen(false);
                        setIsLogoutModalOpen(true);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      Logout
                    </button>
                  </div>
                )}
                
                {/* Overlay to close dropdown when clicking outside */}
                {isDropdownOpen && (
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setIsDropdownOpen(false)}
                  />
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Masuk</span>
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Logout Confirmation Modal */}
      {isLogoutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl animate-in fade-in zoom-in duration-200">
            <h3 className="text-lg font-bold text-slate-900 mb-2">Konfirmasi Logout</h3>
            <p className="text-sm text-slate-600 mb-6">
              Apakah Anda yakin ingin keluar dari akun ini?
            </p>
            <div className="flex items-center justify-end space-x-3">
              <button
                onClick={() => setIsLogoutModalOpen(false)}
                disabled={isLoggingOut}
                className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer disabled:opacity-50"
              >
                Batal
              </button>
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="px-4 py-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-xl transition-colors flex items-center space-x-2 cursor-pointer disabled:opacity-50"
              >
                <LogOut className="w-4 h-4" />
                <span>{isLoggingOut ? "Keluar..." : "Ya, Logout"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
