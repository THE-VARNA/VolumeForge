"use client";

import { GlassCard } from "@/components/glass-card";
import { MetricStat } from "@/components/metric-stat";
import { WalletBadge } from "@/components/wallet-badge";
import { RewardProgressBar } from "@/components/reward-progress-bar";
import { motion } from "framer-motion";
import { Coins, CheckCircle2, Clock, XCircle, ArrowRight } from "lucide-react";
import { formatVolume, formatReward } from "@/lib/utils";
import { useWallet } from "@solana/wallet-adapter-react";
import { cn } from "@/lib/utils";

const REBATE_CLAIMS = [
  {
    wallet: "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83",
    volume: 842000,
    rebateAmt: 4.21,
    status: "PENDING" as const,
    campaign: "Jupiter 5% Trade Rebate",
    epoch: "Epoch 3",
  },
  {
    wallet: "3fAzTkmPgK1FmBEbgQjxjSXTe9rVQ8mN2",
    volume: 215000,
    rebateAmt: 1.075,
    status: "CLAIMED" as const,
    campaign: "Jupiter 5% Trade Rebate",
    epoch: "Epoch 2",
  },
  {
    wallet: "9pTBJv3HyNs7A2VqG6YkZmXeL5MrRp8Cw",
    volume: 48000,
    rebateAmt: 0,
    status: "INELIGIBLE" as const,
    campaign: "Jupiter 5% Trade Rebate",
    epoch: "Epoch 2",
  },
];

const statusConfig = {
  PENDING: { icon: Clock, label: "Claimable", color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20" },
  CLAIMED: { icon: CheckCircle2, label: "Claimed", color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" },
  INELIGIBLE: { icon: XCircle, label: "Ineligible", color: "text-slate-500", bg: "bg-slate-700/10 border-slate-600/20" },
};

export default function RebatePage() {
  const { connected } = useWallet();

  return (
    <div className="space-y-6 max-w-4xl">
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
          <Coins className="w-6 h-6 text-cyan-400" />
          Rebate Claims
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Formula: VALUE × (rebatePercentage / 100) — calculated each epoch by Torque
        </p>
      </motion.div>

      <div className="grid grid-cols-3 gap-4">
        <MetricStat label="Claimable Rebates" value="4.21 SOL" variant="cyan" />
        <MetricStat label="Total Claimed" value="1.075 SOL" variant="green" />
        <MetricStat label="Qualifying Volume" value="$1.1M" variant="violet" />
      </div>

      {!connected && (
        <GlassCard variant="violet" className="text-center py-8">
          <p className="text-slate-300 mb-4">Connect your wallet to check rebate eligibility</p>
          <p className="text-sm text-muted-foreground">
            Eligibility is verified against the active Torque campaign results
          </p>
        </GlassCard>
      )}

      <GlassCard>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-sm font-semibold text-slate-200">Rebate History</h2>
          <span className="text-xs text-muted-foreground">Jupiter 5% Rebate Campaign</span>
        </div>

        <div className="flex flex-col gap-3">
          {REBATE_CLAIMS.map((claim, i) => {
            const cfg = statusConfig[claim.status];
            const Icon = cfg.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
                className="glass rounded-xl p-5"
              >
                <div className="flex items-start justify-between mb-4 flex-wrap gap-3">
                  <div>
                    <WalletBadge address={claim.wallet} showExplorer size="md" />
                    <p className="text-xs text-muted-foreground mt-1">
                      {claim.campaign} · {claim.epoch}
                    </p>
                  </div>
                  <span
                    className={cn(
                      "pill border text-xs",
                      cfg.bg,
                      cfg.color,
                    )}
                  >
                    <Icon className="w-3 h-3" />
                    {cfg.label}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Volume Traded</p>
                    <p className="text-base font-semibold mono text-slate-200">
                      {formatVolume(claim.volume)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Rebate Amount</p>
                    <p
                      className={cn(
                        "text-base font-semibold mono",
                        claim.status === "INELIGIBLE"
                          ? "text-slate-500"
                          : "text-emerald-400",
                      )}
                    >
                      {claim.status === "INELIGIBLE"
                        ? "—"
                        : formatReward(claim.rebateAmt)}
                    </p>
                  </div>
                </div>

                {claim.status !== "INELIGIBLE" && (
                  <RewardProgressBar
                    value={claim.status === "CLAIMED" ? 100 : 80}
                    variant="cyan"
                    label={claim.status === "CLAIMED" ? "Distributed" : "Ready to claim"}
                    showLabel
                  />
                )}

                {claim.status === "PENDING" && (
                  <button className="mt-4 w-full py-2.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-medium transition-colors flex items-center justify-center gap-2">
                    Claim {formatReward(claim.rebateAmt)}
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </motion.div>
            );
          })}
        </div>
      </GlassCard>
    </div>
  );
}
