import { supabase } from "./client";

export type ClientType = "consultor" | "comercializadora" | "consumidor";

export type HeroFormPayload = {
  fullName: string;
  phone: string;
  email: string;
  clientType: ClientType;
  regions?: string[];
  hasPartnerNetwork?: boolean | null;
  commercializerSize?: string | null;
  segment?: string | null;
  monthlyEnergySpend?: string | null;
};

export type ConsultorRegistrationPayload = {
  fullName: string;
  phone: string;
  email: string;
  documentType: string;
  document: string;
  companyName?: string | null;
  address?: string | null;
};

export type ComercializadoraRegistrationPayload = {
  fullName: string;
  phone: string;
  email: string;
};

export type ConsumidorRegistrationPayload = {
  fullName: string;
  phone: string;
  email: string;
  segment?: string | null;
  monthlyEnergySpend?: string | null;
};

export async function createHeroFormSubmission(payload: HeroFormPayload) {
  const { error } = await supabase.from("hero_form_submissions").insert({
    full_name: payload.fullName,
    phone: payload.phone,
    email: payload.email,
    client_type: payload.clientType,
    regions: payload.regions ?? [],
    has_partner_network: payload.hasPartnerNetwork,
    commercializer_size: payload.commercializerSize,
    segment: payload.segment,
    monthly_energy_spend: payload.monthlyEnergySpend,
  });

  if (error) throw error;
}

export async function createConsultorRegistration(payload: ConsultorRegistrationPayload) {
  const { error } = await supabase.from("consultor_registrations").insert({
    full_name: payload.fullName,
    phone: payload.phone,
    email: payload.email,
    document_type: payload.documentType,
    document: payload.document,
    company_name: payload.companyName,
    address: payload.address,
  });

  if (error) throw error;
}

export async function createComercializadoraRegistration(
  payload: ComercializadoraRegistrationPayload,
) {
  const { error } = await supabase.from("comercializadora_registrations").insert({
    full_name: payload.fullName,
    phone: payload.phone,
    email: payload.email,
  });

  if (error) throw error;
}

export async function createConsumidorRegistration(payload: ConsumidorRegistrationPayload) {
  const { error } = await supabase.from("consumidor_registrations").insert({
    full_name: payload.fullName,
    phone: payload.phone,
    email: payload.email,
    segment: payload.segment,
    monthly_energy_spend: payload.monthlyEnergySpend,
  });

  if (error) throw error;
}
