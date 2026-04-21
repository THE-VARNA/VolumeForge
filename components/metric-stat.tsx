"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface MetricStatProps {
  label: string;
  value: string | number;
  subValue?: string;
  icon?: ReactNode;
  trend?: number;
  variant?: "default" | "violet" | "cyan" | "green" | "amber";
  className?: string;
  animateValue?: boolean;
}

const variantStyles = {
  default: { icon: "bg-slate-500/10 text-slate-400", badge: "text-slate-400" },
  violet: { icon: "bg-violet-500/10 text-violet-400", badge: "text-violet-400" },
  cyan: { icon: "bg-cyan-500/10 text-cyan-400", badge: "text-cyan-400" },
  green: { icon: "bg-emerald-500/10 text-emerald-400", badge: "text-emerald-400" },
  amber: { icon: "bg-amber-500/10 text-amber-400", badge: "text-amber-400" },
};

export function MetricStat({
  label,
  value,
  subValue,
  icon,
  trend,
  variant = "default",
  className,
}: MetricStatProps) {
  const styles = variantStyles[variant];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={cn(
        "glass rounded-xl p-5 flex flex-col gap-3",
        className,
      )}
    >
      <div className="flex items-start justify-between">
        <span className="text-sm text-muted-foreground font-medium">{label}</span>
        {icon && (
          <div className={cn("p-2 rounded-lg", styles.icon)}>
            {icon}
          </div>
        )}
      </div>

      <div className="flex items-end gap-2">
        <span className="text-2xl font-bold tracking-tight text-white">
          {typeof value === "number" ? value.toLocaleString() : value}
        </span>
        {trend !== undefined && (
          <span
            className={cn(
              "text-xs font-medium mb-0.5",
              trend >= 0 ? "text-emerald-400" : "text-red-400",
            )}
          >
            {trend >= 0 ? "+" : ""}
            {trend.toFixed(1)}%
          </span>
        )}
      </div>

      {subValue && (
        <span className="text-xs text-muted-foreground">{subValue}</span>
      )}
    </motion.div>
  );
}
