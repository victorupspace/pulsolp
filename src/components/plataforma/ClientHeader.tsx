"use client";

import Link from "next/link";
import { Calculator, ChevronLeft, FileText, ListTodo, Pencil, StickyNote } from "lucide-react";
import { ClientLifecycleBadge } from "./ClientLifecycleBadge";
import { CLIENT_PROFILE_LABEL, formatDocument } from "@/lib/plataforma/format";
import type { Client, ClientProfile } from "@/lib/plataforma/types";

type Action = {
  label: string;
  onClick: () => void;
  icon: React.ReactNode;
  primary?: boolean;
};

export function ClientHeader({
  client,
  profile,
  onEdit,
  onAddNote,
  onAddTask,
  onSimulate,
}: {
  client: Client;
  profile: ClientProfile;
  onEdit: () => void;
  onAddNote: () => void;
  onAddTask: () => void;
  onSimulate: () => void;
}) {
  const actions: Action[] = [
    {
      label: "Nova simulação",
      onClick: onSimulate,
      icon: <Calculator className="h-3.5 w-3.5" strokeWidth={2.4} />,
      primary: true,
    },
    {
      label: "Editar",
      onClick: onEdit,
      icon: <Pencil className="h-3.5 w-3.5" strokeWidth={2.2} />,
    },
    {
      label: "Tarefa",
      onClick: onAddTask,
      icon: <ListTodo className="h-3.5 w-3.5" strokeWidth={2.2} />,
    },
    {
      label: "Nota",
      onClick: onAddNote,
      icon: <StickyNote className="h-3.5 w-3.5" strokeWidth={2.2} />,
    },
  ];

  return (
    <div className="sticky top-14 z-20 -mx-3.5 mb-1 border-b border-ink-200 bg-white/85 px-3.5 py-4 backdrop-blur-sm md:-mx-8 md:px-8 md:py-5">
      <Link
        href="/plataforma/clientes"
        className="inline-flex items-center gap-1.5 text-[11.5px] font-semibold text-ink-500 transition-colors hover:text-ink-900"
      >
        <ChevronLeft className="h-3.5 w-3.5" strokeWidth={2.4} />
        Voltar para clientes
      </Link>

      <div className="mt-2 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <ClientLifecycleBadge status={profile.lifecycle} />
            {profile.profileTag && (
              <span className="inline-flex items-center gap-1 rounded-full bg-ink-100 px-2 py-0.5 text-[10.5px] font-bold uppercase tracking-[0.08em] text-ink-700">
                <FileText className="h-3 w-3" strokeWidth={2.4} />
                {CLIENT_PROFILE_LABEL[profile.profileTag]}
              </span>
            )}
          </div>
          <h1 className="mt-2 truncate text-[20px] font-bold leading-[1.2] tracking-[-0.015em] text-ink-900 md:text-[24px]">
            {profile.legalName}
          </h1>
          <p className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[12.5px] text-ink-500">
            {profile.tradeName && <span className="truncate">{profile.tradeName}</span>}
            <span className="font-mono text-[11.5px]">{formatDocument(profile.document)}</span>
            <span className="truncate">{client.email}</span>
            <span>{client.phone}</span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {actions.map((a) => (
            <button
              key={a.label}
              type="button"
              onClick={a.onClick}
              className={
                a.primary
                  ? "inline-flex h-9 items-center gap-1.5 rounded-btn bg-brand-orange px-3 text-[12.5px] font-semibold text-white transition-colors hover:bg-brand-orangeHover"
                  : "inline-flex h-9 items-center gap-1.5 rounded-btn border border-ink-200 bg-white px-3 text-[12.5px] font-semibold text-ink-700 transition-colors hover:border-ink-400 hover:bg-ink-50"
              }
            >
              {a.icon}
              {a.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
