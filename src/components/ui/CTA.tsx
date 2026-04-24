"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/cn";

type CTAProps = {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: "primary" | "ghost";
  className?: string;
  icon?: boolean;
  type?: "button" | "submit";
};

export function CTA({
  children,
  href,
  onClick,
  variant = "primary",
  className,
  icon = true,
  type = "button",
}: CTAProps) {
  const base =
    "group relative inline-flex w-full items-center justify-center gap-2 rounded-btn border px-6 py-4 text-btn font-semibold uppercase tracking-[0.08em] transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform";

  const styles =
    variant === "primary"
      ? "border-brand-orange bg-brand-orange text-white hover:bg-brand-orangeHover hover:shadow-[0_10px_40px_-8px_rgba(230,81,0,0.55)]"
      : "border-white/20 bg-transparent text-white hover:bg-white/10";

  const content = (
    <>
      <span className="relative z-10">{children}</span>
      {icon && (
        <ArrowUpRight
          className="relative z-10 h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          strokeWidth={2.5}
        />
      )}
      {variant === "primary" && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-btn bg-gradient-to-r from-white/0 via-white/20 to-white/0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{ backgroundSize: "200% 100%" }}
        />
      )}
    </>
  );

  const motionProps = {
    whileHover: { scale: 1.015 },
    whileTap: { scale: 0.985 },
    transition: { duration: 0.25, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  };

  if (href) {
    return (
      <motion.a href={href} className={cn(base, styles, className)} {...motionProps}>
        {content}
      </motion.a>
    );
  }

  return (
    <motion.button
      type={type}
      onClick={onClick}
      className={cn(base, styles, className)}
      {...motionProps}
    >
      {content}
    </motion.button>
  );
}
