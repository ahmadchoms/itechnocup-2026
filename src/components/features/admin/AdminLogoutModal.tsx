"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

interface AdminLogoutModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isLoading: boolean;
}

export function AdminLogoutModal({
  isOpen,
  onOpenChange,
  onConfirm,
  isLoading,
}: AdminLogoutModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm p-6 rounded-3xl bg-white border border-slate-200 shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-base font-bold text-slate-900">
            Konfirmasi Logout
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500 mt-1">
            Apakah Anda yakin ingin keluar dari sesi Admin DaurNusa?
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="mt-4 flex flex-row gap-2 justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
            className="h-9 px-4 rounded-full text-xs font-semibold"
          >
            Batal
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={onConfirm}
            disabled={isLoading}
            className="h-9 px-5 rounded-full text-xs font-bold gap-1.5"
          >
            {isLoading ? "Keluar..." : "Ya, Logout"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
