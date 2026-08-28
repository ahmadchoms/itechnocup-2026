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
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
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

    if (action === "updateUser") {
      const { fullName, email, phone, address, isAdmin, isBuyerApproved } = data;
      const user = await prisma.user.update({
        where: { id },
        data: {
          fullName,
          email,
          phone: phone || null,
          address: address || null,
          isAdmin: typeof isAdmin === "boolean" ? isAdmin : undefined,
          isBuyerApproved: typeof isBuyerApproved === "boolean" ? isBuyerApproved : undefined,
        },
      });
      return NextResponse.json({ success: true, user });
    }

    if (action === "deleteUser") {
      await prisma.$transaction(async (tx) => {
        await tx.review.deleteMany({
          where: { OR: [{ reviewerId: id }, { revieweeId: id }] },
        });

        await tx.transaction.deleteMany({
          where: { OR: [{ sellerId: id }, { buyerId: id }] },
        });

        await tx.message.deleteMany({
          where: {
            OR: [
              { senderId: id },
              { conversation: { OR: [{ sellerId: id }, { buyerId: id }] } },
            ],
          },
        });

        await tx.conversation.deleteMany({
          where: { OR: [{ sellerId: id }, { buyerId: id }] },
        });

        await tx.match.deleteMany({
          where: {
            OR: [
              { listing: { sellerId: id } },
              { request: { buyerId: id } },
            ],
          },
        });

        await tx.cVClassificationLog.deleteMany({
          where: { listing: { sellerId: id } },
        });

        await tx.listing.deleteMany({
          where: { sellerId: id },
        });

        await tx.wasteRequest.deleteMany({
          where: { buyerId: id },
        });

        await tx.buyerApplication.deleteMany({
          where: { userId: id },
        });

        await tx.user.delete({
          where: { id },
        });
      });

      return NextResponse.json({ success: true });
    }

    if (action === "deleteListing") {
      await prisma.listing.update({
        where: { id },
        data: { status: "dihapus" },
      });
      return NextResponse.json({ success: true });
    }

    if (action === "restoreListing") {
      await prisma.listing.update({
        where: { id },
        data: { status: "aktif" },
      });
      return NextResponse.json({ success: true });
    }

    if (action === "deleteRequest") {
      await prisma.wasteRequest.update({
        where: { id },
        data: { status: "dibatalkan" },
      });
      return NextResponse.json({ success: true });
    }

    if (action === "restoreRequest") {
      await prisma.wasteRequest.update({
        where: { id },
        data: { status: "aktif" },
      });
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Action tidak dikenal" }, { status: 400 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
