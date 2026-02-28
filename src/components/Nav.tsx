"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Wallet, PiggyBank } from "lucide-react";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/transacciones", label: "Transacciones", icon: Wallet },
  { href: "/presupuestos", label: "Presupuestos", icon: PiggyBank },
];

export function Nav() {
  const pathname = usePathname();

  const linkClass = (href: string) =>
    pathname === href
      ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
      : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-100";

  return (
    <>
      {/* Top nav - desktop only */}
      <nav className="hidden md:block border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex items-center justify-between h-14">
            <Link
              href="/"
              className="font-semibold text-lg text-slate-900 dark:text-slate-100"
            >
              Finanzas
            </Link>
            <div className="flex gap-1">
              {navItems.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${linkClass(
                    href
                  )}`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Bottom nav - mobile only */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 pb-[env(safe-area-inset-bottom)]">
        <div className="flex justify-around items-center h-16">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center justify-center flex-1 py-2 text-xs font-medium transition-colors min-w-0 ${linkClass(
                href
              )}`}
            >
              <Icon className="w-6 h-6 mb-1" />
              <span className="truncate">{label}</span>
            </Link>
          ))}
        </div>
      </nav>

      {/* Spacer for mobile - logo/title at top */}
      <div className="md:hidden flex items-center justify-center h-14 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <Link
          href="/"
          className="font-semibold text-lg text-slate-900 dark:text-slate-100"
        >
          Finanzas
        </Link>
      </div>
    </>
  );
}
