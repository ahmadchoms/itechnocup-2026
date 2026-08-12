"use client";

import { useState } from "react";
import { Star, X, Send, RefreshCw, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface RatingModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: {
    id: string;
    sellerId: string;
    buyerId: string;
    sellerName: string;
    buyerName: string;
  };
  /** ID pengguna yang sedang login (pemberi ulasan) */
  currentUserId: string;
}

export function RatingModal({ isOpen, onClose, transaction, currentUserId }: RatingModalProps) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDone, setIsDone] = useState(false);

  if (!isOpen) return null;

  // Tentukan reviewee: jika currentUser = seller → nilai buyer, sebaliknya
  const isSeller = currentUserId === transaction.sellerId;
  const revieweeId = isSeller ? transaction.buyerId : transaction.sellerId;
  const revieweeName = isSeller ? transaction.buyerName : transaction.sellerName;

  const ratingLabels = ["", "Buruk", "Kurang Memuaskan", "Cukup Baik", "Bagus", "Sangat Bagus!"];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return;

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          transactionId: transaction.id,
          reviewerId: currentUserId,
          revieweeId,
          rating,
          comment: comment.trim() || null,
        }),
      });

      if (res.ok) {
        setIsDone(true);
        setTimeout(() => {
          onClose();
          setIsDone(false);
          setRating(0);
          setComment("");
        }, 2000);
      } else {
        const data = await res.json();
        alert(data.error || "Gagal menyimpan ulasan");
      }
    } catch {
      alert("Terjadi kesalahan. Coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 animate-in fade-in">
      <div className="w-full max-w-sm bg-white rounded-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="font-bold text-base text-slate-900">Beri Ulasan & Rating</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Berikan penilaian untuk <span className="font-semibold text-emerald-700">{revieweeName}</span>
            </p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {isDone ? (
          <div className="p-8 text-center space-y-3">
            <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto" />
            <p className="font-semibold text-slate-800">Ulasan Terkirim!</p>
            <p className="text-xs text-slate-500">Terima kasih sudah memberikan penilaian.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Star Rating Input */}
            <div className="text-center space-y-2">
              <div className="flex items-center justify-center space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    id={`star-${star}`}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    onClick={() => setRating(star)}
                    className="transition-transform hover:scale-110"
                  >
                    <Star
                      className={cn(
                        "w-9 h-9 transition-colors",
                        (hoveredRating || rating) >= star
                          ? "text-amber-400 fill-amber-400"
                          : "text-slate-200 fill-slate-200"
                      )}
                    />
                  </button>
                ))}
              </div>
              {(hoveredRating || rating) > 0 && (
                <p className="text-sm font-semibold text-amber-600">
                  {ratingLabels[hoveredRating || rating]}
                </p>
              )}
            </div>

            {/* Komentar */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Komentar (opsional)
              </label>
              <textarea
                id="review-comment"
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Ceritakan pengalaman transaksi Anda..."
                className="w-full px-3 py-2.5 text-sm bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl focus:outline-none transition-colors resize-none"
              />
            </div>

            {/* Submit */}
            <button
              id="review-submit"
              type="submit"
              disabled={rating === 0 || isSubmitting}
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm transition-all flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-emerald-600/20"
            >
              {isSubmitting ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Kirim Ulasan</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
