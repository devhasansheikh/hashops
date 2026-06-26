# HASH booking engine — full setup guide (free tier)

A custom, real-time booking flow: qualification quiz → live Google-Calendar
availability → atomic booking (no double-booking) → branded confirmation +
reminder emails → reschedule/cancel links. No Calendly, no Cal.com.

Everything runs on **free tiers**. The code is done; it goes live once you
create four free accounts and fill `.env.local`. Budget ~30–40 minutes.

> Tip: do the steps in order. Keep `.env.local` open and paste each value as you
> get it. The whole file template is in `.env.example`.

---

## Step 0 — Create your env file

In the project root:

```bash
cp .env.example .env.local
```

`.env.local` is git-ignored (your secrets never get committed). Set this now:

```
NEXT_PUBLIC_SITE_URL="https://hashops.io"
```

---

## Step 1 — Database (Neon Postgres, free)

1. Go to **neon.tech** → sign up (GitHub login is easiest) → **Create project**.
   Pick any name + region near your users.
2. On the project dashboard, find **Connection string** and choose the
   **Pooled connection** (toggle "Pooled connection" on). Copy it — it looks like
   `postgresql://user:pass@ep-xxx-pooler.region.aws.neon.tech/neondb?sslmode=require`.
3. Paste it into `.env.local`:
   ```
   DATABASE_URL="postgresql://...your pooled string...?sslmode=require"
   ```
4. Create the tables:
   ```bash
   npm run db:push
   ```
   You should see it create `bookings` and `leads`. (The config now auto-loads
   `.env.local`.) Done — that's the database.

---

## Step 2 — Google Calendar (OAuth, free)

This lets the app read the host's real free/busy and create events with invites +
Meet links, acting **as the host** (e.g. Saad). Sign into Google with the account
whose calendar should own bookings before you start.

### 2a. Create a Google Cloud project + enable the API
1. **console.cloud.google.com** → top bar → **Select a project → New project** →
   name it (e.g. "HASH Booking") → Create.
2. Search bar → **Google Calendar API** → **Enable**.

### 2b. Configure the OAuth consent screen
1. Left menu → **APIs & Services → OAuth consent screen**.
2. **User type:**
   - If the calendar is a **Google Workspace** account you admin → choose
     **Internal** (simplest: no warning, no expiry). Skip to 2c.
   - If it's a normal **@gmail.com** → choose **External**.
3. App name (e.g. "HASH Booking"), your support email, developer email → Save.
4. **Scopes** → Add → search and add:
   - `.../auth/calendar.events`
   - `.../auth/calendar.readonly`
   Save.
5. **IMPORTANT (gmail / External only):** on the consent screen overview, set
   **Publishing status → Publish app → "In production".** You can ignore Google
   verification (it's just you). Why: while the app is in **Testing**, Google
   **expires the refresh token after 7 days** and booking would silently break.
   "In production" gives a long-lived token; you'll just see a one-time
   "Google hasn't verified this app" screen — click **Advanced → Go to … (unsafe)**.

### 2c. Create the OAuth client
1. **APIs & Services → Credentials → Create credentials → OAuth client ID**.
2. Application type → **Web application**.
3. **Authorized redirect URIs** → add **both**:
   - `http://localhost:3000/api/google/callback`
   - `https://hashops.io/api/google/callback`
4. Create → copy the **Client ID** and **Client secret** into `.env.local`:
   ```
   GOOGLE_CLIENT_ID="...apps.googleusercontent.com"
   GOOGLE_CLIENT_SECRET="..."
   GOOGLE_REDIRECT_URI="http://localhost:3000/api/google/callback"
   GOOGLE_CALENDAR_ID="primary"
   ```
   (`primary` = the host account's main calendar. Anything already on it blocks
   availability automatically.)

### 2d. Get the refresh token (one time)
1. Start the app locally:
   ```bash
   npm run dev
   ```
2. In the browser **signed into the host Google account**, visit
   **http://localhost:3000/api/google/auth**.
3. Approve (on gmail, click through the "unverified app" warning).
4. You land on a page that prints a **refresh token**. Copy it into `.env.local`:
   ```
   GOOGLE_REFRESH_TOKEN="1//0g...."
   ```
   If it says "no refresh token returned," remove the app at
   myaccount.google.com/permissions and visit `/api/google/auth` again.

> The token is what matters and it's reusable. When you deploy, you'll switch
> `GOOGLE_REDIRECT_URI` to the `https://hashops.io/...` value (Step 7) — the token
> keeps working.

---

## Step 3 — Email (Resend, free 3k/mo)

1. **resend.com** → sign up → **API Keys → Create API Key** → copy it:
   ```
   RESEND_API_KEY="re_..."
   ```
2. **Sender domain** — to email real prospects you must verify a domain:
   - Resend → **Domains → Add domain** → enter `hashops.io`.
   - Add the DNS records it shows (SPF/DKIM) at your domain registrar / DNS host.
   - Wait for "Verified", then set:
     ```
     EMAIL_FROM="HASH <bookings@hashops.io>"
     EMAIL_REPLY_TO="info@hashops.io"
     ```
   - **Quick test without a domain:** set `EMAIL_FROM="HASH <onboarding@resend.dev>"`.
     Note: in this mode Resend only delivers to the email you signed up with —
     fine for testing, not for real bookings. Verify the domain before launch.

---

## Step 4 — Security secrets

Generate two random strings (any 32+ random chars work). On macOS/Linux/Git-Bash:

```bash
openssl rand -hex 32   # paste as BOOKING_SIGNING_SECRET
openssl rand -hex 32   # paste as CRON_SECRET
```

On Windows PowerShell, instead:

```powershell
-join ((48..57)+(97..102) | Get-Random -Count 64 | % {[char]$_})
```

```
BOOKING_SIGNING_SECRET="...first value..."
CRON_SECRET="...second value..."
```

(`BOOKING_SIGNING_SECRET` signs the reschedule/cancel links so they can't be
forged. `CRON_SECRET` guards the reminder endpoint.)

---

## Step 5 — Host details + availability

Set who the host is and when they're available (in the host's own timezone —
visitors always see their own local times):

```
BOOKING_HOST_NAME="Saad at HASH"
BOOKING_TIMEZONE="Asia/Karachi"
```

Optional fine-tuning (sensible defaults already apply — see `lib/booking/config.ts`):

```
BOOKING_SLOT_MINUTES="60"
BOOKING_MIN_NOTICE_HOURS="12"     # earliest a visitor can book from now
BOOKING_WINDOW_DAYS="21"          # how far ahead the calendar opens
BOOKING_BUFFER_MINUTES="15"       # gap kept around existing meetings
BOOKING_EXCLUDE_WEEKENDS="true"
# Working hours per weekday in BOOKING_TIMEZONE (0=Sun … 6=Sat):
BOOKING_HOURS_JSON='{"1":[["10:00","17:00"]],"2":[["10:00","17:00"]],"3":[["10:00","17:00"]],"4":[["10:00","17:00"]],"5":[["10:00","17:00"]]}'
```

---

## Step 6 — Test locally

```bash
npm run dev
```

Open http://localhost:3000, click any **"Book a call"** CTA:
- Answer the quiz with a **service business + a real team + "right now"** → you
  should see **real open times** from the host's calendar, pick one, fill the form,
  and get a **confirmation email + calendar invite + Meet link**. Check the host's
  Google Calendar — the event is there with the prospect invited.
- Answer with **"something else"** or **"just me"** or **"just exploring"** → you
  get the **Leak Checklist** nurture path instead (name + email, no calendar).
- Open the confirmation email's **Reschedule / Cancel** links → they work at
  `/booking/manage`.

If the slot step says "live booking isn't switched on yet," the Google env vars
aren't all set yet — recheck Step 2.

---

## Step 7 — Deploy to Vercel (free Hobby plan)

1. Push the repo (your `main` already deploys to hashops.io via Vercel).
2. Vercel → your project → **Settings → Environment Variables**. Add **every**
   variable from `.env.local`, with two changes for production:
   - `GOOGLE_REDIRECT_URI="https://hashops.io/api/google/callback"`
   - `NEXT_PUBLIC_SITE_URL="https://hashops.io"`
   (Keep the same `GOOGLE_REFRESH_TOKEN` — it still works.)
3. **Redeploy** so the new env vars take effect.
4. Visit the live site and run one real booking to confirm the invite + email land.

---

## Step 8 — Reminder emails (GitHub Actions, free hourly)

The workflow `.github/workflows/reminders.yml` is already in the repo. Add two
**repository secrets**: GitHub repo → **Settings → Secrets and variables → Actions
→ New repository secret**:
- `SITE_URL` = `https://hashops.io`
- `CRON_SECRET` = the exact same value as in your env

It runs hourly and sends a 24-hour and a 1-hour reminder per booking (tracked so
none double-fire). Test it now: repo → **Actions → "Booking reminders" → Run
workflow**. (GitHub disables schedules after ~60 days of repo inactivity — just
re-enable from the Actions tab if that ever happens.)

---

## Step 9 — (Optional) WhatsApp reminders

Off by default; email is the working core. To enable later, set
`WHATSAPP_ENABLED="true"` + a provider (`WHATSAPP_PROVIDER="cloud_api"` or
`"twilio"`) and its creds — see `lib/booking/whatsapp.ts`. Both providers cost
money / need business verification, so leave it off for the free launch.

---

## You're done when…

A visitor can complete the quiz, see only genuinely-free slots in their own
timezone, book one, receive a calendar invite + Meet link + branded confirmation,
get 24h and 1h reminders, and reschedule/cancel via the email links — with
double-booking impossible (a DB unique index on the slot makes two simultaneous
bookings fail; see `lib/db/schema.ts`).

## Troubleshooting
- **Slot step shows "not switched on yet"** → a `GOOGLE_*` var is missing/typo'd.
- **No emails** → `RESEND_API_KEY` missing, or sending to a non-owner address
  while still on `onboarding@resend.dev` (verify your domain).
- **Booking fails with "not set up"** → `DATABASE_URL` or the Google vars missing.
- **Reminders never send** → check the GitHub Action run logs + that `CRON_SECRET`
  matches on both sides.
- **Token stopped working after a week** → the OAuth app is still in "Testing";
  publish it "In production" (Step 2b) and re-run Step 2d.
