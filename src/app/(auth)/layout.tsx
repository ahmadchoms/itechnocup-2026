import type { Metadata } from "next";
import { displayFont, bodyFont } from "@/lib/fonts";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Autentikasi — DaurNusa",
  description: "Masuk atau daftar akun DaurNusa untuk mulai jual-beli sampah dan limbah sirkular.",
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={cn(
        displayFont.variable,
        bodyFont.variable,
        "min-h-screen bg-[#F6F3EC] flex flex-col justify-center font-[family-name:var(--font-body)] p-3 sm:p-6 lg:p-10"
      )}
    >
      {children}
    </div>
  );
}
