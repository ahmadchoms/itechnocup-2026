"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, Eye, EyeOff, RefreshCw, Recycle, Star, ArrowRight, ShieldCheck, Sparkles } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/profile";
  const reason = searchParams.get("reason");

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const demoAccounts = [
    { label: "Penjual (Masyarakat)", email: "ahmad@daurnusa.id", password: "password123" },
    { label: "Pembeli (Pengepul)", email: "paktani.ungaran@gmail.com", password: "password123" },
    { label: "Admin", email: "admin@daurnusa.id", password: "password123" },
  ];

  const executeLogin = async (loginEmail?: string, loginPassword?: string) => {
    setError(null);
    setIsLoading(true);

    const email = loginEmail || formData.email;
    const password = loginPassword || formData.password;

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login gagal. Periksa email dan password Anda.");
        setIsLoading(false);
        return;
      }

      let destination = redirectTo;
      if (data.user?.isAdmin) {
        if (!searchParams.get("redirect") || searchParams.get("redirect") === "/profile") {
          destination = "/admin";
        }
      }

      window.location.href = destination;
    } catch {
      setError("Terjadi kesalahan koneksi. Coba lagi.");
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeLogin();
  };

  const handleDemoLogin = (email: string, password: string) => {
    setFormData({ email, password });
    executeLogin(email, password);
  };

  return (
    <div className="w-full max-w-5xl mx-auto rounded-[32px] border border-black/5 bg-white shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[640px]">
      {/* LEFT COLUMN: Clean Form & Actions */}
      <div className="lg:col-span-7 p-6 sm:p-10 lg:p-12 flex flex-col justify-between space-y-6">
        <div>
          {/* Brand Header */}
          <Link href="/" className="inline-flex items-center space-x-2.5 mb-8 group">
            <div className="w-9 h-9 rounded-xl bg-[#059669] flex items-center justify-center text-white shadow-xs">
              <Recycle className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-lg text-[#171717] tracking-tight block leading-none">
                Daur<span className="text-[#059669]">Nusa</span>
              </span>
              <span className="text-[10px] font-medium text-[#78766B] block mt-0.5">
                Marketplace Sampah Sirkular
              </span>
            </div>
          </Link>

          {reason === "admin" && (
            <div className="mb-6 px-4 py-3 bg-[#FEF3D6] border border-[#C98A0B]/30 rounded-2xl text-[#C98A0B] text-xs font-semibold flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>Halaman Admin memerlukan login akun administrator terlebih dahulu.</span>
            </div>
          )}

          <div>
            <h1 className="font-[family-name:var(--font-display)] text-2xl sm:text-3xl font-extrabold text-[#171717] tracking-tight">
              Selamat Datang Kembali
            </h1>
            <p className="text-xs sm:text-sm text-[#78766B] mt-1.5 leading-relaxed">
              Masuk ke akun Anda untuk mengelola lapak, penawaran, dan transaksi limbah sirkular.
            </p>
          </div>

          {/* Demo Quick Fill for Evaluator */}
          <div className="mt-6 p-4 rounded-2xl bg-[#EFF3E7] border border-[#7A8F5C]/20 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10.5px] font-bold text-[#6B7B4F] uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#6B7B4F]" />
                Akun Demo Cepat
              </span>
              <span className="text-[10px] text-[#78766B]">1-Klik Langsung Masuk</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {demoAccounts.map((acc) => (
                <button
                  key={acc.email}
                  type="button"
                  onClick={() => handleDemoLogin(acc.email, acc.password)}
                  className="px-3 py-1.5 rounded-full bg-white hover:bg-[#171717] hover:text-white border border-black/5 text-xs font-semibold text-[#171717] transition-all cursor-pointer shadow-2xs"
                >
                  {acc.label}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {error && (
              <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-2xl text-red-600 text-xs font-medium">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-[#171717] mb-1.5">Email Akun</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#8A8778] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="login-email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="nama@email.com"
                  className="w-full pl-10 pr-4 py-3 text-[13px] bg-[#F7F4EE] border border-black/5 focus:border-[#171717] focus:bg-white rounded-2xl text-[#171717] focus:outline-none transition-all placeholder:text-[#A8A594]"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-[#171717]">Kata Sandi</label>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#8A8778] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-11 py-3 text-[13px] bg-[#F7F4EE] border border-black/5 focus:border-[#171717] focus:bg-white rounded-2xl text-[#171717] focus:outline-none transition-all placeholder:text-[#A8A594]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8A8778] hover:text-[#171717] p-1 cursor-pointer"
                  aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              id="login-submit"
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-full bg-[#171717] hover:bg-[#2B2B26] active:scale-[0.99] text-white font-bold text-[13px] transition-all flex items-center justify-center space-x-2 disabled:opacity-60 cursor-pointer shadow-md mt-2"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Memproses Masuk...</span>
                </>
              ) : (
                <>
                  <span>Masuk ke DaurNusa</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        <div className="pt-4 border-t border-black/5 text-center">
          <p className="text-xs text-[#78766B]">
            Belum memiliki akun DaurNusa?{" "}
            <Link href="/register" className="text-[#059669] font-bold hover:underline ml-1">
              Daftar sekarang
            </Link>
          </p>
        </div>
      </div>

      {/* RIGHT COLUMN: Visual Showcase & Testimonial (Desktop) */}
      <div className="hidden lg:flex lg:col-span-5 bg-[#171717] text-white p-8 lg:p-10 flex-col justify-between relative overflow-hidden">
        {/* Ambient Subtle Background Highlight */}
        <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-[#059669]/20 blur-3xl pointer-events-none" />
        <div className="absolute -left-16 -bottom-16 w-64 h-64 rounded-full bg-[#7A8F5C]/20 blur-3xl pointer-events-none" />

        {/* Top Tag & Trust Badge */}
        <div className="relative z-10 flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-white text-[11px] font-semibold tracking-wide">
            <span className="w-2 h-2 rounded-full bg-[#059669] animate-pulse" />
            Ekosistem Sirkular Semarang
          </span>
          <div className="flex items-center gap-1 bg-white/10 px-3 py-1 rounded-full text-xs font-bold text-amber-300">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>4.9 / 5.0</span>
          </div>
        </div>

        {/* Center Visual Mockup / Photo Card */}
        <div className="relative z-10 my-8 space-y-4">
          <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800&auto=format&fit=crop&q=80"
              alt="Pengelolaan Limbah Sirkular"
              className="w-full h-48 object-cover brightness-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#171717] via-transparent to-transparent opacity-90" />
            <div className="absolute bottom-3 left-4 right-4">
              <span className="text-[10px] uppercase font-bold text-[#7A8F5C] tracking-wider block">
                Kemitraan Nyata
              </span>
              <p className="text-xs font-semibold text-white/90">
                Menghubungkan 150+ Warung &amp; Kedai Kopi dengan Pengepul Terdekat
              </p>
            </div>
          </div>

          {/* Testimonial Quote */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-sm space-y-3">
            <p className="text-xs sm:text-[13px] text-white/80 leading-relaxed italic">
              &ldquo;Sistem matching lokasi DaurNusa sangat memudahkan lapak saya mendapatkan stok kardus dan ampas kopi dari UMKM sekitar tanpa perantara.&rdquo;
            </p>
            <div className="flex items-center space-x-3 pt-2 border-t border-white/10">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120"
                alt="Budi Santoso"
                className="w-9 h-9 rounded-full object-cover border border-[#7A8F5C]"
              />
              <div>
                <span className="text-xs font-bold text-white block leading-tight">Budi Santoso</span>
                <span className="text-[10.5px] text-[#7A8F5C] block">Pengepul Kardus &amp; Plastik • Semarang</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Quick Impact Stats */}
        <div className="relative z-10 grid grid-cols-3 gap-2 text-center pt-4 border-t border-white/10">
          <div className="bg-white/5 rounded-xl p-2.5">
            <span className="text-sm font-extrabold text-white block">1.250+ kg</span>
            <span className="text-[10px] text-white/60 block mt-0.5">Limbah Terjual</span>
          </div>
          <div className="bg-white/5 rounded-xl p-2.5">
            <span className="text-sm font-extrabold text-[#7A8F5C] block">&lt; 2 km</span>
            <span className="text-[10px] text-white/60 block mt-0.5">Jarak Terdekat</span>
          </div>
          <div className="bg-white/5 rounded-xl p-2.5">
            <span className="text-sm font-extrabold text-amber-400 block">COD</span>
            <span className="text-[10px] text-white/60 block mt-0.5">Bayar di Tempat</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="text-[#171717] text-center text-sm py-12">Memuat halaman masuk...</div>}>
      <LoginForm />
    </Suspense>
  );
}
