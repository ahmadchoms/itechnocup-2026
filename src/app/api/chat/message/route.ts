import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/session";
import { chatService } from "@/services/chatService";

export async function POST(request: Request) {
  try {
    const sessionUser = await getSessionUser();
    if (!sessionUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { conversationId, content } = await request.json();

    const message = await chatService.sendMessage(sessionUser.id, conversationId, content);
    return NextResponse.json(message);
  } catch (error: any) {
    const status = error.message?.includes("Akses ditolak") ? 403 : error.message?.includes("wajib diisi") ? 400 : 500;
    return NextResponse.json({ error: error.message }, { status });
  }
}
