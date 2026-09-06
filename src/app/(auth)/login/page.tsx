import { Suspense } from "react";
import { LoginForm } from "@/components/features/auth/LoginForm";

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="text-[#171717] text-center text-sm py-12">
          Memuat halaman masuk...
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
