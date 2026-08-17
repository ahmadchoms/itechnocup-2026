"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, User, Phone, MapPin, Eye, EyeOff, RefreshCw } from "lucide-react";

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
        return;
      }

      router.push("/profile");
      router.refresh();
    } catch {
      setError("Terjadi kesalahan koneksi. Coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 space-y-6">
      <div>
        <h1 className="text-xl font-bold text-white tracking-tight">Daftar Akun DaurNusa</h1>
        <p className="text-xs text-slate-400 mt-1">Bergabunglah sebagai Seller atau Buyer limbah sirkular</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        {error && (
          <div className="px-4 py-3 bg-red-950/80 border border-red-800 rounded-xl text-red-300 text-xs">
            {error}
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Nama Lengkap *</label>
          <div className="relative">
            <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              id="register-fullname"
              type="text"
              required
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              placeholder="Ahmad Syahfruddin"
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-800 border border-slate-700 focus:border-emerald-500 rounded-xl text-white focus:outline-none transition-colors placeholder:text-slate-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Email *</label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              id="register-email"
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="email@contoh.com"
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-800 border border-slate-700 focus:border-emerald-500 rounded-xl text-white focus:outline-none transition-colors placeholder:text-slate-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Password *</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                id="register-password"
                type={showPassword ? "text" : "password"}
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Min. 6 karakter"
                className="w-full pl-9 pr-8 py-2.5 text-sm bg-slate-800 border border-slate-700 focus:border-emerald-500 rounded-xl text-white focus:outline-none transition-colors placeholder:text-slate-500"
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Konfirmasi *</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                id="register-confirm-password"
                type={showPassword ? "text" : "password"}
                required
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                placeholder="Ulangi password"
                className="w-full pl-9 pr-4 py-2.5 text-sm bg-slate-800 border border-slate-700 focus:border-emerald-500 rounded-xl text-white focus:outline-none transition-colors placeholder:text-slate-500"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">No. Telepon</label>
          <div className="relative">
            <Phone className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              id="register-phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="08xxxxxxxxxx"
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-800 border border-slate-700 focus:border-emerald-500 rounded-xl text-white focus:outline-none transition-colors placeholder:text-slate-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Alamat</label>
          <div className="relative">
            <MapPin className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
            <textarea
              id="register-address"
              rows={2}
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="Jl. Simpang Lima No. 1, Semarang"
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-800 border border-slate-700 focus:border-emerald-500 rounded-xl text-white focus:outline-none transition-colors placeholder:text-slate-500 resize-none"
            />
          </div>
        </div>

        <button
          id="register-submit"
          type="submit"
          disabled={isLoading}
          className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-semibold text-sm transition-colors flex items-center justify-center space-x-2 disabled:opacity-60 cursor-pointer mt-2"
        >
          {isLoading ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <span>Daftar &amp; Mulai Berdagang</span>
          )}
        </button>
      </form>

      <p className="text-center text-xs text-slate-400">
        Sudah punya akun?{" "}
        <Link href="/login" className="text-emerald-400 font-semibold hover:underline">
          Masuk di sini
        </Link>
      </p>
    </div>
  );
}
