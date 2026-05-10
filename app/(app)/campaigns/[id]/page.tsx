"use client";

import { GlassCard } from "@/components/glass-card";
import { CampaignStatusPill } from "@/components/campaign-status-pill";
import { MetricStat } from "@/components/metric-stat";
import { RewardProgressBar } from "@/components/reward-progress-bar";
import { LeaderboardTable } from "@/components/leaderboard-table";
import { motion } from "framer-motion";
import { ArrowLeft, Zap, Trophy, Calendar, ExternalLink } from "lucide-react";
import Link from "next/link";
import { formatReward } from "@/lib/utils";

// Demo data — in production this would be fetched via /api/torque/incentives/[id]
const DEMO_CAMPAIGN = {
  id: "1",
  name: "Drift Weekly Trader Leaderboard",
  type: "LEADERBOARD" as const,
  status: "ACTIVE" as const,
  protocol: "Drift Protocol",
  programAddress: "dRiftyHA39MWEi3m9aunc5MzRF1JYuBsbn6VPcn33UH",
  torqueOfferId: "rec_drift_weekly_001",
  rewardPool: 50,
  spent: 18.4,
  participants: 892,
  formula: "RANK <= 3 ? (4 - RANK) * 10 : TOTAL_REWARD_POOL / pow(RANK, 0.5)",
  schedule: "WEEKLY",
  startDate: "2026-04-14",
  maxIterations: 12,
  source: "idl_instruction",
};

const DEMO_EPOCHS = [
  { id: "ep3", label: "Epoch 3 (current)", status: "ACTIVE", participants: 892, paid: 18.4, startDate: "Apr 14", endDate: "Apr 21" },
  { id: "ep2", label: "Epoch 2", status: "DISTRIBUTED", participants: 741, paid: 50, startDate: "Apr 7", endDate: "Apr 14" },
  { id: "ep1", label: "Epoch 1", status: "DISTRIBUTED", participants: 612, paid: 50, startDate: "Mar 31", endDate: "Apr 7" },
];

const DEMO_ROWS = [
  { wallet: "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU", rank: 1, score: 842000, volume: 1500000, rewardAmt: 10, payStatus: "DISTRIBUTED" as const, change: 0 },
  { wallet: "3fAzTkmPgK1FmBEbgQjxjSXTe9rVQ8mN2LbF4d5HmD3P", rank: 2, score: 215000, volume: 380000, rewardAmt: 7.07, payStatus: "DISTRIBUTED" as const, change: 1 },
  { wallet: "9pTBJv3HyNs7A2VqG6YkZmXeL5MrRp8CwdFbK4NvDtU1", rank: 3, score: 184000, volume: 320000, rewardAmt: 5.77, payStatus: "PENDING" as const, change: -1 },
  { wallet: "5sKJwPmN8HuT3aLdG9FbE2RqZvX6CnD4SyV7MkA1fBrQ", rank: 4, score: 95000, volume: 170000, rewardAmt: 3.53, payStatus: "PENDING" as const, change: 2 },
  { wallet: "AkjLP3mN8vT9bCd5KwR6Xq2Zy4Mu7Fs1nYoE8HgJpW2T", rank: 5, score: 72000, volume: 128000, rewardAmt: 3.16, payStatus: "PENDING" as const, change: 0 },
];

export default function CampaignDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="space-y-6 max-w-5xl">
      {/* Back + header */}
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
        <Link href="/campaigns" className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-slate-300 mb-4 transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" /> All Campaigns
        </Link>
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <p className="text-xs text-muted-foreground mb-1">{DEMO_CAMPAIGN.protocol}</p>
            <h1 className="text-2xl font-bold text-slate-100 mb-2">{DEMO_CAMPAIGN.name}</h1>
            <div className="flex gap-2 flex-wrap">
              <CampaignStatusPill status={DEMO_CAMPAIGN.status} />
              <CampaignStatusPill type={DEMO_CAMPAIGN.type} />
            </div>
          </div>
          {DEMO_CAMPAIGN.torqueOfferId && (
            <a
              href={`https://platform.torque.so`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs text-violet-400 hover:text-violet-300 transition-colors"
            >
              View on Torque <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
      </motion.div>

      {/* Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricStat label="Reward Pool" value={formatReward(DEMO_CAMPAIGN.rewardPool)} variant="violet" />
        <MetricStat label="Participants" value={DEMO_CAMPAIGN.participants.toLocaleString()} variant="cyan" />
        <MetricStat label="Distributed" value={formatReward(DEMO_CAMPAIGN.spent)} variant="green" />
        <MetricStat label="Epoch" value={DEMO_CAMPAIGN.schedule} variant="amber" />
      </div>

      {/* Config + schedule */}
      <div className="grid md:grid-cols-2 gap-4">
        <GlassCard>
          <h2 className="text-sm font-semibold text-slate-200 mb-4 flex items-center gap-2">
            <Zap className="w-4 h-4 text-violet-400" /> Configuration
          </h2>
          <dl className="space-y-2 text-sm">
            {[
              ["Source", DEMO_CAMPAIGN.source],
              ["Program", `${DEMO_CAMPAIGN.programAddress.slice(0, 12)}...`],
              ["Torque ID", DEMO_CAMPAIGN.torqueOfferId],
              ["Max Iterations", String(DEMO_CAMPAIGN.maxIterations)],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between">
                <span className="text-muted-foreground">{k}</span>
                <span className="font-mono text-slate-300 text-xs">{v}</span>
              </div>
            ))}
            <div>
              <span className="text-muted-foreground text-xs block mb-1">Formula</span>
              <p className="font-mono text-xs text-violet-300 break-all glass rounded px-2 py-1">
                {DEMO_CAMPAIGN.formula}
              </p>
            </div>
          </dl>
        </GlassCard>

        <GlassCard>
          <h2 className="text-sm font-semibold text-slate-200 mb-4 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-cyan-400" /> Epoch History
          </h2>
          <div className="space-y-2">
            {DEMO_EPOCHS.map((ep) => (
              <div key={ep.id} className="flex items-center justify-between glass rounded-lg px-3 py-2">
                <div>
                  <p className="text-xs font-medium text-slate-300">{ep.label}</p>
                  <p className="text-[10px] text-muted-foreground">{ep.startDate} → {ep.endDate}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-mono text-slate-300">{formatReward(ep.paid)}</p>
                  <span className={`text-[10px] font-medium ${ep.status === "ACTIVE" ? "text-emerald-400" : "text-slate-500"}`}>
                    {ep.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* Reward progress */}
      <GlassCard>
        <h2 className="text-sm font-semibold text-slate-200 mb-3 flex items-center gap-2">
          <Trophy className="w-4 h-4 text-amber-400" /> Current Epoch Progress
        </h2>
        <RewardProgressBar
          value={(DEMO_CAMPAIGN.spent / DEMO_CAMPAIGN.rewardPool) * 100}
          total={DEMO_CAMPAIGN.rewardPool}
          spent={DEMO_CAMPAIGN.spent}
          showLabel
        />
      </GlassCard>

      {/* Live leaderboard */}
      <GlassCard padding="none">
        <div className="p-5 pb-0">
          <h2 className="text-sm font-semibold text-slate-200 mb-1">Live Leaderboard</h2>
          <p className="text-xs text-muted-foreground mb-4">
            Via <span className="font-mono">get_epoch_leaderboard</span> (mode: preview → recipients)
          </p>
        </div>
        <LeaderboardTable rows={DEMO_ROWS} isLoading={false} />
      </GlassCard>
    </div>
  );
}
