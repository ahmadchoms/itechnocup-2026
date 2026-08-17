import { prisma } from "@/lib/prisma";
import { AppShell } from "@/components/layout/AppShell";
import { ChatClient } from "@/components/features/chat/ChatRoom";
import { getSessionUser } from "@/lib/session";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function ChatPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string; sellerId?: string; listingId?: string; buyerId?: string }>;
}) {
  const sessionUser = await getSessionUser();
  if (!sessionUser) {
    redirect("/login?redirect=/buyer/chat");
  }

  const params = await searchParams;
  const categories = await prisma.wasteCategory.findMany({
    orderBy: { name: "asc" },
  });

  const conversations = await prisma.conversation.findMany({
    where: {
      buyerId: sessionUser.id,
    },
    include: {
      seller: true,
      buyer: true,
      match: {
        include: {
          listing: {
            include: { category: true },
          },
        },
      },
      messages: {
        orderBy: { sentAt: "asc" },
      },
      transactions: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const formattedConversations = conversations.map((conv) => ({
    ...conv,
    seller: {
      ...conv.seller,
      latitude: conv.seller.latitude ? Number(conv.seller.latitude) : null,
      longitude: conv.seller.longitude ? Number(conv.seller.longitude) : null,
    },
    buyer: conv.buyer ? {
      ...conv.buyer,
      latitude: conv.buyer.latitude ? Number(conv.buyer.latitude) : null,
      longitude: conv.buyer.longitude ? Number(conv.buyer.longitude) : null,
    } : null,
    match: conv.match
      ? {
          ...conv.match,
          distanceKm: conv.match.distanceKm ? Number(conv.match.distanceKm) : 0.8,
          listing: {
            ...conv.match.listing,
            estimatedPrice: conv.match.listing.estimatedPrice
              ? Number(conv.match.listing.estimatedPrice)
              : null,
            estimatedWeightKg: conv.match.listing.estimatedWeightKg
              ? Number(conv.match.listing.estimatedWeightKg)
              : null,
            cvConfidence: conv.match.listing.cvConfidence
              ? Number(conv.match.listing.cvConfidence)
              : null,
            latitude: conv.match.listing.latitude ? Number(conv.match.listing.latitude) : null,
            longitude: conv.match.listing.longitude ? Number(conv.match.listing.longitude) : null,
          },
        }
      : null,
    transactions: conv.transactions.map((t) => ({
      ...t,
      finalPrice: Number(t.finalPrice),
    })),
  }));

  return (
    <AppShell categories={categories} sessionUser={sessionUser}>
      <ChatClient
        conversations={formattedConversations}
        activeId={params.id}
        sellerIdParam={params.sellerId}
        listingIdParam={params.listingId}
      />
    </AppShell>
  );
}
