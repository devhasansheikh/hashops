/**
 * Auto-scrolling tool-stack marquee (~28s loop, pause on hover, edge fade).
 * Brand SVGs live in /public/logos — full original colours, no tiles.
 * Monochrome marks (Notion, OpenAI) render via CSS mask in the theme's
 * heading colour so they read in both themes.
 */

type Tool = { name: string; src: string; mono?: boolean; wide?: boolean };

const TOOLS: Tool[] = [
  { name: "Notion", src: "/logos/notion.svg", mono: true },
  { name: "Claude", src: "/logos/claude.svg" },
  { name: "OpenAI", src: "/logos/openai.svg", mono: true },
  { name: "Make", src: "/logos/make.svg" },
  { name: "n8n", src: "/logos/n8n.svg", wide: true },
  { name: "Zapier", src: "/logos/zapier.svg" },
  { name: "Slack", src: "/logos/slack.svg" },
  { name: "Airtable", src: "/logos/airtable.svg" },
  { name: "ClickUp", src: "/logos/clickup.svg" },
  { name: "Stripe", src: "/logos/stripe.svg" },
  { name: "Calendly", src: "/logos/calendly.svg" },
  { name: "Google Workspace", src: "/logos/google-workspace.svg" },
];

function ToolItem({ tool, hidden }: { tool: Tool; hidden?: boolean }) {
  return (
    <div
      className="group mx-8 flex items-center gap-2.5 opacity-90 transition-opacity duration-300 hover:opacity-100"
      aria-hidden={hidden}
    >
      {tool.mono ? (
        <span
          className="logo-mask h-6 w-6 opacity-80 transition-all duration-300 group-hover:scale-110 group-hover:opacity-100"
          style={{
            WebkitMaskImage: `url(${tool.src})`,
            maskImage: `url(${tool.src})`,
          }}
        />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={tool.src}
          alt=""
          className={`${
            tool.wide ? "h-5 w-auto" : "h-6 w-auto"
          } transition-transform duration-300 group-hover:scale-110`}
          loading="lazy"
        />
      )}
      <span className="whitespace-nowrap font-display text-[14px] font-medium text-bodystrong transition-colors duration-300 group-hover:text-heading">
        {tool.name}
      </span>
    </div>
  );
}

export function ToolMarquee() {
  return (
    <section
      aria-label="Tools we build on"
      className="relative border-y border-line bg-surface/50 py-8 backdrop-blur-sm"
    >
      <p className="px-5 text-center font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted">
        Systems built on the tools you already pay for
      </p>
      <div className="marquee mt-6">
        <div className="marquee-track items-center">
          {TOOLS.map((tool) => (
            <ToolItem key={tool.name} tool={tool} />
          ))}
          {TOOLS.map((tool) => (
            <ToolItem key={`${tool.name}-dup`} tool={tool} hidden />
          ))}
        </div>
      </div>
    </section>
  );
}
