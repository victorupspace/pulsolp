import { cn } from "@/lib/cn";
import { CLIENT_LIFECYCLE_LABEL } from "@/lib/plataforma/format";
import type { ClientLifecycleStatus } from "@/lib/plataforma/types";

const TONE: Record<ClientLifecycleStatus, { wrap: string; dot: string }> = {
  novo: {
    wrap: "bg-brand-orange/8 text-brand-orange ring-brand-orange/25",
    dot: "bg-brand-orange",
  },
  qualificando: {
    wrap: "bg-amber-50 text-amber-700 ring-amber-200",
    dot: "bg-amber-500",
  },
  proposta_enviada: {
    wrap: "bg-blue-50 text-blue-700 ring-blue-200",
    dot: "bg-blue-500",
  },
  em_negociacao: {
    wrap: "bg-amber-50 text-amber-700 ring-amber-200",
    dot: "bg-amber-500",
  },
  assinado: {
    wrap: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    dot: "bg-emerald-500",
  },
  migrando: {
    wrap: "bg-blue-50 text-blue-700 ring-blue-200",
    dot: "bg-blue-500",
  },
  ativo: {
    wrap: "bg-green-50 text-green-700 ring-green-200",
    dot: "bg-green-500",
  },
  inativo: {
    wrap: "bg-ink-100 text-ink-500 ring-ink-200",
    dot: "bg-ink-400",
  },
};

export function ClientLifecycleBadge({ status }: { status: ClientLifecycleStatus }) {
  const tone = TONE[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10.5px] font-bold uppercase tracking-[0.08em] ring-1 ring-inset",
        tone.wrap,
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", tone.dot)} />
      {CLIENT_LIFECYCLE_LABEL[status]}
    </span>
  );
}
