/* ------------------------------------------------------------------ */
/*  HASH Ops System™ workspace — all numbers illustrative.             */
/* ------------------------------------------------------------------ */

export type ViewId =
  | "dashboard"
  | "pipeline"
  | "clients"
  | "tasks"
  | "automations"
  | "report"
  | "sop";

export const WORKSPACE_VIEWS: {
  id: ViewId;
  label: string;
  icon: string;
  section: "workspace" | "docs";
  title: string;
  pageIcon: string;
}[] = [
  { id: "dashboard", label: "Dashboard", icon: "grid", section: "workspace", title: "Dashboard", pageIcon: "📊" },
  { id: "pipeline", label: "CRM Pipeline", icon: "kanban", section: "workspace", title: "CRM Pipeline", pageIcon: "🎯" },
  { id: "clients", label: "Clients", icon: "users", section: "workspace", title: "Clients", pageIcon: "🤝" },
  { id: "tasks", label: "Tasks", icon: "check", section: "workspace", title: "Tasks", pageIcon: "✓" },
  { id: "automations", label: "Automations", icon: "bolt", section: "workspace", title: "Automations", pageIcon: "⚡" },
  { id: "report", label: "Bottleneck report", icon: "doc", section: "docs", title: "Bottleneck Report", pageIcon: "📄" },
  { id: "sop", label: "SOP library", icon: "book", section: "docs", title: "SOP Library", pageIcon: "📚" },
];

/* ---- Pipeline (kanban) ---- */
export interface Deal {
  id: string;
  company: string;
  value: string;
  tag?: string;
}
export const PIPELINE: { stage: string; tone: string; deals: Deal[] }[] = [
  {
    stage: "New Lead",
    tone: "muted",
    deals: [
      { id: "d1", company: "Northwind Agency", value: "$3,200" },
      { id: "d2", company: "Brightline Co.", value: "$2,000" },
      { id: "d3", company: "Mason & Park", value: "$4,500" },
    ],
  },
  {
    stage: "Qualified",
    tone: "info",
    deals: [
      { id: "d4", company: "Vertex Studio", value: "$5,500" },
      { id: "d5", company: "Halcyon Group", value: "$7,000" },
    ],
  },
  {
    stage: "Proposal",
    tone: "warning",
    deals: [
      { id: "d6", company: "Aster Collective", value: "$8,200" },
      { id: "d7", company: "Drift Media", value: "$3,800" },
    ],
  },
  {
    stage: "Won",
    tone: "success",
    deals: [
      { id: "d8", company: "Al Fahim Ent.", value: "$6,000" },
      { id: "d9", company: "Dema Consult.", value: "$2,000" },
    ],
  },
];

/* ---- Dashboard KPIs ---- */
export interface Kpi {
  label: string;
  value: string;
  delta?: string;
  trend?: "up" | "down" | "flat";
  note?: string;
}
export const KPIS: Kpi[] = [
  { label: "MRR (retainers)", value: "$7,400", delta: "+18%", trend: "up" },
  { label: "Pipeline value", value: "$42K", note: "9 open deals", trend: "flat" },
  { label: "Active clients", value: "6", note: "2 onboarding", trend: "flat" },
  { label: "Avg deal size", value: "$4.6K", delta: "-4%", trend: "down" },
  { label: "Tasks due", value: "7", note: "3 overdue", trend: "flat" },
  { label: "Automations", value: "12", note: "all running", trend: "up" },
];

/** Weekly hours recovered — small bar chart on the dashboard. */
export const HOURS_RECOVERED = [4, 6, 5, 8, 7, 9, 12];

/* ---- Clients table ---- */
export type Health = "On track" | "Healthy" | "Action" | "At risk";
export interface ClientRow {
  company: string;
  stage: string;
  value: string;
  health: Health;
}
export const CLIENTS: ClientRow[] = [
  { company: "Al Fahim Ent.", stage: "Build", value: "$6,000", health: "On track" },
  { company: "Dema Consult.", stage: "Retainer", value: "$1,200/mo", health: "Healthy" },
  { company: "Vertex Studio", stage: "Audit", value: "$5,500", health: "Action" },
  { company: "Halcyon Group", stage: "Onboarding", value: "$7,000", health: "On track" },
  { company: "Drift Media", stage: "Proposal", value: "$3,800", health: "At risk" },
];

/* ---- Tasks ---- */
export interface TaskItem {
  id: string;
  label: string;
  meta: string;
  done: boolean;
  pill?: "Today" | "Overdue";
}
export const TASKS: TaskItem[] = [
  { id: "t1", label: "Send Bottleneck Report", meta: "Vertex Studio", done: true },
  { id: "t2", label: "Kickoff call agenda", meta: "Halcyon Group", done: false, pill: "Today" },
  { id: "t3", label: "Collect 40% deposit", meta: "Al Fahim Ent.", done: false, pill: "Overdue" },
  { id: "t4", label: "Friday client update", meta: "All active", done: false },
  { id: "t5", label: "Score 12 new Apollo leads", meta: "Pipeline", done: true },
];

/* ---- Automations ---- */
export interface Automation {
  id: string;
  label: string;
  desc: string;
  on: boolean;
}
export const AUTOMATIONS: Automation[] = [
  { id: "a1", label: "Call transcript to CRM notes", desc: "Fireflies → Notion, auto-summarised", on: true },
  { id: "a2", label: "Daily priority briefing", desc: "Top 5 actions to Slack at 8am", on: true },
  { id: "a3", label: "Stage change to Slack alert", desc: "Deal moves stage → #sales ping", on: true },
  { id: "a4", label: "Nurture reactivation sequence", desc: "Cold leads → 4-touch re-engage", on: false },
];

/* ---- Docs: bottleneck report bullets ---- */
export const REPORT_FINDINGS = [
  { layer: "Layer 01 · Lead-to-Cash", finding: "No single pipeline source. ~$3.4K/mo slipping.", sev: "high" },
  { layer: "Layer 04 · Documentation", finding: "Onboarding lives in the founder's head.", sev: "high" },
  { layer: "Layer 05 · Reporting", finding: "Monday numbers pulled by hand, 3 versions.", sev: "med" },
  { layer: "Layer 06 · Tool Stack", finding: "2 overlapping PM tools, $280/mo unused.", sev: "med" },
];

/* ---- Docs: SOP library ---- */
export const SOPS = [
  { title: "Client onboarding", meta: "v3 · 12 steps", status: "Live" },
  { title: "Proposal to contract", meta: "v2 · 8 steps", status: "Live" },
  { title: "Weekly reporting run", meta: "v1 · 6 steps", status: "Live" },
  { title: "Lead scoring rubric", meta: "v4 · 9 steps", status: "Draft" },
];
