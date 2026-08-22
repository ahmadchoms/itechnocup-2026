import { prisma } from "@/lib/prisma";
import { AppShell } from "@/components/layout/AppShell";
import { ChatClient } from "@/components/features/chat/ChatRoom";
import { getSessionUser } from "@/lib/session";
import { chatService } from "@/services/chatService";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

type RouteParams = { params: Promise<{ id: string }> };

export default async function UnifiedChatDetailPage({ params }: RouteParams) {
  const { id } = await params;
  const sessionUser = await getSessionUser();

  if (!sessionUser) {
    redirect(`/login?redirect=/chat/${id}`);
  }

  const categories = await prisma.wasteCategory.findMany({
    orderBy: { name: "asc" },
  });

  const conversations = await chatService.getUserConversations(sessionUser.id);

  return (
    <AppShell categories={categories} sessionUser={sessionUser}>
      <ChatClient
        conversations={conversations}
        activeId={id}
        currentUserId={sessionUser.id}
      />
    </AppShell>
  );
}
