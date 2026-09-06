"use client";

import { useState } from "react";
import { Star, MessageSquareQuote, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { createReviewAction } from "@/actions/review.actions";
import { toast } from "@/components/ui/sonner";

interface CreateReviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transactionId: string;
  reviewerId: string;
  revieweeId: string;
  partnerName: string;
  onSuccess?: () => void;
}

export function CreateReviewDialog({
  open,
  onOpenChange,
  transactionId,
  reviewerId,
  revieweeId,
  partnerName,
  onSuccess,
}: CreateReviewDialogProps) {
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!transactionId || !reviewerId || !revieweeId) return;

    setIsSubmitting(true);
    try {
      const res = await createReviewAction({
        transactionId,
        reviewerId,
        revieweeId,
        rating,
        comment: comment.trim() || undefined,
      });

      if (res.success) {
        toast.success("Ulasan Berhasil Dikirim!", {
          description: `Terima kasih atas penilaian Anda untuk ${partnerName}.`,
        });
        onOpenChange(false);
        setComment("");
        onSuccess?.();
      } else {
        toast.error("Gagal Mengirim Ulasan", {
          description: res.error || "Terjadi kesalahan.",
        });
      }
    } catch {
      toast.error("Gagal Mengirim Ulasan", {
        description: "Koneksi terputus. Silakan coba lagi.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentDisplayRating = hoverRating !== null ? hoverRating : rating;

  const ratingLabels: Record<number, string> = {
    1: "Kurang Memuaskan 😞",
    2: "Cukup 😐",
    3: "Baik 🙂",
    4: "Sangat Baik 😊",
    5: "Luar Biasa & Terpercaya! 🌟",
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-[28px] sm:rounded-[32px] border-zinc-200/80 bg-white p-6 sm:p-7 shadow-2xl">
        <DialogHeader className="text-left space-y-1">
          <div className="flex items-center gap-2 text-amber-500 mb-1">
            <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#6B7B4F]">
              Ulasan Transaksi Selesai
            </span>
          </div>
          <DialogTitle className="font-display text-lg font-bold text-[#171717]">
            Beri Penilaian untuk {partnerName}
          </DialogTitle>
          <DialogDescription className="text-xs text-[#78766B]">
            Bagikan pengalaman Anda terkait ketepatan waktu, kualitas sampah, dan
            kelancaran transaksi COD.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          {/* Star Rating Selector */}
          <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-[#FAF8F5] border border-zinc-200/60 space-y-2">
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(null)}
                  className="p-1 transition-transform hover:scale-120 cursor-pointer focus:outline-none"
                >
                  <Star
                    className={cn(
                      "h-7 w-7 transition-colors",
                      star <= currentDisplayRating
                        ? "fill-amber-400 text-amber-400"
                        : "text-zinc-200 hover:text-amber-200"
                    )}
                  />
                </button>
              ))}
            </div>
            <span className="text-xs font-semibold text-[#171717] min-h-4">
              {ratingLabels[currentDisplayRating]}
            </span>
          </div>

          {/* Comment Field */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#171717] flex items-center gap-1.5">
              <MessageSquareQuote className="h-3.5 w-3.5 text-[#6B7B4F]" />
              <span>Komentar Testimoni (Opsional)</span>
            </label>
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Contoh: Sampah bersih sesuai foto, timbangan tepat, dan pembayaran COD sangat lancar!"
              className="h-20 text-xs rounded-2xl bg-[#F7F4EE] border-zinc-200 focus-visible:ring-1 focus-visible:ring-[#171717] focus-visible:bg-white resize-none"
            />
          </div>

          <DialogFooter className="flex-row items-center justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
              className="rounded-full h-9 px-4 text-xs font-semibold border-zinc-200"
            >
              Nanti Saja
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="rounded-full h-9 px-5 text-xs font-bold bg-[#171717] hover:bg-[#2B2B26] text-white shadow-xs"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                  <span>Mengirim...</span>
                </>
              ) : (
                <span>Kirim Ulasan</span>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
