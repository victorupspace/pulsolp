"use client";

import { motion } from "framer-motion";
import { Network, ShieldCheck, LineChart, Layers } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { CTA } from "@/components/ui/CTA";
import { Reveal } from "@/components/ui/Reveal";
import { fadeUp, stagger } from "@/lib/motion";

const BENEFITS = [
  {
    icon: <Network size={18} />,
    title: "Escala operacional",
    desc: "Gerencie milhares de contratos com performance industrial e APIs robustas.",
  },
  {
    icon: <ShieldCheck size={18} />,
    title: "Conformidade regulatória",
    desc: "Integração com CCEE, ANEEL e sistemas fiscais para operar com segurança.",
  },
  {
    icon: <LineChart size={18} />,
    title: "Inteligência preditiva",
    desc: "Modelos de precificação, curva de carga e gestão de risco em tempo real.",
  },
  {
    icon: <Layers size={18} />,
    title: "Infraestrutura robusta",
    desc: "Arquitetura cloud-native com 99.99% de uptime e auditoria completa.",
  },
];

export function Comercializadora() {
  return (
    <section
      id="comercializadora"
      className="relative overflow-hidden bg-ink-900 py-24 text-white md:py-32"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "radial-gradient(circle at 85% 10%, rgba(230,81,0,0.22), transparent 40%), radial-gradient(circle at 15% 90%, rgba(230,81,0,0.08), transparent 50%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      <Container className="relative">
        <div className="grid gap-14 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:gap-20">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="order-2 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:order-1"
          >
            {BENEFITS.map((b, i) => (
              <motion.div
                key={b.title}
                variants={fadeUp}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.3 }}
                className={
                  "group relative rounded-panel border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm transition-all hover:border-brand-orange hover:bg-white/[0.06] " +
                  (i % 2 === 1 ? "sm:translate-y-6" : "")
                }
              >
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-btn border border-white/10 bg-white/5 text-white transition-colors group-hover:border-brand-orange group-hover:bg-brand-orange">
                  {b.icon}
                </div>
                <h3 className="mt-5 text-base font-bold tracking-[-0.01em] text-white">
                  {b.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-white/60">
                  {b.desc}
                </p>
                <span
                  aria-hidden
                  className="absolute right-5 top-5 text-[10px] font-semibold text-white/25"
                >
                  0{i + 1}
                </span>
              </motion.div>
            ))}
          </motion.div>

          <Reveal className="order-1 lg:order-2">
            <SectionLabel inverse>Sou comercializadora</SectionLabel>
            <h2 className="mt-4 text-h2 font-bold leading-[1.08] tracking-[-0.02em] text-white md:text-[44px]">
              Tecnologia de nível institucional para{" "}
              <span className="text-brand-orange">operar em escala</span>.
            </h2>
            <p className="mt-5 max-w-xl text-body-lg text-white/70">
              Da originação à liquidação, a Pulso oferece a espinha dorsal
              digital para comercializadoras que precisam de velocidade,
              conformidade e controle total.
            </p>

            <dl className="mt-10 grid grid-cols-3 gap-6 border-t border-white/10 pt-8">
              <Stat k="99.99%" v="Uptime" />
              <Stat k="< 50ms" v="Latência API" />
              <Stat k="24/7" v="Suporte" />
            </dl>

            <div className="mt-10 max-w-xs">
              <CTA href="#contact">Entrar em contato</CTA>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}

function Stat({ k, v }: { k: string; v: string }) {
  return (
    <div>
      <dt className="text-2xl font-bold text-white md:text-3xl">{k}</dt>
      <dd className="mt-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-white/50">
        {v}
      </dd>
    </div>
  );
}
