import { getSessionUser } from "@/lib/session";
import { redirect } from "next/navigation";
import React from "react";

export default async function BuyerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getSessionUser();
  
  if (!user) {
    redirect("/login");
  }

  // Halaman history dsb. tidak perlu dicek activeRole secara keras
  // Pengecekan activeRole spesifik akan dilakukan di masing-masing page.tsx (seperti di rute /create)

  return (
    <div className="buyer-layout">
      {children}
    </div>
  );
}
