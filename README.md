# VolumeForge

> Retention engine for Solana DEXs and trading terminals — powered by Torque Protocol

[![Torque](https://img.shields.io/badge/Powered%20by-Torque-7C3AED)](https://torque.so)
[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://typescriptlang.org)

---

## What is VolumeForge?

VolumeForge converts real on-chain trading behavior into measurable, anti-sybil-filtered incentive campaigns. Protocols integrate their Anchor IDL, choose an incentive type, and VolumeForge handles:

- **Live leaderboards** — ranked by volume per epoch
- **Trade rebates** — cashback proportional to volume
- **Weighted raffles** — more volume = more tickets
- **Direct recurring payouts** — fixed allocations to specific wallets
- **Anti-sybil scoring** — micro-trade filters, frequency analysis, pattern detection
- **Custom event ingestion** — referrals, signups, social actions via Torque

All incentives create real Torque recurring offers via the documented MCP API.

---

## Architecture

```
┌─────────────────────────────────────────────┐
│              VolumeForge UI                 │
│  Landing · Dashboard · Campaigns · Leaderboard│
│  Raffle · Rebate · Feed · Settings          │
└───────────────┬─────────────────────────────┘
                │ API Routes (Next.js)
        ┌───────┴────────┐
        │  Torque Layer   │     ← lib/torque/*
        │  IDL · Events   │
        │  Incentives     │
        └───────┬────────┘
                │ REST / Ingest
    ┌───────────┴──────────────┐
    │      Torque Platform      │
    │  api.torque.so            │
    │  ingest.torque.so/events  │
    └───────────────────────────┘
        │ Local DB
    ┌───┴──────────────────┐
    │   PostgreSQL + Prisma │
    │   Campaigns · Epochs  │
    │   Wallets · Events    │
    └───────────────────────┘
```

### Folder Structure

```
app/
  page.tsx                    # Landing page
  layout.tsx                  # Root layout + providers
  (auth)/connect/             # Wallet connect + project select
  (app)/                      # App shell (sidebar, topbar)
    dashboard/                # Admin metrics overview
    campaigns/                # List + builder
    leaderboard/              # Rank table
    raffle/                   # Prize buckets + countdown
    rebate/                   # Claim interface
    feed/                     # Live event stream
    settings/                 # Anti-sybil rules
    friction-log/             # Builder notes for Torque
  api/
    campaigns/                # Local CRUD + Torque creation
    torque/
      incentives/             # list / get / results
      idl/                    # parse / create / list
      events/                 # ingest proxy → ingest.torque.so
    leaderboard/
    feed/

lib/
  torque/
    client.ts                 # Base REST client (Bearer auth)
    incentives.ts             # create_recurring_incentive etc.
    idl.ts                    # parse_idl → create_idl pipeline
    custom-events.ts          # Full lifecycle + sendEvent
    types.ts                  # Typed API shapes
  domain/
    formulas.ts               # Formula validator (6 allowed vars)
    anti-sybil.ts             # Sybil risk scoring
  db/prisma.ts                # Singleton Prisma client

prisma/
  schema.prisma               # Full domain model
  seed.ts                     # Demo dataset
```

---

## Torque Integration

VolumeForge uses Torque's four documented incentive types:

| Type | Torque param | Use case |
|------|-------------|----------|
| `leaderboard` | `customFormula`, `totalFundAmount` | Rank top traders |
| `rebate` | `rebatePercentage` | Cashback on volume |
| `raffle` | `raffleBuckets`, `raffleWeighting` | Weighted random draw |
| `direct` | `allocations` | Recurring fixed payouts |

### IDL Pipeline (from official docs)
```
parse_idl → create_idl → generate_incentive_query (source: "idl_instruction")
  → [preview_incentive_query — optional]
  → create_recurring_incentive
```

### Custom Event Lifecycle
```
1. create_custom_event(eventName, name, fields)
2. attach_custom_event(customEventId)           ← scoped to active project
3. POST ingest.torque.so/events                 ← x-api-key header
   { userPubkey, timestamp, eventName, data }   ← userPubkey top-level, not in data
4. list_project_events()                        ← verify query-readiness
```

### Schedule Rule (doc-enforced)
`evalDurationDays` **XOR** `interval` — provide one, never both.  
Enforced in Zod schema and campaign wizard UI.

### Formula Variables (whitelist)
`N` · `VALUE` · `RANK` · `INDEX` · `TOTAL_PARTICIPANTS` · `TOTAL_REWARD_POOL`

---

## Setup

### Prerequisites
- Node.js >= 20
- PostgreSQL database
- Torque account at [platform.torque.so](https://platform.torque.so)

### Installation

```bash
git clone <repo>
cd VolumeForge
npm install
```

### Environment

Copy `.env.example` to `.env.local` and fill in:

```bash
DATABASE_URL=postgresql://user:password@localhost:5432/volumeforge
TORQUE_API_TOKEN=          # Bearer token from platform.torque.so
TORQUE_API_KEY=            # x-api-key for ingest.torque.so
TORQUE_PROJECT_ID=         # Active project ID
NEXT_PUBLIC_RPC_URL=https://api.mainnet-beta.solana.com
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Database

```bash
npx prisma db push          # Create tables
npm run db:seed             # Load demo data (3 campaigns, 200 trade events, etc.)
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Key Pages

| Page | Route | Description |
|------|-------|-------------|
| Landing | `/` | Marketing page with Torque callout |
| Connect | `/connect` | Wallet + active project setup |
| Dashboard | `/dashboard` | Admin metrics, ROI chart, live feed |
| Campaigns | `/campaigns` | All Torque recurring incentives |
| Builder | `/campaigns/new` | 6-step campaign wizard |
| Leaderboard | `/leaderboard` | Ranked traders with epoch selector |
| Raffle | `/raffle` | Prize buckets, countdown, winner history |
| Rebate | `/rebate` | Eligibility check and claim UI |
| Feed | `/feed` | Live event stream with filters |
| Settings | `/settings` | Anti-sybil rules and campaign defaults |
| Friction Log | `/friction-log` | Honest builder notes for Torque team |

---

## Anti-Sybil Engine

Signals computed per wallet:

| Signal | Description | Max Score |
|--------|-------------|-----------|
| MICRO_TRADES | Trades < $50 USD | 30 |
| REPETITIVE_PATTERN | Near-identical amounts (CV < 5%) | 40 |
| HIGH_FREQUENCY | Avg < 30s between trades | 30 |

Score 0–34: CLEAN · 35–69: SUSPICIOUS · 70+: HIGH_RISK (excluded from rewards by default)

---

## Assumptions Made

1. Torque REST endpoint paths inferred from MCP tool names (e.g., `/incentives/recurring` from `create_recurring_incentive`). Official REST docs not public at time of build.
2. `preview_incentive_query` treated as optional — not in the IDL doc pipeline, mentioned in incentives doc as "only for testing queries during creation."
3. Gifts/referrals visible on torque.so marketing but not in MCP reference — implemented as custom event backed widget, not a 5th incentive type.
4. App works without Torque credentials (demo/seed mode). All Torque routes return descriptive errors when TORQUE_API_TOKEN is not set.

---

## Remaining TODOs

- [ ] Real Torque API credential validation on connect page
- [ ] Live polling of `get_incentive_results` with TanStack Query refetch
- [ ] Campaign detail page (`/campaigns/[id]`) with full analytics
- [ ] ClaimDrawer component with wallet-adapter transaction signing
- [ ] IDL file upload UI (currently supports inline JSON)
- [ ] `list_idls` integration on campaign builder source step
- [ ] Pagination on feed and leaderboard

---

## Friction Log

See [/friction-log](/friction-log) in the running app for honest notes on Torque integration pain points and actionable feedback for the Torque team.
