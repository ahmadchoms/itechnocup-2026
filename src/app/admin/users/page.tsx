import { prisma } from "@/lib/prisma";
import { UsersClient } from "@/components/features/admin/UsersClient";

export const dynamic = "force-dynamic";

export default async function UsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
  });

  const formattedUsers = users.map((u) => ({
    ...u,
    latitude: u.latitude ? Number(u.latitude) : null,
    longitude: u.longitude ? Number(u.longitude) : null,
  }));

  return <UsersClient initialUsers={formattedUsers} />;
}
