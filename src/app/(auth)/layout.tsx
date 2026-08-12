import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Autentikasi — DaurNusa",
  description: "Login atau daftar akun DaurNusa untuk mulai jual-beli sampah/limbah.",
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Brand Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-bold text-lg">
              D
            </div>
            <span className="text-2xl font-bold text-white tracking-tight">DaurNusa</span>
          </div>
          <p className="text-xs text-slate-400">
            Platform Sirkular Sampah & Limbah Indonesia
          </p>
        </div>

        {children}
      </div>
    </div>
  );
}
