import { prisma } from "@/lib/prisma";
import { UsersClient } from "@/components/features/admin/UsersClient";
import { AdminUserItem } from "@/components/features/admin/types";

export const dynamic = "force-dynamic";

export default async function UsersPage() {
  const users = await prisma.user.findMany({
    include: {
      _count: {
        select: {
          listings: true,
          wasteRequests: true,
          sellerTransactions: true,
          buyerTransactions: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const formattedUsers: AdminUserItem[] = users.map((u) => ({
    id: u.id,
    fullName: u.fullName,
    email: u.email,
    phone: u.phone,
    address: u.address,
    latitude: u.latitude ? Number(u.latitude) : null,
    longitude: u.longitude ? Number(u.longitude) : null,
    avatarUrl: u.avatarUrl,
    isAdmin: u.isAdmin,
    isBuyerApproved: u.isBuyerApproved,
    activeRole: u.activeRole,
    createdAt: u.createdAt.toISOString(),
    updatedAt: u.updatedAt.toISOString(),
    _count: u._count,
  }));

  return <UsersClient initialUsers={formattedUsers} />;
}
