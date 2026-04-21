import { cn } from "@/lib/utils";
import { getSybilRiskBg, getSybilRiskColor } from "@/lib/domain/anti-sybil";
import { ShieldAlert, ShieldCheck, ShieldQuestion } from "lucide-react";

interface SybilRiskBadgeProps {
  score: number;
  showScore?: boolean;
  size?: "sm" | "md";
  className?: string;
}

export function SybilRiskBadge({
  score,
  showScore = true,
  size = "md",
  className,
}: SybilRiskBadgeProps) {
  const label = score >= 70 ? "High Risk" : score >= 35 ? "Suspicious" : "Clean";
  const Icon =
    score >= 70 ? ShieldAlert : score >= 35 ? ShieldQuestion : ShieldCheck;

  const sizeClass = size === "sm" ? "text-xs px-2 py-0.5 gap-1" : "text-xs px-2.5 py-1 gap-1.5";

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border font-medium",
        getSybilRiskBg(score),
        getSybilRiskColor(score),
        sizeClass,
        className,
      )}
    >
      <Icon className={size === "sm" ? "w-3 h-3" : "w-3.5 h-3.5"} />
      {label}
      {showScore && <span className="opacity-70">({score})</span>}
    </span>
  );
}
