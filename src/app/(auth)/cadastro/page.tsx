"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { AuthShell } from "@/components/auth/AuthShell";
import { StepAccountType } from "@/components/auth/StepAccountType";
import { StepConsultorForm } from "@/components/auth/StepConsultorForm";
import { StepComercializadoraForm } from "@/components/auth/StepComercializadoraForm";
import { StepSuccess } from "@/components/auth/StepSuccess";
import type {
  AccountType,
  ComercializadoraForm,
  ConsultorForm,
} from "@/components/auth/types";

type StepIndex = 1 | 2 | 3;

export default function CadastroPage() {
  const [step, setStep] = useState<StepIndex>(1);
  const [accountType, setAccountType] = useState<AccountType | null>(null);

  function goToStep2() {
    if (!accountType) return;
    setStep(2);
  }

  function backToStep1() {
    setStep(1);
  }

  async function handleConsultorSubmit(_data: ConsultorForm) {
    // TODO: integrar com Supabase
    await fakeLatency();
    setStep(3);
  }

  async function handleComercializadoraSubmit(_data: ComercializadoraForm) {
    // TODO: integrar com Supabase
    await fakeLatency();
    setStep(3);
  }

  const mediaVariant = step === 1 ? "intro" : step === 2 ? "form" : "success";

  return (
    <AuthShell
      step={step}
      onBack={step === 2 ? backToStep1 : undefined}
      mediaVariant={mediaVariant}
    >
      <AnimatePresence mode="wait">
        {step === 1 && (
          <StepAccountType
            key="step-1"
            selected={accountType}
            onSelect={setAccountType}
            onContinue={goToStep2}
          />
        )}

        {step === 2 && accountType === "consultor" && (
          <StepConsultorForm
            key="step-2-consultor"
            onCancel={backToStep1}
            onSubmit={handleConsultorSubmit}
          />
        )}

        {step === 2 && accountType === "comercializadora" && (
          <StepComercializadoraForm
            key="step-2-comercializadora"
            onCancel={backToStep1}
            onSubmit={handleComercializadoraSubmit}
          />
        )}

        {step === 3 && accountType && (
          <StepSuccess key="step-3" accountType={accountType} />
        )}
      </AnimatePresence>
    </AuthShell>
  );
}

function fakeLatency() {
  return new Promise((r) => setTimeout(r, 500));
}
