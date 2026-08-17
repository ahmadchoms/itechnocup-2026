import { getSessionUser } from "@/lib/session";
import { redirect } from "next/navigation";
import React from "react";
import { AdminLayoutClient } from "./AdminLayoutClient";
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getSessionUser();
  
  if (!user || !user.isAdmin) {
    redirect("/");
  }

  return (
    <AdminLayoutClient sessionUser={user as any}>
      {children}
    </AdminLayoutClient>
  );
}
