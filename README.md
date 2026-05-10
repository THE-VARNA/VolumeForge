<div align="center">

# ⚡ VolumeForge

**Retention & Incentive Engine for Solana DEXs**

*Turn trading volume into compounding loyalty — powered by Torque's recurring incentive infrastructure*

[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://typescriptlang.org)
[![Solana](https://img.shields.io/badge/Solana-mainnet-9945ff?logo=solana)](https://solana.com)
[![Torque](https://img.shields.io/badge/Torque-MCP-00d4ff)](https://platform.torque.so)


</div>

---

## What is VolumeForge?

VolumeForge is a full-stack dashboard for Solana protocols that want to run **recurring, on-chain incentive campaigns** without writing smart contracts. Protocols plug in their Anchor IDL or custom events, define reward campaigns, and traders land on live leaderboards, earn rebates, and enter weighted raffles — all evaluated and distributed by [Torque](https://platform.torque.so).

### Core Value Proposition

| Without VolumeForge | With VolumeForge |
|---|---|
| One-time airdrops traders dump | Recurring epochs that build loyalty |
| Manual wallet allowlists | Live leaderboards from real on-chain activity |
| No sybil protection | Anti-sybil scoring engine flags reward farmers |
| Complex Torque API integration | Guided campaign wizard handles the full MCP lifecycle |

---

## Features

### 🏆 Four Torque Incentive Types (Doc-Verified)
- **Leaderboard** — Rank traders by volume/activity; distribute via `customFormula`
- **Rebate** — Auto-calculated `VALUE * (rebatePercentage / 100)` per trade
- **Raffle** — Weighted random draw across `raffleBuckets [{amount, count}]`
- **Direct** — Fixed recurring payouts to specific wallet addresses

### 🔗 Three Data Source Pipelines
| Source | Pipeline |
|--------|---------|
| **Anchor IDL** | `create_idl` → `list_idls` → `generate_incentive_query(idl_instruction)` |
| **Custom Events** | `create_custom_event` → `attach_custom_event` → `sendEvent` → `generate_incentive_query(custom_event)` |
| **Dune Analytics** | `register_dune_event_source` → `generate_incentive_query(dune_query)` |

### 🛡️ Anti-Sybil Engine
- Flags **MICRO_TRADES** (trades < $50), **REPETITIVE_PATTERN** (low variance), **HIGH_FREQUENCY** (< 30s gaps)
- Composite score 0–100 → `CLEAN` / `SUSPICIOUS` / `HIGH_RISK` shield badges
- Configurable exclusion rules in Settings

### 📐 Formula Validator
Enforces Torque's exact 6-variable set at input time:
```
N · VALUE · RANK · INDEX · TOTAL_PARTICIPANTS · TOTAL_REWARD_POOL
```
With allowed functions: `sqrt pow abs floor ceil round min max log exp`

### 📊 Live Analytics
- Dashboard with ROI chart (volume vs rewards), epoch timeline, and campaign health
- Leaderboard with per-wallet sybil risk badges and rank-change trend indicators
- Activity feed merging on-chain trade events and custom events

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript 5 strict |
| Styling | Tailwind CSS v3 — glassmorphism design system |
| Animation | Framer Motion |
| Validation | Zod (XOR schedule rule, formula whitelist) |
| Data Fetching | TanStack Query v5 |
| ORM | Prisma + PostgreSQL (Neon) |
| Wallet | `@solana/wallet-adapter-react` |
| Charts | Recharts |

---

## Project Structure

```
volumeforge/
├── app/
│   ├── (auth)/connect/         # Wallet connect + Torque project selector
│   ├── (app)/
│   │   ├── dashboard/          # ROI chart, metric stats, campaign feed
│   │   ├── campaigns/          # List, detail [id], new (wizard)
│   │   ├── leaderboard/        # Live rankings with sybil badges
│   │   ├── raffle/             # Prize buckets, countdown, winners
│   │   ├── rebate/             # Claim eligibility and history
│   │   ├── feed/               # Activity timeline (trades + custom events)
│   │   ├── settings/           # Anti-sybil rules, epoch config
│   │   └── friction-log/       # Honest builder notes on Torque docs
│   └── api/
│       ├── torque/incentives/  # list, create, results (mode: preview|recipients|download)
│       ├── torque/idl/         # parse, create, list
│       ├── torque/events/      # send events to ingest.torque.so
│       ├── campaigns/          # local CRUD
│       ├── leaderboard/        # ranked rows from DB
│       └── feed/               # merged trade + custom events
├── lib/
│   ├── torque/
│   │   ├── client.ts           # Bearer auth, base REST wrapper
│   │   ├── incentives.ts       # create/list/get/results + XOR schedule guard
│   │   ├── idl.ts              # Full IDL pipeline + all 3 generate_incentive_query sources
│   │   └── custom-events.ts    # Full lifecycle + list scope: project|owned
│   └── domain/
│       ├── formulas.ts         # Whitelist validator + preset examples
│       └── anti-sybil.ts       # Composite sybil scoring
├── components/                 # Glass cards, leaderboard table, sybil badge, ROI chart…
├── hooks/use-data.ts           # TanStack Query hooks for all API routes
├── schemas/                    # Zod schemas for campaigns, custom events, IDL
└── prisma/schema.prisma        # Full relational schema with XOR schedule enforcement
```

---

## Getting Started

### Prerequisites
- Node.js ≥ 20
- PostgreSQL (or [Neon](https://neon.tech) free tier)
- [Torque account](https://platform.torque.so)

### 1. Clone & Install
```bash
git clone https://github.com/THE-VARNA/VolumeForge.git
cd VolumeForge
npm install
```

### 2. Configure Environment
```bash
cp .env.example .env
```

Edit `.env`:
```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/volumeforge

# Torque (platform.torque.so → Account Settings)
TORQUE_API_TOKEN=tq_...   # Bearer token for api.torque.so
TORQUE_API_KEY=tq_...     # x-api-key for ingest.torque.so
TORQUE_PROJECT_ID=...     # Active project ID

# Solana
NEXT_PUBLIC_RPC_URL=https://api.mainnet-beta.solana.com
```

### 3. Setup Database
```bash
npx prisma db push          # Apply schema
npx tsx prisma/seed.ts      # Load demo data (3 campaigns, 10 wallets, 200 trades)
```

### 4. Run
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

> **Demo mode:** The app works without Torque credentials. All Torque API routes return `{ data: [], demo: true }` gracefully, and the seeded database populates every page.

---

## Campaign Builder

The 6-step wizard enforces Torque's documented constraints:

1. **Type** — Choose leaderboard / rebate / raffle / direct
2. **Event Source** — Anchor IDL or custom event (pipeline pills shown)
3. **Formula** — Real-time validation against the exact 6-variable whitelist
4. **Schedule** — XOR enforced: `evalDurationDays` OR `interval`, never both
5. **Query Preview** — Optional creation-time test (`preview_incentive_query`)
6. **Deploy** — Creates local DB record + fires `create_recurring_incentive`

---

## Torque Integration Notes

> Documented in `/friction-log` inside the app

- `preview_incentive_query` is mentioned in incentives docs but absent from IDL pipeline docs — implemented as optional step
- `evalDurationDays` XOR `interval` confirmed at doc line 216 — enforced in both Zod schema and service layer
- `userPubkey` is always a top-level ingestion property, never inside `data` — enforced in `TorqueEventPayload` type
- `direct` type is persisted as `LEADERBOARD + customFormula: "N"` internally — our schema reflects this correctly
- `list_custom_events` accepts `scope: "project" | "owned"` — both implemented

---

## Environment Variables

| Variable | Required | Purpose |
|----------|----------|---------|
| `DATABASE_URL` | ✅ | PostgreSQL connection string |
| `TORQUE_API_TOKEN` | For live Torque | Bearer auth to `api.torque.so` |
| `TORQUE_API_KEY` | For event ingestion | `x-api-key` header to `ingest.torque.so` |
| `TORQUE_PROJECT_ID` | For scoped tools | Active project reference |
| `NEXT_PUBLIC_RPC_URL` | ✅ | Solana RPC endpoint |

---

## Scripts

```bash
npm run dev          # Development server
npm run build        # Production build
npm run lint         # ESLint
npm run db:push      # Push schema to DB
npm run db:seed      # Seed demo data
npm run db:studio    # Prisma Studio (DB browser)
```

---

