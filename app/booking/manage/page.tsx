"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { SlotPicker } from "@/components/booking/SlotPicker";
import { Notice } from "@/components/booking/parts";
import type { Slot } from "@/lib/booking/types";

type Booking = {
  id: string;
  status: string;
  name: string;
  slotStartUtc: string;
  timezone: string;
  whenText: string;
  meetUrl: string | null;
  action: "reschedule" | "cancel";
};

const ease = [0.2, 0.7, 0.3, 1] as const;

export default function ManagePage() {
  const [token, setToken] = useState<string | null>(null);
  const [status, setStatus] = useState<
    "loading" | "ready" | "invalid" | "cancelled" | "done_cancel" | "done_reschedule"
  >("loading");
  const [booking, setBooking] = useState<Booking | null>(null);
  const [mode, setMode] = useState<"view" | "reschedule">("view");
  const [flash, setFlash] = useState("");
  const [overrideSlots, setOverrideSlots] = useState<Slot[] | undefined>();
  const [reloadKey, setReloadKey] = useState(0);
  const [working, setWorking] = useState(false);
  const [newWhen, setNewWhen] = useState("");

  useEffect(() => {
    let t: string | null = null;
    try {
      t = new URLSearchParams(window.location.search).get("token");
    } catch {
      /* no-op */
    }
    setToken(t);
    if (!t) {
      setStatus("invalid");
      return;
    }
    fetch(`/api/booking?token=${encodeURIComponent(t)}`)
      .then((r) => r.json())
      .then((d) => {
        if (!d.ok) {
          setStatus("invalid");
          return;
        }
        setBooking(d.booking);
        if (d.booking.status === "cancelled") setStatus("cancelled");
        else {
          setStatus("ready");
          if (d.booking.action === "reschedule") setMode("reschedule");
        }
      })
      .catch(() => setStatus("invalid"));
  }, []);

  async function cancel() {
    if (!token) return;
    setWorking(true);
    try {
      const r = await fetch("/api/cancel", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ token }),
      });
      const d = await r.json();
      if (d.ok) setStatus("done_cancel");
      else setFlash(d.message || "Couldn't cancel. Try again.");
    } catch {
      setFlash("Network hiccup. Try again.");
    } finally {
      setWorking(false);
    }
  }

  async function reschedule(slot: Slot) {
    if (!token) return;
    setWorking(true);
    setFlash("");
    try {
      const r = await fetch("/api/reschedule", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ token, slotStartUtc: slot.startUtc }),
      });
      const d = await r.json();
      if (d.ok) {
        setNewWhen(d.whenText || "");
        setStatus("done_reschedule");
      } else if (d.code === "slot_taken") {
        setOverrideSlots(Array.isArray(d.slots) ? d.slots : undefined);
        setReloadKey((k) => k + 1);
        setFlash("That slot was just taken. Here are the next open times.");
      } else {
        setFlash(d.message || "Couldn't reschedule. Try again.");
      }
    } catch {
      setFlash("Network hiccup. Try again.");
    } finally {
      setWorking(false);
    }
  }

  return (
    <main className="relative z-[1] flex min-h-[100svh] items-center justify-center px-5 py-24">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease }}
        className="surface-card w-full max-w-[560px] rounded-card border-strong p-7 sm:p-9"
      >
        <p className="mb-5 font-mono text-[11px] uppercase tracking-[0.16em] text-flametext">
          Manage your call
        </p>

        {status === "loading" && (
          <div className="h-24 animate-pulse rounded-card bg-surface2" aria-hidden />
        )}

        {status === "invalid" && (
          <Notice>
            This link is invalid or has expired. Email{" "}
            <a className="text-flametext hover:underline" href="mailto:info@hashops.io">
              info@hashops.io
            </a>{" "}
            and we&apos;ll sort it out.
          </Notice>
        )}

        {status === "cancelled" && (
          <div>
            <h1 className="font-display text-2xl font-semibold text-heading">
              This call is cancelled.
            </h1>
            <p className="mt-3 font-body text-[15px] text-body">
              Want a new time?{" "}
              <a className="text-flametext hover:underline" href="/?book=1">
                Book again
              </a>
              .
            </p>
          </div>
        )}

        {status === "done_cancel" && (
          <div>
            <h1 className="font-display text-2xl font-semibold text-heading">
              Your call is cancelled.
            </h1>
            <p className="mt-3 font-body text-[15px] text-body">
              The slot is freed up. Changed your mind?{" "}
              <a className="text-flametext hover:underline" href="/?book=1">
                Book a new time
              </a>
              .
            </p>
          </div>
        )}

        {status === "done_reschedule" && (
          <div>
            <h1 className="font-display text-2xl font-semibold text-heading">
              Your call&apos;s been moved.
            </h1>
            <p className="mt-3 font-body text-[15px] text-body">
              You&apos;re now set for{" "}
              <span className="font-semibold text-heading">{newWhen}</span>. An
              updated invite is on its way to your inbox.
            </p>
          </div>
        )}

        {status === "ready" && booking && (
          <div>
            <h1 className="font-display text-[22px] font-semibold leading-snug text-heading">
              {mode === "reschedule" ? "Pick a new time" : "Your call"}
            </h1>
            <p className="mt-2 font-body text-[14.5px] text-body">
              Currently booked for{" "}
              <span className="font-semibold text-heading">{booking.whenText}</span>{" "}
              ({booking.timezone}).
            </p>

            {flash && (
              <p className="mt-4 rounded-btn border border-danger/30 bg-danger/10 px-4 py-2.5 font-body text-[13.5px] text-danger">
                {flash}
              </p>
            )}

            {mode === "view" ? (
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <button
                  onClick={() => setMode("reschedule")}
                  className="btn-primary px-6 py-3 text-sm"
                >
                  Reschedule
                </button>
                <button
                  onClick={cancel}
                  disabled={working}
                  className="btn-secondary px-6 py-3 text-sm disabled:opacity-60"
                >
                  {working ? "Cancelling…" : "Cancel call"}
                </button>
              </div>
            ) : (
              <div className="mt-6">
                <SlotPicker
                  onPick={reschedule}
                  slotsOverride={overrideSlots}
                  reloadKey={reloadKey}
                />
                <button
                  onClick={() => setMode("view")}
                  className="mt-5 font-body text-[14px] text-muted transition-colors hover:text-heading"
                >
                  Back
                </button>
              </div>
            )}
          </div>
        )}
      </motion.div>
    </main>
  );
}
