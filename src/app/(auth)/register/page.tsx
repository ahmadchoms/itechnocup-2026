"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, User, Phone, MapPin, Eye, EyeOff, RefreshCw, Recycle, Star, ArrowRight, CheckCircle2, Sparkles } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    address: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      setError("Password dan konfirmasi password tidak sama");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password minimal 6 karakter");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
          address: formData.address,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Pendaftaran gagal. Coba lagi.");
        setIsLoading(false);
        return;
      }

      router.push("/profile");
      router.refresh();
    } catch {
      setError("Terjadi kesalahan koneksi. Coba lagi.");
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto rounded-[32px] border border-black/5 bg-white shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[680px]">
      {/* LEFT COLUMN: Clean Register Form */}
      <div className="lg:col-span-7 p-6 sm:p-10 lg:p-12 flex flex-col justify-between space-y-6">
        <div>
          {/* Brand Header */}
          <Link href="/" className="inline-flex items-center space-x-2.5 mb-6 group">
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

          <div>
            <h1 className="font-[family-name:var(--font-display)] text-2xl sm:text-3xl font-extrabold text-[#171717] tracking-tight">
              Daftar Akun DaurNusa
            </h1>
            <p className="text-xs sm:text-sm text-[#78766B] mt-1.5 leading-relaxed">
              Bergabunglah sebagai Penjual (Warga/UMKM) atau Pembeli &amp; Pengepul limbah sirkular.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-3.5">
            {error && (
              <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-2xl text-red-600 text-xs font-medium">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-[#171717] mb-1">Nama Lengkap *</label>
              <div className="relative">
                <User className="w-4 h-4 text-[#8A8778] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="register-fullname"
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="Contoh: Ahmad Syahfruddin"
                  className="w-full pl-10 pr-4 py-2.5 text-[13px] bg-[#F7F4EE] border border-black/5 focus:border-[#171717] focus:bg-white rounded-2xl text-[#171717] focus:outline-none transition-all placeholder:text-[#A8A594]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#171717] mb-1">Email Aktif *</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#8A8778] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="register-email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="nama@email.com"
                  className="w-full pl-10 pr-4 py-2.5 text-[13px] bg-[#F7F4EE] border border-black/5 focus:border-[#171717] focus:bg-white rounded-2xl text-[#171717] focus:outline-none transition-all placeholder:text-[#A8A594]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#171717] mb-1">Kata Sandi *</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#8A8778] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="register-password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Min. 6 karakter"
                    className="w-full pl-10 pr-9 py-2.5 text-[13px] bg-[#F7F4EE] border border-black/5 focus:border-[#171717] focus:bg-white rounded-2xl text-[#171717] focus:outline-none transition-all placeholder:text-[#A8A594]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8A8778] hover:text-[#171717] p-1 cursor-pointer"
                    aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#171717] mb-1">Konfirmasi Kata Sandi *</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#8A8778] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="register-confirm-password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    placeholder="Ulangi sandi"
                    className="w-full pl-10 pr-4 py-2.5 text-[13px] bg-[#F7F4EE] border border-black/5 focus:border-[#171717] focus:bg-white rounded-2xl text-[#171717] focus:outline-none transition-all placeholder:text-[#A8A594]"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#171717] mb-1">Nomor WhatsApp / Telepon</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-[#8A8778] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="register-phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="08xxxxxxxxxx"
                  className="w-full pl-10 pr-4 py-2.5 text-[13px] bg-[#F7F4EE] border border-black/5 focus:border-[#171717] focus:bg-white rounded-2xl text-[#171717] focus:outline-none transition-all placeholder:text-[#A8A594]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#171717] mb-1">Alamat Penjemputan / Operasional</label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-[#8A8778] absolute left-3.5 top-3" />
                <textarea
                  id="register-address"
                  rows={2}
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Jl. Simpang Lima No. 1, Semarang"
                  className="w-full pl-10 pr-4 py-2.5 text-[13px] bg-[#F7F4EE] border border-black/5 focus:border-[#171717] focus:bg-white rounded-2xl text-[#171717] focus:outline-none transition-all placeholder:text-[#A8A594] resize-none"
                />
              </div>
            </div>

            <button
              id="register-submit"
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-full bg-[#171717] hover:bg-[#2B2B26] active:scale-[0.99] text-white font-bold text-[13px] transition-all flex items-center justify-center space-x-2 disabled:opacity-60 cursor-pointer shadow-md mt-4"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Mendaftarkan Akun...</span>
                </>
              ) : (
                <>
                  <span>Daftar &amp; Mulai Berdagang</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        <div className="pt-4 border-t border-black/5 text-center">
          <p className="text-xs text-[#78766B]">
            Sudah memiliki akun DaurNusa?{" "}
            <Link href="/login" className="text-[#059669] font-bold hover:underline ml-1">
              Masuk di sini
            </Link>
          </p>
        </div>
      </div>

      {/* RIGHT COLUMN: Visual Showcase & Testimonial (Desktop) */}
      <div className="hidden lg:flex lg:col-span-5 bg-[#171717] text-white p-8 lg:p-10 flex-col justify-between relative overflow-hidden">
        {/* Ambient Highlight */}
        <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-[#059669]/20 blur-3xl pointer-events-none" />
        <div className="absolute -left-16 -bottom-16 w-64 h-64 rounded-full bg-[#7A8F5C]/20 blur-3xl pointer-events-none" />

        {/* Top Tag & Trust Badge */}
        <div className="relative z-10 flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-white text-[11px] font-semibold tracking-wide">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            100% Gratis Pendaftaran
          </span>
          <div className="flex items-center gap-1 bg-white/10 px-3 py-1 rounded-full text-xs font-bold text-amber-300">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>4.9 / 5.0</span>
          </div>
        </div>

        {/* Center Visual Mockup & Testimonial */}
        <div className="relative z-10 my-6 space-y-4">
          <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=80"
              alt="Pengelolaan Limbah Sirkular Organik"
              className="w-full h-44 object-cover brightness-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#171717] via-transparent to-transparent opacity-90" />
            <div className="absolute bottom-3 left-4 right-4">
              <span className="text-[10px] uppercase font-bold text-[#7A8F5C] tracking-wider block">
                Solusi Berkelanjutan
              </span>
              <p className="text-xs font-semibold text-white/90">
                Ubah Limbah Usaha Jadi Pendapatan Nyata
              </p>
            </div>
          </div>

          {/* Testimonial Quote */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4.5 backdrop-blur-sm space-y-2.5">
            <p className="text-xs sm:text-[12.5px] text-white/80 leading-relaxed italic">
              &ldquo;Ampas kopi dari kedai kami sekarang rutin dijemput petani untuk pupuk organik lewat DaurNusa. Praktis dan menghasilkan uang saku tambahan.&rdquo;
            </p>
            <div className="flex items-center space-x-3 pt-2 border-t border-white/10">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120"
                alt="Ratna Handayani"
                className="w-9 h-9 rounded-full object-cover border border-[#7A8F5C]"
              />
              <div>
                <span className="text-xs font-bold text-white block leading-tight">Ratna Handayani</span>
                <span className="text-[10.5px] text-[#7A8F5C] block">Owner Kedai Kopi • Semarang Barat</span>
              </div>
            </div>
          </div>
        </div>

        {/* 3 Step Features */}
        <div className="relative z-10 space-y-2 pt-3 border-t border-white/10 text-xs">
          <div className="flex items-center gap-2 text-white/80">
            <CheckCircle2 className="w-4 h-4 text-[#059669] shrink-0" />
            <span>Foto sampah &amp; deteksi AI otomatis</span>
          </div>
          <div className="flex items-center gap-2 text-white/80">
            <CheckCircle2 className="w-4 h-4 text-[#059669] shrink-0" />
            <span>Pencocokan pengepul terdekat &lt; 2 km</span>
          </div>
          <div className="flex items-center gap-2 text-white/80">
            <CheckCircle2 className="w-4 h-4 text-[#059669] shrink-0" />
            <span>Timbang &amp; bayar langsung di lokasi (COD)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
