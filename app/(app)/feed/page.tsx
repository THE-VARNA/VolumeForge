"use client";

import { useState } from "react";
import { GlassCard } from "@/components/glass-card";
import { ActivityTimeline } from "@/components/activity-timeline";
import { motion } from "framer-motion";
import { Activity, Filter } from "lucide-react";

const EVENT_TYPES = ["all", "trade", "custom", "reward", "raffle"] as const;

const DEMO_EVENTS = [
  {
    id: "1", type: "trade" as const, wallet: "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83",
    eventName: "swap", amountUsd: 84200, timestamp: new Date(Date.now() - 45000),
    programId: "dRiftyHA39MWEi3m9aunc5MzRF1JYuBsbn6VPcn33UH",
  },
  {
    id: "2", type: "custom" as const, wallet: "3fAzTkmPgK1FmBEbgQjxjSXTe9rVQ8mN2",
    eventName: "referral_click", amountUsd: null, timestamp: new Date(Date.now() - 120000),
    data: { referrerCode: "DRIFT2026", referee: "9pTBJv3H..." },
  },
  {
    id: "3", type: "reward" as const, wallet: "9pTBJv3HyNs7A2VqG6YkZmXeL5MrRp8Cw",
    eventName: "rebate_distributed", amountUsd: 1240, timestamp: new Date(Date.now() - 300000),
  },
  {
    id: "4", type: "trade" as const, wallet: "5sKJwPmN8HuT3aLdG9FbE2RqZvX6CnD4",
    eventName: "perp_open", amountUsd: 215000, timestamp: new Date(Date.now() - 480000),
    programId: "dRiftyHA39MWEi3m9aunc5MzRF1JYuBsbn6VPcn33UH",
  },
  {
    id: "5", type: "raffle" as const, wallet: "AkjLP3mN8vT9bCd5KwR6Xq2Zy4Mu7Fs1n",
    eventName: "raffle_entry", amountUsd: null, timestamp: new Date(Date.now() - 600000),
    data: { tickets: 42, campaignId: "c2" },
  },
  {
    id: "6", type: "custom" as const, wallet: "BpRqL7mTu4dNk3Hj9Xs2Vy5Wa8Ci6Fg0o",
    eventName: "signup_bonus", amountUsd: null, timestamp: new Date(Date.now() - 900000),
    data: { source: "twitter" },
  },
  {
    id: "7", type: "trade" as const, wallet: "CsJmN4pUv5eOl8Ij0Yt3Wz6Xb9Dr7Gh1q",
    eventName: "swap", amountUsd: 620000, timestamp: new Date(Date.now() - 1200000),
    programId: "JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QDFXesTg",
  },
  {
    id: "8", type: "reward" as const, wallet: "DtKnO5qVw6fPm9Jk1Zu4Xa7Yc0Es8Gi2r",
    eventName: "leaderboard_reward", amountUsd: 8400, timestamp: new Date(Date.now() - 1800000),
  },
];

export default function FeedPage() {
  const [activeType, setActiveType] = useState<typeof EVENT_TYPES[number]>("all");
  const [walletFilter, setWalletFilter] = useState("");

  const filtered = DEMO_EVENTS.filter((e) => {
    if (activeType !== "all" && e.type !== activeType) return false;
    if (walletFilter && !e.wallet.toLowerCase().includes(walletFilter.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-6 max-w-4xl">
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
          <Activity className="w-6 h-6 text-cyan-400" />
          Activity Feed
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Live stream of onchain trades, Torque custom events, and reward distributions
        </p>
      </motion.div>

      {/* Filters */}
      <GlassCard padding="sm">
        <div className="flex items-center gap-3 flex-wrap">
          {/* Type filter */}
          <div className="flex gap-1 flex-wrap">
            {EVENT_TYPES.map((t) => (
              <button
                key={t}
                onClick={() => setActiveType(t)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${activeType === t
                    ? "bg-violet-500/20 border border-violet-500/30 text-violet-300"
                    : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
                  }`}
              >
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>

          <div className="flex-1" />

          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <input
              value={walletFilter}
              onChange={(e) => setWalletFilter(e.target.value)}
              placeholder="Filter by wallet..."
              className="pl-8 pr-4 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-slate-200 placeholder:text-muted-foreground outline-none focus:border-violet-500/50 transition-colors w-48"
            />
          </div>
        </div>
      </GlassCard>

      {/* Feed */}
      <GlassCard>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-slate-200">
            {filtered.length} events
          </h2>
          <span className="flex items-center gap-1.5 text-xs text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Live
          </span>
        </div>
        <ActivityTimeline events={filtered} maxItems={50} />
      </GlassCard>
    </div>
  );
}
