"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Section, SectionHeader } from "./ui/Section";
import { Reveal } from "./ui/Reveal";
import { ChevronDown } from "./ui/icons";
import { cn } from "@/lib/utils";

const FAQS = [
  {
    q: "Why start with an audit and not a build?",
    a: "Because building the wrong thing is the most expensive mistake. The audit produces a written ROI calculation first. If the math doesn't work we tell you, and you've spent a fraction of a full project to know that.",
  },
  {
    q: "We already use Notion or ClickUp. Do we still need you?",
    a: "Most clients already have the tools. The issue is usually the gaps between them and how they're configured. We make the stack actually fit the way your business runs.",
  },
  {
    q: "How long does a project take?",
    a: "A single-system build runs 2–4 weeks, a dual system 4–6, and a full overhaul 6–10, always starting with the 7-day audit.",
  },
  {
    q: "Do you guarantee results?",
    a: "We guarantee the deliverables in the scope and revise anything that misses acceptance criteria. Outcomes depend on your team using what we build, but if the audit says the ROI doesn't work, we don't proceed.",
  },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <Section id="faq">
      <SectionHeader eyebrow="FAQ" heading="Answers before the call." />

      <div className="mx-auto mt-12 max-w-2xl">
        {FAQS.map((item, i) => {
          const isOpen = open === i;
          return (
            <Reveal key={item.q} delay={i * 0.06}>
              <div className="border-t border-line last:border-b">
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-4 py-5 text-left"
                >
                  <span
                    className={cn(
                      "font-display text-[1.08rem] font-medium transition-colors",
                      isOpen ? "text-flame" : "text-heading",
                    )}
                  >
                    {item.q}
                  </span>
                  <span
                    className={cn(
                      "grid h-8 w-8 shrink-0 place-items-center rounded-full border transition-all duration-300",
                      isOpen
                        ? "rotate-180 border-flame/40 text-flame"
                        : "border-line text-body",
                    )}
                  >
                    <ChevronDown className="h-4 w-4" />
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="max-w-xl pb-6 pr-10 text-[0.98rem] leading-relaxed text-body">
                        {item.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}
