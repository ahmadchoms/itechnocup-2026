"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Leaf, LogOut, LayoutDashboard, Users, FileText, CheckSquare, Trash2, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface AdminLayoutClientProps {
  children: React.ReactNode;
  sessionUser: any;
}

export function AdminLayoutClient({ children, sessionUser }: AdminLayoutClientProps) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
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

  const navItems = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/buyer-applications", label: "Pengajuan Pengepul", icon: CheckSquare },
    { href: "/admin/listings", label: "Listing Sampah", icon: FileText },
    { href: "/admin/requests", label: "Permintaan Sampah", icon: FileText },
    { href: "/admin/users", label: "Pengguna", icon: Users },
  ];

  const initials = sessionUser?.fullName
    ? sessionUser.fullName
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .substring(0, 2)
        .toUpperCase()
    : "?";

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Mobile Header (Shows only on small screens) */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center">
            <Leaf className="w-5 h-5 text-white" />
          </div>
          <span className="font-extrabold text-xl tracking-tight text-slate-900">
            DaurNusa <span className="text-emerald-600">Admin</span>
          </span>
        </div>
        <button onClick={() => setIsSidebarOpen(true)} className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg">
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Sidebar Overlay for Mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed md:sticky top-0 left-0 h-screen w-64 bg-white border-r border-slate-200 z-50 transform transition-transform duration-200 ease-in-out md:translate-x-0 flex flex-col",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-4 md:p-6 flex items-center justify-between">
          <Link href="/admin" className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center shadow-md">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <span className="font-extrabold text-xl tracking-tight text-slate-900">
              DaurNusa <span className="text-emerald-600">Admin</span>
            </span>
          </Link>
          <button onClick={() => setIsSidebarOpen(false)} className="md:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-1 mt-4 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsSidebarOpen(false)}
                className={cn(
                  "flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors",
                  isActive
                    ? "bg-emerald-50 text-emerald-700"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                <item.icon className={cn("w-5 h-5", isActive ? "text-emerald-600" : "text-slate-400")} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Desktop Topbar */}
        <header className="hidden md:flex h-16 bg-white border-b border-slate-200 items-center justify-end px-6 shrink-0 z-30">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-10 h-10 rounded-full bg-emerald-600 text-white font-bold text-sm flex items-center justify-center border border-emerald-700 hover:border-emerald-400 transition-colors shrink-0 overflow-hidden cursor-pointer shadow-sm"
                title={sessionUser?.fullName}
              >
                {sessionUser?.avatarUrl ? (
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
                  <button
                    onClick={() => {
                      setIsDropdownOpen(false);
                      setIsLogoutModalOpen(true);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              )}
              
              {isDropdownOpen && (
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setIsDropdownOpen(false)}
                />
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          {children}
        </main>
      </div>

      {/* Logout Confirmation Modal */}
      {isLogoutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl animate-in fade-in zoom-in duration-200">
            <h3 className="text-lg font-bold text-slate-900 mb-2">Konfirmasi Logout</h3>
            <p className="text-sm text-slate-500 mb-6">
              Apakah Anda yakin ingin keluar dari sesi Admin DaurNusa?
            </p>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setIsLogoutModalOpen(false)}
                disabled={isLoggingOut}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold transition-colors disabled:opacity-50 cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-semibold transition-colors disabled:opacity-50 cursor-pointer"
              >
                {isLoggingOut ? "Keluar..." : "Ya, Logout"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
