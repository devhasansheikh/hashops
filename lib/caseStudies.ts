/**
 * Case study content.
 *
 * PUBLISHING RULES — these come from the internal publish gate and the metrics
 * brief. Read before editing:
 *  - Every figure here was verified with the client. Never estimate, never
 *    round up ("250 hrs", not "250+"). Show the arithmetic.
 *  - Never sum "returned" and "exposed" into one combined savings claim.
 *  - Never publish a client's own end-client names, their revenue, internal
 *    workspace URLs, or the engagement value.
 *  - Only quotes with written clearance go in `quote`.
 */

export type Stat = {
  value: string;
  /** Numeric part for the count-up; omit for non-numeric values like "2 days". */
  count?: { to: number; prefix?: string; suffix?: string };
  label: string;
};

export type Tier = {
  n: string;
  title: string;
  body: string;
  icon:
    | "control"
    | "isolate"
    | "project"
    | "spine"
    | "hubs"
    | "pipeline"
    | "personal";
};

export type CaseStudy = {
  slug: string;
  /** Card + modal cover. */
  cover: string;
  coverAlt: string;
  /** Small label pinned to the cover image. */
  coverBadge: string;
  eyebrow: string;
  title: string;
  accent: string;
  cardSummary: string;
  chips: string[];
  headline: string;
  standfirst: string;
  profile: { label: string; value: string }[];
  stats: Stat[];
  situation: string[];
  briefQuote: { text: string; source: string };
  costs: { title: string; body: string }[];
  buildIntro: string;
  tiers: Tier[];
  /** Defaults to "The databases underneath" when omitted. */
  databasesTitle?: string;
  databases: { name: string; does: string }[];
  mechanics: { title: string; body: string }[];
  /** Defaults to "Migration and handover" when omitted. */
  handoverTitle?: string;
  handover: string[];
  shift: { before: string; after: string }[];
  shiftClose: string;
  math: string[];
  quote?: { rating: number; text: string; author: string; role: string };
  /** Public Notion template of the build, opened in a new tab. */
  template?: { url: string; label: string; note: string };
  close: string[];
  kicker: string;
};

export const CASE_STUDIES: CaseStudy[] = [
  {
    slug: "uplabs-ai-notion-delivery-system",
    cover: "/case-studies/uplabs-control-room.webp",
    coverAlt:
      "The Uplabs AI general dashboard: the internal control room built in Notion, showing every active client account in one view",
    coverBadge: "The control room",
    eyebrow: "Case study 01 · AI development agency",
    title: "Six client accounts.",
    accent: "One control room.",
    cardSummary:
      "An AI agency ran every client out of a separate Notion space, with the real status living in the founder's head. We rebuilt it into one system that shows planned against actual delivery on every project, and gives each client a live view of their own work and nobody else's.",
    chips: ["Delivery OS build", "8 databases", "6 accounts migrated", "3 weeks"],

    headline: "No more guessing which projects were late.",
    standfirst:
      "An AI development agency was running every client project out of separate Notion spaces, with the real status living in the founder's head. HASH rebuilt it into a single system that shows planned against actual delivery on every project, and gives each client a live view of their own work and nobody else's. In the first fourteen months it recorded 250 hours of client-caused delay that would otherwise have been absorbed without a trace.",

    profile: [
      { label: "Client", value: "Uplabs AI" },
      { label: "Industry", value: "AI & software development agency" },
      { label: "Region", value: "Latin America" },
      { label: "Size", value: "Founder-led, small senior team" },
      { label: "Engagement", value: "Delivery OS build + migration" },
      { label: "Timeline", value: "3 weeks" },
    ],

    stats: [
      {
        value: "250 hrs",
        count: { to: 250, suffix: " hrs" },
        label:
          "Client-caused delay recorded in 14 months, previously absorbed silently",
      },
      {
        value: "8 hrs/week",
        count: { to: 8, suffix: " hrs" },
        label: "Senior time returned each week, worth about $12,200 a year",
      },
      {
        value: "$11,250",
        count: { to: 11250, prefix: "$" },
        label: "Delay now on the record, attributable and repriceable",
      },
    ],

    situation: [
      "Uplabs AI builds AI and automation systems for clients across Latin America: insurance, healthcare, real estate, industrial. Good work, real clients, growing fast.",
      "The delivery side hadn't kept up. Every client sat in its own isolated Notion team space. Project status was tracked manually. Development tasks lived in GitHub in engineer language, then got rewritten by hand into something a non-technical client could follow. Delivery dates were set in scoping calls and never checked against what actually happened.",
      "Which meant the only place the real picture existed was the founder's head. Every question, is this account late, are we losing money on this one, what's blocked and whose fault is it, had to route through one person, and that person had to reconstruct the answer from memory and six separate workspaces.",
    ],
    briefQuote: {
      text: "It must be a control center where we can monitor the real health of our client projects and make informed decisions week by week.",
      source: "Uplabs AI, from the original brief",
    },

    costs: [
      {
        title: "Scope expansion nobody logged",
        body: "Integrations turned out more complex than what was discussed in scoping. Extra work got absorbed. Because nothing recorded the gap between what was quoted and what was built, there was no evidence trail to re-price against, and no way to tell which project types were consistently underquoted.",
      },
      {
        title: "Client-side delays priced at zero",
        body: "When a client sat on documentation or approvals for a week, the deadline slipped and Uplabs wore it. No one was counting those hours, so no one could bill them, renegotiate around them, or point at them in a review call.",
      },
      {
        title: "The founder as the reporting layer",
        body: "Every status update, every client question, every internal “where are we on this” ran through the same person. That's senior time spent assembling information that should have assembled itself, and it caps how many accounts the agency can carry before delivery starts dropping balls.",
      },
    ],

    buildIntro:
      "A three-tier delivery system in Notion, built around one rule: internal truth and client view are the same data, rendered differently.",
    tiers: [
      {
        n: "Tier 01",
        title: "The internal control room",
        body: "The founder-facing dashboard. Every active project across every client on one screen: current phase, workload, blockers, client dependencies, and where each one sits against its committed date.",
        icon: "control",
      },
      {
        n: "Tier 02",
        title: "Client dashboards, isolated and read-only",
        body: "Each client gets a published mirror of their own account: their status, their pipeline, their charts, their dates. They cannot see, click into, or expand anything belonging to another client. Notion's default sharing leaks, so it was tested from an outside browser on a clean account until the client view showed exactly what it should and nothing else.",
        icon: "isolate",
      },
      {
        n: "Tier 03",
        title: "Project pages",
        body: "Inside each client, a page per project: pipeline as the first view, phase calendar, deliverables table, and the task tracker.",
        icon: "project",
      },
    ],

    databases: [
      { name: "Projects", does: "Phase, complexity, planned against actual delivery dates" },
      { name: "Clients", does: "Account-level roll-up and access control" },
      { name: "Event Log", does: "Every scope change, delay and blocker, with owner and impact" },
      { name: "Time Tracking", does: "Hours by phase, by project, by person" },
      { name: "Payments", does: "50% before Pilot, 50% before Production, receipts attached" },
      { name: "Meetings", does: "Contact reports filed after every session, linked to the project" },
      { name: "Deliverables", does: "What ships at each phase gate: Pilot 1, Pilot 2, Prod V1, V2" },
      { name: "Resources", does: "Documentation, credentials, endpoints, proposals" },
    ],

    mechanics: [
      {
        title: "Four pipeline statuses, not fourteen",
        body: "Not Started, In Development, Finishing, Waiting for Client. That fourth one is the important one: it puts client-caused delay on the record, visibly, in the client's own dashboard.",
      },
      {
        title: "Delay tracked in hours",
        body: "Planned date against actual date, with the gap attributed to whoever caused it, surfaced on the main dashboard rather than buried in a project page.",
      },
      {
        title: "Phase gates tied to real dates",
        body: "Pilot 1, Pilot 2, Prod V1, Prod V2, each with a deliverables table behind it rather than just a calendar entry.",
      },
      {
        title: "Engineering work translated once",
        body: "The client-facing task tracker mirrors GitHub work in business language, so a non-technical buyer can follow progress without booking a call.",
      },
      {
        title: "Payment tracking with proof attached",
        body: "Deposits and receipts sit against the project, not in someone's inbox.",
      },
    ],

    handover: [
      "Six live client accounts, one of them running multiple concurrent projects, were moved out of their legacy team spaces into the new structure with their existing data intact. Permissions were rebuilt account by account and tested from the outside.",
      "Then the founder was taught to run it: how to spin up a new client, how to publish a client-safe link, how to manage access without breaking isolation. The system had to survive without HASH in the room.",
    ],

    shift: [
      { before: "Six separate client spaces, no shared view", after: "One control room covering every active account" },
      { before: "Delivery dates set in scoping and never checked", after: "Planned against actual tracked on every project" },
      { before: "Client delays absorbed and unrecorded", after: "Logged in hours, attributed, visible to the client" },
      { before: "Scope expansion invisible until it hit margin", after: "Every change recorded with owner, date and impact" },
      { before: "Status updates rebuilt by hand from memory", after: "Client opens a live link and sees their own status" },
      { before: "Engineering work rewritten per client update", after: "Translated once, mirrored to the client view" },
      { before: "Founder is the reporting layer", after: "System is the reporting layer" },
    ],
    shiftClose:
      "The founder stopped being the place status information came from. The system became that place.",

    math: [
      "Status assembly before the build ran to eight hours a week. At a blended rate of $45, that is $18,720 a year of senior time spent putting together information that should have assembled itself. Counted conservatively, because the system removes the assembly and not the conversation, roughly $12,200 a year comes back.",
      "Separately, and more usefully: 250 hours of client-caused delay recorded in fourteen months. At $45 an hour that is $11,250 that used to be absorbed in silence. It is now logged, attributed, and visible to the client in their own dashboard, which is the difference between eating a slipped deadline and having the evidence to reprice around it.",
    ],

    quote: {
      rating: 4.7,
      text: "We came to HASH with a messy set of requirements — internal metrics, client-facing dashboards, permissions, delay tracking — and a lot of it only existed in our heads. They understood all of it. What we got back is the system we now run every client project through.",
      author: "Andrés Cardozo",
      role: "CEO, Uplabs AI",
    },

    close: [
      "Uplabs didn't have a delivery problem. They had a visibility problem that was quietly turning into a delivery problem: absorbed scope, unbilled client delay, and one person holding the whole picture.",
      "The build took three weeks. The leaks it exposed had been running for months.",
    ],
    kicker:
      "The expensive part isn't the fix. It's the year you spent not running the math.",
  },

  {
    slug: "royal-key-supply-executive-dashboard",
    cover: "/case-studies/royal-key-dashboard.webp",
    coverAlt:
      "The Royal Key Supply executive dashboard: the homepage of the 14-page operating system, with every department tile in one view",
    coverBadge: "The executive homepage",
    eyebrow: "Case study 02 · E-commerce operator",
    title: "Seven departments on one screen.",
    accent: "Adding an eighth takes one row.",
    cardSummary:
      "An e-commerce operator was running purchasing, refurbishment, warehouse, storefront, marketing and sales campaigns with no single place to see how any of it was performing. We built the executive layer: one shared data spine, seven department views drawing from it, and a homepage that answers how the business is doing without anyone having to ask.",
    chips: ["14 pages", "6 shared databases", "7 departments", "Build + architecture"],

    headline: "Not a rebuild.",
    standfirst:
      "Two people, an executive and an assistant, were expected to hold the performance picture for seven departments. HASH built the executive layer: one shared data spine, seven department views drawing from it, and a homepage that answers how the business is doing without asking anyone. The question that used to take two days to answer is now answered by opening the page.",

    profile: [
      { label: "Client", value: "Royal Key Supply" },
      { label: "Industry", value: "E-commerce & product distribution" },
      { label: "Users", value: "Executive, Ops Director, EA" },
      { label: "Scope", value: "14-page executive operating system" },
      { label: "Engagement", value: "Build + architecture" },
      { label: "Departments", value: "Seven, and it scales" },
    ],

    stats: [
      {
        value: "2 days → instant",
        label:
          "Time to answer “which department is behind target this month”",
      },
      {
        value: "7 hrs/week",
        count: { to: 7, suffix: " hrs" },
        label: "Returned to the executive assistant, every week",
      },
      {
        value: "$12,740",
        count: { to: 12740, prefix: "$" },
        label: "Annual value of that time at loaded rate",
      },
    ],

    situation: [
      "Royal Key Supply runs a multi-department product operation: purchasing, product management, a refurbishment arm, picking and shipping, a storefront, digital marketing, and sales campaigns. Seven functions, each with its own contact, its own targets, its own work in flight.",
      "The oversight layer was two people: an executive and an executive assistant, with the operations director alongside them. Not a reporting team. Two people expected to hold the performance picture for the entire business.",
      "They came in knowing what they wanted and knowing they couldn't build it themselves. The brief was specific: a centralized workspace for departments and KPIs, high-level visibility into performance and project progress, minimal manual data entry, and enough structure that one assistant and one executive could maintain the whole thing.",
    ],
    briefQuote: {
      text: "Apply your expertise in optimizing the layout, flow, and page hierarchy, as long as each page serves its department and contributes to a centralized view of business performance.",
      source: "Royal Key Supply, from the original brief",
    },

    costs: [
      {
        title: "“Minimal manual data entry where possible”",
        body: "That phrasing tends to come from someone re-typing numbers between places. Every derived figure, margin, average order value, percent complete, recalculated by hand is a figure that can be wrong somewhere without anyone knowing where.",
      },
      {
        title: "“High-level visibility into business performance”",
        body: "Seven departments reporting into two people with no shared surface means the executive picture gets assembled by asking around: a message to purchasing, a spreadsheet from marketing, a number from the warehouse, every time a decision needs making.",
      },
      {
        title: "“Scalable”",
        body: "They said it twice. That reads as a business planning to add departments, and someone wary of a structure that has to be rebuilt when the business grows.",
      },
    ],

    buildIntro:
      "Fourteen pages. Six shared databases. One rule that determined everything else: departments get views, not copies.",
    tiers: [
      {
        n: "Layer 01",
        title: "The spine",
        body: "Six central databases hold every record in the business, once. A seventh, the department registry, is the hinge: every other database carries a relation back to it, which is what lets a record live in one place and appear everywhere it's relevant.",
        icon: "control",
      },
      {
        n: "Layer 02",
        title: "The department pages",
        body: "Seven pages, identical in structure, each showing that department's SOPs, tasks, projects, contacts, KPI tracker and monthly revenue. All of them filtered views of the shared databases, none a separate copy. A task logged on the Purchasing page is the same task the executive sees on the homepage.",
        icon: "project",
      },
      {
        n: "Layer 03",
        title: "The executive homepage",
        body: "Two columns, built for a thirty-second read: today's tasks, active projects and contacts down the left; KPI summary and monthly revenue across the right. Quick Links and the navigation panel are synced blocks, so editing the nav once updates all fourteen pages.",
        icon: "isolate",
      },
    ],

    databases: [
      { name: "KPI", does: "Metric, target, actual, month, department, with an automatic status formula" },
      { name: "Projects", does: "Cross-departmental initiatives: owner, status, dates, linked tasks" },
      { name: "Tasks", does: "Shared to-do layer: assignee, priority, due date, linked project" },
      { name: "SOPs", does: "Categorized procedure library linking out to Scribe, Active or Draft" },
      { name: "Contacts", does: "Department contacts, with preferred contact method" },
      { name: "Revenue & Profit", does: "Monthly sales and expenses, with profit, margin and AOV computed" },
      { name: "Department registry", does: "The hinge every other database relates back to" },
    ],

    mechanics: [
      {
        title: "Nothing derived is ever typed",
        body: "Profit, profit margin and average order value are formulas over monthly sales, revenue and expenses. Type the inputs once, the rest computes.",
      },
      {
        title: "KPI status decides itself",
        body: "A formula compares actual against target, so the executive sees whether a number is on track without doing the comparison.",
      },
      {
        title: "Project progress updates itself",
        body: "A rollup counts completed tasks against total linked tasks, so percent complete moves as work gets ticked off.",
      },
      {
        title: "Budget stayed in Google Sheets",
        body: "The Budget Tracker page holds a dedicated embed slot per department, so finance keeps working where it already works and the executive still sees it inside the dashboard.",
      },
      {
        title: "SOPs stayed in Scribe",
        body: "The SOP Library is a categorized, department-linked index of Scribe links rather than a re-hosting of the procedures. The fastest way to kill an internal system is to make people abandon the tools they already use.",
      },
    ],

    handoverTitle: "Why it scales",
    handover: [
      "Adding an eighth department is one new row in the department registry. The views populate themselves. No rebuild, no duplicated database, no migration.",
      "Most operations builds fail in their second year rather than their first: they work for the departments that existed on the day they were built, then the business adds a function and the whole thing needs redoing.",
    ],

    shift: [
      { before: "Performance picture assembled by asking seven departments", after: "One homepage; KPI summary and monthly revenue on open" },
      { before: "Derived numbers typed by hand", after: "Calculated by formula and rollup, never entered twice" },
      { before: "Department information scattered across tools and people", after: "Six shared databases, each record entered once" },
      { before: "A task or project can exist in two versions", after: "One record, many filtered views, nothing to reconcile" },
      { before: "Adding a department means restructuring the workspace", after: "One row in the registry; views populate themselves" },
      { before: "Budget and SOPs live outside any executive view", after: "Sheets embedded per department, Scribe indexed and categorized" },
      { before: "Navigation edited page by page", after: "Synced blocks, edited once, propagated across fourteen pages" },
    ],
    shiftClose:
      "Two people can hold oversight of seven departments because the structure does the holding, not their memory.",

    template: {
      url: "https://hashtemplates.notion.site/Royal-Key-Supply-Executive-Dashboard-234939e6117e80a4ac25e769e007b059",
      label: "Open the executive dashboard template",
      note: "Most agencies show you screenshots of a build. You can open this one and click through it: the executive homepage, the department pages, and the shared databases behind them.",
    },

    math: [
      "Compiling seven departments into something the executive could actually read took the executive assistant seven hours a week. At a loaded rate of $35, that is $12,740 a year: most of a working day, every week, spent turning scattered updates into one readable picture. Counted conservatively, around $8,300 of it comes back permanently.",
      "The sharper change is the one that needs no arithmetic. “Which department is behind target this month” used to take two days to answer. It is now answered by opening the page.",
    ],

    close: [
      "This one adds a department in a row, and it turned a two-day question into a two-second one.",
      "That was the brief, they asked for scalable twice, and it is the difference between a workspace and an operating system.",
    ],
    kicker:
      "The expensive part isn't the fix. It's the year you spent not running the math.",
  },

  {
    slug: "primas-multi-business-command-center",
    cover: "/case-studies/primas-command-center.webp",
    coverAlt:
      "The PRIMAS Business Command Center: the main dashboard, with the Quick Actions gallery, synced navigation and inbox in one view",
    coverBadge: "The command center",
    eyebrow: "Case study 03 · Five-business operator",
    title: "They wrote the blueprint themselves.",
    accent: "Building it was the part that never happened.",
    cardSummary:
      "One operator running five businesses sent us a detailed, expert-level spec for the system they needed, along with the words “here is what I have so far.” We built it: twenty-one linked databases, five company hubs, a six-stage content pipeline, and a private personal layer, all running off one shared spine.",
    chips: ["21 databases", "5 company hubs", "6-stage pipeline", "Personal layer"],

    headline: "",
    standfirst:
      "A complete specification and no system. HASH built it: twenty-one linked databases, five company hubs, a six-stage content pipeline, and a private personal layer, all running off one shared spine. Content output roughly doubled, and the three pieces a month that used to die between filming and publishing stopped dying.",

    profile: [
      { label: "Client", value: "PRIMAS" },
      { label: "Structure", value: "Five businesses, one operator" },
      { label: "Scope", value: "Multi-business operating system" },
      { label: "Build", value: "21 databases, 5 hubs, 1 personal layer" },
      { label: "Engagement", value: "Architecture + build" },
      { label: "Content pipeline", value: "Six stages, shared with a VA" },
    ],

    stats: [
      {
        value: "5 → 9–12",
        label: "Pieces published per month. Output roughly doubled",
      },
      {
        value: "36 / year",
        count: { to: 36, suffix: " / yr" },
        label: "Pieces that used to die between shot and posted",
      },
      {
        value: "Daily → 2×/week",
        label: "Status messages between the operator and the VA",
      },
    ],

    situation: [
      "PRIMAS isn't one company. It's five: PRIMAS, Function PCP, Franchising, The Pilates Shop, and AI Agents, run by one operator.",
      "Five businesses means five sets of tasks, five sets of projects, five pipelines of meetings, five marketing efforts, and five sets of numbers, held by one person. Every switch between them is a context reload: where was I, what's owed, who's waiting, what's late.",
      "What makes this engagement unusual is that the client had already solved it on paper. They arrived with a document titled Interactive Build Blueprint (Expert-Level): a full architecture. Database schemas with property types. View specifications with filter logic. Page hierarchy. Template structures. Nested navigation. They had thought it through properly.",
    ],
    briefQuote: {
      text: "Here is what I have so far.",
      source: "PRIMAS, opening line of the brief",
    },

    costs: [
      {
        title: "Content lost between filming and publishing",
        body: "This one the client named outright: they asked for a way to see what had been shot, edited and posted, workable alongside a VA. Three pieces a month were being filmed, paid for, then losing their place and never going out.",
      },
      {
        title: "Five businesses, five mental models",
        body: "With no shared surface, each business is held separately and nothing surfaces across them. A late task in one and a stalled project in another never appear on the same screen, so priority tends to follow whichever business shouted most recently.",
      },
      {
        title: "A specification is not a system",
        body: "A spec that never gets built arguably costs more than no spec at all: the thinking is already paid for and the payoff keeps getting deferred. A blueprint sitting in a document earns nothing.",
      },
    ],

    buildIntro:
      "The PRIMAS Business Command Center: one master page, twenty-one databases, five company hubs, and a personal layer, all drawing on the same records.",
    tiers: [
      {
        n: "Layer 01",
        title: "The spine",
        body: "Every record in every business lives once, in a single Database Hub, tagged to the business it belongs to. The hub is marked “do not edit this tab”: the structural layer is fenced off from daily use, because systems built for non-technical operators break when someone edits a schema by accident.",
        icon: "spine",
      },
      {
        n: "Layer 02",
        title: "Five company hubs",
        body: "Each business gets its own hub with five sub-pages and a dashboard covering its projects, tasks, KPIs, marketing, meetings and finances. Every panel is a filtered view of the shared databases, so a task created inside one hub is the same record the operator sees at the top.",
        icon: "hubs",
      },
      {
        n: "Layer 03",
        title: "The content pipeline",
        body: "The Content Manager tracks every piece through six stages: Idea, Scripted, Shot, Edited, Scheduled, Published. Each item carries its business, platform, format, assignee, date and caption, and renders as a kanban, a calendar and a filtered list.",
        icon: "pipeline",
      },
      {
        n: "Layer 04",
        title: "The executive dashboard",
        body: "Inbox, projects, resources, notes and meetings on open, with a Quick Actions gallery for creating a task, meeting or project without navigating anywhere. The navigation panel is synced, so it is edited in one place.",
        icon: "control",
      },
      {
        n: "Layer 05",
        title: "The personal layer",
        body: "Personal tasks, meetings, journal, habits, goals, finances and contacts sit in their own section, filtered to the operator alone. Business and personal draw on the same infrastructure but never appear on the same screen.",
        icon: "personal",
      },
    ],

    databasesTitle: "Twenty-one databases, in six groups",
    databases: [
      { name: "Operations", does: "Master Tasks, Projects, Meetings, Client CRM, Team Directory, SOP Library" },
      { name: "Marketing", does: "Content Manager, Idea Bank, Videos, B-Roll, Platforms" },
      { name: "Performance", does: "Metrics, KPI" },
      { name: "Finance", does: "Income, Expense, Savings" },
      { name: "Personal", does: "Journal, Habits, Goal Tracker" },
      { name: "Knowledge", does: "Resources, Notes" },
    ],

    mechanics: [
      {
        title: "One task record, five businesses",
        body: "Master Tasks carries a company selector across all five, plus a project relation, status, priority and a recurrence setting for daily, weekly or monthly work.",
      },
      {
        title: "Archive instead of delete",
        body: "An archive flag moves completed work out of the working views without destroying it, so active screens stay readable and nothing is lost.",
      },
      {
        title: "The pipeline answers the actual question",
        body: "The operator and the VA can both see what has been shot, what has been edited and what has gone out, without asking each other. Idea Bank captures, B-Roll holds footage, Platforms is the channel registry.",
      },
      {
        title: "Capture beats the notes app",
        body: "Quick Add buttons sit on the main dashboard, in every company hub and in the personal layer, each pre-filling company, project, priority and assignee. Capture has to be faster than the impulse to write it somewhere else, or the system loses within a fortnight.",
      },
    ],

    handoverTitle: "Whose architecture this is",
    handover: [
      "The blueprint was written by the client, not by HASH. They didn't need anyone to tell them what to build: they had already specified the schemas, the filters and the hierarchy themselves.",
      "What they needed was someone to build it, make the pieces talk to each other, and hand back something a non-technical operator could run across five businesses without breaking it.",
    ],

    shift: [
      { before: "A detailed blueprint sitting in a document", after: "A running system built to that blueprint" },
      { before: "Five businesses held as five separate mental models", after: "Five hubs on one spine, every record tagged to its business" },
      { before: "Nothing visible across businesses at once", after: "One dashboard surfacing tasks, projects and meetings across all five" },
      { before: "Content lost between filming and publishing", after: "Six-stage pipeline: shot, edited, scheduled, published, all visible" },
      { before: "The VA and the operator asking each other for status", after: "Both read the same board" },
      { before: "Personal life scattered through business notes", after: "A separate personal layer on shared infrastructure" },
      { before: "Capture depends on remembering where things go", after: "Template buttons pre-filling company, project, priority, assignee" },
      { before: "Completed work clutters active views", after: "Archive flag and archive layer, nothing deleted, nothing in the way" },
    ],
    shiftClose:
      "One operator can hold five businesses because the structure holds them, not their memory.",

    template: {
      url: "https://hashtemplates.notion.site/PRIMAS-Business-Command-Center-1e6939e6117e800a9602df1a8fccac03",
      label: "Open the command center template",
      note: "Most agencies show you screenshots of a build. You can open this one and click through it: the company hubs, the six-stage content pipeline, and the spine they all read from.",
    },

    math: [
      "Before the pipeline, five pieces went out a month. Now it is nine to twelve. Output roughly doubled without adding a person.",
      "The number underneath that one matters more. Three pieces a month used to die between shot and posted: filmed, paid for, then lost track of and never published. That is thirty-six pieces a year of production bought and thrown away, and it stopped because every piece now has a visible stage rather than a place in someone's memory.",
      "The messages went too. “Has this been edited yet” ran near-daily between the operator and the VA. It now runs twice a week, because both of them read the same board.",
    ],

    close: [
      "The client didn't need a consultant to tell them what to build. They had already done that: schemas, filters, hierarchy, the lot.",
      "A blueprint returns nothing. A system returns the hours you spend switching between businesses trying to remember where you were.",
    ],
    kicker:
      "The expensive part isn't the fix. It's the year you spent not running the math.",
  },
];
