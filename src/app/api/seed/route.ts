import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const defaultCategories = [
  { name: "Salario", icon: "briefcase", color: "#22c55e", type: "income" },
  { name: "Freelance", icon: "laptop", color: "#3b82f6", type: "income" },
  { name: "Inversiones", icon: "trending-up", color: "#8b5cf6", type: "income" },
  { name: "Otros ingresos", icon: "plus-circle", color: "#06b6d4", type: "income" },
  { name: "Comida", icon: "utensils", color: "#f59e0b", type: "expense" },
  { name: "Transporte", icon: "car", color: "#ef4444", type: "expense" },
  { name: "Vivienda", icon: "home", color: "#ec4899", type: "expense" },
  { name: "Ocio", icon: "film", color: "#a855f7", type: "expense" },
  { name: "Servicios", icon: "zap", color: "#6366f1", type: "expense" },
  { name: "Compras", icon: "shopping-cart", color: "#14b8a6", type: "expense" },
  { name: "Salud", icon: "heart", color: "#f43f5e", type: "expense" },
  { name: "Otros gastos", icon: "more-horizontal", color: "#64748b", type: "expense" },
];

async function runSeed() {
  try {
    const existing = await prisma.category.count();
    if (existing === 0) {
      await prisma.category.createMany({
        data: defaultCategories,
      });
      return NextResponse.json({
        success: true,
        message: `Categorías creadas: ${defaultCategories.length}`,
      });
    }
    return NextResponse.json({
      success: true,
      message: "Las categorías ya existen",
    });
  } catch (error) {
    console.error("Seed error:", error);
    return NextResponse.json(
      { error: "Error al crear categorías" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return runSeed();
}

export async function POST() {
  return runSeed();
}
