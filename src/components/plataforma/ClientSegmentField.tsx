"use client";

import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown, Plus, Tag, X } from "lucide-react";
import { cn } from "@/lib/cn";
import { usePlataformaStore } from "@/lib/plataforma/store";

export function ClientSegmentField({
  value,
  onChange,
  label = "Segmento",
  compact,
}: {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  compact?: boolean;
}) {
  const { clientSegments, addClientSegment } = usePlataformaStore();
  const [open, setOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [draft, setDraft] = useState("");
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    function onDocClick(e: MouseEvent) {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(e.target as Node)) {
        setOpen(false);
        setCreating(false);
        setDraft("");
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        setCreating(false);
        setDraft("");
      }
    }
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  useEffect(() => {
    if (creating) {
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [creating]);

  function commitNewSegment() {
    const segment = addClientSegment(draft);
    if (!segment) return;
    onChange(segment);
    setDraft("");
    setCreating(false);
    setOpen(false);
  }

  function pickSegment(next: string) {
    onChange(next);
    setOpen(false);
    setCreating(false);
    setDraft("");
  }

  return (
    <div ref={rootRef} className={cn("relative", compact ? "min-w-[220px]" : "")}>
      <span className="mb-1 block text-[10.5px] font-bold uppercase tracking-[0.14em] text-ink-500">
        {label}
      </span>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={cn(
          "group flex h-10 w-full items-center gap-2 rounded-btn border bg-white px-3 text-left transition-all",
          open
            ? "border-ink-400 shadow-[0_0_0_3px_rgba(17,17,17,0.05)]"
            : "border-ink-200 hover:border-ink-300",
        )}
      >
        <Tag
          className={cn(
            "h-3.5 w-3.5 shrink-0 transition-colors",
            value ? "text-brand-orange" : "text-ink-400",
          )}
          strokeWidth={2.4}
        />
        <span
          className={cn(
            "flex-1 truncate text-[13px] font-medium",
            value ? "text-ink-900" : "text-ink-400",
          )}
        >
          {value || "Selecione"}
        </span>
        <ChevronDown
          className={cn(
            "h-3.5 w-3.5 shrink-0 text-ink-400 transition-transform",
            open && "rotate-180 text-ink-700",
          )}
          strokeWidth={2.4}
        />
      </button>

      {open && (
        <div className="absolute right-0 top-[calc(100%+6px)] z-30 w-full min-w-[240px] origin-top overflow-hidden rounded-card border border-ink-200 bg-white shadow-[0_12px_32px_-12px_rgba(0,0,0,0.18)]">
          <div className="max-h-60 overflow-y-auto py-1">
            {clientSegments.length === 0 && (
              <p className="px-3 py-2 text-[12px] text-ink-400">Nenhum segmento cadastrado</p>
            )}
            {clientSegments.map((segment) => {
              const active = segment === value;
              return (
                <button
                  key={segment}
                  type="button"
                  onClick={() => pickSegment(segment)}
                  className={cn(
                    "flex w-full items-center justify-between gap-2 px-3 py-1.5 text-left text-[13px] transition-colors",
                    active ? "bg-brand-orange/8 text-brand-orange" : "text-ink-700 hover:bg-ink-50",
                  )}
                >
                  <span className="truncate font-medium">{segment}</span>
                  {active && <Check className="h-3.5 w-3.5 shrink-0" strokeWidth={2.6} />}
                </button>
              );
            })}
          </div>

          <div className="border-t border-ink-100 bg-ink-50/60 p-1.5">
            {creating ? (
              <div className="flex items-center gap-1.5">
                <input
                  ref={inputRef}
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      commitNewSegment();
                    }
                  }}
                  placeholder="Nome do segmento"
                  className="h-8 min-w-0 flex-1 rounded-[5px] border border-ink-200 bg-white px-2 text-[12.5px] text-ink-900 placeholder-ink-400 outline-none transition-colors focus:border-ink-400"
                />
                <button
                  type="button"
                  onClick={commitNewSegment}
                  disabled={!draft.trim()}
                  className="inline-flex h-8 items-center justify-center rounded-[5px] bg-brand-orange px-2.5 text-[12px] font-semibold text-white transition-colors hover:bg-brand-orangeHover disabled:cursor-not-allowed disabled:bg-ink-300"
                >
                  Adicionar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCreating(false);
                    setDraft("");
                  }}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-[5px] text-ink-500 transition-colors hover:bg-ink-100 hover:text-ink-700"
                  aria-label="Cancelar"
                >
                  <X className="h-3.5 w-3.5" strokeWidth={2.4} />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setCreating(true)}
                className="flex w-full items-center gap-2 rounded-[5px] px-2 py-1.5 text-left text-[12.5px] font-semibold text-ink-700 transition-colors hover:bg-white hover:text-brand-orange"
              >
                <Plus className="h-3.5 w-3.5" strokeWidth={2.6} />
                Criar novo segmento
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
