"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { MOCK_ACCOUNTS, MOCK_LEADS } from "./mock-data";
import type {
  Account,
  ComercializadoraLead,
  ComercializadoraStatus,
  HistoryEvent,
  PaymentStatus,
} from "./types";

type Ctx = {
  accounts: Account[];
  leads: ComercializadoraLead[];
  approve: (id: string) => void;
  toggleActive: (id: string) => void;
  remove: (id: string) => void;
  setPaymentStatus: (id: string, status: PaymentStatus) => void;
  markPaid: (id: string) => void;
  setLeadStatus: (id: string, status: ComercializadoraStatus) => void;
  removeLead: (id: string) => void;
};

const AdminStoreCtx = createContext<Ctx | null>(null);

function event(label: string, by = "adminpulse"): HistoryEvent {
  return {
    id: `evt_${Math.random().toString(36).slice(2, 9)}`,
    at: new Date().toISOString(),
    label,
    by,
  };
}

export function AdminStoreProvider({ children }: { children: ReactNode }) {
  const [accounts, setAccounts] = useState<Account[]>(MOCK_ACCOUNTS);
  const [leads, setLeads] = useState<ComercializadoraLead[]>(MOCK_LEADS);

  const approve = useCallback((id: string) => {
    setAccounts((prev) =>
      prev.map((a) =>
        a.id === id
          ? {
              ...a,
              status: "criada",
              approvedAt: new Date().toISOString(),
              payment: a.payment.status === "nao_iniciado" ? { ...a.payment, status: "trial" } : a.payment,
              history: [event("Conta aprovada"), ...a.history],
            }
          : a,
      ),
    );
  }, []);

  const toggleActive = useCallback((id: string) => {
    setAccounts((prev) =>
      prev.map((a) =>
        a.id === id
          ? {
              ...a,
              active: !a.active,
              history: [event(a.active ? "Conta desativada" : "Conta ativada"), ...a.history],
            }
          : a,
      ),
    );
  }, []);

  const remove = useCallback((id: string) => {
    setAccounts((prev) => prev.filter((a) => a.id !== id));
  }, []);

  const setPaymentStatus = useCallback((id: string, status: PaymentStatus) => {
    setAccounts((prev) =>
      prev.map((a) =>
        a.id === id
          ? {
              ...a,
              payment: { ...a.payment, status },
              history: [event(`Pagamento atualizado para "${status}"`), ...a.history],
            }
          : a,
      ),
    );
  }, []);

  const markPaid = useCallback((id: string) => {
    setAccounts((prev) =>
      prev.map((a) =>
        a.id === id
          ? {
              ...a,
              payment: {
                ...a.payment,
                status: "em_dia",
                lastPaidAt: new Date().toISOString(),
              },
              history: [event("Pagamento marcado como em dia"), ...a.history],
            }
          : a,
      ),
    );
  }, []);

  const setLeadStatus = useCallback((id: string, status: ComercializadoraStatus) => {
    setLeads((prev) =>
      prev.map((l) =>
        l.id === id
          ? {
              ...l,
              status,
              history: [event(`Status alterado para "${status}"`), ...l.history],
            }
          : l,
      ),
    );
  }, []);

  const removeLead = useCallback((id: string) => {
    setLeads((prev) => prev.filter((l) => l.id !== id));
  }, []);

  const value = useMemo<Ctx>(
    () => ({
      accounts,
      leads,
      approve,
      toggleActive,
      remove,
      setPaymentStatus,
      markPaid,
      setLeadStatus,
      removeLead,
    }),
    [accounts, leads, approve, toggleActive, remove, setPaymentStatus, markPaid, setLeadStatus, removeLead],
  );

  return <AdminStoreCtx.Provider value={value}>{children}</AdminStoreCtx.Provider>;
}

export function useAdminStore() {
  const ctx = useContext(AdminStoreCtx);
  if (!ctx) throw new Error("useAdminStore deve ser usado dentro de AdminStoreProvider");
  return ctx;
}
