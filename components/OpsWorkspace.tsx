"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHead } from "@/components/ui/SectionHead";
import { Logo } from "@/components/Logo";

/* ------------------------------------------------------------------ */
/* Demo data — all numbers illustrative                                */
/* ------------------------------------------------------------------ */

type ViewKey =
  | "dashboard"
  | "pipeline"
  | "clients"
  | "tasks"
  | "automations"
  | "report"
  | "sop";

const PIPELINE: { stage: string; deals: { name: string; value: string }[] }[] =
  [
    {
      stage: "New Lead",
      deals: [
        { name: "Northwind Agency", value: "$3.2K" },
        { name: "Brightline Co.", value: "$2K" },
        { name: "Mason & Park", value: "$4.5K" },
      ],
    },
    {
      stage: "Qualified",
      deals: [
        { name: "Vertex Studio", value: "$5.5K" },
        { name: "Halcyon Group", value: "$7K" },
      ],
    },
    {
      stage: "Proposal",
      deals: [
        { name: "Aster Collective", value: "$8.2K" },
        { name: "Drift Media", value: "$3.8K" },
      ],
    },
    {
      stage: "Won",
      deals: [
        { name: "Al Fahim Ent.", value: "$6K" },
        { name: "Dema Consult.", value: "$2K" },
      ],
    },
  ];

const KPI_CARDS = [
  { label: "MRR", value: "$7,400", delta: "+18%", good: true, spark: [4, 5, 5, 6, 6, 7, 8, 9] },
  { label: "Pipeline", value: "$42K", delta: "+9%", good: true, spark: [6, 6, 7, 7, 8, 8, 9, 10] },
  { label: "Win rate", value: "32%", delta: "+4%", good: true, spark: [3, 4, 4, 5, 5, 5, 6, 7] },
  { label: "Avg cycle", value: "18d", delta: "−2d", good: true, spark: [9, 8, 8, 7, 7, 6, 6, 5] },
];

const REVENUE = [22, 26, 24, 30, 28, 34, 39, 42];
const REV_MONTHS = ["Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun"];

const STAGE_FUNNEL = [
  { stage: "New Lead", value: 9.7, count: 3, color: "#9B9BA3" },
  { stage: "Qualified", value: 12.5, count: 2, color: "#FFA033" },
  { stage: "Proposal", value: 12, count: 2, color: "#FF7A1A" },
  { stage: "Won", value: 8, count: 2, color: "#1D9E75" },
];

const ACTIVITY = [
  { tag: "Automation", txt: "filed call notes to Aster Collective", time: "2m", tone: "flame" },
  { tag: "You", txt: "moved Halcyon Group to Qualified", time: "1h", tone: "neutral" },
  { tag: "Ayesha", txt: "finished onboarding Al Fahim Ent.", time: "3h", tone: "neutral" },
  { tag: "Lead", txt: "Mason & Park entered the pipeline", time: "5h", tone: "success" },
];

const wsEase = [0.2, 0.7, 0.3, 1] as const;

const CLIENTS = [
  { name: "Aster Collective", stage: "Proposal", value: "$8.2K", health: "Healthy" },
  { name: "Halcyon Group", stage: "Qualified", value: "$7K", health: "Watch" },
  { name: "Al Fahim Enterprises", stage: "Won", value: "$6K", health: "Healthy" },
  { name: "Vertex Studio", stage: "Qualified", value: "$5.5K", health: "Healthy" },
  { name: "Drift Media", stage: "Proposal", value: "$3.8K", health: "At risk" },
  { name: "Dema Consulting", stage: "Won", value: "$2K", health: "Healthy" },
] as const;

const INITIAL_TASKS = [
  { id: 1, label: "Send revised proposal to Aster Collective", due: "Today", done: false },
  { id: 2, label: "Follow up with Drift Media on scope", due: "Overdue", done: false },
  { id: 3, label: "Prep onboarding doc for Al Fahim Ent.", due: "Today", done: false },
  { id: 4, label: "Update KPI dashboard inputs", due: "Today", done: true },
  { id: 5, label: "Reconcile Stripe payouts", due: "Overdue", done: false },
  { id: 6, label: "Record Loom: CRM walkthrough", due: "Today", done: true },
];

const INITIAL_AUTOMATIONS = [
  {
    id: 1,
    name: "Call transcript → CRM notes",
    desc: "Transcribes sales calls and files the summary on the right deal.",
    runs: "142 runs",
    on: true,
  },
  {
    id: 2,
    name: "Daily priority briefing",
    desc: "Posts each owner's top three tasks to Slack at 8:00.",
    runs: "365 runs",
    on: true,
  },
  {
    id: 3,
    name: "Stage change → Slack alert",
    desc: "Pings the deal channel the moment a stage moves.",
    runs: "89 runs",
    on: true,
  },
  {
    id: 4,
    name: "Nurture reactivation sequence",
    desc: "Re-engages leads that go quiet for 14 days.",
    runs: "paused",
    on: false,
  },
];

const SOPS = [
  { name: "Client onboarding SOP", meta: "Updated 2 days ago" },
  { name: "Weekly review ritual", meta: "Updated last week" },
  { name: "CRM hygiene checklist", meta: "Updated last week" },
  { name: "Offboarding & handover", meta: "Updated 3 weeks ago" },
];

const VIEW_TITLES: Record<ViewKey, string> = {
  dashboard: "Dashboard",
  pipeline: "CRM Pipeline",
  clients: "Clients",
  tasks: "Tasks",
  automations: "Automations",
  report: "Bottleneck report",
  sop: "SOP library",
};

/* ------------------------------------------------------------------ */
/* Small bits                                                          */
/* ------------------------------------------------------------------ */

function SidebarIcon({ view }: { view: ViewKey }) {
  const paths: Record<ViewKey, React.ReactNode> = {
    dashboard: (
      <path d="M3 3h7v7H3zM14 3h7v4h-7zM14 10h7v11h-7zM3 13h7v8H3z" />
    ),
    pipeline: <path d="M4 4h4v16H4zM10 4h4v10h-4zM16 4h4v7h-4z" />,
    clients: (
      <path d="M16 19v-1.5a3.5 3.5 0 0 0-7 0V19M12.5 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19.5 19v-1a3 3 0 0 0-2-2.8M16.5 5.4a3 3 0 0 1 0 5.4" />
    ),
    tasks: (
      <path d="M9 11.5l2 2 4.5-4.5M12 21a9 9 0 1 1 0-18 9 9 0 0 1 0 18z" />
    ),
    automations: <path d="M13 2L4.5 13.5H11L9.5 22 19 9.5h-6.5L13 2z" />,
    report: (
      <path d="M14 2H6.8A1.8 1.8 0 0 0 5 3.8v16.4A1.8 1.8 0 0 0 6.8 22h10.4a1.8 1.8 0 0 0 1.8-1.8V7l-5-5zM14 2v5h5M9 13h6M9 17h6M9 9h2" />
    ),
    sop: (
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20M4 19.5A2.5 2.5 0 0 0 6.5 22H20V2H6.5A2.5 2.5 0 0 0 4 4.5v15z" />
    ),
  };
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {paths[view]}
    </svg>
  );
}

function HealthPill({ health }: { health: (typeof CLIENTS)[number]["health"] }) {
  const styles =
    health === "Healthy"
      ? "bg-success/12 text-success"
      : health === "Watch"
        ? "bg-warning/12 text-warning"
        : "bg-danger/12 text-danger";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-pill px-2.5 py-[3px] font-mono text-[10.5px] ${styles}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden />
      {health}
    </span>
  );
}

function DuePill({ due }: { due: string }) {
  const overdue = due === "Overdue";
  return (
    <span
      className={`rounded-pill px-2.5 py-[3px] font-mono text-[10.5px] ${
        overdue ? "bg-danger/12 text-danger" : "bg-success/12 text-success"
      }`}
    >
      {due}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Views                                                               */
/* ------------------------------------------------------------------ */

function PipelineView() {
  return (
    <div className="grid h-full grid-cols-4 gap-3">
      {PIPELINE.map((col) => (
        <div key={col.stage} className="flex flex-col rounded-xl bg-surface2/60 p-2.5">
          <div className="flex items-center justify-between px-1.5 pb-2.5 pt-1">
            <span className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-muted">
              {col.stage}
            </span>
            <span className="rounded-pill bg-surface px-2 py-px font-mono text-[10px] text-body">
              {col.deals.length}
            </span>
          </div>
          <div className="flex flex-col gap-2">
            {col.deals.map((deal) => (
              <div
                key={deal.name}
                className="cursor-grab rounded-lg border border-line bg-surface p-3 transition-all duration-300 ease-premium hover:-translate-y-1 hover:border-strong hover:shadow-card"
              >
                <p className="font-display text-[12.5px] font-medium text-heading">
                  {deal.name}
                </p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="font-mono text-[11px] text-flametext">
                    {deal.value}
                  </span>
                  <span
                    className="h-4 w-4 rounded-full border border-line bg-surface2"
                    aria-hidden
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function Sparkline({ data }: { data: number[] }) {
  const W = 64;
  const H = 22;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const pts = data
    .map(
      (v, i) =>
        `${(i / (data.length - 1)) * W},${H - ((v - min) / (max - min || 1)) * (H - 4) - 2}`,
    )
    .join(" ");
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-5 w-16" preserveAspectRatio="none" aria-hidden>
      <polyline
        points={pts}
        fill="none"
        stroke="var(--flame-text)"
        strokeWidth="1.6"
        vectorEffect="non-scaling-stroke"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function RevenueChart() {
  const W = 320;
  const H = 110;
  const pad = 8;
  const baseline = H - 20;
  const max = Math.max(...REVENUE);
  const min = Math.min(...REVENUE) - 5;
  const x = (i: number) => pad + (i / (REVENUE.length - 1)) * (W - 2 * pad);
  const y = (v: number) => baseline - ((v - min) / (max - min)) * (baseline - pad);
  const line = REVENUE.map((v, i) => `${x(i)},${y(v)}`).join(" ");
  const area = `${x(0)},${baseline} ${line} ${x(REVENUE.length - 1)},${baseline}`;
  return (
    <div className="flex flex-1 flex-col">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full flex-1" preserveAspectRatio="none" aria-hidden>
        <defs>
          <linearGradient id="rev-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#FF7A1A" stopOpacity="0.32" />
            <stop offset="1" stopColor="#FF7A1A" stopOpacity="0" />
          </linearGradient>
        </defs>
        <polygon points={area} fill="url(#rev-fill)" />
        <polyline
          points={line}
          fill="none"
          stroke="#FF7A1A"
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx={x(REVENUE.length - 1)} cy={y(REVENUE[REVENUE.length - 1])} r="3.4" fill="#FF7A1A" vectorEffect="non-scaling-stroke" />
      </svg>
      <div className="mt-1.5 flex justify-between px-1">
        {REV_MONTHS.map((m) => (
          <span key={m} className="font-mono text-[8.5px] text-muted">
            {m}
          </span>
        ))}
      </div>
    </div>
  );
}

function DashboardView() {
  const maxFunnel = Math.max(...STAGE_FUNNEL.map((s) => s.value));
  return (
    <div className="flex h-full flex-col gap-2.5">
      {/* KPI row with sparklines */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {KPI_CARDS.map((kpi) => (
          <div key={kpi.label} className="rounded-xl border border-line bg-surface2/60 p-3">
            <p className="font-mono text-[9.5px] uppercase tracking-[0.12em] text-muted">
              {kpi.label}
            </p>
            <div className="mt-1 flex items-end justify-between gap-1">
              <p className="font-display text-[18px] font-semibold leading-none text-heading">
                {kpi.value}
              </p>
              <Sparkline data={kpi.spark} />
            </div>
            <p className="mt-1.5 font-mono text-[9.5px] text-success">{kpi.delta} vs last mo</p>
          </div>
        ))}
      </div>

      {/* charts row */}
      <div className="grid min-h-0 flex-1 grid-cols-1 gap-2.5 lg:grid-cols-[1.5fr_1fr]">
        <div className="flex flex-col rounded-xl border border-line bg-surface2/60 p-4">
          <div className="flex items-center justify-between">
            <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
              Pipeline value · 8 mo
            </p>
            <span className="font-mono text-[10px] text-success">▲ 91% YTD</span>
          </div>
          <RevenueChart />
        </div>

        <div className="flex flex-col rounded-xl border border-line bg-surface2/60 p-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
            Pipeline by stage
          </p>
          <div className="mt-3 flex flex-1 flex-col justify-center gap-3">
            {STAGE_FUNNEL.map((s, i) => (
              <div key={s.stage}>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-bodystrong">{s.stage}</span>
                  <span className="font-mono text-[10px] text-muted">
                    ${s.value}K · {s.count}
                  </span>
                </div>
                <div className="mt-1 h-2 overflow-hidden rounded-full bg-surface">
                  <motion.div
                    className="h-full origin-left rounded-full"
                    style={{
                      background: s.color,
                      width: `${(s.value / maxFunnel) * 100}%`,
                      willChange: "transform",
                    }}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.7, delay: 0.1 + i * 0.08, ease: wsEase }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* activity + automation health */}
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-[1.3fr_1fr]">
        <div className="rounded-xl border border-line bg-surface2/60 p-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
            Recent activity
          </p>
          <div className="mt-2.5 flex flex-col gap-2.5">
            {ACTIVITY.map((a, i) => (
              <div key={i} className="flex items-center gap-2.5">
                <span
                  className="h-1.5 w-1.5 shrink-0 rounded-full"
                  style={{
                    background:
                      a.tone === "flame"
                        ? "#FF7A1A"
                        : a.tone === "success"
                          ? "var(--success)"
                          : "var(--muted)",
                  }}
                  aria-hidden
                />
                <p className="flex-1 truncate text-[12px] text-body">
                  <span className="font-medium text-bodystrong">{a.tag}</span> {a.txt}
                </p>
                <span className="font-mono text-[9.5px] text-muted">{a.time}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-line bg-surface2/60 p-3.5">
            <p className="font-mono text-[9.5px] uppercase tracking-[0.12em] text-muted">
              Automations
            </p>
            <p className="mt-1 font-display text-[20px] font-semibold leading-none text-heading">
              596
              <span className="ml-1 text-[10px] font-normal text-muted">runs/mo</span>
            </p>
            <p className="mt-1.5 font-mono text-[9.5px] text-success">99.2% success</p>
          </div>
          <div
            className="rounded-xl border border-flame/25 p-3.5"
            style={{ background: "linear-gradient(135deg, var(--flame-glow), transparent)" }}
          >
            <p className="font-mono text-[9.5px] uppercase tracking-[0.12em] text-flametext">
              Hours saved
            </p>
            <p className="mt-1 font-display text-[20px] font-semibold leading-none text-heading">
              12<span className="ml-1 text-[10px] font-normal text-muted">this wk</span>
            </p>
            <p className="mt-1.5 font-mono text-[9.5px] text-success">▲ from 9 last wk</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ClientsView() {
  return (
    <div className="overflow-hidden rounded-xl border border-line">
      <table className="w-full text-left text-[12.5px]">
        <thead>
          <tr className="border-b border-line bg-surface2/60 font-mono text-[10px] uppercase tracking-[0.12em] text-muted">
            <th className="px-4 py-2.5 font-medium">Company</th>
            <th className="px-4 py-2.5 font-medium">Stage</th>
            <th className="px-4 py-2.5 font-medium">Value</th>
            <th className="px-4 py-2.5 font-medium">Health</th>
          </tr>
        </thead>
        <tbody>
          {CLIENTS.map((c) => (
            <tr
              key={c.name}
              className="border-b border-line transition-colors last:border-0 hover:bg-surface2/50"
            >
              <td className="px-4 py-3 font-display font-medium text-heading">
                {c.name}
              </td>
              <td className="px-4 py-3 text-body">{c.stage}</td>
              <td className="px-4 py-3 font-mono text-[11.5px] text-bodystrong">
                {c.value}
              </td>
              <td className="px-4 py-3">
                <HealthPill health={c.health} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function TasksView({
  tasks,
  toggle,
}: {
  tasks: typeof INITIAL_TASKS;
  toggle: (id: number) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      {tasks.map((task) => (
        <button
          key={task.id}
          onClick={() => toggle(task.id)}
          className="flex items-center gap-3.5 rounded-xl border border-line bg-surface2/40 px-4 py-3 text-left transition-all duration-200 hover:border-strong"
        >
          <span
            className={`flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-[5px] border transition-colors ${
              task.done
                ? "border-transparent bg-flame text-white"
                : "border-strong bg-transparent"
            }`}
            aria-hidden
          >
            {task.done && (
              <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                <path
                  d="M2.5 6.5l2.5 2.5 4.5-5.5"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </span>
          <span
            className={`flex-1 text-[13px] transition-all ${
              task.done ? "text-muted line-through" : "text-bodystrong"
            }`}
          >
            {task.label}
          </span>
          <DuePill due={task.due} />
        </button>
      ))}
      <p className="mt-1 px-1 font-mono text-[10px] text-muted">
        {tasks.filter((t) => !t.done).length} open ·{" "}
        {tasks.filter((t) => t.done).length} done
      </p>
    </div>
  );
}

function AutomationsView({
  autos,
  toggle,
}: {
  autos: typeof INITIAL_AUTOMATIONS;
  toggle: (id: number) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      {autos.map((auto) => (
        <div
          key={auto.id}
          className="flex items-center gap-4 rounded-xl border border-line bg-surface2/40 px-4 py-3.5"
        >
          <span
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-line ${
              auto.on ? "text-flametext" : "text-muted"
            }`}
            style={{
              background: auto.on
                ? "linear-gradient(135deg, var(--flame-glow), transparent)"
                : undefined,
            }}
            aria-hidden
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinejoin="round"
            >
              <path d="M13 2L4.5 13.5H11L9.5 22 19 9.5h-6.5L13 2z" />
            </svg>
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate font-display text-[13px] font-medium text-heading">
              {auto.name}
            </p>
            <p className="truncate text-[11.5px] text-body">{auto.desc}</p>
          </div>
          <span className="hidden font-mono text-[10px] text-muted sm:block">
            {auto.runs}
          </span>
          <button
            role="switch"
            aria-checked={auto.on}
            aria-label={`Toggle ${auto.name}`}
            onClick={() => toggle(auto.id)}
            className={`relative h-[22px] w-[40px] shrink-0 rounded-pill transition-colors duration-300 ${
              auto.on ? "bg-flame" : "bg-[var(--border-strong)]"
            }`}
          >
            <span
              className="toggle-knob absolute left-[3px] top-[3px] h-4 w-4 rounded-full bg-white shadow"
              style={{ transform: auto.on ? "translateX(18px)" : "translateX(0)" }}
            />
          </button>
        </div>
      ))}
    </div>
  );
}

function ReportView() {
  return (
    <div className="mx-auto max-w-[520px] py-2">
      <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
        Prepared by HASH · 7-layer diagnostic
      </p>
      <h4 className="mt-2 font-display text-[20px] font-semibold text-heading">
        Bottleneck Report — Q2
      </h4>
      <div className="mt-4 space-y-3 text-[13px] leading-relaxed text-body">
        <p>
          <span className="font-medium text-bodystrong">1. Lead-to-cash visibility.</span>{" "}
          Pipeline lives in three places. Estimated leak: 4 hrs/week and two
          stalled deals this quarter.
        </p>
        <p>
          <span className="font-medium text-bodystrong">2. Manual reporting.</span>{" "}
          Monthly numbers assembled by hand across 5 spreadsheets. Estimated
          leak: 6 hrs/week, data a month old on arrival.
        </p>
        <p>
          <span className="font-medium text-bodystrong">3. Founder-gated approvals.</span>{" "}
          Every deliverable waits on one person. Estimated leak: 1.5 days of
          cycle time per project.
        </p>
      </div>
      <div className="mt-5 rounded-xl border border-line bg-surface2/60 p-4">
        <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-flametext">
          Fix-first roadmap
        </p>
        <p className="mt-1.5 text-[12.5px] text-body">
          Build the pipeline + reporting layer first: highest ROI, 2–4 weeks,
          pays back in roughly 9 weeks.
        </p>
      </div>
    </div>
  );
}

function SopView() {
  return (
    <div className="flex flex-col gap-2">
      {SOPS.map((doc) => (
        <div
          key={doc.name}
          className="flex items-center gap-3.5 rounded-xl border border-line bg-surface2/40 px-4 py-3.5 transition-colors hover:border-strong"
        >
          <span className="text-muted" aria-hidden>
            <SidebarIcon view="report" />
          </span>
          <span className="flex-1 font-display text-[13px] font-medium text-heading">
            {doc.name}
          </span>
          <span className="font-mono text-[10px] text-muted">{doc.meta}</span>
        </div>
      ))}
      <p className="mt-1 px-1 font-mono text-[10px] text-muted">
        Every system ships documented. These live with your team, not with us.
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* The workspace window                                                */
/* ------------------------------------------------------------------ */

export function OpsWorkspace() {
  const [view, setView] = useState<ViewKey>("dashboard");
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const [autos, setAutos] = useState(INITIAL_AUTOMATIONS);
  const reduce = useReducedMotion();

  const toggleTask = (id: number) =>
    setTasks((ts) => ts.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  const toggleAuto = (id: number) =>
    setAutos((as) => as.map((a) => (a.id === id ? { ...a, on: !a.on } : a)));

  const workspaceItems: ViewKey[] = [
    "dashboard",
    "pipeline",
    "clients",
    "tasks",
    "automations",
  ];
  const docItems: ViewKey[] = ["report", "sop"];

  const renderView = () => {
    switch (view) {
      case "pipeline":
        return <PipelineView />;
      case "dashboard":
        return <DashboardView />;
      case "clients":
        return <ClientsView />;
      case "tasks":
        return <TasksView tasks={tasks} toggle={toggleTask} />;
      case "automations":
        return <AutomationsView autos={autos} toggle={toggleAuto} />;
      case "report":
        return <ReportView />;
      case "sop":
        return <SopView />;
    }
  };

  return (
    <section id="system" className="relative px-3 py-24 sm:px-6">
      <SectionHead
        index="03"
        eyebrow="The HASH Ops System™"
        title="Your whole operation, in one workspace."
        lead="Pipeline, delivery, tasks, numbers, and automations in one place. This is a live demo; click around. All numbers illustrative."
      />

      <Reveal delay={0.12} className="mx-auto mt-12 max-w-[1060px]">
        <div className="ws-scroll overflow-x-auto pb-2">
          <div className="min-w-[860px] overflow-hidden rounded-window border border-strong bg-surface shadow-[var(--window-shadow)]">
            {/* window chrome */}
            <div className="flex items-center justify-between border-b border-line bg-surface2/50 px-4 py-2.5">
              <div className="flex items-center gap-1.5" aria-hidden>
                <span className="h-[11px] w-[11px] rounded-full bg-[#FF5F57]" />
                <span className="h-[11px] w-[11px] rounded-full bg-[#FEBC2E]" />
                <span className="h-[11px] w-[11px] rounded-full bg-[#28C840]" />
              </div>
              <span className="font-mono text-[11px] text-muted">
                HASH Ops OS <span className="mx-1 text-muted/60">/</span>
                <span className="text-bodystrong">{VIEW_TITLES[view]}</span>
              </span>
              <div className="flex items-center" aria-hidden>
                <span className="z-[1] flex h-5 w-5 items-center justify-center rounded-full border border-line bg-surface2 font-mono text-[8.5px] text-bodystrong">
                  SH
                </span>
                <span className="-ml-1.5 flex h-5 w-5 items-center justify-center rounded-full border border-line bg-flame font-mono text-[8.5px] text-white">
                  A
                </span>
                <svg
                  className="ml-3 text-muted"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <circle cx="5" cy="12" r="1.7" />
                  <circle cx="12" cy="12" r="1.7" />
                  <circle cx="19" cy="12" r="1.7" />
                </svg>
              </div>
            </div>

            <div className="grid grid-cols-[186px_1fr]">
              {/* sidebar */}
              <aside className="flex h-[600px] flex-col border-r border-line bg-surface2/40 p-3">
                <div className="flex items-center gap-2 rounded-lg px-2 py-1.5">
                  <span
                    className="flex h-6 w-6 items-center justify-center rounded-md border border-line"
                    style={{
                      background:
                        "linear-gradient(135deg, var(--flame-glow), transparent 72%)",
                    }}
                    aria-hidden
                  >
                    <Logo wordmark={false} markSize={14} />
                  </span>
                  <span className="font-display text-[12.5px] font-semibold text-heading">
                    HASH Ops OS
                  </span>
                  <svg
                    className="ml-auto text-muted"
                    width="10"
                    height="10"
                    viewBox="0 0 12 12"
                    fill="none"
                    aria-hidden
                  >
                    <path
                      d="M3 4.5L6 7.5l3-3"
                      stroke="currentColor"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>

                <div className="mt-2 flex items-center gap-2 rounded-lg border border-line bg-surface px-2.5 py-1.5 text-muted">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
                    <path d="M20 20l-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                  <span className="text-[11px]">Search</span>
                  <span className="ml-auto font-mono text-[9px]">⌘K</span>
                </div>

                <p className="mt-4 px-2 font-mono text-[9.5px] uppercase tracking-[0.16em] text-muted">
                  Workspace
                </p>
                <nav className="mt-1.5 flex flex-col gap-0.5">
                  {workspaceItems.map((key) => (
                    <button
                      key={key}
                      onClick={() => setView(key)}
                      aria-pressed={view === key}
                      className={`flex items-center gap-2.5 rounded-lg px-2 py-[7px] text-left text-[12.5px] transition-colors duration-200 ${
                        view === key
                          ? "bg-[var(--flame-glow)] font-medium text-flametext"
                          : "text-body hover:bg-surface hover:text-bodystrong"
                      }`}
                    >
                      <SidebarIcon view={key} />
                      {VIEW_TITLES[key]}
                    </button>
                  ))}
                </nav>

                <p className="mt-4 px-2 font-mono text-[9.5px] uppercase tracking-[0.16em] text-muted">
                  Docs
                </p>
                <nav className="mt-1.5 flex flex-col gap-0.5">
                  {docItems.map((key) => (
                    <button
                      key={key}
                      onClick={() => setView(key)}
                      aria-pressed={view === key}
                      className={`flex items-center gap-2.5 rounded-lg px-2 py-[7px] text-left text-[12.5px] transition-colors duration-200 ${
                        view === key
                          ? "bg-[var(--flame-glow)] font-medium text-flametext"
                          : "text-body hover:bg-surface hover:text-bodystrong"
                      }`}
                    >
                      <SidebarIcon view={key} />
                      {VIEW_TITLES[key]}
                    </button>
                  ))}
                </nav>

                <div className="mt-auto rounded-lg border border-line bg-surface px-3 py-2.5">
                  <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-muted">
                    This week
                  </p>
                  <p className="mt-0.5 font-display text-[13px] font-semibold text-heading">
                    12 hrs <span className="text-[10.5px] font-normal text-success">recovered</span>
                  </p>
                </div>
              </aside>

              {/* main */}
              <div className="flex h-[600px] flex-col">
                <div className="flex items-center justify-between border-b border-line px-5 py-3">
                  <div className="flex items-center gap-2.5 text-heading">
                    <span className="text-flametext">
                      <SidebarIcon view={view} />
                    </span>
                    <h3 className="font-display text-[15px] font-semibold">
                      {VIEW_TITLES[view]}
                    </h3>
                  </div>
                  <div className="flex items-center gap-2" aria-hidden>
                    <span className="rounded-lg border border-line px-2.5 py-1 font-mono text-[10px] text-muted">
                      Filter
                    </span>
                    <span className="rounded-lg border border-line px-2.5 py-1 font-mono text-[10px] text-muted">
                      Sort
                    </span>
                    <span
                      className="rounded-lg px-2.5 py-1 font-mono text-[10px] text-white"
                      style={{
                        background: "linear-gradient(180deg, #FF8838, #E55A00)",
                      }}
                    >
                      + New
                    </span>
                  </div>
                </div>

                <div className="relative flex-1 overflow-hidden p-4">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={view}
                      className="h-full"
                      initial={reduce ? false : { opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={reduce ? undefined : { opacity: 0, y: -6 }}
                      transition={{ duration: 0.22, ease: [0.2, 0.7, 0.3, 1] }}
                    >
                      {renderView()}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
