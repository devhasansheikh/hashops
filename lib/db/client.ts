// Drizzle client over Neon's serverless HTTP driver (works on Vercel + edge).
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

const url = process.env.DATABASE_URL;

/** True only when a real DATABASE_URL is configured. Routes guard on this. */
export const dbConfigured = Boolean(url);

// A syntactically-valid placeholder keeps imports/builds working with no DB.
// neon() is lazy — it never connects until a query actually runs.
export const db = drizzle(
  neon(url || "postgresql://user:pass@localhost:5432/placeholder"),
  { schema },
);

export { schema };
