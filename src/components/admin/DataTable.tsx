"use client";

import { Fragment } from "react";
import { cn } from "@/lib/cn";

export type Column<T> = {
  key: string;
  header: string;
  className?: string;
  render: (row: T) => React.ReactNode;
  mobileLabel?: string;
};

type Props<T> = {
  rows: T[];
  columns: Column<T>[];
  rowKey: (row: T) => string;
  actions?: (row: T) => React.ReactNode;
  emptyState?: React.ReactNode;
};

export function DataTable<T>({ rows, columns, rowKey, actions, emptyState }: Props<T>) {
  if (rows.length === 0 && emptyState) return <>{emptyState}</>;

  return (
    <>
      {/* Desktop / tablet */}
      <div className="hidden overflow-x-auto rounded-card border border-ink-200 bg-white md:block">
        <table className="min-w-full text-left text-[12.5px]">
          <thead>
            <tr className="border-b border-ink-200 bg-ink-50/60 text-[10.5px] font-bold uppercase tracking-[0.12em] text-ink-500">
              {columns.map((c) => (
                <th key={c.key} className={cn("px-4 py-3 font-bold", c.className)}>
                  {c.header}
                </th>
              ))}
              {actions && <th className="px-4 py-3 text-right">Ações</th>}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={rowKey(row)} className="border-b border-ink-100 last:border-0 hover:bg-ink-50/40">
                {columns.map((c) => (
                  <td key={c.key} className={cn("px-4 py-3 align-middle text-ink-900", c.className)}>
                    {c.render(row)}
                  </td>
                ))}
                {actions && (
                  <td className="px-4 py-3 align-middle text-right">
                    <div className="flex items-center justify-end gap-1.5">{actions(row)}</div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile */}
      <div className="space-y-3 md:hidden">
        {rows.map((row) => (
          <div key={rowKey(row)} className="rounded-card border border-ink-200 bg-white p-4">
            <dl className="space-y-2">
              {columns.map((c) => (
                <Fragment key={c.key}>
                  <div className="flex items-start justify-between gap-3 text-[12.5px]">
                    <dt className="text-[10.5px] font-bold uppercase tracking-[0.12em] text-ink-500">
                      {c.mobileLabel ?? c.header}
                    </dt>
                    <dd className="max-w-[60%] text-right text-ink-900">{c.render(row)}</dd>
                  </div>
                </Fragment>
              ))}
            </dl>
            {actions && (
              <div className="mt-3 flex flex-wrap items-center justify-end gap-1.5 border-t border-ink-100 pt-3">
                {actions(row)}
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
}

// Action buttons compartilhados
export function TableButton({
  children,
  tone = "ghost",
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { tone?: "ghost" | "primary" | "success" | "danger" }) {
  const styles: Record<NonNullable<typeof tone>, string> = {
    ghost: "border-ink-200 bg-white text-ink-700 hover:border-ink-400 hover:bg-ink-50",
    primary: "border-ink-900 bg-ink-900 text-white hover:bg-ink-800",
    success: "border-green-600 bg-green-600 text-white hover:bg-green-700",
    danger: "border-red-200 bg-white text-red-600 hover:border-red-400 hover:bg-red-50",
  };
  return (
    <button
      type="button"
      {...rest}
      className={cn(
        "inline-flex h-8 items-center justify-center gap-1.5 rounded-btn border px-2.5 text-[11.5px] font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50",
        styles[tone],
        rest.className,
      )}
    >
      {children}
    </button>
  );
}
