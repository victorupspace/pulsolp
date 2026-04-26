export type AccountKind = "consultor" | "comercializadora";

export type DocumentKind = "cnpj" | "cpf";

export type AccountStatus = "nova" | "criada";

export type PaymentStatus =
  | "em_dia"
  | "pendente"
  | "atrasado"
  | "trial"
  | "cancelado"
  | "nao_iniciado";

export type ComercializadoraStatus =
  | "aguardando"
  | "em_contato"
  | "convertida"
  | "perdida";

export type HistoryEvent = {
  id: string;
  at: string;
  label: string;
  by?: string;
};

export type Account = {
  id: string;
  kind: AccountKind;
  fullName: string;
  email: string;
  phone: string;
  documentKind: DocumentKind;
  document: string;
  companyName?: string;
  address?: string;
  createdAt: string;
  approvedAt?: string;
  status: AccountStatus;
  active: boolean;
  payment: {
    status: PaymentStatus;
    plan?: string;
    monthlyAmount?: number;
    nextDueAt?: string;
    lastPaidAt?: string;
  };
  history: HistoryEvent[];
};

export type ComercializadoraLead = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  requestedAt: string;
  status: ComercializadoraStatus;
  history: HistoryEvent[];
};
