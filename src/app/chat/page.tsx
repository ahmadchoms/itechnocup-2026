import { prisma } from "@/lib/prisma";
import { AppShell } from "@/components/layout/AppShell";
import { ChatClient } from "@/components/features/chat/ChatRoom";
import { getSessionUser } from "@/lib/session";
import { chatService } from "@/services/chatService";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function UnifiedChatPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string; sellerId?: string; listingId?: string; buyerId?: string }>;
}) {
  const sessionUser = await getSessionUser();
  if (!sessionUser) {
    redirect("/login?redirect=/chat");
  }

  const params = await searchParams;
  const categories = await prisma.wasteCategory.findMany({
    orderBy: { name: "asc" },
  });

  const conversations = await chatService.getUserConversations(sessionUser.id);

  return (
    <AppShell categories={categories} sessionUser={sessionUser}>
      <ChatClient
        conversations={conversations}
        activeId={params.id}
        sellerIdParam={params.sellerId}
        listingIdParam={params.listingId}
        currentUserId={sessionUser.id}
      />
    </AppShell>
  );
}
