"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Building2, Home, UserCheck } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { CTA } from "@/components/ui/CTA";
import { cn } from "@/lib/cn";
import { maskPhoneBR } from "@/lib/cadastro/masks";
import { fadeUp, stagger, EASE } from "@/lib/motion";
import { createHeroFormSubmission } from "@/lib/supabase/leads";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const CLIENT_TYPES = [
  { value: "consultor", label: "Sou consultor" },
  { value: "comercializadora", label: "Sou comercializadora" },
  { value: "consumidor", label: "Sou consumidor final" },
] as const;

type ClientType = (typeof CLIENT_TYPES)[number]["value"];

const ALL_REGIONS_OPTION = "Todas as regiões";

const BRAZIL_REGIONS = [
  ALL_REGIONS_OPTION,
  "Norte",
  "Nordeste",
  "Centro-Oeste",
  "Sudeste",
  "Sul",
];

const SEGMENTS = [
  "Comércio varejista",
  "Supermercado",
  "Restaurante ou bar",
  "Padaria",
  "Posto de combustível",
  "Hotelaria",
  "Clínica ou hospital",
  "Educação",
  "Indústria",
  "Condomínio",
  "Escritório ou serviços",
  "Logística ou galpão",
];

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

      <Container className="relative z-10 flex min-h-[100svh] max-w-[1280px] flex-col justify-center px-4 pb-20 pt-32 md:px-6 lg:px-6 lg:pb-24">
        <div className="grid gap-y-12 lg:grid-cols-[minmax(0,1fr)_minmax(400px,440px)] lg:grid-rows-[auto_auto] lg:items-start lg:gap-x-20 lg:gap-y-14 xl:gap-x-24">
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="visible"
            className="max-w-[660px] lg:col-start-1 lg:row-start-1"
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

            <motion.div variants={fadeUp} className="mt-8 w-full max-w-[620px]">
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/55">
                Selecione o seu perfil
              </p>
              <div className="grid gap-3 sm:grid-cols-3">
                <CTA
                  href="#consultor"
                  variant="glass"
                  size="sm"
                  icon={false}
                  leadingIcon={<UserCheck className="h-4 w-4" strokeWidth={2.3} />}
                  className="min-w-0"
                >
                  Consultor
                </CTA>
                <CTA
                  href="#comercializadora"
                  variant="glass"
                  icon={false}
                  size="sm"
                  leadingIcon={<Building2 className="h-4 w-4" strokeWidth={2.3} />}
                  className="min-w-0"
                >
                  Comercializadora
                </CTA>
                <CTA
                  href="#consumidor"
                  variant="glass"
                  size="sm"
                  icon={false}
                  leadingIcon={<Home className="h-4 w-4" strokeWidth={2.3} />}
                  className="min-w-0"
                >
                  Consumidor final
                </CTA>
              </div>
            </motion.div>

          </motion.div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="grid w-full max-w-[620px] grid-cols-[minmax(0,1fr)_1px_minmax(0,1fr)_1px_minmax(0,1fr)] items-stretch overflow-hidden rounded-lg2 bg-white/[0.035] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)] backdrop-blur-sm lg:col-start-1 lg:row-start-2"
          >
            <Metric label="Consumidores conectados" value="2.4k+" />
            <div className="my-4 w-px bg-white/[0.12]" />
            <Metric label="Economia média gerada" value="28%" />
            <div className="my-4 w-px bg-white/[0.12]" />
            <Metric label="Operações automatizadas" value="100%" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.35, ease: EASE }}
            className="relative w-full max-w-[440px] justify-self-start lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:self-end lg:justify-self-end"
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
    <div className="min-w-0 px-2 py-4 text-center sm:px-4">
      <div className="text-xl font-bold leading-none text-white sm:text-2xl">{value}</div>
      <div className="mt-2 text-[9px] font-semibold uppercase leading-tight tracking-[0.08em] text-white/50 sm:text-[10px]">
        {label}
      </div>
    </div>
  );
}

function ContactForm() {
  const [clientType, setClientType] = useState<ClientType | "">("");
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

  const handleClientTypeChange = (value: string) => {
    setClientType(value as ClientType | "");
    setSelectedRegions([]);
  };

  const toggleRegion = (region: string) => {
    setSelectedRegions((current) => {
      if (region === ALL_REGIONS_OPTION) {
        return current.includes(ALL_REGIONS_OPTION) ? [] : [ALL_REGIONS_OPTION];
      }

      if (current.includes(region)) {
        return current.filter((item) => item !== region);
      }

      return [...current.filter((item) => item !== ALL_REGIONS_OPTION), region];
    });
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitError(null);
    setSubmitSuccess(null);

    if (!clientType) {
      setSubmitError("Selecione o seu perfil de atuação.");
      return;
    }

    if (clientType === "consultor" && selectedRegions.length === 0) {
      setSubmitError("Selecione pelo menos uma região de atuação.");
      return;
    }

    const form = e.currentTarget;
    const formData = new FormData(form);
    const value = (name: string) => String(formData.get(name) ?? "").trim();
    const partnerNetwork = value("partnerNetwork");

    setSubmitting(true);
    try {
      await createHeroFormSubmission({
        fullName: value("name"),
        phone: value("phone"),
        email: value("email"),
        clientType,
        regions: clientType === "consultor" ? selectedRegions : [],
        hasPartnerNetwork:
          clientType === "comercializadora"
            ? partnerNetwork === "sim"
              ? true
              : partnerNetwork === "nao"
                ? false
                : null
            : null,
        commercializerSize:
          clientType === "comercializadora" ? value("companySize") || null : null,
        segment: clientType === "consumidor" ? value("segment") || null : null,
        monthlyEnergySpend:
          clientType === "consumidor" ? value("monthlyEnergySpend") || null : null,
      });

      form.reset();
      setClientType("");
      setSelectedRegions([]);
      setSubmitSuccess("Recebemos seus dados. Nosso time entra em contato em breve.");
    } catch {
      setSubmitError("Não foi possível enviar seus dados agora. Tente novamente em instantes.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      id="contact"
      onSubmit={handleSubmit}
      className="relative rounded-panel border border-white/10 bg-ink-900/60 p-6 backdrop-blur-xl md:p-8"
    >
      <div className="absolute -inset-px rounded-panel bg-gradient-to-br from-brand-orange/30 via-transparent to-transparent opacity-60 -z-10 blur-xl" />

      <div className="flex items-center gap-2">
        <span className="h-1.5 w-1.5 rounded-full bg-brand-orange" />
        <span className="text-overline font-semibold uppercase text-white/70">
          Diagnóstico comercial
        </span>
      </div>
      <h3 className="mt-3 text-2xl font-bold leading-tight tracking-[-0.01em]">
        Fale com um especialista
      </h3>
      <p className="mt-2 text-sm text-white/60">
        Conte um pouco sobre seu perfil para direcionarmos o melhor atendimento.
      </p>

      <div className="mt-6 space-y-3">
        <Input label="Nome completo" name="name" placeholder="Seu nome completo" required />
        <Input
          label="Telefone"
          name="phone"
          type="tel"
          inputMode="tel"
          placeholder="(11) 99999-9999"
          maxLength={15}
          onChange={(e) => {
            e.currentTarget.value = maskPhoneBR(e.currentTarget.value);
          }}
          required
        />
        <Input label="Email" name="email" type="email" placeholder="voce@empresa.com" required />
        <SelectField
          label="Perfil de atuação"
          name="clientType"
          value={clientType}
          onChange={handleClientTypeChange}
          placeholder="Selecione seu perfil"
          options={CLIENT_TYPES}
          required
        />

        {clientType === "consultor" && (
          <RegionSelector selectedRegions={selectedRegions} onToggle={toggleRegion} />
        )}

        {clientType === "comercializadora" && (
          <div className="space-y-3">
            <SelectField
              label="Já possui uma rede de parceiros?"
              name="partnerNetwork"
              placeholder="Selecione"
              options={[
                { value: "sim", label: "Sim" },
                { value: "nao", label: "Não" },
              ]}
              required
            />
            <SelectField
              label="Qual o porte da sua comercializadora?"
              name="companySize"
              placeholder="Selecione"
              options={[
                { value: "1-50", label: "1 - 50" },
                { value: "50-100", label: "50 - 100" },
                { value: "100+", label: "100+" },
              ]}
              required
            />
          </div>
        )}

        {clientType === "consumidor" && (
          <div className="space-y-3">
            <SelectField
              label="Qual seu segmento?"
              name="segment"
              placeholder="Selecione"
              options={SEGMENTS.map((segment) => ({ value: segment, label: segment }))}
              required
            />
            <SelectField
              label="Qual seu gasto médio mensal de energia?"
              name="monthlyEnergySpend"
              placeholder="Selecione"
              options={[
                { value: "0-1000", label: "R$ 0,00 a R$ 1.000,00 reais" },
                { value: "1000-5000", label: "R$ 1.000,00 a R$ 5.000,00 reais" },
                { value: "5000-10000", label: "R$ 5.000,00 a R$ 10.000,00 reais" },
                { value: "10000-15000", label: "R$ 10.000,00 a R$ 15.000,00 reais" },
                { value: "15000-30000", label: "R$ 15.000,00 a R$ 30.000,00 reais" },
                { value: "30000-50000", label: "R$ 30.000,00 a R$ 50.000,00 reais" },
                { value: "50000-100000", label: "R$ 50.000,00 a R$ 100.000,00 reais" },
                { value: "100000+", label: "R$ 100.000,00 reais ou mais" },
              ]}
              required
            />
          </div>
        )}
      </div>

      <div className="mt-6">
        <CTA type="submit" size="sm" disabled={submitting}>
          {submitting ? "Enviando..." : "Solicitar demonstração"}
        </CTA>
      </div>

      {(submitError || submitSuccess) && (
        <p
          className={cn(
            "mt-4 rounded-btn px-3 py-2 text-center text-[12px] font-medium",
            submitError
              ? "bg-red-500/10 text-red-200 shadow-[inset_0_0_0_1px_rgba(248,113,113,0.22)]"
              : "bg-green-500/10 text-green-200 shadow-[inset_0_0_0_1px_rgba(74,222,128,0.22)]",
          )}
        >
          {submitError ?? submitSuccess}
        </p>
      )}

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

type SelectOption = {
  value: string;
  label: string;
};

function SelectField({
  label,
  name,
  value,
  onChange,
  placeholder,
  options,
  required = false,
}: {
  label: string;
  name: string;
  value?: string;
  onChange?: (value: string) => void;
  placeholder: string;
  options: readonly SelectOption[];
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="block text-[11px] font-semibold uppercase tracking-[0.12em] text-white/50">
        {label}
      </span>
      <select
        name={name}
        value={value}
        required={required}
        onChange={(e) => onChange?.(e.target.value)}
        className="mt-1.5 w-full appearance-none rounded-btn border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none transition-all focus:border-brand-orange focus:bg-white/[0.06]"
      >
        <option value="" className="bg-ink-900 text-white">
          {placeholder}
        </option>
        {options.map((option) => (
          <option key={option.value} value={option.value} className="bg-ink-900 text-white">
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function RegionSelector({
  selectedRegions,
  onToggle,
}: {
  selectedRegions: string[];
  onToggle: (region: string) => void;
}) {
  const allRegionsSelected = selectedRegions.includes(ALL_REGIONS_OPTION);

  return (
    <fieldset>
      <legend className="block text-[11px] font-semibold uppercase tracking-[0.12em] text-white/50">
        Em quais regiões você atua?
      </legend>
      <div className="mt-2 grid grid-cols-2 gap-2">
        {BRAZIL_REGIONS.map((region) => {
          const selected = selectedRegions.includes(region);
          const disabled = allRegionsSelected && region !== ALL_REGIONS_OPTION;

          return (
            <button
              key={region}
              type="button"
              aria-pressed={selected}
              disabled={disabled}
              onClick={() => onToggle(region)}
              className={cn(
                "rounded-btn px-3 py-2 text-left text-xs font-semibold transition-all",
                selected
                  ? "bg-brand-orange text-white shadow-[0_10px_24px_-16px_rgba(230,81,0,0.8)]"
                  : "bg-white/[0.04] text-white/[0.65] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)] hover:bg-white/[0.08] hover:text-white",
                disabled && "cursor-not-allowed opacity-[0.35] hover:bg-white/[0.04] hover:text-white/[0.65]",
              )}
            >
              {region}
            </button>
          );
        })}
      </div>
      <p className="mt-2 text-[11px] text-white/[0.38]">
        Selecione quantas regiões quiser. Ao escolher todas, as outras opções ficam desabilitadas.
      </p>
    </fieldset>
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
