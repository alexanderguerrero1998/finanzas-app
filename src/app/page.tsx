"use client";

import { useState, useEffect } from "react";
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from "recharts";
import { AddTransactionButton } from "@/components/AddTransactionButton";

type Summary = {
  month: number;
  year: number;
  income: number;
  expense: number;
  balance: number;
  transactions: number;
  categoryBreakdown: { name: string; total: number; color: string | null }[];
};

const MONTHS = [
  "Ene", "Feb", "Mar", "Abr", "May", "Jun",
  "Jul", "Ago", "Sep", "Oct", "Nov", "Dic",
];

export default function DashboardPage() {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(true);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());

  useEffect(() => {
    setLoading(true);
    fetch(`/api/summary?month=${month}&year=${year}`)
      .then((r) => r.json())
      .then(setSummary)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [month, year]);

  const formatCurrency = (n: number) =>
    new Intl.NumberFormat("es", {
      style: "currency",
      currency: "USD",
    }).format(n);

  const pieData = summary?.categoryBreakdown.map((c, i) => ({
    name: c.name,
    value: c.total,
    color: c.color || `hsl(${(i * 60) % 360}, 70%, 50%)`,
  })) ?? [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold">Dashboard</h1>
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
            <ArrowLeft className="w-5 h-5" />
          </button>
          <span className="font-medium min-w-[120px] text-center">
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
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin w-8 h-8 border-2 border-emerald-600 border-t-transparent rounded-full" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 mb-1">
                <TrendingUp className="w-5 h-5" />
                <span className="text-sm font-medium">Ingresos</span>
              </div>
              <p className="text-xl font-bold">
                {summary ? formatCurrency(summary.income) : "—"}
              </p>
            </div>
            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 mb-1">
                <TrendingDown className="w-5 h-5" />
                <span className="text-sm font-medium">Gastos</span>
              </div>
              <p className="text-xl font-bold">
                {summary ? formatCurrency(summary.expense) : "—"}
              </p>
            </div>
            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 mb-1">
                <Wallet className="w-5 h-5" />
                <span className="text-sm font-medium">Balance</span>
              </div>
              <p
                className={`text-xl font-bold ${
                  summary && summary.balance >= 0
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-rose-600 dark:text-rose-400"
                }`}
              >
                {summary ? formatCurrency(summary.balance) : "—"}
              </p>
            </div>
          </div>

          {pieData.length > 0 && (
            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <h2 className="text-lg font-semibold mb-4">
                Gastos por categoría
              </h2>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={2}
                      dataKey="value"
                      nameKey="name"
                      label={({ name, percent }) =>
                        `${name} ${((percent ?? 0) * 100).toFixed(0)}%`
                      }
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={index} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: number | undefined) =>
                        formatCurrency(value ?? 0)
                      }
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {summary?.transactions === 0 && (
            <div className="p-8 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center text-slate-500 dark:text-slate-400">
              <p className="mb-2">No hay transacciones este mes.</p>
              <p className="text-sm">Usa el botón + para añadir tu primera transacción.</p>
            </div>
          )}
        </>
      )}

      <AddTransactionButton />
    </div>
  );
}
