"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useReduceMotion } from "@/lib/useReduceMotion";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHead } from "@/components/ui/SectionHead";

const ITEMS = [
  {
    q: "Why start with an audit and not a build?",
    a: "Building the wrong thing is the most expensive mistake in ops. The audit produces a written ROI calculation first. If the math doesn't work, we tell you, and you've spent a fraction of a full project to find that out.",
  },
  {
    q: "We already use Notion / ClickUp. Do we still need you?",
    a: "Most clients already have the tools. The issue is the gaps between them and how they're configured. We make the stack actually fit the way your business runs.",
  },
  {
    q: "How long does a project take?",
    a: "A single system takes 2–4 weeks, a dual build 4–6, and a full overhaul 6–10. Every project starts with the 7-day audit.",
  },
  {
    q: "Do you guarantee results?",
    a: "We guarantee the deliverables in scope and revise anything that misses acceptance criteria. Outcomes depend on your team using what we build. And if the audit says the ROI isn't there, we don't proceed.",
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
