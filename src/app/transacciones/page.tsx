"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { TransactionForm } from "@/components/TransactionForm";

type Transaction = {
  id: string;
  amount: number;
  type: string;
  date: string;
  description: string | null;
  category: { id: string; name: string; color: string | null };
};

const MONTHS = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

export default function TransaccionesPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [showForm, setShowForm] = useState(false);

  const fetchTransactions = () => {
    setLoading(true);
    fetch(`/api/transactions?month=${month}&year=${year}`)
      .then((r) => r.json())
      .then(setTransactions)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchTransactions();
  }, [month, year]);

  const formatCurrency = (n: number) =>
    new Intl.NumberFormat("es", {
      style: "currency",
      currency: "USD",
    }).format(n);

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("es", {
      day: "2-digit",
      month: "short",
    });

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar esta transacción?")) return;
    const res = await fetch(`/api/transactions/${id}`, { method: "DELETE" });
    if (res.ok) fetchTransactions();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold">Transacciones</h1>
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
          <button
            onClick={() => setShowForm(true)}
            className="ml-4 flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 text-white font-medium hover:bg-emerald-700"
          >
            <Plus className="w-4 h-4" />
            Añadir
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin w-8 h-8 border-2 border-emerald-600 border-t-transparent rounded-full" />
        </div>
      ) : transactions.length === 0 ? (
        <div className="p-8 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center text-slate-500 dark:text-slate-400">
          <p className="mb-4">No hay transacciones este mes.</p>
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 text-white font-medium hover:bg-emerald-700"
          >
            <Plus className="w-4 h-4" />
            Añadir primera transacción
          </button>
        </div>
      ) : (
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                  <th className="text-left py-3 px-4 font-medium">Fecha</th>
                  <th className="text-left py-3 px-4 font-medium">Categoría</th>
                  <th className="text-left py-3 px-4 font-medium">Descripción</th>
                  <th className="text-right py-3 px-4 font-medium">Monto</th>
                  <th className="w-20 py-3 px-4" />
                </tr>
              </thead>
              <tbody>
                {transactions.map((t) => (
                  <tr
                    key={t.id}
                    className="border-b border-slate-100 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/30"
                  >
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-400">
                      {formatDate(t.date)}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium"
                        style={{
                          backgroundColor: t.category.color
                            ? `${t.category.color}20`
                            : undefined,
                          color: t.category.color || undefined,
                        }}
                      >
                        {t.category.name}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-400">
                      {t.description || "—"}
                    </td>
                    <td
                      className={`py-3 px-4 text-right font-medium ${
                        t.type === "income"
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-rose-600 dark:text-rose-400"
                      }`}
                    >
                      {t.type === "income" ? "+" : "-"}
                      {formatCurrency(t.amount)}
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleDelete(t.id)}
                        className="p-2 rounded hover:bg-rose-50 dark:hover:bg-rose-900/20 text-rose-600 dark:text-rose-400"
                        aria-label="Eliminar"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showForm && (
        <TransactionForm
          onClose={() => setShowForm(false)}
          onSuccess={() => {
            setShowForm(false);
            fetchTransactions();
          }}
        />
      )}
    </div>
  );
}
