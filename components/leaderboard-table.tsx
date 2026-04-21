"use client";

import { cn, formatVolume, formatReward, getRankBadge } from "@/lib/utils";
import { WalletBadge } from "./wallet-badge";
import { SybilRiskBadge } from "./sybil-risk-badge";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { EmptyState } from "./empty-state";
import { Trophy } from "lucide-react";

export interface LeaderboardRowData {
  rank: number;
  wallet: string;
  score: number;
  volume: number;
  rewardAmt: number;
  payStatus: "PENDING" | "DISTRIBUTED" | "FAILED";
  sybilScore?: number;
  trend?: number; // rank change from last epoch
  rewardToken?: string;
}

interface LeaderboardTableProps {
  rows: LeaderboardRowData[];
  loading?: boolean;
  className?: string;
}

const payStatusConfig = {
  PENDING: { label: "Pending", class: "text-amber-400" },
  DISTRIBUTED: { label: "Paid", class: "text-emerald-400" },
  FAILED: { label: "Failed", class: "text-red-400" },
};

export function LeaderboardTable({ rows, loading, className }: LeaderboardTableProps) {
  if (!loading && rows.length === 0) {
    return (
      <EmptyState
        title="No entries yet"
        description="Leaderboard will populate as traders participate in the campaign."
        icon={<Trophy className="w-6 h-6" />}
      />
    );
  }

  return (
    <div className={cn("overflow-x-auto", className)}>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-white/[0.06] text-left">
            <th className="pb-3 pr-4 text-xs font-medium text-muted-foreground w-12">Rank</th>
            <th className="pb-3 pr-4 text-xs font-medium text-muted-foreground">Wallet</th>
            <th className="pb-3 pr-4 text-xs font-medium text-muted-foreground text-right">Volume</th>
            <th className="pb-3 pr-4 text-xs font-medium text-muted-foreground text-right">Score</th>
            <th className="pb-3 pr-4 text-xs font-medium text-muted-foreground text-right">Reward</th>
            <th className="pb-3 pr-4 text-xs font-medium text-muted-foreground">Status</th>
            <th className="pb-3 text-xs font-medium text-muted-foreground">Risk</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const pay = payStatusConfig[row.payStatus];
            const isTop3 = row.rank <= 3;

            return (
              <tr key={row.wallet} className="table-row-glass">
                <td className="py-3.5 pr-4">
                  <span
                    className={cn(
                      "text-base font-bold mono",
                      row.rank === 1 && "rank-gold",
                      row.rank === 2 && "rank-silver",
                      row.rank === 3 && "rank-bronze",
                      !isTop3 && "text-muted-foreground",
                    )}
                  >
                    {getRankBadge(row.rank)}
                  </span>
                </td>
                <td className="py-3.5 pr-4">
                  <div className="flex items-center gap-2">
                    <WalletBadge address={row.wallet} showExplorer />
                    {row.trend !== undefined && row.trend !== 0 && (
                      <span
                        className={cn(
                          "flex items-center text-[10px] gap-0.5",
                          row.trend > 0 ? "text-emerald-400" : "text-red-400",
                        )}
                      >
                        {row.trend > 0 ? (
                          <TrendingUp className="w-3 h-3" />
                        ) : (
                          <TrendingDown className="w-3 h-3" />
                        )}
                        {Math.abs(row.trend)}
                      </span>
                    )}
                    {row.trend === 0 && (
                      <Minus className="w-3 h-3 text-muted-foreground" />
                    )}
                  </div>
                </td>
                <td className="py-3.5 pr-4 text-right mono text-slate-300">
                  {formatVolume(row.volume)}
                </td>
                <td className="py-3.5 pr-4 text-right mono text-slate-300">
                  {row.score.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                </td>
                <td className="py-3.5 pr-4 text-right">
                  <span className={cn("mono font-medium", isTop3 ? "text-violet-300" : "text-slate-300")}>
                    {formatReward(row.rewardAmt, row.rewardToken ?? "SOL")}
                  </span>
                </td>
                <td className="py-3.5 pr-4">
                  <span className={cn("text-xs font-medium", pay.class)}>
                    {pay.label}
                  </span>
                </td>
                <td className="py-3.5">
                  {row.sybilScore !== undefined ? (
                    <SybilRiskBadge score={row.sybilScore} size="sm" showScore={false} />
                  ) : (
                    <span className="text-muted-foreground text-xs">—</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
