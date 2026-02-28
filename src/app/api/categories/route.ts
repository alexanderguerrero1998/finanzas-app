import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type"); // "income" | "expense"

    const where = type ? { type } : {};
    const categories = await prisma.category.findMany({
      where,
      orderBy: { name: "asc" },
    });
    return NextResponse.json(categories);
  } catch (error) {
    console.error("GET /api/categories:", error);
    return NextResponse.json(
      { error: "Error al obtener categorías" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, icon, color, type } = body;

    if (!name || !type) {
      return NextResponse.json(
        { error: "Nombre y tipo son requeridos" },
        { status: 400 }
      );
    }

    const category = await prisma.category.create({
      data: {
        name,
        icon: icon ?? null,
        color: color ?? null,
        type,
      },
    });
    return NextResponse.json(category);
  } catch (error) {
    console.error("POST /api/categories:", error);
    return NextResponse.json(
      { error: "Error al crear categoría" },
      { status: 500 }
    );
  }
}
