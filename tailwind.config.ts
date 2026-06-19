import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["selector", '[data-theme="dark"]'],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "var(--bg)",
        surface: "var(--surface)",
        surface2: "var(--surface-2)",
        heading: "var(--heading)",
        body: "var(--body)",
        bodystrong: "var(--body-strong)",
        muted: "var(--muted)",
        flame: "#FF7A1A",
        sunrise: "#FFA033",
        ember: "#E55A00",
        // theme-aware flame for small text (AA in light mode)
        flametext: "var(--flame-text)",
        success: "var(--success)",
        warning: "var(--warning)",
        danger: "var(--danger)",
      },
      borderColor: {
        DEFAULT: "var(--border)",
        line: "var(--border)",
        strong: "var(--border-strong)",
      },
      fontFamily: {
        display: ["var(--font-hanken)", "system-ui", "sans-serif"],
        body: ["var(--font-jost)", "system-ui", "sans-serif"],
        mono: ["var(--font-jbmono)", "ui-monospace", "monospace"],
      },
      borderRadius: {
        btn: "11px",
        card: "18px",
        window: "16px",
        pill: "30px",
      },
      boxShadow: {
        card: "0 18px 40px -24px rgba(0,0,0,0.45)",
        "card-hover":
          "0 24px 50px -20px rgba(255,122,26,0.18), 0 18px 40px -24px rgba(0,0,0,0.5)",
      },
      maxWidth: {
        content: "1120px",
        wide: "1320px",
      },
      transitionTimingFunction: {
        premium: "cubic-bezier(0.2, 0.7, 0.3, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
