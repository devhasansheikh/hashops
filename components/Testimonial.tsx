"use client";

import { useReduceMotion } from "@/lib/useReduceMotion";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHead } from "@/components/ui/SectionHead";

/**
 * Reviews wall — the 12 authentic client reviews in vertical marquee columns
 * scrolling at staggered speeds (middle column runs the other way). Pauses on
 * hover; renders as a static grid when the site's reduce-motion flag is on.
 */

type Review = {
  name: string;
  country: string;
  iso2: string;
  rating: number;
  text: string;
  note?: string;
};

const REVIEWS: Review[] = [
  {
    name: "trooper0001",
    country: "Portugal",
    iso2: "pt",
    rating: 5,
    text: "HASH absolutely delivered. I came in with just a rough idea and couldn't explain exactly what I wanted — the team had the patience to try different approaches and work through revision after revision until it was right. Real attention to detail, real professionalism, and the whole process was smooth. Couldn't recommend them more.",
  },
  {
    name: "vincent_ferrara",
    country: "France",
    iso2: "fr",
    rating: 5,
    text: "HASH automated my entire Notion workspace and the results have been incredible. It saved me countless hours of manual work and doubled my productivity. Every part of my workflow runs seamlessly now, so I can focus on what actually matters. Professional, attentive, and they delivered exactly what I needed. If you want to level up how your business runs, hire them.",
  },
  {
    name: "zakarieadorno",
    country: "United States",
    iso2: "us",
    rating: 4.7,
    text: "HASH delivered top-notch data and reporting work with real professionalism and attention to detail. Working with the team was seamless — quick to respond, proactive on communication, and on time.",
  },
  {
    name: "salesentourage",
    country: "United States",
    iso2: "us",
    rating: 5,
    text: "We hired HASH to build a custom Excel system for our business and the team was incredibly thorough. They delivered exactly what we needed and went past our expectations. We'll be working with them again — very responsive, and they even get on Zoom to make sure everything makes sense.",
  },
  {
    name: "monsieurlead",
    country: "Réunion",
    iso2: "re",
    rating: 5,
    text: "We needed to centralize our marketing and sales tracking into one system. Multiple acquisition channels, a lot of automated formulas — complex to design. HASH delivered something comprehensive but easy to use, with a clean, well-thought-out layout, and recorded a walkthrough video at the end explaining exactly how it works. Highly recommend.",
  },
  {
    name: "paigehoward",
    country: "Canada",
    iso2: "ca",
    rating: 5,
    text: "Working with HASH was a pleasure. The quality completely exceeded my expectations and the team went above and beyond on every detail. They were professional, supportive, and genuinely cared about pointing me in the right direction when I wasn't sure which way to go. The whole process was smooth and stress-free.",
  },
  {
    name: "idrisseangama",
    country: "Gabon",
    iso2: "ga",
    rating: 5,
    text: "I've worked with HASH for a while now and I'm always satisfied. The quality of the deliverables and how easily they understand what I want is why I keep coming back. If you want a team that exceeds expectations, this is the one.",
  },
  {
    name: "mkniter",
    country: "Bulgaria",
    iso2: "bg",
    rating: 5,
    text: "HASH is professional and knows their stuff. They delivered exactly what I asked for and I'm extremely happy with the result. Detail-oriented, and the documentation they included was clear and easy to follow. If you need an operational system built right, HASH will surpass expectations. I'll be back.",
  },
  {
    name: "efs_nz",
    country: "New Zealand",
    iso2: "nz",
    rating: 5,
    text: "HASH is responsive and quick to work with. The delivery was excellent and exceeded my expectations — we're really pleased with the work and how usable it is. Wouldn't hesitate to recommend them.",
  },
  {
    name: "duezzero",
    country: "Italy",
    iso2: "it",
    rating: 5,
    note: "Translated from Italian",
    text: "Very precise and well-organized, available right away for revisions or corrections. Communication was perfect and the work was excellent. Genuinely capable — whenever they needed input to do the job better, they asked and stayed available for questions. Absolutely satisfied. Highly recommend.",
  },
  {
    name: "staian",
    country: "Czech Republic",
    iso2: "cz",
    rating: 5,
    text: "Hard to find the words for how impressed I am. The work is incredible and surpassed every expectation I had for quality. Deeply grateful for what HASH delivered, and already looking forward to the next project with them.",
  },
  {
    name: "athosquebec",
    country: "Canada",
    iso2: "ca",
    rating: 5,
    text: "The quality of service was outstanding — I was thoroughly impressed with the attention to detail and the care taken to get everything right. I felt valued as a client and appreciated the personalized attention. My experience with HASH was nothing short of exceptional.",
  },
];

/** Real SVG country flag (flag-icons) — crisp on every OS. */
function Flag({ iso2 }: { iso2: string }) {
  return (
    <span
      aria-hidden
      className={`fi fi-${iso2}`}
      style={{
        width: 21,
        height: 15,
        borderRadius: 3,
        backgroundSize: "cover",
        backgroundPosition: "center",
        boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.08)",
        flexShrink: 0,
      }}
    />
  );
}

function StarRow({
  size,
  className = "",
}: {
  size: number;
  className?: string;
}) {
  return (
    <span className={`inline-flex gap-[3px] ${className}`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden
        >
          <path d="M12 2.6l2.9 5.9 6.5.95-4.7 4.6 1.1 6.5-5.8-3.05-5.8 3.05 1.1-6.5-4.7-4.6 6.5-.95z" />
        </svg>
      ))}
    </span>
  );
}

/** 5-star meter with fractional fill (e.g. 4.7 clips the last star). */
function Stars({ rating, size = 13 }: { rating: number; size?: number }) {
  return (
    <span
      className="relative inline-flex"
      role="img"
      aria-label={`Rated ${rating} out of 5`}
    >
      <StarRow size={size} className="text-[var(--border-strong)]" />
      <span
        className="absolute inset-0 overflow-hidden"
        style={{ width: `${(rating / 5) * 100}%` }}
        aria-hidden
      >
        <StarRow size={size} className="text-flame" />
      </span>
    </span>
  );
}

function ReviewCard({
  review,
  className = "",
}: {
  review: Review;
  className?: string;
}) {
  return (
    <figure
      className={`surface-card surface-card-lift flex flex-col rounded-card p-6 ${className}`}
    >
      <div className="flex items-center justify-between gap-3">
        <Stars rating={review.rating} />
        <span className="font-mono text-[10px] tracking-[0.08em] text-muted tabular-nums">
          {review.rating.toFixed(1)}
        </span>
      </div>
      <blockquote className="mt-4 text-[13.5px] leading-relaxed text-bodystrong">
        &ldquo;{review.text}&rdquo;
      </blockquote>
      <figcaption className="mt-5 flex items-center gap-2.5 border-t border-line pt-4">
        <Flag iso2={review.iso2} />
        <div className="min-w-0">
          <p className="truncate font-display text-[13.5px] font-semibold text-heading">
            {review.name}
          </p>
          <p className="mt-0.5 font-mono text-[9px] uppercase tracking-[0.14em] text-muted">
            {review.country}
            {review.note ? ` · ${review.note}` : ""}
          </p>
        </div>
      </figcaption>
    </figure>
  );
}

/** Chunks the reviews into `count` marquee columns (content duplicated once). */
function Wall({
  count,
  cardClass,
  speeds,
  className = "",
}: {
  count: number;
  cardClass: string;
  speeds: number[];
  className?: string;
}) {
  const per = Math.ceil(REVIEWS.length / count);
  const cols = Array.from({ length: count }, (_, i) =>
    REVIEWS.slice(i * per, (i + 1) * per),
  );
  return (
    <div className={`justify-center gap-[18px] ${className}`}>
      {cols.map((col, i) => (
        <div
          key={i}
          className={`reviews-col ${i === 1 ? "reviews-col-down" : ""}`}
          style={{ "--speed": `${speeds[i]}s` } as React.CSSProperties}
        >
          {[...col, ...col].map((review, j) => (
            <div key={j} aria-hidden={j >= col.length || undefined}>
              <ReviewCard review={review} className={cardClass} />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export function Testimonial() {
  const reduce = useReduceMotion();

  return (
    <section id="reviews" className="relative overflow-hidden px-5 py-24 sm:px-8">
      {/* faint warm wash behind the wall */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[70%] w-[min(1100px,100%)] -translate-x-1/2 -translate-y-1/2"
        style={{
          background:
            "radial-gradient(ellipse at center, var(--flame-glow), transparent 70%)",
          opacity: 0.7,
        }}
      />

      <SectionHead
        index="09"
        eyebrow="Client reviews"
        title={
          <>
            In their own{" "}
            <span className="serif-accent gradient-text">words.</span>
          </>
        }
        lead="Verified reviews from founders and teams we've built for."
      />

      {reduce ? (
        <div className="mx-auto mt-12 grid max-w-content gap-[18px] sm:grid-cols-2 lg:grid-cols-3">
          {REVIEWS.map((review) => (
            <ReviewCard key={review.name} review={review} />
          ))}
        </div>
      ) : (
        <Reveal
          delay={0.1}
          className="reviews-wall reviews-mask relative mx-auto mt-12 h-[560px] max-w-content overflow-hidden sm:h-[600px] lg:h-[660px]"
        >
          {/* one column on phones, two on tablets, three on desktop — every
              variant carries all 12 reviews so nothing is hidden */}
          <Wall
            count={1}
            speeds={[150]}
            cardClass="w-[min(88vw,380px)]"
            className="flex sm:hidden"
          />
          <Wall
            count={2}
            speeds={[85, 100]}
            cardClass="w-[300px]"
            className="hidden sm:flex lg:hidden"
          />
          <Wall
            count={3}
            speeds={[58, 72, 64]}
            cardClass="w-[calc(min(1120px,92vw)/3-12px)] max-w-[356px]"
            className="hidden lg:flex"
          />
        </Reveal>
      )}
    </section>
  );
}
