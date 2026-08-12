import { prisma } from "@/lib/prisma";
import { AppShell } from "@/components/layout/AppShell";
import { ChatClient } from "./ChatClient";

export const dynamic = "force-dynamic";

export default async function ChatPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string; sellerId?: string; listingId?: string; buyerId?: string }>;
}) {
  const params = await searchParams;
  const categories = await prisma.wasteCategory.findMany({
    orderBy: { name: "asc" },
  });

  const conversations = await prisma.conversation.findMany({
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
    match: conv.match
      ? {
          ...conv.match,
          distanceKm: conv.match.distanceKm ? Number(conv.match.distanceKm) : 0.8,
          listing: {
            ...conv.match.listing,
            estimatedPrice: conv.match.listing.estimatedPrice
              ? Number(conv.match.listing.estimatedPrice)
              : null,
          },
        }
      : null,
    transactions: conv.transactions.map((t) => ({
      ...t,
      finalPrice: Number(t.finalPrice),
    })),
  }));

  return (
    <AppShell categories={categories}>
      <ChatClient
        conversations={formattedConversations}
        activeId={params.id}
        sellerIdParam={params.sellerId}
        listingIdParam={params.listingId}
      />
    </AppShell>
  );
}
