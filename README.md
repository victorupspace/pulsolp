# Pulso — Landing Page

Landing page da **Pulso**, plataforma SaaS para o mercado livre de energia.

## Stack

- **Next.js 14** (App Router)
- **React 18 + TypeScript**
- **Tailwind CSS** (design tokens do VBL)
- **Framer Motion** (microinterações e reveal)
- **GSAP + ScrollTrigger** (parallax do hero, scroll-linked)
- **Plus Jakarta Sans** (Google Fonts, auto-otimizada)

## Setup

```bash
npm install
npm run dev
```

Abra `http://localhost:3000`.

## Assets esperados

- `public/assets/videos/hero.mp4` — vídeo do hero (autoplay, muted, loop)
- `public/assets/videos/hero.webm` — alternativa webm (opcional)
- `public/assets/images/hero-poster.jpg` — fallback/poster do vídeo

## Estrutura

```
src/
  app/              Next.js App Router (layout, page, globals)
  components/
    layout/         Header, Footer
    sections/       Hero, MLE, Consultor, Comercializadora, ConsumidorFinal
    ui/             CTA, Container, Logo, Reveal, SectionLabel
  hooks/            useScrollState
  lib/              cn, motion (variants, easings)
public/assets/      videos, images, logos
```

## Design system

Tokens mapeados do `vbl-pulso.json` em `tailwind.config.ts`:

- `brand.orange` / `brand.orangeHover`
- `ink.900 … ink.50` (escala de pretos/cinzas)
- Tipografia: `h1-d`, `h1-m`, `h2`, `body-lg`, `body`, `btn`, `overline`
- Raios: `btn` (6px), `card` (8px), `panel` (12px), `lg2` (16px)

## CTAs (regra global)

Todos os CTAs usam o componente `<CTA />`: full-width, borda, background laranja, texto branco, hover com scale + brilho, easing `cubic-bezier(0.22,1,0.36,1)`.

## Acessibilidade

- `prefers-reduced-motion` respeitado
- focus rings visíveis
- alt/aria nos ícones e botões
- contraste AA mínimo nos textos sobre background escuro
