"use client";

import { MetricStat } from "@/components/metric-stat";
import { GlassCard } from "@/components/glass-card";
import { ActivityTimeline } from "@/components/activity-timeline";
import { ROIChart } from "@/components/roi-chart";
import { CampaignStatusPill } from "@/components/campaign-status-pill";
import { SybilRiskBadge } from "@/components/sybil-risk-badge";
import { RewardProgressBar } from "@/components/reward-progress-bar";
import { motion } from "framer-motion";
import {
  DollarSign, Users, TrendingUp, Zap, ArrowRight, Shield,
} from "lucide-react";
import Link from "next/link";

// Demo data — seeded values for dashboard display
const DEMO_METRICS = [
  {
    label: "Total Volume (7d)",
    value: "$4.2M",
    subValue: "Across 3 active campaigns",
    icon: <DollarSign className="w-4 h-4" />,
    trend: 18.4,
    variant: "violet" as const,
  },
  {
    label: "Active Traders",
    value: "2,847",
    subValue: "+312 this epoch",
    icon: <Users className="w-4 h-4" />,
    trend: 12.1,
    variant: "cyan" as const,
  },
  {
    label: "Rewards Distributed",
    value: "142.8 SOL",
    subValue: "Current epoch",
    icon: <Zap className="w-4 h-4" />,
    trend: 5.6,
    variant: "green" as const,
  },
  {
    label: "Campaign ROI",
    value: "3.8×",
    subValue: "Volume per reward SOL",
    icon: <TrendingUp className="w-4 h-4" />,
    trend: 2.3,
    variant: "amber" as const,
  },
];

const CHART_DATA = Array.from({ length: 7 }, (_, i) => {
  const date = new Date();
  date.setDate(date.getDate() - (6 - i));
  return {
    date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    volume: 400000 + Math.random() * 800000,
    rewards: 8000 + Math.random() * 20000,
    participants: 200 + Math.floor(Math.random() * 400),
  };
});

const DEMO_CAMPAIGNS = [
  {
    id: "1",
    name: "Drift Weekly Trader Leaderboard",
    type: "LEADERBOARD" as const,
    status: "ACTIVE" as const,
    rewardPool: 50,
    spent: 18.4,
    participants: 892,
  },
  {
    id: "2",
    name: "Jupiter 5% Trade Rebate",
    type: "REBATE" as const,
    status: "ACTIVE" as const,
    rewardPool: 100,
    spent: 43.2,
    participants: 1204,
  },
  {
    id: "3",
    name: "Raydium Raffle — Epoch 3",
    type: "RAFFLE" as const,
    status: "PAUSED" as const,
    rewardPool: 30,
    spent: 30,
    participants: 451,
  },
];

const DEMO_FEED = [
  {
    id: "1",
    type: "trade" as const,
    wallet: "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
    eventName: "swap",
    amountUsd: 84200,
    timestamp: new Date(Date.now() - 45000),
    programId: "dRiftyHA39MWEi3m9aunc5MzRF1JYuBsbn6VPcn33UH",
  },
  {
    id: "2",
    type: "custom" as const,
    wallet: "3fAzTkmPgK1FmBEbgQjxjSXTe9rVQ8mN2LbF4d5HmD3P",
    eventName: "referral_click",
    amountUsd: null,
    timestamp: new Date(Date.now() - 120000),
  },
  {
    id: "3",
    type: "reward" as const,
    wallet: "9pTBJv3HyNs7A2VqG6YkZmXeL5MrRp8CwdFbK4NvDtU",
    eventName: "rebate_distributed",
    amountUsd: 1240,
    timestamp: new Date(Date.now() - 300000),
  },
  {
    id: "4",
    type: "trade" as const,
    wallet: "5sKJwPmN8HuT3aLdG9FbE2RqZvX6CnD4SyV7MkA1fBr",
    eventName: "perp_open",
    amountUsd: 215000,
    timestamp: new Date(Date.now() - 480000),
    programId: "dRiftyHA39MWEi3m9aunc5MzRF1JYuBsbn6VPcn33UH",
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Live campaign performance and reward metrics
          </p>
        </div>
        <div className="flex items-center gap-2">
          <SybilRiskBadge score={12} />
          <Link
            href="/campaigns/new"
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg glass hover:bg-white/5 text-sm text-slate-300 transition-colors"
          >
            <Zap className="w-3.5 h-3.5 text-violet-400" />
            New Campaign
          </Link>
        </div>
      </motion.div>

      {/* Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {DEMO_METRICS.map((m) => (
          <MetricStat key={m.label} {...m} />
        ))}
      </div>

      {/* Chart + Feed */}
      <div className="grid lg:grid-cols-3 gap-4">
        {/* ROI Chart */}
        <GlassCard className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-semibold text-slate-200">Volume & Rewards (7d)</h2>
              <p className="text-xs text-muted-foreground mt-0.5">Daily breakdown across campaigns</p>
            </div>
            <span className="pill bg-violet-500/10 border border-violet-500/20 text-violet-400">
              Live
            </span>
          </div>
          <ROIChart data={CHART_DATA} />
        </GlassCard>

        {/* Activity Feed */}
        <GlassCard padding="none" className="overflow-hidden">
          <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-white/[0.06]">
            <h2 className="text-sm font-semibold text-slate-200">Live Activity</h2>
            <Link href="/feed" className="text-xs text-violet-400 hover:text-violet-300 flex items-center gap-1">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="px-5 py-2 overflow-y-auto max-h-56">
            <ActivityTimeline events={DEMO_FEED} maxItems={10} />
          </div>
        </GlassCard>
      </div>

      {/* Campaign overview */}
      <GlassCard>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-sm font-semibold text-slate-200">Active Campaigns</h2>
          <Link href="/campaigns" className="text-xs text-violet-400 hover:text-violet-300 flex items-center gap-1">
            Manage all <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="flex flex-col gap-4">
          {DEMO_CAMPAIGNS.map((c) => (
            <div key={c.id} className="flex items-center gap-4 p-4 glass rounded-lg">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span className="text-sm font-medium text-slate-200 truncate">{c.name}</span>
                  <CampaignStatusPill status={c.status} />
                  <CampaignStatusPill type={c.type} />
                </div>
                <RewardProgressBar
                  value={(c.spent / c.rewardPool) * 100}
                  total={c.rewardPool}
                  spent={c.spent}
                  showLabel
                  label={`${c.participants.toLocaleString()} traders`}
                />
              </div>
              <Link
                href={`/campaigns/${c.id}`}
                className="text-muted-foreground hover:text-slate-300 transition-colors"
              >
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Sybil risk summary */}
      <GlassCard variant="cyan" padding="sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
            <Shield className="w-5 h-5 text-cyan-400" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-slate-200">Anti-Sybil Engine Active</h3>
            <p className="text-xs text-muted-foreground">
              14 wallets flagged this epoch · 3 HIGH_RISK excluded from rewards · Network risk score: 12/100
            </p>
          </div>
          <Link href="/settings" className="text-xs text-cyan-400 hover:text-cyan-300 whitespace-nowrap">
            Configure rules →
          </Link>
        </div>
      </GlassCard>
    </div>
  );
}
