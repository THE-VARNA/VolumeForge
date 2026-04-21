"use client";

import { useState } from "react";
import { LeaderboardTable } from "@/components/leaderboard-table";
import { GlassCard } from "@/components/glass-card";
import { MetricStat } from "@/components/metric-stat";
import { motion } from "framer-motion";
import { Trophy, Search, Filter } from "lucide-react";

// Demo leaderboard data
const EPOCHS = [
  { id: "epoch-3", label: "Epoch 3 (Current)" },
  { id: "epoch-2", label: "Epoch 2" },
  { id: "epoch-1", label: "Epoch 1" },
];

const generateRows = (n: number) =>
  Array.from({ length: n }, (_, i) => ({
    rank: i + 1,
    wallet: `${Math.random().toString(36).slice(2, 10)}...${Math.random().toString(36).slice(2, 6)}`.toUpperCase(),
    score: Math.round((1 - i / n) * 100000 + Math.random() * 5000),
    volume: Math.round((1 - i / n) * 1500000 + Math.random() * 100000),
    rewardAmt: parseFloat(((1 - i / n) * 10 + Math.random() * 2).toFixed(4)),
    payStatus: (i < 5 ? "DISTRIBUTED" : i < 15 ? "PENDING" : "PENDING") as
      | "DISTRIBUTED"
      | "PENDING"
      | "FAILED",
    sybilScore: Math.floor(Math.random() * 30),
    trend: Math.floor(Math.random() * 5) - 2,
    rewardToken: "SOL",
  }));

const DEMO_ROWS = generateRows(50);

export default function LeaderboardPage() {
  const [selectedEpoch, setSelectedEpoch] = useState(EPOCHS[0].id);
  const [search, setSearch] = useState("");

  const filtered = DEMO_ROWS.filter(
    (r) =>
      !search ||
      r.wallet.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-6 max-w-6xl">
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between flex-wrap gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
            <Trophy className="w-6 h-6 text-amber-400" />
            Leaderboard
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Rankings updated by Torque evaluation engine each epoch
          </p>
        </div>
      </motion.div>

      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-4">
        <MetricStat label="Ranked Traders" value={DEMO_ROWS.length} variant="violet" />
        <MetricStat label="Total Volume" value="$4.2M" variant="cyan" />
        <MetricStat label="Rewards Remaining" value="31.6 SOL" subValue="of 50 SOL pool" variant="green" />
      </div>

      {/* Filters */}
      <GlassCard padding="sm">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search wallet..."
              className="w-full pl-8 pr-4 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-slate-200 placeholder:text-muted-foreground outline-none focus:border-violet-500/50 transition-colors"
            />
          </div>
          <select
            value={selectedEpoch}
            onChange={(e) => setSelectedEpoch(e.target.value)}
            className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-slate-200 outline-none focus:border-violet-500/50 transition-colors"
          >
            {EPOCHS.map((e) => (
              <option key={e.id} value={e.id} className="bg-slate-900">
                {e.label}
              </option>
            ))}
          </select>
          <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg glass text-sm text-slate-400 hover:text-slate-200 transition-colors">
            <Filter className="w-3.5 h-3.5" />
            Filters
          </button>
        </div>
      </GlassCard>

      {/* Table */}
      <GlassCard padding="none">
        <div className="px-6 pt-5 pb-4 border-b border-white/[0.06]">
          <h2 className="text-sm font-semibold text-slate-200">
            Epoch 3 Rankings — {filtered.length} traders
          </h2>
        </div>
        <div className="px-6 py-4">
          <LeaderboardTable rows={filtered} />
        </div>
      </GlassCard>
    </div>
  );
}
