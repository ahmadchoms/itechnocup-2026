import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/session";
import { chatService } from "@/services/chatService";

export async function POST(request: Request) {
  try {
    const sessionUser = await getSessionUser();
    if (!sessionUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { sellerId, buyerId, initialMessage } = body;

    const conversation = await chatService.startConversation(
      sessionUser.id,
      sellerId,
      buyerId,
      initialMessage
    );

    return NextResponse.json({ success: true, conversationId: conversation.id });
  } catch (error: any) {
    const status = error.message?.includes("Akses ditolak") ? 403 : error.message?.includes("wajib") ? 400 : 500;
    return NextResponse.json({ error: error.message }, { status });
  }
}
