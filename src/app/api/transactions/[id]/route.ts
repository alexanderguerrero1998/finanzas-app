import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const transaction = await prisma.transaction.findUnique({
      where: { id },
      include: { category: true },
    });
    if (!transaction) {
      return NextResponse.json({ error: "No encontrado" }, { status: 404 });
    }
    return NextResponse.json(transaction);
  } catch (error) {
    console.error("GET /api/transactions/[id]:", error);
    return NextResponse.json(
      { error: "Error al obtener transacción" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { amount, type, categoryId, date, description } = body;

    const transaction = await prisma.transaction.update({
      where: { id },
      data: {
        ...(amount !== undefined && { amount: parseFloat(amount) }),
        ...(type && { type }),
        ...(categoryId && { categoryId }),
        ...(date && { date: new Date(date) }),
        ...(description !== undefined && { description }),
      },
      include: { category: true },
    });
    return NextResponse.json(transaction);
  } catch (error) {
    console.error("PUT /api/transactions/[id]:", error);
    return NextResponse.json(
      { error: "Error al actualizar transacción" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.transaction.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/transactions/[id]:", error);
    return NextResponse.json(
      { error: "Error al eliminar transacción" },
      { status: 500 }
    );
  }
}
