import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const url = process.env.DATABASE_URL;
if (!url) {
  throw new Error("DATABASE_URL is required. Add it to .env.local");
}
const adapter = new PrismaPg({ connectionString: url });
const prisma = new PrismaClient({ adapter });

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

async function main() {
  const existing = await prisma.category.count();
  if (existing === 0) {
    await prisma.category.createMany({
      data: defaultCategories,
    });
    console.log("Seed completed. Created", defaultCategories.length, "categories.");
  } else {
    console.log("Categories already exist. Skipping seed.");
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
