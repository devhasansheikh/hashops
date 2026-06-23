"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useReduceMotion } from "@/lib/useReduceMotion";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHead } from "@/components/ui/SectionHead";

const ITEMS = [
  {
    q: "Why start with an audit and not a build?",
    a: "Building the wrong thing is the most expensive mistake in operations. The audit produces a written number first: what your top leaks are actually costing you in hours and dollars. If the math doesn't justify a build, we tell you, and you've spent a fraction of a full project to find that out instead of five figures.",
  },
  {
    q: "What does this cost? Why are there no prices on the page?",
    a: "Because the price follows the scope, and the scope follows the audit. We won't quote a number before we know which leaks are actually costing you money, which is exactly how businesses end up paying for systems they don't need. The audit tells both of us precisely what to build and what it's worth, and the investment is always a fraction of what the leak costs you over a year. You'll have a clear number before any build starts, and nothing begins until you've agreed to it.",
  },
  {
    q: "We already use ERPs and tools. Do we still need you?",
    a: "Almost everyone we work with already has tools. Having tools isn't the same as having a system. The problem is usually the gaps between them and the fact that everyone uses them slightly differently. We don't sell you new software. We make what you already pay for actually run your business: the same way, every time, without you in the middle of it.",
  },
  {
    q: "Can't we just build this ourselves?",
    a: "Probably, and you likely already know roughly what needs fixing. The honest problem isn't knowing how; it's that building it is 100+ hours you'll never prioritise over client work, so it sits on the someday list while it quietly keeps costing you. We do the part you won't get to, in weeks, not 'eventually', and built so your team actually uses it instead of working around it.",
  },
  {
    q: "Will this replace my team?",
    a: "No, and that's not what good systems do. We take the repetitive, manual work off your team's plate so their hours go to the work clients actually pay for. The point is more capacity from the people you already have, so you can take on more without hiring ahead of the revenue.",
  },
  {
    q: "How long does a project take?",
    a: "The audit itself takes about a week. A focused single-system build is typically 2–4 weeks; a full operating-system build runs 4–8. You see progress the whole way: milestone delivery with an update every Friday, not one big reveal at the end.",
  },
  {
    q: "What do you need from us?",
    a: "Less than you'd think. A kickoff call, access to your tools, and a few hours across the whole project to review what we build and confirm it matches how you actually work. We do the building; you stay running your business. The entire point is to take work off your plate, not hand you a project to manage.",
  },
  {
    q: "Do you guarantee results?",
    a: "We guarantee the diagnosis is honest: if the audit shows a build won't pay for itself, we tell you and you walk away having spent very little. We won't promise a specific revenue figure, because that depends on how your team adopts the system, and anyone who does promise one is guessing. What we do guarantee is that every build is costed against the time and money it recovers before we touch it, so you know the return before you commit.",
  },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  const reduce = useReduceMotion();

  return (
    <section id="faq" className="relative px-5 py-24 sm:px-8">
      <SectionHead
        index="09"
        eyebrow="FAQ"
        title="Questions founders actually ask."
      />

      <Reveal delay={0.1} className="mx-auto mt-12 max-w-[680px]">
        <div className="surface-card overflow-hidden rounded-card">
          {ITEMS.map((item, i) => {
            const isOpen = open === i;
            return (
              <div key={item.q} className={i > 0 ? "border-t border-line" : ""}>
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-3 px-6 py-5 text-left transition-colors hover:bg-surface2/40 sm:gap-6 sm:px-8"
                >
                  <span
                    className={`font-display text-[15.5px] font-medium transition-colors ${
                      isOpen ? "text-flametext" : "text-heading"
                    }`}
                  >
                    {item.q}
                  </span>
                  <motion.span
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-line text-body"
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    transition={{ duration: reduce ? 0 : 0.3, ease: [0.2, 0.7, 0.3, 1] }}
                    aria-hidden
                  >
                    <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                      <path
                        d="M6 1v10M1 6h10"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                    </svg>
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={reduce ? false : { height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={reduce ? undefined : { height: 0, opacity: 0 }}
                      transition={{ duration: 0.32, ease: [0.2, 0.7, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="px-6 pb-6 text-[14.5px] leading-relaxed text-body sm:px-8">
                        {item.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </Reveal>
    </section>
  );
}
