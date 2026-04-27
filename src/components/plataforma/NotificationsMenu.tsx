"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bell, CheckCheck, CreditCard, ListTodo, Sparkles, UserPlus, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/cn";
import { EASE } from "@/lib/motion";
import { formatRelative } from "@/lib/plataforma/format";
import { usePlataformaStore } from "@/lib/plataforma/store";
import type { Notification, NotificationKind } from "@/lib/plataforma/types";

const KIND_ICON: Record<NotificationKind, LucideIcon> = {
  lead: UserPlus,
  tarefa: ListTodo,
  pagamento: CreditCard,
  sistema: Sparkles,
};

export function NotificationsMenu() {
  const { notifications, markNotificationRead, markAllNotificationsRead } = usePlataformaStore();
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement | null>(null);

  const unread = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    if (!open) return;
    function onClick(e: MouseEvent) {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={wrapRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Notificações"
        className="relative inline-flex h-9 w-9 items-center justify-center rounded-btn text-ink-600 transition-colors hover:bg-ink-100 hover:text-ink-900"
      >
        <Bell className="h-4 w-4" strokeWidth={2.2} />
        {unread > 0 && (
          <span className="absolute right-1 top-1 inline-flex h-4 min-w-[16px] items-center justify-center rounded-full bg-brand-orange px-1 text-[9.5px] font-bold leading-none text-white">
            {unread}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.99 }}
            transition={{ duration: 0.18, ease: EASE }}
            className="fixed inset-x-3 top-[60px] z-40 max-h-[70vh] overflow-hidden rounded-card border border-ink-200 bg-white shadow-[0_24px_60px_-20px_rgba(17,17,17,0.25)] sm:absolute sm:inset-x-auto sm:right-0 sm:top-[calc(100%+8px)] sm:w-[360px]"
          >
            <header className="flex items-center justify-between border-b border-ink-200 px-4 py-3">
              <div>
                <p className="text-[13px] font-bold text-ink-900">Notificações</p>
                <p className="text-[11px] text-ink-500">
                  {unread === 0
                    ? "Você está em dia."
                    : `${unread} ${unread === 1 ? "nova" : "novas"}`}
                </p>
              </div>
              {unread > 0 && (
                <button
                  type="button"
                  onClick={markAllNotificationsRead}
                  className="inline-flex items-center gap-1 rounded-btn px-2 py-1 text-[11px] font-semibold text-ink-600 transition-colors hover:bg-ink-100 hover:text-ink-900"
                >
                  <CheckCheck className="h-3.5 w-3.5" strokeWidth={2.2} />
                  Marcar tudo
                </button>
              )}
            </header>

            <ol className="max-h-[420px] overflow-y-auto divide-y divide-ink-100">
              {notifications.length === 0 && (
                <li className="px-4 py-8 text-center text-[12.5px] text-ink-500">
                  Nenhuma notificação por aqui.
                </li>
              )}
              {notifications.map((n) => (
                <NotificationRow
                  key={n.id}
                  notification={n}
                  onClick={() => {
                    markNotificationRead(n.id);
                    if (n.href) setOpen(false);
                  }}
                />
              ))}
            </ol>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function NotificationRow({
  notification,
  onClick,
}: {
  notification: Notification;
  onClick: () => void;
}) {
  const Icon = KIND_ICON[notification.kind];
  const content = (
    <div className="flex items-start gap-3 px-4 py-3 text-left">
      <span
        className={cn(
          "inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full",
          notification.read ? "bg-ink-100 text-ink-600" : "bg-brand-orange/10 text-brand-orange",
        )}
      >
        <Icon className="h-3.5 w-3.5" strokeWidth={2.2} />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-2">
          <p className={cn("truncate text-[13px] font-semibold", notification.read ? "text-ink-700" : "text-ink-900")}>
            {notification.title}
          </p>
          <span className="shrink-0 text-[10.5px] text-ink-400">{formatRelative(notification.createdAt)}</span>
        </div>
        <p className="mt-0.5 truncate text-[12px] text-ink-500">{notification.body}</p>
      </div>
      {!notification.read && (
        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-orange" />
      )}
    </div>
  );

  return (
    <li>
      {notification.href ? (
        <Link
          href={notification.href}
          onClick={onClick}
          className="block transition-colors hover:bg-ink-50"
        >
          {content}
        </Link>
      ) : (
        <button
          type="button"
          onClick={onClick}
          className="block w-full transition-colors hover:bg-ink-50"
        >
          {content}
        </button>
      )}
    </li>
  );
}
