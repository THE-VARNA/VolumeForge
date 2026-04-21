import { cn } from "@/lib/utils";

type Status = "ACTIVE" | "DRAFT" | "PAUSED" | "ENDED";
type IncentiveType = "LEADERBOARD" | "REBATE" | "RAFFLE" | "DIRECT";

interface CampaignStatusPillProps {
  status?: Status;
  type?: IncentiveType;
  className?: string;
}

const statusConfig: Record<Status, { label: string; dot: string; bg: string; text: string }> = {
  ACTIVE: {
    label: "Active",
    dot: "bg-emerald-400 animate-pulse",
    bg: "bg-emerald-500/10 border border-emerald-500/20",
    text: "text-emerald-400",
  },
  DRAFT: {
    label: "Draft",
    dot: "bg-slate-400",
    bg: "bg-slate-500/10 border border-slate-500/20",
    text: "text-slate-400",
  },
  PAUSED: {
    label: "Paused",
    dot: "bg-amber-400",
    bg: "bg-amber-500/10 border border-amber-500/20",
    text: "text-amber-400",
  },
  ENDED: {
    label: "Ended",
    dot: "bg-slate-600",
    bg: "bg-slate-700/10 border border-slate-600/20",
    text: "text-slate-500",
  },
};

const typeConfig: Record<IncentiveType, { label: string; bg: string; text: string }> = {
  LEADERBOARD: {
    label: "Leaderboard",
    bg: "bg-violet-500/10 border border-violet-500/20",
    text: "text-violet-400",
  },
  REBATE: {
    label: "Rebate",
    bg: "bg-cyan-500/10 border border-cyan-500/20",
    text: "text-cyan-400",
  },
  RAFFLE: {
    label: "Raffle",
    bg: "bg-amber-500/10 border border-amber-500/20",
    text: "text-amber-400",
  },
  DIRECT: {
    label: "Direct",
    bg: "bg-emerald-500/10 border border-emerald-500/20",
    text: "text-emerald-400",
  },
};

export function CampaignStatusPill({ status, type, className }: CampaignStatusPillProps) {
  if (status) {
    const cfg = statusConfig[status];
    return (
      <span className={cn("pill", cfg.bg, cfg.text, className)}>
        <span className={cn("w-1.5 h-1.5 rounded-full", cfg.dot)} />
        {cfg.label}
      </span>
    );
  }
  if (type) {
    const cfg = typeConfig[type];
    return (
      <span className={cn("pill", cfg.bg, cfg.text, className)}>
        {cfg.label}
      </span>
    );
  }
  return null;
}
