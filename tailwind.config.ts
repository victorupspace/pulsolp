import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          orange: "#E65100",
          orangeHover: "#CC4800",
        },
        surface: {
          DEFAULT: "#F2F0EE",
          50: "#F2F0EE",
        },
        ink: {
          DEFAULT: "#111111",
          900: "#0A0A0A",
          800: "#1A1A1A",
          700: "#222222",
          600: "#3A3A3A",
          500: "#6B6B6B",
          400: "#9A9A9A",
          300: "#C8C8C8",
          200: "#E5E5E5",
          100: "#F2F2F2",
          50: "#FAFAFA",
        },
      },
      fontFamily: {
        sans: ["var(--font-jakarta)", "system-ui", "sans-serif"],
      },
      fontSize: {
        "h1-d": ["clamp(2.5rem, 5.8vw, 3.5rem)", { lineHeight: "1.05", letterSpacing: "-0.025em" }],
        "h1-m": ["2.5rem", { lineHeight: "1.08", letterSpacing: "-0.02em" }],
        "h2": ["clamp(1.75rem, 3.5vw, 2rem)", { lineHeight: "1.15", letterSpacing: "-0.015em" }],
        "body-lg": ["1.125rem", { lineHeight: "1.55" }],
        "body": ["0.9375rem", { lineHeight: "1.6" }],
        "btn": ["0.8125rem", { lineHeight: "1", letterSpacing: "0.01em" }],
        "overline": ["0.6875rem", { lineHeight: "1", letterSpacing: "0.14em" }],
        "micro": ["0.625rem", { lineHeight: "1.2", letterSpacing: "0.08em" }],
      },
      borderRadius: {
        xs: "4px",
        btn: "6px",
        card: "8px",
        panel: "12px",
        lg2: "16px",
      },
      keyframes: {
        pulseDot: {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(34,197,94,0.55)" },
          "50%": { boxShadow: "0 0 0 6px rgba(34,197,94,0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
      },
      animation: {
        pulseDot: "pulseDot 2s ease-in-out infinite",
        shimmer: "shimmer 3s linear infinite",
        float: "float 6s ease-in-out infinite",
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
};

export default config;
