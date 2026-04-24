"use client";

import { motion } from "framer-motion";
import { Zap, TrendingDown, Shield, Users, Play } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Reveal } from "@/components/ui/Reveal";
import { fadeUp, stagger } from "@/lib/motion";

const FEATURES = [
  {
    icon: <Zap size={20} />,
    title: "Liberdade de escolha",
    desc: "Selecione fornecedores, contratos e preços conforme sua demanda real.",
  },
  {
    icon: <TrendingDown size={20} />,
    title: "Economia consistente",
    desc: "Reduza em até 35% o custo da energia em relação ao mercado cativo.",
  },
  {
    icon: <Shield size={20} />,
    title: "Previsibilidade",
    desc: "Contratos de longo prazo com preços estáveis e protegidos da volatilidade.",
  },
  {
    icon: <Users size={20} />,
    title: "Quem pode migrar",
    desc: "Empresas com consumo acima de 500 kW, indústrias e comércios de médio porte.",
  },
];

export function MLE() {
  return (
    <section id="mle" className="relative bg-white py-24 md:py-32">
      <Container>
        <div className="grid gap-16 lg:grid-cols-[0.9fr_1.1fr] lg:items-start lg:gap-20">
          <Reveal>
            <SectionLabel>O que é o mercado livre</SectionLabel>
            <h2 className="mt-4 text-h2 font-bold leading-[1.1] tracking-[-0.02em] text-ink-900 md:text-[44px]">
              O mercado livre de energia em uma explicação clara.
            </h2>
            <p className="mt-5 max-w-xl text-body-lg text-ink-700/70">
              É o ambiente onde empresas negociam energia diretamente com
              geradores e comercializadoras — escolhendo fonte, prazo e preço.
              Mais liberdade, mais economia, menos burocracia.
            </p>
          </Reveal>

          <Reveal delay={1}>
            <VideoCard />
          </Reveal>
        </div>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="mt-20 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          {FEATURES.map((f) => (
            <motion.div
              key={f.title}
              variants={fadeUp}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="group relative rounded-panel border border-ink-200 bg-white p-7 transition-colors hover:border-ink-900"
            >
              <div className="inline-flex h-11 w-11 items-center justify-center rounded-btn border border-ink-200 bg-ink-50 text-ink-900 transition-colors group-hover:border-brand-orange group-hover:bg-brand-orange group-hover:text-white">
                {f.icon}
              </div>
              <h3 className="mt-5 text-lg font-bold leading-snug tracking-[-0.01em] text-ink-900">
                {f.title}
              </h3>
              <p className="mt-2 text-sm text-ink-700/70">{f.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </section>
  );
}

function VideoCard() {
  return (
    <div className="relative aspect-[16/10] w-full overflow-hidden rounded-panel border border-ink-200 bg-ink-900">
      <div className="absolute inset-0 bg-gradient-to-br from-ink-800 via-ink-900 to-black" />
      <div
        aria-hidden
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "radial-gradient(circle at 30% 30%, rgba(230,81,0,0.4), transparent 50%), radial-gradient(circle at 70% 70%, rgba(230,81,0,0.2), transparent 50%)",
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      <button
        aria-label="Reproduzir vídeo"
        className="absolute inset-0 flex items-center justify-center"
      >
        <motion.span
          whileHover={{ scale: 1.08 }}
          transition={{ duration: 0.3 }}
          className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-brand-orange text-white shadow-[0_12px_40px_-8px_rgba(230,81,0,0.6)]"
        >
          <Play size={28} fill="white" className="translate-x-0.5" />
        </motion.span>
      </button>
      <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
        <div>
          <div className="text-overline font-semibold uppercase tracking-[0.14em] text-white/60">
            Assista em 90 segundos
          </div>
          <div className="mt-1.5 text-lg font-semibold text-white">
            Como funciona o mercado livre
          </div>
        </div>
      </div>
    </div>
  );
}
