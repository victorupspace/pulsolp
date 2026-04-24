"use client";

import { motion } from "framer-motion";
import { PiggyBank, Leaf, Gauge, Headphones } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { CTA } from "@/components/ui/CTA";
import { Reveal } from "@/components/ui/Reveal";
import { fadeUp, stagger } from "@/lib/motion";

const BENEFITS = [
  {
    icon: <PiggyBank size={20} />,
    title: "Economia real",
    desc: "Reduza até 35% da sua conta de luz sem obras e sem dor de cabeça.",
  },
  {
    icon: <Leaf size={20} />,
    title: "Energia limpa",
    desc: "Contratos 100% renováveis certificados — mais ESG para sua empresa.",
  },
  {
    icon: <Gauge size={20} />,
    title: "Monitoramento em tempo real",
    desc: "Acompanhe consumo, faturas e economia direto do seu painel Pulso.",
  },
  {
    icon: <Headphones size={20} />,
    title: "Suporte especializado",
    desc: "Time dedicado para migração, operação e otimização contínua.",
  },
];

export function ConsumidorFinal() {
  return (
    <section id="consumidor" className="relative bg-white py-24 md:py-32">
      <Container>
        <Reveal className="mx-auto max-w-3xl text-center">
          <div className="flex justify-center">
            <SectionLabel>Sou consumidor final</SectionLabel>
          </div>
          <h2 className="mt-4 text-h2 font-bold leading-[1.08] tracking-[-0.02em] text-ink-900 md:text-[44px]">
            Economize mais.{" "}
            <span className="text-brand-orange">Sem complicação.</span>
          </h2>
          <p className="mt-5 text-body-lg text-ink-700/70">
            Migre para o mercado livre com quem entende do assunto. A Pulso
            cuida de tudo — análise, contrato, migração e operação — enquanto
            você foca no seu negócio.
          </p>
        </Reveal>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          {BENEFITS.map((b) => (
            <motion.div
              key={b.title}
              variants={fadeUp}
              whileHover={{ y: -6 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="group relative overflow-hidden rounded-panel border border-ink-200 bg-ink-50 p-7 transition-all hover:border-ink-900 hover:bg-white"
            >
              <div
                aria-hidden
                className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-brand-orange/0 blur-2xl transition-all duration-500 group-hover:bg-brand-orange/15"
              />
              <div className="relative inline-flex h-12 w-12 items-center justify-center rounded-btn bg-white text-ink-900 ring-1 ring-ink-200 transition-all group-hover:bg-brand-orange group-hover:text-white group-hover:ring-brand-orange">
                {b.icon}
              </div>
              <h3 className="relative mt-6 text-lg font-bold leading-snug tracking-[-0.01em] text-ink-900">
                {b.title}
              </h3>
              <p className="relative mt-2 text-sm leading-relaxed text-ink-700/70">
                {b.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>

        <Reveal className="mt-20">
          <div className="relative overflow-hidden rounded-panel bg-ink-900 px-8 py-14 md:px-16 md:py-20">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-50"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 80% 20%, rgba(230,81,0,0.25), transparent 45%)",
              }}
            />
            <div className="relative grid items-center gap-10 md:grid-cols-[1.3fr_1fr]">
              <div>
                <h3 className="text-h2 font-bold leading-[1.1] tracking-[-0.02em] text-white md:text-[40px]">
                  Pronto para pagar{" "}
                  <span className="text-brand-orange">menos</span> na conta de
                  luz?
                </h3>
                <p className="mt-4 max-w-md text-body-lg text-white/70">
                  Faça uma simulação gratuita e descubra em minutos quanto sua
                  empresa pode economizar no mercado livre.
                </p>
              </div>
              <div className="w-full md:justify-self-end md:max-w-[320px]">
                <CTA href="#contact">Entrar em contato</CTA>
                <p className="mt-3 text-center text-[11px] text-white/40">
                  Resposta em menos de 24 horas.
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
