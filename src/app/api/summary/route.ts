import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const month = searchParams.get("month");
    const year = searchParams.get("year");

    const now = new Date();
    const m = month ? parseInt(month) : now.getMonth() + 1;
    const y = year ? parseInt(year) : now.getFullYear();

    const startDate = new Date(y, m - 1, 1);
    const endDate = new Date(y, m, 0, 23, 59, 59);

    const transactions = await prisma.transaction.findMany({
      where: {
        date: { gte: startDate, lte: endDate },
      },
      include: { category: true },
    });

    const income = transactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);
    const expense = transactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);
    const balance = income - expense;

    // By category for expense
    const byCategory = transactions
      .filter((t) => t.type === "expense")
      .reduce(
        (acc, t) => {
          const key = t.category.name;
          if (!acc[key]) acc[key] = { total: 0, color: t.category.color };
          acc[key].total += t.amount;
          return acc;
        },
        {} as Record<string, { total: number; color: string | null }>
      );

    const categoryBreakdown = Object.entries(byCategory).map(
      ([name, data]) => ({
        name,
        total: data.total,
        color: data.color,
      })
    );

    return NextResponse.json({
      month: m,
      year: y,
      income,
      expense,
      balance,
      transactions: transactions.length,
      categoryBreakdown,
    });
  } catch (error) {
    console.error("GET /api/summary:", error);
    return NextResponse.json(
      { error: "Error al obtener resumen" },
      { status: 500 }
    );
  }
}
