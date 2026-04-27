"use client";

import { motion } from "framer-motion";
import { AlertTriangle, Check, Clock, Info } from "lucide-react";
import { cn } from "@/lib/cn";
import { EASE } from "@/lib/motion";
import {
  CLIENT_MIGRATION_LABEL,
  formatCurrency,
  formatDateLong,
  formatKw,
  formatKwh,
} from "@/lib/plataforma/format";
import type { Client, ClientMigrationStage, ClientProfile } from "@/lib/plataforma/types";

const STAGES: ClientMigrationStage[] = ["denuncia", "contratos", "smf", "ccee"];

export function ClientResumoTab({ client, profile }: { client: Client; profile: ClientProfile }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: EASE }}
      className="space-y-5"
    >
      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Stat
          label="Economia mensal"
          value={
            client.status === "ativo" && client.monthlySavings
              ? formatCurrency(client.monthlySavings)
              : "—"
          }
          hint={client.status === "ativo" ? "Baseado nas faturas processadas" : "Disponível após ativação"}
          highlight={client.status === "ativo"}
        />
        <Stat
          label="Consumo médio"
          value={formatKwh(profile.averageConsumptionKwh)}
          hint="Soma das UCs ativas"
        />
        <Stat
          label="Unidades consumidoras"
          value={profile.units.length.toString()}
          hint={
            profile.units.length === 1
              ? "1 UC vinculada"
              : `${profile.units.length} UCs vinculadas`
          }
        />
        <Stat
          label="Última interação"
          value={profile.lastInteractionAt ? formatDateLong(profile.lastInteractionAt) : "—"}
          hint="Comunicações e atualizações"
        />
      </section>

      <section className="rounded-card border border-ink-200 bg-white">
        <header className="flex items-center justify-between border-b border-ink-200 px-4 py-3 md:px-5">
          <div>
            <h2 className="text-[14px] font-bold text-ink-900">Timeline de migração</h2>
            <p className="text-[12px] text-ink-500">
              Acompanhe as etapas operacionais até o cliente entrar em pleno operação no ML.
            </p>
          </div>
        </header>
        <ol className="divide-y divide-ink-100">
          {STAGES.map((stage, i) => {
            const status = profile.migration[stage];
            return (
              <li
                key={stage}
                className="flex items-start gap-3 px-4 py-3.5 md:px-5"
              >
                <StageBullet status={status} index={i + 1} />
                <div className="flex-1">
                  <p className="text-[13px] font-semibold text-ink-900">
                    {CLIENT_MIGRATION_LABEL[stage]}
                  </p>
                  <p className="text-[11.5px] text-ink-500">
                    {status === "concluido"
                      ? "Etapa concluída"
                      : status === "em_andamento"
                        ? "Em andamento"
                        : "Pendente"}
                  </p>
                </div>
                <span
                  className={cn(
                    "shrink-0 text-[10.5px] font-bold uppercase tracking-[0.1em]",
                    status === "concluido"
                      ? "text-green-600"
                      : status === "em_andamento"
                        ? "text-amber-600"
                        : "text-ink-400",
                  )}
                >
                  {status === "concluido"
                    ? "Ok"
                    : status === "em_andamento"
                      ? "Agora"
                      : "Aguarda"}
                </span>
              </li>
            );
          })}
        </ol>
      </section>

      <section className="rounded-card border border-ink-200 bg-white">
        <header className="flex flex-col gap-1 border-b border-ink-200 px-4 py-3 md:px-5">
          <h2 className="text-[14px] font-bold text-ink-900">Dados técnicos</h2>
          <p className="text-[12px] text-ink-500">
            Visão consolidada por UC. Para detalhes operacionais, abra a unidade.
          </p>
        </header>
        {profile.units.length === 0 ? (
          <div className="px-4 py-8 text-center text-[12.5px] text-ink-500 md:px-5">
            Nenhuma UC cadastrada ainda.
          </div>
        ) : (
          <ul className="divide-y divide-ink-100">
            {profile.units.map((u) => (
              <li key={u.id} className="px-4 py-4 md:px-5">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <p className="text-[13px] font-semibold text-ink-900">{u.ucCode}</p>
                  <div className="flex items-center gap-1.5">
                    {!u.smfReady && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[10.5px] font-bold uppercase tracking-[0.08em] text-amber-700 ring-1 ring-inset ring-amber-200">
                        <AlertTriangle className="h-3 w-3" strokeWidth={2.4} />
                        SMF pendente
                      </span>
                    )}
                    {u.contractEndAt && new Date(u.contractEndAt).getTime() - Date.now() < 90 * 86_400_000 && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2 py-0.5 text-[10.5px] font-bold uppercase tracking-[0.08em] text-red-700 ring-1 ring-inset ring-red-200">
                        <Clock className="h-3 w-3" strokeWidth={2.4} />
                        Vence em breve
                      </span>
                    )}
                  </div>
                </div>
                <dl className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1.5 text-[12px] sm:grid-cols-3 lg:grid-cols-7">
                  <Field label="Distribuidora" value={u.distribuidora} />
                  <Field
                    label="Localização"
                    value={
                      u.locationCity && u.locationState
                        ? `${u.locationCity}/${u.locationState}`
                        : u.locationState ?? "—"
                    }
                  />
                  <Field label="Submercado" value={u.submercado} />
                  <Field label="Tensão" value={u.tensao} />
                  <Field label="Demanda" value={formatKw(u.contractedDemandKw)} />
                  <Field label="Tarifa" value={u.tariff ?? "—"} />
                  <Field
                    label="Consumo médio"
                    value={formatKwh(u.averageConsumptionKwh)}
                  />
                </dl>
              </li>
            ))}
          </ul>
        )}
      </section>
    </motion.div>
  );
}

function Stat({
  label,
  value,
  hint,
  highlight,
}: {
  label: string;
  value: string;
  hint: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-card border bg-white p-4 md:p-5",
        highlight ? "border-brand-orange/40 ring-1 ring-inset ring-brand-orange/15" : "border-ink-200",
      )}
    >
      <p className="text-[10.5px] font-bold uppercase tracking-[0.14em] text-ink-500">{label}</p>
      <p
        className={cn(
          "mt-3 text-[22px] font-bold leading-[1] tracking-[-0.025em] md:text-[26px]",
          highlight ? "text-brand-orange" : "text-ink-900",
        )}
      >
        {value}
      </p>
      <p className="mt-2 text-[11.5px] text-ink-500">{hint}</p>
    </div>
  );
}

function StageBullet({ status, index }: { status: "pendente" | "em_andamento" | "concluido"; index: number }) {
  const tone =
    status === "concluido"
      ? "bg-green-600 text-white"
      : status === "em_andamento"
        ? "bg-amber-100 text-amber-700 ring-1 ring-inset ring-amber-300"
        : "bg-ink-100 text-ink-500";
  const Icon = status === "concluido" ? Check : status === "em_andamento" ? Clock : Info;
  return (
    <span
      className={cn(
        "mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-bold",
        tone,
      )}
    >
      {status === "pendente" ? index : <Icon className="h-3.5 w-3.5" strokeWidth={2.4} />}
    </span>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[10px] font-bold uppercase tracking-[0.12em] text-ink-500">{label}</dt>
      <dd className="mt-0.5 text-[12.5px] font-medium text-ink-900">{value}</dd>
    </div>
  );
}
