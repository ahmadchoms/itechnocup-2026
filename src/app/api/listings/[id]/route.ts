import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type RouteParams = { params: Promise<{ id: string }> };

/** PATCH /api/listings/[id] — Edit listing */
export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();

    const listing = await prisma.listing.findUnique({ where: { id } });
    if (!listing) {
      return NextResponse.json({ error: "Listing tidak ditemukan" }, { status: 404 });
    }

    const updated = await prisma.listing.update({
      where: { id },
      data: {
        title: body.title ?? listing.title,
        categoryId: body.categoryId ?? listing.categoryId,
        estimatedWeightKg: body.estimatedWeightKg !== undefined
          ? (body.estimatedWeightKg ? parseFloat(body.estimatedWeightKg) : null)
          : listing.estimatedWeightKg,
        quantity: body.quantity !== undefined
          ? (body.quantity ? parseInt(body.quantity) : null)
          : listing.quantity,
        unit: body.unit ?? listing.unit,
        condition: body.condition ?? listing.condition,
        description: body.description ?? listing.description,
        estimatedPrice: body.estimatedPrice !== undefined
          ? (body.estimatedPrice ? parseFloat(body.estimatedPrice) : null)
          : listing.estimatedPrice,
        address: body.address ?? listing.address,
        latitude: body.latitude !== undefined
          ? (body.latitude ? parseFloat(body.latitude) : null)
          : listing.latitude,
        longitude: body.longitude !== undefined
          ? (body.longitude ? parseFloat(body.longitude) : null)
          : listing.longitude,
      },
      include: { category: true, seller: true },
    });

    return NextResponse.json({ success: true, listing: updated });
  } catch (error: any) {
    console.error("[PATCH /api/listings/[id]]", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/** DELETE /api/listings/[id] — Hapus (soft delete: status → dihapus) */
export async function DELETE(_request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;

    const listing = await prisma.listing.findUnique({ where: { id } });
    if (!listing) {
      return NextResponse.json({ error: "Listing tidak ditemukan" }, { status: 404 });
    }

    await prisma.listing.update({
      where: { id },
      data: { status: "dihapus" },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("[DELETE /api/listings/[id]]", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
