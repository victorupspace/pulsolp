import { cn } from "@/lib/cn";
import { CLIENT_LIFECYCLE_LABEL } from "@/lib/plataforma/format";
import type { ClientLifecycleStatus } from "@/lib/plataforma/types";

const TONE: Record<ClientLifecycleStatus, string> = {
  novo: "bg-brand-orange/10 text-brand-orange ring-brand-orange/30",
  em_negociacao: "bg-amber-50 text-amber-700 ring-amber-200",
  migrando: "bg-blue-50 text-blue-700 ring-blue-200",
  ativo: "bg-green-50 text-green-700 ring-green-200",
  perdido: "bg-ink-100 text-ink-500 ring-ink-200",
};

export function ClientLifecycleBadge({ status }: { status: ClientLifecycleStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10.5px] font-bold uppercase tracking-[0.08em] ring-1 ring-inset",
        TONE[status],
      )}
    >
      {CLIENT_LIFECYCLE_LABEL[status]}
    </span>
  );
}
