# CHANGES — improvements made on top of the brief

The brand system (Obsidian-dark, Flame `#FF7A1A`, 70/25/5), the voice rules, and the two named interactive components (the Notion-style workspace and the 7-Layer Ops Audit quiz) are all preserved. Below are the meaningful enhancements and decisions made, per the brief’s invitation to improve where things are weak or improvable.

## Interactive components

- **Audit quiz enriched from HASH’s own framework (the PDF).** The brief’s yes/no questions and cost lines remain the source of truth. On top of them, each layer in `src/lib/audit-data.ts` now also carries the framework’s open *diagnostic question* and concrete *red flags*, available for richer diagnosis/detail. Added small helper sub-labels under the **Yes / No** buttons (“That’s us” / “We’ve got this”) so the “Yes = red flag” semantics read instantly. Authored concise verdict sub-lines for the 0, 1–2, and 5–7 tiers (the brief fully specified only 3–4), in voice.
- **Workspace docs made functional.** The brief’s sidebar lists a “Docs” section (Bottleneck report, SOP library). Rather than leave them as dead links, both are real, populated views — a severity-tagged bottleneck report and a status-tagged SOP library — so all sidebar items do something.
- **Workspace polish.** Dashboard KPI tiles stagger in, the “weekly hours recovered” bar chart animates on view, kanban cards lift, the clients table highlights rows, and tasks/automations have working checkboxes/toggles with live status dots.

## Motion & theming

- **Buttery, lag-free theme switch.** Beyond a basic toggle, theme changes use the **View Transitions API** (a circular reveal from the toggle button) where supported, with a smooth CSS colour cross-fade fallback everywhere else — so the switch never “flashes” or janks.
- **Page-load hero intro.** The hero resolves in with a staggered entrance (one of the suggested follow-ups), plus a subtle scroll cue.
- **Sticky mobile booking bar.** A sticky “Book your Ops Strategy Call” bar appears on small screens after the hero and hides near the footer (suggested follow-up).

## 3D background

- **Depth via fog + Bloom instead of a dedicated depth-of-field pass.** The brief floated DoF as an option; a real-time DoF pass is the most expensive and least stable post effect. Fog-based depth + a tuned Bloom delivers the same premium “depth” read while guaranteeing smoothness on mid/low-power devices. Postprocessing is wrapped in an **error boundary** that falls back to a clean static Flame/grid backdrop on any WebGL failure.
- **Adaptive performance.** Instance count and pixel ratio scale by viewport width and CPU cores; the loop pauses when the tab is hidden or the hero is well out of view, and the canvas fades below the fold. Fully disabled under `prefers-reduced-motion`.

## Copy & voice

- **Em dashes minimised.** The framework PDF and a few brief lines used em dashes; cost lines and surrounding copy were rephrased with commas/colons/separate sentences per the punctuation rule, keeping numeric en dashes (e.g. 2–4 weeks).
- **Cost block framing.** The raw numbers from the brief are kept, presented as a status-quo-vs-one-time-build comparison with count-up animation and short outcome tags (“lost every year”, “then it’s margin”).
- **Proof section.** Build specifics (5 AI agents, 30 automations, etc.) became mono “spec” chips, and the two blocks alternate their layout to avoid a wall of identical cards (per the §5.6 layout guidance).

## SEO, assets & structure

- **Dynamic OG image** generated on-brand via `next/og` (`src/app/opengraph-image.tsx`) instead of a static placeholder.
- **JSON-LD** `Organization` structured data added on the page for richer search results.
- **The `#` is always the logo mark.** A single `HashMark` SVG component is reused for the nav logo, favicon, workspace switcher, audit console, section accents, testimonial watermark, final-CTA watermark, and the OG image — never a typed `#`.
- **Tool marks** are inline, theme-aware SVGs (the two inherently monochrome marks, Notion and OpenAI, follow the theme’s heading colour). Swappable standalone copies are shipped in `/public/logos`; these are clean stylized recreations in each brand’s colours, intended to be replaced with official brand SVGs.
- **Nav mapping.** Since the brief replaces the generic “services” section with the workspace + audit, the nav’s “Services” link points at the HASH Ops System workspace (`#system`); Audit/Work/Pricing/FAQ map to their sections.

## Notes / honest scope

- There are only two real case studies; proof stays honest (no invented logos or testimonials beyond the placeholder the brief specifies).
- Calendly uses the real inline widget inside a branded modal with a confirmation state. With the default placeholder URL the widget will show Calendly’s own “not found” until you set `NEXT_PUBLIC_CALENDLY_URL` (see README).
- The audit’s cost multiplier (`reds × 3` hrs/week) is the brief’s transparent lead-magnet estimate and is centralised in `src/lib/audit-data.ts` for easy tuning.
