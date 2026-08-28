"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  Leaf,
  LayoutDashboard,
  Users,
  FileText,
  CheckSquare,
  Menu,
  Search,
  Package,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { AdminSessionUser, AdminNavItem } from "@/types";
import { AdminSidebar } from "./AdminSidebar";
import { AdminTopbar } from "./AdminTopbar";
import { AdminCommandDialog } from "./AdminCommandDialog";
import { AdminLogoutModal } from "./AdminLogoutModal";

interface AdminLayoutClientProps {
  children: React.ReactNode;
  sessionUser: AdminSessionUser;
}

const NAV_ITEMS: AdminNavItem[] = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/buyer-applications", label: "Pengajuan Pengepul", icon: CheckSquare },
  { href: "/admin/listings", label: "Listing Sampah", icon: FileText },
  { href: "/admin/requests", label: "Permintaan Sampah", icon: Package },
  { href: "/admin/users", label: "Pengguna", icon: Users },
];

export function AdminLayoutClient({ children, sessionUser }: AdminLayoutClientProps) {
  const pathname = usePathname();
  const router = useRouter();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isCommandOpen, setIsCommandOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsCommandOpen((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const res = await fetch("/api/auth/logout", { method: "POST" });
      if (res.ok) {
        router.push("/");
        router.refresh();
      } else {
        alert("Gagal logout.");
        setIsLoggingOut(false);
      }
    } catch {
      alert("Terjadi kesalahan.");
      setIsLoggingOut(false);
    }
  };

  const currentPage = NAV_ITEMS.find((item) => item.href === pathname) || {
    label: "Admin Panel",
    icon: LayoutDashboard,
  };

  return (
    <div className="min-h-screen bg-sage/30 flex flex-col md:flex-row font-sans text-slate-900">
      <div className="md:hidden flex items-center justify-between p-3.5 bg-white border-b border-sage sticky top-0 z-30 shadow-2xs">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-xl bg-slate-900 flex items-center justify-center shadow-xs">
            <Leaf className="w-4 h-4 text-emerald-primary" />
          </div>
          <span className="font-extrabold text-base tracking-tight text-slate-900">
            DaurNusa <span className="text-emerald-primary">Admin</span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsCommandOpen(true)}
            className="h-8 w-8 rounded-full border-slate-200 bg-sage/50 text-slate-800"
            title="Cari Cepat"
          >
            <Search className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSidebarOpen(true)}
            className="h-8 w-8 rounded-lg text-slate-800"
          >
            <Menu className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <AdminSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        navItems={NAV_ITEMS}
        sessionUser={sessionUser}
      />

      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <AdminTopbar
          currentPage={currentPage}
          sessionUser={sessionUser}
          onOpenSearch={() => setIsCommandOpen(true)}
          onOpenLogoutModal={() => setIsLogoutModalOpen(true)}
        />

        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto bg-sage/10">
          {children}
        </main>
      </div>

      <AdminCommandDialog
        isOpen={isCommandOpen}
        onOpenChange={setIsCommandOpen}
      />

      <AdminLogoutModal
        isOpen={isLogoutModalOpen}
        onOpenChange={setIsLogoutModalOpen}
        onConfirm={handleLogout}
        isLoading={isLoggingOut}
      />
    </div>
  );
}
