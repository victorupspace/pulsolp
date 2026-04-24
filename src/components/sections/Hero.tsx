"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Container } from "@/components/ui/Container";
import { CTA } from "@/components/ui/CTA";
import { fadeUp, stagger, EASE } from "@/lib/motion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function Hero() {
  const rootRef = useRef<HTMLElement>(null);
  const videoWrapRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!rootRef.current || !videoWrapRef.current) return;

    const ctx = gsap.context(() => {
      gsap.to(videoWrapRef.current, {
        yPercent: 12,
        scale: 1.08,
        ease: "none",
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    }, rootRef);

    const v = videoRef.current;
    if (v) {
      v.play().catch(() => {});
    }

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      id="top"
      className="relative min-h-[100svh] w-full overflow-hidden bg-ink-900 text-white"
    >
      <div
        ref={videoWrapRef}
        className="absolute inset-0 h-full w-full will-change-transform"
      >
        <video
          ref={videoRef}
          className="h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster="/assets/images/hero-poster.jpg"
        >
          <source src="/assets/videos/energy01.mov" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-ink-900/70 via-ink-900/50 to-ink-900/85" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.35)_90%)]" />
      </div>

      <Container className="relative z-10 flex min-h-[100svh] flex-col justify-center pt-32 pb-24">
        <div className="grid gap-16 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:gap-20">
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="visible"
          >
            <motion.div
              variants={fadeUp}
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 backdrop-blur-sm"
            >
              <span className="relative inline-flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full rounded-full bg-brand-orange animate-pulseDot" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-brand-orange" />
              </span>
              <span className="text-overline font-semibold uppercase text-white/80">
                Software para o mercado livre de energia
              </span>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="mt-7 text-h1-m md:text-h1-d font-extrabold leading-[1.03] tracking-[-0.03em] text-white"
            >
              Energia inteligente,{" "}
              <span className="relative inline-block">
                <span className="relative z-10 text-brand-orange">decisões</span>{" "}
                <span className="relative z-10">precisas</span>
              </span>
              .
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="mt-6 max-w-xl text-body-lg text-white/70"
            >
              A Pulso conecta consultores, comercializadoras e consumidores do
              mercado livre em uma plataforma única — com automação, dados em
              tempo real e tecnologia de ponta.
            </motion.p>

            <motion.div
              variants={fadeUp}
              className="mt-10 flex flex-col gap-3 sm:flex-row sm:gap-4"
            >
              <CTA href="#contact" className="sm:max-w-[260px]">
                Começar agora
              </CTA>
              <CTA href="#mle" variant="ghost" icon={false} className="sm:max-w-[240px]">
                Entenda o mercado livre
              </CTA>
            </motion.div>

            <motion.div
              variants={fadeUp}
              className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-4"
            >
              <Metric label="Consumidores conectados" value="2.4k+" />
              <div className="h-8 w-px bg-white/15 hidden sm:block" />
              <Metric label="Economia média gerada" value="28%" />
              <div className="h-8 w-px bg-white/15 hidden sm:block" />
              <Metric label="Operações automatizadas" value="100%" />
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.35, ease: EASE }}
            className="relative"
          >
            <ContactForm />
          </motion.div>
        </div>
      </Container>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.8 }}
        className="absolute bottom-6 left-1/2 z-10 hidden -translate-x-1/2 md:flex"
      >
        <ScrollHint />
      </motion.div>
    </section>
  );
}

function Metric({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div className="text-2xl font-bold text-white">{value}</div>
      <div className="mt-1 text-[11px] font-medium uppercase tracking-[0.12em] text-white/50">
        {label}
      </div>
    </div>
  );
}

function ContactForm() {
  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="relative rounded-panel border border-white/10 bg-ink-900/60 p-6 backdrop-blur-xl md:p-8"
    >
      <div className="absolute -inset-px rounded-panel bg-gradient-to-br from-brand-orange/30 via-transparent to-transparent opacity-60 -z-10 blur-xl" />

      <div className="flex items-center gap-2">
        <span className="h-1.5 w-1.5 rounded-full bg-brand-orange" />
        <span className="text-overline font-semibold uppercase text-white/70">
          Sou consumidor final
        </span>
      </div>
      <h3 className="mt-3 text-2xl font-bold leading-tight tracking-[-0.01em]">
        Fale com um especialista
      </h3>
      <p className="mt-2 text-sm text-white/60">
        Descubra em 48h quanto sua empresa pode economizar.
      </p>

      <div className="mt-6 space-y-3">
        <Input label="Nome" name="name" placeholder="Seu nome" />
        <Input label="E-mail corporativo" name="email" type="email" placeholder="voce@empresa.com" />
        <Input label="Consumo médio (R$/mês)" name="spend" placeholder="R$ 50.000" />
      </div>

      <div className="mt-6">
        <CTA type="submit">Solicitar demonstração</CTA>
      </div>

      <p className="mt-4 text-center text-[11px] text-white/40">
        Ao enviar, você concorda com nossa política de privacidade.
      </p>
    </form>
  );
}

function Input({
  label,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <label className="block">
      <span className="block text-[11px] font-semibold uppercase tracking-[0.12em] text-white/50">
        {label}
      </span>
      <input
        {...props}
        className="mt-1.5 w-full rounded-btn border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none transition-all focus:border-brand-orange focus:bg-white/[0.06]"
      />
    </label>
  );
}

function ScrollHint() {
  return (
    <div className="flex flex-col items-center gap-2">
      <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/50">
        Role para explorar
      </span>
      <div className="relative h-10 w-[1px] overflow-hidden bg-white/15">
        <motion.span
          className="absolute left-0 top-0 h-4 w-full bg-brand-orange"
          animate={{ y: [-16, 40] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
    </div>
  );
}
