# CHANGES — deviations and improvements vs. the brief

Everything the brief locks is preserved: brand tokens, voice rules, the
7-Layer audit quiz, the interactive workspace, price-free pricing, the
availability pill, the tool-stack bar, the video placeholder, and the
"Book your Ops Strategy Call" CTA. The changes below are improvements or
judgement calls, with the reasoning.

1. **3D background extends the imagery rules.** The brief predates the 3D
   mandate in the build prompt. The scene is built from the brand's own
   tilted `#` mark (structural shapes, obsidian + Flame, 70/25/5), not
   generic isometric 3D, so it follows the spirit of the imagery section.

2. **Two doc views added to the workspace.** The sidebar's "Docs" items
   (Bottleneck report, SOP library) are clickable views, not dead links. A
   demo with dead navigation reads as a mockup; these two views also quietly
   sell the audit deliverable and the documentation habit.

3. **Quiz "How HASH fixes this" copy written from the PDF's closing page**
   (60-minute diagnostic, written report on top 3 bottlenecks, clear
   roadmap), since the brief specifies the callout but not its text.

4. **Verdict sub-lines and intro/result microcopy written in-voice** where
   the brief only gave the verdict titles.

5. **Pricing card CTAs differentiated** ("Book the audit call" / "Book your
   Ops Strategy Call" / "Book a scoping call") instead of three identical
   labels. All open the same Calendly modal; the featured tier keeps the
   exact primary label.

6. **FAQ copy lightly de-em-dashed** per the punctuation rule (meaning
   unchanged, ranges keep their en dashes).

7. **Footer "socials/legal" slot simplified to contact + site nav.** No
   real social URLs or legal pages exist yet; placeholder icons linking
   nowhere would violate the "no placeholders" rule. Add real URLs in
   `components/Footer.tsx` when they exist.

8. **Testimonial is an in-voice placeholder** (clearly marked in the
   component) pending a real client quote, as the brief anticipates.

9. **Tool logos: 4 official-geometry, 8 recreations.** Slack, Google "G",
   Airtable, and ClickUp ship with official path geometry in exact brand
   colours. Claude, OpenAI, Notion, Make, n8n, Zapier, Stripe, and Calendly
   are clean recreations in each brand's exact colour; swap in official
   press-kit SVGs before launch for pixel-perfection (see README).

10. **Section numbering added to eyebrows** (01–09) as a quiet editorial
    device; it reinforces the "documented, systematic" positioning.

11. **"Most chosen" tier is pre-lifted on desktop** (raised above its
    siblings) to read as featured without adding colour beyond the 5%
    Flame budget.
