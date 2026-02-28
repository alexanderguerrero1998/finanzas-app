"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Budget = {
  id: string;
  categoryId: string;
  month: number;
  year: number;
  limitAmount: number;
  category: { id: string; name: string; color: string | null };
};

type Category = { id: string; name: string; type: string };

type Summary = {
  categoryBreakdown: { name: string; total: number }[];
};

const MONTHS = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

export default function PresupuestosPage() {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(true);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());

  const fetchData = () => {
    setLoading(true);
    Promise.all([
      fetch(`/api/budgets?month=${month}&year=${year}`).then((r) => r.json()),
      fetch("/api/categories?type=expense").then((r) => r.json()),
      fetch(`/api/summary?month=${month}&year=${year}`).then((r) => r.json()),
    ])
      .then(([budgetsData, categoriesData, summaryData]) => {
        setBudgets(budgetsData);
        setCategories(categoriesData);
        setSummary(summaryData);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, [month, year]);

  const formatCurrency = (n: number) =>
    new Intl.NumberFormat("es", {
      style: "currency",
      currency: "USD",
    }).format(n);

  const getSpent = (categoryName: string) =>
    summary?.categoryBreakdown.find((c) => c.name === categoryName)?.total ?? 0;

  const handleSaveBudget = async (
    categoryId: string,
    limitAmount: number
  ) => {
    const res = await fetch("/api/budgets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        categoryId,
        month,
        year,
        limitAmount,
      }),
    });
    if (res.ok) fetchData();
  };

  const expenseCategories = categories.filter((c) => c.type === "expense");

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold">Presupuestos</h1>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              if (month === 1) {
                setMonth(12);
                setYear((y) => y - 1);
              } else {
                setMonth((m) => m - 1);
              }
            }}
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="font-medium min-w-[140px] text-center">
            {MONTHS[month - 1]} {year}
          </span>
          <button
            onClick={() => {
              if (month === 12) {
                setMonth(1);
                setYear((y) => y + 1);
              } else {
                setMonth((m) => m + 1);
              }
            }}
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin w-8 h-8 border-2 border-emerald-600 border-t-transparent rounded-full" />
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-slate-600 dark:text-slate-400">
            Define límites mensuales por categoría. Los gastos reales se comparan
            con el presupuesto.
          </p>
          <div className="grid gap-4">
            {expenseCategories.map((cat) => {
              const budget = budgets.find((b) => b.categoryId === cat.id);
              const spent = getSpent(cat.name);
              const limit = budget?.limitAmount ?? 0;
              const percent = limit > 0 ? (spent / limit) * 100 : 0;
              const isOver = percent > 100;

              return (
                <BudgetRow
                  key={cat.id}
                  category={cat}
                  spent={spent}
                  limit={limit}
                  onSave={(limitAmount) =>
                    handleSaveBudget(cat.id, limitAmount)
                  }
                  formatCurrency={formatCurrency}
                  isOver={isOver}
                />
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function BudgetRow({
  category,
  spent,
  limit,
  onSave,
  formatCurrency,
  isOver,
}: {
  category: Category;
  spent: number;
  limit: number;
  onSave: (limit: number) => void;
  formatCurrency: (n: number) => string;
  isOver: boolean;
}) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(limit.toString());

  const handleSubmit = () => {
    const n = parseFloat(value);
    if (!isNaN(n) && n >= 0) {
      onSave(n);
      setEditing(false);
    }
  };

  const percent = limit > 0 ? (spent / limit) * 100 : 0;

  return (
    <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <span className="font-medium">{category.name}</span>
        {editing ? (
          <div className="flex gap-2">
            <input
              type="number"
              step="0.01"
              min="0"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="w-28 px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm"
            />
            <button
              onClick={handleSubmit}
              className="px-3 py-1 rounded bg-emerald-600 text-white text-sm hover:bg-emerald-700"
            >
              Guardar
            </button>
            <button
              onClick={() => {
                setEditing(false);
                setValue(limit.toString());
              }}
              className="px-3 py-1 rounded border border-slate-300 dark:border-slate-700 text-sm hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              Cancelar
            </button>
          </div>
        ) : (
          <button
            onClick={() => setEditing(true)}
            className="text-sm text-emerald-600 dark:text-emerald-400 hover:underline"
          >
            {limit > 0 ? `Límite: ${formatCurrency(limit)}` : "Definir límite"}
          </button>
        )}
      </div>
      <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400 mb-2">
        <span>Gastado: {formatCurrency(spent)}</span>
        {limit > 0 && (
          <span className={isOver ? "text-rose-600 dark:text-rose-400" : ""}>
            {percent.toFixed(0)}% del presupuesto
          </span>
        )}
      </div>
      {limit > 0 && (
        <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${
              isOver
                ? "bg-rose-500"
                : percent > 80
                  ? "bg-amber-500"
                  : "bg-emerald-500"
            }`}
            style={{ width: `${Math.min(percent, 100)}%` }}
          />
        </div>
      )}
    </div>
  );
}
