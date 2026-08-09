# STAYBASE — agent context

Read this first. It carries the decisions and constraints that are not
recoverable from the code, so a fresh session can continue without
re-litigating settled choices.

**Live:** https://staybase-pms.vercel.app
**Repo:** https://github.com/adityasomaa/staybase (this one — work here)
**Archive:** https://github.com/adityasomaa/staybase-pms (the first push, kept
as a snapshot; nothing deploys from it any more)

---

## What this is

A property management system for independent hotels and villas, modelled on
Book and Link, using **Channex** as the channel-manager / connectivity
provider. STAYBASE owns the reservation ledger, the rate and availability
grid, the front desk and housekeeping. Channex owns the last mile to
Booking.com, Airbnb, Expedia, Agoda, Traveloka and the rest.

## Working agreements

- **Reply in Indonesian.** The user prompts in Indonesian; match it. Code,
  comments, commit messages and UI copy stay in English.
- **Use Composio** for anything on GitHub or Vercel (repo creation, deploys,
  project settings). The `github` and `vercel` toolkits are connected as
  `adityasomaa` / `adityasoma`.
- **Commit and merge every change to `main` as soon as it is verified.** Do
  not batch a session's work into one push at the end, and do not park it on a
  working branch waiting for approval — the user asked for changes to land on
  `main` directly, which means each one deploys to production. Verify *before*
  merging, not after; that is the only gate.
- **Do not claim a thing works without checking it.** See *Verification*.

## Stack

Next.js 16 (App Router, Turbopack) · React 19 · TypeScript strict ·
Tailwind CSS v4 · shadcn/ui (radix base, `nova` preset) · Recharts ·
Drizzle ORM + Postgres · Zod.

Package manager is npm. `npm run typecheck`, `npm run lint`, `npm run build`
must all be clean before pushing.

## Architecture

```
src/
  app/
    (app)/           route group carrying the sidebar shell
    api/channex/     sync (ARI push) + webhook (inbound bookings)
    api/search/      global search index
    api/health/      readiness probe
    actions.ts       billing lock + onboarding tour server actions
  components/        ui/ (shadcn primitives) + one folder per feature
  db/                Drizzle schema + lazily-created client
  lib/
    channex/         API client, payload types, PMS <-> Channex mapping
    ota/catalog.ts   nine OTAs and their per-channel setup guides
    help/articles.ts tutorial library (also feeds global search)
    pricing.ts       dynamic pricing engine — pure, shared server + client
    data/            demo dataset (seed.ts, seed-ops.ts) + queries.ts
    date.ts          UTC-anchored date maths
    format.ts        money, percent, channel and status tokens
    workspace.ts     cookie-backed billing lock and tour flag
```

Pages call `src/lib/data/queries.ts`. That module is the seam: it currently
reads the demo dataset, and swapping it to Drizzle is a drop-in change because
`src/db/schema.ts` mirrors the demo shapes 1:1.

## Decisions already made — do not undo without a reason

- **Demo dataset, not a database.** No `DATABASE_URL` is set, so the app
  serves a deterministic seeded dataset. This is deliberate: preview deploys
  work with zero infrastructure. `getDb()` returns `null` when unset.
- **The seed is internally consistent.** Occupancy, ADR, RevPAR, the forecast,
  the front desk and the ARI grid are all derived from the *same* 900
  reservations. An earlier version generated KPIs separately and the dashboard
  disagreed with tonight's occupancy. Do not reintroduce a parallel series.
- **Every `(app)` route is `force-dynamic`.** A PMS shows "today"; freezing it
  into the build is wrong.
- **Dry-run by default.** Without `CHANNEX_API_KEY`, `/api/channex/sync`
  returns `mode: "dry-run"` with the exact batch counts it *would* have sent,
  instead of failing.
- **Every change pushes itself.** The operator asked for this explicitly: a
  manual push fails silently, because the person who forgets it never finds
  out. `lib/sync/auto-sync.ts` queues a push after any change an OTA needs to
  know about — rate edits, blocks, applied pricing, new inventory, a direct
  booking, a new channel. Changes coalesce for ~1.2s first, so a week of edits
  is still one batch; that is the only part of the old staging model worth
  keeping, since a partial batch is how rate parity breaks. Housekeeping status
  deliberately does not trigger a push — it does not change what is sellable.
- **Unmapped entities are skipped and reported.** Room types and rate plans
  with no `channexId` are excluded from a push and named in the response.
  Silent skipping is how rate parity breaks.
- **Suspension keeps inbound alive.** A locked workspace pauses outbound
  pushes and the UI, but `/api/channex/webhook` keeps accepting bookings.
  Dropping a guest's reservation over an unpaid invoice punishes the wrong
  person, and it means nothing needs re-syncing after payment.
- **Pricing rules compound, guardrails clamp last.** Each enabled rule applies
  to the running rate, not the original. Floor / ceiling / max-daily-move are
  applied afterwards and the suggestion reports which bound bit.
- **The pricing engine is a pure function** used by both the server and the
  browser, so toggling a rule re-prices instantly with no second
  implementation to drift.
- **Search runs server-side** at `/api/search`, so it reaches the whole ledger
  rather than what the current page loaded. Scoring drops stopwords and
  rewards vocabulary coverage — that is what lets "how do i block a room" find
  the guide. The highlighted item is controlled so Enter always follows the
  top result.

## Traps this codebase has already hit

- `SidebarInset` from shadcn **already renders `<main>`**. Do not nest another
  one inside it.
- This shadcn registry's `CommandDialog` does **not** provide the cmdk
  `<Command>` root. You must supply it yourself or no list primitive
  registers and the palette silently does nothing.
- `sticky top-0` inside a horizontally-scrolling container resolves against
  the *page* unless the container has its own height. Give scrollers a
  `max-h-*` so their sticky headers do not slide under the app header.
- A sticky cell that paints its own background must opt into the row hover
  (`group-hover/...`) or the row highlights only on the scrolling half.
- Card width depends on the parent grid, not the viewport. Use **container
  queries** (`@container` + `@sm:`) for anything that must reflow inside a
  card.
- The `react-hooks/set-state-in-effect` lint rule is on. Reset form state by
  remounting with a `key`, not by syncing fields in an effect.
- Vercel **Hobby allows one cron run per day**. The nightly ARI resync uses
  that slot (`0 19 * * *` → `GET /api/channex/sync`).

## Verification

Screenshots are unavailable in this environment, so verification is
mechanical. Two puppeteer scripts were used and are worth recreating when
touching UI:

1. **Layout audit** — load every route at 1440 / 1024 / 768 / 390px and assert
   no horizontal overflow, no clipped text, no overlapping siblings. This is
   what caught the nested `<main>`, the sticky ARI header, and a legend that
   overflowed only between 1024 and 1280px.
2. **Behaviour smoke test** — drive the tour, search palette, planner stay
   sheet, room block, billing lock/unlock, invites and pricing toggles with
   real clicks and keystrokes.

Use `document.body.textContent`, not `innerText` — headless Chrome reports
empty `innerText` for fixed-position portal content such as an open dialog.

Last run: layout clean across 18 routes × 4 widths; 10/10 behaviour
assertions passing against production.

## Deployment

| | |
| --- | --- |
| Vercel project | `staybase-pms` (`prj_srtnPeYsQWEwvzcb5uomZaUokODV`) |
| Vercel team | Onyx Creative Asia (`team_kbdWnc8l2imilAGvKfLdsbXv`), Hobby plan |
| Git link | `adityasomaa/staybase`, production branch `main` |
| Region | `sin1` |
| Production URL | https://staybase-pms.vercel.app |

**A push to `main` deploys automatically.** The Vercel project is still *named*
`staybase-pms` because the production URL hangs off the project name — renaming
it would move the URL, so the name stays and only the git link was repointed.

Composio's Vercel toolkit has no tool for changing a project's git link.
`VERCEL_UPDATE_PROJECT` does not expose the field. Use the workbench proxy
instead — `DELETE` then `POST` on `/v9/projects/{id}/link`, since Vercel
refuses to relink a project that is already linked:

```python
proxy_execute("DELETE", f"{BASE}/link", "VERCEL", query_params={"teamId": TEAM})
proxy_execute("POST",   f"{BASE}/link", "VERCEL", query_params={"teamId": TEAM},
              body={"type": "github", "repo": "adityasomaa/staybase"})
```

## Environment variables

| Variable | Required | Purpose |
| --- | --- | --- |
| `CHANNEX_API_KEY` | for live sync | Channex user API key |
| `CHANNEX_BASE_URL` | no | defaults to the staging sandbox |
| `CHANNEX_WEBHOOK_SECRET` | recommended | HMAC verification for inbound webhooks |
| `CHANNEX_TIMEOUT_MS` | no | request timeout, default 15000 |
| `DATABASE_URL` | no | Postgres; omit to use the demo dataset |
| `CRON_SECRET` | recommended | bearer token guarding the nightly resync |

## Known gaps

These are deliberate, not oversights — but they are the obvious next steps.

- **No authentication.** `/users` manages a directory, not real sessions. Role
  and property scoping are modelled but not enforced anywhere.
- **Mutations are staged, not persisted.** Creating a room type, blocking a
  room, taking a payment and applying pricing suggestions all update local
  state and toast. Wiring them means implementing server actions against
  Drizzle and replacing the reads in `queries.ts`.
- **Single active property.** `activeProperty` is hardcoded to the first
  property; the switcher changes the label only.
- **Channex is untested against a live account.** The client, mapping and
  webhook are written to the documented API but have only been exercised in
  dry-run.
