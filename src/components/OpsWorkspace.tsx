"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Section, SectionHeader } from "./ui/Section";
import { Reveal } from "./ui/Reveal";
import { HashMark } from "./ui/HashMark";
import { ICON_MAP, Search, Check, TrendUp, TrendDown, AlertTriangle } from "./ui/icons";
import {
  WORKSPACE_VIEWS,
  PIPELINE,
  KPIS,
  HOURS_RECOVERED,
  CLIENTS,
  TASKS,
  AUTOMATIONS,
  REPORT_FINDINGS,
  SOPS,
  type ViewId,
  type TaskItem,
  type Automation,
  type Health,
} from "@/lib/workspace-data";
import { cn } from "@/lib/utils";

const TONE_DOT: Record<string, string> = {
  muted: "bg-muted",
  info: "bg-[#5B8DEF]",
  warning: "bg-warning",
  success: "bg-success",
};

const HEALTH_STYLES: Record<Health, string> = {
  "On track": "text-[#5B8DEF] bg-[#5B8DEF]/12 border-[#5B8DEF]/25",
  Healthy: "text-success bg-success/12 border-success/25",
  Action: "text-warning bg-warning/12 border-warning/25",
  "At risk": "text-error bg-error/12 border-error/25",
};

function Toggle({ on, onClick }: { on: boolean; onClick: () => void }) {
  return (
    <button
      role="switch"
      aria-checked={on}
      onClick={onClick}
      className={cn(
        "relative h-6 w-11 shrink-0 rounded-full border transition-colors duration-300",
        on ? "border-flame/40 bg-flame/80" : "border-line-strong bg-surface-2",
      )}
    >
      <span
        className={cn(
          "absolute top-1/2 h-4 w-4 -translate-y-1/2 rounded-full bg-white shadow transition-all duration-300",
          on ? "left-[22px]" : "left-1",
        )}
      />
    </button>
  );
}

function Checkbox({ checked, onClick }: { checked: boolean; onClick: () => void }) {
  return (
    <button
      role="checkbox"
      aria-checked={checked}
      onClick={onClick}
      className={cn(
        "grid h-5 w-5 shrink-0 place-items-center rounded-[6px] border transition-colors",
        checked
          ? "border-flame bg-flame text-white"
          : "border-line-strong text-transparent hover:border-flame/60",
      )}
    >
      <Check className="h-3.5 w-3.5" strokeWidth={3} />
    </button>
  );
}

export function OpsWorkspace() {
  const [view, setView] = useState<ViewId>("pipeline");
  const [tasks, setTasks] = useState<TaskItem[]>(TASKS);
  const [autos, setAutos] = useState<Automation[]>(AUTOMATIONS);
  const reduce = useReducedMotion();

  const current = WORKSPACE_VIEWS.find((v) => v.id === view)!;
  const workspaceItems = WORKSPACE_VIEWS.filter((v) => v.section === "workspace");
  const docItems = WORKSPACE_VIEWS.filter((v) => v.section === "docs");

  const SidebarItem = ({ id }: { id: ViewId }) => {
    const v = WORKSPACE_VIEWS.find((x) => x.id === id)!;
    const Icon = ICON_MAP[v.icon as keyof typeof ICON_MAP];
    const active = view === id;
    return (
      <button
        onClick={() => setView(id)}
        className={cn(
          "group/side relative flex shrink-0 items-center gap-2.5 whitespace-nowrap rounded-lg px-2.5 py-2 text-left text-[0.86rem] transition-colors md:w-full",
          active
            ? "bg-flame/12 font-medium text-flame"
            : "text-body hover:bg-surface-2 hover:text-heading",
        )}
      >
        {active && (
          <span className="absolute left-0 top-1/2 h-4 w-[3px] -translate-y-1/2 rounded-full bg-flame" />
        )}
        <Icon className="h-[18px] w-[18px] shrink-0" />
        <span className="truncate">{v.label}</span>
      </button>
    );
  };

  return (
    <Section id="system" wide>
      <SectionHeader
        eyebrow="The HASH Ops System™"
        heading="Your whole operation, in one workspace."
        lead="Pipeline, clients, tasks and automations, connected and live. Click the sidebar to explore."
      />

      <Reveal delay={0.1} y={28} className="mt-12">
        <div className="mx-auto overflow-hidden rounded-window border border-line-strong bg-surface shadow-lift">
          {/* Window chrome */}
          <div className="flex items-center gap-3 border-b border-line bg-surface-2/60 px-4 py-3">
            <div className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-full bg-error/80" />
              <span className="h-3 w-3 rounded-full bg-warning/80" />
              <span className="h-3 w-3 rounded-full bg-success/80" />
            </div>
            <div className="ml-2 flex items-center gap-1.5 truncate font-mono text-[0.72rem] text-muted">
              <span className="text-body-strong">HASH Ops OS</span>
              <span>/</span>
              <span className="truncate text-flame-text">{current.title}</span>
            </div>
            <div className="ml-auto flex items-center -space-x-2">
              {["A", "S", "M"].map((c, i) => (
                <span
                  key={c}
                  className="grid h-6 w-6 place-items-center rounded-full border border-surface bg-[linear-gradient(150deg,#FF8838,#D85706)] text-[0.6rem] font-medium text-white"
                  style={{ zIndex: 3 - i }}
                >
                  {c}
                </span>
              ))}
              <span className="grid h-6 w-6 place-items-center rounded-full border border-line bg-surface-2 text-[0.6rem] text-muted">
                +4
              </span>
            </div>
          </div>

          {/* Body */}
          <div className="flex h-[clamp(460px,58vh,560px)] flex-col md:flex-row">
            {/* Sidebar */}
            <aside className="shrink-0 border-b border-line bg-surface-2/30 p-3 md:w-[186px] md:border-b-0 md:border-r">
              <div className="mb-3 flex items-center gap-2 rounded-lg border border-line bg-surface px-2.5 py-2">
                <HashMark className="h-5 w-5" />
                <span className="truncate font-display text-[0.82rem] font-medium text-heading">
                  HASH Ops OS
                </span>
              </div>
              <div className="mb-3 flex items-center gap-2 rounded-lg border border-line bg-surface px-2.5 py-1.5 text-muted">
                <Search className="h-4 w-4" />
                <input
                  aria-label="Search workspace"
                  placeholder="Search…"
                  className="w-full bg-transparent text-[0.82rem] text-body outline-none placeholder:text-muted"
                />
              </div>

              <div className="flex gap-1 overflow-x-auto pb-1 md:block md:overflow-visible md:pb-0">
                <div className="md:mb-1">
                  <p className="hidden px-2.5 pb-1 pt-2 font-mono text-[0.62rem] uppercase tracking-eyebrow text-muted md:block">
                    Workspace
                  </p>
                  <div className="flex gap-1 md:block md:space-y-0.5">
                    {workspaceItems.map((v) => (
                      <SidebarItem key={v.id} id={v.id} />
                    ))}
                  </div>
                </div>
                <div>
                  <p className="hidden px-2.5 pb-1 pt-3 font-mono text-[0.62rem] uppercase tracking-eyebrow text-muted md:block">
                    Docs
                  </p>
                  <div className="flex gap-1 md:block md:space-y-0.5">
                    {docItems.map((v) => (
                      <SidebarItem key={v.id} id={v.id} />
                    ))}
                  </div>
                </div>
              </div>
            </aside>

            {/* Main panel */}
            <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
              <div className="flex items-center gap-2.5 border-b border-line px-5 py-4">
                <span className="text-xl">{current.pageIcon}</span>
                <h3 className="font-display text-[1.1rem] font-semibold text-heading">
                  {current.title}
                </h3>
              </div>

              <div className="min-h-0 flex-1 overflow-auto p-5">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={view}
                    initial={reduce ? false : { opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reduce ? undefined : { opacity: 0, y: -8 }}
                    transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                  >
                    {view === "pipeline" && <PipelineView />}
                    {view === "dashboard" && <DashboardView />}
                    {view === "clients" && <ClientsView />}
                    {view === "tasks" && (
                      <TasksView
                        tasks={tasks}
                        toggle={(id) =>
                          setTasks((prev) =>
                            prev.map((t) =>
                              t.id === id ? { ...t, done: !t.done } : t,
                            ),
                          )
                        }
                      />
                    )}
                    {view === "automations" && (
                      <AutomationsView
                        autos={autos}
                        toggle={(id) =>
                          setAutos((prev) =>
                            prev.map((a) =>
                              a.id === id ? { ...a, on: !a.on } : a,
                            ),
                          )
                        }
                      />
                    )}
                    {view === "report" && <ReportView />}
                    {view === "sop" && <SopView />}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </Reveal>
      <p className="mt-4 text-center font-mono text-[0.7rem] uppercase tracking-eyebrow text-muted">
        Interactive demo · all numbers illustrative
      </p>
    </Section>
  );
}

/* ---------------------------- Views ---------------------------- */

function PipelineView() {
  return (
    <div className="flex min-w-[640px] gap-3 md:min-w-0">
      {PIPELINE.map((col) => (
        <div key={col.stage} className="flex-1">
          <div className="mb-2.5 flex items-center justify-between px-1">
            <div className="flex items-center gap-1.5">
              <span className={cn("h-2 w-2 rounded-full", TONE_DOT[col.tone])} />
              <span className="text-[0.78rem] font-medium text-body-strong">
                {col.stage}
              </span>
            </div>
            <span className="font-mono text-[0.7rem] text-muted">
              {col.deals.length}
            </span>
          </div>
          <div className="space-y-2">
            {col.deals.map((d) => (
              <div
                key={d.id}
                className="cursor-grab rounded-lg border border-line bg-surface-2/60 p-3 transition-all duration-200 hover:-translate-y-0.5 hover:border-line-strong hover:shadow-lift"
              >
                <p className="text-[0.84rem] font-medium text-heading">
                  {d.company}
                </p>
                <p className="mt-1 font-mono text-[0.78rem] text-flame-text">
                  {d.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function DashboardView() {
  const max = Math.max(...HOURS_RECOVERED);
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
        {KPIS.map((k, i) => (
          <motion.div
            key={k.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05, duration: 0.4 }}
            className="rounded-xl border border-line bg-surface-2/50 p-3.5"
          >
            <p className="font-mono text-[0.66rem] uppercase tracking-eyebrow text-muted">
              {k.label}
            </p>
            <div className="mt-1.5 flex items-baseline gap-2">
              <span className="font-display text-[1.4rem] font-semibold text-heading">
                {k.value}
              </span>
              {k.delta && (
                <span
                  className={cn(
                    "flex items-center gap-0.5 font-mono text-[0.72rem]",
                    k.trend === "down" ? "text-error" : "text-success",
                  )}
                >
                  {k.trend === "down" ? (
                    <TrendDown className="h-3 w-3" />
                  ) : (
                    <TrendUp className="h-3 w-3" />
                  )}
                  {k.delta}
                </span>
              )}
            </div>
            {k.note && (
              <p className="mt-1 text-[0.74rem] text-muted">{k.note}</p>
            )}
          </motion.div>
        ))}
      </div>

      <div className="rounded-xl border border-line bg-surface-2/50 p-4">
        <div className="mb-3 flex items-center justify-between">
          <p className="font-mono text-[0.66rem] uppercase tracking-eyebrow text-muted">
            Weekly hours recovered
          </p>
          <span className="font-mono text-[0.72rem] text-success">+38% MoM</span>
        </div>
        <div className="flex h-28 items-end gap-2">
          {HOURS_RECOVERED.map((h, i) => (
            <div key={i} className="flex flex-1 flex-col items-center gap-1.5">
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${(h / max) * 100}%` }}
                transition={{ delay: 0.15 + i * 0.06, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className={cn(
                  "w-full rounded-t-md",
                  i === HOURS_RECOVERED.length - 1
                    ? "bg-[linear-gradient(180deg,#FF8838,#D85706)]"
                    : "bg-flame/30",
                )}
                style={{ minHeight: 6 }}
              />
              <span className="font-mono text-[0.6rem] text-muted">W{i + 1}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ClientsView() {
  return (
    <div className="overflow-hidden rounded-xl border border-line">
      <table className="w-full min-w-[520px] text-left text-[0.85rem]">
        <thead>
          <tr className="border-b border-line bg-surface-2/50 font-mono text-[0.66rem] uppercase tracking-eyebrow text-muted">
            <th className="px-4 py-2.5 font-medium">Company</th>
            <th className="px-4 py-2.5 font-medium">Stage</th>
            <th className="px-4 py-2.5 font-medium">Value</th>
            <th className="px-4 py-2.5 font-medium">Health</th>
          </tr>
        </thead>
        <tbody>
          {CLIENTS.map((c) => (
            <tr
              key={c.company}
              className="border-b border-line transition-colors last:border-0 hover:bg-surface-2/40"
            >
              <td className="px-4 py-3 font-medium text-heading">{c.company}</td>
              <td className="px-4 py-3 text-body">{c.stage}</td>
              <td className="px-4 py-3 font-mono text-body-strong">{c.value}</td>
              <td className="px-4 py-3">
                <span
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[0.72rem] font-medium",
                    HEALTH_STYLES[c.health],
                  )}
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-current" />
                  {c.health}
                </span>
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
  tasks: TaskItem[];
  toggle: (id: string) => void;
}) {
  return (
    <div className="space-y-1.5">
      {tasks.map((t) => (
        <div
          key={t.id}
          className="flex items-center gap-3 rounded-lg border border-line bg-surface-2/40 px-3.5 py-3 transition-colors hover:border-line-strong"
        >
          <Checkbox checked={t.done} onClick={() => toggle(t.id)} />
          <div className="min-w-0 flex-1">
            <p
              className={cn(
                "text-[0.88rem] transition-colors",
                t.done
                  ? "text-muted line-through"
                  : "font-medium text-heading",
              )}
            >
              {t.label}
            </p>
            <p className="text-[0.74rem] text-muted">{t.meta}</p>
          </div>
          {t.pill && !t.done && (
            <span
              className={cn(
                "rounded-full border px-2 py-0.5 font-mono text-[0.66rem] uppercase tracking-eyebrow",
                t.pill === "Overdue"
                  ? "border-error/25 bg-error/12 text-error"
                  : "border-warning/25 bg-warning/12 text-warning",
              )}
            >
              {t.pill}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

function AutomationsView({
  autos,
  toggle,
}: {
  autos: Automation[];
  toggle: (id: string) => void;
}) {
  return (
    <div className="space-y-2">
      {autos.map((a) => (
        <div
          key={a.id}
          className="flex items-center gap-4 rounded-lg border border-line bg-surface-2/40 px-4 py-3.5 transition-colors hover:border-line-strong"
        >
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <p className="text-[0.9rem] font-medium text-heading">{a.label}</p>
              <span
                className={cn(
                  "h-1.5 w-1.5 rounded-full",
                  a.on ? "bg-success" : "bg-muted",
                )}
              />
            </div>
            <p className="mt-0.5 text-[0.76rem] text-muted">{a.desc}</p>
          </div>
          <Toggle on={a.on} onClick={() => toggle(a.id)} />
        </div>
      ))}
    </div>
  );
}

function ReportView() {
  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-flame/25 bg-flame/[0.06] p-4">
        <p className="font-mono text-[0.66rem] uppercase tracking-eyebrow text-flame-text">
          Executive summary
        </p>
        <p className="mt-2 text-[0.9rem] leading-relaxed text-body-strong">
          Four layers are leaking. Estimated ~$5.1K/month recoverable across
          pipeline visibility, documentation, reporting, and tool overlap.
        </p>
      </div>
      <div className="space-y-2">
        {REPORT_FINDINGS.map((f) => (
          <div
            key={f.layer}
            className="flex items-start gap-3 rounded-lg border border-line bg-surface-2/40 px-4 py-3"
          >
            <AlertTriangle
              className={cn(
                "mt-0.5 h-4 w-4 shrink-0",
                f.sev === "high" ? "text-error" : "text-warning",
              )}
            />
            <div>
              <p className="font-mono text-[0.7rem] text-muted">{f.layer}</p>
              <p className="text-[0.86rem] text-heading">{f.finding}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SopView() {
  return (
    <div className="grid gap-2.5 sm:grid-cols-2">
      {SOPS.map((s) => (
        <div
          key={s.title}
          className="rounded-xl border border-line bg-surface-2/40 p-4 transition-colors hover:border-line-strong"
        >
          <div className="flex items-center justify-between">
            <p className="text-[0.9rem] font-medium text-heading">{s.title}</p>
            <span
              className={cn(
                "rounded-full border px-2 py-0.5 font-mono text-[0.64rem] uppercase tracking-eyebrow",
                s.status === "Live"
                  ? "border-success/25 bg-success/12 text-success"
                  : "border-warning/25 bg-warning/12 text-warning",
              )}
            >
              {s.status}
            </span>
          </div>
          <p className="mt-1.5 font-mono text-[0.74rem] text-muted">{s.meta}</p>
        </div>
      ))}
    </div>
  );
}
