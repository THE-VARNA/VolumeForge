"use client";

import { GlassCard } from "@/components/glass-card";
import { MetricStat } from "@/components/metric-stat";
import { WalletBadge } from "@/components/wallet-badge";
import { motion } from "framer-motion";
import {
  Ticket, Timer, Trophy, Star,
} from "lucide-react";
import { formatReward } from "@/lib/utils";

// Raffle buckets — matches Torque [{amount, count}] format
const RAFFLE_BUCKETS = [
  { amount: 10, count: 1, label: "Grand Prize", color: "text-yellow-400", bg: "bg-yellow-500/10 border-yellow-500/20" },
  { amount: 5, count: 5, label: "2nd Tier", color: "text-slate-300", bg: "bg-slate-500/10 border-slate-500/20" },
  { amount: 1, count: 20, label: "3rd Tier", color: "text-amber-600", bg: "bg-amber-700/10 border-amber-700/20" },
];

const WINNERS = [
  { wallet: "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83", prize: 10, epoch: "Epoch 2", drawnAt: "Apr 14" },
  { wallet: "3fAzTkmPgK1FmBEbgQjxjSXTe9rVQ8mN2", prize: 5, epoch: "Epoch 2", drawnAt: "Apr 14" },
  { wallet: "9pTBJv3HyNs7A2VqG6YkZmXeL5MrRp8Cw", prize: 5, epoch: "Epoch 2", drawnAt: "Apr 14" },
];

const COUNTDOWN = { days: 2, hours: 14, minutes: 23, seconds: 41 };

export default function RafflePage() {
  const totalFund = RAFFLE_BUCKETS.reduce((s, b) => s + b.amount * b.count, 0);
  const totalWinners = RAFFLE_BUCKETS.reduce((s, b) => s + b.count, 0);

  return (
    <div className="space-y-6 max-w-5xl">
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
          <Ticket className="w-6 h-6 text-amber-400" />
          Raffle Center
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Weighted random draws — higher volume earns more tickets (WEIGHTED_BY_METRIC)
        </p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <MetricStat label="Total Prize Pool" value={`${totalFund} SOL`} variant="amber" />
        <MetricStat label="Total Winners" value={totalWinners} variant="violet" />
        <MetricStat label="Eligible Wallets" value="451" variant="cyan" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Countdown */}
        <GlassCard variant="violet">
          <div className="flex items-center gap-2 mb-5">
            <Timer className="w-4 h-4 text-violet-400" />
            <h2 className="text-sm font-semibold text-slate-200">Next Draw In</h2>
          </div>
          <div className="grid grid-cols-4 gap-3 mb-6">
            {Object.entries(COUNTDOWN).map(([unit, val]) => (
              <div key={unit} className="glass rounded-xl p-4 text-center">
                <p className="text-3xl font-bold mono text-white">{String(val).padStart(2, "0")}</p>
                <p className="text-[10px] text-muted-foreground mt-1 capitalize">{unit}</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">
            Raffle weighting: <span className="text-violet-300">WEIGHTED_BY_METRIC</span> — 
            your ticket count equals your trade volume score. Top traders get proportionally more chances.
          </p>
        </GlassCard>

        {/* Prize Buckets */}
        <GlassCard>
          <div className="flex items-center gap-2 mb-5">
            <Trophy className="w-4 h-4 text-amber-400" />
            <h2 className="text-sm font-semibold text-slate-200">Prize Buckets</h2>
          </div>
          <div className="flex flex-col gap-3">
            {RAFFLE_BUCKETS.map((bucket) => (
              <div
                key={bucket.label}
                className={`flex items-center justify-between p-4 rounded-lg border ${bucket.bg}`}
              >
                <div className="flex items-center gap-3">
                  <Star className={`w-4 h-4 ${bucket.color}`} />
                  <div>
                    <p className={`text-sm font-semibold ${bucket.color}`}>{bucket.label}</p>
                    <p className="text-xs text-muted-foreground">{bucket.count} winner{bucket.count > 1 ? "s" : ""}</p>
                  </div>
                </div>
                <span className={`text-lg font-bold mono ${bucket.color}`}>
                  {formatReward(bucket.amount)}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-white/[0.06] flex justify-between text-xs">
            <span className="text-muted-foreground">Total fund</span>
            <span className="font-semibold mono text-slate-200">{formatReward(totalFund)}</span>
          </div>
        </GlassCard>
      </div>

      {/* Winner history */}
      <GlassCard>
        <h2 className="text-sm font-semibold text-slate-200 mb-4">Winner History</h2>
        <div className="flex flex-col gap-2">
          {WINNERS.map((w, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-3.5 glass rounded-lg"
            >
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-xs font-bold text-amber-400">
                  {i + 1}
                </span>
                <WalletBadge address={w.wallet} showExplorer />
              </div>
              <div className="flex items-center gap-6">
                <span className="text-xs text-muted-foreground">{w.epoch} · {w.drawnAt}</span>
                <span className="text-sm font-semibold mono text-emerald-400">
                  +{formatReward(w.prize)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}
