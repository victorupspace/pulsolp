"use client";

import { motion } from "framer-motion";
import { BarChart3, Clock, Wallet, Sparkles } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { CTA } from "@/components/ui/CTA";
import { Reveal } from "@/components/ui/Reveal";
import { fadeUp, stagger } from "@/lib/motion";

const BENEFITS = [
  {
    icon: <BarChart3 size={18} />,
    title: "Painel completo de clientes",
    desc: "Visualize contratos, faturas e consumo de toda a sua carteira em um único lugar.",
  },
  {
    icon: <Clock size={18} />,
    title: "Automação de processos",
    desc: "Da prospecção ao pós-venda, com workflows prontos e notificações inteligentes.",
  },
  {
    icon: <Wallet size={18} />,
    title: "Comissões transparentes",
    desc: "Acompanhe performance, metas e receita em tempo real com dashboards dinâmicos.",
  },
  {
    icon: <Sparkles size={18} />,
    title: "Inteligência de mercado",
    desc: "Análises preditivas e benchmarks que posicionam você um passo à frente.",
  },
];

export function Consultor() {
  return (
    <section id="consultor" className="relative bg-ink-50 py-24 md:py-32">
      <Container>
        <div className="grid gap-14 lg:grid-cols-[1fr_1.1fr] lg:items-center lg:gap-20">
          <Reveal>
            <SectionLabel>Sou consultor</SectionLabel>
            <h2 className="mt-4 text-h2 font-bold leading-[1.08] tracking-[-0.02em] text-ink-900 md:text-[44px]">
              A plataforma que{" "}
              <span className="text-brand-orange">trabalha com você</span>, não para você.
            </h2>
            <p className="mt-5 max-w-xl text-body-lg text-ink-700/70">
              Escale sua operação de consultoria energética com ferramentas
              profissionais: gestão de carteira, análise de oportunidades e
              automação de ponta a ponta.
            </p>

            <ul className="mt-8 space-y-3">
              {["Menos planilha, mais decisão.", "Reduza o tempo de fechamento em até 60%.", "Dashboards white-label para seus clientes."].map((item, i) => (
                <motion.li
                  key={item}
                  initial={{ opacity: 0, x: -8 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.6 }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className="flex items-center gap-3 text-body text-ink-700"
                >
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-ink-900 text-white">
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path d="M1 5L4 8L9 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  {item}
                </motion.li>
              ))}
            </ul>

            <div className="mt-10 max-w-xs">
              <CTA href="#contact">Entrar em contato</CTA>
            </div>
          </Reveal>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="grid grid-cols-1 gap-4 sm:grid-cols-2"
          >
            {BENEFITS.map((b, i) => (
              <motion.div
                key={b.title}
                variants={fadeUp}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.3 }}
                className={
                  "group relative rounded-panel border border-ink-200 bg-white p-6 transition-all hover:border-ink-900 " +
                  (i % 2 === 0 ? "sm:translate-y-6" : "")
                }
              >
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-btn bg-ink-900 text-white transition-colors group-hover:bg-brand-orange">
                  {b.icon}
                </div>
                <h3 className="mt-5 text-base font-bold tracking-[-0.01em] text-ink-900">
                  {b.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-700/70">
                  {b.desc}
                </p>
                <span
                  aria-hidden
                  className="absolute right-5 top-5 text-[10px] font-semibold text-ink-300"
                >
                  0{i + 1}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
