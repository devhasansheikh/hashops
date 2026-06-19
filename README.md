# HASH — Operational Systems for Service Businesses

Production marketing site for [hashops.io](https://hashops.io). Next.js (App
Router) + TypeScript + Tailwind CSS, with a React Three Fiber 3D background,
Framer Motion + Lenis motion, a fully interactive Notion-style workspace demo,
and the 7-Layer Ops Audit diagnostic quiz.

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm start        # serve the production build
```

Node 18.18+ required. Fonts load through `next/font` (Hanken Grotesk, Jost,
JetBrains Mono), so the first build needs network access.

## Where to set things

| What | Where |
|---|---|
| **Calendly booking URL** | `lib/site.ts` → `CALENDLY_URL`. Every primary CTA (nav, hero, quiz, pricing, footer, final CTA) opens this in the booking modal. The modal shows a built-in confirmation state when Calendly fires its `event_scheduled` message. |
| **Contact email / nav links / CTA label** | `lib/site.ts` |
| **Hero walkthrough video** | `components/VideoBlock.tsx` → set `VIDEO_MP4` (e.g. `"/walkthrough.mp4"`, file in `/public`) **or** `VIDEO_EMBED` (YouTube/Loom/Vimeo embed URL). The placeholder disappears automatically. |
| **Official HASH logo** | `/public/hash-logo.svg` (already the supplied asset). The nav crops it to the mark via the `viewBox` in `components/Logo.tsx`. |
| **Tool-stack brand logos** | `/public/logos/*.svg`. Slack, the Google "G", Airtable, and ClickUp use the official path geometry in exact brand colours. The remaining marks are clean brand-colour recreations: **before launch, replace any you want pixel-perfect with the official SVGs from each brand's press kit** (same filenames, nothing else to change). Notion + OpenAI render through a CSS mask so they stay theme-aware; keep those single-colour. |
| **Quiz content** | `components/OpsAuditQuiz.tsx` → `LAYERS` (questions + cost lines from `HASH_7-Layer_Ops_Audit_Framework.pdf`) and `VERDICTS`. |
| **Workspace demo data** | `components/OpsWorkspace.tsx` (pipeline, KPIs, clients, tasks, automations — all illustrative). |
| **Testimonial** | `components/Testimonial.tsx` — placeholder copy, swap for a real quote once collected. |

## Theming

Both themes live as CSS variables in `app/globals.css` under
`[data-theme="dark"]` / `[data-theme="light"]`, switched by `next-themes`
(persisted, defaults to `prefers-color-scheme`). Tailwind tokens map to those
variables in `tailwind.config.ts`. Flame text on light backgrounds uses the
darker `--flame-text` (Ember-biased) for WCAG AA.

## Performance & accessibility notes

- The 3D layer (`components/three/`) lazy-loads client-side only, caps device
  pixel ratio, drops glyph count + bloom on small/low-core devices, fades with
  scroll, and **pauses its render loop** once you scroll past ~2.4 viewports.
- `prefers-reduced-motion` disables the WebGL loop entirely (static glow
  fallback), the marquee, reveals, count-ups, sheen, parallax, and smooth
  scroll.
- The workspace demo becomes horizontally scrollable below ~900px.

## Deploy

Built for Vercel: push the repo, import, done. No environment variables are
required (the Calendly URL is a constant by design).
