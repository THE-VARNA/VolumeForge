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

// Static deterministic rows — no Math.random() to avoid SSR hydration mismatch
const DEMO_ROWS = [
  { rank: 1,  wallet: "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU", score: 98420, volume: 1480000, rewardAmt: 11.82, payStatus: "DISTRIBUTED" as const, sybilScore: 84, trend:  0, rewardToken: "SOL" },
  { rank: 2,  wallet: "3fAzTkmPgK1FmBEbgQjxjSXTe9rVQ8mN2LbF4d5HmD3P", score: 87100, volume: 1310000, rewardAmt: 10.47, payStatus: "DISTRIBUTED" as const, sybilScore: 76, trend:  1, rewardToken: "SOL" },
  { rank: 3,  wallet: "9pTBJv3HyNs7A2VqG6YkZmXeL5MrRp8CwdFbK4NvDtU1", score: 74300, volume: 1120000, rewardAmt:  8.93, payStatus: "DISTRIBUTED" as const, sybilScore: 51, trend: -1, rewardToken: "SOL" },
  { rank: 4,  wallet: "5sKJwPmN8HuT3aLdG9FbE2RqZvX6CnD4SyV7MkA1fBrQ", score: 62800, volume:  945000, rewardAmt:  7.54, payStatus: "DISTRIBUTED" as const, sybilScore: 43, trend:  2, rewardToken: "SOL" },
  { rank: 5,  wallet: "AkjLP3mN8vT9bCd5KwR6Xq2Zy4Mu7Fs1nYoE8HgJpW2T", score: 55200, volume:  831000, rewardAmt:  6.62, payStatus: "DISTRIBUTED" as const, sybilScore: 38, trend:  0, rewardToken: "SOL" },
  { rank: 6,  wallet: "BpRqL7mTu4dNk3Hj9Xs2Vy5Wa8Ci6Fg0oZnJmN1De3P", score: 48600, volume:  731000, rewardAmt:  5.83, payStatus: "PENDING"     as const, sybilScore: 18, trend: -1, rewardToken: "SOL" },
  { rank: 7,  wallet: "CsJmN4pUv5eOl8Ij0Yt3Wz6Xb9Dr7Gh1qMkL2FaKe4R", score: 41900, volume:  631000, rewardAmt:  5.03, payStatus: "PENDING"     as const, sybilScore: 22, trend:  1, rewardToken: "SOL" },
  { rank: 8,  wallet: "DtKnO5qVw6fPm9Jk1Zu4Xa7Yc0Es8Gi2rNlH3GbLf5S", score: 35100, volume:  528000, rewardAmt:  4.21, payStatus: "PENDING"     as const, sybilScore:  9, trend:  0, rewardToken: "SOL" },
  { rank: 9,  wallet: "EuLoP6rWx7gQn0Kl2Av5Yb8Zd1Ft9Hj3sMmI4HcMg6T", score: 28400, volume:  427000, rewardAmt:  3.41, payStatus: "PENDING"     as const, sybilScore: 14, trend:  2, rewardToken: "SOL" },
  { rank: 10, wallet: "FvMpQ7sXy8hRo1Lm3Bw6Zc9Ae2Gu0Ik4tNnJ5IdNh7U", score: 21600, volume:  325000, rewardAmt:  2.59, payStatus: "PENDING"     as const, sybilScore:  6, trend: -2, rewardToken: "SOL" },
];

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
