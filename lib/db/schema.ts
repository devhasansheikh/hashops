// Drizzle schema — Postgres (Neon). Two tables: bookings + leads.
import { sql } from "drizzle-orm";
import {
  pgTable,
  text,
  timestamp,
  jsonb,
  uuid,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import type { QuizAnswers } from "@/lib/booking/types";

export const bookings = pgTable(
  "bookings",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    fullName: text("full_name").notNull(),
    email: text("email").notNull(),
    whatsapp: text("whatsapp").notNull(),
    company: text("company"),
    revenueRange: text("revenue_range"),
    quiz: jsonb("quiz").$type<QuizAnswers>().notNull(),
    timezone: text("timezone").notNull(),
    notes: text("notes"),
    slotStartUtc: timestamp("slot_start_utc", { withTimezone: true }).notNull(),
    slotEndUtc: timestamp("slot_end_utc", { withTimezone: true }).notNull(),
    status: text("status").notNull().default("confirmed"), // confirmed | cancelled
    googleEventId: text("google_event_id"),
    meetUrl: text("meet_url"),
    remindersSent: jsonb("reminders_sent")
      .$type<string[]>()
      .notNull()
      .default(sql`'[]'::jsonb`),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => ({
    // Double-booking guard: at most ONE non-cancelled booking per slot start.
    // Partial unique index → cancelled rows free the slot for re-booking.
    activeSlot: uniqueIndex("uniq_active_slot")
      .on(t.slotStartUtc)
      .where(sql`status <> 'cancelled'`),
  }),
);

export const leads = pgTable("leads", {
  id: uuid("id").defaultRandom().primaryKey(),
  fullName: text("full_name").notNull(),
  email: text("email").notNull(),
  quiz: jsonb("quiz").$type<QuizAnswers>().notNull(),
  timezone: text("timezone"),
  kind: text("kind").notNull().default("nurture"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type BookingRow = typeof bookings.$inferSelect;
export type NewBookingRow = typeof bookings.$inferInsert;
export type LeadRow = typeof leads.$inferSelect;
