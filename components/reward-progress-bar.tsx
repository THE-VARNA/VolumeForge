import { cn } from "@/lib/utils";

interface RewardProgressBarProps {
  value: number; // 0–100
  total?: number;
  spent?: number;
  label?: string;
  variant?: "violet" | "cyan" | "green" | "amber";
  showLabel?: boolean;
  className?: string;
}

const variantTrack = {
  violet: "bg-violet-500/10",
  cyan: "bg-cyan-500/10",
  green: "bg-emerald-500/10",
  amber: "bg-amber-500/10",
};

const variantFill = {
  violet: "bg-gradient-to-r from-violet-600 to-violet-400",
  cyan: "bg-gradient-to-r from-cyan-600 to-cyan-400",
  green: "bg-gradient-to-r from-emerald-600 to-emerald-400",
  amber: "bg-gradient-to-r from-amber-600 to-amber-400",
};

export function RewardProgressBar({
  value,
  total,
  spent,
  label,
  variant = "violet",
  showLabel = true,
  className,
}: RewardProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value));

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {showLabel && (label || total !== undefined) && (
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{label ?? "Reward Pool"}</span>
          {total !== undefined && spent !== undefined && (
            <span>
              {spent.toLocaleString()} / {total.toLocaleString()} spent
            </span>
          )}
          <span>{clamped.toFixed(0)}%</span>
        </div>
      )}
      <div className={cn("h-1.5 rounded-full overflow-hidden", variantTrack[variant])}>
        <div
          className={cn("h-full rounded-full transition-all duration-700", variantFill[variant])}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}
