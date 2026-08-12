import { prisma } from "@/lib/prisma";
import { AppShell } from "@/components/layout/AppShell";
import { notFound, redirect } from "next/navigation";
import { getSessionUser } from "@/lib/session";
import { ChatClient } from "../ChatClient";

export const dynamic = "force-dynamic";

type RouteParams = { params: Promise<{ id: string }> };

export default async function ChatDetailPage({ params }: RouteParams) {
  const { id } = await params;
  const sessionUser = await getSessionUser();

  const categories = await prisma.wasteCategory.findMany({
    orderBy: { name: "asc" },
  });

  // Fetch all conversations for the user or default active conversation
  const userConversations = await prisma.conversation.findMany({
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
      where: { id },
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
              }
            : null,
          request: c.match.request
            ? {
                ...c.match.request,
                offeredPrice: Number(c.match.request.offeredPrice),
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
    <AppShell categories={categories}>
      <ChatClient conversations={serializedConversations} activeId={id} />
    </AppShell>
  );
}
