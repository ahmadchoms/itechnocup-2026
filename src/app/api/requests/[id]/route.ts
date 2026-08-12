import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type RouteParams = { params: Promise<{ id: string }> };

/** PATCH /api/requests/[id] — Edit request */
export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();

    const req = await prisma.wasteRequest.findUnique({ where: { id } });
    if (!req) {
      return NextResponse.json({ error: "Request tidak ditemukan" }, { status: 404 });
    }

    const updated = await prisma.wasteRequest.update({
      where: { id },
      data: {
        title: body.title ?? req.title,
        categoryId: body.categoryId ?? req.categoryId,
        description: body.description ?? req.description,
        quantityWanted: body.quantityWanted !== undefined
          ? (body.quantityWanted ? parseInt(body.quantityWanted) : null)
          : req.quantityWanted,
        unit: body.unit ?? req.unit,
        offeredPrice: body.offeredPrice !== undefined
          ? parseFloat(body.offeredPrice)
          : req.offeredPrice,
        address: body.address ?? req.address,
      },
      include: { category: true, buyer: true },
    });

    return NextResponse.json({ success: true, request: updated });
  } catch (error: any) {
    console.error("[PATCH /api/requests/[id]]", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/** DELETE /api/requests/[id] — Hapus request (soft delete) */
export async function DELETE(_request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;

    const req = await prisma.wasteRequest.findUnique({ where: { id } });
    if (!req) {
      return NextResponse.json({ error: "Request tidak ditemukan" }, { status: 404 });
    }

    await prisma.wasteRequest.update({
      where: { id },
      data: { status: "dihapus" },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("[DELETE /api/requests/[id]]", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
