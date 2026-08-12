import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
    });

    const listings = await prisma.listing.findMany({
      include: { seller: true, category: true },
      orderBy: { createdAt: "desc" },
    });

    const requests = await prisma.wasteRequest.findMany({
      include: { buyer: true, category: true },
      orderBy: { createdAt: "desc" },
    });

    const transactions = await prisma.transaction.findMany({
      where: { status: "selesai" },
      include: { seller: true, buyer: true, category: true },
    });

    const totalVolumeKg = listings.reduce((acc, l) => acc + (Number(l.estimatedWeightKg) || 0), 0);
    const totalTransactionValue = transactions.reduce((acc, t) => acc + (Number(t.finalPrice) || 0), 0);

    return NextResponse.json({
      stats: {
        totalUsers: users.length,
        totalListings: listings.length,
        totalRequests: requests.length,
        totalTransactions: transactions.length,
        totalVolumeKg,
        totalTransactionValue,
      },
      users,
      listings,
      requests,
      transactions,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { action, id, data } = await request.json();

    if (action === "toggleUserAdmin") {
      const user = await prisma.user.update({
        where: { id },
        data: { isAdmin: data.isAdmin },
      });
      return NextResponse.json({ success: true, user });
    }

    if (action === "deleteListing") {
      await prisma.listing.update({
        where: { id },
        data: { status: "dihapus" },
      });
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Action tidak dikenal" }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
