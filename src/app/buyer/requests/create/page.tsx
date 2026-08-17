import { getSessionUser } from "@/lib/session";
import { redirect } from "next/navigation";
import { CreateRequestClient } from "./CreateRequestClient";

export const dynamic = "force-dynamic";

export default async function CreateRequestPage() {
  const sessionUser = await getSessionUser();
  if (!sessionUser) {
    redirect("/login?redirect=/buyer/requests/create");
  }

  if (sessionUser.activeRole !== "buyer") {
    redirect("/profile");
  }

  return <CreateRequestClient />;
}
