"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

const STORAGE_KEY = "pulso-admin-session";

// Protótipo: credenciais hardcoded apenas para a demo do backoffice.
// Substituir por autenticação real (Supabase Auth + RLS) antes de qualquer uso real.
const ADMIN_USERNAME = "adminpulse";
const ADMIN_PASSWORD = "S3cur1ty#Pulse";

type Session = {
  username: string;
  startedAt: string;
};

type Ctx = {
  session: Session | null;
  hydrated: boolean;
  signIn: (username: string, password: string) => { ok: true } | { ok: false; reason: string };
  signOut: () => void;
};

const AdminAuthCtx = createContext<Ctx | null>(null);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) setSession(JSON.parse(raw));
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  const signIn = useCallback((username: string, password: string) => {
    if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
      return { ok: false as const, reason: "Credenciais inválidas." };
    }
    const next: Session = { username, startedAt: new Date().toISOString() };
    setSession(next);
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
    return { ok: true as const };
  }, []);

  const signOut = useCallback(() => {
    setSession(null);
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
  }, []);

  const value = useMemo<Ctx>(() => ({ session, hydrated, signIn, signOut }), [session, hydrated, signIn, signOut]);

  return <AdminAuthCtx.Provider value={value}>{children}</AdminAuthCtx.Provider>;
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthCtx);
  if (!ctx) throw new Error("useAdminAuth deve ser usado dentro de AdminAuthProvider");
  return ctx;
}
