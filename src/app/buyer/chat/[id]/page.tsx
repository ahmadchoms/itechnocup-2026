import { prisma } from "@/lib/prisma";
import { AppShell } from "@/components/layout/AppShell";
import { notFound, redirect } from "next/navigation";
import { getSessionUser } from "@/lib/session";
import { ChatClient } from "@/components/features/chat/ChatRoom";

export const dynamic = "force-dynamic";

type RouteParams = { params: Promise<{ id: string }> };

export default async function ChatDetailPage({ params }: RouteParams) {
  const { id } = await params;
  const sessionUser = await getSessionUser();
  
  if (!sessionUser) {
    redirect("/login?redirect=/buyer/chat");
  }

  const categories = await prisma.wasteCategory.findMany({
    orderBy: { name: "asc" },
  });

  // Fetch all conversations for the user or default active conversation
  const userConversations = await prisma.conversation.findMany({
    where: { buyerId: sessionUser.id },
    include: {
      seller: true,
      buyer: true,
      match: {
        include: {
          listing: {
            include: { category: true },
          },
          request: {
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

  const activeConvExists = userConversations.some((c) => c.id === id);

  // If conversation does not exist, check DB directly
  if (!activeConvExists) {
    const singleConv = await prisma.conversation.findUnique({
      where: { id, buyerId: sessionUser.id },
      include: {
        seller: true,
        buyer: true,
        match: {
          include: {
            listing: { include: { category: true } },
            request: { include: { category: true } },
          },
        },
        messages: { orderBy: { sentAt: "asc" } },
        transactions: { orderBy: { createdAt: "desc" }, take: 1 },
      },
    });

    if (!singleConv) {
      notFound();
    }

    userConversations.unshift(singleConv);
  }

  const serializedConversations = userConversations.map((c) => ({
    ...c,
    seller: {
      ...c.seller,
      latitude: c.seller.latitude ? Number(c.seller.latitude) : null,
      longitude: c.seller.longitude ? Number(c.seller.longitude) : null,
    },
    buyer: c.buyer ? {
      ...c.buyer,
      latitude: c.buyer.latitude ? Number(c.buyer.latitude) : null,
      longitude: c.buyer.longitude ? Number(c.buyer.longitude) : null,
    } : null,
    match: c.match
      ? {
          ...c.match,
          distanceKm: Number(c.match.distanceKm),
          listing: c.match.listing
            ? {
                ...c.match.listing,
                estimatedWeightKg: c.match.listing.estimatedWeightKg
                  ? Number(c.match.listing.estimatedWeightKg)
                  : null,
                estimatedPrice: c.match.listing.estimatedPrice
                  ? Number(c.match.listing.estimatedPrice)
                  : null,
                cvConfidence: c.match.listing.cvConfidence ? Number(c.match.listing.cvConfidence) : null,
                latitude: c.match.listing.latitude ? Number(c.match.listing.latitude) : null,
                longitude: c.match.listing.longitude ? Number(c.match.listing.longitude) : null,
              }
            : null,
          request: c.match.request
            ? {
                ...c.match.request,
                offeredPrice: Number(c.match.request.offeredPrice),
                latitude: c.match.request.latitude ? Number(c.match.request.latitude) : null,
                longitude: c.match.request.longitude ? Number(c.match.request.longitude) : null,
              }
            : null,
        }
      : null,
    transactions: c.transactions.map((t) => ({
      ...t,
      finalPrice: Number(t.finalPrice),
    })),
  }));

  return (
    <AppShell categories={categories} sessionUser={sessionUser}>
      <ChatClient conversations={serializedConversations} activeId={id} />
    </AppShell>
  );
}
