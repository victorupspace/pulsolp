import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jakarta",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Pulso — Software para o mercado livre de energia",
  description:
    "A plataforma que conecta consultores, comercializadoras e consumidores do mercado livre de energia. Automação, dados em tempo real e tecnologia de ponta.",
  keywords: [
    "mercado livre de energia",
    "software de energia",
    "consultoria energética",
    "comercializadora de energia",
    "Pulso",
    "MLE",
  ],
  authors: [{ name: "Pulso" }],
  openGraph: {
    title: "Pulso — Software para o mercado livre de energia",
    description:
      "Energia inteligente, decisões precisas. A Pulso é a plataforma para quem opera no mercado livre.",
    type: "website",
    locale: "pt_BR",
    siteName: "Pulso",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pulso — Software para o mercado livre de energia",
    description:
      "Energia inteligente, decisões precisas. A plataforma para quem opera no mercado livre.",
  },
  robots: { index: true, follow: true },
  icons: {
    icon: [{ url: "/assets/favicon.svg", type: "image/svg+xml" }],
    shortcut: "/assets/favicon.svg",
    apple: "/assets/favicon.svg",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ffffff",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={jakarta.variable}>
      <body>{children}</body>
    </html>
  );
}
