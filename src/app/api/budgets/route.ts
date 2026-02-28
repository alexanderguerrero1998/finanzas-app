import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const month = searchParams.get("month");
    const year = searchParams.get("year");

    if (!month || !year) {
      return NextResponse.json(
        { error: "Mes y año son requeridos" },
        { status: 400 }
      );
    }

    const budgets = await prisma.budget.findMany({
      where: {
        month: parseInt(month),
        year: parseInt(year),
      },
      include: { category: true },
    });
    return NextResponse.json(budgets);
  } catch (error) {
    console.error("GET /api/budgets:", error);
    return NextResponse.json(
      { error: "Error al obtener presupuestos" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { categoryId, month, year, limitAmount } = body;

    if (!categoryId || !month || !year || limitAmount === undefined) {
      return NextResponse.json(
        { error: "Categoría, mes, año y límite son requeridos" },
        { status: 400 }
      );
    }

    const budget = await prisma.budget.upsert({
      where: {
        categoryId_month_year: {
          categoryId,
          month: parseInt(month),
          year: parseInt(year),
        },
      },
      update: { limitAmount: parseFloat(limitAmount) },
      create: {
        categoryId,
        month: parseInt(month),
        year: parseInt(year),
        limitAmount: parseFloat(limitAmount),
      },
      include: { category: true },
    });
    return NextResponse.json(budget);
  } catch (error) {
    console.error("POST /api/budgets:", error);
    return NextResponse.json(
      { error: "Error al crear/actualizar presupuesto" },
      { status: 500 }
    );
  }
}
