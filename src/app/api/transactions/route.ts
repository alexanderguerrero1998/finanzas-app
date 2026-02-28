import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const month = searchParams.get("month");
    const year = searchParams.get("year");
    const type = searchParams.get("type");

    const where: Record<string, unknown> = {};

    if (month && year) {
      const startDate = new Date(parseInt(year), parseInt(month) - 1, 1);
      const endDate = new Date(parseInt(year), parseInt(month), 0, 23, 59, 59);
      where.date = {
        gte: startDate,
        lte: endDate,
      };
    }

    if (type) {
      where.type = type;
    }

    const transactions = await prisma.transaction.findMany({
      where,
      include: { category: true },
      orderBy: { date: "desc" },
    });
    return NextResponse.json(transactions);
  } catch (error) {
    console.error("GET /api/transactions:", error);
    return NextResponse.json(
      { error: "Error al obtener transacciones" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { amount, type, categoryId, date, description } = body;

    if (!amount || !type || !categoryId || !date) {
      return NextResponse.json(
        { error: "Monto, tipo, categoría y fecha son requeridos" },
        { status: 400 }
      );
    }

    const transaction = await prisma.transaction.create({
      data: {
        amount: parseFloat(amount),
        type,
        categoryId,
        date: new Date(date),
        description: description ?? null,
      },
      include: { category: true },
    });
    return NextResponse.json(transaction);
  } catch (error) {
    console.error("POST /api/transactions:", error);
    return NextResponse.json(
      { error: "Error al crear transacción" },
      { status: 500 }
    );
  }
}
