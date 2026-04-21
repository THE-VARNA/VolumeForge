"use client";

import Link from "next/link";
import { GlassCard } from "@/components/glass-card";
import { CampaignStatusPill } from "@/components/campaign-status-pill";
import { RewardProgressBar } from "@/components/reward-progress-bar";
import { MetricStat } from "@/components/metric-stat";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { formatReward } from "@/lib/utils";

const CAMPAIGNS = [
  {
    id: "1", name: "Drift Weekly Trader Leaderboard",
    type: "LEADERBOARD" as const, status: "ACTIVE" as const,
    rewardPool: 50, spent: 18.4, participants: 892, protocol: "Drift Protocol",
  },
  {
    id: "2", name: "Jupiter 5% Trade Rebate",
    type: "REBATE" as const, status: "ACTIVE" as const,
    rewardPool: 100, spent: 43.2, participants: 1204, protocol: "Jupiter",
  },
  {
    id: "3", name: "Raydium Epoch 3 Raffle",
    type: "RAFFLE" as const, status: "PAUSED" as const,
    rewardPool: 30, spent: 30, participants: 451, protocol: "Raydium",
  },
  {
    id: "4", name: "Partner Direct Payouts",
    type: "DIRECT" as const, status: "ENDED" as const,
    rewardPool: 20, spent: 20, participants: 8, protocol: "Internal",
  },
];

export default function CampaignsPage() {
  return (
    <div className="space-y-6 max-w-5xl">
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Campaigns</h1>
          <p className="text-sm text-muted-foreground mt-0.5">All Torque recurring incentives</p>
        </div>
        <Link href="/campaigns/new"
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium transition-colors">
          <Plus className="w-3.5 h-3.5" /> New Campaign
        </Link>
      </motion.div>

      <div className="grid grid-cols-4 gap-4">
        <MetricStat label="Total Campaigns" value={CAMPAIGNS.length} variant="violet" />
        <MetricStat label="Active" value={CAMPAIGNS.filter(c => c.status === "ACTIVE").length} variant="green" />
        <MetricStat label="Total Reward Pool" value="200 SOL" variant="cyan" />
        <MetricStat label="Total Participants" value="2,555" variant="amber" />
      </div>

      <div className="flex flex-col gap-4">
        {CAMPAIGNS.map((c, i) => (
          <motion.div key={c.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <GlassCard variant="hover" padding="none">
              <Link href={`/campaigns/${c.id}`} className="block p-5">
                <div className="flex items-start justify-between mb-4 gap-4 flex-wrap">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">{c.protocol}</p>
                    <h3 className="font-semibold text-slate-200 mb-2">{c.name}</h3>
                    <div className="flex gap-2 flex-wrap">
                      <CampaignStatusPill status={c.status} />
                      <CampaignStatusPill type={c.type} />
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xs text-muted-foreground">Reward Pool</p>
                    <p className="text-lg font-bold mono text-slate-200">{formatReward(c.rewardPool)}</p>
                    <p className="text-xs text-muted-foreground">{c.participants.toLocaleString()} traders</p>
                  </div>
                </div>
                <RewardProgressBar
                  value={(c.spent / c.rewardPool) * 100}
                  total={c.rewardPool}
                  spent={c.spent}
                  showLabel
                />
              </Link>
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
