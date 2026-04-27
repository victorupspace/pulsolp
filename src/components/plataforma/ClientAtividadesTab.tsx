"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  CircleDot,
  FileSpreadsheet,
  FileText,
  ListChecks,
  RefreshCcw,
  Sparkles,
  StickyNote,
  type LucideIcon,
} from "lucide-react";
import { EmptyState } from "@/components/admin/EmptyState";
import { SelectFilter } from "@/components/admin/Filters";
import { cn } from "@/lib/cn";
import { EASE } from "@/lib/motion";
import { formatDateTime } from "@/lib/plataforma/format";
import type { ClientActivity, ClientActivityKind } from "@/lib/plataforma/types";

const KIND_LABEL: Record<ClientActivityKind, string> = {
  criacao: "Criação",
  status: "Status",
  nota: "Nota",
  simulacao: "Simulação",
  proposta: "Proposta",
  documento: "Documento",
  tarefa: "Tarefa",
};

const KIND_ICON: Record<ClientActivityKind, LucideIcon> = {
  criacao: Sparkles,
  status: RefreshCcw,
  nota: StickyNote,
  simulacao: CircleDot,
  proposta: FileSpreadsheet,
  documento: FileText,
  tarefa: ListChecks,
};

const KIND_OPTIONS = [
  { value: "all", label: "Todas" },
  ...Object.entries(KIND_LABEL).map(([value, label]) => ({ value, label })),
];

export function ClientAtividadesTab({ activities }: { activities: ClientActivity[] }) {
  const [kind, setKind] = useState<string>("all");

  const filtered = useMemo(
    () => activities.filter((a) => (kind === "all" ? true : a.kind === kind)),
    [activities, kind],
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: EASE }}
      className="space-y-4"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SelectFilter label="Ação" value={kind} onChange={setKind} options={KIND_OPTIONS} />
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="Sem atividades para esse filtro"
          description="Conforme você simular, propor e atualizar status, o histórico aparece aqui."
        />
      ) : (
        <ol className="relative space-y-0 rounded-card border border-ink-200 bg-white">
          {filtered.map((evt, i) => {
            const Icon = KIND_ICON[evt.kind];
            return (
              <li
                key={evt.id}
                className={cn(
                  "relative flex items-start gap-3 px-4 py-3.5 md:px-5",
                  i < filtered.length - 1 && "border-b border-ink-100",
                )}
              >
                <span className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-orange/10 text-brand-orange">
                  <Icon className="h-3.5 w-3.5" strokeWidth={2.2} />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <p className="text-[13px] font-semibold text-ink-900">{evt.title}</p>
                    <span className="shrink-0 text-[11px] text-ink-400">{formatDateTime(evt.at)}</span>
                  </div>
                  {evt.body && (
                    <p className="mt-0.5 text-[12px] leading-[1.5] text-ink-600">{evt.body}</p>
                  )}
                  <p className="mt-0.5 text-[10.5px] font-bold uppercase tracking-[0.12em] text-ink-400">
                    {KIND_LABEL[evt.kind]} · {evt.by}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>
      )}
    </motion.div>
  );
}
