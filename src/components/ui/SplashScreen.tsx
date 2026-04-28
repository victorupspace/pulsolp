"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";

const ANIMATION_DURATION_MS = 2800;
const FADE_DURATION_MS = 600;

type Props = {
  storageKey: string;
};

export function SplashScreen({ storageKey }: Props) {
  const [phase, setPhase] = useState<"checking" | "showing" | "fading" | "done">("checking");
  const decided = useRef(false);

  useEffect(() => {
    if (decided.current) return;
    decided.current = true;

    if (typeof window === "undefined") {
      setPhase("done");
      return;
    }

    const alreadySeen = window.sessionStorage.getItem(storageKey) === "1";
    if (alreadySeen) {
      setPhase("done");
      return;
    }

    setPhase("showing");
  }, [storageKey]);

  useEffect(() => {
    if (phase === "done" && typeof window !== "undefined") {
      window.sessionStorage.setItem(storageKey, "1");
    }
  }, [phase, storageKey]);

  useEffect(() => {
    if (phase !== "showing") return;

    document.body.style.overflow = "hidden";
    const fadeTimer = window.setTimeout(() => setPhase("fading"), ANIMATION_DURATION_MS);
    const doneTimer = window.setTimeout(
      () => setPhase("done"),
      ANIMATION_DURATION_MS + FADE_DURATION_MS,
    );

    function dismiss() {
      window.clearTimeout(fadeTimer);
      window.clearTimeout(doneTimer);
      setPhase("fading");
      window.setTimeout(() => setPhase("done"), FADE_DURATION_MS);
    }

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape" || e.key === "Enter" || e.key === " ") dismiss();
    }

    document.addEventListener("keydown", onKey);

    return () => {
      document.removeEventListener("keydown", onKey);
      window.clearTimeout(fadeTimer);
      window.clearTimeout(doneTimer);
      document.body.style.overflow = "";
    };
  }, [phase]);

  if (phase === "done" || phase === "checking") return null;

  return (
    <div
      role="status"
      aria-label="Carregando Pulso"
      onClick={() => setPhase("fading")}
      className={cn(
        "fixed inset-0 z-[9999] flex items-center justify-center bg-white transition-opacity",
        phase === "fading" ? "opacity-0" : "opacity-100",
      )}
      style={{ transitionDuration: `${FADE_DURATION_MS}ms`, transitionTimingFunction: "cubic-bezier(0.45, 0, 0.55, 1)" }}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.025) 100%)",
        }}
      />
      <div className="relative flex h-[200px] w-[min(640px,80vw)] items-center justify-center">
        <SplashMark />
      </div>
    </div>
  );
}

function SplashMark() {
  return (
    <svg
      viewBox="0 0 640 200"
      preserveAspectRatio="xMidYMid meet"
      className="h-full w-full overflow-visible motion-reduce:[&_animate]:hidden motion-reduce:[&_animateTransform]:hidden"
    >
      <defs>
        <filter id="splash-glow" x="-300%" y="-300%" width="600%" height="600%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <g transform="translate(176, 95)">
        <path
          d="M0 -28 Q16 -38 32 -28 T64 -28 T96 -28"
          fill="none"
          stroke="#E65100"
          strokeWidth={3.5}
          strokeLinecap="round"
          strokeDasharray={120}
          strokeDashoffset={120}
          opacity={0.4}
        >
          <animate
            attributeName="stroke-dashoffset"
            values="120; 0"
            dur="800ms"
            begin="0ms"
            fill="freeze"
            calcMode="spline"
            keySplines="0.22 1 0.36 1"
          />
        </path>
        <path
          d="M0 -14 Q16 -24 32 -14 T64 -14 T96 -14"
          fill="none"
          stroke="#E65100"
          strokeWidth={3.5}
          strokeLinecap="round"
          strokeDasharray={120}
          strokeDashoffset={120}
          opacity={0.7}
        >
          <animate
            attributeName="stroke-dashoffset"
            values="120; 0"
            dur="800ms"
            begin="140ms"
            fill="freeze"
            calcMode="spline"
            keySplines="0.22 1 0.36 1"
          />
        </path>
        <path
          d="M0 0 Q16 -10 32 0 T64 0 T96 0"
          fill="none"
          stroke="#E65100"
          strokeWidth={3.5}
          strokeLinecap="round"
          strokeDasharray={120}
          strokeDashoffset={120}
          opacity={1}
        >
          <animate
            attributeName="stroke-dashoffset"
            values="120; 0"
            dur="800ms"
            begin="280ms"
            fill="freeze"
            calcMode="spline"
            keySplines="0.22 1 0.36 1"
          />
        </path>
      </g>

      <g
        fontFamily="var(--font-jakarta), 'Plus Jakarta Sans', system-ui, sans-serif"
        fontWeight={700}
        fontSize={80}
        fill="#0A0A0A"
        letterSpacing={-3.6}
      >
        {LETTERS.map((letter, i) => (
          <text key={letter.char} x={letter.x} y={117} opacity={0}>
            {letter.char}
            <animate
              attributeName="opacity"
              values="0; 1"
              dur="500ms"
              begin={`${900 + i * 60}ms`}
              fill="freeze"
            />
            <animateTransform
              attributeName="transform"
              type="translate"
              values="0 12; 0 0"
              dur="700ms"
              begin={`${900 + i * 60}ms`}
              fill="freeze"
              calcMode="spline"
              keySplines="0.22 1 0.36 1"
            />
          </text>
        ))}
      </g>

      <g transform="translate(488, 95)" filter="url(#splash-glow)">
        <circle cx={0} cy={0} r={0} fill="none" stroke="#E65100" strokeWidth={2} opacity={0}>
          <animate
            attributeName="r"
            values="0; 50"
            dur="1100ms"
            begin="1700ms"
            fill="freeze"
            calcMode="spline"
            keySplines="0.22 1 0.36 1"
          />
          <animate
            attributeName="opacity"
            values="0; 0.6; 0"
            dur="1100ms"
            begin="1700ms"
            fill="freeze"
            keyTimes="0; 0.4; 1"
          />
          <animate
            attributeName="stroke-width"
            values="3; 0.5"
            dur="1100ms"
            begin="1700ms"
            fill="freeze"
          />
        </circle>
        <circle cx={0} cy={0} r={0} fill="#E65100">
          <animate
            attributeName="r"
            values="0; 11; 8"
            dur="700ms"
            begin="1700ms"
            fill="freeze"
            calcMode="spline"
            keySplines="0.34 1.56 0.64 1; 0.45 0 0.55 1"
          />
        </circle>
      </g>
    </svg>
  );
}

const LETTERS = [
  { char: "p", x: 290 },
  { char: "u", x: 333 },
  { char: "l", x: 377 },
  { char: "s", x: 397 },
  { char: "o", x: 436 },
] as const;
