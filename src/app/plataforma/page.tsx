"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

export default function PlataformaTestePage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [blocked, setBlocked] = useState(false);

  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(async ({ data }) => {
      if (!mounted) return;

      if (!data.session) {
        router.replace("/login");
        return;
      }

      const { data: account, error } = await supabase
        .from("accounts")
        .select("id")
        .eq("auth_user_id", data.session.user.id)
        .eq("status", "criada")
        .eq("active", true)
        .maybeSingle();

      if (!mounted) return;

      if (error || !account) {
        await supabase.auth.signOut();
        setBlocked(true);
        setChecking(false);
        return;
      }

      setChecking(false);
    });

    return () => {
      mounted = false;
    };
  }, [router]);

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.replace("/login");
  }

  if (checking) {
    return <div className="min-h-svh bg-white" />;
  }

  if (blocked) {
    return (
      <main className="flex min-h-svh items-center justify-center bg-white px-6">
        <div className="max-w-[420px] text-center">
          <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-brand-orange">
            Acesso pendente
          </p>
          <h1 className="mt-3 text-[26px] font-bold tracking-[-0.02em] text-ink-900">
            Sua conta ainda não está liberada.
          </h1>
          <p className="mt-3 text-[14px] leading-[1.6] text-ink-500">
            O acesso à plataforma depende da aprovação do time Pulso no backoffice.
          </p>
          <button
            type="button"
            onClick={() => router.replace("/login")}
            className="mt-6 rounded-btn bg-ink-900 px-4 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-ink-800"
          >
            Voltar para o login
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-svh bg-white p-6">
      <div className="flex items-center justify-between">
        <p className="text-[12px] font-semibold text-ink-400">Área de teste da plataforma</p>
        <button
          type="button"
          onClick={handleSignOut}
          className="rounded-btn border border-ink-200 px-3 py-2 text-[12px] font-semibold text-ink-600 transition-colors hover:border-ink-400 hover:text-ink-900"
        >
          Sair
        </button>
      </div>
    </main>
  );
}
