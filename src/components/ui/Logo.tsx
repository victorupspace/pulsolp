import { cn } from "@/lib/cn";

type LogoProps = {
  variant?: "dark" | "light";
  className?: string;
  ariaLabel?: string;
};

export function Logo({ variant = "dark", className, ariaLabel = "Pulso" }: LogoProps) {
  const textColor = variant === "dark" ? "#111111" : "#FFFFFF";
  const wave1 = "#E65100";
  const wave2 = variant === "dark" ? "#E65100" : "#E65100";
  const wave3 = variant === "dark" ? "#F5B894" : "#7A2D00";

  return (
    <div className={cn("inline-flex items-center gap-3", className)} aria-label={ariaLabel}>
      <svg
        width="44"
        height="36"
        viewBox="0 0 64 52"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        <path
          d="M4 12 C 14 0, 22 24, 32 12 S 50 0, 60 12"
          stroke={wave1}
          strokeWidth="5"
          strokeLinecap="round"
          fill="none"
          opacity="1"
        />
        <path
          d="M4 26 C 14 14, 22 38, 32 26 S 50 14, 60 26"
          stroke={wave2}
          strokeWidth="5"
          strokeLinecap="round"
          fill="none"
          opacity="0.7"
        />
        <path
          d="M4 40 C 14 28, 22 52, 32 40 S 50 28, 60 40"
          stroke={wave3}
          strokeWidth="5"
          strokeLinecap="round"
          fill="none"
          opacity="0.55"
        />
      </svg>
      <span
        className="text-[2rem] font-extrabold tracking-[-0.04em] leading-none"
        style={{ color: textColor }}
      >
        pulso
        <span className="text-brand-orange">.</span>
      </span>
    </div>
  );
}
