# HASH — hashops.io

Production-ready marketing site for **HASH**, a business-intelligence and automation agency that builds operational systems for service businesses.

A single-page, award-grade build: an animated 3D HASH-glyph background, full motion choreography, a smooth dark/light theme, an interactive Notion-style workspace, and an interactive 7-Layer Ops Audit quiz — all on-brand (Obsidian-dark, Flame `#FF7A1A`, 70/25/5).

---

## Tech stack

| Area | Choice |
|---|---|
| Framework | **Next.js 14** (App Router) + **TypeScript** |
| Styling | **Tailwind CSS** with brand tokens mapped to CSS variables |
| 3D | **@react-three/fiber** + **@react-three/drei** + **@react-three/postprocessing** (Bloom, Vignette) |
| Motion | **Framer Motion** + **Lenis** (smooth scroll) |
| Fonts | **next/font** — Hanken Grotesk, Jost, JetBrains Mono |
| Theme | **next-themes** (persisted, system-aware) + View Transitions reveal |
| Booking | **Calendly** inline-in-modal popup, behind a single constant, with a confirmation state |

---

## Getting started

```bash
npm install
npm run dev          # http://localhost:3000
```

Other scripts:

```bash
npm run build        # production build
npm run start        # serve the production build
npm run lint         # eslint
```

Requires Node 18.18+ (Node 20+ recommended).

---

## Configuration

### 1. Calendly booking link — `CALENDLY_URL`

Every primary CTA (“Book your Ops Strategy Call”) opens a Calendly booking modal.

- **Recommended:** set an env var in `.env.local`:
  ```bash
  NEXT_PUBLIC_CALENDLY_URL="https://calendly.com/your-org/ops-strategy-call"
  ```
- **Or** edit the fallback constant directly in [`src/lib/constants.ts`](src/lib/constants.ts):
  ```ts
  export const CALENDLY_URL = process.env.NEXT_PUBLIC_CALENDLY_URL || "https://calendly.com/hashops/ops-strategy-call";
  ```

When a visitor finishes booking, the modal swaps to a built-in confirmation panel (it listens for Calendly’s `event_scheduled` message).

### 2. Walkthrough video (optional)

The “Watch how HASH works” block ships as a branded placeholder. Drop in a real video by setting:

```bash
NEXT_PUBLIC_WALKTHROUGH_URL="/walkthrough.mp4"   # or any mp4 URL
```

Put the file in `/public` (e.g. `public/walkthrough.mp4`) or point at a hosted URL. The play button then plays it inline. Logic lives in [`src/components/VideoBlock.tsx`](src/components/VideoBlock.tsx).

### 3. Brand logo + tool logos

- **HASH mark** is drawn in code at [`src/components/ui/HashMark.tsx`](src/components/ui/HashMark.tsx) (a tilted, Flame-gradient hashtag). It is reused everywhere a `#` is needed: the nav logo, the favicon (`src/app/icon.svg`), the workspace switcher, the audit console, section accents, and the OG image. A standalone copy lives at `public/hash-logo.svg`.
- **Tool-stack marks** are rendered as inline, theme-aware SVGs in [`src/components/ToolLogos.tsx`](src/components/ToolLogos.tsx). Standalone, swappable copies live in [`public/logos/`](public/logos). These are clean, stylized recreations in each brand’s colours — replace them with the brands’ official SVGs when you have them (keep the same filenames, or update `TOOL_LOGO_MAP`).

### Environment variables

| Variable | Purpose | Default |
|---|---|---|
| `NEXT_PUBLIC_CALENDLY_URL` | Booking link for every CTA | `calendly.com/hashops/ops-strategy-call` |
| `NEXT_PUBLIC_WALKTHROUGH_URL` | Real walkthrough video | _(placeholder shown)_ |

An example file is provided at [`.env.example`](.env.example).

---

## Project structure

```
src/
├── app/
│   ├── layout.tsx            # metadata, fonts, providers
│   ├── page.tsx              # single-page section assembly + JSON-LD
│   ├── providers.tsx         # theme + smooth scroll + booking
│   ├── globals.css           # tokens, theme transition, CTA styling
│   ├── fonts.ts              # next/font wiring
│   ├── icon.svg              # favicon (the # mark)
│   └── opengraph-image.tsx   # dynamic, on-brand OG image
├── components/
│   ├── three/                # 3D background (Canvas, instanced HASH field, geometry)
│   ├── providers/            # SmoothScroll (Lenis), BookingProvider (Calendly)
│   ├── ui/                   # Button, HashMark, Logo, Reveal, CountUp, ThemeToggle, …
│   ├── Nav, Hero, ToolMarquee, VideoBlock, LeakList
│   ├── OpsWorkspace          # interactive Notion-style workspace (5 views + 2 docs)
│   ├── OpsAuditQuiz          # interactive 7-Layer Ops Audit (3 stages)
│   ├── Timeline, ProofStats, CostBlock, Pricing, Testimonial, FAQ, FinalCTA, Footer
│   └── MobileCTABar          # sticky mobile “Book a call” bar
└── lib/
    ├── constants.ts          # CALENDLY_URL, nav, tools, site meta
    ├── audit-data.ts         # the 7 layers, verdicts, cost math
    ├── workspace-data.ts     # pipeline, KPIs, clients, tasks, automations, docs
    └── utils.ts
```

### Editing content

- **Copy / sections:** each section component holds its own copy.
- **Audit questions, cost lines, verdicts:** [`src/lib/audit-data.ts`](src/lib/audit-data.ts).
- **Workspace data (all illustrative):** [`src/lib/workspace-data.ts`](src/lib/workspace-data.ts).
- **Pricing tiers, FAQ, proof stats, testimonial:** in their respective components.

---

## Theming

Every colour is a theme-aware CSS variable (see `:root` and `:root.light` in `globals.css`). Toggle in the nav:

- Persisted to `localStorage`, defaults to the system preference.
- Switches via the **View Transitions API** (a circular reveal from the toggle) where supported, with a smooth CSS colour cross-fade fallback everywhere else.
- Flame text biases toward Ember `#E55A00` in light mode for WCAG AA contrast.

---

## 3D background

- An instanced field of extruded, Flame-lit HASH glyphs drifting in obsidian space, with Bloom, fog-based depth, cursor parallax, and a scroll-driven camera dolly.
- **Performance:** code-split (never in the initial bundle, never on the server), capped pixel ratio, instance count scaled by viewport + CPU cores, pauses when the tab is hidden or the hero is scrolled well out of view, fades out below the fold.
- **Accessibility:** fully disabled under `prefers-reduced-motion` (and on any WebGL failure), falling back to a clean static Flame/grid backdrop.

---

## Performance & accessibility

- Server-rendered content, code-split 3D, lazy Calendly script (loads only on first “Book”).
- Real heading hierarchy, visible focus states, `aria` on interactive controls, AA-biased contrast.
- `prefers-reduced-motion` disables the 3D loop, parallax, marquee, and reveals.
- Responsive, mobile-first: the nav collapses to a menu, the workspace scrolls horizontally, the quiz stays tappable, and a sticky mobile booking bar appears after the hero.

---

## Deploy

Any Node host or **Vercel** works out of the box:

```bash
npm run build && npm run start
```

Set `NEXT_PUBLIC_CALENDLY_URL` (and optionally `NEXT_PUBLIC_WALKTHROUGH_URL`) in your host’s environment.

---

See [`CHANGES.md`](CHANGES.md) for the improvements made on top of the brief.
