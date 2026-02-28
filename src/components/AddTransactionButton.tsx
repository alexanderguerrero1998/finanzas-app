"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { TransactionForm } from "./TransactionForm";

export function AddTransactionButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-20 right-4 md:bottom-6 md:right-6 flex items-center justify-center w-14 h-14 rounded-full bg-emerald-600 text-white shadow-lg hover:bg-emerald-700 transition-colors z-50"
        aria-label="Añadir transacción"
      >
        <Plus className="w-6 h-6" />
      </button>
      {open && (
        <TransactionForm
          onClose={() => setOpen(false)}
          onSuccess={() => setOpen(false)}
        />
      )}
    </>
  );
}
