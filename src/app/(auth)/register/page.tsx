import { Suspense } from "react";
import { RegisterForm } from "@/components/features/auth/RegisterForm";

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="text-[#171717] text-center text-sm py-12">
          Memuat halaman pendaftaran...
        </div>
      }
    >
      <RegisterForm />
    </Suspense>
  );
}
