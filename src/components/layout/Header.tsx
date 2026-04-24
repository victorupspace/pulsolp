"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { useScrollState } from "@/hooks/useScrollState";
import { cn } from "@/lib/cn";

const NAV = [
  { label: "Mercado livre", href: "#mle" },
  { label: "Consultor", href: "#consultor" },
  { label: "Comercializadora", href: "#comercializadora" },
  { label: "Consumidor", href: "#consumidor" },
];

const EASE = [0.22, 1, 0.36, 1] as const;

export function Header() {
  const scrolled = useScrollState(24);
  const [open, setOpen] = useState(false);

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: EASE }}
      className="fixed inset-x-0 top-0 z-50"
    >
      <div className="mx-auto w-full max-w-[1280px] px-4 pt-4 md:px-6 md:pt-5">
        <div
          className={cn(
            "group/header relative flex h-[68px] items-center justify-between gap-4 overflow-hidden rounded-full px-4 pl-6 pr-2 transition-all duration-500 md:pl-7 md:pr-2.5",
            "[backdrop-filter:blur(22px)_saturate(170%)] [-webkit-backdrop-filter:blur(22px)_saturate(170%)]",
            scrolled
              ? "bg-[#FAF7F2]/62 shadow-[0_18px_55px_-28px_rgba(17,17,17,0.45),inset_0_0_0_1px_rgba(17,17,17,0.07),inset_0_1px_0_rgba(255,255,255,0.38)]"
              : "bg-ink-900/[0.18] shadow-[0_18px_55px_-26px_rgba(0,0,0,0.55),inset_0_0_0_1px_rgba(255,255,255,0.10),inset_0_1px_0_rgba(255,255,255,0.16)]",
          )}
        >
          <span
            aria-hidden
            className={cn(
              "pointer-events-none absolute inset-0 rounded-full transition-opacity duration-500",
              scrolled ? "opacity-100" : "opacity-70",
            )}
            style={{
              background:
                "linear-gradient(135deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.04) 42%, rgba(255,255,255,0) 62%, rgba(17,17,17,0.05) 100%)",
            }}
          />
          <span
            aria-hidden
            className="pointer-events-none absolute inset-x-10 top-0 h-px rounded-full bg-gradient-to-r from-transparent via-white/35 to-transparent"
          />
          <a href="#top" className="flex items-center">
            <Logo variant={scrolled ? "dark" : "light"} className="scale-90 origin-left" />
          </a>

          <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-8 lg:flex">
            {NAV.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className={cn(
                  "text-[14px] font-medium transition-colors duration-300",
                  scrolled
                    ? "text-ink-700/80 hover:text-ink-900"
                    : "text-white/85 hover:text-white",
                )}
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="hidden items-center gap-1 lg:flex">
            <a
              href="#login"
              className={cn(
                "rounded-full px-4 py-2 text-[13px] font-semibold transition-colors duration-300",
                scrolled ? "text-ink-700 hover:text-ink-900" : "text-white/85 hover:text-white",
              )}
            >
              Login
            </a>
            <a
              href="#signup"
              className={cn(
                "rounded-full px-4 py-2 text-[13px] font-semibold transition-colors duration-300",
                scrolled ? "text-ink-700 hover:text-ink-900" : "text-white/85 hover:text-white",
              )}
            >
              Cadastre-se
            </a>
            <StatusPill />
          </div>

          <button
            aria-label="Abrir menu"
            onClick={() => setOpen((v) => !v)}
            className={cn(
              "inline-flex h-11 w-11 items-center justify-center rounded-full transition-colors lg:hidden",
              scrolled
                ? "bg-white/72 text-ink-900 shadow-[inset_0_0_0_1px_rgba(17,17,17,0.08)]"
                : "bg-white/10 text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.10)] backdrop-blur-sm",
            )}
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0, y: -8 }}
              animate={{ height: "auto", opacity: 1, y: 0 }}
              exit={{ height: 0, opacity: 0, y: -8 }}
              transition={{ duration: 0.35, ease: EASE }}
              className="mt-3 overflow-hidden rounded-[28px] bg-[#FAF7F2]/88 shadow-[0_24px_70px_-28px_rgba(17,17,17,0.42),inset_0_0_0_1px_rgba(17,17,17,0.08),inset_0_1px_0_rgba(255,255,255,0.42)] backdrop-blur-2xl lg:hidden"
            >
              <div className="flex flex-col gap-1 p-4">
                {NAV.map((item, i) => (
                  <motion.a
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05, duration: 0.3 }}
                    className="rounded-2xl px-4 py-3 text-base font-medium text-ink-700 transition-colors hover:bg-white hover:text-ink-900"
                  >
                    {item.label}
                  </motion.a>
                ))}
                <div className="mt-2 flex flex-col gap-2 border-t border-ink-200/70 pt-3">
                  <a
                    href="#login"
                    className="rounded-full border border-ink-200 px-4 py-3 text-center text-[13px] font-semibold text-ink-900"
                  >
                    Login
                  </a>
                  <a
                    href="#signup"
                    className="rounded-full border border-ink-200 px-4 py-3 text-center text-[13px] font-semibold text-ink-900"
                  >
                    Cadastre-se
                  </a>
                  <StatusPill full />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}

function StatusPill({ full = false }: { full?: boolean }) {
  return (
    <motion.a
      href="#contact"
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.25, ease: EASE }}
      className={cn(
        "group inline-flex items-center gap-2.5 rounded-full bg-brand-orange px-5 py-2.5 text-[13px] font-semibold text-white shadow-[0_6px_20px_-6px_rgba(230,81,0,0.5)] transition-colors hover:bg-brand-orangeHover",
        full && "w-full justify-center",
      )}
    >
      <span className="relative inline-flex h-2 w-2 items-center justify-center">
        <span className="absolute inline-flex h-2 w-2 rounded-full bg-green-400 animate-pulseDot" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-green-300" />
      </span>
      <span className="whitespace-nowrap">Fale com a gente</span>
    </motion.a>
  );
}
