"use client";

import { CheckCircle2, Clock, XCircle } from "lucide-react";
import { cn } from "@/lib/cn";
import { SUBSCRIPTION_LABEL } from "@/lib/plataforma/format";
import type { Subscription } from "@/lib/plataforma/types";

const STYLES = {
  ativo: {
    pill: "bg-green-50 text-green-700 ring-green-200",
    Icon: CheckCircle2,
  },
  trial: {
    pill: "bg-amber-50 text-amber-700 ring-amber-200",
    Icon: Clock,
  },
  expirado: {
    pill: "bg-red-50 text-red-700 ring-red-200",
    Icon: XCircle,
  },
};

export function SubscriptionBadge({ subscription }: { subscription: Subscription }) {
  const { pill, Icon } = STYLES[subscription.status];
  return (
    <span
      className={cn(
        "inline-flex h-8 items-center gap-1.5 rounded-full px-3 text-[11.5px] font-semibold ring-1 ring-inset",
        pill,
      )}
      title={subscription.plan}
    >
      <Icon className="h-3.5 w-3.5" strokeWidth={2.4} />
      <span className="hidden sm:inline">{SUBSCRIPTION_LABEL[subscription.status]}</span>
      <span className="sm:hidden">{subscription.status === "ativo" ? "Ativa" : subscription.status === "trial" ? "Trial" : "Expirada"}</span>
    </span>
  );
}
