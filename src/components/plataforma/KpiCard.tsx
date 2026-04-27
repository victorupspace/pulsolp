"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/cn";
import { EASE } from "@/lib/motion";

type Props = {
  label: string;
  value: React.ReactNode;
  hint?: string;
  href?: string;
  highlight?: boolean;
  icon?: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
    icon?: React.ReactNode;
  };
  delay?: number;
};

export function KpiCard({ label, value, hint, href, highlight, icon, action, delay = 0 }: Props) {
  const Wrapper: React.ElementType = href && !action ? Link : "div";
  const wrapperProps = href && !action ? { href } : {};

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay, ease: EASE }}
    >
      <Wrapper
        {...wrapperProps}
        className={cn(
          "group relative flex h-full flex-col justify-between rounded-card border bg-white p-4 transition-all duration-200 md:p-5",
          href && !action
            ? "hover:-translate-y-0.5 hover:border-ink-400 hover:shadow-[0_18px_40px_-22px_rgba(17,17,17,0.25)]"
            : "",
          highlight ? "border-brand-orange/40 ring-1 ring-inset ring-brand-orange/15" : "border-ink-200",
        )}
      >
        <div className="flex items-start justify-between gap-2">
          <p className="text-[10.5px] font-bold uppercase tracking-[0.14em] text-ink-500">{label}</p>
          {icon && (
            <span
              className={cn(
                "inline-flex h-7 w-7 items-center justify-center rounded-full",
                highlight ? "bg-brand-orange/10 text-brand-orange" : "bg-ink-100 text-ink-600",
              )}
            >
              {icon}
            </span>
          )}
        </div>

        <p
          className={cn(
            "mt-3 text-[24px] font-bold leading-[1] tracking-[-0.025em] md:text-[28px]",
            highlight ? "text-brand-orange" : "text-ink-900",
          )}
        >
          {value}
        </p>

        <div className="mt-3 flex items-center justify-between gap-2">
          {hint && <p className="text-[11.5px] text-ink-500">{hint}</p>}
          {href && !action && (
            <ArrowUpRight
              className="ml-auto h-3.5 w-3.5 text-ink-400 transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-ink-900"
              strokeWidth={2.2}
            />
          )}
        </div>

        {action && (
          <button
            type="button"
            onClick={action.onClick}
            className="mt-4 inline-flex h-9 w-full items-center justify-center gap-1.5 rounded-btn bg-brand-orange px-3 text-[12px] font-semibold text-white transition-colors hover:bg-brand-orangeHover"
          >
            {action.icon}
            {action.label}
          </button>
        )}
      </Wrapper>
    </motion.div>
  );
}
