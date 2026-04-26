"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2,
  CreditCard,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  ShieldCheck,
  UserCheck,
  UserPlus,
  X,
} from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { useAdminAuth } from "@/lib/admin/auth";
import { cn } from "@/lib/cn";
import { EASE } from "@/lib/motion";

const NAV = [
  { label: "Visão geral", href: "/internal-pulse-admin/visao-geral", icon: LayoutDashboard },
  { label: "Contas novas", href: "/internal-pulse-admin/contas-novas", icon: UserPlus },
  { label: "Contas ativas", href: "/internal-pulse-admin/contas-ativas", icon: UserCheck },
  { label: "Comercializadoras", href: "/internal-pulse-admin/comercializadoras", icon: Building2 },
  { label: "Pagamentos", href: "/internal-pulse-admin/pagamentos", icon: CreditCard },
  { label: "Configurações", href: "/internal-pulse-admin/configuracoes", icon: Settings },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { session, hydrated, signOut } = useAdminAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (hydrated && !session) router.replace("/internal-pulse-admin/login");
  }, [hydrated, session, router]);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  if (!hydrated) {
    return (
      <div className="flex min-h-svh items-center justify-center text-[13px] text-ink-400">
        Carregando…
      </div>
    );
  }

  if (!session) return null;

  function handleSignOut() {
    signOut();
    router.replace("/internal-pulse-admin/login");
  }

  return (
    <div className="flex min-h-svh">
      <aside className="sticky top-0 hidden h-svh w-[248px] shrink-0 border-r border-ink-200 bg-white lg:flex lg:flex-col">
        <SidebarContent pathname={pathname} onSignOut={handleSignOut} username={session.username} />
      </aside>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-ink-900/40 backdrop-blur-sm lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: -260 }}
              animate={{ x: 0 }}
              exit={{ x: -260 }}
              transition={{ duration: 0.3, ease: EASE }}
              className="fixed inset-y-0 left-0 z-50 flex w-[260px] flex-col border-r border-ink-200 bg-white lg:hidden"
            >
              <SidebarContent
                pathname={pathname}
                onSignOut={handleSignOut}
                username={session.username}
                onClose={() => setMobileOpen(false)}
              />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-3 border-b border-ink-200 bg-white/85 px-4 backdrop-blur-sm md:px-6">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-btn text-ink-600 transition-colors hover:bg-ink-100 hover:text-ink-900 lg:hidden"
            aria-label="Abrir menu"
          >
            <Menu className="h-4 w-4" strokeWidth={2.2} />
          </button>

          <div className="flex items-center gap-3 text-[12px] text-ink-500">
            <ShieldCheck className="h-3.5 w-3.5 text-green-600" strokeWidth={2.4} />
            <span>
              Sessão ativa como{" "}
              <strong className="text-ink-900">{session.username}</strong>
            </span>
          </div>

          <button
            type="button"
            onClick={handleSignOut}
            className="group inline-flex h-9 items-center gap-1.5 rounded-btn px-3 text-[12.5px] font-semibold text-ink-600 transition-colors hover:bg-ink-100 hover:text-ink-900"
          >
            <LogOut className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" strokeWidth={2.2} />
            Sair
          </button>
        </header>

        <main className="min-w-0 flex-1 px-4 py-6 md:px-8 md:py-8">{children}</main>
      </div>
    </div>
  );
}

function SidebarContent({
  pathname,
  onSignOut,
  username,
  onClose,
}: {
  pathname: string | null;
  onSignOut: () => void;
  username: string;
  onClose?: () => void;
}) {
  return (
    <>
      <div className="flex items-center justify-between border-b border-ink-200 px-5 py-5">
        <Link href="/internal-pulse-admin/visao-geral" className="inline-flex">
          <Logo variant="dark" className="scale-[0.7] origin-left" />
        </Link>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-8 w-8 items-center justify-center rounded-btn text-ink-500 hover:bg-ink-100 hover:text-ink-900"
            aria-label="Fechar menu"
          >
            <X className="h-4 w-4" strokeWidth={2.2} />
          </button>
        )}
      </div>

      <div className="px-5 pt-5">
        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-ink-400">
          Backoffice
        </p>
      </div>

      <nav className="mt-3 flex-1 space-y-0.5 px-3">
        {NAV.map((item) => {
          const active = pathname?.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group relative flex items-center gap-2.5 rounded-btn px-3 py-2.5 text-[13px] font-medium transition-colors",
                active
                  ? "bg-ink-900 text-white"
                  : "text-ink-600 hover:bg-ink-100 hover:text-ink-900",
              )}
            >
              <Icon className="h-3.5 w-3.5" strokeWidth={2.2} />
              {item.label}
              {active && (
                <span className="absolute right-3 top-1/2 h-1 w-1 -translate-y-1/2 rounded-full bg-brand-orange" />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-ink-200 p-4">
        <div className="mb-2 rounded-btn bg-ink-50 px-3 py-2.5 text-[12px]">
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-500">
            Logado como
          </p>
          <p className="mt-0.5 font-semibold text-ink-900">{username}</p>
        </div>
        <button
          type="button"
          onClick={onSignOut}
          className="inline-flex h-9 w-full items-center justify-center gap-1.5 rounded-btn border border-ink-200 text-[12.5px] font-semibold text-ink-700 transition-colors hover:border-ink-400 hover:bg-ink-50"
        >
          <LogOut className="h-3.5 w-3.5" strokeWidth={2.2} />
          Encerrar sessão
        </button>
      </div>
    </>
  );
}
