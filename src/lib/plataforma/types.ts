export type ConsultorProfile = {
  id: string;
  authUserId: string;
  fullName: string;
  email: string;
  companyName?: string;
  paymentStatus?: string;
  paymentPlan?: string;
  paymentNextDueAt?: string;
};

export type SubscriptionStatus = "ativo" | "trial" | "expirado";

export type Subscription = {
  status: SubscriptionStatus;
  plan: string;
  trialEndsAt?: string;
  nextDueAt?: string;
};

export type ClientStatus = "ativo" | "prospecto" | "perdido";

export type Client = {
  id: string;
  ownerId: string;
  name: string;
  companyName?: string;
  email: string;
  phone: string;
  locationState?: string;
  locationCity?: string;
  distributor?: string;
  segment?: string;
  monthlySavings?: number;
  status: ClientStatus;
  createdAt: string;
};

export type ClientLifecycleStatus =
  | "novo"
  | "em_negociacao"
  | "migrando"
  | "ativo"
  | "perdido";

export type ClientProfileTag = "varejista" | "atacadista" | "industria" | "servicos" | "saude" | "agro";

export type Submercado = "SE/CO" | "S" | "NE" | "N";

export type Tensao = "BT" | "MT" | "AT";

export type ClientUnit = {
  id: string;
  clientId: string;
  ucCode: string;
  distribuidora: string;
  locationState?: string;
  locationCity?: string;
  submercado: Submercado;
  tensao: Tensao;
  contractedDemandKw?: number;
  tariff?: string;
  averageConsumptionKwh?: number;
  smfReady: boolean;
  contractEndAt?: string;
};

export type ClientDocumentKind =
  | "contrato_social"
  | "fatura"
  | "procuracao"
  | "denuncia_distribuidora"
  | "ccee"
  | "outros";

export type ClientDocument = {
  id: string;
  clientId: string;
  name: string;
  kind: ClientDocumentKind;
  uploadedAt: string;
  expiresAt?: string;
  sizeKb: number;
};

export type ClientActivityKind =
  | "criacao"
  | "status"
  | "nota"
  | "simulacao"
  | "proposta"
  | "documento"
  | "tarefa";

export type ClientActivity = {
  id: string;
  clientId: string;
  kind: ClientActivityKind;
  by: string;
  at: string;
  title: string;
  body?: string;
};

export type ClientMigrationStage =
  | "denuncia"
  | "contratos"
  | "smf"
  | "ccee";

export type ClientMigrationStatus = "pendente" | "em_andamento" | "concluido";

export type ClientProfile = {
  id: string;
  legalName: string;
  tradeName?: string;
  document?: string;
  profileTag?: ClientProfileTag;
  lifecycle: ClientLifecycleStatus;
  economicGroup?: string;
  units: ClientUnit[];
  documents: ClientDocument[];
  activities: ClientActivity[];
  migration: Record<ClientMigrationStage, ClientMigrationStatus>;
  lastInteractionAt?: string;
  averageConsumptionKwh?: number;
  monthlySavings?: number;
};

export type TaskPriority = "baixa" | "media" | "alta";

export type Task = {
  id: string;
  ownerId: string;
  title: string;
  description?: string;
  dueAt?: string;
  clientId?: string;
  priority: TaskPriority;
  done: boolean;
  createdAt: string;
};

export type ProposalStatus = "rascunho" | "enviada" | "aceita" | "recusada";

export type Proposal = {
  id: string;
  ownerId: string;
  clientId: string;
  title: string;
  amount: number;
  status: ProposalStatus;
  createdAt: string;
  sentAt?: string;
};

export type NotificationKind = "sistema" | "lead" | "tarefa" | "pagamento";

export type Notification = {
  id: string;
  ownerId: string;
  kind: NotificationKind;
  title: string;
  body: string;
  createdAt: string;
  read: boolean;
  href?: string;
};

export type DashboardMetrics = {
  walletSavings: number;
  activeClients: number;
  proposalsSent: number;
  openTasks: number;
};
