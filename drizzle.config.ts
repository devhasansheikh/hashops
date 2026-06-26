import type { Config } from "drizzle-kit";
import { readFileSync } from "fs";

// drizzle-kit does not auto-load .env.local — load it here so `npm run db:push`
// and `npm run db:generate` can see DATABASE_URL.
try {
  for (const line of readFileSync(".env.local", "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
    if (!m || process.env[m[1]]) continue;
    let v = m[2].trim();
    if (
      (v.startsWith('"') && v.endsWith('"')) ||
      (v.startsWith("'") && v.endsWith("'"))
    ) {
      v = v.slice(1, -1);
    }
    process.env[m[1]] = v;
  }
} catch {
  /* no .env.local yet — that's fine */
}

export default {
  schema: "./lib/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: { url: process.env.DATABASE_URL || "" },
  strict: true,
} satisfies Config;
