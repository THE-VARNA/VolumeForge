"use client";

import { GlassCard } from "@/components/glass-card";
import { motion } from "framer-motion";
import { FileText, AlertTriangle, Info, CheckCircle } from "lucide-react";

const FRICTION_ITEMS = [
  {
    type: "bug",
    title: "preview_incentive_query not in IDL pipeline docs",
    detail:
      "The IDL doc states the pipeline as parse_idl → create_idl → generate_incentive_query → create_recurring_incentive. But the incentives doc mentions preview_incentive_query as a 'creation-time test tool'. Whether to include it is ambiguous — we treat it as optional.",
    icon: AlertTriangle,
    color: "text-amber-400",
    bg: "bg-amber-500/10 border-amber-500/20",
  },
  {
    type: "confusion",
    title: "4 MCP types vs 6 primitives on torque.so",
    detail:
      "The public site lists leaderboards, raffles, rebates, gifts, referrals, and 'custom loops'. The MCP reference documents only 4 incentive types. Gifts and referrals cannot be created via MCP. This creates narrative risk when demoing — we built a referral widget backed by a custom event instead.",
    icon: Info,
    color: "text-blue-400",
    bg: "bg-blue-500/10 border-blue-500/20",
  },
  {
    type: "pain",
    title: "userPubkey exclusion from custom event schema is easy to miss",
    detail:
      "The docs state 'userPubkey (wallet address) is always required as a top-level property when sending events — it is not part of the event schema you define here.' This is a subtle but critical distinction. Getting it wrong causes the event to silently fail or be rejected at ingestion.",
    icon: AlertTriangle,
    color: "text-red-400",
    bg: "bg-red-500/10 border-red-500/20",
  },
  {
    type: "gotcha",
    title: "evalDurationDays XOR interval — not documented in the example",
    detail:
      "The reference doc says 'Provide either evalDurationDays or interval, not both.' However, the guided create-incentive example only shows interval. Builders who follow the example may never discover evalDurationDays exists. The XOR rule should be surfaced more prominently.",
    icon: Info,
    color: "text-cyan-400",
    bg: "bg-cyan-500/10 border-cyan-500/20",
  },
  {
    type: "feedback",
    title: "create_api_key key is shown once — no way to retrieve it",
    detail:
      "The docs say 'The key is shown once upon creation and cannot be retrieved later. Copy it immediately.' This is standard security practice, but missing from the MCP workflow description. Builders should be warned at the point of key creation, not at the point of failure.",
    icon: Info,
    color: "text-violet-400",
    bg: "bg-violet-500/10 border-violet-500/20",
  },
  {
    type: "working",
    title: "IDL instruction limits well-documented",
    detail:
      "Instructions are limited to 15 numbers, 15 strings, 10 booleans, and 30 accounts. This is documented clearly and was easy to implement validation for. No friction here.",
    icon: CheckCircle,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10 border-emerald-500/20",
  },
  {
    type: "feedback",
    title: "No documented endpoint path conventions",
    detail:
      "The MCP tool names (create_recurring_incentive, list_idls, etc.) are clear, but the underlying REST endpoint paths are not public. We inferred /incentives/recurring, /idl, /query/generate etc. from naming patterns. Published REST schemas would eliminate guesswork.",
    icon: AlertTriangle,
    color: "text-amber-400",
    bg: "bg-amber-500/10 border-amber-500/20",
  },
];

export default function FrictionLogPage() {
  return (
    <div className="space-y-6 max-w-4xl">
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
          <FileText className="w-6 h-6 text-slate-400" /> Friction Log
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Honest builder notes for the Torque team — what was confusing, what was smooth
        </p>
      </motion.div>

      <GlassCard variant="violet" padding="sm">
        <p className="text-sm text-slate-300">
          This log was written as we built VolumeForge against the official Torque MCP docs. 
          Every entry is actionable feedback, not a complaint. Priority: docs accuracy first, 
          then ergonomics, then missing features.
        </p>
      </GlassCard>

      <div className="flex flex-col gap-4">
        {FRICTION_ITEMS.map((item, i) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <GlassCard>
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg border flex-shrink-0 ${item.bg}`}>
                    <Icon className={`w-4 h-4 ${item.color}`} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <h3 className="text-sm font-semibold text-slate-200">{item.title}</h3>
                      <span className={`pill text-[10px] ${item.bg} ${item.color} border`}>
                        {item.type}
                      </span>
                    </div>
                    <p className="text-sm text-slate-400 leading-relaxed">{item.detail}</p>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
