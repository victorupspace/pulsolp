import type { NextRequest } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/server";

export type AccountAccessRow = {
  id: string;
  email: string;
  full_name: string;
  auth_user_id: string | null;
};

export type GeneratedAccessLink = {
  authUserId: string;
  actionLink: string;
};

export async function generateManualAccessLink(
  req: NextRequest,
  account: AccountAccessRow,
): Promise<GeneratedAccessLink> {
  const adminClient = createSupabaseAdminClient();
  const existingUserId = account.auth_user_id ?? (await findUserIdByEmail(account.email));
  const redirectTo = buildRedirectTo(req);

  if (existingUserId) {
    const { data, error } = await adminClient.auth.admin.generateLink({
      type: "recovery",
      email: account.email,
      options: {
        redirectTo,
      },
    });

    if (error || !data.properties?.action_link) {
      throw new Error(error?.message ?? "Não foi possível gerar o link de definição de senha.");
    }

    return {
      authUserId: existingUserId,
      actionLink: data.properties.action_link,
    };
  }

  const { data, error } = await adminClient.auth.admin.generateLink({
    type: "invite",
    email: account.email,
    options: {
      data: {
        full_name: account.full_name,
        account_id: account.id,
      },
      redirectTo,
    },
  });

  if (error || !data.user || !data.properties?.action_link) {
    throw new Error(error?.message ?? "Não foi possível gerar o link de convite.");
  }

  return {
    authUserId: data.user.id,
    actionLink: data.properties.action_link,
  };
}

function buildRedirectTo(req: NextRequest) {
  const configuredUrl =
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.VERCEL_PROJECT_PRODUCTION_URL ??
    process.env.VERCEL_URL;
  const baseUrl = normalizeBaseUrl(configuredUrl) ?? normalizeBaseUrl(req.headers.get("origin"));
  return baseUrl ? `${baseUrl}/definir-senha` : undefined;
}

function normalizeBaseUrl(value?: string | null) {
  if (!value) return null;

  const withProtocol = /^https?:\/\//i.test(value) ? value : `https://${value}`;

  try {
    const url = new URL(withProtocol);
    return `${url.protocol}//${url.host}`;
  } catch {
    return null;
  }
}

async function findUserIdByEmail(email: string) {
  const adminClient = createSupabaseAdminClient();
  let page = 1;

  while (page <= 10) {
    const { data, error } = await adminClient.auth.admin.listUsers({
      page,
      perPage: 1000,
    });

    if (error) throw new Error(error.message);

    const user = data.users.find((item) => item.email?.toLowerCase() === email.toLowerCase());
    if (user) return user.id;
    if (data.users.length < 1000) return null;
    page += 1;
  }

  return null;
}
