"use client";

import { useState, useEffect } from "react";
import { Search, Sparkles, Camera, ChevronDown, UserCheck, LogIn, LogOut, Store } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface HeaderProps {
  onOpenScanner: () => void;
}

export function Header({ onOpenScanner }: HeaderProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [sessionUser, setSessionUser] = useState<{
    id: string; fullName: string; email: string; isAdmin: boolean; avatarUrl?: string | null;
  } | null>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.user) setSessionUser(data.user);
      })
      .catch(() => {});
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/listings?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setSessionUser(null);
    setIsUserMenuOpen(false);
    router.push("/login");
    router.refresh();
  };

  const initials = sessionUser
    ? sessionUser.fullName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : "?";

  return (
    <header className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-slate-200 h-16 px-4 md:px-8 flex items-center justify-between shadow-xs">
      {/* Search Input Bar */}
      <form onSubmit={handleSearchSubmit} className="flex-1 max-w-md relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Cari ampas kopi, kardus, plastik, minyak jelantah..."
          className="w-full pl-10 pr-4 py-2 text-sm bg-slate-100/80 hover:bg-slate-100 focus:bg-white border border-transparent focus:border-emerald-500 rounded-xl focus:outline-none transition-all placeholder:text-slate-400"
        />
      </form>

      {/* Header Actions */}
      <div className="flex items-center space-x-3 ml-4">
        {/* Quick Scan AI Button */}
        <button
          onClick={onOpenScanner}
          type="button"
          className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-semibold border border-emerald-200/60 transition-colors"
        >
          <Camera className="w-3.5 h-3.5 text-emerald-600" />
          <span>AI Scan</span>
          <Sparkles className="w-3 h-3 text-amber-500 animate-pulse" />
        </button>

        {/* User Menu */}
        <div className="relative">
          {sessionUser ? (
            <>
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                type="button"
                className="flex items-center space-x-2 p-1.5 rounded-xl hover:bg-slate-100 border border-slate-200/80 transition-colors text-left"
              >
                {sessionUser.avatarUrl ? (
                  <img src={sessionUser.avatarUrl} alt={sessionUser.fullName} className="w-7 h-7 rounded-lg object-cover" />
                ) : (
                  <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white font-bold text-xs flex items-center justify-center">
                    {initials}
                  </div>
                )}
                <div className="hidden lg:block text-xs">
                  <span className="font-semibold text-slate-800 block leading-tight">{sessionUser.fullName}</span>
                  <span className="text-[10px] text-emerald-600 font-medium">
                    {sessionUser.isAdmin ? "Admin" : "Seller & Buyer"}
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="px-3 py-2 border-b border-slate-100">
                    <span className="text-xs font-semibold text-slate-800 block">{sessionUser.fullName}</span>
                    <span className="text-[10px] text-slate-500">{sessionUser.email}</span>
                  </div>
                  <Link
                    href="/profile/my-listings"
                    onClick={() => setIsUserMenuOpen(false)}
                    className="w-full text-left px-3 py-2 hover:bg-slate-50 flex items-center space-x-2 text-xs transition-colors"
                  >
                    <Store className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-slate-700">Listing Saya</span>
                  </Link>
                  {sessionUser.isAdmin && (
                    <Link
                      href="/admin"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="w-full text-left px-3 py-2 hover:bg-slate-50 flex items-center space-x-2 text-xs transition-colors"
                    >
                      <UserCheck className="w-3.5 h-3.5 text-purple-600" />
                      <span className="text-slate-700">Panel Admin</span>
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-3 py-2 hover:bg-red-50 flex items-center space-x-2 text-xs transition-colors border-t border-slate-100 mt-1"
                  >
                    <LogOut className="w-3.5 h-3.5 text-red-500" />
                    <span className="text-red-600 font-medium">Keluar</span>
                  </button>
                </div>
              )}
            </>
          ) : (
            <Link
              href="/login"
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Masuk</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
