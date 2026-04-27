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
import { supabase } from "@/lib/supabase/client";
import { buildClientProfile } from "./client-profile-mock";
import { useConsultorSession } from "./session";
import type {
  Client,
  ClientProfile,
  ClientStatus,
  DashboardMetrics,
  Notification,
  Proposal,
  ProposalStatus,
  Subscription,
  SubscriptionStatus,
  Task,
  TaskPriority,
} from "./types";

type NewClient = Pick<Client, "name" | "email" | "phone"> &
  Partial<Pick<Client, "companyName" | "locationState" | "locationCity" | "distributor" | "segment" | "status">>;

type ClientPatch = Partial<
  Pick<
    Client,
    | "name"
    | "email"
    | "phone"
    | "companyName"
    | "locationState"
    | "locationCity"
    | "distributor"
    | "segment"
    | "status"
    | "monthlySavings"
  >
>;

type NewTask = Pick<Task, "title"> &
  Partial<Pick<Task, "description" | "dueAt" | "clientId" | "priority">>;

type NewProposal = Pick<Proposal, "clientId" | "title" | "amount"> &
  Partial<Pick<Proposal, "status" | "sentAt">>;

type ProposalPatch = Partial<Pick<Proposal, "title" | "amount" | "status" | "sentAt">>;

type Ctx = {
  ownerId: string;
  clients: Client[];
  tasks: Task[];
  proposals: Proposal[];
  notifications: Notification[];
  subscription: Subscription;
  metrics: DashboardMetrics;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  addClient: (input: NewClient) => Promise<Client | null>;
  updateClient: (id: string, patch: ClientPatch) => Promise<Client | null>;
  removeClient: (id: string) => Promise<boolean>;
  addTask: (input: NewTask) => Promise<Task | null>;
  toggleTask: (id: string) => Promise<void>;
  addProposal: (input: NewProposal) => Promise<Proposal | null>;
  updateProposal: (id: string, patch: ProposalPatch) => Promise<Proposal | null>;
  getClientProfile: (clientId: string) => ClientProfile | null;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
};

const StoreContext = createContext<Ctx | null>(null);

type ClientRow = {
  id: string;
  account_id: string;
  created_at: string;
  name: string;
  company_name: string | null;
  email: string;
  phone: string;
  location_state: string | null;
  location_city: string | null;
  distributor: string | null;
  segment: string | null;
  monthly_savings: number | string | null;
  status: ClientStatus;
};

type TaskRow = {
  id: string;
  account_id: string;
  client_id: string | null;
  created_at: string;
  title: string;
  description: string | null;
  due_at: string | null;
  priority: TaskPriority;
  done: boolean;
};

type ProposalRow = {
  id: string;
  account_id: string;
  client_id: string;
  created_at: string;
  title: string;
  amount: number | string | null;
  status: ProposalStatus;
  sent_at: string | null;
};

function mapClient(row: ClientRow): Client {
  return {
    id: row.id,
    ownerId: row.account_id,
    name: row.name,
    companyName: row.company_name ?? undefined,
    email: row.email,
    phone: row.phone,
    locationState: row.location_state ?? undefined,
    locationCity: row.location_city ?? undefined,
    distributor: row.distributor ?? undefined,
    segment: row.segment ?? undefined,
    monthlySavings:
      row.monthly_savings === null || row.monthly_savings === undefined
        ? undefined
        : Number(row.monthly_savings),
    status: row.status,
    createdAt: row.created_at,
  };
}

function mapTask(row: TaskRow): Task {
  return {
    id: row.id,
    ownerId: row.account_id,
    title: row.title,
    description: row.description ?? undefined,
    dueAt: row.due_at ?? undefined,
    clientId: row.client_id ?? undefined,
    priority: row.priority,
    done: row.done,
    createdAt: row.created_at,
  };
}

function mapProposal(row: ProposalRow): Proposal {
  return {
    id: row.id,
    ownerId: row.account_id,
    clientId: row.client_id,
    title: row.title,
    amount: Number(row.amount ?? 0),
    status: row.status,
    createdAt: row.created_at,
    sentAt: row.sent_at ?? undefined,
  };
}

function mapSubscription(paymentStatus?: string, paymentPlan?: string, paymentNextDueAt?: string): Subscription {
  const statusByPayment: Record<string, SubscriptionStatus> = {
    em_dia: "ativo",
    trial: "trial",
    pendente: "expirado",
    atrasado: "expirado",
    cancelado: "expirado",
    nao_iniciado: "trial",
  };

  return {
    status: statusByPayment[paymentStatus ?? ""] ?? "trial",
    plan: paymentPlan || "Pulso Consultor",
    nextDueAt: paymentNextDueAt,
    trialEndsAt: paymentStatus === "trial" ? paymentNextDueAt : undefined,
  };
}

export function PlataformaStoreProvider({ children }: { children: ReactNode }) {
  const { profile } = useConsultorSession();
  const ownerId = profile?.id ?? "";

  const [clients, setClients] = useState<Client[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const subscription = useMemo(
    () => mapSubscription(profile?.paymentStatus, profile?.paymentPlan, profile?.paymentNextDueAt),
    [profile?.paymentNextDueAt, profile?.paymentPlan, profile?.paymentStatus],
  );

  const refresh = useCallback(async () => {
    if (!ownerId) return;

    setLoading(true);
    setError(null);

    const [clientsResult, tasksResult, proposalsResult] = await Promise.all([
      supabase.from("clients").select("*").order("created_at", { ascending: false }),
      supabase.from("tasks").select("*").order("created_at", { ascending: false }),
      supabase.from("proposals").select("*").order("created_at", { ascending: false }),
    ]);

    if (clientsResult.error || tasksResult.error || proposalsResult.error) {
      setError(
        clientsResult.error?.message ??
          tasksResult.error?.message ??
          proposalsResult.error?.message ??
          "Não foi possível carregar a plataforma.",
      );
      setLoading(false);
      return;
    }

    setClients((clientsResult.data ?? []).map((row) => mapClient(row as ClientRow)));
    setTasks((tasksResult.data ?? []).map((row) => mapTask(row as TaskRow)));
    setProposals((proposalsResult.data ?? []).map((row) => mapProposal(row as ProposalRow)));
    setNotifications([]);
    setLoading(false);
  }, [ownerId]);

  useEffect(() => {
    if (!ownerId) return;
    void refresh();
  }, [ownerId, refresh]);

  const addClient = useCallback<Ctx["addClient"]>(
    async (input) => {
      if (!ownerId) return null;

      const { data, error: insertError } = await supabase
        .from("clients")
        .insert({
          account_id: ownerId,
          name: input.name,
          email: input.email,
          phone: input.phone,
          company_name: input.companyName ?? null,
          location_state: input.locationState ?? null,
          location_city: input.locationCity ?? null,
          distributor: input.distributor ?? null,
          segment: input.segment ?? null,
          status: input.status ?? "prospecto",
        })
        .select("*")
        .single();

      if (insertError) {
        setError(insertError.message);
        return null;
      }

      setError(null);
      const client = mapClient(data as ClientRow);
      setClients((prev) => [client, ...prev]);
      return client;
    },
    [ownerId],
  );

  const addTask = useCallback<Ctx["addTask"]>(
    async (input) => {
      if (!ownerId) return null;

      const { data, error: insertError } = await supabase
        .from("tasks")
        .insert({
          account_id: ownerId,
          title: input.title,
          description: input.description ?? null,
          due_at: input.dueAt ?? null,
          client_id: input.clientId ?? null,
          priority: input.priority ?? "media",
          done: false,
        })
        .select("*")
        .single();

      if (insertError) {
        setError(insertError.message);
        return null;
      }

      setError(null);
      const task = mapTask(data as TaskRow);
      setTasks((prev) => [task, ...prev]);
      return task;
    },
    [ownerId],
  );

  const updateClient = useCallback<Ctx["updateClient"]>(
    async (id, patch) => {
      if (!ownerId) return null;

      const payload: Record<string, unknown> = { updated_at: new Date().toISOString() };
      if (patch.name !== undefined) payload.name = patch.name;
      if (patch.email !== undefined) payload.email = patch.email;
      if (patch.phone !== undefined) payload.phone = patch.phone;
      if (patch.companyName !== undefined) payload.company_name = patch.companyName ?? null;
      if (patch.locationState !== undefined) payload.location_state = patch.locationState ?? null;
      if (patch.locationCity !== undefined) payload.location_city = patch.locationCity ?? null;
      if (patch.distributor !== undefined) payload.distributor = patch.distributor ?? null;
      if (patch.segment !== undefined) payload.segment = patch.segment ?? null;
      if (patch.status !== undefined) payload.status = patch.status;
      if (patch.monthlySavings !== undefined) payload.monthly_savings = patch.monthlySavings ?? null;

      const { data, error: updateError } = await supabase
        .from("clients")
        .update(payload)
        .eq("id", id)
        .select("*")
        .single();

      if (updateError || !data) {
        setError(updateError?.message ?? "Não foi possível atualizar o cliente.");
        return null;
      }

      setError(null);
      const client = mapClient(data as ClientRow);
      setClients((prev) => prev.map((c) => (c.id === id ? client : c)));
      return client;
    },
    [ownerId],
  );

  const removeClient = useCallback<Ctx["removeClient"]>(
    async (id) => {
      if (!ownerId) return false;
      const previousClients = clients;
      const previousTasks = tasks;
      const previousProposals = proposals;

      setClients((prev) => prev.filter((c) => c.id !== id));
      setTasks((prev) =>
        prev.map((t) => (t.clientId === id ? { ...t, clientId: undefined } : t)),
      );
      setProposals((prev) => prev.filter((p) => p.clientId !== id));

      const { error: deleteError } = await supabase.from("clients").delete().eq("id", id);

      if (deleteError) {
        setError(deleteError.message);
        setClients(previousClients);
        setTasks(previousTasks);
        setProposals(previousProposals);
        return false;
      }

      setError(null);
      return true;
    },
    [clients, ownerId, proposals, tasks],
  );

  const addProposal = useCallback<Ctx["addProposal"]>(
    async (input) => {
      if (!ownerId) return null;

      const { data, error: insertError } = await supabase
        .from("proposals")
        .insert({
          account_id: ownerId,
          client_id: input.clientId,
          title: input.title,
          amount: input.amount,
          status: input.status ?? "rascunho",
          sent_at: input.sentAt ?? null,
        })
        .select("*")
        .single();

      if (insertError || !data) {
        setError(insertError?.message ?? "Não foi possível criar a proposta.");
        return null;
      }

      setError(null);
      const proposal = mapProposal(data as ProposalRow);
      setProposals((prev) => [proposal, ...prev]);
      return proposal;
    },
    [ownerId],
  );

  const updateProposal = useCallback<Ctx["updateProposal"]>(
    async (id, patch) => {
      if (!ownerId) return null;

      const payload: Record<string, unknown> = { updated_at: new Date().toISOString() };
      if (patch.title !== undefined) payload.title = patch.title;
      if (patch.amount !== undefined) payload.amount = patch.amount;
      if (patch.status !== undefined) payload.status = patch.status;
      if (patch.sentAt !== undefined) payload.sent_at = patch.sentAt ?? null;

      const { data, error: updateError } = await supabase
        .from("proposals")
        .update(payload)
        .eq("id", id)
        .select("*")
        .single();

      if (updateError || !data) {
        setError(updateError?.message ?? "Não foi possível atualizar a proposta.");
        return null;
      }

      setError(null);
      const proposal = mapProposal(data as ProposalRow);
      setProposals((prev) => prev.map((p) => (p.id === id ? proposal : p)));
      return proposal;
    },
    [ownerId],
  );

  const toggleTask = useCallback<Ctx["toggleTask"]>(async (id) => {
    const current = tasks.find((t) => t.id === id);
    if (!current) return;

    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));

    const { error: updateError } = await supabase
      .from("tasks")
      .update({ done: !current.done, updated_at: new Date().toISOString() })
      .eq("id", id);

    if (updateError) {
      setError(updateError.message);
      setTasks((prev) => prev.map((t) => (t.id === id ? current : t)));
      return;
    }

    setError(null);
  }, [tasks]);

  const getClientProfile = useCallback<Ctx["getClientProfile"]>(
    (clientId) => {
      const client = clients.find((c) => c.id === clientId);
      if (!client) return null;
      return buildClientProfile(client, tasks, proposals);
    },
    [clients, proposals, tasks],
  );

  const markNotificationRead = useCallback((id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const metrics = useMemo<DashboardMetrics>(() => {
    const walletSavings = clients
      .filter((c) => c.status === "ativo")
      .reduce((acc, c) => acc + (c.monthlySavings ?? 0), 0);
    const activeClients = clients.filter((c) => c.status === "ativo").length;
    const proposalsSent = proposals.filter((p) => p.status !== "rascunho").length;
    const openTasks = tasks.filter((t) => !t.done).length;
    return { walletSavings, activeClients, proposalsSent, openTasks };
  }, [clients, tasks, proposals]);

  const value = useMemo<Ctx>(
    () => ({
      ownerId,
      clients,
      tasks,
      proposals,
      notifications,
      subscription,
      metrics,
      loading,
      error,
      refresh,
      addClient,
      updateClient,
      removeClient,
      addTask,
      toggleTask,
      addProposal,
      updateProposal,
      getClientProfile,
      markNotificationRead,
      markAllNotificationsRead,
    }),
    [
      ownerId,
      clients,
      tasks,
      proposals,
      notifications,
      subscription,
      metrics,
      loading,
      error,
      refresh,
      addClient,
      updateClient,
      removeClient,
      addTask,
      toggleTask,
      addProposal,
      updateProposal,
      getClientProfile,
      markNotificationRead,
      markAllNotificationsRead,
    ],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function usePlataformaStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("usePlataformaStore must be used inside PlataformaStoreProvider");
  return ctx;
}
