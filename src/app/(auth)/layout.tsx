import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cadastro — Pulso",
  description: "Crie sua conta na Pulso e acesse a plataforma do mercado livre de energia.",
  robots: { index: false, follow: false },
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-svh bg-white text-ink-900">{children}</div>;
}
