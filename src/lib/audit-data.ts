/* ------------------------------------------------------------------ */
/*  The 7-Layer Ops Audit                                              */
/*  Questions + cost lines are the brief's source of truth (§10).      */
/*  diagnostic + redFlags enrich the diagnosis from HASH's own         */
/*  7-Layer Ops Audit framework (the PDF), reframed for the web quiz.  */
/* ------------------------------------------------------------------ */

export interface AuditLayer {
  id: number;
  name: string;
  /** Yes/No symptom. Yes = the red flag is present. */
  question: string;
  /** Shown only when the layer is flagged. */
  cost: string;
  /** The open diagnostic question from the framework. */
  diagnostic: string;
  /** Concrete red flags from the framework. */
  redFlags: string[];
}

export const AUDIT_LAYERS: AuditLayer[] = [
  {
    id: 1,
    name: "Lead-to-Cash Visibility",
    question:
      "Does your sales pipeline live across scattered notes, heads, and Slack, with no single source of truth?",
    cost: "Deals slip through cracks you can't see, and cash flow takes surprise dips.",
    diagnostic:
      "Can you tell me, in 60 seconds, how many active deals you have and the next action for each?",
    redFlags: [
      "Pipeline lives across reps' notes, heads, and Slack channels",
      "A weekly meeting exists just to figure out what's open",
      "Forecasts are gut feel, not data",
    ],
  },
  {
    id: 2,
    name: "Client Delivery Operations",
    question:
      "Is delivery run differently for every client, with you as the bottleneck on every approval?",
    cost: "Delivery quality depends on who's running it, so scaling means cloning you.",
    diagnostic:
      "Where does the work live between contract signed and project delivered?",
    redFlags: [
      "Two clients onboarded the same week have totally different setups",
      "Project status requires a Slack message to find out",
      "The founder is the bottleneck on every approval",
    ],
  },
  {
    id: 3,
    name: "Communication & Decision Flow",
    question:
      "Are Slack DMs your main decision channel, with the same questions resurfacing every month?",
    cost: "Your attention becomes the rate-limiter, and every new hire makes it worse.",
    diagnostic:
      "When the team needs a decision, where does it go, and how long until it's answered?",
    redFlags: [
      "Slack DMs are the primary decision-making channel",
      "The same questions get asked every month",
      "Meetings exist to share what should've been written",
    ],
  },
  {
    id: 4,
    name: "Knowledge & Documentation",
    question:
      "Do critical processes live mostly in your head instead of documented anywhere?",
    cost: "The business can't function without you, hiring stays risky, and selling is impossible.",
    diagnostic: "If you stopped working tomorrow, what would break first?",
    redFlags: [
      "Critical processes live only in the founder's head",
      "Onboarding a new hire takes 4–8 weeks",
      "Client history requires asking three different people",
    ],
  },
  {
    id: 5,
    name: "Reporting & Dashboards",
    question:
      "Are your key numbers pulled manually each month, with people trusting different versions?",
    cost: "Decisions wait on clarity, and the data is a month old when it lands.",
    diagnostic:
      "What numbers do you check every Monday, and how do you actually pull them?",
    redFlags: [
      "Reports are built manually in spreadsheets each month",
      "Different people have different versions of the same numbers",
      "The founder makes decisions on instinct, not data",
    ],
  },
  {
    id: 6,
    name: "Tool Stack",
    question:
      "Are you paying for overlapping tools, some that no one even logs into?",
    cost: "Roughly $500–$3,000/month in invisible SaaS bleed, plus fragmented information.",
    diagnostic:
      "List every paid tool the business uses, and the one person responsible for each.",
    redFlags: [
      "Multiple tools doing 70% of the same job",
      "Subscriptions paid for tools no one logs into",
      "Tools chosen by hype, not by workflow fit",
    ],
  },
  {
    id: 7,
    name: "Hiring & Onboarding",
    question:
      "Does a new hire need weeks of shadowing before they're productive, with no documented onboarding?",
    cost: "Every hire delays revenue instead of driving it, so you stop hiring when you shouldn't.",
    diagnostic:
      "How long until a new hire is producing real output independently?",
    redFlags: [
      "No documented onboarding sequence exists",
      "New hires shadow the founder for weeks",
      "Each new hire reinvents how their role works",
    ],
  },
];

export interface Verdict {
  title: string;
  sub: string;
}

/** Verdict by number of flagged layers (reds). */
export function getVerdict(reds: number): Verdict {
  if (reds === 0)
    return {
      title: "Tight ship.",
      sub: "Your operational core is solid. Keep the documentation current as you grow.",
    };
  if (reds <= 2)
    return {
      title: "A couple of quiet leaks.",
      sub: "Nothing's on fire, but small gaps compound. Worth closing before they cost you.",
    };
  if (reds <= 4)
    return {
      title: "Your ops are straining.",
      sub: "Growth is being taxed. This is the sweet spot for a build.",
    };
  return {
    title: "You are the system.",
    sub: "The business runs through you. That's the ceiling on how far it scales.",
  };
}

/** Transparent lead-magnet estimate. Tune the multiplier as needed. */
export function estimateCost(reds: number) {
  const hours = reds * 3;
  const annual = hours * 35 * 52;
  return { hours, annual };
}
