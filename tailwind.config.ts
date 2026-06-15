import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Theme-aware neutrals (driven by CSS variables in globals.css)
        bg: "var(--bg)",
        surface: "var(--surface)",
        "surface-2": "var(--surface-2)",
        line: "var(--border)",
        "line-strong": "var(--border-strong)",
        heading: "var(--heading)",
        body: "var(--body)",
        "body-strong": "var(--body-strong)",
        muted: "var(--muted)",

        // Brand — constant across themes (hex so /opacity modifiers work)
        flame: "#FF7A1A",
        sunrise: "#FFA033",
        ember: "#E55A00",

        // Product UI status colours (workspace + quiz only)
        success: "#1D9E75",
        warning: "#EF9F27",
        error: "#E24B4A",
      },
      fontFamily: {
        sans: ["var(--font-jost)", "system-ui", "sans-serif"],
        display: ["var(--font-hanken)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      borderRadius: {
        btn: "11px",
        card: "16px",
        window: "14px",
        pill: "30px",
      },
      maxWidth: {
        content: "1200px",
        prose: "720px",
        window: "1040px",
      },
      letterSpacing: {
        eyebrow: "0.16em",
        wordmark: "0.3em",
        tightest: "-0.03em",
      },
      boxShadow: {
        cta: "inset 0 1px 0 rgba(255,255,255,0.18), inset 0 -9px 14px -11px rgba(120,40,0,0.5), 0 8px 22px -9px rgba(216,87,6,0.5), 0 2px 5px rgba(0,0,0,0.22)",
        "cta-hover":
          "inset 0 1px 0 rgba(255,255,255,0.22), inset 0 -9px 14px -11px rgba(120,40,0,0.55), 0 14px 30px -10px rgba(216,87,6,0.6), 0 3px 8px rgba(0,0,0,0.26)",
        card: "0 1px 0 0 var(--border) inset, 0 24px 60px -32px rgba(0,0,0,0.5)",
        lift: "0 22px 50px -28px rgba(0,0,0,0.55)",
      },
      keyframes: {
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
        sheen: {
          "0%": { transform: "translateX(-120%) skewX(-18deg)", opacity: "0" },
          "12%": { opacity: "0.55" },
          "100%": { transform: "translateX(220%) skewX(-18deg)", opacity: "0" },
        },
        "pulse-ring": {
          "0%": { transform: "scale(0.9)", opacity: "0.7" },
          "70%": { transform: "scale(1.7)", opacity: "0" },
          "100%": { transform: "scale(1.7)", opacity: "0" },
        },
        "fade-up": {
          from: { opacity: "0", transform: "translateY(14px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
      },
      animation: {
        marquee: "marquee var(--marquee-duration, 32s) linear infinite",
        sheen: "sheen 0.75s ease-out",
        "pulse-ring": "pulse-ring 2.4s cubic-bezier(0.4,0,0.2,1) infinite",
        "fade-up": "fade-up 0.6s ease-out both",
        float: "float 6s ease-in-out infinite",
      },
      transitionTimingFunction: {
        spring: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
