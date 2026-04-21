"use client";

import { cn, formatRelativeTime, formatVolume, shortAddress } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpDown, Zap, Gift, Users } from "lucide-react";

interface FeedEvent {
  id: string;
  type: "trade" | "custom" | "reward" | "raffle";
  wallet: string;
  eventName: string;
  amountUsd?: number | null;
  timestamp: Date | string;
  programId?: string;
  data?: Record<string, unknown>;
}

interface ActivityTimelineProps {
  events: FeedEvent[];
  maxItems?: number;
  className?: string;
}

const eventConfig = {
  trade: {
    icon: ArrowUpDown,
    color: "text-cyan-400",
    bg: "bg-cyan-500/10",
    border: "border-cyan-500/20",
    label: "Trade",
  },
  custom: {
    icon: Zap,
    color: "text-violet-400",
    bg: "bg-violet-500/10",
    border: "border-violet-500/20",
    label: "Event",
  },
  reward: {
    icon: Gift,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    label: "Reward",
  },
  raffle: {
    icon: Users,
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    label: "Raffle",
  },
};

export function ActivityTimeline({
  events,
  maxItems = 50,
  className,
}: ActivityTimelineProps) {
  const displayed = events.slice(0, maxItems);

  return (
    <div className={cn("flex flex-col gap-0", className)}>
      <AnimatePresence initial={false}>
        {displayed.map((event, i) => {
          const cfg = eventConfig[event.type];
          const Icon = cfg.icon;

          return (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 8 }}
              transition={{ duration: 0.2, delay: i * 0.02 }}
              className="flex gap-3 py-3 border-b border-white/[0.04] last:border-0 group"
            >
              {/* Icon */}
              <div
                className={cn(
                  "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 border",
                  cfg.bg,
                  cfg.border,
                )}
              >
                <Icon className={cn("w-3.5 h-3.5", cfg.color)} />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={cn("text-xs font-medium pill px-1.5 py-0.5", cfg.bg, cfg.color, "border", cfg.border)}>
                    {event.eventName}
                  </span>
                  <span className="text-xs text-muted-foreground font-mono">
                    {shortAddress(event.wallet)}
                  </span>
                  {event.amountUsd != null && (
                    <span className="text-xs font-medium text-slate-300 mono">
                      {formatVolume(event.amountUsd)}
                    </span>
                  )}
                </div>
                {event.programId && (
                  <p className="text-[10px] text-muted-foreground mt-0.5 font-mono truncate">
                    Program: {shortAddress(event.programId, 6)}
                  </p>
                )}
              </div>

              {/* Timestamp */}
              <span className="text-[10px] text-muted-foreground flex-shrink-0 mt-0.5">
                {formatRelativeTime(event.timestamp)}
              </span>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
