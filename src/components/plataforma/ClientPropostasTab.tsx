"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Calculator, FileSpreadsheet, Send } from "lucide-react";
import { DataTable, TableButton, type Column } from "@/components/admin/DataTable";
import { EmptyState } from "@/components/admin/EmptyState";
import { SelectFilter } from "@/components/admin/Filters";
import { cn } from "@/lib/cn";
import { EASE } from "@/lib/motion";
import {
  PROPOSAL_STATUS_LABEL,
  formatCurrencyDetailed,
  formatDateLong,
  formatRelative,
} from "@/lib/plataforma/format";
import { usePlataformaStore } from "@/lib/plataforma/store";
import type { Proposal, ProposalStatus } from "@/lib/plataforma/types";

const STATUS_OPTIONS: { value: "all" | ProposalStatus; label: string }[] = [
  { value: "all", label: "Todos os status" },
  { value: "rascunho", label: "Rascunho" },
  { value: "enviada", label: "Enviada" },
  { value: "aceita", label: "Aceita" },
  { value: "recusada", label: "Recusada" },
];

const STATUS_TONE: Record<ProposalStatus, string> = {
  rascunho: "bg-ink-100 text-ink-600 ring-ink-200",
  enviada: "bg-amber-50 text-amber-700 ring-amber-200",
  aceita: "bg-green-50 text-green-700 ring-green-200",
  recusada: "bg-red-50 text-red-700 ring-red-200",
};

export function ClientPropostasTab({ clientId, onSimulate }: { clientId: string; onSimulate: () => void }) {
  const { proposals, updateProposal } = usePlataformaStore();
  const [status, setStatus] = useState<string>("all");

  const rows = useMemo(
    () =>
      proposals
        .filter((p) => p.clientId === clientId)
        .filter((p) => (status === "all" ? true : p.status === status))
        .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)),
    [proposals, clientId, status],
  );

  const columns: Column<Proposal>[] = [
    {
      key: "title",
      header: "Proposta",
      mobilePrimary: true,
      render: (p) => (
        <div className="min-w-0">
          <div className="flex items-start justify-between gap-2 md:block">
            <p className="truncate font-semibold text-ink-900">{p.title}</p>
            <span className="shrink-0 md:hidden">
              <StatusPill status={p.status} />
            </span>
          </div>
          <p className="truncate text-[11.5px] text-ink-500">
            Criada em {formatDateLong(p.createdAt)}
          </p>
        </div>
      ),
    },
    {
      key: "amount",
      header: "Volume",
      mobileLabel: "Volume",
      render: (p) => (
        <span className="text-[12.5px] font-semibold text-ink-900">
          {formatCurrencyDetailed(p.amount)}
        </span>
      ),
    },
    {
      key: "sent",
      header: "Enviada",
      mobileLabel: "Enviada",
      render: (p) => (
        <span className="text-[12px] text-ink-500">
          {p.sentAt ? formatRelative(p.sentAt) : "—"}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      hideOnMobile: true,
      render: (p) => <StatusPill status={p.status} />,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: EASE }}
      className="space-y-5"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SelectFilter label="Status" value={status} onChange={setStatus} options={STATUS_OPTIONS} />
        <button
          type="button"
          onClick={onSimulate}
          className="inline-flex h-10 items-center justify-center gap-1.5 rounded-btn bg-brand-orange px-3 text-[12.5px] font-semibold text-white transition-colors hover:bg-brand-orangeHover"
        >
          <Calculator className="h-3.5 w-3.5" strokeWidth={2.4} />
          Nova simulação
        </button>
      </div>

      <DataTable
        rows={rows}
        columns={columns}
        rowKey={(p) => p.id}
        emptyState={
          <EmptyState
            title="Nenhuma proposta por aqui"
            description="Comece pelo simulador para gerar a primeira proposta deste cliente."
            icon={<FileSpreadsheet className="h-5 w-5" strokeWidth={2.2} />}
          />
        }
        actions={(p) =>
          p.status === "rascunho" ? (
            <>
              <TableButton tone="primary" onClick={() => void updateProposal(p.id, { status: "enviada", sentAt: new Date().toISOString() })}>
                <Send className="h-3.5 w-3.5" strokeWidth={2.2} />
                Enviar
              </TableButton>
              <TableButton href={`/plataforma/propostas/${p.id}`}>Abrir</TableButton>
            </>
          ) : (
            <TableButton href={`/plataforma/propostas/${p.id}`}>Abrir</TableButton>
          )
        }
      />
    </motion.div>
  );
}

function StatusPill({ status }: { status: ProposalStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10.5px] font-bold uppercase tracking-[0.08em] ring-1 ring-inset",
        STATUS_TONE[status],
      )}
    >
      {PROPOSAL_STATUS_LABEL[status]}
    </span>
  );
}
